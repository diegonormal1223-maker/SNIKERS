package com.snikers.app.service;

import com.snikers.app.dto.ReportRequest;
import com.snikers.app.model.Order;
import com.snikers.app.model.OrderItem;
import com.snikers.app.model.Product;
import com.snikers.app.model.User;
import com.snikers.app.repository.OrderRepository;
import com.snikers.app.repository.ProductRepository;
import com.snikers.app.repository.UserRepository;
import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Image;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    // --- DASHBOARD DATA (KPIs y Gráficos) ---
    public Map<String, Object> getDashboardData(LocalDate start, LocalDate end) {
        if (start == null) {
            start = LocalDate.now().with(TemporalAdjusters.firstDayOfMonth());
        }
        if (end == null) {
            end = LocalDate.now();
        }

        // Calcular periodo anterior exacto
        long days = ChronoUnit.DAYS.between(start, end);
        LocalDate prevStart = start.minusDays(days + 1);
        LocalDate prevEnd = start.minusDays(1);

        Map<String, Object> response = new HashMap<>();

        // 1. Obtener listas de datos
        List<Order> currentOrders = getOrdersInRange(start, end);
        List<Order> prevOrders = getOrdersInRange(prevStart, prevEnd);
        List<User> currentUsers = getUsersInRange(start, end);
        List<User> prevUsers = getUsersInRange(prevStart, prevEnd);
        List<User> allUsers = userRepository.findAll();

        // 2. KPI: Ingresos Totales (Ventas)
        double curSales = currentOrders.stream()
                .mapToDouble(o -> o.getTotalAmount().doubleValue())
                .sum();
        double prevSales = prevOrders.stream()
                .mapToDouble(o -> o.getTotalAmount().doubleValue())
                .sum();
        response.put("kpiIncome", createKpi(curSales, calculateGrowth(curSales, prevSales)));

        // 3. KPI: Pedidos
        long curCount = currentOrders.size();
        long prevCount = prevOrders.size();
        double avgTicket = curCount > 0 ? curSales / curCount : 0;
        Map<String, Object> kpiOrders = createKpi((double) curCount, calculateGrowth(curCount, prevCount));
        kpiOrders.put("avgTicket", avgTicket);
        response.put("kpiOrders", kpiOrders);

        // 4. KPI: Nuevos Clientes
        long curUsers = currentUsers.size();
        long prevUsersCount = prevUsers.size();
        response.put("kpiUsers", createKpi((double) curUsers, calculateGrowth(curUsers, prevUsersCount)));

        // 5. KPI: Tasa de Conversión (nuevos clientes / usuarios totales * 100)
        double conversionRate = allUsers.size() > 0 ? (curUsers * 100.0) / allUsers.size() : 0;
        double prevConversionRate = allUsers.size() > 0 ? (prevUsersCount * 100.0) / allUsers.size() : 0;
        Map<String, Object> kpiConversion = createKpi(conversionRate,
                calculateGrowth(conversionRate, prevConversionRate));
        kpiConversion.put("totalVisitors", allUsers.size());
        kpiConversion.put("newCustomers", curUsers);
        response.put("kpiConversion", kpiConversion);

        // 6. Gráfico: Ventas por día
        Map<String, Double> salesChart = currentOrders.stream()
                .collect(Collectors.groupingBy(
                        o -> o.getOrderDate().toLocalDate().toString(),
                        Collectors.summingDouble(o -> o.getTotalAmount().doubleValue())));
        response.put("salesChart", sortMapByKey(salesChart));

        // 7. Gráfico: Ventas por Categoría
        response.put("salesByCategory", getSalesByCategory(start, end));

        // 8. Top Productos Más Vendidos (con detalles completos)
        response.put("topProducts", getTopProducts(start, end, 5));

        // 9. Productos con Bajo Rendimiento
        response.put("lowPerformingProducts", getLowPerformingProducts(start, end, 5));

        // 10. Tabla Transacciones Recientes (Últimas 5 del periodo)
        List<Map<String, Object>> transactions = currentOrders.stream()
                .sorted(Comparator.comparing(Order::getOrderDate).reversed())
                .limit(5)
                .map(this::mapOrderToTransaction)
                .collect(Collectors.toList());
        response.put("recentTransactions", transactions);

        return response;
    }

    // --- VENTAS POR CATEGORÍA ---
    public Map<String, Object> getSalesByCategory(LocalDate start, LocalDate end) {
        List<Order> orders = getOrdersInRange(start, end);

        Map<String, Double> categoryRevenue = new HashMap<>();

        orders.stream()
                .flatMap(o -> o.getItems().stream())
                .forEach(item -> {
                    String categoryName = item.getProduct().getCategory() != null
                            ? item.getProduct().getCategory().getName()
                            : "Sin Categoría";
                    double revenue = item.getPrice().doubleValue() * item.getQuantity();
                    categoryRevenue.merge(categoryName, revenue, Double::sum);
                });

        // Calcular porcentajes
        double total = categoryRevenue.values().stream().mapToDouble(Double::doubleValue).sum();
        Map<String, Object> result = new HashMap<>();
        Map<String, Double> percentages = new HashMap<>();

        categoryRevenue.forEach((category, revenue) -> {
            double percentage = total > 0 ? (revenue / total) * 100 : 0;
            percentages.put(category, percentage);
        });

        result.put("data", categoryRevenue);
        result.put("percentages", percentages);
        return result;
    }

    // --- TOP PRODUCTOS MÁS VENDIDOS ---
    public List<Map<String, Object>> getTopProducts(LocalDate start, LocalDate end, int limit) {
        List<Order> orders = getOrdersInRange(start, end);

        Map<Long, ProductSales> productSalesMap = new HashMap<>();

        orders.stream()
                .flatMap(o -> o.getItems().stream())
                .forEach(item -> {
                    Long productId = item.getProduct().getId();
                    productSalesMap.compute(productId, (k, v) -> {
                        if (v == null) {
                            v = new ProductSales();
                            v.product = item.getProduct();
                        }
                        v.unitsSold += item.getQuantity();
                        v.revenue += item.getPrice().doubleValue() * item.getQuantity();
                        return v;
                    });
                });

        return productSalesMap.values().stream()
                .sorted(Comparator.comparing((ProductSales ps) -> ps.revenue).reversed())
                .limit(limit)
                .map(ps -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("productId", ps.product.getId());
                    map.put("name", ps.product.getName());
                    map.put("imageUrl", ps.product.getImageUrl());
                    map.put("unitsSold", ps.unitsSold);
                    map.put("revenue", ps.revenue);
                    return map;
                })
                .collect(Collectors.toList());
    }

    // --- PRODUCTOS CON BAJO RENDIMIENTO ---
    public List<Map<String, Object>> getLowPerformingProducts(LocalDate start, LocalDate end, int limit) {
        List<Order> orders = getOrdersInRange(start, end);
        List<Product> allProducts = productRepository.findAll();

        Map<Long, ProductSales> productSalesMap = new HashMap<>();

        // Inicializar todos los productos con ventas 0
        allProducts.forEach(product -> {
            ProductSales ps = new ProductSales();
            ps.product = product;
            ps.unitsSold = 0;
            ps.revenue = 0;
            productSalesMap.put(product.getId(), ps);
        });

        // Actualizar con ventas reales
        orders.stream()
                .flatMap(o -> o.getItems().stream())
                .forEach(item -> {
                    Long productId = item.getProduct().getId();
                    ProductSales ps = productSalesMap.get(productId);
                    if (ps != null) {
                        ps.unitsSold += item.getQuantity();
                        ps.revenue += item.getPrice().doubleValue() * item.getQuantity();
                    }
                });

        // Productos con menor rendimiento (solo productos activos)
        return productSalesMap.values().stream()
                .filter(ps -> ps.product.getStatus() == Product.Status.ACTIVE)
                .sorted(Comparator.comparing((ProductSales ps) -> ps.revenue))
                .limit(limit)
                .map(ps -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("productId", ps.product.getId());
                    map.put("name", ps.product.getName());
                    map.put("imageUrl", ps.product.getImageUrl());
                    map.put("unitsSold", ps.unitsSold);
                    map.put("revenue", ps.revenue);
                    map.put("stock", ps.product.getStock());
                    return map;
                })
                .collect(Collectors.toList());
    }

    // Clase interna para tracking de ventas por producto
    private static class ProductSales {
        Product product;
        long unitsSold = 0;
        double revenue = 0;
    }

    // --- GENERADOR DE PDF ---
    public byte[] generateCustomPdf(ReportRequest request) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, out);
            document.open();

            // Colores de Marca
            Color darkBg = new Color(22, 22, 31);
            Color neonGreen = new Color(57, 255, 20);
            Color neonPurple = new Color(176, 38, 255);

            // --- ENCABEZADO ---
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[] { 1, 2 });
            headerTable.setSpacingAfter(20);

            // Logo / Branding
            PdfPCell brandingCell = new PdfPCell();
            brandingCell.setBackgroundColor(darkBg);
            brandingCell.setBorder(0);
            brandingCell.setPadding(20);
            brandingCell.setVerticalAlignment(Element.ALIGN_MIDDLE);

            try {
                // Intento cargar la imagen desde el classpath
                String imagePath = "static/img/logo-pdf.png";
                Image logo = Image.getInstance(getClass().getClassLoader().getResource(imagePath));
                logo.scaleToFit(140, 60); // Ajustar tamaño
                brandingCell.addElement(logo);
            } catch (Exception e) {
                // Fallback a texto si no carga la imagen
                Paragraph logoText = new Paragraph("SNIKER",
                        FontFactory.getFont(FontFactory.HELVETICA_BOLD, 28, neonGreen));
                brandingCell.addElement(logoText);
            }
            headerTable.addCell(brandingCell);

            // Título del Reporte
            PdfPCell titleCell = new PdfPCell();
            titleCell.setBackgroundColor(darkBg);
            titleCell.setBorder(0);
            titleCell.setPadding(20);
            titleCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            titleCell.setVerticalAlignment(Element.ALIGN_MIDDLE);

            String moduleName = "General";
            if ("SALES".equals(request.getModule()))
                moduleName = "Ventas";
            else if ("DELIVERY".equals(request.getModule()))
                moduleName = "Domicilios";
            else if ("USERS".equals(request.getModule()))
                moduleName = "Usuarios";
            else if ("INVENTORY".equals(request.getModule()))
                moduleName = "Inventario";

            Paragraph reportTitle = new Paragraph("Reporte de " + moduleName,
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.WHITE));
            reportTitle.setAlignment(Element.ALIGN_RIGHT);
            titleCell.addElement(reportTitle);

            String dateInfoText;
            if ("INVENTORY".equals(request.getModule())) {
                dateInfoText = "Fecha de corte: "
                        + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            } else if (request.getStartDate() != null && request.getEndDate() != null) {
                dateInfoText = "Rango: " + request.getStartDate() + " al " + request.getEndDate();
            } else {
                dateInfoText = "Fecha: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            }

            Paragraph dateInfo = new Paragraph(dateInfoText,
                    FontFactory.getFont(FontFactory.HELVETICA, 12, neonPurple));
            dateInfo.setAlignment(Element.ALIGN_RIGHT);
            titleCell.addElement(dateInfo);

            headerTable.addCell(titleCell);
            document.add(headerTable);

            // Decoración (Línea Neón)
            PdfPTable lineTable = new PdfPTable(1);
            lineTable.setWidthPercentage(100);
            PdfPCell lineCell = new PdfPCell();
            lineCell.setBackgroundColor(neonGreen);
            lineCell.setFixedHeight(2);
            lineCell.setBorder(0);
            lineTable.addCell(lineCell);
            document.add(lineTable);
            document.add(Chunk.NEWLINE);

            // --- TABLA DE DATOS ---
            PdfPTable table;
            if ("DELIVERY".equals(request.getModule())) {
                table = createDeliveryTable(request, neonGreen, darkBg);
            } else if ("USERS".equals(request.getModule())) {
                table = createUserTable(request, neonGreen, darkBg);
            } else if ("INVENTORY".equals(request.getModule())) {
                table = createInventoryTable(neonGreen, darkBg);
            } else {
                table = createSalesTable(request, neonGreen, darkBg);
            }

            document.add(table);

            // --- PIE DE PÁGINA ---
            document.add(Chunk.NEWLINE);
            String footerText = "Generado el: "
                    + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
            Paragraph footer = new Paragraph(footerText,
                    FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10, Color.GRAY));
            footer.setAlignment(Element.ALIGN_RIGHT);
            document.add(footer);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error al generar PDF", e);
        }
    }

    // --- MÉTODOS PRIVADOS DE SOPORTE ---

    private PdfPTable createSalesTable(ReportRequest request, Color accent, Color bg) {
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setWidths(new float[] { 1.5f, 2, 3, 2, 2 });
        addHeader(table, accent, bg, "ID Pedido", "Fecha", "Cliente", "Estado", "Total");

        List<Order> orders = getOrdersInRange(request.getStartDate(), request.getEndDate());
        boolean shade = false;

        for (Order o : orders) {
            Color rowColor = shade ? new Color(245, 245, 245) : Color.WHITE;
            addCell(table, "#" + o.getId(), rowColor);
            addCell(table, o.getOrderDate().toLocalDate().toString(), rowColor);
            addCell(table, o.getUser() != null ? o.getUser().getName() : "N/A", rowColor);

            // Estado con color simbólico (solo texto para simplificar)
            addCell(table, o.getStatus().toString(), rowColor);

            addCell(table, "$" + o.getTotalAmount(), rowColor, true); // Bold amount
            shade = !shade;
        }
        return table;
    }

    private PdfPTable createDeliveryTable(ReportRequest request, Color accent, Color bg) {
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setWidths(new float[] { 1, 3, 4, 2, 2 });
        addHeader(table, accent, bg, "ID", "Cliente", "Dirección", "Estado", "Fecha");

        List<Order> orders = getOrdersInRange(request.getStartDate(), request.getEndDate());
        if (request.getStatusFilter() != null && !request.getStatusFilter().equals("ALL")) {
            orders = orders.stream()
                    .filter(o -> o.getStatus().toString().equals(request.getStatusFilter()))
                    .collect(Collectors.toList());
        }

        boolean shade = false;
        for (Order o : orders) {
            Color rowColor = shade ? new Color(245, 245, 245) : Color.WHITE;
            addCell(table, "#" + o.getId(), rowColor);
            addCell(table, o.getUser() != null ? o.getUser().getName() : "N/A", rowColor);
            addCell(table, o.getShippingAddress() != null ? o.getShippingAddress() : "N/A", rowColor);
            addCell(table, o.getStatus().toString(), rowColor);
            addCell(table, o.getOrderDate().toLocalDate().toString(), rowColor);
            shade = !shade;
        }
        return table;
    }

    private PdfPTable createUserTable(ReportRequest request, Color accent, Color bg) {
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[] { 1, 3, 4, 2 });
        addHeader(table, accent, bg, "ID", "Nombre", "Email", "Fecha Registro");

        List<User> users = getUsersInRange(request.getStartDate(), request.getEndDate());
        boolean shade = false;
        for (User u : users) {
            Color rowColor = shade ? new Color(245, 245, 245) : Color.WHITE;
            addCell(table, String.valueOf(u.getId()), rowColor);
            addCell(table, u.getName(), rowColor);
            addCell(table, u.getEmail(), rowColor);
            addCell(table, u.getCreatedAt() != null ? u.getCreatedAt().toLocalDate().toString() : "-", rowColor);
            shade = !shade;
        }
        return table;
    }

    private PdfPTable createInventoryTable(Color accent, Color bg) {
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[] { 2, 4, 2, 2 });
        addHeader(table, accent, bg, "SKU", "Producto", "Stock", "Precio");

        List<Product> products = productRepository.findAll();
        boolean shade = false;
        for (Product p : products) {
            Color rowColor = shade ? new Color(245, 245, 245) : Color.WHITE;
            addCell(table, p.getSku() != null ? p.getSku() : "N/A", rowColor);
            addCell(table, p.getName(), rowColor);
            addCell(table, String.valueOf(p.getStock()), rowColor);
            addCell(table, "$" + p.getPrice(), rowColor);
            shade = !shade;
        }
        return table;
    }

    private void addHeader(PdfPTable table, Color accent, Color bg, String... headers) {
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, accent)));
            cell.setBackgroundColor(bg);
            cell.setPadding(8);
            cell.setPaddingBottom(10);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setBorderColor(new Color(57, 255, 20)); // Neon green border
            cell.setBorderWidthBottom(2f);
            table.addCell(cell);
        }
    }

    private void addCell(PdfPTable table, String text, Color bg) {
        addCell(table, text, bg, false);
    }

    private void addCell(PdfPTable table, String text, Color bg, boolean bold) {
        Font font = bold ? FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10)
                : FontFactory.getFont(FontFactory.HELVETICA, 10);
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBackgroundColor(bg);
        cell.setPadding(6);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setBorderColor(Color.LIGHT_GRAY);
        table.addCell(cell);
    }

    private List<Order> getOrdersInRange(LocalDate start, LocalDate end) {
        LocalDateTime startDt = start.atStartOfDay();
        LocalDateTime endDt = end.atTime(23, 59, 59);
        return orderRepository.findAll().stream()
                .filter(o -> !o.getOrderDate().isBefore(startDt) && !o.getOrderDate().isAfter(endDt))
                .filter(o -> o.getStatus() != Order.Status.CANCELLED)
                .collect(Collectors.toList());
    }

    private List<User> getUsersInRange(LocalDate start, LocalDate end) {
        LocalDateTime startDt = start.atStartOfDay();
        LocalDateTime endDt = end.atTime(23, 59, 59);
        return userRepository.findAll().stream()
                .filter(u -> u.getCreatedAt() != null
                        && !u.getCreatedAt().isBefore(startDt)
                        && !u.getCreatedAt().isAfter(endDt))
                .collect(Collectors.toList());
    }

    private double calculateGrowth(double current, double previous) {
        if (previous == 0) {
            return current > 0 ? 100.0 : 0.0;
        }
        return ((current - previous) / previous) * 100.0;
    }

    private Map<String, Object> createKpi(double value, double growth) {
        Map<String, Object> kpi = new HashMap<>();
        kpi.put("value", value);
        kpi.put("growth", growth);
        return kpi;
    }

    private Map<String, Object> mapOrderToTransaction(Order o) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", "#ORD-" + o.getId());
        map.put("customer", o.getUser() != null ? o.getUser().getName() : "Cliente");
        map.put("product", o.getItems().isEmpty() ? "N/A" : o.getItems().get(0).getProduct().getName());
        map.put("date", o.getOrderDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm")));
        map.put("amount", o.getTotalAmount());
        map.put("status", o.getStatus().toString());
        return map;
    }

    private Map<String, Double> sortMapByKey(Map<String, Double> map) {
        return map.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new));
    }
}
