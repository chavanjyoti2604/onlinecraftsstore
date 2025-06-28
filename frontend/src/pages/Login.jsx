import { useState } from "react";
import axios from "axios";
import InputField from "../components/InputField";
import "./Login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      /* ---------- 1. LOGIN ---------- */
      const { data } = await axios.post("http://localhost:8070/auth/login", formData);
      const { token, role, userId, email } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("roles", role);
      localStorage.setItem("userEmail", email);
      if (userId) localStorage.setItem("userId", userId);

      /* ---------- 2. GET APPROVED SHOP IF SELLER ---------- */
      if (role === "ROLE_SELLER") {
        try {
          const shopRes = await axios.get("http://localhost:8070/shop/my-approved-shop", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const { shopId } = shopRes.data;      // ←— UPDATED
          if (shopId) {
            localStorage.setItem("sellerShopId", shopId.toString());
            console.log("✅ Saved sellerShopId:", shopId);
          } else {
            localStorage.removeItem("sellerShopId");
            console.warn("⚠️ No approved shop found for seller");
          }
        } catch (shopErr) {
          console.error("❌ Error fetching seller shop:", shopErr);
          localStorage.removeItem("sellerShopId");
        }
      } else {
        localStorage.removeItem("sellerShopId");
      }

      alert("Login successful!");

      /* ---------- 3. REDIRECT BY ROLE ---------- */
      if (role === "ROLE_USER")              navigate("/profile");
      else if (role === "ROLE_SELLER")       navigate("/seller-profile");
      else if (role === "ROLE_ADMIN")        navigate("/pending");
      else if (role === "ROLE_SUPER_ADMIN")  navigate("/admin-dashboard");
      else                                   navigate("/profile");
    } catch (error) {
      alert("Login failed. Please check credentials.");
      console.error("❌ Login error:", error);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <InputField label="Email" type="email" value={formData.email}
                    onChange={handleChange} name="email" />
        <InputField label="Password" type="password" value={formData.password}
                    onChange={handleChange} name="password" />
        <button type="submit">Login</button>
        <div className="register-link">
          <p>Don't have an account? <a href="/register">Register here</a></p>
        </div>
      </form>
    </div>
  );
}
