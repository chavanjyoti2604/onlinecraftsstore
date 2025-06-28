import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import "./BuyNow.css";

export default function BuyNow() {
  const location = useLocation();
  const navigate = useNavigate();
  const product  = location.state?.product;

  /* -------------- state -------------- */
  const [formData, setFormData] = useState({
    name: "", email: "", address: "", quantity: 1,
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [screenshot,    setScreenshot]    = useState(null);

  const [orderPlaced,   setOrderPlaced]   = useState(false);
  const [orderNotification, setOrderNotification] = useState(null);

  /* -------------- restore notification (only if for this product) -------------- */
  useEffect(() => {
    if (!product) return;
    const saved = localStorage.getItem("orderNotification");
    if (!saved) return;

    try {
      const obj        = JSON.parse(saved);
      const currentId  = product.productId || product.id;
      if (obj.productId === currentId) {
        setOrderNotification(obj);
        setOrderPlaced(true);
      }
    } catch { /* ignore invalid JSON */ }
  }, [product]);

  /* -------------- helpers -------------- */
  const saveAndShowNotification = (obj) => {
    localStorage.setItem("orderNotification", JSON.stringify(obj));
    setOrderNotification(obj);
    setOrderPlaced(true);
  };

  const clearSavedNotification = () =>
    localStorage.removeItem("orderNotification");

  /* automatically clear stored notification when splash unmounts */
  useEffect(() => {
    if (!orderPlaced) return;
    return () => clearSavedNotification();
  }, [orderPlaced]);

  if (!product) return <p>No product selected.</p>;

  /* -------------- change handlers -------------- */
  const handleChange        = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  const handlePaymentChange = (m) => setPaymentMethod(m);
  const handleFileChange    = (e) => setScreenshot(e.target.files[0]);

  const generateUPIUrl = () => {
    const upiId  = product.upiId;
    const name   = product.productName || product.name;
    const amount = ((product.productPrice || product.price) * formData.quantity).toFixed(2);
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;
  };

  /* -------------- submit -------------- */
  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (paymentMethod === "online" && !screenshot) {
      alert("Please upload a payment screenshot first.");
      return;
    }

    const fd = new FormData();
    fd.append("productId",  product.productId || product.id);
    fd.append("shopId",     product.shopId);
    fd.append("quantity",   formData.quantity);
    fd.append("totalAmount",(product.productPrice || product.price) * formData.quantity);
    fd.append("paymentMethod", paymentMethod);
    fd.append("name",    formData.name);
    fd.append("email",   formData.email);
    fd.append("address", formData.address);
    if (paymentMethod === "online") fd.append("screenshot", screenshot);

    try {
      const token = localStorage.getItem("token");
      const res   = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/orders/place`, {
        method: "POST",
        body:   fd,
        headers:{ Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        saveAndShowNotification({
          productId:   product.productId || product.id,
          productName: product.productName || product.name,
          orderId:     data.id,
          paymentMethod,
          status:      paymentMethod === "cod" ? "confirmed" : "pending",
        });
      } else {
        alert(await res.text());
      }
    } catch (err) {
      console.error(err);
      alert("Error placing order.");
    }
  };

  /* -------------- success splash -------------- */
  if (orderPlaced && orderNotification) {
    const confirmed = orderNotification.status === "confirmed";
    const goHome = () => {
      clearSavedNotification();
      navigate("/");
    };

    return (
      <div className="buy-now-container success">
        <h2><span className="success-icon">✅</span> Thank you!</h2>
        <p>Product: <strong>{orderNotification.productName}</strong></p>
        <p>
          {confirmed
            ? "Payment confirmed / COD chosen."
            : "Your order is pending approval."}
        </p>
        <button className="btn-home" onClick={goHome}>
          Back to Home
        </button>
      </div>
    );
  }

  /* -------------- main form -------------- */
  return (
    <div className="buy-now-container">
      <h2>Buy Now: {product.productName || product.name}</h2>

      <form className="buy-now-form" onSubmit={handleConfirmOrder}>
        {/* product summary */}
        <div className="product-summary">
          <img src={product.imageUrl} alt={product.productName || product.name}
               className="product-image" />
          <div className="product-details">
            <p className="price">Price: ₹{product.productPrice || product.price}</p>
            <p>{product.productDescription || product.description}</p>
          </div>
        </div>

        {/* buyer details */}
        <label>Full Name:
          <input name="name" type="text" required value={formData.name}
                 onChange={handleChange} placeholder="Your full name" />
        </label>

        <label>Email:
          <input name="email" type="email" required value={formData.email}
                 onChange={handleChange} placeholder="you@example.com" />
        </label>

        <label>Delivery Address:
          <textarea name="address" required value={formData.address}
                    onChange={handleChange} placeholder="Your delivery address" />
        </label>

        <label>Quantity:
          <input name="quantity" type="number" min="1" value={formData.quantity}
                 onChange={handleChange} />
        </label>

        {/* payment selector */}
        <div className="payment-method">
          <p><strong>Select Payment Method:</strong></p>
          <div className="payment-options">
            <button type="button"
              className={paymentMethod === "cod" ? "active" : ""}
              onClick={() => handlePaymentChange("cod")}>
              Cash on Delivery
            </button>
            <button type="button"
              className={paymentMethod === "online" ? "active" : ""}
              onClick={() => handlePaymentChange("online")}>
              Online Payment (UPI)
            </button>
          </div>
        </div>

        {/* UPI + screenshot picker */}
        {paymentMethod === "online" && (
          <>
            <div className="upi-scanner">
              {product.upiId ? (
                <>
                  <p>Scan & pay <strong>{product.upiId}</strong>:</p>
                  <QRCodeSVG value={generateUPIUrl()} size={220} className="scanner-image" />
                  <p className="note">* Upload screenshot after payment.</p>
                </>
              ) : (
                <p className="note">⚠️ UPI not available for this product.</p>
              )}
            </div>

            <div className="file-input-wrapper">
              <input
                id="screenshotInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
              <label htmlFor="screenshotInput" className="file-label">
                {screenshot ? "Change Screenshot" : "Upload Payment Screenshot"}
              </label>

              {screenshot && (
                <img
                  src={URL.createObjectURL(screenshot)}
                  alt="Preview"
                  className="file-preview"
                />
              )}
            </div>
          </>
        )}

        <button type="submit" className="btn-confirm">Confirm Order</button>
      </form>
    </div>
  );
}
