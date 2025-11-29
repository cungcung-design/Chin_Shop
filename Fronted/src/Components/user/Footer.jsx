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
        </div>

        {/* Quick Links / Brand / Social */}
        <div className="footer-container-2 d-flex flex-wrap gap-4">
          <div className="footer-section">
            <h4>Our Brand New</h4>
            <ul>
              <li>
                <span>Blog</span>
              </li>
              <li>
                <span>Podcast</span>
              </li>
              <li>
                <span>Careers</span>
              </li>
              <li>
                <span>New Product</span>
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
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-icons d-flex flex-wrap">
              <a href="#" aria-label="Facebook">
                FAQS
              </a>
              <a href="#" aria-label="Instagram">
                Contacts
              </a>
              <a href="#" aria-label="Twitter">
                About Us
              </a>
              <a href="#" aria-label="LinkedIn">
                Products
              </a>
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div className="d-flex justify-content-between flex-wrap align-items-center px-4 text-white ">
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Chin Fashion. All rights reserved.
        </div>
        <div className="social-icons">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="text-white mx-2"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="text-white mx-2"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="text-white mx-2"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://t.me"
            target="_blank"
            rel="noreferrer"
            className="text-white mx-2"
          >
            <i className="fab fa-telegram-plane"></i>
          </a>
          <a
            href="https://wa.me"
            target="_blank"
            rel="noreferrer"
            className="text-white mx-2"
          >
            <i className="fab fa-whatsapp"></i>
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-white mx-2"
          >
            <i className="fab fa-github"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
