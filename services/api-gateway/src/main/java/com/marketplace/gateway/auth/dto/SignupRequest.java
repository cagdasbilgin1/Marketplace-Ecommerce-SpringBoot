package com.marketplace.gateway.auth.dto;

public record SignupRequest(
        String username,
        String email,
        String password,
        String firstName,
        String lastName
) {
}
