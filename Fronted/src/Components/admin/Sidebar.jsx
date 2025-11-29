import { NavLink, useNavigate } from "react-router-dom";
import "./style/Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login"); // redirect to login page
  };

  const menuItems = [
    { path: "/admin-dashboard", icon: "bi-speedometer2", label: "Dashboard" },
    { path: "/admin/users", icon: "bi-people", label: "Users" },
    { path: "/admin/orders", icon: "bi-bag-check", label: "Orders" },
    { path: "/admin/products", icon: "bi-box-seam", label: "Products" },
    { path: "/admin/categories", icon: "bi-grid-fill", label: "Categories" },
   { path: "/admin/message", icon: "bi-chat-dots", label: "Message" },

    { path: "/admin/product-ratings", icon: "bi-star", label: "Ratings & Comments" }
  ];

  return (
<div className="sidebar d-flex flex-column">
  <h4>🅰️ Admin</h4>

  <ul className="flex-column px-2 mb-auto">
    {menuItems.map((item) => (
      <li key={item.path} className="nav-item mb-2">
        <NavLink
          to={item.path}
          className={({ isActive }) =>
            `nav-link ${isActive ? "active-link" : ""}`
          }
        >
          <i className={`bi ${item.icon} me-2`}></i>
          <span>{item.label}</span>
        </NavLink>
      </li>
    ))}

    {/* Logout button directly after last menu item */}
    <li className="nav-item mt-2">
      <button
        className="btn btn-outline-danger w-100"
        onClick={handleLogout}
      >
        <i className="bi bi-box-arrow-right me-1"></i> Logout
      </button>
    </li>
  </ul>
</div>

  );
}
