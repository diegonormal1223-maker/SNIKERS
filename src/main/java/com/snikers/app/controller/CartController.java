package com.snikers.app.controller;

import com.snikers.app.model.Cart;
import com.snikers.app.model.User;
import com.snikers.app.service.CartService;
import com.snikers.app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        User user = (User) userService.loadUserByUsername(userDetails.getUsername());
        System.out.println("🛒 GET CART - User: " + user.getEmail() + " ID: " + user.getId());
        return ResponseEntity.ok(cartService.getCartByUserId(user.getId()));
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> request) {
        User user = (User) userService.loadUserByUsername(userDetails.getUsername());
        System.out.println("🛒 ADD TO CART - User: " + user.getEmail() + " ID: " + user.getId());
        Long productId = Long.valueOf(request.get("productId").toString());
        Integer quantity = Integer.valueOf(request.get("quantity").toString());
        String size = (String) request.get("size");
        String color = (String) request.get("color");

        return ResponseEntity.ok(cartService.addToCart(user.getId(), productId, quantity, size, color));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<Cart> updateItemQuantity(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long itemId,
            @RequestBody Map<String, Integer> request) {
        User user = (User) userService.loadUserByUsername(userDetails.getUsername());
        Integer quantity = request.get("quantity");
        return ResponseEntity.ok(cartService.updateItemQuantity(user.getId(), itemId, quantity));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long itemId) {
        cartService.removeFromCart(itemId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        User user = (User) userService.loadUserByUsername(userDetails.getUsername());
        cartService.clearCart(user.getId());
        return ResponseEntity.ok().build();
    }
}
