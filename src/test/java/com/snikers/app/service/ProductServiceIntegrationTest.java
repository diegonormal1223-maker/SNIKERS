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

    // IT-01
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

    // IT-02
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

    // IT-03
    @Test
    void shouldFindProductById() {

        Product product = Product.builder()
                .name("Nike Air Max")
                .price(new BigDecimal("250"))
                .stock(15)
                .status(Product.Status.ACTIVE)
                .build();

        Product saved = productRepository.save(product);

        var result = productService.getProductById(saved.getId());

        assertTrue(result.isPresent());
        assertEquals("Nike Air Max", result.get().getName());
    }

    // IT-04
    @Test
    void shouldReturnAllProducts() {

        Product product1 = Product.builder()
                .name("Adidas")
                .price(new BigDecimal("100"))
                .stock(10)
                .status(Product.Status.ACTIVE)
                .build();

        Product product2 = Product.builder()
                .name("Nike")
                .price(new BigDecimal("150"))
                .stock(20)
                .status(Product.Status.ACTIVE)
                .build();

        productRepository.save(product1);
        productRepository.save(product2);

        var products = productService.getAllProducts();

        assertFalse(products.isEmpty());
        assertTrue(products.size() >= 2);
    }

    // IT-05
    @Test
    void shouldGenerateStockStatistics() {

        productRepository.save(Product.builder()
                .name("High Stock")
                .price(BigDecimal.TEN)
                .stock(50)
                .status(Product.Status.ACTIVE)
                .build());

        productRepository.save(Product.builder()
                .name("Medium Stock")
                .price(BigDecimal.TEN)
                .stock(20)
                .status(Product.Status.ACTIVE)
                .build());

        productRepository.save(Product.builder()
                .name("Low Stock")
                .price(BigDecimal.TEN)
                .stock(5)
                .status(Product.Status.ACTIVE)
                .build());

        var stats = productService.getStockStats();

        assertNotNull(stats);
        assertTrue(stats.get("total") > 0);
    }

    // IT-06
    @Test
    void shouldReturnEmptyWhenProductDoesNotExist() {

        var result = productService.getProductById(99999L);

        assertFalse(result.isPresent());
    }

    // IT-07
    @Test
    void shouldThrowExceptionWhenProductDoesNotExistForStockUpdate() {

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> productService.adjustStock(99999L, 20)
        );

        assertEquals("Product not found", exception.getMessage());
    }

    // IT-08
    @Test
    void shouldThrowExceptionWhenDeletingNonExistingProduct() {

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> productService.deleteProduct(99999L)
        );

        assertEquals("Product not found", exception.getMessage());
    }
}