import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCategories } from "../../libs/api";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "./style/Nav.css";

export default function Nav() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const updatemenu = () => {
    const menuCheckbox = document.getElementById("responsive-menu");
    const menuElement = document.getElementById("menu");
    menuElement.style.borderRadius = menuCheckbox.checked ? "0" : "10px";
  };

  // ⭐ Smooth scroll function
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="d-flex align-items-center justify-content-between p-2 nav">
      <span className="fw-bold brand-name">Chin Traditional Clothes</span>

      <nav id="menu">
        <input type="checkbox" id="responsive-menu" onClick={updatemenu} />
        <label htmlFor="responsive-menu"></label>

        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <a href="/#new-arrival">New Arrivals</a>
          </li>
          <li>
            <a href="/#category">Category</a>
          </li>

          <li>
            <a href="/#contact">Contact Us</a>
          </li>
        </ul>
      </nav>

      <div className="d-flex align-items-center me-2">
        <div
          className="cart-icon-wrapper me-3"
          onClick={() => navigate("/carts")}
        >
          <i className="fa fa-shopping-cart"></i>
          {cart?.length > 0 && (
            <span className="cart-count">{cart.length}</span>
          )}
        </div>

        {!user && (
          <>
            <button
              className="btn btn-outline-primary ms-2"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
            <button
              className="btn btn-primary ms-2"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </>
        )}

        {user && (
          <button className="btn btn-danger ms-2" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
