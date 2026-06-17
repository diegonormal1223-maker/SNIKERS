package com.snikers.app.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "addresses")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    // Legacy fields (from old structure)
    private String type;
    private String line1;
    private String line2;

    @Column(name = "city_id")
    private Long cityId;

    private String notes;

    // New fields (for new structure)
    private String label; // e.g., Casa, Oficina
    private String recipientName;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "street_address")
    private String streetAddress;

    private String street;

    private String city;
    private String state;
    private String zipCode;
    private String phone;
    private String country;

    @Column(name = "is_default")
    private boolean isDefault;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private java.time.LocalDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
        updatedAt = java.time.LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.LocalDateTime.now();
    }
}
