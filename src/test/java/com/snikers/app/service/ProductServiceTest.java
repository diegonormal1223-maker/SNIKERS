package com.snikers.app.service;

import com.snikers.app.model.Product;
import com.snikers.app.repository.ProductRepository;
import com.snikers.app.repository.CategoryRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ImageService imageService;

    @InjectMocks
    private ProductService productService;

    private Product product;

    @BeforeEach
    void setUp() {
        product = Product.builder()
                .id(1L)
                .name("Nike Air")
                .stock(10)
                .build();
    }

    //  TEST 1: Obtener producto por ID (READ)
    @Test
    void shouldReturnProductById() {

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(product));

        Optional<Product> result = productService.getProductById(1L);

        assertTrue(result.isPresent());
        assertEquals("Nike Air", result.get().getName());

        verify(productRepository).findById(1L);
    }

    //  TEST 2: Ajustar stock (UPDATE)
    @Test
    void shouldAdjustStockSuccessfully() {

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(product));

        when(productRepository.save(any(Product.class)))
                .thenReturn(product);

        Product result = productService.adjustStock(1L, 25);

        assertEquals(25, result.getStock());

        verify(productRepository).findById(1L);
        verify(productRepository).save(product);
    }

    //  : Estadísticas de stock
    @Test
    void shouldReturnStockStats() {

        List<Product> products = List.of(
                Product.builder().stock(50).build(), // high
                Product.builder().stock(20).build(), // medium
                Product.builder().stock(5).build(),  // low
                Product.builder().stock(0).build()   // out
        );

        when(productRepository.findAll()).thenReturn(products);

        Map<String, Long> stats = productService.getStockStats();

        assertEquals(4, stats.get("total"));
        assertEquals(1, stats.get("high"));
        assertEquals(1, stats.get("medium"));
        assertEquals(1, stats.get("low"));
        assertEquals(1, stats.get("out"));
    }
}