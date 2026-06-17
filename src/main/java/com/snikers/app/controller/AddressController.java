package com.snikers.app.controller;

import com.snikers.app.model.Address;
import com.snikers.app.model.User;
import com.snikers.app.service.AddressService;
import com.snikers.app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;
    private final UserService userService;

    private User getAuthenticatedUser(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userService.findByEmail(userDetails.getUsername());
    }

    @GetMapping
    public ResponseEntity<List<Address>> getUserAddresses(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(addressService.getUserAddresses(user.getId()));
    }

    @PostMapping
    public ResponseEntity<?> createAddress(Authentication authentication, @RequestBody Address address) {
        try {
            User user = getAuthenticatedUser(authentication);
            return ResponseEntity.ok(addressService.createAddress(user.getId(), address));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("message", "Error saving address: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<Void> setDefaultAddress(Authentication authentication, @PathVariable Long id) {
        User user = getAuthenticatedUser(authentication);
        addressService.setDefaultAddress(user.getId(), id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAddress(Authentication authentication, @PathVariable Long id,
            @RequestBody Address address) {
        try {
            User user = getAuthenticatedUser(authentication);
            return ResponseEntity.ok(addressService.updateAddress(user.getId(), id, address));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
}
