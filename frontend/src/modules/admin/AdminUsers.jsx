import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";
import "../../Styles/AdminDashboard.css";

const STATUS_STYLE = {
  "Verified":    { background: "#e7f6ed", color: "#1e8e3e" },
  "Pending KYC": { background: "#fff4e5", color: "#e37400" },
};

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:5000/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allUsers = Array.isArray(res.data) ? res.data : res.data.users || [];
      // Only show non-admin users
      setUsers(allUsers.filter((u) => u.role !== "admin"));
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const getInitials = (user) => {
    const f = user.firstname?.[0] || "";
    const l = user.lastname?.[0] || "";
    return (f + l).toUpperCase() || "U";
  };

  const filteredUsers = users.filter((u) =>
    !searchTerm ||
    `${u.firstname} ${u.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="dashboard-main"><p>Loading users...</p></div>;

  return (
    <div className="dashboard-main">
      <div className="admin-table-header">
        <h3>Users ({users.length})</h3>
        <input
          className="apps-search"
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-scroll">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No users found</td></tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="table-name-cell">
                      <div className="table-avatar">{getInitials(user)}</div>
                      <span>{user.firstname} {user.lastname}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone || "—"}</td>
                  <td>{user.gender || "—"}</td>
                  <td>
                    <span className="table-status-pill" style={STATUS_STYLE["Verified"]}>
                      {user.role || "user"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
