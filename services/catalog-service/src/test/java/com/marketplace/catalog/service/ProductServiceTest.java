package com.marketplace.catalog.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.marketplace.catalog.api.dto.ProductImageRequest;
import com.marketplace.catalog.api.dto.ProductRequest;
import com.marketplace.catalog.domain.Category;
import com.marketplace.catalog.domain.Product;
import com.marketplace.catalog.domain.ProductStatus;
import com.marketplace.catalog.repository.CategoryRepository;
import com.marketplace.catalog.repository.ProductRepository;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    private final SlugGenerator slugGenerator = new SlugGenerator();

    private ProductService productService;

    @BeforeEach
    void setUp() {
        productService = new ProductService(productRepository, categoryRepository, slugGenerator);
    }

    @Test
    void createsProductWithUniqueSlugAndImages() {
        UUID categoryId = UUID.randomUUID();
        Category category = Category.create("Elektronik", "elektronik", null);
        ProductRequest request = new ProductRequest(
                UUID.randomUUID(),
                categoryId,
                "Kablosuz Şarj Cihazı",
                null,
                "Hızlı şarj destekli ürün.",
                BigDecimal.valueOf(499.90),
                null,
                ProductStatus.ACTIVE,
                Map.of("brand", "Demo"),
                List.of(new ProductImageRequest("https://cdn.example.com/product.jpg", "Urun gorseli", 0)));

        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
        when(productRepository.existsBySlug("kablosuz-sarj-cihazi")).thenReturn(true);
        when(productRepository.existsBySlug("kablosuz-sarj-cihazi-2")).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        productService.create(request);

        ArgumentCaptor<Product> captor = ArgumentCaptor.forClass(Product.class);
        verify(productRepository).save(captor.capture());
        Product product = captor.getValue();

        assertThat(product.getSlug()).isEqualTo("kablosuz-sarj-cihazi-2");
        assertThat(product.getCurrency()).isEqualTo("TRY");
        assertThat(product.getImages()).hasSize(1);
    }
}
