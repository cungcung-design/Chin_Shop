import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from "../../libs/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/AdminProduct.css";

const PUBLIC_IMAGES = [
  { url: "/uploads/images/w-shirt1.png", color: "Red" },
  { url: "/uploads/images/w-shirt2.png", color: "Pink" },
  { url: "/uploads/images/w-shirt3.png", color: "white" },
  { url: "/uploads/images/w-shirt4.png", color: "Black" },
  { url: "/uploads/images/m-shirt1.png", color: "Mixed" },
  { url: "/uploads/images/m-shirt2.png", color: "Red" },
  { url: "/uploads/images/m-shirt3.png", color: "Black" },
  { url: "/uploads/images/k-shirt1.png", color: "Black" },
  { url: "/uploads/images/k-shirt2.png", color: "Red" },
  { url: "/uploads/images/k-shirt3.png", color: "White" },
  { url: "/uploads/images/t-shirt1.png", color: "Black" },
  { url: "/uploads/images/k-shirt2.png", color: "Red" },
  { url: "/uploads/images/whitebag.png", color: "White" },
  { url: "/uploads/images/redbag.png", color: "Red" },
  { url: "/uploads/images/ass1.png", color: "" },
  { url: "/uploads/images/ass2.png", color: "" },
  { url: "/uploads/images/ass3.png", color: "" },
  { url: "/uploads/images/ass4.png", color: "" },
];

export default function AdminProduct() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // NEW: temp input for comma typing
  const [sizeInput, setSizeInput] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    stock: 0,
    imageUrl: "",
    colors: [{ color: "", image: "" }],
    sizes: [],
  });

  const [editId, setEditId] = useState(null);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productPayload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        imageUrl: [formData.imageUrl],
      };

      if (editId) {
        await updateProduct(editId, productPayload);
      } else {
        await createProduct(productPayload);
      }

      fetchProducts();

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        stock: 0,
        imageUrl: "",
        colors: [{ color: "", image: "" }],
        sizes: [],
      });

      setSizeInput(""); // reset sizes input
      setEditId(null);
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId._id || product.categoryId,
      stock: product.stock,
      imageUrl: Array.isArray(product.imageUrl)
        ? product.imageUrl[0]
        : product.imageUrl || "",
      colors:
        product.colors.length > 0 ? product.colors : [{ color: "", image: "" }],
      sizes: Array.isArray(product.sizes)
        ? product.sizes
        : typeof product.sizes === "string"
        ? product.sizes.split(",").map((s) => s.trim())
        : [],
    });

    // Fill editable text
    setSizeInput(
      Array.isArray(product.sizes)
        ? product.sizes.join(",")
        : product.sizes || ""
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        console.error("Error deleting product:", err);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <div className="flex-grow-1 admin-product p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h3>📦 Product Management</h3>
        </div>

        {/* Form */}
        <form className="product-form mb-4" onSubmit={handleSubmit}>
          <div className="d-flex gap-2 mb-2">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
            />
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex gap-2 mb-2">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="form-control"
              required
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-2">
            <select
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className="form-control"
              required
            >
              <option value="">Select Main Image</option>
              {PUBLIC_IMAGES.map((img, i) => (
                <option key={i} value={img.url}>
                  {img.color} ({img.url.split("/").pop()})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              rows={4}
              required
            />
          </div>

          {/* Colors */}
          <div className="mb-2">
            {formData.colors.map((c, idx) => (
              <div key={idx} className="d-flex gap-2 mb-1">
                <input
                  type="text"
                  placeholder="Color Name"
                  value={c.color}
                  onChange={(e) => {
                    const newColors = [...formData.colors];
                    newColors[idx].color = e.target.value;
                    setFormData({ ...formData, colors: newColors });
                  }}
                  className="form-control"
                  required
                />

                <select
                  value={c.image}
                  onChange={(e) => {
                    const newColors = [...formData.colors];
                    newColors[idx].image = e.target.value;
                    setFormData({ ...formData, colors: newColors });
                  }}
                  className="form-control"
                  required
                >
                  <option value="">Select Image</option>
                  {PUBLIC_IMAGES.map((img, i) => (
                    <option key={i} value={img.url}>
                      {img.color} ({img.url.split("/").pop()})
                    </option>
                  ))}
                </select>

                {formData.colors.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      const newColors = formData.colors.filter(
                        (_, i) => i !== idx
                      );
                      setFormData({ ...formData, colors: newColors });
                    }}
                  >
                    X
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className="btn btn-secondary btn-sm mt-2"
              onClick={() =>
                setFormData({
                  ...formData,
                  colors: [...formData.colors, { color: "", image: "" }],
                })
              }
            >
              + Add Color
            </button>
          </div>

          {/* FIXED SIZES INPUT */}
          <div className="mb-2">
            <input
              type="text"
              placeholder="Sizes (comma-separated: S,M,L,XL)"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              onBlur={() =>
                setFormData({
                  ...formData,
                  sizes: sizeInput
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s),
                })
              }
              className="form-control"
            />
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              {editId ? "Update Product" : "Add Product"}
            </button>

            {editId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditId(null);
                  setFormData({
                    name: "",
                    description: "",
                    price: "",
                    categoryId: "",
                    stock: 0,
                    imageUrl: "",
                    colors: [{ color: "", image: "" }],
                    sizes: [],
                  });
                  setSizeInput("");
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Product Table */}
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Main Image</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Colors</th>
              <th>Sizes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>

                <td>
                  <img
                    src={p.imageUrl || ""}
                    alt={p.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                </td>

                <td>{p.description}</td>
                <td>${p.price}</td>
                <td>{p.categoryId.name || p.categoryId}</td>
                <td>{p.stock}</td>

                <td>
                  {p.colors.map((c, i) => (
                    <div key={i} className="d-flex align-items-center mb-1">
                      <span
                        style={{
                          width: "15px",
                          height: "15px",
                          backgroundColor: c.color,
                          border: "1px solid #000",
                          marginRight: "5px",
                          display: "inline-block",
                        }}
                      ></span>

                      <img
                        src={c.image}
                        alt={c.color}
                        style={{
                          width: "30px",
                          height: "30px",
                          objectFit: "cover",
                          marginRight: "5px",
                        }}
                      />
                      <span>{c.color}</span>
                    </div>
                  ))}
                </td>

                <td>{p.sizes?.join(", ")}</td>

                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(p)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
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
