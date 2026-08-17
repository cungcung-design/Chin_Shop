import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./style/Category.css";

import { ProductsContext } from "./ProductContext";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { getCategories } from "../../libs/api";
import ProductModal from "../common/ProductModal";
import {
  EmptyState,
  ErrorState,
  ProductGridSkeleton,
} from "../common/StateBlock";

const PAGE_SIZE = 8;

const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e8e0d4'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%233a3a3a' font-family='sans-serif' font-size='18'%3ENo Image%3C/text%3E%3C/svg%3E";

const getPageSize = () => {
  if (typeof window === "undefined") return PAGE_SIZE;
  if (window.innerWidth < 768) return 4;
  return PAGE_SIZE;
};

export default function Category() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, error, refetch } = useContext(ProductsContext);
  const { user } = useContext(AuthContext);
  const { addItemToCart } = useContext(CartContext);

  const initialCategory = searchParams.get("category") || "";
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [addingId, setAddingId] = useState(null);
  const [pageSize, setPageSize] = useState(() => getPageSize());

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        setCategories(await getCategories());
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    }
    fetchCategories();
  }, []);

  // Sync category selection with the URL query string so refresh keeps the filter.
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category") || "";
    setSelectedCategory(categoryFromUrl);
  }, [searchParams]);

  // Scroll to top whenever the category filter or page changes.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedCategory, currentPage]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  // Reset paging whenever the filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  // Keep page size in sync with viewport width
  useEffect(() => {
    const onResize = () => setPageSize(getPageSize());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.categoryId?.name === selectedCategory
      : true;
    const matchesSearch = searchTerm
      ? product.name?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * pageSize;
  const shown = filteredProducts.slice(start, start + pageSize);

  // Add to cart — one request only. This previously called the API directly
  // AND via addItemToCart, so the server recorded double the quantity.
  const handleAddToCart = async (product) => {
    if (!user) {
      toast.error("Please log in to add items to cart.");
      setTimeout(() => navigate("/login"), 1200);
      return;
    }

    if (product.sizes?.length > 0 || product.colors?.length > 0) {
      // Variants must be chosen explicitly — open the quick view instead.
      handleViewProduct(product);
      return;
    }

    setAddingId(product._id);
    try {
      await addItemToCart(product._id, 1, "", "", product.imageUrl?.[0] || "");
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to add product to cart.");
    } finally {
      setAddingId(null);
    }
  };

  // View product overlay
  const handleViewProduct = (product) => {
    const stored = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    const updated = [product, ...stored.filter((p) => p._id !== product._id)];
    if (updated.length > 10) updated.pop();
    localStorage.setItem("recentlyViewed", JSON.stringify(updated));
    // Let RecentlyViews know without needing a page refresh
    window.dispatchEvent(new Event("recentlyViewed:updated"));
    setSelectedProductId(product._id);
  };

  return (
    <section id="category-section" style={{ padding: "28px 0" }}>
      <div className="container">
        <h2>Shop by Category</h2>

        {/* Filters */}
        <div className="category-toolbar">
          <ul className="category-chips">
            <li>
              <button
                type="button"
                className={`category-item ${!selectedCategory ? "active" : ""}`}
                aria-pressed={!selectedCategory}
                onClick={() => handleCategoryChange("")}
              >
                All
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat._id}>
                <button
                  type="button"
                  className={`category-item ${
                    selectedCategory === cat.name ? "active" : ""
                  }`}
                  aria-pressed={selectedCategory === cat.name}
                  onClick={() => handleCategoryChange(cat.name)}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>

          <div className="category-search">
            <label className="visually-hidden-text" htmlFor="product-search">
              Search products
            </label>
            <input
              id="product-search"
              type="search"
              className="form-control"
              placeholder="Search products…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Product grid */}
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No products found"
            message={
              searchTerm || selectedCategory
                ? "Try a different search term or category."
                : "Products will appear here once they're added."
            }
            action={
              (searchTerm || selectedCategory) && (
                <button
                  className="btn btn-light btn-sm"
                  onClick={() => {
                    setSearchTerm("");
                    handleCategoryChange("");
                  }}
                >
                  Clear filters
                </button>
              )
            }
          />
        ) : (
          <>
            <div className="row g-4">
              {shown.map((product) => (
                <div className="col-6 col-md-3" key={product._id}>
                  <div className="category-card text-center">
                    <button
                      type="button"
                      className="category-card__image-btn"
                      aria-label={`Open details for ${product.name}`}
                      onClick={() => handleViewProduct(product)}
                    >
                      <img
                        src={product.imageUrl?.[0] || "/uploads/images/ass1.png"}
                        alt={product.name}
                        className="category-img"
                        loading="lazy"
                        onError={(e) => {
                          const img = e.currentTarget;
                          if (img.src !== PLACEHOLDER_IMG) {
                            img.src = PLACEHOLDER_IMG;
                          }
                        }}
                      />
                    </button>

                    <div className="card-body">
                      <h5 className="mt-2 card-name">{product.name}</h5>
                      {product.description &&
                        product.description.trim() !== product.name.trim() && (
                          <p className="card-desc">{product.description}</p>
                        )}
                      <div className="d-flex align-items-center justify-content-evenly mb-2">
                        <div className="rating">
                          {"★".repeat(Math.floor(product.averageRating || 0))}
                          {"☆".repeat(
                            5 - Math.floor(product.averageRating || 0)
                          )}
                          <span className="rating-number">
                            ({(product.averageRating || 0).toFixed(1)})
                          </span>
                        </div>
                        <div className="price ms-3">
                          ${Number(product.price || 0).toFixed(2)}
                        </div>
                      </div>

                      <div className="d-flex justify-content-between card-actions">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => handleViewProduct(product)}
                        >
                          View
                        </button>

                        <button
                          className="btn btn-outline-cart"
                          disabled={
                            addingId === product._id || product.stock === 0
                          }
                          onClick={() => handleAddToCart(product)}
                        >
                          {product.stock === 0
                            ? "Sold out"
                            : addingId === product._id
                            ? "Adding…"
                            : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="category-pagination">
                <button
                  className="page-btn page-btn--prev"
                  disabled={safePage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  ←
                </button>

                <div className="page-numbers">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const page = idx + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= safePage - 1 && page <= safePage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          className={`page-num ${
                            page === safePage ? "page-num--active" : ""
                          }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      );
                    }
                    if (page === safePage - 2 || page === safePage + 2) {
                      return <span key={page} className="page-ellipsis">…</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  className="page-btn page-btn--next"
                  disabled={safePage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <ProductModal
        productId={selectedProductId}
        onClose={() => setSelectedProductId(null)}
      />
    </section>
  );
}
