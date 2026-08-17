import React, { useEffect, useState } from "react";
import DashboardRight from "./DashboradRight";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/Dashboardright.css";
import { getAdminUsers } from "../../libs/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setUsers(await getAdminUsers());
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message || "Could not load recent users.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Newest first, capped so the dashboard stays a summary.
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="d-flex min-vh-100 bg-light">
      <div className="flex-grow-1 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center px-3 px-md-4 mt-4 mb-3">
          <h3 className="mb-0">Admin Dashboard</h3>
        </div>

        <div className="flex-grow-1 right-content">
          <DashboardRight />

          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">Recent Users</h5>
              {users.length > recentUsers.length && (
                <small className="text-muted">
                  Showing {recentUsers.length} of {users.length}
                </small>
              )}
            </div>

            {loading ? (
              <p className="text-muted mb-0">Loading users…</p>
            ) : error ? (
              <div className="alert alert-danger mb-0">{error}</div>
            ) : recentUsers.length === 0 ? (
              <p className="text-muted mb-0">No users registered yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Registered At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td className="text-break">{user.email}</td>
                        <td>
                          <span
                            className={`badge ${
                              user.role === "admin"
                                ? "text-bg-primary"
                                : "text-bg-secondary"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td>
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
