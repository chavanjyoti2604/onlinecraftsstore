// src/pages/Splash.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, getUserRoles } from "../utils/auth";
import "./Splash.css";

export default function Splash() {
  const nav   = useNavigate();
  const token = getToken();
  const roles = getUserRoles();

  /* redirect after 8 s */
  useEffect(() => {
    const id = setTimeout(() => {
      if (!token)                          return nav("/login",           { replace: true });
      if (roles.includes("ROLE_SELLER"))   return nav("/seller-profile", { replace: true });
      if (roles.includes("ROLE_USER"))     return nav("/product-list",   { replace: true });
      if (roles.includes("ROLE_ADMIN"))    return nav("/pending",        { replace: true });
      if (roles.includes("ROLE_SUPER_ADMIN"))
                                           return nav("/admin-dashboard",{ replace: true });
      nav("/login", { replace: true });
    }, 8000);
    return () => clearTimeout(id);
  }, [nav, token, roles]);

  return (
    <div className="splash-wrapper">
      <div className="splash-overlay">
        <div className="title-background-shape" />

        <h1 className="headline">
          <span>Online</span>
          <span>Handicrafts Store</span>
          <div className="tagline">Authentic • Artistic • Indian Elegance</div>
        </h1>

        {/* outline strokes already in CSS */}
        <div className="decor-lines"></div>
        <div className="decor-lines second-line"></div>

        {/* ▶️ PHOTO-COLLAGE */}
        <div className="collage">
          {/* decorative layered parallelograms */}
          <span className="decor-box white-base"></span>
          <span className="decor-box blue-overlay"></span>

          {/* image boxes */}
          <div className="triangle-row top-row">
            <div className="box kite b1"></div>
            <div className="box kite b2"></div>
          </div>
          <div className="triangle-row">
            <div className="box kite b3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
