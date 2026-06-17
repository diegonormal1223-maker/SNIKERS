package com.snikers.app.service;

import com.snikers.app.model.Product;
import com.snikers.app.repository.ProductRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class ProductServiceIntegrationTest {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @Test
    void shouldDeactivateProductInsteadOfDeleting() {

        Product product = Product.builder()
                .name("Test Shoe")
                .price(new BigDecimal("100"))
                .stock(20)
                .status(Product.Status.ACTIVE)
                .build();

        Product saved = productRepository.save(product);

        productService.deleteProduct(saved.getId());

        Product updated = productRepository.findById(saved.getId()).orElse(null);

        assertNotNull(updated);
        assertEquals(Product.Status.INACTIVE, updated.getStatus());
    }

    @Test
void shouldUpdateProductStock() {

    Product product = Product.builder()
            .name("Stock Test")
            .price(new BigDecimal("50"))
            .stock(10)
            .status(Product.Status.ACTIVE)
            .build();

    Product saved = productRepository.save(product);

    Product updated = productService.adjustStock(saved.getId(), 99);

    assertEquals(99, updated.getStock());
}
}