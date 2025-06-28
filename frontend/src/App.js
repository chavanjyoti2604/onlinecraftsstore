import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

/* ───────── Common Components ───────── */
import Navbar from "./components/Navbar";

/* ───────── Auth helpers ───────── */
import { getToken, getUserRoles } from "./utils/auth";

/* ───────── Pages ───────── */
// Auth / profile
import Login        from "./pages/Login";
import Register     from "./pages/Register";
import Profile      from "./pages/Profile";

// Splash
import Splash       from "./pages/Splash";

// Seller
import SellerStatus from "./pages/SellerStatus";
import AddShop      from "./pages/AddShop";
import MyShops      from "./pages/MyShops";
import AddProduct   from "./pages/AddProduct";
import MyProducts   from "./pages/MyProducts";
import PendingOrders   from "./pages/PendingOrders";
import ConfirmedOrders from "./pages/ConfirmedOrders";

// Admin / Super-admin
import AdminDashboard from "./pages/AdminDashboard";
import CreateUser     from "./pages/CreateUser";
import PendingAdmins  from "./pages/PendingAdmins";
import ApprovedAdmins from "./pages/ApprovedAdmins";
import AdminStatus    from "./pages/AdminStatus";
import PendingSellers from "./pages/PendingSellers";
import ApprovedSellers from "./pages/ApprovedSellers";
import PendingShops   from "./pages/PendingShops";
import ApprovedShops  from "./pages/ApprovedShops";

// User shopping
import ProductList from "./pages/ProductList";
import BuyNow      from "./pages/BuyNow";
import Cart        from "./pages/Cart";

// User utilities
import UserOrders        from "./pages/UserOrders";
import UserNotifications from "./pages/UserNotifications";

/* ───────── helpers ───────── */
function HomeRedirect() {
  const roles = getUserRoles();
  if (roles.includes("ROLE_SELLER"))       return <Navigate to="/seller-profile"   replace />;
  if (roles.includes("ROLE_USER"))         return <Navigate to="/product-list"     replace />;
  if (roles.includes("ROLE_ADMIN"))        return <Navigate to="/pending"          replace />;
  if (roles.includes("ROLE_SUPER_ADMIN"))  return <Navigate to="/admin-dashboard"  replace />;
  return <Navigate to="/login" replace />;
}

const ProtectedRoute = ({ element, allowedRoles }) => {
  const token = getToken();
  const roles = getUserRoles();
  if (!token) return <Navigate to="/login" replace />;
  return roles.some(r => allowedRoles.includes(r))
    ? element
    : <Navigate to="/unauthorized" replace />;
};

const PublicRoute = ({ element }) => {
  const token = getToken();
  const roles = getUserRoles();
  if (!token) return element;

  if (roles.includes("ROLE_SUPER_ADMIN")) return <Navigate to="/admin-dashboard" replace />;
  if (roles.includes("ROLE_ADMIN"))       return <Navigate to="/pending"          replace />;
  if (roles.includes("ROLE_SELLER"))      return <Navigate to="/seller-profile"   replace />;
  if (roles.includes("ROLE_USER"))        return <Navigate to="/product-list"     replace />;
  return <Navigate to="/product-list" replace />;
};

/* ───────── hide-navbar-on-splash wrapper ───────── */
const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const hideNav = pathname === "/";          // splash lives at “/”
  return (
    <>
      {!hideNav && <Navbar />}
      {children}
    </>
  );
};

/* ───────── fallback ───────── */
const Unauthorized = () => (
  <div style={{ padding:"2rem", textAlign:"center" }}>
    <h2>Access Denied</h2>
    <p>You do not have permission to view this page.</p>
    <a href="/">Go back home</a>
  </div>
);

/* ───────── App Root ───────── */
export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>

          {/* ── Splash (navbar is hidden by Layout) ── */}
          <Route path="/" element={<Splash />} />

          {/* ── Public ── */}
          <Route path="/login"    element={<PublicRoute element={<Login />}    />} />
          <Route path="/register" element={<PublicRoute element={<Register />} />} />

          {/* ── Role-based landing (/home) ── */}
          <Route
            path="/home"
            element={
              <ProtectedRoute
                element={<HomeRedirect />}
                allowedRoles={["ROLE_USER","ROLE_SELLER","ROLE_ADMIN","ROLE_SUPER_ADMIN"]}
              />
            }
          />

          {/* ── User storefront ── */}
          <Route path="/product-list"
                 element={<ProtectedRoute element={<ProductList />} allowedRoles={["ROLE_USER"]} />} />
          <Route path="/cart"
                 element={<ProtectedRoute element={<Cart />} allowedRoles={["ROLE_USER"]} />} />
          <Route path="/buy-now"
                 element={<ProtectedRoute element={<BuyNow />} allowedRoles={["ROLE_USER","ROLE_SELLER","ROLE_ADMIN","ROLE_SUPER_ADMIN"]} />} />

          {/* profile & utilities */}
          <Route path="/profile"
                 element={<ProtectedRoute element={<Profile />} allowedRoles={["ROLE_USER","ROLE_SELLER","ROLE_ADMIN","ROLE_SUPER_ADMIN"]} />} />
          <Route path="/user-orders"
                 element={<ProtectedRoute element={<UserOrders />} allowedRoles={["ROLE_USER"]} />} />
          <Route path="/user-notifications"
                 element={<ProtectedRoute element={<UserNotifications />} allowedRoles={["ROLE_USER"]} />} />

          {/* ── Seller ── */}
          <Route path="/seller-profile"
                 element={<ProtectedRoute element={<SellerStatus />} allowedRoles={["ROLE_SELLER"]} />} />
          <Route path="/add-shop"
                 element={<ProtectedRoute element={<AddShop />}      allowedRoles={["ROLE_SELLER"]} />} />
          <Route path="/my-shops"
                 element={<ProtectedRoute element={<MyShops />}      allowedRoles={["ROLE_SELLER"]} />} />
          <Route path="/add-product"
                 element={<ProtectedRoute element={<AddProduct />}   allowedRoles={["ROLE_SELLER"]} />} />
          <Route path="/my-products"
                 element={<ProtectedRoute element={<MyProducts />}   allowedRoles={["ROLE_SELLER"]} />} />
          <Route path="/seller-pending-orders"
                 element={<ProtectedRoute element={<PendingOrders />}   allowedRoles={["ROLE_SELLER"]} />} />
          <Route path="/seller-confirmed-orders"
                 element={<ProtectedRoute element={<ConfirmedOrders />} allowedRoles={["ROLE_SELLER"]} />} />

          {/* ── Admin / Super-admin shared ── */}
          <Route path="/pending"
                 element={<ProtectedRoute element={<PendingSellers />}  allowedRoles={["ROLE_ADMIN","ROLE_SUPER_ADMIN"]} />} />
          <Route path="/approved"
                 element={<ProtectedRoute element={<ApprovedSellers />} allowedRoles={["ROLE_ADMIN","ROLE_SUPER_ADMIN"]} />} />
          <Route path="/pending-shops"
                 element={<ProtectedRoute element={<PendingShops />}    allowedRoles={["ROLE_ADMIN","ROLE_SUPER_ADMIN"]} />} />
          <Route path="/approved-shops"
                 element={<ProtectedRoute element={<ApprovedShops />}   allowedRoles={["ROLE_ADMIN","ROLE_SUPER_ADMIN"]} />} />
          <Route path="/admin-status"
                 element={<ProtectedRoute element={<AdminStatus />}     allowedRoles={["ROLE_ADMIN","ROLE_SUPER_ADMIN"]} />} />

          {/* ── Super-admin only ── */}
          <Route path="/admin-dashboard"
                 element={<ProtectedRoute element={<AdminDashboard />}  allowedRoles={["ROLE_SUPER_ADMIN"]} />} />
          <Route path="/create-user"
                 element={<ProtectedRoute element={<CreateUser />}      allowedRoles={["ROLE_SUPER_ADMIN"]} />} />
          <Route path="/pending-admins"
                 element={<ProtectedRoute element={<PendingAdmins />}   allowedRoles={["ROLE_SUPER_ADMIN"]} />} />
          <Route path="/approved-admins"
                 element={<ProtectedRoute element={<ApprovedAdmins />}  allowedRoles={["ROLE_SUPER_ADMIN","ROLE_ADMIN"]} />} />

          {/* ── Fallbacks ── */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={
            <h2 style={{ textAlign:"center", marginTop:"3rem" }}>404: Page Not Found</h2>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}
