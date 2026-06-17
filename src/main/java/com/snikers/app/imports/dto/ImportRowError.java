package com.snikers.app.imports.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImportRowError {
    private Integer rowNumber;
    private String message;
    private Map<String, String> fieldErrors;
}
