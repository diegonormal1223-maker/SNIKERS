package com.snikers.app.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String sku;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private BigDecimal price;

    private BigDecimal comparePrice;

    private Integer stock;

    private String brand;

    private String colors; // Comma separated

    private String sizes; // Comma separated

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(length = 1000)
    private String description;

    private String imageUrl;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null)
            status = Status.ACTIVE;
    }

    public enum Status {
        ACTIVE, INACTIVE, DRAFT
    }
}
