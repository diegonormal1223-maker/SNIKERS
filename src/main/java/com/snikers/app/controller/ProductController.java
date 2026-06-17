package com.snikers.app.controller;

import com.snikers.app.model.Product;
import com.snikers.app.service.ProductService;
import com.snikers.app.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ReportService reportService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createProduct(
            @RequestParam("name") String name,
            @RequestParam("price") BigDecimal price,
            @RequestParam("stock") Integer stock,
            @RequestParam("description") String description,
            @RequestParam("brand") String brand,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam("colors") String colors,
            @RequestParam("sizes") String sizes,
            @RequestParam(value = "status", defaultValue = "ACTIVE") String status,
            @RequestParam(value = "sku", required = false) String sku,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            Product product = new Product();
            product.setName(name);
            product.setPrice(price);
            product.setStock(stock);
            product.setDescription(description);
            product.setBrand(brand);
            product.setColors(colors);
            product.setSizes(sizes);
            product.setStatus(com.snikers.app.model.Product.Status.valueOf(status));
            product.setSku(sku);

            com.snikers.app.model.Category category = new com.snikers.app.model.Category();
            category.setId(categoryId);
            product.setCategory(category);

            Product savedProduct = productService.saveProduct(product, image);
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error saving product: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("price") BigDecimal price,
            @RequestParam("stock") Integer stock,
            @RequestParam("description") String description,
            @RequestParam("brand") String brand,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam("colors") String colors,
            @RequestParam("sizes") String sizes,
            @RequestParam(value = "status", defaultValue = "ACTIVE") String status,
            @RequestParam(value = "sku", required = false) String sku,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            Product product = new Product();
            product.setId(id);
            product.setName(name);
            product.setPrice(price);
            product.setStock(stock);
            product.setDescription(description);
            product.setBrand(brand);
            product.setColors(colors);
            product.setSizes(sizes);
            product.setStatus(com.snikers.app.model.Product.Status.valueOf(status));
            product.setSku(sku);

            com.snikers.app.model.Category category = new com.snikers.app.model.Category();
            category.setId(categoryId);
            product.setCategory(category);

            Product savedProduct = productService.saveProduct(product, image);
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating product: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<Product> adjustStock(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, Integer> request) {
        Integer quantity = request.get("quantity");
        return ResponseEntity.ok(productService.adjustStock(id, quantity));
    }

    @GetMapping("/report/pdf")
    public ResponseEntity<byte[]> generateInventoryPdfReport() {
        try {
            com.snikers.app.dto.ReportRequest reportRequest = new com.snikers.app.dto.ReportRequest();
            reportRequest.setModule("INVENTORY");

            byte[] pdfBytes = reportService.generateCustomPdf(reportRequest);

            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "inventario_" +
                    java.time.LocalDate.now() + ".pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(pdfBytes, headers, org.springframework.http.HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
