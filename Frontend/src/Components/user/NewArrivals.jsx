import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BsHeart, BsEye } from "react-icons/bs";
import "./style/NewArrival.css";
import { ProductsContext } from "./ProductContext";
import ProductModal from "../common/ProductModal";
import MediaImage from "../common/MediaImage";
import { getProducts, getProductsPaginated } from "../../libs/api";

const PAGE_SIZE_DESKTOP = 4;
const PAGE_SIZE_TABLET = 3;
const PAGE_SIZE_MOBILE = 100;

function getPageSize() {
  if (typeof window === "undefined") return PAGE_SIZE_DESKTOP;
  const width = window.innerWidth;
  if (width <= 767) return PAGE_SIZE_MOBILE;
  if (width <= 991) return PAGE_SIZE_TABLET;
  return PAGE_SIZE_DESKTOP;
}

export default function NewArrivals() {
  const navigate = useNavigate();

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [wishlistIds, setWishlistIds] = useState([]);

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(getPageSize);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPage = useCallback(async (pageNum, size) => {
    setLoading(true);
    setError("");
    try {
      let items = [];
      let pages = 1;

      if (size >= 50) {
        const data = await getProducts();
        if (Array.isArray(data)) {
          items = data.slice(0, 100);
        } else if (data && Array.isArray(data.products)) {
          items = data.products.slice(0, 100);
        }
        pages = 1;
      } else {
        const data = await getProductsPaginated({ page: pageNum, limit: size });

        if (Array.isArray(data)) {
          items = data;
          pages = Math.max(1, Math.ceil(items.length / size));
        } else if (data && Array.isArray(data.products)) {
          items = data.products;
          pages = data.pages || Math.max(1, Math.ceil(items.length / size));
        }
      }

      setProducts(items);
      setTotalPages(pages);
    } catch (err) {
      console.error("Failed to fetch new arrivals:", err);
      setError(err.message || "Failed to load new arrivals.");
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const size = getPageSize();
    setPageSize(size);
    setPage(1);
  }, []);

  useEffect(() => {
    fetchPage(page, pageSize);
  }, [page, pageSize, fetchPage]);

  useEffect(() => {
    const handleResize = () => {
      const size = getPageSize();
      setPageSize(size);
      setPage(1);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goToPage = (next) => {
    setPage(Math.max(1, Math.min(next, totalPages)));
  };

  const handleWishlist = (productId, e) => {
    e.stopPropagation();
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const viewAll = () => {
    const section = document.getElementById("category");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/shop");
    }
  };

  return (
    <section className="new-arrivals-section">
      <div className="new-arrivals-inner">
        {/* Header */}
        <div className="new-arrivals-header">
          <div>
            <span className="new-arrivals-eyebrow">Just In</span>
            <h2 className="new-arrivals-title">New Arrivals</h2>
            <p className="new-arrivals-text">
              Discover the latest pieces inspired by Chin craftsmanship,
              traditional patterns, and contemporary silhouettes.
            </p>
          </div>
          <button className="new-arrivals-view-all" onClick={viewAll}>
            <span>View All</span>
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
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Product Grid */}
        {error ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => fetchPage(page, pageSize)}
              className="px-6 py-2.5 bg-[#173D2B] text-white rounded-full text-sm font-medium hover:bg-[#315C45] transition-all"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="new-arrivals-grid">
            {Array.from({ length: pageSize }).map((_, i) => (
              <div
                key={i}
                className="new-arrival-card"
                style={{ pointerEvents: "none" }}
              >
                <div className="new-arrival-card__image-wrap bg-gray-100 animate-pulse" />
                <div className="new-arrival-card__body">
                  <div className="h-4 bg-gray-100 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="new-arrivals-empty">
            No products yet — new arrivals will appear here.
          </p>
        ) : (
          <>
            <div className="new-arrivals-grid">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="new-arrival-card"
                  onClick={() => setSelectedProductId(product._id)}
                >
                  <div className="new-arrival-card__image-wrap">
                    <MediaImage
                      src={product.imageUrl}
                      alt={product.name}
                      className="new-arrival-card__image"
                      loading="lazy"
                    />
                    <span className="new-arrival-card__new-badge">New</span>
                    <button
                      className="new-arrival-card__wishlist"
                      aria-label={
                        wishlistIds.includes(product._id)
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                      onClick={(e) => handleWishlist(product._id, e)}
                    >
                      <BsHeart
                        size={13}
                        fill={
                          wishlistIds.includes(product._id)
                            ? "#173D2B"
                            : "none"
                        }
                      />
                    </button>
                  </div>
                  <div className="new-arrival-card__body">
                    <h3 className="new-arrival-card__name">
                      {product.name}
                    </h3>
                    <span className="new-arrival-card__collection">
                      {product.categoryId?.name || "Collection"}
                    </span>
                    <div className="new-arrival-card__footer">
                      <span className="new-arrival-card__price">
                        RM {Number(product.price || 0).toFixed(2)}
                      </span>
                      <span className="new-arrival-card__arrow">
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
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="new-arrivals-pagination">
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="new-arrivals-pagination__btn"
                >
                  ←
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => goToPage(pageNum)}
                      aria-current={pageNum === page ? "page" : undefined}
                      className={[
                        "new-arrivals-pagination__btn",
                        pageNum === page ? "new-arrivals-pagination__btn--active" : "",
                      ].join(" ")}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="new-arrivals-pagination__btn"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Details Overlay */}
      <ProductModal
        productId={selectedProductId}
        onClose={() => setSelectedProductId(null)}
      />
    </section>
  );
}
