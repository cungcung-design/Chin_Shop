import React, { useEffect, useState, useContext, useRef } from "react";
import "./style/Category.css";

import { BsCartPlus, BsEye, BsArrowRight } from "react-icons/bs";
import { ProductsContext } from "./ProductContext";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext"; // <-- use cart context
import { getCategories, addToCart as apiAddToCart } from "../../libs/api";
import Details from "./Details";

export default function Category() {
  const { products } = useContext(ProductsContext);
  const { user } = useContext(AuthContext);
  const { cart, addItemToCart } = useContext(CartContext); // <-- cart context

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const toastTimeoutRef = useRef(null);

  // Toast helper
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

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    }
    fetchCategories();
  }, []);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.categoryId?.name === selectedCategory
      : true;
    const matchesSearch = searchTerm
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  // Add to cart
  const handleAddToCart = async (product) => {
    if (!user) {
      showNotification("Please log in to add items to cart.", "error");
      return;
    }
    try {
      await apiAddToCart(product._id, 1, "", ""); // update backend
      addItemToCart(product._id, 1, "", "", product.imageUrl[0]); // update front-end cart context
      showNotification(`${product.name} added to cart!`, "success");
    } catch (err) {
      console.error(err);
      showNotification("Failed to add product to cart.", "error");
    }
  };

  // View product overlay
  const handleViewProduct = (product) => {
    const stored = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    const updated = [product, ...stored.filter((p) => p._id !== product._id)];
    if (updated.length > 10) updated.pop();
    localStorage.setItem("recentlyViewed", JSON.stringify(updated));
    setSelectedProduct(product);
  };

  const closeOverlay = () => setSelectedProduct(null);

  return (
    <section id="category-section" style={{ padding: "40px 0" }}>
      <div className="container">
        <h2 style={{ color: "white" }}>Shop by Category</h2>

        {/* Category filters */}
        <div className="d-flex mb-3 justify-content-between align-items-center">
          <ul className="d-flex text-white">
            {categories.map((cat) => (
              <li
                key={cat._id}
                className={`category-item ${
                  selectedCategory === cat.name ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                {cat.name}
              </li>
            ))}
          </ul>

          <div className="d-flex gap-3 align-items-center">
            <input
              type="search"
              className="form-control"
              placeholder="Search..."
              style={{ width: "200px" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="form-select w-auto"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product grid */}
        <div className="row g-4">
          {filteredProducts.slice(0, 8).map((product) => (
            <div className="col-6 col-sm-4 col-md-3" key={product._id}>
              <div className="category-card text-center">
                <img
                  src={product.imageUrl[0]}
                  alt={product.name}
                  className="category-img"
                />

                <div className="hover-arrow">
                  <BsArrowRight
                    onClick={() => handleViewProduct(product)}
                    style={{ cursor: "pointer" }}
                  />
                </div>

                <div className="card-body">
                  <h5 className="mt-2">{product.name}</h5>
                  <h6 className="mt-2">{product.description}</h6>
                  <div className="d-flex align-items-center justify-content-evenly mb-2 ">
                    <div className="rating">
                      {"★".repeat(Math.floor(product.averageRating || 0))}
                      {"☆".repeat(5 - Math.floor(product.averageRating || 0))}
                      <span className="rating-number">
                        ({(product.averageRating || 0).toFixed(1)})
                      </span>
                    </div>
                    <div className="price ms-3">${product.price}</div>
                  </div>

                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-outline-secondary d-flex align-items-center gap-2"
                      onClick={() => handleViewProduct(product)}
                    >
                      <BsEye /> View
                    </button>

                    <button
                      className="btn btn-outline-cart d-flex align-items-center gap-2"
                      onClick={() => handleAddToCart(product)}
                    >
                      <BsCartPlus /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <p className="text-center mt-4">No products found.</p>
          )}
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div
          className="toast-container position-fixed top-0 end-0 p-3"
          style={{ zIndex: 1050 }}
        >
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

      {/* Overlay */}
      {selectedProduct && (
        <div className="overlay">
          <div className="overlay-content">
            <button className="close-btn" onClick={closeOverlay}>
              &times;
            </button>
            <Details productId={selectedProduct._id} />
          </div>
        </div>
      )}
    </section>
  );
}
