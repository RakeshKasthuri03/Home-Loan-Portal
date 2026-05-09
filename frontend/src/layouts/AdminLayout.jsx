import { Outlet } from "react-router-dom";
import Sidebar from "../modules/user/Sidebar";
import { admin, adminMenuSections } from "../utils/AdminUtils";
import "../styles/UserDashboard.css";
import AdminHeader from "../modules/admin/AdminHeader";

export default function AdminLayout() {
  return (
    <div className="UserDashboard">
      <AdminHeader />
      <div className="dashboard-layout">
        <Sidebar user={admin} sections={adminMenuSections} role="admin" />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
