package com.marketplace.catalog.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.marketplace.catalog.api.dto.PageResponse;
import com.marketplace.catalog.api.dto.ProductImageRequest;
import com.marketplace.catalog.api.dto.ProductRequest;
import com.marketplace.catalog.api.dto.ProductResponse;
import com.marketplace.catalog.domain.Category;
import com.marketplace.catalog.domain.Product;
import com.marketplace.catalog.domain.ProductImage;
import com.marketplace.catalog.domain.ProductStatus;
import com.marketplace.catalog.repository.CategoryRepository;
import com.marketplace.catalog.repository.ProductRepository;

@Service
public class ProductService {

    private static final int MAX_PAGE_SIZE = 100;

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SlugGenerator slugGenerator;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository,
            SlugGenerator slugGenerator) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.slugGenerator = slugGenerator;
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Category category = getRequiredCategory(request.categoryId());
        String slug = uniqueSlug(request.slug() == null || request.slug().isBlank() ? request.name() : request.slug());
        Product product = Product.create(
                request.sellerId(),
                category,
                request.name().trim(),
                slug,
                request.description().trim(),
                request.price(),
                currencyOrDefault(request.currency()),
                statusOrDefault(request.status()),
                metadataOrEmpty(request.metadata()));
        product.replaceImages(toImages(request.images()));

        return ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(UUID id, ProductRequest request) {
        Product product = productRepository.findWithCategoryAndImagesById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        Category category = getRequiredCategory(request.categoryId());
        String slug = uniqueSlugForUpdate(
                id,
                request.slug() == null || request.slug().isBlank() ? request.name() : request.slug());

        product.update(
                category,
                request.name().trim(),
                slug,
                request.description().trim(),
                request.price(),
                currencyOrDefault(request.currency()),
                statusOrDefault(request.status()),
                metadataOrEmpty(request.metadata()));
        product.replaceImages(toImages(request.images()));

        return ProductResponse.from(product);
    }

    @Transactional(readOnly = true)
    public ProductResponse get(UUID id) {
        return productRepository.findWithCategoryAndImagesById(id)
                .map(ProductResponse::from)
                .orElseThrow(() -> new NotFoundException("Product not found"));
    }

    @Transactional(readOnly = true)
    public ProductResponse getBySlug(String slug) {
        return productRepository.findBySlug(slug)
                .map(ProductResponse::from)
                .orElseThrow(() -> new NotFoundException("Product not found"));
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> list(ProductStatus status, String categorySlug, int page, int size) {
        Pageable pageable = PageRequest.of(
                Math.max(page, 0),
                Math.min(Math.max(size, 1), MAX_PAGE_SIZE),
                Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Product> products;
        if (status != null && categorySlug != null && !categorySlug.isBlank()) {
            products = productRepository.findAllByStatusAndCategory_Slug(status, categorySlug, pageable);
        } else if (status != null) {
            products = productRepository.findAllByStatus(status, pageable);
        } else if (categorySlug != null && !categorySlug.isBlank()) {
            products = productRepository.findAllByCategory_Slug(categorySlug, pageable);
        } else {
            products = productRepository.findAll(pageable);
        }

        return PageResponse.from(products.map(ProductResponse::from));
    }

    @Transactional
    public void delete(UUID id) {
        if (!productRepository.existsById(id)) {
            throw new NotFoundException("Product not found");
        }
        productRepository.deleteById(id);
    }

    private Category getRequiredCategory(UUID categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("Category not found"));
    }

    private String uniqueSlug(String value) {
        String base = slugGenerator.generate(value);
        String candidate = base;
        int suffix = 2;
        while (productRepository.existsBySlug(candidate)) {
            candidate = base + "-" + suffix;
            suffix++;
        }
        return candidate;
    }

    private String uniqueSlugForUpdate(UUID productId, String value) {
        String base = slugGenerator.generate(value);
        String candidate = base;
        int suffix = 2;
        while (productRepository.existsBySlugAndIdNot(candidate, productId)) {
            candidate = base + "-" + suffix;
            suffix++;
        }
        return candidate;
    }

    private String currencyOrDefault(String currency) {
        return currency == null || currency.isBlank() ? "TRY" : currency;
    }

    private ProductStatus statusOrDefault(ProductStatus status) {
        return status == null ? ProductStatus.DRAFT : status;
    }

    private Map<String, Object> metadataOrEmpty(Map<String, Object> metadata) {
        return metadata == null ? new LinkedHashMap<>() : new LinkedHashMap<>(metadata);
    }

    private List<ProductImage> toImages(List<ProductImageRequest> images) {
        if (images == null) {
            return List.of();
        }

        return images.stream()
                .map(image -> new ProductImage(image.url().trim(), image.altText(), image.sortOrder()))
                .toList();
    }
}
