package com.snikers.app.repository;

import com.snikers.app.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface OrderRepository
        extends JpaRepository<Order, Long>, org.springframework.data.jpa.repository.JpaSpecificationExecutor<Order> {
    List<Order> findByUserId(Long userId);

    /**
     * Calcula la suma del total de pedidos y el conteo de pedidos para un usuario.
     * Devuelve una lista de Object[] donde [0] es la suma (BigDecimal) y [1] es el
     * conteo (Long).
     */
    @Query("SELECT SUM(o.totalAmount), COUNT(o) FROM Order o WHERE o.user.id = :userId")
    List<Object[]> getUserOrderStats(@Param("userId") Long userId);
}
