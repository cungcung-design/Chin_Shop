import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";
import { ProductsContext } from "../user/ProductContext";
import { createOrder } from "../../libs/api";
import { EmptyState } from "../common/StateBlock";
import MediaImage from "../common/MediaImage";
import "./style/Carts.css";

const DELIVERY_OPTIONS = [
  { value: "standard", label: "Standard (3-5 days)", fee: 0 },
  { value: "express", label: "Express (1-2 days)", fee: 10 },
];

const PAYMENT_OPTIONS = [
  { value: "credit", label: "Credit/Debit" },
  { value: "paypal", label: "PayPal" },
  { value: "cod", label: "Cash on Delivery" },
];

const money = (n) => `$${Number(n || 0).toFixed(2)}`;

export default function Carts() {
  const navigate = useNavigate();
  const {
    cart,
    updateCartItem,
    removeCartItem,
    clearCart,
    user,
    loading: cartLoading,
  } = useContext(CartContext);
  const { products } = useContext(ProductsContext);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [placing, setPlacing] = useState(false);
  const [busyItem, setBusyItem] = useState(null);
  const [touched, setTouched] = useState(false);

  const setField = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const getProduct = (item) =>
    item.product || products.find((p) => p._id === item.productId) || null;

  const lineTotal = (item) => {
    const product = getProduct(item);
    if (!product?.price) return null;
    return product.price * (item.quantity || 1);
  };

  const handleQuantityChange = async (item, delta) => {
    const newQty = (item.quantity || 1) + delta;
    if (newQty < 1) return;
    setBusyItem(item.itemId || item.productId);
    try {
      await updateCartItem(item, newQty);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Could not update the quantity.");
    } finally {
      setBusyItem(null);
    }
  };

  const handleRemove = async (item) => {
    setBusyItem(item.itemId || item.productId);
    try {
      await removeCartItem(item);
      toast.success("Item removed from cart.");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Could not remove the item.");
    } finally {
      setBusyItem(null);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (lineTotal(item) || 0), 0);
  const deliveryFee =
    DELIVERY_OPTIONS.find((o) => o.value === deliveryMethod)?.fee ?? 0;
  const totalPay = subtotal + deliveryFee;

  const missingFields = Object.entries(form)
    .filter(([, v]) => !v.trim())
    .map(([k]) => k);
  const shippingComplete = missingFields.length === 0;
  const unavailableLines = cart.filter((item) => !getProduct(item));

  const handlePayNow = async () => {
    setTouched(true);

    if (!user) {
      toast.info("Please log in to place your order.");
      navigate("/login", { state: { from: "/carts" } });
      return;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!shippingComplete) {
      toast.error("Please fill in all shipping details.");
      return;
    }
    if (unavailableLines.length > 0) {
      toast.error("Remove unavailable items before checking out.");
      return;
    }

    setPlacing(true);
    try {
      const formattedItems = cart.map((item) => {
        const product = getProduct(item);
        return {
          product: product?._id || item.productId,
          name: product?.name || "Unknown",
          price: product?.price || 0,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          imageUrl: item.imageUrl || product?.imageUrl?.[0] || "",
        };
      });

      const { order } = await createOrder({
        ...form,
        deliveryMethod,
        paymentMethod,
        items: formattedItems,
      });

      toast.success(
        `Order placed! Total ${money(order?.totalPay ?? totalPay)}.`
      );
      clearCart();
      setForm({
        name: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        postalCode: "",
      });
      setTouched(false);
      navigate("/orders");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create order.");
    } finally {
      setPlacing(false);
    }
  };

  if (!cartLoading && cart.length === 0) {
    return (
      <div className="container cart-page">
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          message="Browse the collection and add something you like."
          action={
            <Link to="/shop" className="btn btn-primary">
              Continue shopping
            </Link>
          }
        />
      </div>
    );
  }

  const invalid = (field) => touched && !form[field].trim();

  return (
    <div className="container cart-page">
      <h1 className="cart-page-title">Cart</h1>

      <div className="cart-layout">
        {/* Cart Items — shown first on mobile */}
        <div className="cart-summary-side">
          <div className="cart-panel">
            <div className="cart-panel-head">
              <h2>Your Items ({cart.length})</h2>
            </div>
            <div className="cart-panel-body">
              {cartLoading ? (
                <p className="text-muted mb-0">Loading your cart…</p>
              ) : (
                <>
                  {cart.map((item, index) => {
                    const product = getProduct(item);
                    const total = lineTotal(item);
                    const isBusy = busyItem === (item.itemId || item.productId);

                    return (
                      <div
                        key={
                          item.itemId ||
                          `${item.productId}-${item.color}-${item.size}-${index}`
                        }
                        className={`cart-item ${isBusy ? "is-busy" : ""}`}
                      >
                        <div className="cart-item-img-wrap">
                          <MediaImage
                            src={
                              item.imageUrl ||
                              product?.imageUrl ||
                              "/uploads/images/ass1.png"
                            }
                            alt={product?.name || "Product"}
                            className="cart-item-img"
                          />
                        </div>

                        <div className="cart-item-body">
                          <p className="cart-item-name">
                            {product?.name || "Unavailable product"}
                          </p>

                          {(item.size || item.color) && (
                            <div className="cart-item-variants">
                              {item.size && (
                                <span className="cart-item-variant">
                                  {item.size}
                                </span>
                              )}
                              {item.color && (
                                <span className="cart-item-variant">
                                  {item.color}
                                </span>
                              )}
                            </div>
                          )}

                          {product?.price ? (
                            <span className="cart-item-price">
                              {money(product.price)}
                            </span>
                          ) : (
                            <span className="cart-item-unavailable">
                              This item is no longer available.
                            </span>
                          )}

                          <div className="cart-item-actions">
                            <div className="qty-control">
                              <button
                                type="button"
                                aria-label={`Decrease quantity of ${product?.name || "item"}`}
                                disabled={isBusy || item.quantity <= 1}
                                onClick={() => handleQuantityChange(item, -1)}
                              >
                                −
                              </button>
                              <span aria-live="polite">{item.quantity}</span>
                              <button
                                type="button"
                                aria-label={`Increase quantity of ${product?.name || "item"}`}
                                disabled={isBusy}
                                onClick={() => handleQuantityChange(item, 1)}
                              >
                                +
                              </button>
                            </div>

                            <button
                              className="btn-remove"
                              disabled={isBusy}
                              onClick={() => handleRemove(item)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <div
                          style={{
                            marginLeft: "auto",
                            paddingLeft: "10px",
                            fontWeight: 600,
                            color: "#173D2B",
                            fontSize: "0.9rem",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {total === null ? "—" : money(total)}
                        </div>
                      </div>
                    );
                  })}

                  <div className="cart-totals">
                    <div className="cart-total-row">
                      <span>Subtotal</span>
                      <span>{money(subtotal)}</span>
                    </div>
                    <div className="cart-total-row">
                      <span>Delivery</span>
                      <span>{money(deliveryFee)}</span>
                    </div>
                    <div className="cart-total-row cart-total-row--total">
                      <span>Total</span>
                      <span>{money(totalPay)}</span>
                    </div>

                    <button
                      className="btn-checkout"
                      onClick={handlePayNow}
                      disabled={placing || cartLoading}
                    >
                      {placing ? (
                        "Placing order…"
                      ) : user ? (
                        `Pay Now · ${money(totalPay)}`
                      ) : (
                        "Log in to checkout"
                      )}
                    </button>

                    {touched && !shippingComplete && (
                      <p className="cart-hint" role="alert">
                        Missing: {missingFields.join(", ")}
                      </p>
                    )}

                    <Link to="/shop" className="btn-continue">
                      Continue shopping
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Shipping Form — shown second on mobile */}
        <div className="cart-form-side">
          <div className="cart-panel">
            <div className="cart-panel-head">
              <h2>Contact & Shipping</h2>
            </div>
            <div className="cart-panel-body">
              <div className="cart-form-section">
                <div className="row g-2">
                  <div className="col-12 col-sm-6">
                    <label htmlFor="ck-name" className="form-label">
                      Full name
                    </label>
                    <input
                      id="ck-name"
                      name="name"
                      type="text"
                      className={`form-control ${invalid("name") ? "is-invalid" : ""}`}
                      autoComplete="name"
                      value={form.name}
                      onChange={setField}
                      required
                    />
                  </div>

                  <div className="col-12 col-sm-6">
                    <label htmlFor="ck-phone" className="form-label">
                      Phone
                    </label>
                    <input
                      id="ck-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      className={`form-control ${invalid("phone") ? "is-invalid" : ""}`}
                      autoComplete="tel"
                      value={form.phone}
                      onChange={setField}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="cart-form-section">
                <h3 className="cart-section-title">Delivery Method</h3>
                {DELIVERY_OPTIONS.map((option) => (
                  <div className="form-check" key={option.value}>
                    <input
                      type="radio"
                      className="form-check-input"
                      id={`delivery-${option.value}`}
                      name="deliveryMethod"
                      value={option.value}
                      checked={deliveryMethod === option.value}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`delivery-${option.value}`}
                    >
                      {option.label}
                      <small>
                        {option.fee > 0
                          ? ` · +${money(option.fee)}`
                          : " · Free"}
                      </small>
                    </label>
                  </div>
                ))}
              </div>

              <div className="cart-form-section">
                <h3 className="cart-section-title">Shipping Info</h3>
                <div className="row g-2">
                  <div className="col-12 col-sm-6">
                    <label htmlFor="ck-address" className="form-label">
                      Address
                    </label>
                    <input
                      id="ck-address"
                      name="address"
                      type="text"
                      className={`form-control ${
                        invalid("address") ? "is-invalid" : ""
                      }`}
                      autoComplete="street-address"
                      value={form.address}
                      onChange={setField}
                      required
                    />
                  </div>

                  <div className="col-12 col-sm-6">
                    <label htmlFor="ck-city" className="form-label">
                      City
                    </label>
                    <input
                      id="ck-city"
                      name="city"
                      type="text"
                      className={`form-control ${invalid("city") ? "is-invalid" : ""}`}
                      autoComplete="address-level2"
                      value={form.city}
                      onChange={setField}
                      required
                    />
                  </div>

                  <div className="col-12 col-sm-6">
                    <label htmlFor="ck-country" className="form-label">
                      Country
                    </label>
                    <input
                      id="ck-country"
                      name="country"
                      type="text"
                      className={`form-control ${
                        invalid("country") ? "is-invalid" : ""
                      }`}
                      autoComplete="country-name"
                      value={form.country}
                      onChange={setField}
                      required
                    />
                  </div>

                  <div className="col-12 col-sm-6">
                    <label htmlFor="ck-postalCode" className="form-label">
                      Postal code
                    </label>
                    <input
                      id="ck-postalCode"
                      name="postalCode"
                      type="text"
                      inputMode="numeric"
                      className={`form-control ${
                        invalid("postalCode") ? "is-invalid" : ""
                      }`}
                      autoComplete="postal-code"
                      value={form.postalCode}
                      onChange={setField}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="cart-form-section">
                <h3 className="cart-section-title">Payment Method</h3>
                {PAYMENT_OPTIONS.map((option) => (
                  <div className="form-check" key={option.value}>
                    <input
                      type="radio"
                      className="form-check-input"
                      id={`payment-${option.value}`}
                      name="paymentMethod"
                      value={option.value}
                      checked={paymentMethod === option.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`payment-${option.value}`}
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
