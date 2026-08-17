import React from "react";
import { Link } from "react-router-dom";
import "./style/footer.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About / Logo */}
        <div className="footer-section">
          <h3>Chin Fashion</h3>
          <p>Elevate your style with our bold and trendy fashion collection.</p>
          <div className="footer-badges">
            <span className="badge-premium">Premium Quality</span>
            <span className="badge-free">Free Shipping</span>
            <span className="badge-return">Easy Returns</span>
          </div>
        </div>

        {/* Quick Links / Brand / Social */}
        <div className="footer-container-2 d-flex flex-wrap gap-4">
          <div className="footer-section">
            <h4>Shop</h4>
            <ul>
              <li>
                <Link to="/shop">All Products</Link>
              </li>
              <li>
                <Link to="/#new-arrival">New Arrivals</Link>
              </li>
              <li>
                <Link to="/#category">Categories</Link>
              </li>
              <li>
                <Link to="/carts">Your Cart</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/shop">Shop</Link>
              </li>
              <li>
                <Link to="/orders">My Orders</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Help</h4>
            <div className="help-links">
              <Link to="/contact">Contact Us</Link>
              <Link to="/shop">Products</Link>
              <Link to="/login">Account</Link>
            </div>
            <div className="footer-payments">
              <span>We Accept</span>
              <div className="payment-icons">
                <span className="payment-icon">VISA</span>
                <span className="payment-icon">MC</span>
                <span className="payment-icon">PayPal</span>
                <span className="payment-icon">Apple Pay</span>
                <span className="payment-icon">GPay</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div className="d-flex justify-content-between flex-wrap align-items-center px-4 text-white">
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} <span>Chin Fashion</span>. All rights reserved.
        </div>
        <div className="social-icons">
          {[
            { href: "https://facebook.com", icon: "fa-facebook-f", label: "Facebook" },
            { href: "https://instagram.com", icon: "fa-instagram", label: "Instagram" },
            { href: "https://twitter.com", icon: "fa-twitter", label: "Twitter" },
            { href: "https://t.me", icon: "fa-telegram-plane", label: "Telegram" },
            { href: "https://wa.me", icon: "fa-whatsapp", label: "WhatsApp" },
            { href: "https://github.com", icon: "fa-github", label: "GitHub" },
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="text-white mx-2"
              aria-label={social.label}
            >
              <i className={`fab ${social.icon}`} aria-hidden="true"></i>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
