import React, { useEffect, useState, useContext, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion, useAnimation, useInView } from "framer-motion";
import { getProducts } from "../../libs/api";
import { BsCartPlus, BsEye } from "react-icons/bs";
import "./style/NewArrival.css";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../Components/context/CartContext";
import { AuthContext } from "../../Components/context/AuthContext";
import Details from "./Details";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const { addItemToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedProductId, setSelectedProductId] = useState(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const toastTimeoutRef = useRef(null);

  const sectionRef = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [isInView, controls]);
  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);

    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);

    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
      toastTimeoutRef.current = null;
    }, 1000);
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    }
    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    if (!user) {
      showNotification("Please log in to add items to cart.", "error");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      await addItemToCart(product._id);
      showNotification(`${product.name} added to cart!`, "success");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      showNotification("Failed to add item to cart.", "error");
    }
  };

  const handleViewProduct = (productId) => {
    setSelectedProductId(productId);
  };

return (
    <section
      id="newarrival-section"
      ref={sectionRef}
      style={{ padding: "40px 0", overflow: "hidden" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container">
          <h2 className="text-start mb-4">New Arrival</h2>
          <div
            className="overflow-hidden"
            style={{ display: "flex", gap: "20px" }}
          >
            <motion.div
              className="d-flex"
              style={{ gap: "20px" }}
              initial={{ x: 0 }}
              animate={{ x: "-40%" }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              {products.concat(products).map((product, index) => (
                <div key={index} className="new-card flex-shrink-0">
                  <div className="image-container">
                    <img
                      src={product.imageUrl}
                     
                      className="new-img"
                    />

                    <div className="hover-btns">
                      <button
                        className="icon-btn view-btn"
                        onClick={() => handleViewProduct(product._id)}
                      >
                        <BsEye />
                      </button>

                      <button
                        className="icon-btn cart-btn"
                        onClick={() => handleAddToCart(product)}
                      >
                        <BsCartPlus />
                      </button>
                    </div>
                  </div>
                
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Product Details Overlay */}
      {selectedProductId && (
        <div className="overlay">
          <div className="overlay-content">
            <button
              className="close-btn"
              onClick={() => setSelectedProductId(null)}
            >
              &times;
            </button>
            <Details productId={selectedProductId} />
          </div>
        </div>
      )}
    </section>
  );
}
