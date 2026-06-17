package com.snikers.app.repository;

import com.snikers.app.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long>,
        org.springframework.data.jpa.repository.JpaSpecificationExecutor<Product> {
    List<Product> findByCategoryName(String name);
    Optional<Product> findBySku(String sku);
}
