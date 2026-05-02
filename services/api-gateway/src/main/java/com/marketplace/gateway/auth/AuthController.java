package com.marketplace.gateway.auth;

import com.marketplace.gateway.auth.dto.AuthResponse;
import com.marketplace.gateway.auth.dto.LoginRequest;
import com.marketplace.gateway.auth.dto.LogoutRequest;
import com.marketplace.gateway.auth.dto.RefreshTokenRequest;
import com.marketplace.gateway.auth.dto.SignupRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/auth")
class AuthController {

    private final KeycloakAuthService authService;

    AuthController(KeycloakAuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    Mono<AuthResponse> login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/signup")
    Mono<AuthResponse> signup(@RequestBody SignupRequest request) {
        return authService.signup(request);
    }

    @PostMapping("/refresh")
    Mono<AuthResponse> refresh(@RequestBody RefreshTokenRequest request) {
        return authService.refresh(request);
    }

    @PostMapping("/logout")
    Mono<ResponseEntity<Void>> logout(@RequestBody(required = false) LogoutRequest request) {
        return authService.logout(request)
                .thenReturn(ResponseEntity.noContent().build());
    }
}
