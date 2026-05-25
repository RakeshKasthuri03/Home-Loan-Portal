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

import {userMenuSections} from "../../utils/UserDashboardUtils";

export default function UserDashboard() {
  const [storedUser, setStoredUser] = useState(null);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = localStorage.getItem("mlrr_user");

        if (userData) {
          const parsedUser = JSON.parse(userData);
          setStoredUser(parsedUser);

          const res = await axios.get(
            `http://localhost:5000/api/user/${parsedUser._id}`,
            {
              headers: {
                authorization: `Bearer ${localStorage.getItem("mlrr_token")}`,
              },
            }
          );

          setCustomer(res.data);
        }

      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);
  

  const user = {
    name: storedUser?.firstname || "Guest User",
    email: storedUser?.email || "",
  };

  const userProfile = {
    firstName: storedUser?.firstname || "Guest",
    lastName: storedUser?.lastname || "",
    email: storedUser?.email || "",
    phone: storedUser?.phone || "",
    gender: storedUser?.gender || "",
    userId:storedUser?.userId || "",
  };

  const dashboardData = {
    user: { name: storedUser?.firstname || "there" },
    stats: [
      { title: "Total applications", value: "0", note: "All time" },
      { title: "Under review", value: "0", note: "Awaiting officer" },
      { title: "Approved amount", value: "—", note: "No active loan" },
      { title: "Docs pending", value: "0", note: "All clear" },
    ],
    activities: ["✅ Account created — Welcome to MLRR Home Loans!"],
  };

  const handleProfileUpdated = (updatedUser) => {
    try { localStorage.setItem('mlrr_user', JSON.stringify(updatedUser)); } catch {}
    setStoredUser(updatedUser);
    setCustomer(updatedUser);
  };

  return (
    <div className="UserDashboard">
      <div className="dashboard-layout">
         <Sidebar user={customer || storedUser || user} sections={userMenuSections} onProfileUpdated={handleProfileUpdated} />

        <div className="dashboard-content">
          <Routes>
            <Route index element={<DashboardMain dashboardData={dashboardData} />} />
            <Route path="applications" element={<Applications user={user} />} />
            <Route path="mydocuments" element={<Documents user={user} />} />
            <Route path="loan-tracker" element={<LoanTracker />} />
            <Route path="profile" element={<Profile user={customer || userProfile} />} />
            <Route path="*" element={<Navigate replace to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}