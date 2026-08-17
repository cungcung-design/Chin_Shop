import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  getAdminCategories,
} from "../../libs/api";
import ConfirmDialog from "../common/ConfirmDialog";
import MediaImage from "../common/MediaImage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/AdminProduct.css";

const mainImage = (imageUrl) =>
  Array.isArray(imageUrl) ? imageUrl[0] : imageUrl || "";

const PUBLIC_IMAGES = [
  { url: "/uploads/images/w-shirt1.png", color: "Red" },
  { url: "/uploads/images/w-shirt2.png", color: "Pink" },
  { url: "/uploads/images/w-shirt3.png", color: "White" },
  { url: "/uploads/images/w-shirt4.png", color: "Black" },
  { url: "/uploads/images/m-shirt1.png", color: "Mixed" },
  { url: "/uploads/images/m-shirt2.png", color: "Red" },
  { url: "/uploads/images/m-shirt3.png", color: "Black" },
  { url: "/uploads/images/k-shirt1.png", color: "Black" },
  { url: "/uploads/images/k-shirt2.png", color: "Red" },
  { url: "/uploads/images/k-shirt3.png", color: "White" },
  { url: "/uploads/images/t-shirt1.png", color: "Black" },
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      setProducts(await getAdminProducts());
      setError("");
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategories(await getAdminCategories());
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("Could not load categories for the form.");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
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
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const sizes = sizeInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const productPayload = {
        ...formData,
        sizes,
        price: Number(formData.price),
        stock: Number(formData.stock),
        imageUrl: [formData.imageUrl],
        colors: formData.colors.filter((c) => c.color && c.image),
      };

      if (editId) {
        await updateAdminProduct(editId, productPayload);
        toast.success("Product updated.");
      } else {
        await createAdminProduct(productPayload);
        toast.success("Product added.");
      }

      await fetchProducts();
      resetForm();
    } catch (err) {
      console.error("Error saving product:", err);
      toast.error(err.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);

    const sizes = Array.isArray(product.sizes)
      ? product.sizes
      : typeof product.sizes === "string"
      ? product.sizes.split(",").map((s) => s.trim())
      : [];

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      categoryId: product.categoryId?._id || product.categoryId || "",
      stock: product.stock ?? 0,
      imageUrl: mainImage(product.imageUrl),
      colors:
        product.colors?.length > 0
          ? product.colors.map((c) => ({ color: c.color, image: c.image }))
          : [{ color: "", image: "" }],
      sizes,
    });

    setSizeInput(sizes.join(","));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteAdminProduct(pendingDelete._id);
      setProducts(products.filter((p) => p._id !== pendingDelete._id));
      toast.success(`Deleted "${pendingDelete.name}".`);
      if (editId === pendingDelete._id) resetForm();
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error(err.message || "Failed to delete product.");
    } finally {
      setDeleting(false);
      setPendingDelete(null);
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
          <div className="form-row d-flex gap-2 mb-2">
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

          <div className="form-row d-flex gap-2 mb-2">
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
            <label htmlFor="main-image">Main Image</label>
            <select
              id="main-image"
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
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
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
            <label>Colors</label>
            <div className="color-rows">
              {formData.colors.map((c, idx) => (
                <div key={idx} className="color-row">
                  <input
                    type="text"
                    placeholder="Color Name"
                    aria-label={`Colour name ${idx + 1}`}
                    value={c.color}
                    onChange={(e) => {
                      const newColors = formData.colors.map((row, i) =>
                        i === idx ? { ...row, color: e.target.value } : row
                      );
                      setFormData({ ...formData, colors: newColors });
                    }}
                    className="form-control"
                  />
                  <select
                    value={c.image}
                    aria-label={`Colour image ${idx + 1}`}
                    onChange={(e) => {
                      const newColors = formData.colors.map((row, i) =>
                        i === idx ? { ...row, image: e.target.value } : row
                      );
                      setFormData({ ...formData, colors: newColors });
                    }}
                    className="form-control"
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
            </div>
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

          {/* Sizes */}
          <div className="mb-2">
            <label htmlFor="sizes">Sizes (comma-separated: S,M,L,XL)</label>
            <input
              id="sizes"
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

          <div className="d-flex gap-2 flex-wrap">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : editId ? "Update Product" : "Add Product"}
            </button>

            {editId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Product Table */}
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
            No products yet — add your first one using the form above.
          </p>
        ) : (
          <div className="admin-table-wrap">
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
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
                      <td data-label="Name">{p.name}</td>

                      <td data-label="Main Image">
                        <MediaImage
                          src={p.imageUrl}
                          alt={p.name}
                          className="admin-img"
                        />
                      </td>

                      <td data-label="Description" style={{ minWidth: "200px" }}>
                        {p.description}
                      </td>
                      <td data-label="Price" className="text-nowrap">
                        ${p.price}
                      </td>
                      <td data-label="Category">
                        {p.categoryId?.name || (
                          <span className="text-danger small">Uncategorised</span>
                        )}
                      </td>
                      <td data-label="Stock">
                        <span
                          className={`admin-badge ${
                            p.stock > 0 ? "admin-badge--in" : "admin-badge--out"
                          }`}
                        >
                          {p.stock ?? 0}
                        </span>
                      </td>

                      <td data-label="Colors">
                        {(p.colors || []).length === 0 ? (
                          <span className="text-muted small">—</span>
                        ) : (
                          (p.colors || []).map((c, i) => (
                            <div
                              key={`${c.color}-${i}`}
                              className="d-flex align-items-center mb-1"
                            >
                              <span
                                className="admin-swatch"
                                aria-hidden="true"
                                style={{ backgroundColor: c.color }}
                              />

                              {c.image && (
                                <MediaImage
                                  src={c.image}
                                  alt=""
                                  className="admin-color-img me-1"
                                />
                              )}
                              <span className="small">{c.color}</span>
                            </div>
                          ))
                        )}
                      </td>

                      <td data-label="Sizes">
                        {p.sizes?.length ? (
                          p.sizes.join(", ")
                        ) : (
                          <span className="text-muted small">—</span>
                        )}
                      </td>

                      <td data-label="Actions">
                        <div className="admin-actions">
                          <button
                            className="btn btn-warning"
                            onClick={() => handleEdit(p)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-danger"
                            onClick={() => setPendingDelete(p)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this product?"
        message={
          pendingDelete
            ? `"${pendingDelete.name}" will be permanently removed from the catalogue.`
            : ""
        }
        confirmLabel="Delete product"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
