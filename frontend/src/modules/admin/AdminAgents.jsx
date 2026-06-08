import React, { useState, useEffect } from "react";
import { FiUserPlus } from "react-icons/fi";
import "../../Styles/AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "../../utils/auth";

function AdminAgents() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAgents = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:5000/api/agent", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data) ? res.data : res.data.agents || [];
      setAgents(data);
    } catch (err) {
      console.error("Failed to fetch agents:", err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchAgents(); }, []);

  const removeAgent = async (id) => {
    if (!window.confirm("Are you sure you want to remove this agent?")) return;
    try {
      const token = getToken();
      await axios.delete(`http://localhost:5000/api/agent/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAgents();
    } catch (err) {
      alert("Failed to remove agent");
    }
  };

  const getInitials = (agent) => {
    const name = agent.name || agent.firstname || "";
    const parts = name.split(" ");
    return (parts[0]?.[0] || "") + (parts[1]?.[0] || "").toUpperCase() || "A";
  };

  const filteredAgents = agents.filter((a) =>
    !searchTerm ||
    (a.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.agentid || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="dashboard-main"><p>Loading agents...</p></div>;

  return (
    <div className="dashboard-main">
      <div className="admin-table-header">
        <h3>Agents ({agents.length})</h3>
        <div className="admin-table-actions">
          <input
            className="apps-search"
            type="text"
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="add-agent-btn" onClick={() => navigate("/admin/form")}>
            <FiUserPlus size={14} style={{ marginRight: 6 }} />
            Add Agent
          </button>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Agent ID</th>
              <th>Email</th>
              <th>Phone</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredAgents.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No agents found</td></tr>
            ) : (
              filteredAgents.map((agent) => (
                <tr key={agent._id}>
                  <td>
                    <div className="table-name-cell">
                      <div className="table-avatar">{getInitials(agent)}</div>
                      <span>{agent.name || `${agent.firstname || ""} ${agent.lastname || ""}`}</span>
                    </div>
                  </td>
                  <td>{agent.agentid || "—"}</td>
                  <td>{agent.email || "—"}</td>
                  <td>{agent.phone || "—"}</td>
                  <td>
                    <button className="remove-row-btn" onClick={() => removeAgent(agent._id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminAgents;
