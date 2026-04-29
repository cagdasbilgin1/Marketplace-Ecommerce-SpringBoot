package com.marketplace.catalog.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProductImageRequest(
        @NotBlank String url,
        @Size(max = 240) String altText,
        @Min(0) int sortOrder) {
}
