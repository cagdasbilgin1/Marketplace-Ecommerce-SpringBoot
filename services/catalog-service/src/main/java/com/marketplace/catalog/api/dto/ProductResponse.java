package com.marketplace.catalog.api.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.marketplace.catalog.domain.Product;
import com.marketplace.catalog.domain.ProductStatus;

public record ProductResponse(
        UUID id,
        String productId,
        UUID sellerId,
        CategoryResponse category,
        String name,
        String slug,
        String description,
        BigDecimal price,
        String currency,
        ProductStatus status,
        Map<String, Object> metadata,
        List<ProductImageResponse> images,
        Instant createdAt,
        Instant updatedAt) {

    public static ProductResponse from(Product product) {
        List<ProductImageResponse> images = product.getImages().stream()
                .sorted(Comparator.comparingInt(image -> image.getSortOrder()))
                .map(ProductImageResponse::from)
                .toList();

        return new ProductResponse(
                product.getId(),
                product.getProductId(),
                product.getSellerId(),
                CategoryResponse.from(product.getCategory()),
                product.getName(),
                product.getSlug(),
                product.getDescription(),
                product.getPrice(),
                product.getCurrency(),
                product.getStatus(),
                product.getMetadata(),
                images,
                product.getCreatedAt(),
                product.getUpdatedAt());
    }
}
