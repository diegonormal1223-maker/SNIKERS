package com.snikers.app.service;

import com.snikers.app.model.Favorite;
import com.snikers.app.model.Product;
import com.snikers.app.model.User;
import com.snikers.app.repository.FavoriteRepository;
import com.snikers.app.repository.ProductRepository;
import com.snikers.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public String toggleFavorite(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<Favorite> existingFavorite = favoriteRepository.findByUserAndProduct(user, product);

        if (existingFavorite.isPresent()) {
            favoriteRepository.delete(existingFavorite.get());
            return "Removed from favorites";
        } else {
            Favorite favorite = Favorite.builder()
                    .user(user)
                    .product(product)
                    .build();
            favoriteRepository.save(favorite);
            return "Added to favorites";
        }
    }

    public List<Favorite> getFavorites(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return favoriteRepository.findByUser(user);
    }
}
