package com.snikers.app.imports.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImportRowDTO {
    private Integer rowNumber;
    private String sku;
    private String name;
    private String category; // id or name
    private BigDecimal price;
    private BigDecimal comparePrice;
    private Integer stock;
    private String brand;
    private String colors;
    private String sizes;
    private String status;
    private String description;
    private String imageUrl;
}
