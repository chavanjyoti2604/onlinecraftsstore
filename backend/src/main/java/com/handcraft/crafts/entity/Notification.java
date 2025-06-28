package com.handcraft.crafts.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String message;
    private String productImage;

    @Column(name = "is_read")  // maps to DB column is_read
    private boolean isRead;

    private String createdAt;
}
