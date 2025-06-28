import { useEffect, useState } from "react";
import api from "../services/api";
import { imgSrc } from "../utils/img";      // ✅ helper to prepend /images/ if needed
import "./MyProducts.css";

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(true);

  /* fetch once on mount */
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/product/my-products");   // token via api.js
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        const status = err.response?.status;
        if      (status === 401) setError("❌ Unauthorized: Please log in again.");
        else if (status === 403) setError("❌ Forbidden: Access denied.");
        else                     setError("❌ Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------- render ---------- */
  return (
    <div className="product-list">
      <h2>🛍️ My Products</h2>

      {loading && <p>Loading products...</p>}
      {!loading && error && <p className="error-message">{error}</p>}
      {!loading && !error && products.length === 0 && <p>No products found.</p>}

      {!loading && !error && products.length > 0 && (
        <ul className="products-ul">
          {products.map((p) => (
            <li key={p.id} className="product-item">
              <img
                src={imgSrc(p.imageUrl)}
                alt={p.name}
                className="product-thumb"
              />

              <div className="product-info">
                <strong>{p.name}</strong> – ₹{p.price}
                <br />
                <small>{p.description}</small>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
