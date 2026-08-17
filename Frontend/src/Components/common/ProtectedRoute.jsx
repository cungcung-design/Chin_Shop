import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * Guards routes that need a signed-in customer (cart, orders).
 * Mirrors AdminRoute but for any authenticated role, and remembers where the
 * user was heading so login can send them back.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: "50vh" }}>
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden-text">Loading…</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
