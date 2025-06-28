package com.handcraft.crafts.dto;

public class PendingOrderDTO {
    private Long id;
    private String userEmail;
    private String productName;
    private String productImage;
    private String paymentScreenshot;
    private String deliveryAddress;     // NEW

    /* getters & setters */
    public Long   getId()               { return id; }
    public void   setId(Long id)        { this.id = id; }

    public String getUserEmail()        { return userEmail; }
    public void   setUserEmail(String s){ this.userEmail = s; }

    public String getProductName()      { return productName; }
    public void   setProductName(String s){ this.productName = s; }

    public String getProductImage()     { return productImage; }
    public void   setProductImage(String s){ this.productImage = s; }

    public String getPaymentScreenshot(){ return paymentScreenshot; }
    public void   setPaymentScreenshot(String s){ this.paymentScreenshot = s; }

    public String getDeliveryAddress()  { return deliveryAddress; }
    public void   setDeliveryAddress(String s){ this.deliveryAddress = s; }
}
