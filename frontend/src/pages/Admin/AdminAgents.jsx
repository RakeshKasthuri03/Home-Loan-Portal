import React from "react";
import Sidebar from "../../Components/userDashboard/Sidebar";
import { admin, adminMenuSections } from "../../utils/AdminUtils";
import "../../Styles/AdminDashboard.css"

const agents = [
  {
    name: "Karthik Patel",
    initials: "KP",
    tier: "Gold tier",
    customers: 18,
    loanValue: "₹4.2Cr",
  },
  {
    name: "Meena I.",
    initials: "MI",
    tier: "Silver tier",
    customers: 14,
    loanValue: "₹2.1Cr",
  },
  {
    name: "Sundar R.",
    initials: "SR",
    tier: "Gold tier",
    customers: 21,
    loanValue: "₹5.0Cr",
  },
  {
    name: "Priya S.",
    initials: "PS",
    tier: "Platinum tier",
    customers: 26,
    loanValue: "₹6.8Cr",
  },
  {
    name: "Arjun K.",
    initials: "AK",
    tier: "Silver tier",
    customers: 11,
    loanValue: "₹1.9Cr",
  },
  {
    name: "Nithya R.",
    initials: "NR",
    tier: "Gold tier",
    customers: 19,
    loanValue: "₹4.5Cr",
  },
];

function AdminAgents() {
  return (
    <div className="UserDashboard">
      <div className="dashboard-layout">
        {/* <Sidebar user={admin} sections={adminMenuSections} role="admin" /> */}

        <main className="dashboard-content">
        

          <div className="card-grid">
            {agents.map((agent) => (
              <div className="profile-card" key={agent.name}>
                <div className="profile-top">
                  <div className="avatar-circle">{agent.initials}</div>
                  <div>
                    <h4>{agent.name}</h4>
                    <p className="sub-text">
                      Agent · {agent.tier}
                    </p>
                  </div>
                </div>

                <div className="profile-stats">
                  <div>
                    <strong>{agent.customers}</strong>
                    <span>Customers</span>
                  </div>
                  <div>
                    <strong className="green">{agent.loanValue}</strong>
                    <span>Loan value</span>
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

export default AdminAgents;
