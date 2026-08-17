import React from "react";
import Sidebar from "./Sidebar";
import "./style/Sidebar.css";

export default function AdminLayout({ children }) {
  // Sidebar renders three siblings: the mobile top bar, the drawer backdrop
  // and the nav column itself. `.admin-shell` is a row on desktop and a
  // column on mobile so the top bar sits above the content instead of
  // beside it.
  return (
    <div className="admin-shell">
      <Sidebar />
      <main className="admin-content">{children}</main>
    </div>
  );
}
