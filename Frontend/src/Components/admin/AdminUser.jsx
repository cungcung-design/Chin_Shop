import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getAdminUsers,
  updateAdminUser,
  deleteAdminUser,
  register,
} from "../../libs/api";
import { AuthContext } from "../context/AuthContext";
import ConfirmDialog from "../common/ConfirmDialog";

const emptyForm = { name: "", email: "", password: "", role: "user" };

export default function AdminUser() {
  const { user: currentUser } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadUsers = async () => {
    try {
      setUsers(await getAdminUsers());
      setError("");
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editId) {
        // PUT /api/admin/users/:id accepts name, email and role.
        const updated = await updateAdminUser(editId, {
          name: form.name,
          email: form.email,
          role: form.role,
        });
        setUsers(users.map((u) => (u._id === editId ? updated : u)));
        toast.success("User updated.");
        resetForm();
      } else {
        if (form.password.length < 6) {
          toast.error("Password must be at least 6 characters.");
          return;
        }

        // There is no POST /api/admin/users, so registration goes through
        // /api/auth/register (which hashes the password). The role is then
        // applied via the admin-guarded PUT rather than trusting the public
        // register endpoint with it.
        const { user: created } = await register({
          name: form.name,
          email: form.email,
          password: form.password,
        });

        const finalUser =
          form.role === "admin"
            ? await updateAdminUser(created.id, { ...created, role: "admin" })
            : created;

        toast.success("User created.");
        resetForm();
        // Refetch so the row carries the same shape as the rest of the table.
        await loadUsers();
        return finalUser;
      }
    } catch (err) {
      console.error("Error saving user:", err);
      toast.error(err.message || "Failed to save user.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (u) => {
    setEditId(u._id);
    setForm({ name: u.name, email: u.email, password: "", role: u.role });
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteAdminUser(pendingDelete._id);
      setUsers(users.filter((u) => u._id !== pendingDelete._id));
      toast.success(`Deleted ${pendingDelete.name}.`);
      if (editId === pendingDelete._id) resetForm();
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error(err.message || "Failed to delete user.");
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <div className="flex-grow-1 p-3 p-md-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h3 className="mb-0">👤 User Management</h3>
          <span className="badge text-bg-secondary">{users.length} total</span>
        </div>

        {/* Add / Edit user form */}
        <form className="mb-4" onSubmit={handleSubmit}>
          <div className="row g-2">
            <div className="col-12 col-md-3">
              <label className="form-label visually-hidden-text" htmlFor="au-name">
                Name
              </label>
              <input
                id="au-name"
                name="name"
                type="text"
                className="form-control"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-md-3">
              <label className="form-label visually-hidden-text" htmlFor="au-email">
                Email
              </label>
              <input
                id="au-email"
                name="email"
                type="email"
                className="form-control"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 col-md-3">
              <label
                className="form-label visually-hidden-text"
                htmlFor="au-password"
              >
                Password
              </label>
              <input
                id="au-password"
                name="password"
                type="password"
                className="form-control"
                placeholder={
                  editId ? "Password unchanged" : "Password (min. 6 chars)"
                }
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                required={!editId}
                disabled={!!editId}
              />
            </div>

            <div className="col-8 col-md-2">
              <label className="form-label visually-hidden-text" htmlFor="au-role">
                Role
              </label>
              <select
                id="au-role"
                name="role"
                className="form-select"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="col-4 col-md-1 d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={saving}
              >
                {saving ? "…" : editId ? "Save" : "Add"}
              </button>
            </div>
          </div>

          {editId && (
            <button
              type="button"
              className="btn btn-link px-0 mt-2"
              onClick={resetForm}
            >
              Cancel edit
            </button>
          )}
        </form>

        {/* User table */}
        {loading ? (
          <p className="text-muted">Loading users…</p>
        ) : error ? (
          <div className="alert alert-danger d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <button className="btn btn-sm btn-outline-danger" onClick={loadUsers}>
              Retry
            </button>
          </div>
        ) : users.length === 0 ? (
          <p className="text-muted">No users found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registered</th>
                  <th className="text-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td className="text-break">{u.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.role === "admin"
                            ? "text-bg-primary"
                            : "text-bg-secondary"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="text-nowrap">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="text-nowrap">
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(u)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => setPendingDelete(u)}
                        disabled={u._id === currentUser?.id}
                        title={
                          u._id === currentUser?.id
                            ? "You cannot delete your own account"
                            : undefined
                        }
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
        title="Delete this user?"
        message={
          pendingDelete
            ? `${pendingDelete.name} (${pendingDelete.email}) will be permanently removed.`
            : ""
        }
        confirmLabel="Delete user"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
