import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import DashboardRight from "./DashboradRight";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/Dashboardright.css";
import { useNavigate } from "react-router-dom";
import { getUsers, getAllOrdersAdmin, getProducts } from "../../libs/api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, ordersData, productsData] = await Promise.all([
          getUsers(),
          getAllOrdersAdmin(),
          getProducts(),
        ]);
        setUsers(usersData);
        setOrders(ordersData);
        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // Calculate percentages
  const totalOrders = orders.length;
  const processedOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;
  const processedPercent =
    totalOrders > 0 ? Math.round((processedOrders / totalOrders) * 100) : 0;

  const totalProducts = products.length;
  const productsWithFeedback = products.filter(
    (product) => product.comments && product.comments.length > 0
  ).length;
  const feedbackPercent =
    totalProducts > 0
      ? Math.round((productsWithFeedback / totalProducts) * 100)
      : 0;
  const pendingFeedbackPercent = 100 - feedbackPercent;

  return (
    <div className="d-flex min-vh-100 bg-light">

      {/* Main Content */}
      <div className="flex-grow-1   d-flex flex-column ">
        {/* Navbar */}
        <div className="d-flex justify-content-between align-items-center ps-4 mt-4 mb-3">
          <h3>Admin Dashboard</h3>
        </div>
        <div className="flex-grow-1 right-content">
          <DashboardRight />
          <div className="mt-4">
            <h5>Recent Users</h5>
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registered At</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <h5>Task Completion</h5>
            <div className="mb-2">
              <span>Orders Processed ({processedPercent}%)</span>
              <div className="progress">
                <div
                  className="progress-bar bg-success"
                  style={{ width: `${processedPercent}%` }}
                ></div>
              </div>
            </div>
            <div className="mb-2">
              <span>Pending Feedback ({pendingFeedbackPercent}%)</span>
              <div className="progress">
                <div
                  className="progress-bar bg-warning"
                  style={{ width: `${pendingFeedbackPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
