import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./style/RecentlyView.css";
import { BsEye } from "react-icons/bs";
import Details from "./Details";   // ✅ ADD THIS

export default function RecentlyViews() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const { addItemToCart } = useContext(CartContext);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const navigate = useNavigate();

  // Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const toastTimeoutRef = useRef(null);

  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);

    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);

    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
      toastTimeoutRef.current = null;
    }, 3000);
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    setRecentlyViewed(stored);
  }, []);

  // Add to Cart
  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      showNotification("Please log in to add items to cart.", "error");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      await addItemToCart(product._id, 1);
      showNotification(`${product.name} added to cart!`, "success");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      showNotification("Failed to add to cart. Please try again.", "error");
    }
  };

  // View Product
  const handleViewProduct = (product) => {
    const stored = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    const updated = [product, ...stored.filter((p) => p._id !== product._id)];
    if (updated.length > 10) updated.pop();

    localStorage.setItem("recentlyViewed", JSON.stringify(updated));

    setSelectedProductId(product._id); // OPEN OVERLAY
  };

  return (
    <section className="recently-section">
      <div className="container">
        <h2 className="recently-title mb-4">Recently Viewed</h2>

        {recentlyViewed.length === 0 ? (
          <p>No recently viewed products.</p>
        ) : (
          <div className="recently-scroll-container">
            {recentlyViewed.slice(0, 3).map((product, index) => (
              <div key={index} className="recently-card flex-shrink-0">
                <div className="p-3 card-img">
                  <div className="image-container">
                    <img
                      src={product.imageUrl}
                      className="image"
                      alt={product.name}
                      style={{
                        objectFit: "cover",
                        borderRadius: "10px 10px 0 0",
                      }}
                    />
                  </div>

                  <div className="card-body text-center">
                    <h5 className="card-title">{product.name}</h5>
                    <h6 className="card-text">{product.description}</h6>

                    <div className="d-flex align-items-center justify-content-evenly mb-2">
                      <div className="rating">
                        {"★".repeat(Math.floor(product.averageRating || 0))}
                        {"☆".repeat(5 - Math.floor(product.averageRating || 0))}
                        <span className="rating-number text-dark">
                          ({(product.averageRating || 0).toFixed(1)})
                        </span>
                      </div>

                      <div className="price ms-3 fw-bold">
                        ${product.price}
                      </div>
                    </div>

                    <div className="d-flex justify-content-between recently-buttons">
                      <button
                        className="btn btn-outline-secondary d-flex align-items-center gap-2"
                        onClick={() => handleViewProduct(product)}
                      >
                        <BsEye /> View
                      </button>

                      <button
                        className="btn btn-gradient"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    {/* ⭐ CATEGORY STYLE OVERLAY ⭐ */}
{selectedProductId && (
  <div className="overlay">
    <div className="overlay-content">
      <button className="close-btn" onClick={() => setSelectedProductId(null)}>
        &times;
      </button>

      <Details productId={selectedProductId} />
    </div>
  </div>
)}


      {/* Toast */}
      {showToast && (
        <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
          <div
            className={`toast align-items-center text-bg-${
              toastType === "success" ? "success" : "danger"
            } border-0 show`}
          >
            <div className="d-flex">
              <div className="toast-body">{toastMessage}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
