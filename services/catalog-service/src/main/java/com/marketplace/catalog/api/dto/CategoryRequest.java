package com.marketplace.catalog.api.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequest(
        @NotBlank @Size(max = 160) String name,
        @Size(max = 180) String slug,
        UUID parentId) {
}
