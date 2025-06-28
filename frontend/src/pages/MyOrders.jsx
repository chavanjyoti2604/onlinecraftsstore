import { useEffect, useState } from "react";
import axios from "axios";
import { imgSrc } from "../utils/img";      // same helper you use elsewhere
import "./MyOrders.css";

export default function MyOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    const token  = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) { setError("Not logged in."); setLoading(false); return; }

    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/orders/user/${userId}/confirmed`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setOrders(res.data))
      .catch(()  => setError("Failed to load orders."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="center">Loading…</p>;
  if (error)   return <p className="center">{error}</p>;
  if (!orders.length) return <p className="center">No confirmed orders yet.</p>;

  return (
    <div className="my-orders-container">
      <h2>My Confirmed Orders</h2>
      <div className="orders-grid">
        {orders.map(o => (
          <div key={o.orderId} className="order-card">
            <img src={imgSrc(o.productImage)} alt={o.productName} />
            <div className="info">
              <p><strong>{o.productName}</strong></p>
              <p>Shop: {o.shopName}</p>
              <p>Qty: {o.quantity}</p>
              <p>Total: ₹{o.totalAmount}</p>
              <p>Payment: {o.paymentMethod}</p>
              <p className="date">{new Date(o.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
