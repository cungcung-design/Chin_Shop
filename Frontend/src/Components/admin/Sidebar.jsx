import { useContext, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./style/Sidebar.css";

const menuItems = [
  { path: "/admin-dashboard", icon: "bi-speedometer2", label: "Dashboard" },
  { path: "/admin/users", icon: "bi-people", label: "Users" },
  { path: "/admin/orders", icon: "bi-bag-check", label: "Orders" },
  { path: "/admin/products", icon: "bi-box-seam", label: "Products" },
  { path: "/admin/categories", icon: "bi-grid-fill", label: "Categories" },
  { path: "/admin/message", icon: "bi-chat-dots", label: "Message" },
  {
    path: "/admin/product-ratings",
    icon: "bi-star",
    label: "Ratings & Comments",
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  // Close the drawer whenever the route changes (mobile).
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Escape closes the drawer.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const handleLogout = () => {
    // Goes through AuthContext so React state is cleared too — previously
    // only localStorage was wiped, leaving the app "logged in" until refresh.
    logout();
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile top bar with the drawer toggle */}
      <div className="admin-topbar d-lg-none">
        <button
          type="button"
          className="admin-burger"
          aria-label="Open admin menu"
          aria-expanded={open}
          aria-controls="admin-sidebar"
          onClick={() => setOpen(true)}
        >
          <i className="bi bi-list" aria-hidden="true"></i>
        </button>
        <span className="admin-topbar-title">Admin</span>
      </div>

      {/* Backdrop behind the mobile drawer */}
      {open && (
        <div
          className="admin-sidebar-backdrop d-lg-none"
          onClick={() => setOpen(false)}
          role="presentation"
        />
      )}

      <nav
        id="admin-sidebar"
        className={`sidebar d-flex flex-column ${open ? "is-open" : ""}`}
        aria-label="Admin navigation"
      >
        <div className="sidebar-header">
          <h4 className="sidebar-brand">
            <span className="sidebar-brand-icon">A</span>
            Admin
          </h4>
          <button
            type="button"
            className="admin-sidebar-close d-lg-none"
            aria-label="Close admin menu"
            onClick={() => setOpen(false)}
          >
            &times;
          </button>
        </div>

        <ul className="sidebar-nav">
          {menuItems.map((item) => (
            <li key={item.path} className="sidebar-nav-item">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active-link" : ""}`
                }
              >
                <i className={`bi ${item.icon}`} aria-hidden="true"></i>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}

          <div className="sidebar-divider" />

          <li className="sidebar-nav-item">
            <NavLink to="/" className="sidebar-link sidebar-link--store">
              <i className="bi bi-shop" aria-hidden="true"></i>
              <span>View Store</span>
            </NavLink>
          </li>

          <li className="sidebar-nav-item">
            <button
              className="sidebar-logout"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right" aria-hidden="true"></i>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
