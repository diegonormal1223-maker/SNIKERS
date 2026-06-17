package com.snikers.app.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime orderDate;

    @Enumerated(EnumType.STRING)
    private Status status;

    private BigDecimal totalAmount;

    private String shippingAddress;

    private String paymentMethod;

    // Discount/Coupon fields
    private String couponCode;

    private BigDecimal discountPercent;

    private BigDecimal discountAmount;

    private BigDecimal subtotal;

    // Refund Logic
    private Boolean refundRequested = false;

    private String refundReason;

    private String refundStatus; // PENDING, APPROVED, REJECTED

    private String refundResponse; // Admin rejection reason or approval note

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        orderDate = LocalDateTime.now();
        if (status == null)
            status = Status.PENDING;
    }

    public enum Status {
        PENDING, PAID, SHIPPED, IN_TRANSIT, DELIVERED, CANCELLED, COMPLETED,
        REFUND_REQUESTED, REFUND_APPROVED, REFUND_REJECTED
    }
}
