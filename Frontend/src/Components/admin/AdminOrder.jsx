import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getAdminOrders,
  updateAdminOrder,
  deleteAdminOrder,
} from "../../libs/api";
import ConfirmDialog from "../common/ConfirmDialog";
import MediaImage from "../common/MediaImage";
import "./style/AdminOrder.css";

const money = (n) => `$${Number(n || 0).toFixed(2)}`;

const PAYMENT_LABELS = {
  credit: "Credit/Debit",
  paypal: "PayPal",
  cod: "Cash on Delivery",
};

export default function AdminOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [savingId, setSavingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAdminOrders();
      setOrders(Array.isArray(res) ? res : []);
      setError("");
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrders([]);
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteAdminOrder(pendingDelete._id);
      setOrders((prev) => prev.filter((o) => o._id !== pendingDelete._id));
      toast.success("Order deleted successfully.");
    } catch (err) {
      console.error("Failed to delete order:", err);
      toast.error(err.message || "Failed to delete order.");
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  };

  const handleDeliveryChange = async (order, deliveryMethod) => {
    if (deliveryMethod === order.deliveryMethod) return;
    setSavingId(order._id);
    try {
      const updated = await updateAdminOrder(order._id, { deliveryMethod });
      setOrders((prev) =>
        prev.map((o) => (o._id === order._id ? updated : o))
      );
      toast.success(`Delivery set to ${deliveryMethod}. Total recalculated.`);
    } catch (err) {
      console.error("Failed to update order:", err);
      toast.error(err.message || "Failed to update order.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="admin-section">
      {/* Header */}
      <div className="page-header">
        <h3 className="page-title">Order Management</h3>
        {!loading && !error && (
          <span className="order-count">
            {orders.length} order{orders.length === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading-state">
          <i className="bi bi-hourglass-split"></i>
          <p>Loading orders…</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="alert-custom" role="alert">
          <span>{error}</span>
          <button className="btn btn-sm btn-outline-danger" onClick={fetchOrders}>
            Retry
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && orders.length === 0 && (
        <div className="empty-state">
          <i className="bi bi-inbox"></i>
          <p>No orders found.</p>
        </div>
      )}

      {/* Orders list */}
      {!loading && !error && orders.length > 0 && (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              {/* Order header */}
              <div className="order-header">
                <div>
                  <div className="order-id">Order {order._id.slice(-8).toUpperCase()}</div>
                  <div className="order-date">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "N/A"}
                  </div>
                </div>
              </div>

              {/* Customer & shipping info */}
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Customer</span>
                  <span className="info-value">
                    {order.userId?.name || order.name || "Unknown"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">
                    {order.userId?.email || "N/A"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{order.phone || "N/A"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Address</span>
                  <span className="info-value">
                    {[order.address, order.city, order.country, order.postalCode]
                      .filter(Boolean)
                      .join(", ") || "N/A"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Payment</span>
                  <span className="info-value">
                    {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod || "N/A"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Delivery</span>
                  <div className="delivery-wrapper">
                    <select
                      className="delivery-select"
                      value={order.deliveryMethod || "standard"}
                      disabled={savingId === order._id}
                      onChange={(e) =>
                        handleDeliveryChange(order, e.target.value)
                      }
                    >
                      <option value="standard">Standard (3–5 days)</option>
                      <option value="express">Express (1–2 days) +$10</option>
                    </select>
                    {savingId === order._id && (
                      <span className="saving-indicator">Saving…</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Items table */}
              <div className="items-table-wrap">
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.items || []).map((item) => (
                      <tr key={item._id}>
                        <td data-label="Item">
                          <div className="item-cell">
                            <MediaImage
                              src={
                                item.imageUrl ||
                                item.product?.imageUrl ||
                                "/uploads/images/ass1.png"
                              }
                              alt={item.name || "Product"}
                              className="item-image"
                              loading="lazy"
                            />
                            <div>
                              <div className="item-name">{item.name}</div>
                              {(item.color || item.size) && (
                                <div className="item-meta">
                                  {[item.color, item.size && `Size: ${item.size}`]
                                    .filter(Boolean)
                                    .join(" · ")}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td data-label="Qty">
                          <span className="item-qty">{item.quantity}</span>
                        </td>
                        <td data-label="Price">
                          <span className="item-price">{money(item.price)}</span>
                        </td>
                        <td data-label="Total">
                          <span className="item-total">
                            {money(
                              item.total ??
                                (item.price || 0) * (item.quantity || 1)
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>{money(order.subtotal)}</span>
                </div>
                <div className="total-row">
                  <span>Delivery Fee</span>
                  <span>{money(order.deliveryFee)}</span>
                </div>
                <div className="total-row total-final">
                  <span>Total Pay</span>
                  <span>{money(order.totalPay)}</span>
                </div>
              </div>

              {/* Delete */}
              <button
                className="btn-delete-order"
                onClick={() => setPendingDelete(order)}
              >
                <i className="bi bi-trash"></i>
                Delete Order
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this order?"
        message={
          pendingDelete
            ? `Order ${pendingDelete._id} (${money(pendingDelete.totalPay)}) will be permanently removed.`
            : ""
        }
        confirmLabel="Delete order"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
