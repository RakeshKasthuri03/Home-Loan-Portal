import React from "react";
import Sidebar from "../../Components/userDashboard/Sidebar";
import "../../Styles/AdminDashboard.css"
import {
  admin,
  adminMenuSections,
  adminDashboardData,
} from "../../utils/AdminUtils";




function AdminDashboard() {
  return (
    <>
    
   
   
    <div className="UserDashboard">
      <div className="dashboard-layout">
        
        {/* ✅ SIDEBAR — OUTSIDE MAIN */}
        {/* <Sidebar
          user={admin}
          sections={adminMenuSections}
          role="admin"
        /> */}

        {/* ✅ MAIN CONTENT */}
        <main className="dashboard-content">
          {/* Header */}
          

          {/* ✅ STATS CARDS */}
          <div className="stats admin-stats">
            {adminDashboardData.stats.map((card) => (
              <div
              className="user-stat-card admin-stat-card"
              key={card.title}
              >
                {card.badge && (
                  <span className={`admin-badge ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                )}

                <h4>{card.title}</h4>
                <div className={`stat-number ${card.textColor || ""}`}>
                  {card.value}
                </div>
              </div>
            ))}
          </div>

          {/* =============================
    LOAN TYPE CONFIGURATION
    ============================= */}
<div className="loan-config-section">
  <div className="loan-config-header">
    <h3>Loan type configuration</h3>
    <button className="link-btn">+ Add loan type</button>
  </div>

  <table className="loan-config-table">
    <thead>
      <tr>
        <th>Loan type</th>
        <th>Interest rate</th>
        <th>Max amount</th>
        <th>Max tenure</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>
          <span className="loan-dot blue"></span> Home loan
        </td>
        <td className="blue-text">8.5% p.a.</td>
        <td>₹5 Cr</td>
        <td>30 years</td>
        <td><span className="status active">Active</span></td>
        <td><button className="edit-btn-link">Edit rate</button></td>
      </tr>

      <tr>
        <td>
          <span className="loan-dot green"></span> Plot loan
        </td>
        <td className="green">9.0% p.a.</td>
        <td>₹3 Cr</td>
        <td>20 years</td>
        <td><span className="status active">Active</span></td>
        <td><button className="edit-btn-link">Edit rate</button></td>
      </tr>

      <tr>
        <td>
          <span className="loan-dot orange"></span> Renovation loan
        </td>
        <td className="orange">9.5% p.a.</td>
        <td>₹50 L</td>
        <td>15 years</td>
        <td><span className="status active">Active</span></td>
        <td><button className="edit-btn-link">Edit rate</button></td>
      </tr>

      <tr>
        <td>
          <span className="loan-dot purple"></span> NRI loan
        </td>
        <td className="purple">8.8% p.a.</td>
        <td>₹5 Cr</td>
        <td>25 years</td>
        <td><span className="status active">Active</span></td>
        <td><button className="edit-btn-link">Edit rate</button></td>
      </tr>
    </tbody>
  </table>
</div>
        </main>
      </div>
    </div>
    </>
  );
}

export default AdminDashboard;