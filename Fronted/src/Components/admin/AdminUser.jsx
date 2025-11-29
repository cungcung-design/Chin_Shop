import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./Sidebar";
import { getUsers, createUser, deleteUser } from "../../libs/api";

export default function AdminUser() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users"); // your API endpoint
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchAllUsers();
  }, []);

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();

    const userData = { name, email, password, role };

    try {
      const newUser = await createUser(userData);
      setUsers([...users, newUser]);

      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
    } catch (err) {
      console.error("Error adding user:", err.message);
      alert(err.message || "Failed to add user");
    }
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id); // Use imported function
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Error deleting user:", err.message);
      alert(err.message || "Failed to delete user");
    }
  };

  return (
    <div>
      <div className="d-flex min-vh-100 bg-light">
        {/* Main Content */}
        <div className="flex-grow-1  p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h3 className="mb-3">👤 User Management</h3>
          </div>
          {/* Add User Form */}
          <form
            className="mb-4 d-flex flex-wrap gap-2"
            onSubmit={handleAddUser}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="btn btn-primary">
              Add User
            </button>
          </form>

          {/* User Table */}
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Role</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.password}</td>
                  <td>{u.role}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteUser(u._id)}
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
    </div>
  );
}
