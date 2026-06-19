package com.snikers.app.controller;

import com.snikers.app.dto.ReportRequest;
import com.snikers.app.model.Order;
import com.snikers.app.model.Product;
import com.snikers.app.model.Category;
import com.snikers.app.model.User;
import com.snikers.app.service.OrderService;
import com.snikers.app.service.ProductService;
import com.snikers.app.service.ReportService;
import com.snikers.app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

        private final UserService userService;
        private final ProductService productService;
        private final OrderService orderService;
        private final ReportService reportService;

        // --- DASHBOARD & STATS ---

        @GetMapping("/stats")
        public ResponseEntity<Map<String, Object>> getDashboardStats() {
                Map<String, Object> stats = new HashMap<>();
                stats.put("totalUsers", userService.countUsersByRole(User.Role.USER));
                stats.put("totalProducts", productService.getAllProducts().size());

                List<Order> allOrders = orderService.getAllOrders();
                stats.put("totalOrders", allOrders.size());

                double totalSales = allOrders.stream()
                                .mapToDouble(order -> order.getTotalAmount().doubleValue())
                                .sum();
                stats.put("totalSales", totalSales);

                // Delivery Stats
                Map<String, Long> deliveryStats = new HashMap<>();
                deliveryStats.put("total", (long) allOrders.size());
                deliveryStats.put("pending", allOrders.stream().filter(
                                o -> o.getStatus() == Order.Status.PENDING || o.getStatus() == Order.Status.PAID)
                                .count());
                deliveryStats.put("transit", allOrders.stream().filter(
                                o -> o.getStatus() == Order.Status.SHIPPED || o.getStatus() == Order.Status.IN_TRANSIT)
                                .count());
                deliveryStats.put("delivered",
                                allOrders.stream().filter(o -> o.getStatus() == Order.Status.DELIVERED || o.getStatus() == Order.Status.COMPLETED).count());
                deliveryStats.put("cancelled",
                                allOrders.stream().filter(o -> o.getStatus() == Order.Status.CANCELLED).count());
                stats.put("deliveryStats", deliveryStats);

                // Charts & Tables Data
                stats.put("recentOrders", orderService.getRecentOrders(5));
                stats.put("salesByMonth", orderService.getSalesByMonth());
                stats.put("topCategories", orderService.getTopCategories(5));

                return ResponseEntity.ok(stats);
        }

        // --- REPORTES AVANZADOS ---

        @GetMapping("/reports/dashboard")
        public ResponseEntity<Map<String, Object>> getReportDashboard(
                        @RequestParam(defaultValue = "SALES") String module,
                        @RequestParam(required = false) String startDate,
                        @RequestParam(required = false) String endDate) {

                // Validación de fechas vacías
                LocalDate start = (startDate != null && !startDate.isEmpty()) ? LocalDate.parse(startDate) : null;
                LocalDate end = (endDate != null && !endDate.isEmpty()) ? LocalDate.parse(endDate) : null;

                return ResponseEntity.ok(reportService.getDashboardData(start, end));
        }

        @PostMapping("/reports/export/pdf")
        public ResponseEntity<byte[]> exportReportPdf(@RequestBody ReportRequest request) {
                byte[] pdfBytes = reportService.generateCustomPdf(request);

                return ResponseEntity.ok()
                                .header(HttpHeaders.CONTENT_DISPOSITION,
                                                "attachment; filename=reporte_" + request.getModule().toLowerCase()
                                                                + ".pdf")
                                .contentType(MediaType.APPLICATION_PDF)
                                .body(pdfBytes);
        }

        // --- GESTIÓN DE USUARIOS ---

        @GetMapping("/users")
        public ResponseEntity<Page<User>> getAllUsers(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        @RequestParam(required = false) String search,
                        @RequestParam(required = false) String role,
                        @RequestParam(required = false) String status) {
                Pageable pageable = PageRequest.of(page, size);
                return ResponseEntity.ok(userService.getAllUsers(pageable, search, role, status));
        }

        @GetMapping("/users/{id}")
        public ResponseEntity<User> getUserById(@PathVariable Long id) {
                return userService.getUserById(id)
                                .map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
        }

        @PutMapping("/users/{id}/status")
        public ResponseEntity<User> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
                String statusStr = request.get("status");
                try {
                        User.Status status = User.Status.valueOf(statusStr);
                        return ResponseEntity.ok(userService.updateUserStatus(id, status));
                } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest().build();
                }
        }

        @PostMapping("/users")
        public ResponseEntity<?> createUser(@RequestBody User user) {
                try {
                        return ResponseEntity.ok(userService.registerUser(user));
                } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
                } catch (RuntimeException e) {
                        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
                }
        }

        @PutMapping("/users/{id}")
        public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User user) {
                try {
                        return ResponseEntity.ok(userService.updateUser(id, user));
                } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
                } catch (RuntimeException e) {
                        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
                }
        }

        @GetMapping("/users/{userId}/order-stats")
        public ResponseEntity<Map<String, Object>> getUserOrderStats(@PathVariable Long userId) {
                return ResponseEntity.ok(orderService.getUserOrderStats(userId));
        }

        // --- GESTIÓN DE PEDIDOS ---

        @GetMapping("/orders")
        public ResponseEntity<Page<Order>> getAllOrders(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        @RequestParam(required = false) String status,
                        @RequestParam(required = false) String search,
                        @RequestParam(required = false) LocalDate startDate,
                        @RequestParam(required = false) LocalDate endDate) {
                Pageable pageable = PageRequest.of(page, size, Sort.by("orderDate").descending());
                return ResponseEntity.ok(orderService.getAllOrders(pageable, status, search, startDate, endDate));
        }

        @GetMapping("/orders/{id}")
        public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
                return orderService.getOrderById(id)
                                .map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
        }

        @PostMapping("/orders")
        public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> orderData) {
                try {
                        String customerEmail = (String) orderData.get("customerEmail");
                        String productName = (String) orderData.get("productName");
                        Integer quantity = orderData.get("quantity") != null
                                        ? Integer.parseInt(orderData.get("quantity").toString())
                                        : 1;
                        String statusStr = (String) orderData.get("status");

                        Order.Status status = Order.Status.PENDING;
                        if (statusStr != null && !statusStr.isEmpty()) {
                                try {
                                        status = Order.Status.valueOf(statusStr.toUpperCase());
                                } catch (IllegalArgumentException e) {
                                        // Keep default PENDING if invalid status
                                }
                        }

                        Order order = orderService.createOrderFromAdmin(customerEmail, productName, quantity, status);
                        return ResponseEntity.ok(order);
                } catch (RuntimeException e) {
                        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
                }
        }

        @PutMapping("/orders/{id}")
        public ResponseEntity<?> updateOrder(@PathVariable Long id, @RequestBody Map<String, Object> orderData) {
                try {
                        String productName = (String) orderData.get("productName");
                        Integer quantity = orderData.get("quantity") != null
                                        ? Integer.parseInt(orderData.get("quantity").toString())
                                        : 1;
                        String statusStr = (String) orderData.get("status");
                        String shippingAddress = (String) orderData.get("shippingAddress");

                        Order.Status status = Order.Status.PENDING;
                        if (statusStr != null && !statusStr.isEmpty()) {
                                try {
                                        status = Order.Status.valueOf(statusStr.toUpperCase());
                                } catch (IllegalArgumentException e) {
                                        // Keep default PENDING if invalid status
                                }
                        }

                        Order order = orderService.updateOrderFromAdmin(id, productName, quantity, status,
                                        shippingAddress);
                        return ResponseEntity.ok(order);
                } catch (RuntimeException e) {
                        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
                }
        }

        @DeleteMapping("/orders/{id}")
        public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
                try {
                        Order cancelledOrder = orderService.cancelOrder(id);
                        return ResponseEntity.ok(cancelledOrder);
                } catch (RuntimeException e) {
                        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
                }
        }

        // Endpoint para cambiar solo el estado del pedido (Usado en Domicilios)
        @PutMapping("/orders/{id}/status")
        public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
                try {
                        String statusStr = request.get("status");
                        if (statusStr == null || statusStr.isEmpty()) {
                                return ResponseEntity.badRequest().body(Map.of("error", "El estado es requerido"));
                        }

                        // Convertir string a Enum y actualizar
                        Order.Status status = Order.Status.valueOf(statusStr.toUpperCase());
                        Order updatedOrder = orderService.updateOrderStatus(id, status);

                        return ResponseEntity.ok(updatedOrder);

                } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest()
                                        .body(Map.of("error", "Estado inválido: " + request.get("status")));
                } catch (RuntimeException e) {
                        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
                }
        }

        // --- GESTIÓN DE PRODUCTOS ---

        @GetMapping("/products/active")
        public ResponseEntity<List<Map<String, Object>>> getActiveProducts() {
                List<Product> activeProducts = productService.getAllProducts().stream()
                                .filter(p -> p.getStatus() == Product.Status.ACTIVE && p.getStock() > 0)
                                .collect(java.util.stream.Collectors.toList());

                List<Map<String, Object>> productList = activeProducts.stream()
                                .map(p -> {
                                        Map<String, Object> productMap = new HashMap<>();
                                        productMap.put("id", p.getId());
                                        productMap.put("name", p.getName());
                                        productMap.put("price", p.getPrice());
                                        productMap.put("stock", p.getStock());
                                        return productMap;
                                })
                                .collect(java.util.stream.Collectors.toList());

                return ResponseEntity.ok(productList);
        }

        @GetMapping("/products")
        public ResponseEntity<Page<Product>> getProducts(
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size,
                        @RequestParam(required = false) String search,
                        @RequestParam(required = false) String category,
                        @RequestParam(required = false) String brand,
                        @RequestParam(required = false) String status,
                        @RequestParam(required = false) String color,
                        @RequestParam(required = false) String productSize,
                        @RequestParam(required = false) String price,
                        @RequestParam(required = false) String stock) {
                Pageable pageable = PageRequest.of(page, size);
                return ResponseEntity.ok(productService.getProducts(pageable, search, category, brand, status, color,
                                productSize, price, stock));
        }

        @GetMapping("/products/{id}")
        public ResponseEntity<Product> getProductById(@PathVariable Long id) {
                return productService.getProductById(id)
                                .map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
        }

        // === AQUÍ ESTÁ LA CORRECCIÓN: AGREGADO SKU ===
        @PostMapping("/products")
        public ResponseEntity<?> createProduct(
                        @RequestParam("name") String name,
                        @RequestParam("price") Double price,
                        @RequestParam("stock") Integer stock,
                        @RequestParam("description") String description,
                        @RequestParam("brand") String brand,
                        @RequestParam("sku") String sku, // <-- PARÁMETRO AGREGADO
                        @RequestParam(value = "colors", required = false) String colors,
                        @RequestParam(value = "sizes", required = false) String sizes,
                        @RequestParam("categoryId") Long categoryId,
                        @RequestParam(value = "image", required = false) MultipartFile image) {
                try {
                        Product product = Product.builder()
                                        .name(name)
                                        .price(BigDecimal.valueOf(price))
                                        .stock(stock)
                                        .description(description)
                                        .brand(brand)
                                        .sku(sku) // <-- SKU ASIGNADO AL BUILDER
                                        .colors(colors)
                                        .sizes(sizes)
                                        .category(Category.builder().id(categoryId).build())
                                        .status(Product.Status.ACTIVE)
                                        .build();

                        return ResponseEntity.ok(productService.saveProduct(product, image));
                } catch (Exception e) {
                        e.printStackTrace(); // Útil para debugging
                        return ResponseEntity.badRequest()
                                        .body(Map.of("error", "Error al crear producto: " + e.getMessage()));
                }
        }

        // === AQUÍ ESTÁ LA CORRECCIÓN: AGREGADO SKU ===
        @PutMapping("/products/{id}")
        public ResponseEntity<?> updateProduct(
                        @PathVariable Long id,
                        @RequestParam("name") String name,
                        @RequestParam("price") Double price,
                        @RequestParam("stock") Integer stock,
                        @RequestParam("description") String description,
                        @RequestParam("brand") String brand,
                        @RequestParam("sku") String sku, // <-- PARÁMETRO AGREGADO
                        @RequestParam(value = "colors", required = false) String colors,
                        @RequestParam(value = "sizes", required = false) String sizes,
                        @RequestParam("categoryId") Long categoryId,
                        @RequestParam("status") String statusStr,
                        @RequestParam(value = "image", required = false) MultipartFile image) {
                try {
                        Product product = productService.getProductById(id)
                                        .orElseThrow(() -> new RuntimeException("Product not found"));

                        product.setName(name);
                        product.setPrice(BigDecimal.valueOf(price));
                        product.setStock(stock);
                        product.setDescription(description);
                        product.setBrand(brand);
                        product.setSku(sku); // <-- SKU ACTUALIZADO
                        product.setColors(colors);
                        product.setSizes(sizes);
                        product.setCategory(Category.builder().id(categoryId).build());

                        try {
                                product.setStatus(Product.Status.valueOf(statusStr));
                        } catch (Exception e) {
                                product.setStatus(Product.Status.ACTIVE);
                        }

                        return ResponseEntity.ok(productService.saveProduct(product, image));
                } catch (Exception e) {
                        e.printStackTrace();
                        return ResponseEntity.badRequest()
                                        .body(Map.of("error", "Error al actualizar: " + e.getMessage()));
                }
        }

        @DeleteMapping("/products/{id}")
        public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
                productService.deleteProduct(id);
                return ResponseEntity.ok().build();
        }
}