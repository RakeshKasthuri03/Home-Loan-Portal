import React, { useState, useRef, useEffect } from "react";
import { FiUserPlus } from "react-icons/fi";
import "../../Styles/AdminDashboard.css";
import { useNavigate } from "react-router-dom";

const INITIAL_AGENTS = [
  { id: 1, name: "Karthik Patel", initials: "KP", tier: "Gold",     customers: 18, loanValue: "₹4.2Cr" },
  { id: 2, name: "Meena I.",      initials: "MI", tier: "Silver",   customers: 14, loanValue: "₹2.1Cr" },
  { id: 3, name: "Sundar R.",     initials: "SR", tier: "Gold",     customers: 21, loanValue: "₹5.0Cr" },
  { id: 4, name: "Priya S.",      initials: "PS", tier: "Platinum", customers: 26, loanValue: "₹6.8Cr" },
  { id: 5, name: "Arjun K.",      initials: "AK", tier: "Silver",   customers: 11, loanValue: "₹1.9Cr" },
  { id: 6, name: "Nithya R.",     initials: "NR", tier: "Gold",     customers: 19, loanValue: "₹4.5Cr" },
];

const TIERS = ["Silver", "Gold", "Platinum"];

const TIER_STYLE = {
  Platinum: { background: "#f3e8ff", color: "#6f42c1" },
  Gold:     { background: "#fff8e1", color: "#b45309" },
  Silver:   { background: "#f1f5f9", color: "#475569" },
};

function TierDropdown({ agentId, currentTier, onUpdate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="tier-dropdown-wrap" ref={ref}>
      <button className="update-row-btn" onClick={() => setOpen((o) => !o)}>
        Update ▾
      </button>
      {open && (
        <div className="tier-dropdown-menu">
          {TIERS.map((tier) => (
            <button
              key={tier}
              className={`tier-option ${tier === currentTier ? "tier-option--active" : ""}`}
              onClick={() => { onUpdate(agentId, tier); setOpen(false); }}
            >
              <span className="tier-dot" style={{ background: TIER_STYLE[tier]?.color }} />
              {tier}
              {tier === currentTier && <span className="tier-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminAgents() {

   const navigate = useNavigate();
  const [agents, setAgents] = useState(INITIAL_AGENTS);

  const removeAgent = (id) => setAgents((prev) => prev.filter((a) => a.id !== id));
  const updateTier  = (id, tier) => setAgents((prev) => prev.map((a) => a.id === id ? { ...a, tier } : a));
  const handelagentform = () => {
   navigate("/admin/form");

  }
  return (
    <div className="dashboard-main">

      <div className="admin-table-header">
        <h3>Agents</h3>
        <div className="admin-table-actions">
          <input className="apps-search" type="text" placeholder="Search agents..." />
          <button className="add-agent-btn" onClick={handelagentform}>
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
              <th>Tier</th>
              <th>Customers</th>
              <th>Loan Value</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id}>
                <td>
                  <div className="table-name-cell">
                    <div className="table-avatar">{agent.initials}</div>
                    <span>{agent.name}</span>
                  </div>
                </td>
                <td>
                  <div className="tier-cell">
                    <span className="table-status-pill" style={TIER_STYLE[agent.tier] || {}}>
                      {agent.tier}
                    </span>
                    <TierDropdown
                      agentId={agent.id}
                      currentTier={agent.tier}
                      onUpdate={updateTier}
                    />
                  </div>
                </td>
                <td>{agent.customers}</td>
                <td className="green">{agent.loanValue}</td>
                <td>
                  <button className="remove-row-btn" onClick={() => removeAgent(agent.id)}>
                    Remove Agent
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

export default AdminAgents;
