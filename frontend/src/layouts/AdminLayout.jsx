import { Outlet } from "react-router-dom";
import Sidebar from "../modules/user/Sidebar";
import { adminMenuSections } from "../utils/AdminUtils";
import { getUser } from "../utils/auth";
import "../styles/UserDashboard.css";
import AdminHeader from "../modules/admin/AdminHeader";

export default function AdminLayout() {
  const user = getUser() || { name: "Admin", email: "admin@mlrr.com", role: "admin" };

  return (
    <div className="UserDashboard">
      <AdminHeader />
      <div className="dashboard-layout">
        <Sidebar user={user} sections={adminMenuSections} role="admin" />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
