import React, { useEffect, useState } from "react";
import axios from "axios";
import { imgSrc } from "../utils/img";             // if you use the helper
import "./UserOrders.css";

export default function UserOrders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setError("Not logged in."); setLoading(false); return; }

    axios.get("http://localhost:8070/api/orders/confirmed/user", {
      headers:{ Authorization:`Bearer ${token}` }
    })
    .then(res => setOrders(res.data))
    .catch(err => {
      console.error(err);
      setError("Failed to load orders.");
    })
    .finally(() => setLoading(false));
  }, []);

  /* ---------- render ---------- */
  if (loading) return <p className="center">⏳ Loading…</p>;
  if (error)   return <p className="center">{error}</p>;

  return (
    <div className="user-orders-container">
      <h2>Your Confirmed Orders</h2>

      {orders.length === 0 ? (
        <p>No confirmed orders yet.</p>
      ) : (
        <div className="order-list">
          {orders.map(o => (
            <div className="order-card" key={o.orderId}>
              <img
                src={imgSrc(o.productImage)}
                alt={o.productName}
                className="order-product-img"
              />
              <div className="order-info">
                <h3>{o.productName}</h3>
                <p><strong>Shop:</strong> {o.shopName}</p>
                <p><strong>Quantity:</strong> {o.quantity}</p>
                <p><strong>Total:</strong> ₹{o.totalAmount}</p>
                <p><strong>Payment:</strong> {o.paymentMethod.toUpperCase()}</p>
                <p className="status-label">
                  Status: <span className="confirmed">Confirmed</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
