package com.marketplace.payment.api;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
class ServiceInfoController {

    @GetMapping("/internal/service-info")
    Map<String, String> serviceInfo() {
        return Map.of(
                "service", "payment-service",
                "responsibility", "Mock payment workflow and later refund compensation");
    }
}
