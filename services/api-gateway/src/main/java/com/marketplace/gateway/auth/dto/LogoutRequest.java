package com.marketplace.gateway.auth.dto;

public record LogoutRequest(
        String refreshToken
) {
}
