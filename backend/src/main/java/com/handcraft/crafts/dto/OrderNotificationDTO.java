package com.handcraft.crafts.dto;

public class OrderNotificationDTO {
    private Long orderId;
    private String productName;
    private String productImage;
    private String paymentStatus;
    private String createdAt;

    public OrderNotificationDTO(Long orderId, String productName, String productImage, String paymentStatus, String createdAt) {
        this.orderId = orderId;
        this.productName = productName;
        this.productImage = productImage;
        this.paymentStatus = paymentStatus;
        this.createdAt = createdAt;
    }

    // Getters and setters
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductImage() { return productImage; }
    public void setProductImage(String productImage) { this.productImage = productImage; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
