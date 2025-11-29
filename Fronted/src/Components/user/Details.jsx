import React, { useState, useEffect, useContext, useRef } from "react";
import { ProductsContext } from "./ProductContext";
import { CartContext } from "../context/CartContext";
import { rateProduct } from "../../libs/api";
import "./style/Details.css";
import { deleteComment } from "../../libs/api";

export default function Details({ productId }) {
  const { products, setProducts } = useContext(ProductsContext);
  const { addItemToCart, user, setUser } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Toast notification
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const toastTimeoutRef = useRef(null);

  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setShowToast(false), 3000);
  };

  // Load product data
  useEffect(() => {
    const prod = products.find((p) => p._id === productId);
    if (prod) {
      setProduct(prod);
      setCommentsList(prod.comments || []);
      if (prod.colors && prod.colors.length > 0) {
        setMainImage(prod.colors[0].image || prod.imageUrl[0]);
        setSelectedColor(prod.colors[0].color);
      } else {
        setMainImage(prod.imageUrl[0]);
      }
    }
  }, [productId, products]);

  // Handle rating click
  const handleClick = (star) => {
    setRating(star);
  };

  // Submit comment & rating
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showNotification("You must log in to comment.", "error");
      return;
    }
    if (!comment.trim()) {
      showNotification("Please write a comment.", "error");
      return;
    }

    try {
      const updatedProduct = await rateProduct(productId, rating, comment);

      // Backend now returns populated comments with user data
      setProduct(updatedProduct);
      setCommentsList(updatedProduct.comments || []);

      setProducts(
        products.map((p) => (p._id === productId ? updatedProduct : p))
      );

      setRating(0);
      setComment("");
      showNotification(
        "Your rating and comment have been submitted!",
        "success"
      );
    } catch (err) {
      console.error(err);
      showNotification("Failed to submit comment.", "error");
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    try {
      const updatedComments = await deleteComment(product._id, commentId);
      setCommentsList(updatedComments);
      setProduct({ ...product, comments: updatedComments });
      showNotification("Comment deleted!", "success");
    } catch (err) {
      console.error(err);
      showNotification("Failed to delete comment", "error");
    }
  };
  if (!product) return <p>Loading...</p>;

  return (
    <div className="details-modal">
      {/* Images */}
      <div className="images-section">
        <img src={mainImage} alt={product.name} className="main-img" />
        <div className="thumbs">
          {(product.colors && product.colors.length > 0
            ? product.colors
            : product.imageUrl.map((img) => ({ image: img, color: "" }))
          ).map((c, index) => (
            <img
              key={index}
              src={c.image}
              alt={c.color || index}
              className={`thumb-img ${mainImage === c.image ? "active" : ""}`}
              onClick={() => {
                setMainImage(c.image);
                if (c.color) setSelectedColor(c.color);
              }}
            />
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="info-section">
        <h5>{product.name}</h5>
        <p className="category">{product.categoryId?.name}</p>
        <p>{product.description}</p>

        {/* Color selection */}
        {product.colors && product.colors.length > 0 && (
          <div className="color-selection mb-2">
            <span>Color: </span>
            {product.colors.map((c, i) => (
              <button
                key={i}
                className={selectedColor === c.color ? "selected" : ""}
                style={{ backgroundColor: c.color.toLowerCase() }}
                onClick={() => {
                  setSelectedColor(c.color);
                  setMainImage(c.image);
                }}
              ></button>
            ))}
          </div>
        )}

        {/* Size selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="size-selection mb-2">
            <span>Size: </span>
            {product.sizes.map((size, i) => (
              <button
                key={i}
                className={selectedSize === size ? "selected" : ""}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {/* Quantity */}
        <div className="quantity mb-2">
          <span>Quantity:</span>
          <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>
            -
          </button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>

        {/* Add to Cart */}
        <button
          className="btn btn-primary add-cart-btn mb-3"
          onClick={async () => {
            if (!user) {
              showNotification(
                "You must log in to add items to the cart.",
                "error"
              );
              return;
            }
            if (product.sizes && product.sizes.length > 0 && !selectedSize) {
              return; // user must select size if applicable
            }
            if (product.colors && product.colors.length > 0 && !selectedColor) {
              return; // user must select color if applicable
            }
            try {
              await addItemToCart(
                product._id,
                quantity,
                selectedColor,
                selectedSize,
                mainImage
              );

              // Build toast message
              let toastMsg = product.name;
              let details = [];
              if (selectedColor) details.push(selectedColor);
              if (selectedSize) details.push(selectedSize);
              if (details.length > 0) toastMsg += ` (${details.join(", ")})`;
              toastMsg += " added to cart!";

              showNotification(toastMsg, "success");
            } catch (err) {
              console.error(err);
              showNotification("Failed to add item to cart.", "error");
            }
          }}
        >
          Add to Cart
        </button>
        {/* Rating Section */}
        <div className="rating-section">
          <div className="rating d-flex align-items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= (hover || rating) ? "filled" : ""}`}
                onClick={() => handleClick(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                ★
              </span>
            ))}
            <span className="rating-number text-dark ms-2">
              ({(product.averageRating || 0).toFixed(1)})
            </span>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Write your comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit" className="btn btn-primary mt-1">
              Submit
            </button>
          </form>

          {/* Comments List with Delete */}
          <div className="comments-list mt-2">
            {commentsList.map((c, index) => (
              <p
                key={c._id || index}
                className="d-flex justify-content-between align-items-center"
              >
                <span>
                  <strong>
                    {c.user?.name || c.user?.email || "Unknown User"}
                  </strong>{" "}
                  {c.comment}
                </span>
                {c.user?._id === user?.id && (
                  <span
                    className="text-danger"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteComment(c._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </span>
                )}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
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
    </div>
  );
}
