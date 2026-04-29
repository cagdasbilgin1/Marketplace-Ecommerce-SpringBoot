package com.marketplace.catalog.api.dto;

import java.util.UUID;

import com.marketplace.catalog.domain.ProductImage;

public record ProductImageResponse(
        UUID id,
        String url,
        String altText,
        int sortOrder) {

    public static ProductImageResponse from(ProductImage image) {
        return new ProductImageResponse(
                image.getId(),
                image.getUrl(),
                image.getAltText(),
                image.getSortOrder());
    }
}
