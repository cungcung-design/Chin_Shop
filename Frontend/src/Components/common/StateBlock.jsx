import React from "react";
import "./style/common.css";

/**
 * Consistent empty / error state block, plus a product-grid loading skeleton.
 * Previously each page either showed bare "Loading..." text or nothing at all.
 */
export function EmptyState({ icon = "🛍️", title, message, action }) {
  return (
    <div className="chin-state">
      <div className="chin-state-icon" aria-hidden="true">
        {icon}
      </div>
      {title && <div className="chin-state-title">{title}</div>}
      {message && <div className="chin-state-message">{message}</div>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="chin-state" role="alert">
      <div className="chin-state-icon" aria-hidden="true">
        ⚠️
      </div>
      <div className="chin-state-title">Something went wrong</div>
      <div className="chin-state-message">
        {message || "Please try again in a moment."}
      </div>
      {onRetry && (
        <button className="btn btn-light btn-sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

/** Grid of shimmering placeholders sized like the product cards. */
export function ProductGridSkeleton({ count = 4 }) {
  return (
    <div className="row g-4" aria-busy="true" aria-live="polite">
      <span className="visually-hidden-text">Loading products…</span>
      {Array.from({ length: count }).map((_, i) => (
        <div className="col-6 col-sm-4 col-md-3" key={i}>
          <div className="chin-skeleton-card">
            <div className="chin-skeleton-block chin-skeleton-img" />
            <div className="chin-skeleton-block chin-skeleton-line" />
            <div className="chin-skeleton-block chin-skeleton-line short" />
          </div>
        </div>
      ))}
    </div>
  );
}
