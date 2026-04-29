package com.marketplace.catalog.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.marketplace.catalog.api.dto.CategoryRequest;
import com.marketplace.catalog.api.dto.CategoryResponse;
import com.marketplace.catalog.domain.Category;
import com.marketplace.catalog.repository.CategoryRepository;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final SlugGenerator slugGenerator;

    public CategoryService(CategoryRepository categoryRepository, SlugGenerator slugGenerator) {
        this.categoryRepository = categoryRepository;
        this.slugGenerator = slugGenerator;
    }

    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        Category parent = request.parentId() == null
                ? null
                : categoryRepository.findById(request.parentId())
                        .orElseThrow(() -> new NotFoundException("Parent category not found"));
        String slug = uniqueSlug(request.slug() == null || request.slug().isBlank() ? request.name() : request.slug());
        Category category = Category.create(request.name().trim(), slug, parent);

        return CategoryResponse.from(categoryRepository.save(category));
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> listActive() {
        return categoryRepository.findAllByActiveTrueOrderByNameAsc().stream()
                .map(CategoryResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public Category getRequired(UUID id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found"));
    }

    private String uniqueSlug(String value) {
        String base = slugGenerator.generate(value);
        String candidate = base;
        int suffix = 2;
        while (categoryRepository.existsBySlug(candidate)) {
            candidate = base + "-" + suffix;
            suffix++;
        }
        return candidate;
    }
}
