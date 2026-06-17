package com.snikers.app.controller;

import com.snikers.app.model.Favorite;
import com.snikers.app.model.User;
import com.snikers.app.service.FavoriteService;
import com.snikers.app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final UserService userService;

    @PostMapping("/{productId}")
    public ResponseEntity<?> toggleFavorite(@PathVariable Long productId, Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.findByEmail(userDetails.getUsername());
        String message = favoriteService.toggleFavorite(user.getId(), productId);
        return ResponseEntity.ok(message);
    }

    @GetMapping
    public ResponseEntity<List<Favorite>> getFavorites(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(favoriteService.getFavorites(user.getId()));
    }
}
