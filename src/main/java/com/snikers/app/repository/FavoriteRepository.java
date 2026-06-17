package com.snikers.app.repository;

import com.snikers.app.model.Favorite;
import com.snikers.app.model.Product;
import com.snikers.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    Optional<Favorite> findByUserAndProduct(User user, Product product);

    List<Favorite> findByUser(User user);
}
