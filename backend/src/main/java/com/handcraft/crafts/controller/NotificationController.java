package com.handcraft.crafts.controller;

import com.handcraft.crafts.entity.Notification;
import com.handcraft.crafts.repository.NotificationRepository;
import com.handcraft.crafts.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private OrderService orderService;

    /* --------------------------------------------------
     * 1)  Auth-based endpoint (uses Principal/JWT)
     * -------------------------------------------------- */
    @GetMapping("/user")
    public ResponseEntity<?> getUserNotifications(Principal principal) {
        if (principal == null || principal.getName() == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        Long userId = orderService.getUserIdByEmail(principal.getName());
        List<Notification> list = notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(list);
    }

    /* --------------------------------------------------
     * 2)  NEW: Unread-only endpoint via explicit email
     * -------------------------------------------------- */
    @GetMapping("/unread/email/{email}")
    public ResponseEntity<List<Notification>> unreadByEmail(@PathVariable String email) {
        return ResponseEntity.ok(orderService.getUnreadNotifications(email));
    }
}
