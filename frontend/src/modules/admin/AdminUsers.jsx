import React, { useState } from "react";
import "../../Styles/AdminDashboard.css";

const INITIAL_USERS = [
  { id: 1, name: "Rahul Nani",  initials: "RN", status: "Verified",    applications: 2, approved: "₹42L", amountToPay: "₹3.2L"  },
  { id: 2, name: "Ananya Rao",  initials: "AR", status: "Pending KYC", applications: 1, approved: "—",    amountToPay: "—"       },
  { id: 3, name: "Vijay Kumar", initials: "VK", status: "Verified",    applications: 3, approved: "₹35L", amountToPay: "₹28.4L" },
  { id: 4, name: "Preethi M.",  initials: "PM", status: "Verified",    applications: 2, approved: "₹80L", amountToPay: "₹61.5L" },
  { id: 5, name: "Suresh Raj",  initials: "SR", status: "Verified",    applications: 1, approved: "₹42L", amountToPay: "₹38.1L" },
];

const STATUS_STYLE = {
  "Verified":    { background: "#e7f6ed", color: "#1e8e3e" },
  "Pending KYC": { background: "#fff4e5", color: "#e37400" },
};

function AdminUsers() {
  const [users, setUsers] = useState(INITIAL_USERS);

  const removeUser  = (id) => setUsers((prev) => prev.filter((u) => u.id !== id));
  const verifyUser  = (id) => setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: "Verified" } : u));

  return (
    <div className="dashboard-main">

      <div className="admin-table-header">
        <h3>Users</h3>
        <input className="apps-search" type="text" placeholder="Search users..." />
      </div>

      <div className="admin-table-wrap">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Applications</th>
              <th>Approved Amount</th>
              <th>Amount to Pay</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="table-name-cell">
                    <div className="table-avatar">{user.initials}</div>
                    <span>{user.name}</span>
                  </div>
                </td>
                <td>
                  <div className="status-cell">
                    <span className="table-status-pill" style={STATUS_STYLE[user.status] || {}}>
                      {user.status}
                    </span>
                    {user.status === "Pending KYC" && (
                      <button className="update-row-btn" onClick={() => verifyUser(user.id)}>
                        Update
                      </button>
                    )}
                  </div>
                </td>
                <td>{user.applications}</td>
                <td className="green">{user.approved}</td>
                <td>{user.amountToPay}</td>
                <td>
                  <button className="remove-row-btn" onClick={() => removeUser(user.id)}>
                    Remove User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default AdminUsers;
