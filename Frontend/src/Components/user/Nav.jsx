import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "./style/Nav.css";

export default function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!menuOpen && !searchOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setSearchOpen(false);
    navigate("/");
  };

  const isHome = location.pathname === "/";
  const sectionLink = (hash) => (isHome ? `#${hash}` : `/#${hash}`);

  return (
    <header className={`nav${scrolled ? " is-scrolled" : ""}`}>
      <div className="nav-inner">
        {/* Left: hamburger + logo */}
        <div className="nav-left">
          <button
            type="button"
            className="menu-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="primary-menu"
            onClick={() => {
              setMenuOpen((v) => !v);
              setSearchOpen(false);
            }}
          >
            <span className="menu-toggle-bar" />
            <span className="menu-toggle-bar" />
            <span className="menu-toggle-bar" />
          </button>

          <Link to="/" className="brand-link">
            <span className="brand-name">ChinFashion</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav id="menu" className={menuOpen ? "is-open" : ""}>
          <ul id="primary-menu">
            <li>
              <NavLink to="/" onClick={() => setMenuOpen(false)}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/shop" onClick={() => setMenuOpen(false)}>
                Collection
              </NavLink>
            </li>
            <li>
              <a href={sectionLink("heritage")} onClick={() => setMenuOpen(false)}>
                Heritage
              </a>
            </li>
            <li>
              <NavLink to="/contact" onClick={() => setMenuOpen(false)}>
                About
              </NavLink>
            </li>

            {user?.role === "admin" && (
              <li>
                <NavLink
                  to="/admin-dashboard"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-link" : ""} is-admin`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  Admin
                </NavLink>
              </li>
            )}

            {user && (
              <li>
                <NavLink to="/orders" onClick={() => setMenuOpen(false)}>
                  Orders
                </NavLink>
              </li>
            )}

            {/* Search row inside mobile/tablet menu */}
            <li className="menu-search-row">
              <button
                type="button"
                className="menu-search-trigger"
                onClick={() => setSearchOpen((v) => !v)}
              >
                <i className="fa fa-search" aria-hidden="true" />
                <span>{searchOpen ? "Close Search" : "Search"}</span>
              </button>
              {searchOpen && (
                <div className="menu-search-box">
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search products..."
                    autoFocus
                  />
                </div>
              )}
            </li>

            <li className="hide-on-desktop">
              <a href={sectionLink("new-arrival")} onClick={() => setMenuOpen(false)}>
                New Arrivals
              </a>
            </li>
            <li className="hide-on-desktop">
              <a href={sectionLink("category")} onClick={() => setMenuOpen(false)}>
                Categories
              </a>
            </li>
          </ul>
        </nav>

        {/* Right: actions */}
        <div className="nav-actions">
          <button
            type="button"
            className="icon-btn search-btn"
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
          >
            <i className="fa fa-search" aria-hidden="true" />
          </button>

          <Link
            to="/carts"
            className="cart-icon-wrapper"
            aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
          >
            <i className="fa fa-shopping-cart" aria-hidden="true" />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>

          {user && (
            <Link
              to="/orders"
              className="icon-btn orders-btn"
              aria-label="My orders"
              title="My Orders"
            >
              <i className="fa fa-box" aria-hidden="true" />
            </Link>
          )}

          {!user && (
            <>
              <Link
                to="/signup"
                className="btn btn-outline-primary ms-2 d-none d-sm-inline-flex"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="btn btn-primary ms-2 d-none d-sm-inline-flex"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            </>
          )}

          {user && (
            <>
              <span className="nav-greeting d-none d-md-inline">
                Hi, {user.name?.split(" ")[0] || "there"}
              </span>
              <button className="btn btn-outline-danger ms-2 d-none d-sm-inline-flex" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
