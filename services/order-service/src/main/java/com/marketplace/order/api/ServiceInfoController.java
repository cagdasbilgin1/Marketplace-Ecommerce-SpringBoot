package com.marketplace.order.api;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
class ServiceInfoController {

    @GetMapping("/internal/service-info")
    Map<String, String> serviceInfo() {
        return Map.of(
                "service", "order-service",
                "responsibility", "Orders, order status, and Saga orchestration");
    }
}
