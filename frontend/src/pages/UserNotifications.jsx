import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserNotifications.css";

export default function UserNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/notifications/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error("Notification fetch error:", err));
  }, []);

  /* helper to derive a clean status from message */
  const getStatus = (msg = "") => {
    const lower = msg.toLowerCase();
    if (lower.includes("confirmed")) return "confirmed";
    if (lower.includes("rejected"))  return "rejected";
    return "pending";
  };

  const badgeLabel = (status) =>
    status === "confirmed"
      ? "Order Confirmed ✅"
      : status === "rejected"
      ? "Order Rejected ⚠️"
      : "Awaiting Seller ⏳";

  return (
    <div className="notifications-container">
      <h2>Order Notifications</h2>

      {notifications.length === 0 ? (
        <p>You have no recent notifications.</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((n) => {
            const status = getStatus(n.message);
            return (
              <li key={n.id} className={`notification-item ${status}`}>
                <div className="notification-content">
                  <p>{n.message}</p>
                  <span className={`status-badge ${status}`}>
                    {badgeLabel(status)}
                  </span>
                </div>

                {n.productImage && (
                  <img
                    src={n.productImage.startsWith("http")
                          ? n.productImage
                          : `${process.env.REACT_APP_API_BASE_URL}/images/${n.productImage}`}
                    alt="Product"
                    className="notification-image"
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
