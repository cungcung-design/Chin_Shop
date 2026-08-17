import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from "../../libs/api";
import ConfirmDialog from "../common/ConfirmDialog";

export default function AdminCategory() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      setCategories(await getAdminCategories());
      setError("");
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create or update a category
  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Category name is required.");
      return;
    }

    setSaving(true);
    try {
      if (editId) {
        const updatedCategory = await updateAdminCategory(editId, {
          name: trimmed,
        });
        setCategories(
          categories.map((c) => (c._id === editId ? updatedCategory : c))
        );
        setEditId(null);
        toast.success("Category updated.");
      } else {
        const newCategory = await createAdminCategory({ name: trimmed });
        setCategories([...categories, newCategory]);
        toast.success("Category added.");
      }

      setName("");
    } catch (err) {
      console.error("Error saving category:", err);
      toast.error(err.message || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  // Start editing
  const handleEdit = (category) => {
    setEditId(category._id);
    setName(category.name);
  };

  // Delete category
  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteAdminCategory(pendingDelete._id);
      setCategories(categories.filter((c) => c._id !== pendingDelete._id));
      toast.success(`Deleted "${pendingDelete.name}".`);
      if (editId === pendingDelete._id) {
        setEditId(null);
        setName("");
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      toast.error(err.message || "Failed to delete category.");
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  };


  return (
 <div className="d-flex min-vh-100 bg-light">

      <div className="flex-grow-1 p-3 p-md-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h3 className="mb-0">📁 Category Management</h3>
          {!loading && !error && (
            <span className="badge text-bg-secondary">
              {categories.length} total
            </span>
          )}
        </div>

        {/* Add / Edit Category Form */}
        <form className="mb-4 d-flex flex-wrap gap-2" onSubmit={handleSubmit}>
          <label className="visually-hidden-text" htmlFor="ac-name">
            Category name
          </label>
          <input
            id="ac-name"
            type="text"
            className="form-control"
            style={{ maxWidth: "min(320px, 100%)" }}
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving
              ? "Saving…"
              : editId
              ? "Update Category"
              : "Add Category"}
          </button>

          {editId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setEditId(null);
                setName("");
              }}
            >
              Cancel
            </button>
          )}
        </form>

        {/* Category Table */}
        {loading ? (
          <p className="text-muted">Loading categories…</p>
        ) : error ? (
          <div className="alert alert-danger d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={fetchCategories}
            >
              Retry
            </button>
          </div>
        ) : categories.length === 0 ? (
          <p className="text-muted">
            No categories yet — add your first one above.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th style={{ width: "160px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td className="text-nowrap">
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(c)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => setPendingDelete(c)}
                      >
                        Delete
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
        open={!!pendingDelete}
        title="Delete this category?"
        message={
          pendingDelete
            ? `"${pendingDelete.name}" will be removed. Products already assigned to it will keep a dangling reference.`
            : ""
        }
        confirmLabel="Delete category"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
 