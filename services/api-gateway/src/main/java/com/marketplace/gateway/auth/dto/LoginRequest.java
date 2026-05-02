package com.marketplace.gateway.auth.dto;

public record LoginRequest(
        String username,
        String password
) {
}
