package com.marketplace.inventory.api;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
class ServiceInfoController {

    @GetMapping("/internal/service-info")
    Map<String, String> serviceInfo() {
        return Map.of(
                "service", "inventory-service",
                "responsibility", "Stock, reservations, releases, and stock decrease after payment");
    }
}
