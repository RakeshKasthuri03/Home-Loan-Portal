import React, { useState } from "react";
import Sidebar from "../../Components/userDashboard/Sidebar";
import "../../Styles/AdminDashboard.css"

import {
  admin,
  adminMenuSections,
  adminApplicationsData,
} from "../../utils/AdminUtils";

function AdminApplications() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredApplications =
    activeTab === "All"
      ? adminApplicationsData
      : adminApplicationsData.filter(
          (app) => app.status === activeTab
        );

  return (
    <div className="UserDashboard">
      <div className="dashboard-layout">
        {/* <Sidebar
          user={admin}
          sections={adminMenuSections}
          role="admin"
        /> */}

        <main className="dashboard-content">
          {/* Search */}
          <div className="admin-app-header">
            <input
              type="text"
              className="apps-search"
              placeholder="Search by name / ID..."
            />
          </div>

          {/* Tabs */}
          <div className="apps-tabs">
            {["All", "Pending", "Review", "Approved", "Rejected"].map(
              (tab) => (
                <button
                  key={tab}
                  className={`tab ${
                    activeTab === tab ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          {/* Applications Table */}
          <table className="apps-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Loan type</th>
                <th>Amount</th>
                <th>Agent</th>
                <th>Applied</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app.id}>
                  <td className="link">
                    {app.id} · {app.name}
                  </td>
                  <td>{app.loanType}</td>
                  <td>{app.amount}</td>
                  <td>{app.officer}</td>
                  <td>{app.applied}</td>
                  <td>
                    <span
                      className={`status ${app.status.toLowerCase()}`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td>
                    {app.status === "Review" ? (
                      <>
                        <button className="approve">Approve</button>
                        <button className="reject">Reject</button>
                      </>
                    ) : app.status === "Pending" ? (
                      <span className="link-only">Assign</span>
                    ) : (
                      <span className="link-only">View</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}

export default AdminApplications;
