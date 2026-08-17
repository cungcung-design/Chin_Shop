import React from "react";
import { Link } from "react-router-dom";

/**
 * Catch-all route. Previously any unknown URL (including the footer's
 * /shop, /about and /contact links) rendered a completely blank page.
 */
export default function NotFound() {
  return (
    <section className="container py-5 text-center" style={{ minHeight: "60vh" }}>
      <h1 className="mb-3">404</h1>
      <h4 className="mb-3">We couldn&apos;t find that page</h4>
      <p className="text-white-50 mb-4">
        The link may be out of date, or the page may have moved.
      </p>
      <div className="d-flex gap-2 justify-content-center flex-wrap">
        <Link to="/" className="btn btn-primary">
          Back to home
        </Link>
        <Link to="/shop" className="btn btn-outline-light">
          Browse the shop
        </Link>
      </div>
    </section>
  );
}
