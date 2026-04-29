package com.marketplace.userprofile.api;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
class ServiceInfoController {

    @GetMapping("/internal/service-info")
    Map<String, String> serviceInfo() {
        return Map.of(
                "service", "user-profile-service",
                "responsibility", "Profiles, addresses, phone numbers, and Keycloak user links");
    }
}
