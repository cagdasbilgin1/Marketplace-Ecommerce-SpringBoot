package com.marketplace.catalog.api.dto;

import java.time.Instant;
import java.util.UUID;

import com.marketplace.catalog.domain.Category;

public record CategoryResponse(
        UUID id,
        UUID parentId,
        String name,
        String slug,
        boolean active,
        Instant createdAt,
        Instant updatedAt) {

    public static CategoryResponse from(Category category) {
        UUID parentId = category.getParent() == null ? null : category.getParent().getId();
        return new CategoryResponse(
                category.getId(),
                parentId,
                category.getName(),
                category.getSlug(),
                category.isActive(),
                category.getCreatedAt(),
                category.getUpdatedAt());
    }
}
