import { NavLink, useNavigate } from "react-router-dom";
import { getToken, getUserRoles, fetchUserStatusFromAPI } from "../utils/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Navbar.css";

export default function Navbar() {

  const navigate = useNavigate();

  const [token, setToken]               = useState(null);
  const [roles, setRoles]               = useState([]);
  const [userStatus, setUserStatus]     = useState(null);
  const [notificationCount, setCount]   = useState(0);

  /* ------------------------------------------------------------------ */
  useEffect(() => {

    const updateStatus = async () => {
      /* basic auth info */
      const tkn  = getToken();
      const rl   = getUserRoles();
      const stat = await fetchUserStatusFromAPI();

      setToken(tkn);
      setRoles(rl);
      setUserStatus(stat);

      /* user-side notification badge */
      if (tkn && rl.includes("ROLE_USER")) {
        try {
          const res   = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/notifications/user`,
            { headers:{ Authorization:`Bearer ${tkn}` } }
          );
          const notes  = Array.isArray(res.data) ? res.data : [];
          const unread = notes.filter(n => n.isRead === false);
          setCount(unread.length);
        } catch (e) {
          console.error("Notification fetch failed", e);
        }
      }
    };

    updateStatus();
    const id = setInterval(updateStatus, 8000);   // refresh badge every 8 s
    return () => clearInterval(id);

  }, []);
  /* ------------------------------------------------------------------ */

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* ---------------- LEFT ---------------- */}
      <ul className="navbar-left">
        {token && (
          <li>
            <NavLink
              to={roles.includes("ROLE_USER") ? "/product-list" : "/"}
              className={({isActive}) => (isActive ? "active" : "")}
            >
              Home
            </NavLink>
          </li>
        )}
      </ul>

      {/* ---------------- RIGHT ---------------- */}
      <ul className="navbar-right">
        {!token ? (
          <>
            <li><NavLink to="/login">Login</NavLink></li>
            <li><NavLink to="/register">Register</NavLink></li>
          </>
        ) : (
          <>
            <li><NavLink to="/profile">Profile</NavLink></li>

            {/* ---------- USER LINKS ---------- */}
            {roles.includes("ROLE_USER") && (
              <>
                <li><NavLink to="/cart">Cart</NavLink></li>
                <li><NavLink to="/user-orders">Orders</NavLink></li> {/* NEW */}
                <li>
                  <NavLink to="/user-notifications">
                    Notifications{" "}
                    {notificationCount > 0 && (
                      <span className="badge">{notificationCount}</span>
                    )}
                  </NavLink>
                </li>
              </>
            )}

            {/* ---------- SELLER LINKS ---------- */}
            {roles.includes("ROLE_SELLER") && (
              <>
                <li><NavLink to="/seller-profile">Seller Status</NavLink></li>
                {userStatus === "APPROVED" && (
                  <>
                    <li><NavLink to="/seller-pending-orders">Pending Orders</NavLink></li>
                    <li><NavLink to="/seller-confirmed-orders">Confirmed Orders</NavLink></li>
                    <li><NavLink to="/add-shop">Add Shop</NavLink></li>
                    <li><NavLink to="/my-shops">My Shops</NavLink></li>
                    <li><NavLink to="/add-product">Add Product</NavLink></li>
                    <li><NavLink to="/my-products">My Products</NavLink></li>
                  </>
                )}
              </>
            )}

            {/* ---------- ADMIN LINKS ---------- */}
            {roles.includes("ROLE_ADMIN") && (
              <>
                <li><NavLink to="/admin-status">Admin Status</NavLink></li>
                {userStatus === "APPROVED" && (
                  <>
                    <li><NavLink to="/pending">Pending Sellers</NavLink></li>
                    <li><NavLink to="/approved">Approved Sellers</NavLink></li>
                    <li><NavLink to="/pending-shops">Pending Shops</NavLink></li>
                    <li><NavLink to="/approved-shops">Approved Shops</NavLink></li>
                  </>
                )}
              </>
            )}

            {/* ---------- SUPER-ADMIN LINKS ---------- */}
            {roles.includes("ROLE_SUPER_ADMIN") && (
              <>
                <li><NavLink to="/pending">Pending Sellers</NavLink></li>
                <li><NavLink to="/approved">Approved Sellers</NavLink></li>
                <li><NavLink to="/pending-shops">Pending Shops</NavLink></li>
                <li><NavLink to="/approved-shops">Approved Shops</NavLink></li>
                <li><NavLink to="/pending-admins">Pending Admins</NavLink></li>
                <li><NavLink to="/approved-admins">Approved Admins</NavLink></li>
                <li><NavLink to="/admin-dashboard">Super Admin Dashboard</NavLink></li>
                <li><NavLink to="/create-user">Create User</NavLink></li>
              </>
            )}

            {/* ---------- LOGOUT ---------- */}
            <li>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
