import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ProductsContext } from "./ProductContext";
import { CartContext } from "../context/CartContext";
import { rateProduct } from "../../libs/api";
import MediaImage from "../common/MediaImage";
import { deleteComment } from "../../libs/api";
import "./style/Details.css";

export default function Details({ productId }) {
  const { id: routeId } = useParams();
  const resolvedId = productId || routeId;

  const {
    products,
    setProducts,
    loading: productsLoading,
    error: productsError,
  } = useContext(ProductsContext);
  const { addItemToCart, user } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [variantError, setVariantError] = useState("");

  useEffect(() => {
    const prod = products.find((p) => p._id === resolvedId);
    if (prod) {
      setProduct(prod);
      setCommentsList(prod.comments || []);
      const fallbackImage = prod.imageUrl?.[0] || "";
      if (prod.colors && prod.colors.length > 0) {
        setMainImage(prod.colors[0].image || fallbackImage);
        setSelectedColor(prod.colors[0].color);
      } else {
        setMainImage(fallbackImage);
      }
    }
  }, [resolvedId, products]);

  const handleClick = (star) => {
    setRating(star);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must log in to leave a review.");
      return;
    }
    if (!rating) {
      toast.error("Please pick a star rating.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment.");
      return;
    }

    setSubmittingReview(true);
    try {
      const updatedProduct = await rateProduct(resolvedId, rating, comment);
      setProduct(updatedProduct);
      setCommentsList(updatedProduct.comments || []);
      setProducts(
        products.map((p) => (p._id === resolvedId ? updatedProduct : p))
      );
      setRating(0);
      setComment("");
      toast.success("Thanks! Your review has been posted.");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const updatedComments = await deleteComment(product._id, commentId);
      setCommentsList(updatedComments);
      setProduct({ ...product, comments: updatedComments });
      toast.success("Comment deleted.");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to delete comment.");
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("You must log in to add items to the cart.");
      return;
    }
    if (product.sizes?.length > 0 && !selectedSize) {
      setVariantError("Please choose a size first.");
      return;
    }
    if (product.colors?.length > 0 && !selectedColor) {
      setVariantError("Please choose a colour first.");
      return;
    }
    setVariantError("");

    setAdding(true);
    try {
      await addItemToCart(
        product._id,
        quantity,
        selectedColor,
        selectedSize,
        mainImage
      );
      const details = [selectedColor, selectedSize].filter(Boolean);
      toast.success(
        `${product.name}${
          details.length ? ` (${details.join(", ")})` : ""
        } added to cart!`
      );
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to add item to cart.");
    } finally {
      setAdding(false);
    }
  };

  if (!product) {
    if (productsLoading) {
      return (
        <div className="details-modal details-state">
          <div className="spinner-border" role="status">
            <span className="visually-hidden-text">Loading product…</span>
          </div>
        </div>
      );
    }
    return (
      <div className="details-modal details-state">
        <h5 className="mb-2">Product not available</h5>
        <p className="text-muted mb-3">
          {productsError ||
            "This product may have been removed from the catalogue."}
        </p>
        <Link to="/shop" className="btn btn-primary btn-sm">
          Browse the shop
        </Link>
      </div>
    );
  }

  const avgRating = (product.averageRating || 0).toFixed(1);

  return (
    <div className="details-modal">
      <div className="details-images">
        <div className="main-img-wrap">
          <MediaImage
            src={mainImage || "/uploads/images/ass1.png"}
            alt={product.name}
            className="main-img"
          />
        </div>
        {(product.colors?.length > 0 || product.imageUrl?.length > 0) && (
          <div className="thumbs">
            {(product.colors && product.colors.length > 0
              ? product.colors
              : (product.imageUrl || []).map((img) => ({ image: img, color: "" }))
            ).map((c, index) => (
              <button
                key={`${c.image}-${index}`}
                type="button"
                className={`thumb-btn ${mainImage === c.image ? "thumb-btn--active" : ""}`}
                aria-label={
                  c.color
                    ? `Show ${c.color} variant`
                    : `Show image ${index + 1}`
                }
                onClick={() => {
                  setMainImage(c.image);
                  if (c.color) setSelectedColor(c.color);
                }}
              >
                <MediaImage
                  src={c.image}
                  alt=""
                  className="thumb-img"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="details-info">
        <div className="details-header">
          <span className="details-category">{product.categoryId?.name}</span>
          <h3 className="details-title">{product.name}</h3>
        </div>

        <p className="details-price">${Number(product.price || 0).toFixed(2)}</p>

        <div className="details-stock-row">
          {product.stock > 0 ? (
            <span className="details-stock details-stock--in">In stock ({product.stock})</span>
          ) : (
            <span className="details-stock details-stock--out">Out of stock</span>
          )}
          <span className="details-rating">
            <span className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${star <= (hover || Math.round(product.averageRating || 0)) ? "star-btn--filled" : ""}`}
                  onClick={() => handleClick(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  aria-label={`${star} star`}
                >
                  ★
                </button>
              ))}
            </span>
            <span className="rating-count">({avgRating})</span>
          </span>
        </div>

        {product.description && (
          <p className="details-description">{product.description}</p>
        )}

        {product.colors && product.colors.length > 0 && (
          <div className="details-option-row">
            <span className="details-option-label">Color</span>
            <div className="details-option-values">
              {product.colors.map((c, i) => (
                <button
                  key={`${c.color}-${i}`}
                  type="button"
                  className={`color-swatch ${selectedColor === c.color ? "color-swatch--active" : ""}`}
                  style={{ backgroundColor: c.color.toLowerCase() }}
                  aria-label={c.color}
                  aria-pressed={selectedColor === c.color}
                  onClick={() => {
                    setSelectedColor(c.color);
                    setMainImage(c.image);
                    setVariantError("");
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {product.sizes && product.sizes.length > 0 && (
          <div className="details-option-row">
            <span className="details-option-label">Size</span>
            <div className="details-option-values">
              {product.sizes.map((size, i) => (
                <button
                  key={`${size}-${i}`}
                  type="button"
                  className={`size-chip ${selectedSize === size ? "size-chip--active" : ""}`}
                  aria-pressed={selectedSize === size}
                  onClick={() => {
                    setSelectedSize(size);
                    setVariantError("");
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="details-option-row">
          <span className="details-option-label">Quantity</span>
          <div className="qty-control">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <span aria-live="polite">{quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </button>
          </div>
        </div>

        {variantError && (
          <p className="details-error" role="alert">{variantError}</p>
        )}

        <button
          className="add-cart-btn"
          onClick={handleAddToCart}
          disabled={adding || product.stock === 0}
        >
          {adding ? "Adding…" : product.stock === 0 ? "Out of stock" : "Add to Cart"}
        </button>

        <div className="reviews-section">
          <h4 className="reviews-title">Reviews</h4>

          <form className="review-form" onSubmit={handleSubmit}>
            <div className="review-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${star <= (hover || rating) ? "star-btn--filled" : ""}`}
                  onClick={() => handleClick(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  aria-label={`${star} star`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              placeholder="Write your comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
            <button
              type="submit"
              className="review-submit"
              disabled={submittingReview}
            >
              {submittingReview ? "Submitting…" : "Submit Review"}
            </button>
          </form>

          <div className="reviews-list">
            {commentsList.length === 0 && (
              <p className="reviews-empty">No reviews yet — be the first.</p>
            )}
            {commentsList.map((c, index) => (
              <div key={c._id || index} className="review-item">
                <div className="review-item-header">
                  <strong className="review-author">
                    {c.user?.name || c.user?.email || "Unknown User"}
                  </strong>
                  {c.user?._id === user?.id && (
                    <button
                      className="review-delete"
                      onClick={() => handleDeleteComment(c._id)}
                      aria-label="Delete review"
                    >
                      ×
                    </button>
                  )}
                </div>
                <p className="review-text">{c.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
