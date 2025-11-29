import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { getCategories,createCategory,updateCategory,deleteCategory } from "../../libs/api";

export default function AdminCategory() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);


  const fetchCategories = async () => {
    try {
    const categories = await getCategories();
    setCategories(categories);
    } catch (err) {
    console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
 // submit catgory


  // Add category
  const handleSubmit = async (e) => {
    e.preventDefault();
     if (!name) {
    alert("Category name is required");
    return;
  }
    try {
if (editId) {
        const updatedCategory = await updateCategory(editId, { name });
        setCategories(
          categories.map((c) => (c._id === editId ? updatedCategory : c))
        );
        setEditId(null);
      } else {
        // Create new category
        const newCategory = await createCategory({ name });
        setCategories([...categories, newCategory]);
      }

      setName("");
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  // Start editing
  const handleEdit = (category) => {
    setEditId(category._id);
    setName(category.name);
  };
    // Delete category
  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  
  return (
 <div className="d-flex min-vh-100 bg-light">

      <div className="flex-grow-1 p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h3 className="mb-3">📁 Category Management</h3>
        
        </div>

        {/* Add / Edit Category Form */}
        <form className="mb-4 d-flex flex-wrap gap-2" onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <button type="submit" className="btn btn-primary">
            {editId ? "Update Category" : "Add Category"}
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
        <table className="table table-bordered table-striped">
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
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(c)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(c._id)}
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
 