import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserOrders } from "../../libs/api";
import { EmptyState, ErrorState } from "../common/StateBlock";
import MediaImage from "../common/MediaImage";
import "./style/MyOrders.css";

const money = (n) => `$${Number(n || 0).toFixed(2)}`;

const PAYMENT_LABELS = {
  credit: "Credit/Debit",
  paypal: "PayPal",
  cod: "Cash on Delivery",
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getUserOrders();
      setOrders(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Failed to load orders:", err);
      setError(err.message || "Could not load your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="container my-orders">
      <div className="my-orders-page">
        <h1>My Orders</h1>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden-text">Loading your orders…</span>
            </div>
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : orders.length === 0 ? (
          <EmptyState
            icon="📦"
            title="No orders yet"
            message="When you place an order it will show up here."
            action={
              <Link to="/shop" className="btn btn-primary">
                Start shopping
              </Link>
            }
          />
        ) : (
          <div className="d-flex flex-column gap-3">
            {orders.map((order) => {
              const isOpen = expanded === order._id;
              const itemCount = (order.items || []).reduce(
                (sum, i) => sum + (i.quantity || 1),
                0
              );

              return (
                <article key={order._id} className="order-card">
                  <header className="order-card-head">
                    <div>
                      <div className="order-date">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              undefined,
                              { year: "numeric", month: "short", day: "numeric" }
                            )
                          : "—"}
                      </div>
                      <div className="order-id">#{order._id.slice(-8)}</div>
                    </div>

                    <div className="order-meta">
                      <span className="badge text-capitalize">
                        {order.deliveryMethod || "standard"}
                      </span>
                      <span className="badge">
                        {PAYMENT_LABELS[order.paymentMethod] ||
                          order.paymentMethod}
                      </span>
                      <span className="order-total">{money(order.totalPay)}</span>
                    </div>

                    <button
                      className="btn btn-sm"
                      aria-expanded={isOpen}
                      onClick={() => setExpanded(isOpen ? null : order._id)}
                    >
                      {isOpen ? "Hide" : `Details (${itemCount})`}
                    </button>
                  </header>

                  {isOpen && (
                    <div className="order-card-body">
                      <div className="order-items-table">
                        <table>
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
                                <td>
                                  <div className="order-item-cell">
                                    <MediaImage
                                      src={
                                        item.imageUrl ||
                                        item.product?.imageUrl ||
                                        "/uploads/images/ass1.png"
                                      }
                                      alt={item.name || "Product"}
                                      width={48}
                                      height={48}
                                      className="order-item-img"
                                    />
                                    <div>
                                      <div className="order-item-name">
                                        {item.name}
                                      </div>
                                      {(item.size || item.color) && (
                                        <div className="order-item-variant">
                                          {[item.size, item.color]
                                            .filter(Boolean)
                                            .join(" · ")}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="order-item-qty">
                                  {item.quantity}
                                </td>
                                <td className="order-item-price">
                                  {money(item.price)}
                                </td>
                                <td className="order-item-total">
                                  {money(
                                    item.total ??
                                      (item.price || 0) * (item.quantity || 1)
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="order-details-grid">
                        <div className="order-details-section">
                          <h6 className="order-subhead">Shipping to</h6>
                          <address className="order-address">
                            {order.name && (
                              <span className="order-address-line">{order.name}</span>
                            )}
                            {order.address && (
                              <span className="order-address-line">{order.address}</span>
                            )}
                            {(order.city || order.postalCode) && (
                              <span className="order-address-line">
                                {order.city}
                                {order.postalCode ? ` ${order.postalCode}` : ""}
                              </span>
                            )}
                            {order.country && (
                              <span className="order-address-line">{order.country}</span>
                            )}
                            {order.phone && (
                              <span className="order-address-line">{order.phone}</span>
                            )}
                          </address>
                        </div>

                        <div className="order-details-section">
                          <h6 className="order-subhead">Payment summary</h6>
                          <div className="order-payment-row">
                            <span className="order-payment-label">Subtotal</span>
                            <span className="order-payment-value">
                              {money(order.subtotal)}
                            </span>
                          </div>
                          <div className="order-payment-row">
                            <span className="order-payment-label">Delivery</span>
                            <span className="order-payment-value">
                              {money(order.deliveryFee)}
                            </span>
                          </div>
                          <div className="order-payment-total">
                            <span>Total</span>
                            <span>{money(order.totalPay)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
