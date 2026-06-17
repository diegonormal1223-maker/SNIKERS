package com.snikers.app.imports;

import com.snikers.app.imports.dto.ImportResult;
import com.snikers.app.imports.dto.ImportRowDTO;
import com.snikers.app.imports.dto.ImportRowError;
import com.snikers.app.model.Product;
import com.snikers.app.model.Category;
import com.snikers.app.repository.ProductRepository;
import com.snikers.app.repository.CategoryRepository;
import com.opencsv.CSVReader;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.util.*;

@Service
public class ImportService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ImportService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public ImportResult preview(MultipartFile file) throws Exception {
        String name = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase();
        if (name.endsWith(".csv")) {
            return previewCsv(file.getInputStream());
        } else if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
            return previewXlsx(file.getInputStream());
        } else {
            throw new IllegalArgumentException("Unsupported file type");
        }
    }

    public com.snikers.app.imports.dto.ImportConfirmResult confirm(MultipartFile file, String mode) throws Exception {
        String name = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase();
        List<com.snikers.app.imports.dto.ImportRowError> errors = new ArrayList<>();
        int saved = 0, updated = 0, skipped = 0, total = 0;
        List<com.snikers.app.imports.dto.ImportRowDTO> rows;
        if (name.endsWith(".csv")) {
            rows = previewCsv(file.getInputStream()).getPreviewRows();
        } else if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
            rows = previewXlsx(file.getInputStream()).getPreviewRows();
        } else {
            throw new IllegalArgumentException("Unsupported file type");
        }
        total = rows.size();
        for (com.snikers.app.imports.dto.ImportRowDTO dto : rows) {
            List<String> rowErrors = validateDto(dto);
            if (!rowErrors.isEmpty()) {
                errors.add(new com.snikers.app.imports.dto.ImportRowError(dto.getRowNumber(), String.join("; ", rowErrors), null));
                continue;
            }
            // Handle category
            Category cat = null;
            if (dto.getCategory() != null) {
                cat = categoryRepository.findByName(dto.getCategory()).orElse(null);
            }
            // Check existing by SKU
            Optional<Product> existing = productRepository.findBySku(dto.getSku());
            if (existing.isPresent()) {
                if ("update".equalsIgnoreCase(mode)) {
                    Product p = existing.get();
                    mapDtoToProduct(dto, p, cat);
                    productRepository.save(p);
                    updated++;
                } else {
                    skipped++;
                }
            } else {
                Product p = new Product();
                mapDtoToProduct(dto, p, cat);
                productRepository.save(p);
                saved++;
            }
        }
        return new com.snikers.app.imports.dto.ImportConfirmResult(total, saved, updated, skipped, errors);
    }

    private ImportResult previewCsv(InputStream is) throws Exception {
        List<ImportRowDTO> rows = new ArrayList<>();
        List<ImportRowError> errors = new ArrayList<>();
        try (CSVReader reader = new CSVReader(new InputStreamReader(is))) {
            String[] headers = reader.readNext();
            if (headers == null) return new ImportResult(0, rows, errors);
            String[] line;
            int rowNum = 1;
            Map<String, Integer> idx = mapHeaders(headers);
            while ((line = reader.readNext()) != null) {
                rowNum++;
                ImportRowDTO dto = mapLineToDto(idx, line, rowNum);
                List<String> rowErrors = validateDto(dto);
                if (!rowErrors.isEmpty()) {
                    errors.add(new ImportRowError(rowNum, String.join("; ", rowErrors), null));
                }
                rows.add(dto);
            }
        }
        return new ImportResult(rows.size(), rows, errors);
    }

    private ImportResult previewXlsx(InputStream is) throws Exception {
        List<ImportRowDTO> rows = new ArrayList<>();
        List<ImportRowError> errors = new ArrayList<>();
        try (Workbook wb = WorkbookFactory.create(is)) {
            Sheet sheet = wb.getSheetAt(0);
            Iterator<Row> it = sheet.rowIterator();
            if (!it.hasNext()) return new ImportResult(0, rows, errors);
            Row header = it.next();
            Map<String, Integer> idx = mapHeaders(header);
            int rowNum = 1;
            while (it.hasNext()) {
                Row r = it.next();
                rowNum++;
                ImportRowDTO dto = mapRowToDto(idx, r, rowNum);
                List<String> rowErrors = validateDto(dto);
                if (!rowErrors.isEmpty()) {
                    errors.add(new ImportRowError(rowNum, String.join("; ", rowErrors), null));
                }
                rows.add(dto);
            }
        }
        return new ImportResult(rows.size(), rows, errors);
    }

    private Map<String, Integer> mapHeaders(String[] headers) {
        Map<String, Integer> idx = new HashMap<>();
        for (int i = 0; i < headers.length; i++) {
            idx.put(headers[i].trim().toLowerCase(), i);
        }
        return idx;
    }

    private Map<String, Integer> mapHeaders(Row header) {
        Map<String, Integer> idx = new HashMap<>();
        for (int i = 0; i < header.getPhysicalNumberOfCells(); i++) {
            String h = header.getCell(i).getStringCellValue();
            idx.put(h.trim().toLowerCase(), i);
        }
        return idx;
    }

    private ImportRowDTO mapLineToDto(Map<String, Integer> idx, String[] line, int rowNum) {
        ImportRowDTO dto = new ImportRowDTO();
        dto.setRowNumber(rowNum);
        dto.setSku(getByHeader(idx, line, "sku"));
        dto.setName(getByHeader(idx, line, "name"));
        dto.setCategory(getByHeader(idx, line, "category"));
        dto.setPrice(parseBigDecimal(getByHeader(idx, line, "price")));
        dto.setComparePrice(parseBigDecimal(getByHeader(idx, line, "compareprice")));
        dto.setStock(parseInteger(getByHeader(idx, line, "stock")));
        dto.setBrand(getByHeader(idx, line, "brand"));
        dto.setColors(getByHeader(idx, line, "colors"));
        dto.setSizes(getByHeader(idx, line, "sizes"));
        dto.setStatus(getByHeader(idx, line, "status"));
        dto.setDescription(getByHeader(idx, line, "description"));
        dto.setImageUrl(getByHeader(idx, line, "imageurl"));
        return dto;
    }

    private ImportRowDTO mapRowToDto(Map<String, Integer> idx, Row r, int rowNum) {
        ImportRowDTO dto = new ImportRowDTO();
        dto.setRowNumber(rowNum);
        dto.setSku(getCellString(r, idx.get("sku")));
        dto.setName(getCellString(r, idx.get("name")));
        dto.setCategory(getCellString(r, idx.get("category")));
        dto.setPrice(parseBigDecimal(getCellString(r, idx.get("price"))));
        dto.setComparePrice(parseBigDecimal(getCellString(r, idx.get("compareprice"))));
        dto.setStock(parseInteger(getCellString(r, idx.get("stock"))));
        dto.setBrand(getCellString(r, idx.get("brand")));
        dto.setColors(getCellString(r, idx.get("colors")));
        dto.setSizes(getCellString(r, idx.get("sizes")));
        dto.setStatus(getCellString(r, idx.get("status")));
        dto.setDescription(getCellString(r, idx.get("description")));
        dto.setImageUrl(getCellString(r, idx.get("imageurl")));
        return dto;
    }

    private String getByHeader(Map<String, Integer> idx, String[] line, String header) {
        Integer i = idx.get(header);
        if (i == null || i < 0 || i >= line.length) return null;
        String v = line[i];
        return v == null || v.trim().isEmpty() ? null : v.trim();
    }

    private String getCellString(Row r, Integer idx) {
        if (idx == null) return null;
        if (r.getCell(idx) == null) return null;
        org.apache.poi.ss.usermodel.Cell cell = r.getCell(idx);
        String v = cell.toString();
        return v == null || v.trim().isEmpty() ? null : v.trim();
    }

    private BigDecimal parseBigDecimal(String s) {
        try {
            if (s == null) return null;
            return new BigDecimal(s.replaceAll("[^0-9.-]", ""));
        } catch (Exception e) {
            return null;
        }
    }

    private Integer parseInteger(String s) {
        try {
            if (s == null) return null;
            return Integer.parseInt(s.replaceAll("[^0-9]", ""));
        } catch (Exception e) {
            return null;
        }
    }

    private List<String> validateDto(ImportRowDTO dto) {
        List<String> errors = new ArrayList<>();
        if (dto.getSku() == null || dto.getSku().isBlank()) {
            errors.add("sku is required");
        } else {
            // For preview validation we don't mark existing as error; confirm handles skip/update
        }
        if (dto.getName() == null || dto.getName().isBlank()) {
            errors.add("name is required");
        }
        return errors;
    }

    private void mapDtoToProduct(ImportRowDTO dto, Product p, Category cat) {
        p.setSku(dto.getSku());
        p.setName(dto.getName());
        if (cat != null) p.setCategory(cat);
        p.setPrice(dto.getPrice());
        p.setComparePrice(dto.getComparePrice());
        p.setStock(dto.getStock());
        p.setBrand(dto.getBrand());
        p.setColors(dto.getColors());
        p.setSizes(dto.getSizes());
        try {
            if (dto.getStatus() != null) p.setStatus(Product.Status.valueOf(dto.getStatus()));
        } catch (Exception ignored) {}
        p.setDescription(dto.getDescription());
        p.setImageUrl(dto.getImageUrl());
    }

}
