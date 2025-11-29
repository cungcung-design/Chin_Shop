import React from "react";
import Sidebar from "./Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="d-flex min-vh-100">
      <Sidebar />
      <div className="flex-grow-1">{children}</div>
    </div>
  );
}
