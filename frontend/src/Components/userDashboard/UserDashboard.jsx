import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardMain from "./DashboardMain";
import Head from "./Head";
import Applications from "./pages/Applications";
import Documents from "./pages/Documents";
import Profile from "./pages/Profile";
import "../../Styles/UserDashboard.css";

const user = {
  name: "Visthargalla Manohar",
  email: "manohar@gmail.com",
};

const dashboardData = {
  user: {
    name: "Manohar",
  },
  stats: [
    {
      title: "Total applications",
      value: "5",
      note: "All time",
    },
    {
      title: "Under review",
      value: "2",
      note: "Awaiting officer",
    },
    {
      title: "Approved amount",
      value: "₹50,00,000",
      note: "Home loan",
      color: "green",
    },
    {
      title: "Docs pending",
      value: "3",
      note: "Upload required",
      color: "red",
    },
  ],
  activeApplication: {
    id: "HLP-2025-00142",
    amount: "₹50,00,000",
    loanType: "Home loan",
    officer: "Priya Sharma",
    agent: "Karthik Patel",
    steps: [
      { label: "Submitted", status: "done" },
      { label: "Docs verified", status: "done" },
      { label: "Credit check", status: "current", step: 3 },
      { label: "Sanction", step: 4 },
      { label: "Disbursal", step: 5 },
    ],
  },
  activities: [
    "🔵 Credit assessment started — Today 9:14 AM",
    "✅ Documents verified — Apr 23 · 2:15 PM",
    "🔴 Bank statement upload pending — Apr 23",
    "✅ Application submitted — Apr 22",
  ],
};

const menuSections = [
  {
    heading: "MAIN",
    items: [
      { label: "Dashboard", to: "/" },
      { label: "My applications", to: "/applications", badge: "2" },
      { label: "My documents", to: "/documents", badge: "1" },
      { label: "Loan tracker", to: "/loan-tracker" },
    ],
  },
  {
    heading: "TOOLS",
    items: [
      { label: "EMI calculator", to: "/emi-calculator" },
      { label: "Eligibility check", to: "/eligibility-check" },
    ],
  },
  {
    heading: "ACCOUNT",
    items: [{ label: "My profile", to: "/profile" }],
  },
];

const userProfile = {
  firstName: "Manohar",
  lastName: "visthargalla",
  email: "manohar.visthargalla@email.com",
};

function PagePlaceholder({ title }) {
  return (
    <div className="dashboard-main">
      <h2>{title}</h2>
      <p>This section is coming soon. It will update without changing the layout.</p>
    </div>
  );
}

export default function UserDashboard() {
  return (
    <div className="dashboard-layout">
      <Sidebar user={user} sections={menuSections} />
      <div className="dashboard-content">
        <Head />
        <Routes>
          <Route path="/" element={<DashboardMain dashboardData={dashboardData} />} />
          <Route path="/applications" element={<Applications user={user} />} />
          <Route path="/documents" element={<Documents user={user} />} />
          <Route path="/loan-tracker" element={<PagePlaceholder title="Loan tracker" />} />
          <Route path="/emi-calculator" element={<PagePlaceholder title="EMI calculator" />} />
          <Route path="/eligibility-check" element={<PagePlaceholder title="Eligibility check" />} />
          <Route path="/profile" element={<Profile user={userProfile} />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </div>
    </div>
  );
}