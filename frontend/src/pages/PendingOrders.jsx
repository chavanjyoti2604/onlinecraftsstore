import React, { useEffect, useState } from "react";
import axios from "axios";
import { imgSrc } from "../utils/img";
import "./PendingOrders.css";

export default function PendingOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  const token = localStorage.getItem("token");

  /* ensure sellerShopId */
  const ensureShopId = async () => {
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

  /* initial fetch */
  useEffect(() => {
    if (!token) { setError("❌ Not logged in."); setLoading(false); return; }

    (async () => {
      try {
        const shopId = await ensureShopId();
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/orders/shop/${shopId}/pending`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(data);
      } catch (e) {
        console.error(e);
        setError("Failed to load pending orders.");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  /* confirm handler */
  const confirmOrder = async (orderId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/orders/confirm/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(prev => prev.filter(o => o.id !== orderId));
      alert("Order confirmed!");
    } catch (err) {
      console.error("Confirm failed:", err);
      alert("Failed to confirm order.");
    }
  };

  /* render */
  if (loading) return <p className="center">⏳ Loading…</p>;
  if (error)   return <p className="center">{error}</p>;
  if (!orders.length) return <p className="center">No pending orders.</p>;

  return (
    <div className="pending-orders-container">
      <h2>🕓 Pending Orders</h2>

      <div className="orders-grid">
        {orders.map(o => (
          <div key={o.id} className="order-card">
            {/* left pane: product */}
            <div className="left-col">
              <img src={imgSrc(o.productImage)} alt={o.productName} className="product-image" />
              <p className="product-title">{o.productName}</p>
              <button className="btn-confirm" onClick={() => confirmOrder(o.id)}>
                Confirm ✅
              </button>
            </div>

            {/* right pane: details */}
            <div className="right-col">
              <p><strong>Order&nbsp;ID:</strong> #{o.id}</p>
              <p><strong>User&nbsp;Email:</strong> {o.userEmail}</p>
              <p><strong>Address:</strong> {o.deliveryAddress}</p>

              {o.paymentScreenshot ? (
                <details className="screenshot-toggle">
                  <summary>View Screenshot</summary>
                  <img src={imgSrc(o.paymentScreenshot)} alt="Payment proof" />
                </details>
              ) : (
                <p><em>No screenshot uploaded</em></p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
