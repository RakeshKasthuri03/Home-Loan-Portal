import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardMain from "./DashboardMain";
import Applications from "./Applications";
import Documents from "./Documents";
import Profile from "./Profile";
import LoanTracker from "./LoanTracker";
import axios from "axios";
import "../../styles/UserDashboard.css";
import { getUser, getToken } from "../../utils/auth";
import { getMyApplications } from "../../utils/loanApi";
import {userMenuSections} from "../../utils/UserDashboardUtils";

const fmt = (n) => n ? "₹" + Number(n).toLocaleString("en-IN") : "—";

export default function UserDashboard() {
  const [customer, setCustomer]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token      = getToken();
        const storedAuth = getUser();

        // Fetch user profile and applications in parallel
        const [userRes, appsRes] = await Promise.all([
          token && storedAuth?.id
            ? axios.get(`http://localhost:5000/user/${storedAuth.id}`, { headers: { authorization: `Bearer ${token}` } })
            : Promise.resolve(null),
          getMyApplications(),
        ]);

        if (userRes) setCustomer(userRes.data);
        if (appsRes.success) setApplications(appsRes.data.applications || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Derive stats from real application data ──────────────────────────────
  const total         = applications.length;
  const underReview   = applications.filter(a => ["submitted","under_review"].includes(a.status)).length;
  const docsPending   = applications.filter(a => a.status === "documents_pending").length;
  const approved      = applications.find(a => a.status === "approved" || a.status === "disbursed");
  const approvedAmt   = approved?.sanctionedDetails?.sanctionedAmount || approved?.financialDetails?.loanAmount || null;
  const rejected      = applications.filter(a => a.status === "rejected").length;

  // Active application — highest priority non-closed one
  const activeApp = applications.find(a => ["submitted","under_review","documents_pending","approved","disbursed"].includes(a.status));

  const loanTypeLabels = { PURCHASE:"Home Purchase Loan", PLOT:"Plot Loan", NRI:"NRI Home Loan", RENOVATION:"Renovation Loan", BALANCE_TRANSFER:"Balance Transfer" };

  // Build active application steps based on status
  const buildSteps = (app) => {
    const allSteps = [
      { label: "Submitted",    statuses: ["submitted","under_review","documents_pending","approved","disbursed","closed"] },
      { label: "Under Review", statuses: ["under_review","approved","disbursed","closed"] },
      { label: "Docs Check",   statuses: ["approved","disbursed","closed"] },
      { label: "Approved",     statuses: ["approved","disbursed","closed"] },
      { label: "Disbursed",    statuses: ["disbursed","closed"] },
    ];
    return allSteps.map(s => ({
      label: s.label,
      status: s.statuses.includes(app.status) ? "done" : app.status === s.label.toLowerCase().replace(" ","_") ? "current" : "pending"
    }));
  };

  const activeApplication = activeApp ? {
    id:       activeApp.applicationId,
    loanType: loanTypeLabels[activeApp.loanType] || activeApp.loanType,
    amount:   fmt(activeApp.financialDetails?.loanAmount),
    status:   activeApp.status,
    officer:  activeApp.assignedAgent ? `${activeApp.assignedAgent.firstname || ""} ${activeApp.assignedAgent.lastname || ""}`.trim() || "Assigned" : "Pending assignment",
    steps:    buildSteps(activeApp),
  } : null;

  // Recent activity from remarks
  const recentActivities = applications.flatMap(a =>
    (a.processing?.remarks || []).map(r => ({
      text: r.text,
      date: r.date ? new Date(r.date) : null,
      appId: a.applicationId,
    }))
  ).sort((a, b) => (b.date || 0) - (a.date || 0)).slice(0, 5);

  const activities = recentActivities.length > 0
    ? recentActivities.map(r => `${r.appId ? `[${r.appId}] ` : ""}${r.text}`)
    : ["✅ Account created — Welcome to MLRR Home Loans!"];

  const user = {
    _id:          customer?._id,
    name:         customer?.firstname ? `${customer.firstname} ${customer.lastname || ""}`.trim() : "Guest User",
    email:        customer?.email || "",
    profilePhoto: customer?.profilePhoto || "",
  };

  const userProfile = {
    _id:          customer?._id,
    firstName:    customer?.firstname || "Guest",
    lastName:     customer?.lastname  || "",
    email:        customer?.email     || "",
    phone:        customer?.phone     || "",
    gender:       customer?.gender    || "",
    userId:       customer?.userId    || "",
    profilePhoto: customer?.profilePhoto || "",
  };

  const dashboardData = {
    user: { name: customer?.firstname || "there" },
    stats: [
      { title: "Total Applications", value: String(total),       note: total === 1 ? "1 application" : `${total} applications` },
      { title: "Under Review",       value: String(underReview), note: underReview > 0 ? "Awaiting decision" : "None pending",       color: underReview > 0 ? "orange" : "" },
      { title: "Approved Amount",    value: approvedAmt ? fmt(approvedAmt) : "—", note: approved ? `Status: ${approved.status}` : "No approved loan", color: approved ? "green" : "" },
      { title: "Docs Pending",       value: String(docsPending), note: docsPending > 0 ? "Upload required" : "All clear",            color: docsPending > 0 ? "red" : "" },
    ],
    activeApplication,
    activities,
  };

  const handleProfileUpdated = (updatedUser) => setCustomer(updatedUser);

  if (loading) return (
    <div className="UserDashboard">
      <div className="dashboard-layout" style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"100vh" }}>
        <p>Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="UserDashboard">
      <div className="dashboard-layout">
        <Sidebar user={user} sections={userMenuSections} onProfileUpdated={handleProfileUpdated} />
        <div className="dashboard-content">
          <Routes>
            <Route index element={<DashboardMain dashboardData={dashboardData} />} />
            <Route path="applications"  element={<Applications user={user} />} />
            <Route path="mydocuments"   element={<Documents user={user} />} />
            <Route path="loan-tracker"  element={<LoanTracker />} />
            <Route path="profile"       element={<Profile user={userProfile} onProfileUpdated={handleProfileUpdated} />} />
            <Route path="*"             element={<Navigate replace to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}