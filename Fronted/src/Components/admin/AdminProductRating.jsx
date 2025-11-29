import React, { useEffect, useState } from "react";
import { getProducts, clearProductRatingsComments } from "../../libs/api";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./Sidebar";
import "./style/AdminProductRating.css";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();

        console.log("📦 All Products:", data); // <-- ADD THIS

        // Filter to only show products that have ratings or comments
        const ratedProducts = data.filter(
          (product) =>
            (product.comments && product.comments.length > 0) ||
            (product.averageRating && product.averageRating > 0)
        );

        console.log("⭐ Rated Products:", ratedProducts); // OPTIONAL

        setProducts(ratedProducts);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error Loading Products:", err); // <-- ADD THIS
        setError("Failed to load products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Clear ratings and comments for product
  const handleClearRatingsComments = async (id) => {
    console.log("🗑 Clearing ratings/comments for product:", id);

    try {
      await clearProductRatingsComments(id);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error("❌ Failed to clear ratings:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Main content */}
      <div className="flex-grow-1 p-4">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h3>⭐ Product Ratings & Comments</h3>
        </div>

        {/* Table */}
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
                  {product.imageUrl && product.imageUrl.length > 0 ? (
                    <img
                      src={product.imageUrl[0]}
                      alt={product.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "5px",
                      }}
                    />
                  ) : (
                    "No image"
                  )}
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
                    onClick={() => handleClearRatingsComments(product._id)}
                  >
                    Clear Ratings & Comments
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
