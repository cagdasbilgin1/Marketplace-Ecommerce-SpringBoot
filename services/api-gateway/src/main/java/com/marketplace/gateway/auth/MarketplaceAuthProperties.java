package com.marketplace.gateway.auth;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "marketplace.auth")
public record MarketplaceAuthProperties(
        String keycloakUrl,
        String realm,
        String publicClientId,
        String adminRealm,
        String adminClientId,
        String adminUsername,
        String adminPassword,
        String customerRole
) {
}
