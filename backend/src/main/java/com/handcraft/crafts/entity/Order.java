package com.handcraft.crafts.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "orders")
public class Order {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long productId;
    private Long shopId;
    private int quantity;
    private double totalAmount;

    private String paymentMethod;           // "cod" or "online"
    private String paymentStatus = "pending";
    private String paymentScreenshot;       // filename
    private String createdAt;

    /* NEW: delivery address */
    @Column(name = "delivery_address")
    private String deliveryAddress;

    /* --- getters & setters --- */
    public Long getId()                 { return id; }
    public void setId(Long id)          { this.id = id; }

    public Long getUserId()             { return userId; }
    public void setUserId(Long userId)  { this.userId = userId; }

    public Long getProductId()          { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Long getShopId()             { return shopId; }
    public void setShopId(Long shopId)  { this.shopId = shopId; }

    public int  getQuantity()           { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getTotalAmount()      { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public String getPaymentMethod()    { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentStatus()    { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentScreenshot(){ return paymentScreenshot; }
    public void setPaymentScreenshot(String paymentScreenshot) { this.paymentScreenshot = paymentScreenshot; }

    public String getCreatedAt()        { return createdAt; }
    public void setCreatedAt(String createdAt){ this.createdAt = createdAt; }

    /* new */
    public String getDeliveryAddress()  { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress){ this.deliveryAddress = deliveryAddress; }
}
