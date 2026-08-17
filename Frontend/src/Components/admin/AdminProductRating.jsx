import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getProducts, clearProductRatingsComments } from "../../libs/api";
import "bootstrap/dist/css/bootstrap.min.css";
import ConfirmDialog from "../common/ConfirmDialog";
import MediaImage from "../common/MediaImage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/AdminProductRating.css";

// Render stars
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} style={{ color: i <= rating ? "#ffc107" : "#e4e5e9" }}>
        {i <= rating ? "★" : "☆"}
      </span>
    );
  }
  return stars;
};

export default function AdminProductRating() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingClear, setPendingClear] = useState(null);
  const [clearing, setClearing] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
        ? data.products
        : Array.isArray(data?.items)
        ? data.items
        : [];

      setProducts(
        list.filter(
          (product) =>
            (product.comments && product.comments.length > 0) ||
            (product.averageRating && product.averageRating > 0)
        )
      );
      setError("");
    } catch (err) {
      console.error("Error loading products:", err);
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Clear ratings and comments for a product
  const confirmClear = async () => {
    if (!pendingClear) return;
    setClearing(true);
    try {
      await clearProductRatingsComments(pendingClear._id);
      setProducts(products.filter((p) => p._id !== pendingClear._id));
      toast.success(`Cleared feedback for "${pendingClear.name}".`);
    } catch (err) {
      console.error("Failed to clear ratings:", err);
      toast.error(err.message || "Failed to clear ratings and comments.");
    } finally {
      setClearing(false);
      setPendingClear(null);
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Main content */}
      <div className="flex-grow-1 p-3 p-md-4">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h3 className="mb-0">⭐ Product Ratings &amp; Comments</h3>
        </div>

        {loading ? (
          <p className="text-muted">Loading products…</p>
        ) : error ? (
          <div className="alert alert-danger d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={fetchProducts}
            >
              Retry
            </button>
          </div>
        ) : products.length === 0 ? (
          <p className="text-muted">
            No products have received ratings or comments yet.
          </p>
        ) : (
        /* Table */
        <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Rating</th>
              <th>Comments</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                 <td>
                   <MediaImage
                     src={product.imageUrl}
                     alt={product.name}
                     style={{
                       width: "60px",
                       height: "60px",
                       objectFit: "cover",
                       borderRadius: "5px",
                     }}
                   />
                 </td>

                <td>{product.name}</td>

                <td className="fs-4">
                  {product.averageRating
                    ? renderStars(Math.round(product.averageRating))
                    : "N/A"}
                </td>

                <td>
                  {product.comments && product.comments.length > 0 ? (
                    <ul style={{ paddingLeft: "20px" }}>
                      {product.comments.map((cmt) => (
                        <li key={cmt._id} style={{ marginBottom: "10px" }}>
                        
                          <strong>
                            {cmt.user?.name || "Unknown User"}:
                          </strong>{" "}
                          {cmt.comment}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "No comments"
                  )}
                </td>

                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setPendingClear(product)}
                  >
                    Clear Ratings &amp; Comments
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        )}
      </div>

      <ConfirmDialog
        open={!!pendingClear}
        title="Clear all feedback?"
        message={
          pendingClear
            ? `Every rating and comment on "${pendingClear.name}" will be deleted. The product itself is kept.`
            : ""
        }
        confirmLabel="Clear feedback"
        busy={clearing}
        onConfirm={confirmClear}
        onCancel={() => setPendingClear(null)}
      />
    </div>
  );
}
