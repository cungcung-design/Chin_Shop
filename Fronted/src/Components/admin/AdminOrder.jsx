import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { getAllOrdersAdmin, deleteOrderAdmin } from "../../libs/api";
import "./style/AdminOrder.css";

export default function AdminOrder() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllOrdersAdmin();
      setOrders(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrderAdmin(orderId);
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      showToast("Order deleted successfully!", "success");
    } catch (err) {
      console.error("Failed to delete order:", err);
      showToast("Failed to delete order.", "error");
    }
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      <div className="flex-grow-1 p-4 admin-section">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>🛒 Order Management</h3>
        </div>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-muted">No orders found.</p>
        ) : (
          <div className="container-fluid">
            {orders.map((order) => {
              const subtotal = order.items.reduce(
                (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
                0
              );
              const deliveryFee = order.deliveryMethod === "express" ? 10 : 0;
              const totalPay = subtotal + deliveryFee;

              return (
                <div
                  key={order._id}
                  className="row mb-4 border rounded bg-white"
                >
                  {/* LEFT SIDE */}
                  <div className="col-lg-6">
                    <div className="left-container">
                      <h5>Order ID: {order._id}</h5>
                      <p>
                        <strong>Customer:</strong>{" "}
                        {order.name || order.userId?.name || "Unknown"} <br />
                        <strong>Email:</strong> {order.userId?.email || "N/A"}{" "}
                        <br />
                        <strong>Phone:</strong> {order.phone || "N/A"} <br />
                        <strong>Address:</strong> {order.address || "N/A"}
                        <br />
                        <strong>City:</strong> {order.city || "N/A"} <br />
                        <strong>Country:</strong> {order.country || "N/A"}{" "}
                        <br />
                        <strong>Postal Code:</strong>{" "}
                        {order.postalCode || "N/A"}
                      </p>

                      <p>
                        <strong>Delivery Method:</strong> {order.deliveryMethod}{" "}
                        <br />
                        <strong>Payment Method:</strong>{" "}
                        {order.paymentMethod === "credit"
                          ? "Credit/Debit"
                          : order.paymentMethod === "paypal"
                          ? "PayPal"
                          : order.paymentMethod === "cod"
                          ? "Cash on Delivery"
                          : order.paymentMethod}{" "}
                        <br />
                        <strong>Order Date:</strong>{" "}
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="col-lg-6">
                    <div className="right-container">
                      <table className="table table-sm table-borderless mb-2">
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, idx) => (
                            <tr key={idx}>
                              <td className="d-flex align-items-center">
                                <img
                                  className="image-order"
                                  src={item.imageUrl?.[0] || "/placeholder.png"}
                                  alt={item.name || ""}
                                  style={{
                                    width: "80px",
                                    height: "80px",
                                    objectFit: "cover",
                                  }}
                                />
                                <div style={{ marginLeft: "8px" }}>
                                  {item.name} <br />
                                  {item.color ? item.color : "N/A"} <br />
                                  {item.size ? `Size: ${item.size}` : ""}
                                </div>
                              </td>
                              <td className="p-2">{item.quantity}</td>
                              <td>${item.price}</td>
                              <td>
                                ${(item.price || 0) * (item.quantity || 1)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="d-flex justify-content-between me-2">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>

                      <div className="d-flex justify-content-between me-2">
                        <span>Delivery Fee:</span>
                        <span>${deliveryFee.toFixed(2)}</span>
                      </div>

                      <div className="d-flex justify-content-between fw-bold me-2">
                        <span>Total Pay:</span>
                        <span>${totalPay.toFixed(2)}</span>
                      </div>

                      <button
                        className="btn btn-danger w-100 mt-2"
                        onClick={() => handleDeleteOrder(order._id)}
                      >
                        Delete Order
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
