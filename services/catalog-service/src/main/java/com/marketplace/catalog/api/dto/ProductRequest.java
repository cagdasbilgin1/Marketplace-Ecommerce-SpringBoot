package com.marketplace.catalog.api.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.marketplace.catalog.domain.ProductStatus;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ProductRequest(
        @NotNull UUID sellerId,
        @NotNull UUID categoryId,
        @NotBlank @Size(max = 220) String name,
        @Size(max = 240) String slug,
        @NotBlank String description,
        @NotNull @DecimalMin("0.00") BigDecimal price,
        @Pattern(regexp = "^[A-Z]{3}$") String currency,
        ProductStatus status,
        Map<String, Object> metadata,
        @Valid List<ProductImageRequest> images) {
}
