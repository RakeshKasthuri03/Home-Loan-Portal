import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardMain from "./DashboardMain";
import Applications from "./Applications";
import Documents from "./Documents";
import Profile from "./Profile";
import { getUser } from "../../utils/auth";
import "../../Styles/UserDashboard.css";
const menuSections = [
  {
    heading: "MAIN",
    items: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "My applications", to: "/dashboard/applications", badge: "2" },
      { label: "My documents", to: "/dashboard/mydocuments", badge: "1" },
      { label: "Loan tracker", to: "/dashboard/loan-tracker" },
    ],
  },
  {
    heading: "ACCOUNT", 
    items: [{ label: "My profile", to: "/dashboard/profile" }],
  },
];


function PagePlaceholder({ title }) {
  return (
    <div className="dashboard-main">
      <h2>{title}</h2>
      <p>This section is coming soon.</p>
    </div>
  );
}

export default function UserDashboard() {
  const storedUser = getUser();

  const user = {
    name:  storedUser?.name  || "Guest User",
    email: storedUser?.email || "",
  };

  const userProfile = {
    firstName: storedUser?.name?.split(" ")[0] || "Guest",
    lastName:  storedUser?.name?.split(" ").slice(1).join(" ") || "",
    email:     storedUser?.email || "",
  };

  const dashboardData = {
    user: { name: storedUser?.name?.split(" ")[0] || "there" },
    stats: [
      { title: "Total applications", value: "0", note: "All time" },
      { title: "Under review",       value: "0", note: "Awaiting officer" },
      { title: "Approved amount",    value: "—", note: "No active loan" },
      { title: "Docs pending",       value: "0", note: "All clear" },
    ],
    activeApplication: null,
    activities: ["✅ Account created — Welcome to MLRR Home Loans!"],
  };

  return (
  <div className="UserDashboard">

   <div className="dashboard-layout">
  <Sidebar user={user} sections={menuSections} />

  <div className="dashboard-content">
    <Routes>
      <Route path="/dashboard" element={<DashboardMain dashboardData={dashboardData} />} />
      <Route path="/dashboard/applications" element={<Applications user={user} />} />
      <Route path="/dashboard/mydocuments" element={<Documents user={user} />} />
      <Route path="/dashboard/loan-tracker" element={<PagePlaceholder title="Loan tracker" />} />
      <Route path="/dashboard/profile" element={<Profile user={userProfile} />} />
    </Routes>
  </div>
</div>

  </div>
  );
}
