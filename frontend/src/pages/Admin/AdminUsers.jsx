import React from "react";
import Sidebar from "../../Components/userDashboard/Sidebar";
import { admin, adminMenuSections } from "../../utils/AdminUtils";
import "../../Styles/AdminDashboard.css"

const users = [
  {
    name: "Rahul Nani",
    initials: "RN",
    status: "Verified",
    applications: 2,
    approved: "₹42L",
  },
  {
    name: "Ananya Rao",
    initials: "AR",
    status: "Pending KYC",
    applications: 1,
    approved: "—",
  },
  {
    name: "Vijay Kumar",
    initials: "VK",
    status: "Verified",
    applications: 3,
    approved: "₹35L",
  },
  {
    name: "Preethi M.",
    initials: "PM",
    status: "Verified",
    applications: 2,
    approved: "₹80L",
  },
  {
    name: "Suresh Raj",
    initials: "SR",
    status: "Verified",
    applications: 1,
    approved: "₹42L",
  },
];

function AdminUsers() {
  return (
    <div className="UserDashboard">
      <div className="dashboard-layout">
        {/* <Sidebar user={admin} sections={adminMenuSections} role="admin" /> */}

        <main className="dashboard-content">
         

          <div className="card-grid">
            {users.map((user) => (
              <div className="profile-card" key={user.name}>
                <div className="profile-top">
                  <div className="avatar-circle">{user.initials}</div>
                  <div>
                    <h4>{user.name}</h4>
                    <p className="sub-text">
                      Customer · {user.status}
                    </p>
                  </div>
                </div>

                <div className="profile-stats">
                  <div>
                    <strong>{user.applications}</strong>
                    <span>Applications</span>
                  </div>
                  <div>
                    <strong className="green">{user.approved}</strong>
                    <span>Approved</span>
                  </div>
                </div>

                <button className="manage-btn">Manage</button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminUsers;
