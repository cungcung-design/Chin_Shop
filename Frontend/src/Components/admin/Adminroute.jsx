import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../Components/context/AuthContext";

/**
 * Admin-only route guard. Named (was an anonymous default export, which broke
 * React Fast Refresh) and now shows a real spinner while the token is decoded.
 */
export default function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden-text">Checking permissions…</span>
        </div>
      </div>
    );
  }

  // Non-admins (including signed-in customers) are sent to the storefront.
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
