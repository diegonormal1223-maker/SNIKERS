package com.snikers.app.imports.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImportResult {
    private int totalRows;
    private List<ImportRowDTO> previewRows;
    private List<ImportRowError> errors;
}
