import React, { useEffect } from "react";
import Details from "../user/Details";
import "./style/common.css";

/**
 * Shared product quick-view modal.
 *
 * Category, NewArrivals and RecentlyViews each had their own copy of this
 * overlay markup; they now all render this one component, which adds the
 * Escape key, backdrop click and scroll locking the copies were missing.
 */
export default function ProductModal({ productId, onClose }) {
  useEffect(() => {
    if (!productId) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [productId, onClose]);

  if (!productId) return null;

  return (
    <div
      className="chin-modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="chin-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Product details"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="chin-modal-close"
          onClick={onClose}
          aria-label="Close product details"
        >
          &times;
        </button>

        <Details productId={productId} />
      </div>
    </div>
  );
}
