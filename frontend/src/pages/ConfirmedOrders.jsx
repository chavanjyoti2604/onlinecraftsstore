import React, { useEffect, useState } from "react";
import axios from "axios";
import { imgSrc } from "../utils/img";
import "./ConfirmedOrders.css";

export default function ConfirmedOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ensure shopId */
  const ensureShopId = async (token) => {
    let id = localStorage.getItem("sellerShopId");
    if (id) return id;
    const res = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/shop/my-approved-shop`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    id = (res.data.shopId ?? res.data).toString();
    localStorage.setItem("sellerShopId", id);
    return id;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setError("❌ Not logged in."); setLoading(false); return; }

    (async () => {
      try {
        const shopId = await ensureShopId(token);
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/orders/shop/${shopId}/confirmed`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(data);
      } catch (e) {
        console.error(e);
        setError("Failed to load confirmed orders.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="center">⏳ Loading…</p>;
  if (error)   return <p className="center">{error}</p>;
  if (!orders.length) return <p className="center">No confirmed orders.</p>;

  return (
    <div className="confirmed-orders-container">
      <h2>Confirmed Orders</h2>

      <ul className="confirmed-orders-list">
        {orders.map(o => (
          <li key={o.id} className="confirmed-order-item">
            <img src={imgSrc(o.productImage)} alt={o.productName} className="product-img" />
            <div className="order-info">
              <p><strong>Product:</strong> {o.productName}</p>
              <p><strong>Buyer:</strong> {o.userEmail}</p>
              <p><strong>Address:</strong> {o.deliveryAddress}</p> {/* NEW */}
              <p><strong>Quantity:</strong> {o.quantity}</p>
              <p><strong>Payment:</strong> {o.paymentMethod}</p>
              <p><strong>Status:</strong> Confirmed ✅</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
