package com.marketplace.catalog.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.marketplace.catalog.domain.Product;
import com.marketplace.catalog.domain.ProductStatus;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, UUID id);

    @EntityGraph(attributePaths = {"category", "images"})
    Optional<Product> findBySlug(String slug);

    @EntityGraph(attributePaths = {"category", "images"})
    Optional<Product> findWithCategoryAndImagesById(UUID id);

    @EntityGraph(attributePaths = {"category", "images"})
    Page<Product> findAllByStatus(ProductStatus status, Pageable pageable);

    @EntityGraph(attributePaths = {"category", "images"})
    Page<Product> findAllByCategory_Slug(String categorySlug, Pageable pageable);

    @EntityGraph(attributePaths = {"category", "images"})
    Page<Product> findAllByStatusAndCategory_Slug(ProductStatus status, String categorySlug, Pageable pageable);
}
