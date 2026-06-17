package com.snikers.app.imports.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImportConfirmResult {
    private int totalRows;
    private int savedCount;
    private int updatedCount;
    private int skippedCount;
    private List<ImportRowError> errors;
}
