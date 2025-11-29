import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { ProductsContext } from "../user/ProductContext";
import { createOrder } from "../../libs/api";
import "./style/Carts.css";

export default function Carts() {
  const { cart, updateCartItem, removeCartItem, clearCart, user } =
    useContext(CartContext);
  const { products } = useContext(ProductsContext);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getProduct = (id) => products.find((p) => p._id === id) || null;

  const handleQuantityChange = (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    updateCartItem(item.productId, newQty, item.color, item.size);
  };

  const handleRemove = (item) =>
    removeCartItem(item.productId, item.color, item.size);

  const subtotal = cart.reduce((sum, item) => {
    const product = getProduct(item.productId);
    return sum + (product?.price || 0) * (item.quantity || 1);
  }, 0);

  const deliveryFee = deliveryMethod === "express" ? 10 : 0;
  const totalPay = subtotal + deliveryFee;

  const handlePayNow = async () => {
    if (!user) return showNotification("You must log in to place an order.");
    if (cart.length === 0) return showNotification("Your cart is empty!");
    if (!name || !phone || !address || !city || !country || !postalCode)
      return showNotification("Please fill all shipping info.");

    try {
      const formattedItems = cart.map((item) => {
        const product = getProduct(item.productId);
        return {
          product: product?._id || item.productId,
          name: product?.name || "Unknown",
          price: product?.price || 0,
          quantity: item.quantity,
          total: (product?.price || 0) * item.quantity,
          color: item.color,
          size: item.size,
          imageUrl: item.imageUrl || product?.imageUrl?.[0] || "",
        };
      });

      await createOrder({
        deliveryMethod,
        paymentMethod,
        name,
        phone,
        address,
        city,
        country,
        postalCode,
        items: formattedItems,
        subtotal,
        deliveryFee,
        totalPay,
      });

      showNotification("Order created successfully!");
      clearCart();
      setName("");
      setPhone("");
      setAddress("");
      setCity("");
      setCountry("");
      setPostalCode("");
    } catch (err) {
      console.error(err);
      showNotification("Failed to create order.");
    }
  };

  return (
    <div className="container-fluid FlexContainer">
      <div className="row">
        {/* LEFT SIDE */}
        <div className="col-lg-6 left">
          <h1>Contact & Shipping</h1>

          <input
            type="text"
            className="form-control mb-2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            className="form-control mb-2"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <h2>Delivery Method</h2>
          {["standard", "express"].map((method) => (
            <div className="form-check" key={method}>
              <input
                type="radio"
                className="form-check-input"
                value={method}
                checked={deliveryMethod === method}
                onChange={(e) => setDeliveryMethod(e.target.value)}
              />
              <label className="form-check-label">
                {method === "standard"
                  ? "Standard (3-5 days)"
                  : "Express (1-2 days)"}
              </label>
            </div>
          ))}

          <h2>Shipping Info</h2>

          <div className="d-flex mb-2 gap-2">
            <input
              type="text"
              placeholder="Address"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              type="text"
              placeholder="City"
              className="form-control"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="d-flex mb-2 gap-2">
            <input
              type="text"
              placeholder="Country"
              className="form-control"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <input
              type="text"
              placeholder="Postal Code"
              className="form-control"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>

          <h2>Payment Method</h2>
          {["credit", "paypal", "cod"].map((method) => (
            <div className="form-check" key={method}>
              <input
                type="radio"
                className="form-check-input"
                value={method}
                checked={paymentMethod === method}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label className="form-check-label">
                {method === "credit"
                  ? "Credit/Debit"
                  : method === "paypal"
                  ? "PayPal"
                  : "Cash on Delivery"}
              </label>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="col-lg-6 right">
          <h1>Cart</h1>

          {cart.length === 0 && <p>Your cart is empty.</p>}

          {cart.map((item, index) => {
            const product = getProduct(item.productId);
            return (
              <div
                key={`${item.productId}-${item.color}-${item.size}-${index}`}
                className="d-flex mb-4 align-items-start CartItemBox"
              >
                <div className="image-container me-3">
                  <img
                    src={
                      item.imageUrl ||
                      product?.imageUrl?.[0] ||
                      "/placeholder.png"
                    }
                    className="img-fluid"
                  />
                </div>

                <div className="flex-grow-1 box-2 ">
                  <div className="d-flex flex  box-2  justify-content-between">
                    <span>{product?.name || "Unknown"}</span>
                    <span>
                      ${(product?.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Size & Color ABOVE Price */}
                  <div className="d-flex flex-column size-color-box gap-2 my-1">
                    {item.size && (
                      <span className="badge  ">
                        Size: {item.size}
                      </span>
                    )}
                    {item.color && (
                      <span className="badge ">
                        Color: {item.color}
                      </span>
                    )}
                  </div>

                  <small>Price: ${product?.price?.toFixed(2)}</small>

                  <div className="d-flex align-items-center mt-2 justify-content-between">
                    <div className="btn-container">
                      <span
                        className="minus"
                        onClick={() => handleQuantityChange(item, -1)}
                      >
                        -
                      </span>
                      <span className="number">{item.quantity}</span>
                      <span
                        className="plus"
                        onClick={() => handleQuantityChange(item, 1)}
                      >
                        +
                      </span>
                    </div>

                    <button
                      className="btn btn-danger btn-sm ms-3"
                      onClick={() => handleRemove(item)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <hr />
          <div>
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span>Delivery</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between fw-bold">
              <span>Total</span>
              <span>${totalPay.toFixed(2)}</span>
            </div>

            <button className="btn btn-primary w-100 mt-3" onClick={handlePayNow}>
              Pay Now
            </button>
          </div>
        </div>
      </div>

      {showToast && (
        <div
          className="toast-container position-fixed top-0 end-0 p-3"
          style={{ zIndex: 1050 }}
        >
          <div className="toast align-items-center text-bg-success border-0 show">
            <div className="d-flex">
              <div className="toast-body">{toastMessage}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
