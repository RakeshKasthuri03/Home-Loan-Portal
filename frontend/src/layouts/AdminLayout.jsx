import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../modules/user/Sidebar";
import { adminMenuSections } from "../utils/AdminUtils";
import { getUser } from "../utils/auth";
import "../styles/UserDashboard.css";
import AdminHeader from "../modules/admin/AdminHeader";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = getUser() || { name: "Admin", email: "admin@mlrr.com", role: "admin" };

  return (
    <div className={`UserDashboard ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <AdminHeader />
      <div className="dashboard-layout">
        <Sidebar
          user={user}
          sections={adminMenuSections}
          role="admin"
          onCloseSidebar={() => setSidebarOpen(false)}
        />
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}
        <div className="dashboard-content">
          {/* Mobile menu toggle — mirrors the user dashboard */}
          <header className="dashboard-header">
            <button
              type="button"
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              Menu
            </button>
          </header>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
