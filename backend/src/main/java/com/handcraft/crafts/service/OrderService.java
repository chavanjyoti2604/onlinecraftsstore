package com.handcraft.crafts.service;

import com.handcraft.crafts.dto.PendingOrderDTO;
import com.handcraft.crafts.dto.ConfirmedOrderDTO;
import com.handcraft.crafts.dto.UserConfirmedOrderDTO;
import com.handcraft.crafts.entity.*;
import com.handcraft.crafts.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

/**
 * All order persistence / projection logic + buyer-/seller notifications.
 */
@Service
public class OrderService {

    /* ---------- repositories ---------- */
    @Autowired private OrderRepository        orderRepository;
    @Autowired private UserInfoRepository     userRepository;
    @Autowired private ProductRepository      productRepository;
    @Autowired private NotificationRepository notificationRepository;

    /* ======================================================================
       PLACE ORDER
       ==================================================================== */
    public Order placeOrder(Order order) {
        Order saved = orderRepository.save(order);

        String template = "pending".equals(order.getPaymentStatus())
                ? "🛍️ Your order for %s is pending confirmation."
                : "🎉 Your COD order for %s is confirmed!";

        createNotification(order, template);
        return saved;
    }

    /* ======================================================================
       SELLER  —  PENDING ORDERS
       ==================================================================== */
    public List<PendingOrderDTO> getPendingOrderDTOsByShop(Long shopId) {
        List<Order> orders = orderRepository
                .findByShopIdAndPaymentStatus(shopId, "pending");

        List<PendingOrderDTO> list = new ArrayList<>();
        for (Order o : orders) {
            userRepository.findById(o.getUserId().intValue()).ifPresent(user ->
                    productRepository.findById(o.getProductId().intValue()).ifPresent(prod -> {
                        PendingOrderDTO dto = new PendingOrderDTO();
                        dto.setId(o.getId());
                        dto.setUserEmail(user.getEmail());
                        dto.setProductName(prod.getName());
                        dto.setProductImage(prod.getImageUrl());
                        dto.setPaymentScreenshot(o.getPaymentScreenshot());
                        dto.setDeliveryAddress(o.getDeliveryAddress());
                        list.add(dto);
                    }));
        }
        return list;
    }

    /* ======================================================================
       SELLER  —  CONFIRMED ORDERS
       ==================================================================== */
    public List<ConfirmedOrderDTO> getConfirmedOrderDTOsByShop(Long shopId) {
        List<Order> orders = orderRepository
                .findByShopIdAndPaymentStatus(shopId, "confirmed");

        List<ConfirmedOrderDTO> list = new ArrayList<>();
        for (Order o : orders) {
            userRepository.findById(o.getUserId().intValue()).ifPresent(user ->
                    productRepository.findById(o.getProductId().intValue()).ifPresent(prod -> {
                        ConfirmedOrderDTO dto = new ConfirmedOrderDTO();
                        dto.setId(o.getId());
                        dto.setUserEmail(user.getEmail());
                        dto.setProductName(prod.getName());
                        dto.setProductImage(prod.getImageUrl());
                        dto.setQuantity(o.getQuantity());
                        dto.setPaymentMethod(o.getPaymentMethod());
                        dto.setDeliveryAddress(o.getDeliveryAddress());
                        list.add(dto);
                    }));
        }
        return list;
    }

    /* ======================================================================
       BUYER  —  MY CONFIRMED ORDERS
       ==================================================================== */
    public List<UserConfirmedOrderDTO> getConfirmedOrderDTOsByUser(Long userId) {
        List<Order> orders = orderRepository
                .findByUserIdAndPaymentStatus(userId, "confirmed");

        List<UserConfirmedOrderDTO> list = new ArrayList<>();
        for (Order o : orders) {
            productRepository.findById(o.getProductId().intValue()).ifPresent(prod -> {
                Shop shop = prod.getShop();
                UserConfirmedOrderDTO dto = new UserConfirmedOrderDTO();
                dto.setOrderId(o.getId());
                dto.setProductName(prod.getName());
                dto.setProductImage(prod.getImageUrl());
                dto.setQuantity(o.getQuantity());
                dto.setTotalAmount(o.getTotalAmount());
                dto.setShopName(shop != null ? shop.getShopName() : "Unknown");
                dto.setPaymentMethod(o.getPaymentMethod());
                dto.setCreatedAt(o.getCreatedAt());
                list.add(dto);
            });
        }
        return list;
    }

    /* ======================================================================
       SELLER ACTIONS  —  CONFIRM / REJECT
       ==================================================================== */
    public Order confirmOrder(Long id) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) return null;

        order.setPaymentStatus("confirmed");
        Order saved = orderRepository.save(order);
        createNotification(order, "🎉 Your order for %s is confirmed!");
        return saved;
    }

    public Order rejectOrder(Long id) {
        Order o = orderRepository.findById(id).orElse(null);
        if (o == null) return null;
        o.setPaymentStatus("rejected");
        return orderRepository.save(o);
    }

    /* ======================================================================
       SIMPLE HELPERS
       ==================================================================== */
    public Long getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(u -> (long) u.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Order> getOrdersByUserId(Long uid) {
        return orderRepository.findByUserId(uid);
    }

    /* ----------------------------------------------------------------------
       LEGACY MAP-BASED NOTIFICATION FEED
       -------------------------------------------------------------------- */
    public List<Map<String, Object>> getUserOrderNotifications(String email) {

        return userRepository.findByEmail(email)
                .map(user -> {
                    List<Order> orders = orderRepository.findByUserId((long) user.getId());
                    List<Map<String, Object>> out = new ArrayList<>();

                    for (Order o : orders) {
                        Map<String, Object> m = new HashMap<>();
                        m.put("id",        o.getId());
                        m.put("status",    o.getPaymentStatus());
                        m.put("createdAt", o.getCreatedAt());

                        productRepository.findById(o.getProductId().intValue()).ifPresent(prod -> {
                            m.put("productName",  prod.getName());
                            m.put("productImage", prod.getImageUrl());
                            Shop shop = prod.getShop();
                            if (shop != null) m.put("shopName", shop.getShopName());
                        });
                        out.add(m);
                    }
                    return out;
                })
                .orElse(Collections.emptyList());
    }

    /* ----------------------------------------------------------------------
       UNREAD NOTIFICATIONS  –  used for navbar badge
       -------------------------------------------------------------------- */
    public List<Notification> getUnreadNotifications(String email) {
        return userRepository.findByEmail(email)
                .map(u -> notificationRepository.findByUserIdAndIsReadFalse((long) u.getId()))
                .orElse(Collections.emptyList());
    }

    /* ======================================================================
       INTERNAL NOTIFICATION BUILDER
       ==================================================================== */
    private void createNotification(Order order, String template) {
        productRepository.findById(order.getProductId().intValue()).ifPresent(prod -> {
            Notification n = Notification.builder()
                    .userId(order.getUserId())
                    .message(String.format(template, prod.getName()))
                    .productImage(prod.getImageUrl())
                    .isRead(false)
                    .createdAt(LocalDateTime.now().toString())
                    .build();
            notificationRepository.save(n);
        });
    }
}
