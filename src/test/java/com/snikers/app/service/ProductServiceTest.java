package com.snikers.app.service;

import com.snikers.app.model.Product;
import com.snikers.app.repository.CategoryRepository;
import com.snikers.app.repository.ProductRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;

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
                .status(Product.Status.ACTIVE)
                .build();
    }

    // TEST 1: Obtener producto por ID
    @Test
    void shouldReturnProductById() {

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(product));

        Optional<Product> result = productService.getProductById(1L);

        assertTrue(result.isPresent());
        assertEquals("Nike Air", result.get().getName());

        verify(productRepository).findById(1L);
    }

    // TEST 2: Ajustar stock
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

    // TEST 3: Estadísticas de stock
    @Test
    void shouldReturnStockStats() {

        List<Product> products = List.of(
                Product.builder().stock(50).build(),
                Product.builder().stock(20).build(),
                Product.builder().stock(5).build(),
                Product.builder().stock(0).build()
        );

        when(productRepository.findAll()).thenReturn(products);

        Map<String, Long> stats = productService.getStockStats();

        assertEquals(4, stats.get("total"));
        assertEquals(1, stats.get("high"));
        assertEquals(1, stats.get("medium"));
        assertEquals(1, stats.get("low"));
        assertEquals(1, stats.get("out"));
    }

    // TEST 4: Producto no encontrado
    @Test
    void shouldReturnEmptyWhenProductNotFound() {

        when(productRepository.findById(99L))
                .thenReturn(Optional.empty());

        Optional<Product> result = productService.getProductById(99L);

        assertFalse(result.isPresent());

        verify(productRepository).findById(99L);
    }

    // TEST 5: Ajustar stock de producto inexistente
    @Test
    void shouldThrowExceptionWhenAdjustingStockOfNonExistingProduct() {

        when(productRepository.findById(99L))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> productService.adjustStock(99L, 20)
        );

        assertEquals("Product not found", exception.getMessage());

        verify(productRepository).findById(99L);
        verify(productRepository, never()).save(any());
    }

    // TEST 6: Estadísticas vacías
    @Test
    void shouldReturnEmptyStatsWhenNoProductsExist() {

        when(productRepository.findAll())
                .thenReturn(List.of());

        Map<String, Long> stats = productService.getStockStats();

        assertEquals(0, stats.get("total"));
        assertEquals(0, stats.get("high"));
        assertEquals(0, stats.get("medium"));
        assertEquals(0, stats.get("low"));
        assertEquals(0, stats.get("out"));
    }

    // TEST 7: Verificar actualización correcta de stock
    @Test
    void shouldUpdateProductStockCorrectly() {

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(product));

        when(productRepository.save(any(Product.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Product updated = productService.adjustStock(1L, 30);

        assertNotNull(updated);
        assertEquals(30, updated.getStock());
    }

    // TEST 8: Verificar que save se ejecuta una sola vez
    @Test
    void shouldCallSaveOnlyOnce() {

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(product));

        when(productRepository.save(any(Product.class)))
                .thenReturn(product);

        productService.adjustStock(1L, 15);

        verify(productRepository, times(1))
                .save(any(Product.class));
    }

    // TEST 9: Obtener todos los productos
    @Test
    void shouldReturnAllProducts() {

        List<Product> products = List.of(
                Product.builder().id(1L).name("Nike Air").build(),
                Product.builder().id(2L).name("Adidas Forum").build()
        );

        when(productRepository.findAll())
                .thenReturn(products);

        List<Product> result = productService.getAllProducts();

        assertEquals(2, result.size());

        verify(productRepository).findAll();
    }

    // TEST 10: Eliminar producto (cambiar estado a INACTIVE)
    @Test
    void shouldSetProductInactiveWhenDeleting() {

        product.setStatus(Product.Status.ACTIVE);

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(product));

        productService.deleteProduct(1L);

        assertEquals(Product.Status.INACTIVE, product.getStatus());

        verify(productRepository).findById(1L);
        verify(productRepository).save(product);
    }

    // TEST 11: Error al eliminar producto inexistente
    @Test
    void shouldThrowExceptionWhenDeletingNonExistingProduct() {

        when(productRepository.findById(99L))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> productService.deleteProduct(99L)
        );

        assertEquals("Product not found", exception.getMessage());

        verify(productRepository).findById(99L);
        verify(productRepository, never()).save(any());
    }
}