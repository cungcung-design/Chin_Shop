import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductsContext } from "./ProductContext";
import "./style/ProductDetails.css"; 

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useContext(ProductsContext);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find((p) => p._id === id);
      setProduct(found);

      if (found) {
        const relatedProducts = products.filter(
          (p) => p.categoryId?._id === found.categoryId?._id && p._id !== found._id
        );
        setRelated(relatedProducts);
      }
    }
  }, [id, products]);

  if (!product) return <div className="container my-5">Loading...</div>;

  return (
    <div className="container py-5">

      {/* MAIN PRODUCT */}
      <div className="row mb-5">
        <div className="col-md-5">
          <img
            src={product.imageUrl[0]}
            alt={product.name}
            className="img-fluid rounded main-product-img"
          />
        </div>

        <div className="col-md-7">
          <h2>{product.name}</h2>
          <h4 className="text-success mt-3">${product.price}</h4>
          <p className="mt-3">Rating: ⭐ {product.averageRating?.toFixed(1) || "0.0"}</p>
          <p className="mt-4">{product.description || "No description available."}</p>
          <button className="btn btn-primary mt-3">Add to Cart</button>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <h3 className="mb-3">Related Products</h3>
      {related.length === 0 && <p>No related products found.</p>}

      <div className="related-products">
        {related.map((item) => (
          <div
            className="related-card"
            key={item._id}
            onClick={() => navigate(`/details/${item._id}`)}
          >
            <img src={item.imageUrl[0]} alt={item.name} />
            <h6 className="mt-2">{item.name}</h6>
            <p className="text-success">${item.price}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
