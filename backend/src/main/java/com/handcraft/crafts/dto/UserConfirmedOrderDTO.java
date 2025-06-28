/* src/main/java/com/handcraft/crafts/dto/UserConfirmedOrderDTO.java */
package com.handcraft.crafts.dto;

public class UserConfirmedOrderDTO {
    private Long   orderId;
    private String productName;
    private String productImage;
    private int    quantity;
    private double totalAmount;
    private String shopName;
    private String paymentMethod;
    private String createdAt;

    /* getters & setters */
    public Long   getOrderId()         { return orderId; }
    public void   setOrderId(Long id)  { this.orderId = id; }

    public String getProductName()     { return productName; }
    public void   setProductName(String n){ this.productName = n; }

    public String getProductImage()    { return productImage; }
    public void   setProductImage(String i){ this.productImage = i; }

    public int    getQuantity()        { return quantity; }
    public void   setQuantity(int q)   { this.quantity = q; }

    public double getTotalAmount()     { return totalAmount; }
    public void   setTotalAmount(double a){ this.totalAmount = a; }

    public String getShopName()        { return shopName; }
    public void   setShopName(String s){ this.shopName = s; }

    public String getPaymentMethod()   { return paymentMethod; }
    public void   setPaymentMethod(String p){ this.paymentMethod = p; }

    public String getCreatedAt()       { return createdAt; }
    public void   setCreatedAt(String c){ this.createdAt = c; }
}
