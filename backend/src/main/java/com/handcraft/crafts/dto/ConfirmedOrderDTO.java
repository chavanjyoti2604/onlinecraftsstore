package com.handcraft.crafts.dto;

public class ConfirmedOrderDTO {
    private Long id;
    private String userEmail;
    private String productName;
    private String productImage;
    private int quantity;
    private String paymentMethod;
    private String deliveryAddress;     // NEW

    /* getters & setters */
    public Long getId()                 { return id; }
    public void setId(Long id)          { this.id = id; }

    public String getUserEmail()        { return userEmail; }
    public void   setUserEmail(String s){ this.userEmail = s; }

    public String getProductName()      { return productName; }
    public void   setProductName(String s){ this.productName = s; }

    public String getProductImage()     { return productImage; }
    public void   setProductImage(String s){ this.productImage = s; }

    public int getQuantity()            { return quantity; }
    public void setQuantity(int q)      { this.quantity = q; }

    public String getPaymentMethod()    { return paymentMethod; }
    public void setPaymentMethod(String s){ this.paymentMethod = s; }

    public String getDeliveryAddress()  { return deliveryAddress; }
    public void setDeliveryAddress(String s){ this.deliveryAddress = s; }
}
