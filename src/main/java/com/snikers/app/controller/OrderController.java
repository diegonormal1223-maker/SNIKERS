package com.snikers.app.controller;

import com.snikers.app.model.Order;
import com.snikers.app.model.User;
import com.snikers.app.service.OrderService;
import com.snikers.app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<Order> createOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> request) {
        User user = (User) userService.loadUserByUsername(userDetails.getUsername());
        String shippingAddress = request.get("shippingAddress");
        String paymentMethod = request.get("paymentMethod");
        String couponCode = request.get("couponCode");
        String discountPercentStr = request.get("discountPercent");

        BigDecimal discountPercent = null;
        if (discountPercentStr != null && !discountPercentStr.isEmpty()) {
            try {
                discountPercent = new BigDecimal(discountPercentStr);
            } catch (NumberFormatException e) {
                // If parsing fails, discount remains null
            }
        }

        return ResponseEntity.ok(orderService.createOrder(
                user.getId(),
                shippingAddress,
                paymentMethod,
                couponCode,
                discountPercent));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders(@AuthenticationPrincipal UserDetails userDetails) {
        User user = (User) userService.loadUserByUsername(userDetails.getUsername());
        return ResponseEntity.ok(orderService.getOrdersByUserId(user.getId()));
    }

    @PostMapping("/{id}/refund")
    public ResponseEntity<Order> refundOrder(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String reason = request.get("reason");
        return ResponseEntity.ok(orderService.requestRefund(id, reason));
    }

    @GetMapping("/refunds")
    public ResponseEntity<List<Order>> getRefundRequests() {
        return ResponseEntity.ok(orderService.getRefundRequests());
    }

    @PostMapping("/{id}/refund/respond")
    public ResponseEntity<Order> respondRefund(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String status = request.get("status");
        String response = request.get("response");
        return ResponseEntity.ok(orderService.respondRefund(id, status, response));
    }
}