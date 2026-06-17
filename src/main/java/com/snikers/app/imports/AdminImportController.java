package com.snikers.app.imports;

import com.snikers.app.imports.dto.ImportResult;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/admin/import")
public class AdminImportController {

    private final ImportService importService;

    public AdminImportController(ImportService importService) {
        this.importService = importService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "/preview", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ImportResult preview(@RequestParam("file") MultipartFile file) throws Exception {
        return importService.preview(file);
    }

    // Confirm: persist validated rows. mode: skip (default) or update
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "/confirm", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public com.snikers.app.imports.dto.ImportConfirmResult confirm(@RequestParam("file") MultipartFile file,
                                                                  @RequestParam(value = "mode", required = false, defaultValue = "skip") String mode) throws Exception {
        return importService.confirm(file, mode);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/template/csv")
    public ResponseEntity<?> downloadCsvTemplate() throws IOException {
        ClassPathResource resource = new ClassPathResource("templates/product-import-template.csv");
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=product-import-template.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(resource);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/template/xlsx")
    public ResponseEntity<byte[]> downloadXlsxTemplate() throws IOException {
        try (org.apache.poi.xssf.usermodel.XSSFWorkbook workbook = new org.apache.poi.xssf.usermodel.XSSFWorkbook()) {
            org.apache.poi.xssf.usermodel.XSSFSheet sheet = workbook.createSheet("ImportTemplate");
            String[] headers = {"sku", "name", "category", "price", "comparePrice", "stock", "brand", "colors", "sizes", "status", "description", "imageUrl"};
            org.apache.poi.xssf.usermodel.XSSFRow headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                headerRow.createCell(i).setCellValue(headers[i]);
            }
            org.apache.poi.xssf.usermodel.XSSFRow sampleRow = sheet.createRow(1);
            sampleRow.createCell(0).setCellValue("SKU-123");
            sampleRow.createCell(1).setCellValue("Example Product");
            sampleRow.createCell(2).setCellValue("Default");
            sampleRow.createCell(3).setCellValue("49.99");
            sampleRow.createCell(4).setCellValue("59.99");
            sampleRow.createCell(5).setCellValue("10");
            sampleRow.createCell(6).setCellValue("BrandX");
            sampleRow.createCell(7).setCellValue("red");
            sampleRow.createCell(8).setCellValue("M;L");
            sampleRow.createCell(9).setCellValue("ACTIVE");
            sampleRow.createCell(10).setCellValue("Example description");
            sampleRow.createCell(11).setCellValue("https://example.com/image.jpg");

            try (java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream()) {
                workbook.write(out);
                byte[] bytes = out.toByteArray();
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=product-import-template.xlsx")
                        .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                        .body(bytes);
            }
        }
    }

}
