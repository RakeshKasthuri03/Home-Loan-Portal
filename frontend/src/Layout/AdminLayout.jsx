import { Outlet } from "react-router-dom";
import Sidebar from "../Components/userDashboard/Sidebar.jsx";
import { admin, adminMenuSections } from "../utils/AdminUtils.js"
import "../Styles/UserDashboard.css";
import AdminHeader from "../pages/Admin/AdminHeader.jsx";

export default function AdminLayout() {
  return (
    <div className="UserDashboard">
      <AdminHeader />
      <div className="dashboard-layout">
        
        <Sidebar
          user={admin}
          sections={adminMenuSections}
          role="admin"
        />

        <div className="dashboard-content">
          <Outlet />  {/* REQUIRED */}
        </div>
      </div>
    </div>
  );
}