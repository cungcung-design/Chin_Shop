import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./style/RecentlyView.css";
import ProductModal from "../common/ProductModal";
import MediaImage from "../common/MediaImage";

const STORAGE_KEY = "chinFashion_recentlyViewed";
const MAX_ITEMS = 6;

export default function RecentlyViews() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const navigate = useNavigate();

  const readStorage = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setRecentlyViewed(raw ? JSON.parse(raw) : []);
    } catch {
      setRecentlyViewed([]);
    }
  }, []);

  const persist = (items) => {
    const trimmed = items.slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    setRecentlyViewed(trimmed);
    window.dispatchEvent(new Event("recentlyViewed:updated"));
  };

  useEffect(() => {
    readStorage();
    const onUpdate = () => readStorage();
    window.addEventListener("recentlyViewed:updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("recentlyViewed:updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [readStorage]);

  const handleViewProduct = (product) => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const filtered = stored.filter((p) => p._id !== product._id);
    persist([
      {
        _id: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        categoryId: product.categoryId,
      },
      ...filtered,
    ]);
    setSelectedProductId(product._id);
  };

  const removeProduct = (productId) => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    persist(stored.filter((p) => p._id !== productId));
  };

  const viewAll = () => {
    const section = document.getElementById("category");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/shop");
    }
  };

  if (recentlyViewed.length === 0) return null;

  return (
    <section className="recently-section">
      <div className="recently-inner">
        <div className="recently-header">
          <div className="recently-header__text">
            <span className="recently-eyebrow">Recently Viewed</span>
            <h2 className="recently-title">Pieces You've Explored</h2>
            <p className="recently-subtitle">Continue where you left off.</p>
          </div>
          {recentlyViewed.length > 4 && (
            <button className="recently-view-all" onClick={viewAll}>
              <span>View All</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        <div className="recently-grid">
          {recentlyViewed.slice(0, 6).map((product) => (
            <div key={product._id} className="recently-card" onClick={() => handleViewProduct(product)}>
              <div className="recently-card__image-wrap">
                <MediaImage
                  src={product.imageUrl}
                  alt={product.name}
                  className="recently-card__image"
                  loading="lazy"
                />
                <button
                  className="recently-card__remove"
                  aria-label={`Remove ${product.name} from recently viewed`}
                  onClick={() => removeProduct(product._id)}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="recently-card__body">
                <h3 className="recently-card__name">{product.name}</h3>
                <span className="recently-card__collection">
                  {product.categoryId?.name || "Collection"}
                </span>
                <span className="recently-card__price">
                  RM {Number(product.price || 0).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProductModal
        productId={selectedProductId}
        onClose={() => setSelectedProductId(null)}
      />
    </section>
  );
}
