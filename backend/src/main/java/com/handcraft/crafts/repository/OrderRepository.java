package com.handcraft.crafts.repository;

import com.handcraft.crafts.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Spring-Data repository for Order entity
 */
public interface OrderRepository extends JpaRepository<Order, Long> {

    /* --- existing queries --- */
    List<Order> findByUserId(Long userId);

    List<Order> findByShopIdAndPaymentStatus(Long shopId, String status);

    /* --- NEW: used by buyer “My Orders” page --- */
    List<Order> findByUserIdAndPaymentStatus(Long userId, String status);
}
