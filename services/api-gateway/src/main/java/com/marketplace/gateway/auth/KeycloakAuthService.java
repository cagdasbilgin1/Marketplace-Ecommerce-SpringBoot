package com.marketplace.gateway.auth;

import com.marketplace.gateway.auth.dto.AuthResponse;
import com.marketplace.gateway.auth.dto.LoginRequest;
import com.marketplace.gateway.auth.dto.LogoutRequest;
import com.marketplace.gateway.auth.dto.RefreshTokenRequest;
import com.marketplace.gateway.auth.dto.SignupRequest;
import java.net.URI;
import java.util.List;
import java.util.Map;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

@Service
class KeycloakAuthService {

    private static final ParameterizedTypeReference<List<Map<String, Object>>> USER_LIST_TYPE =
            new ParameterizedTypeReference<>() {
            };

    private final MarketplaceAuthProperties properties;
    private final WebClient webClient;

    KeycloakAuthService(MarketplaceAuthProperties properties, WebClient.Builder webClientBuilder) {
        this.properties = properties;
        this.webClient = webClientBuilder
                .baseUrl(properties.keycloakUrl())
                .build();
    }

    Mono<AuthResponse> login(LoginRequest request) {
        validateLoginRequest(request);

        MultiValueMap<String, String> form = tokenForm("password");
        form.add("username", request.username().trim());
        form.add("password", request.password());

        return exchangeToken(form);
    }

    Mono<AuthResponse> refresh(RefreshTokenRequest request) {
        if (request == null || isBlank(request.refreshToken())) {
            return Mono.error(new ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Refresh token gereklidir."));
        }

        MultiValueMap<String, String> form = tokenForm("refresh_token");
        form.add("refresh_token", request.refreshToken());

        return exchangeToken(form);
    }

    Mono<Void> logout(LogoutRequest request) {
        if (request == null || isBlank(request.refreshToken())) {
            return Mono.empty();
        }

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("client_id", properties.publicClientId());
        form.add("refresh_token", request.refreshToken());

        return webClient.post()
                .uri(realmPath("/protocol/openid-connect/logout"))
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(form))
                .exchangeToMono(response -> {
                    if (response.statusCode().is2xxSuccessful() || response.statusCode().value() == 204) {
                        return Mono.empty();
                    }

                    return errorFromResponse(response, "Oturum kapatilamadi.").flatMap(Mono::error);
                });
    }

    Mono<AuthResponse> signup(SignupRequest request) {
        validateSignupRequest(request);

        return adminAccessToken()
                .flatMap(token -> createUser(token, request)
                        .flatMap(userId -> assignCustomerRole(token, userId)))
                .then(login(new LoginRequest(request.username(), request.password())));
    }

    private Mono<AuthResponse> exchangeToken(MultiValueMap<String, String> form) {
        return webClient.post()
                .uri(realmPath("/protocol/openid-connect/token"))
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(form))
                .retrieve()
                .onStatus(HttpStatusCode::isError, response -> errorFromResponse(response, "Kimlik dogrulama basarisiz oldu."))
                .bodyToMono(AuthResponse.class);
    }

    private Mono<String> adminAccessToken() {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("client_id", properties.adminClientId());
        form.add("grant_type", "password");
        form.add("username", properties.adminUsername());
        form.add("password", properties.adminPassword());

        return webClient.post()
                .uri("/realms/" + properties.adminRealm() + "/protocol/openid-connect/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(form))
                .retrieve()
                .onStatus(HttpStatusCode::isError, response -> errorFromResponse(response, "Keycloak admin token alinamadi."))
                .bodyToMono(AuthResponse.class)
                .map(AuthResponse::accessToken);
    }

    private Mono<String> createUser(String adminAccessToken, SignupRequest request) {
        Map<String, Object> payload = Map.of(
                "username", request.username().trim(),
                "email", request.email().trim().toLowerCase(),
                "firstName", request.firstName().trim(),
                "lastName", request.lastName().trim(),
                "enabled", true,
                "credentials", List.of(Map.of(
                        "type", "password",
                        "value", request.password(),
                        "temporary", false
                ))
        );

        return webClient.post()
                .uri(adminRealmPath("/users"))
                .header(HttpHeaders.AUTHORIZATION, bearer(adminAccessToken))
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(payload)
                .exchangeToMono(response -> {
                    if (response.statusCode().value() == 201) {
                        String location = response.headers().asHttpHeaders().getFirst(HttpHeaders.LOCATION);
                        if (location != null && !location.isBlank()) {
                            return Mono.just(extractUserId(location));
                        }

                        return findUserIdByUsername(adminAccessToken, request.username().trim());
                    }

                    return errorFromResponse(response, "Kayit olusturulamadi.").flatMap(Mono::error);
                });
    }

    private Mono<String> findUserIdByUsername(String adminAccessToken, String username) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path(adminRealmPath("/users"))
                        .queryParam("username", username)
                        .queryParam("exact", true)
                        .build())
                .header(HttpHeaders.AUTHORIZATION, bearer(adminAccessToken))
                .retrieve()
                .onStatus(HttpStatusCode::isError, response -> errorFromResponse(response, "Olusan kullanici bulunamadi."))
                .bodyToMono(USER_LIST_TYPE)
                .flatMap(users -> users.stream()
                        .map(user -> user.get("id"))
                        .filter(String.class::isInstance)
                        .map(String.class::cast)
                        .findFirst()
                        .map(Mono::just)
                        .orElseGet(() -> Mono.error(new ResponseStatusException(org.springframework.http.HttpStatus.BAD_GATEWAY, "Keycloak kullanici id donmedi."))));
    }

    private Mono<Void> assignCustomerRole(String adminAccessToken, String userId) {
        return realmRole(adminAccessToken)
                .flatMap(role -> webClient.post()
                        .uri(adminRealmPath("/users/" + userId + "/role-mappings/realm"))
                        .header(HttpHeaders.AUTHORIZATION, bearer(adminAccessToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(List.of(role))
                        .exchangeToMono(response -> {
                            if (response.statusCode().is2xxSuccessful() || response.statusCode().value() == 204) {
                                return Mono.empty();
                            }

                            return errorFromResponse(response, "Kullanici rolu atanamadi.").flatMap(Mono::error);
                        }));
    }

    private Mono<Map<String, Object>> realmRole(String adminAccessToken) {
        return webClient.get()
                .uri(adminRealmPath("/roles/" + properties.customerRole()))
                .header(HttpHeaders.AUTHORIZATION, bearer(adminAccessToken))
                .retrieve()
                .onStatus(HttpStatusCode::isError, response -> errorFromResponse(response, "Musteri rolu bulunamadi."))
                .bodyToMono(new ParameterizedTypeReference<>() {
                });
    }

    private MultiValueMap<String, String> tokenForm(String grantType) {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("client_id", properties.publicClientId());
        form.add("grant_type", grantType);
        form.add("scope", "openid offline_access");
        return form;
    }

    private String realmPath(String suffix) {
        return "/realms/" + properties.realm() + suffix;
    }

    private String adminRealmPath(String suffix) {
        return "/admin/realms/" + properties.realm() + suffix;
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }

    private String extractUserId(String location) {
        return URI.create(location).getPath().replaceAll(".*/", "");
    }

    private Mono<? extends Throwable> errorFromResponse(ClientResponse response, String fallbackMessage) {
        return response.bodyToMono(String.class)
                .defaultIfEmpty("")
                .map(body -> {
                    String message = fallbackMessage;
                    if (!body.isBlank()) {
                        message = fallbackMessage + " " + body;
                    }
                    return new ResponseStatusException(response.statusCode(), message);
                });
    }

    private void validateLoginRequest(LoginRequest request) {
        if (request == null || isBlank(request.username()) || isBlank(request.password())) {
            throw new ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Kullanici adi ve sifre gereklidir.");
        }
    }

    private void validateSignupRequest(SignupRequest request) {
        if (request == null) {
            throw new ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Kayit formu bos olamaz.");
        }

        if (isBlank(request.username()) || isBlank(request.email()) || isBlank(request.password())
                || isBlank(request.firstName()) || isBlank(request.lastName())) {
            throw new ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Tum alanlar zorunludur.");
        }

        if (request.password().length() < 8) {
            throw new ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Sifre en az 8 karakter olmalidir.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
