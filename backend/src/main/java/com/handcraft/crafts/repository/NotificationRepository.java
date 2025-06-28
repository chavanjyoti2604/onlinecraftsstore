package com.handcraft.crafts.repository;

import com.handcraft.crafts.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    /* existing */
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    /* new –  used for unread-badge */
    List<Notification> findByUserIdAndIsReadFalse(Long userId);
}
