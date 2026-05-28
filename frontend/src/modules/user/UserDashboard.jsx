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

import {userMenuSections} from "../../utils/UserDashboardUtils";

export default function UserDashboard() {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getToken();
        const storedAuth = getUser(); // Returns { id: ... } from auth.js

        if (token && storedAuth?.id) {
          const res = await axios.get(
            `http://localhost:5000/user/${storedAuth.id}`,
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Fetched user from backend:", res.data);
          setCustomer(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // Run only on mount
  

  // Derive display data from customer (fetched from backend)
  const user = {
    _id: customer?._id,
    name: customer?.firstname ? `${customer.firstname} ${customer.lastname || ''}`.trim() : "Guest User",
    email: customer?.email || "",
    profilePhoto: customer?.profilePhoto || "",
  };

  const userProfile = {
    _id: customer?._id,
    firstName: customer?.firstname || "Guest",
    lastName: customer?.lastname || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    gender: customer?.gender || "",
    userId: customer?.userId || "",
    profilePhoto: customer?.profilePhoto || "",
  };

  const dashboardData = {
    user: { name: customer?.firstname || "there" },
    stats: [
      { title: "Total applications", value: "0", note: "All time" },
      { title: "Under review", value: "0", note: "Awaiting officer" },
      { title: "Approved amount", value: "—", note: "No active loan" },
      { title: "Docs pending", value: "0", note: "All clear" },
    ],
    activities: ["✅ Account created — Welcome to MLRR Home Loans!"],
  };

  const handleProfileUpdated = async (updatedUser) => {
    // Update local state with the updated user data
    setCustomer(updatedUser);
  };

  if (loading) {
    return (
      <div className="UserDashboard">
        <div className="dashboard-layout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="UserDashboard">
      <div className="dashboard-layout">
         <Sidebar user={user} sections={userMenuSections} onProfileUpdated={handleProfileUpdated} />

        <div className="dashboard-content">
          <Routes>
            <Route index element={<DashboardMain dashboardData={dashboardData} />} />
            <Route path="applications" element={<Applications user={user} />} />
            <Route path="mydocuments" element={<Documents user={user} />} />
            <Route path="loan-tracker" element={<LoanTracker />} />
            <Route path="profile" element={<Profile user={userProfile} onProfileUpdated={handleProfileUpdated} />} />
            <Route path="*" element={<Navigate replace to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}