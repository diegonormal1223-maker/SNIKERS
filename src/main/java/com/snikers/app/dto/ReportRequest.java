package com.snikers.app.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ReportRequest {
    private String module; // SALES, DELIVERY, INVENTORY, USERS
    private String periodType; // DAILY, MONTHLY, YEARLY, CUSTOM
    private LocalDate startDate;
    private LocalDate endDate;
    private String statusFilter; // Filtro opcional (ej. para Domicilios)
}
