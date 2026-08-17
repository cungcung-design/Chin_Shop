import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ProductsContext } from "./ProductContext";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { ErrorState } from "../common/StateBlock";
import MediaImage from "../common/MediaImage";
import "./style/ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading, error, refetch } = useContext(ProductsContext);
  const { addItemToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find((p) => p._id === id);
      setProduct(found || null);

      if (found) {
        setRelated(
          products.filter(
            (p) =>
              p.categoryId?._id === found.categoryId?._id && p._id !== found._id
          )
        );
      } else {
        setRelated([]);
      }
    }
  }, [id, products]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please log in to add items to cart.");
      navigate("/login");
      return;
    }

    // Variants must be picked on the full detail view
    if (product.sizes?.length > 0 || product.colors?.length > 0) {
      navigate(`/details/${product._id}`);
      return;
    }

    setAdding(true);
    try {
      await addItemToCart(product._id, 1, "", "", product.imageUrl?.[0] || "");
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to add item to cart.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="container my-5 text-center" style={{ minHeight: "40vh" }}>
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden-text">Loading product…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  }

  // Previously showed "Loading..." forever when the id didn't match
  if (!product) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: "40vh" }}>
        <h2 className="mb-3">Product not found</h2>
        <p className="text-white-50 mb-4">
          This product may have been removed from the catalogue.
        </p>
        <Link to="/shop" className="btn btn-primary">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">

      {/* MAIN PRODUCT */}
      <div className="row mb-5">
        <div className="col-md-5">
          <MediaImage
            src={product.imageUrl}
            alt={product.name}
            className="img-fluid rounded main-product-img"
          />
        </div>

        <div className="col-md-7">
          <h2>{product.name}</h2>
          <h4 className="text-success mt-3">
            ${Number(product.price || 0).toFixed(2)}
          </h4>
          <p className="mt-3">
            Rating: ⭐ {product.averageRating?.toFixed(1) || "0.0"}
          </p>
          <p className="mt-2">
            {product.stock > 0 ? (
              <span className="text-success">In stock ({product.stock})</span>
            ) : (
              <span className="text-danger fw-bold">Out of stock</span>
            )}
          </p>
          <p className="mt-4">
            {product.description || "No description available."}
          </p>

          <div className="d-flex gap-2 flex-wrap mt-3">
            {/* This button previously had no onClick at all */}
            <button
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
            >
              {adding
                ? "Adding…"
                : product.stock === 0
                ? "Out of stock"
                : "Add to Cart"}
            </button>
            <Link to={`/details/${product._id}`} className="btn btn-outline-light">
              View full details
            </Link>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <h3 className="mb-3">Related Products</h3>
      {related.length === 0 && (
        <p className="text-white-50">No related products found.</p>
      )}

      <div className="related-products">
        {related.map((item) => (
          <button
            type="button"
            className="related-card"
            key={item._id}
            onClick={() => navigate(`/details/${item._id}`)}
          >
            <MediaImage
              src={item.imageUrl}
              alt={item.name}
              loading="lazy"
            />
            <h6 className="mt-2">{item.name}</h6>
            <p className="text-success">${Number(item.price || 0).toFixed(2)}</p>
          </button>
        ))}
      </div>

    </div>
  );
}
