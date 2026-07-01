package com.snikers.app.service;

import com.snikers.app.model.*;
import com.snikers.app.repository.OrderRepository;
import com.snikers.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import java.util.stream.Collectors;
import java.util.LinkedHashMap;
import java.util.Comparator;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final UserRepository userRepository;
    private final com.snikers.app.repository.ProductRepository productRepository;

    /**
     * Obtiene el total gastado y el número de pedidos de un usuario.
     */
    public Map<String, Object> getUserOrderStats(Long userId) {
        List<Object[]> results = orderRepository.getUserOrderStats(userId);
        Map<String, Object> stats = new HashMap<>();

        if (!results.isEmpty() && results.get(0)[0] != null) {
            Object[] result = results.get(0);
            stats.put("totalSpent", (BigDecimal) result[0]);
            stats.put("orderCount", (Long) result[1]);
        } else {
            stats.put("totalSpent", BigDecimal.ZERO);
            stats.put("orderCount", 0L);
        }
        return stats;
    }

    @Transactional
    public Order createOrder(Long userId, String shippingAddress, String paymentMethod,
            String couponCode, BigDecimal discountPercent) {
        Cart cart = cartService.getCartByUserId(userId);
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate stock and deduct
        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }

        Order order = Order.builder()
                .user(user)
                .shippingAddress(shippingAddress)
                .paymentMethod(paymentMethod)
                .status(Order.Status.PENDING)
                .couponCode(couponCode)
                .discountPercent(discountPercent)
                .build();

        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            return OrderItem.builder()
                    .order(order)
                    .product(cartItem.getProduct())
                    .quantity(cartItem.getQuantity())
                    .price(cartItem.getProduct().getPrice())
                    .size(cartItem.getSize())
                    .color(cartItem.getColor())
                    .build();
        }).collect(Collectors.toList());

        order.setItems(orderItems);

        // Calculate subtotal (before discount)
        BigDecimal subtotal = orderItems.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate discount amount
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (discountPercent != null && discountPercent.compareTo(BigDecimal.ZERO) > 0) {
            discountAmount = subtotal.multiply(discountPercent.divide(BigDecimal.valueOf(100)));
        }

        // Calculate final total (subtotal - discount)
        BigDecimal totalAmount = subtotal.subtract(discountAmount);

        order.setSubtotal(subtotal);
        order.setDiscountAmount(discountAmount);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        // Clear cart after order
        cartService.clearCart(userId);

        return savedOrder;
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public java.util.Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order updateOrderStatus(Long orderId, Order.Status status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public Map<String, Double> getSalesByMonth() {
        return orderRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        order -> order.getOrderDate().getMonth().toString(),
                        Collectors.summingDouble(order -> order.getTotalAmount().doubleValue())));
    }

    public List<Order> getRecentOrders(int limit) {
        return orderRepository
                .findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC,
                        "orderDate"))
                .stream()
                .limit(limit)
                .collect(Collectors.toList());
    }

    public Map<String, Long> getTopCategories(int limit) {
        return orderRepository.findAll().stream()
                .flatMap(order -> order.getItems().stream())
                .collect(Collectors.groupingBy(
                        item -> item.getProduct().getCategory().getName(),
                        Collectors.summingLong(OrderItem::getQuantity)))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(limit)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        java.util.LinkedHashMap::new));
    }

    public Map<String, Object> getSalesToday() {
        java.time.LocalDate today = java.time.LocalDate.now();
        java.time.LocalDateTime startOfDay = today.atStartOfDay();
        java.time.LocalDateTime endOfDay = today.atTime(java.time.LocalTime.MAX);

        List<Order> ordersToday = orderRepository.findAll().stream()
                .filter(order -> {
                    java.time.LocalDateTime orderDate = order.getOrderDate();
                    return orderDate.isAfter(startOfDay) && orderDate.isBefore(endOfDay);
                })
                .collect(Collectors.toList());

        double totalAmount = ordersToday.stream()
                .mapToDouble(order -> order.getTotalAmount().doubleValue())
                .sum();

        Map<String, Object> result = new HashMap<>();
        result.put("totalAmount", totalAmount);
        result.put("count", ordersToday.size());

        return result;
    }

    public Map<String, Long> getOrderStats() {
        List<Order> allOrders = orderRepository.findAll();
        Map<String, Long> stats = new HashMap<>();

        stats.put("total", (long) allOrders.size());
        stats.put("pending", allOrders.stream().filter(o -> o.getStatus() == Order.Status.PENDING).count());
        stats.put("delivered", allOrders.stream().filter(o -> o.getStatus() == Order.Status.DELIVERED).count());
        stats.put("cancelled", allOrders.stream().filter(o -> o.getStatus() == Order.Status.CANCELLED).count());

        return stats;
    }

    public org.springframework.data.domain.Page<Order> getAllOrders(org.springframework.data.domain.Pageable pageable,
            String status, String search, LocalDate startDate, LocalDate endDate) {
        return orderRepository.findAll((root, query, cb) -> {
            java.util.List<jakarta.persistence.criteria.Predicate> predicates = new java.util.ArrayList<>();

            if (status != null && !status.isEmpty() && !status.equals("todas")) {
                Order.Status orderStatus = Order.Status.valueOf(status.toUpperCase());
                if (orderStatus == Order.Status.DELIVERED) {
                    predicates.add(root.get("status").in(Order.Status.DELIVERED, Order.Status.COMPLETED));
                } else {
                    predicates.add(cb.equal(root.get("status"), orderStatus));
                }
            }

            if (search != null && !search.isEmpty()) {
                String searchLike = "%" + search.toLowerCase() + "%";
                jakarta.persistence.criteria.Predicate userEmailPredicate = cb
                        .like(cb.lower(root.get("user").get("email")), searchLike);
                predicates.add(userEmailPredicate);
            }

            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("orderDate"), startDate.atStartOfDay()));
            }

            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("orderDate"), endDate.atTime(java.time.LocalTime.MAX)));
            }

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        }, pageable);
    }

    /**
     * Obtiene TODOS los datos del reporte (KPIs + Gráficos) con la estructura
     * solicitada.
     */
    public Map<String, Object> getReportData(LocalDate startDate, LocalDate endDate) {
        Map<String, Object> response = new HashMap<>();

        // 1. Definir periodos (Actual vs Anterior)
        if (startDate == null)
            startDate = LocalDate.now().with(TemporalAdjusters.firstDayOfMonth());
        if (endDate == null)
            endDate = LocalDate.now();

        long days = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate);
        LocalDate prevStartDate = startDate.minusDays(days + 1);
        LocalDate prevEndDate = startDate.minusDays(1);

        // 2. Obtener listas de pedidos
        List<Order> currentOrders = getOrdersInDateRange(startDate, endDate);
        List<Order> prevOrders = getOrdersInDateRange(prevStartDate, prevEndDate);

        // 3. Calcular KPIs
        Map<String, Object> kpis = new HashMap<>();

        // Ventas
        BigDecimal currentSales = currentOrders.stream().map(Order::getTotalAmount).reduce(BigDecimal.ZERO,
                BigDecimal::add);
        BigDecimal prevSales = prevOrders.stream().map(Order::getTotalAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        kpis.put("sales", Map.of(
                "current", currentSales,
                "growth", calculateGrowth(currentSales.doubleValue(), prevSales.doubleValue())));

        // Pedidos
        long currentCount = currentOrders.size();
        long prevCount = prevOrders.size();
        kpis.put("orders", Map.of(
                "current", currentCount,
                "growth", calculateGrowth((double) currentCount, (double) prevCount)));

        // Ticket Promedio
        double avgTicket = currentCount > 0 ? currentSales.doubleValue() / currentCount : 0.0;
        double prevAvgTicket = prevCount > 0 ? prevSales.doubleValue() / prevCount : 0.0;
        kpis.put("ticket", Map.of(
                "current", avgTicket,
                "growth", calculateGrowth(avgTicket, prevAvgTicket)));

        response.put("kpis", kpis);

        // 4. Generar Datos para Gráficos (Solo del periodo actual)
        Map<String, Object> charts = new HashMap<>();

        // Tendencia (Agrupado por Fecha)
        Map<String, Double> salesTrend = currentOrders.stream()
                .sorted(Comparator.comparing(Order::getOrderDate))
                .collect(Collectors.groupingBy(
                        o -> o.getOrderDate().toLocalDate().toString(),
                        LinkedHashMap::new,
                        Collectors.summingDouble(o -> o.getTotalAmount().doubleValue())));
        charts.put("trend", Map.of("labels", salesTrend.keySet(), "data", salesTrend.values()));

        // Top Productos
        Map<String, Long> topProducts = currentOrders.stream()
                .flatMap(o -> o.getItems().stream())
                .collect(Collectors.groupingBy(
                        i -> i.getProduct().getName(),
                        Collectors.summingLong(OrderItem::getQuantity)))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new));
        charts.put("topProducts", Map.of("labels", topProducts.keySet(), "data", topProducts.values()));

        // Estados
        Map<String, Long> statusMap = currentOrders.stream()
                .collect(Collectors.groupingBy(
                        o -> o.getStatus().toString(),
                        Collectors.counting()));
        charts.put("orderStatus", Map.of("labels", statusMap.keySet(), "data", statusMap.values()));

        response.put("charts", charts);

        return response;
    }

    private List<Order> getOrdersInDateRange(LocalDate start, LocalDate end) {
        // Filtrar orders en memoria (o usar una @Query en repo si es mucho volumen)
        LocalDateTime startDateTime = start.atStartOfDay();
        LocalDateTime endDateTime = end.atTime(java.time.LocalTime.MAX);

        return orderRepository.findAll().stream()
                .filter(o -> !o.getOrderDate().isBefore(startDateTime) && !o.getOrderDate().isAfter(endDateTime))
                .filter(o -> o.getStatus() != Order.Status.CANCELLED) // Solo ventas válidas
                .collect(Collectors.toList());
    }

    private double calculateGrowth(double current, double previous) {
        if (previous == 0)
            return current > 0 ? 100.0 : 0.0;
        return ((current - previous) / previous) * 100.0;
    }

    /**
     * Genera un PDF con el reporte de ventas.
     */
    public byte[] generatePdfReport(LocalDate startDate, LocalDate endDate) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);
            document.open();

            // Estilos
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.BLACK);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.WHITE);

            // Título
            Paragraph title = new Paragraph("Reporte de Ventas - SNIKER", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph("Generado: " + LocalDate.now()));
            document.add(new Paragraph("Periodo: " + (startDate != null ? startDate : "Inicio") + " a "
                    + (endDate != null ? endDate : "Hoy")));
            document.add(Chunk.NEWLINE);

            // Tabla
            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new float[] { 1, 3, 2, 2, 2 });

            // Cabeceras
            String[] headers = { "ID", "Fecha", "Cliente", "Estado", "Total" };
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
                cell.setBackgroundColor(Color.DARK_GRAY);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                cell.setPadding(5);
                table.addCell(cell);
            }

            // Datos
            List<Order> orders = getOrdersInDateRange(startDate != null ? startDate : LocalDate.now().minusMonths(1),
                    endDate != null ? endDate : LocalDate.now());

            for (Order order : orders) {
                table.addCell(String.valueOf(order.getId()));
                table.addCell(order.getOrderDate().toLocalDate().toString());
                table.addCell(order.getUser() != null ? order.getUser().getName() : "N/A");
                table.addCell(order.getStatus().toString());
                table.addCell("$ " + order.getTotalAmount().toString());
            }

            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error al generar PDF", e);
        }
    }

    /**
     * Validates stock availability before creating/updating an order.
     */
    private void validateStockAvailability(Product product, int quantity) {
        if (product.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock for product: " + product.getName() +
                    ". Available: " + product.getStock() + ", Requested: " + quantity);
        }
    }

    /**
     * Creates an order from admin panel without requiring a cart.
     * Simplified version for manual order creation.
     */
    @Transactional
    public Order createOrderFromAdmin(String customerEmail, String productName, int quantity, Order.Status status) {
        // Find or create user by email
        User user = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + customerEmail));

        // Find product by name
        Product product = productRepository.findAll().stream()
                .filter(p -> p.getName().equalsIgnoreCase(productName))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Product not found: " + productName));

        // Validate stock availability
        validateStockAvailability(product, quantity);

        // Create order
        Order order = Order.builder()
                .user(user)
                .status(status != null ? status : Order.Status.PENDING)
                .shippingAddress("Admin created order")
                .paymentMethod("Admin")
                .build();

        // Create order item
        OrderItem orderItem = OrderItem.builder()
                .order(order)
                .product(product)
                .quantity(quantity)
                .price(product.getPrice())
                .build();

        order.setItems(List.of(orderItem));

        // Calculate totals
        BigDecimal total = product.getPrice().multiply(BigDecimal.valueOf(quantity));
        order.setSubtotal(total);
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setTotalAmount(total);

        // Deduct stock
        product.setStock(product.getStock() - quantity);
        productRepository.save(product);

        // Save order
        return orderRepository.save(order);
    }

    /**
     * Updates an order from admin panel with stock recalculation.
     */
    @Transactional
    public Order updateOrderFromAdmin(Long orderId, String productName, int newQuantity, Order.Status newStatus,
            String shippingAddress) {
        // Get existing order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        // Get the first item (admin orders have only one product)
        if (order.getItems().isEmpty()) {
            throw new RuntimeException("Order has no items");
        }

        OrderItem orderItem = order.getItems().get(0);
        Product product = orderItem.getProduct();
        int oldQuantity = orderItem.getQuantity();

        // If product name changed, find new product
        if (!product.getName().equalsIgnoreCase(productName)) {
            // Restore stock for old product
            product.setStock(product.getStock() + oldQuantity);
            productRepository.save(product);

            // Find new product
            product = productRepository.findAll().stream()
                    .filter(p -> p.getName().equalsIgnoreCase(productName))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Product not found: " + productName));

            // Validate and deduct stock for new product
            validateStockAvailability(product, newQuantity);
            product.setStock(product.getStock() - newQuantity);
            productRepository.save(product);

            // Update order item
            orderItem.setProduct(product);
            orderItem.setPrice(product.getPrice());
        } else {
            // Same product, calculate difference
            int quantityDifference = newQuantity - oldQuantity;

            if (quantityDifference > 0) {
                // Increasing quantity - check stock and deduct
                validateStockAvailability(product, quantityDifference);
                product.setStock(product.getStock() - quantityDifference);
            } else if (quantityDifference < 0) {
                // Decreasing quantity - restore stock
                product.setStock(product.getStock() + Math.abs(quantityDifference));
            }
            productRepository.save(product);
        }

        // Update order item quantity
        orderItem.setQuantity(newQuantity);

        // Recalculate totals
        BigDecimal total = orderItem.getPrice().multiply(BigDecimal.valueOf(newQuantity));
        order.setSubtotal(total);
        order.setTotalAmount(total);

        // Update shipping address if provided
        if (shippingAddress != null && !shippingAddress.isEmpty()) {
            order.setShippingAddress(shippingAddress);
        }

        // Update status
        order.setStatus(newStatus);

        // Save and return
        return orderRepository.save(order);
    }

    /**
     * Soft deletes an order by changing status to CANCELLED and restoring stock.
     */
    @Transactional
    public Order cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        // Only cancel if not already cancelled
        if (order.getStatus() == Order.Status.CANCELLED) {
            throw new RuntimeException("Order is already cancelled");
        }

        // Restore stock for all items
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        // Change status to CANCELLED
        order.setStatus(Order.Status.CANCELLED);
        return orderRepository.save(order);
    }

    /**
     * Hard deletes an order (for admin cleanup - restores stock first).
     */
    @Transactional
    public void deleteOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        // Restore stock before deleting
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        orderRepository.delete(order);
    }

    /**
     * Submit a refund request for an order.
     */
    public Order requestRefund(Long orderId, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setRefundRequested(true);
        order.setRefundReason(reason);
        order.setRefundStatus("PENDING");

        return orderRepository.save(order);
    }

    /**
     * Get all orders with refund requested.
     */
    public List<Order> getRefundRequests() {
        return orderRepository.findAll().stream()
                .filter(o -> Boolean.TRUE.equals(o.getRefundRequested()))
                .collect(Collectors.toList());
    }

    /**
     * Process refund response from admin.
     */
    public Order respondRefund(Long orderId, String status, String response) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if ("APPROVED".equals(order.getRefundStatus()) || "REJECTED".equals(order.getRefundStatus())) {
            throw new RuntimeException("Refund request already finalized");
        }

        order.setRefundStatus(status);
        order.setRefundResponse(response);

        // Si el reembolso es APROBADO, cancelar el pedido y restaurar el stock
        if ("APPROVED".equals(status)) {
            order.setStatus(Order.Status.CANCELLED);
            // Restaurar stock de cada producto del pedido
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    Product product = item.getProduct();
                    if (product != null) {
                        product.setStock(product.getStock() + item.getQuantity());
                        productRepository.save(product);
                    }
                }
            }
        }

        return orderRepository.save(order);
    }
}
