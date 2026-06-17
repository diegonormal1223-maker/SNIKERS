package com.snikers.app.service;

import com.snikers.app.model.Category;
import com.snikers.app.model.Product;
import com.snikers.app.repository.CategoryRepository;
import com.snikers.app.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ImageService imageService;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public org.springframework.data.domain.Page<Product> getProducts(
            org.springframework.data.domain.Pageable pageable,
            String search,
            String category,
            String brand,
            String status,
            String color,
            String size,
            String price,
            String stock) {

        return productRepository.findAll((root, query, cb) -> {
            java.util.List<jakarta.persistence.criteria.Predicate> predicates = new java.util.ArrayList<>();

            if (search != null && !search.isEmpty()) {
                String searchLike = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), searchLike),
                        cb.like(cb.lower(root.get("sku")), searchLike)));
            }

            if (category != null && !category.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("category").get("name")), "%" + category.toLowerCase() + "%"));
            }

            if (brand != null && !brand.isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("brand")), brand.toLowerCase()));
            }

            if (color != null && !color.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("colors")), "%" + color.toLowerCase() + "%"));
            }

            if (size != null && !size.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("sizes")), "%" + size.toLowerCase() + "%"));
            }

            if (status != null && !status.isEmpty()) {
                if (status.equalsIgnoreCase("low_stock")) {
                    predicates.add(cb.le(root.get("stock"), 10));
                } else if (status.equalsIgnoreCase("out_of_stock")) {
                    predicates.add(cb.equal(root.get("stock"), 0));
                } else if (!status.equalsIgnoreCase("all")) {
                    try {
                        predicates.add(cb.equal(root.get("status"), Product.Status.valueOf(status.toUpperCase())));
                    } catch (IllegalArgumentException e) {
                        // Ignore invalid status
                    }
                }
            }

            // Price range filter
            if (price != null && !price.isEmpty()) {
                if (price.equals("0-50")) {
                    predicates.add(
                            cb.between(root.get("price"), java.math.BigDecimal.ZERO, java.math.BigDecimal.valueOf(50)));
                } else if (price.equals("50-100")) {
                    predicates.add(cb.between(root.get("price"), java.math.BigDecimal.valueOf(50),
                            java.math.BigDecimal.valueOf(100)));
                } else if (price.equals("100-150")) {
                    predicates.add(cb.between(root.get("price"), java.math.BigDecimal.valueOf(100),
                            java.math.BigDecimal.valueOf(150)));
                } else if (price.equals("150-200")) {
                    predicates.add(cb.between(root.get("price"), java.math.BigDecimal.valueOf(150),
                            java.math.BigDecimal.valueOf(200)));
                } else if (price.equals("200+")) {
                    predicates.add(cb.greaterThan(root.get("price"), java.math.BigDecimal.valueOf(200)));
                }
            }

            // Stock level filter
            if (stock != null && !stock.isEmpty()) {
                if (stock.equalsIgnoreCase("alto")) {
                    predicates.add(cb.greaterThan(root.get("stock"), 30));
                } else if (stock.equalsIgnoreCase("medio")) {
                    predicates.add(cb.between(root.get("stock"), 11, 30));
                } else if (stock.equalsIgnoreCase("bajo")) {
                    predicates.add(cb.le(root.get("stock"), 10));
                } else if (stock.equalsIgnoreCase("agotado")) {
                    predicates.add(cb.equal(root.get("stock"), 0));
                }
            }

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        }, pageable);
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product saveProduct(Product product, MultipartFile image) throws IOException {
        // Validation for new product
        // Image is now optional, handled by frontend placeholder if missing

        // Handle Image Upload
        if (image != null && !image.isEmpty()) {
            String imageUrl = imageService.saveImage(image);
            product.setImageUrl(imageUrl);
        } else if (product.getId() != null) {
            // Keep existing image if editing and no new image provided
            Product existingProduct = productRepository.findById(product.getId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            product.setImageUrl(existingProduct.getImageUrl());
        }

        if (product.getCategory() != null && product.getCategory().getId() != null) {
            Category category = categoryRepository.findById(product.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setStatus(Product.Status.INACTIVE);
        productRepository.save(product);
    }

    public List<Product> getProductsByCategory(String categoryName) {
        return productRepository.findByCategoryName(categoryName);
    }

    public java.util.Map<String, Long> getStockStats() {
        List<Product> allProducts = productRepository.findAll();
        java.util.Map<String, Long> stats = new java.util.HashMap<>();

        stats.put("total", (long) allProducts.size());
        stats.put("high", allProducts.stream().filter(p -> p.getStock() > 30).count());
        stats.put("medium", allProducts.stream().filter(p -> p.getStock() > 10 && p.getStock() <= 30).count());
        stats.put("low", allProducts.stream().filter(p -> p.getStock() <= 10 && p.getStock() > 0).count());
        stats.put("out", allProducts.stream().filter(p -> p.getStock() == 0).count());

        return stats;
    }

    public Product adjustStock(Long id, int quantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setStock(quantity);
        return productRepository.save(product);
    }
}
