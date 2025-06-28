package com.handcraft.crafts.controller;

import com.handcraft.crafts.dto.PendingOrderDTO;
import com.handcraft.crafts.dto.ConfirmedOrderDTO;
import com.handcraft.crafts.dto.UserConfirmedOrderDTO;
import com.handcraft.crafts.entity.Order;
import com.handcraft.crafts.service.OrderService;
import com.handcraft.crafts.util.FileUploadUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    /* =============================================================
       PLACE ORDER
       ============================================================ */
    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(
            @RequestParam Long   productId,
            @RequestParam Long   shopId,
            @RequestParam int    quantity,
            @RequestParam double totalAmount,
            @RequestParam String paymentMethod,
            @RequestParam String address,                    // NEW
            @RequestParam(required = false) MultipartFile screenshot,
            HttpServletRequest request,
            Principal principal
    ) {
        try {
            if (principal == null || principal.getName() == null)
                return ResponseEntity.status(401).body("Unauthorized: Invalid or missing JWT token.");

            Long userId = orderService.getUserIdByEmail(principal.getName());

            String screenshotName = null;
            if (screenshot != null && !screenshot.isEmpty())
                screenshotName = FileUploadUtil.saveFile("uploads/screenshots", screenshot);

            Order order = new Order();
            order.setUserId(userId);
            order.setProductId(productId);
            order.setShopId(shopId);
            order.setQuantity(quantity);
            order.setTotalAmount(totalAmount);
            order.setPaymentMethod(paymentMethod);
            order.setPaymentScreenshot(screenshotName);
            order.setCreatedAt(LocalDateTime.now().toString());
            order.setDeliveryAddress(address);               // NEW
            order.setPaymentStatus(paymentMethod.equalsIgnoreCase("cod")
                    ? "confirmed" : "pending");

            return ResponseEntity.ok(orderService.placeOrder(order));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Order failed: " + e.getMessage());
        }
    }

    /* =============================================================
       USER-SIDE ENDPOINTS
       ============================================================ */

    /** legacy – raw order entities */
    @GetMapping("/user/{userId}")
    public List<Order> getUserOrders(@PathVariable Long userId) {
        return orderService.getOrdersByUserId(userId);
    }

    /** legacy – confirmed DTO list by explicit ID */
    @GetMapping("/user/{userId}/confirmed")
    public ResponseEntity<List<UserConfirmedOrderDTO>> getConfirmedOrdersByUser(
            @PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getConfirmedOrderDTOsByUser(userId));
    }

    /* ------------------------------------------------------------------
       NEW : confirmed orders for the logged-in user
       ------------------------------------------------------------------ */
    @GetMapping("/confirmed/user")
    public ResponseEntity<?> myConfirmedOrders(Principal principal) {
        if (principal == null || principal.getName() == null)
            return ResponseEntity.status(401).body("Unauthorized");

        Long uid = orderService.getUserIdByEmail(principal.getName());
        return ResponseEntity.ok(orderService.getConfirmedOrderDTOsByUser(uid));
    }

    /* =============================================================
       SELLER-SIDE ENDPOINTS
       ============================================================ */

    @GetMapping("/shop/{shopId}/pending")
    public ResponseEntity<List<PendingOrderDTO>> getPendingShopOrders(
            @PathVariable Long shopId) {
        return ResponseEntity.ok(orderService.getPendingOrderDTOsByShop(shopId));
    }

    @GetMapping("/shop/{shopId}/confirmed")
    public ResponseEntity<List<ConfirmedOrderDTO>> getConfirmedShopOrders(
            @PathVariable Long shopId) {
        return ResponseEntity.ok(orderService.getConfirmedOrderDTOsByShop(shopId));
    }

    /* =============================================================
       SELLER ACTIONS: CONFIRM / REJECT
       ============================================================ */

    @PutMapping("/confirm/{orderId}")
    public ResponseEntity<?> confirmOrder(@PathVariable Long orderId) {
        Order up = orderService.confirmOrder(orderId);
        return up != null ? ResponseEntity.ok(up) : ResponseEntity.notFound().build();
    }

    @PutMapping("/reject/{orderId}")
    public ResponseEntity<?> rejectOrder(@PathVariable Long orderId) {
        Order up = orderService.rejectOrder(orderId);
        return up != null ? ResponseEntity.ok(up) : ResponseEntity.notFound().build();
    }

    /* =============================================================
       LEGACY – order-based notification feed
       ============================================================ */
    @GetMapping("/user/email/{email}")
    public ResponseEntity<?> getOrdersByEmail(@PathVariable String email) {
        return ResponseEntity.ok(orderService.getUserOrderNotifications(email));
    }
}
