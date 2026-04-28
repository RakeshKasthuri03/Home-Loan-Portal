import { useState } from "react";
import userPhoto from "../../../assets/user.png";

export default function Profile({ user }) {
  const [activeTab, setActiveTab] = useState("personal"); // Default tab
  const [isEditing, setIsEditing] = useState({});
  const [formData, setFormData] = useState({
    fullName: "Visthargalla Manohar",
    email: "manohar@gmail.com",
    password: "••••••••",
    mobileNo: "9876543210",
    nationality: "Indian",
    panCard: "ABCDE1234F",
    aadharCard: "[Aadhaar Redacted]", // Security placeholder
  });

  const personalDetailsFields = [
    { label: "Full Name", key: "fullName", type: "text", editable: true },
    { label: "Email Address", key: "email", type: "email", editable: true },
    { label: "Mobile Number", key: "mobileNo", type: "tel", editable: true },
    { label: "Nationality", key: "nationality", type: "text", editable: true },
    { label: "PAN Card", key: "panCard", type: "text", editable: false, masked: true },
    { label: "Aadhar Card", key: "aadharCard", type: "text", editable: false, masked: true },
  ];

  const loanDetails = [
    { label: "Total Applications", value: "4", icon: "📋" },
    { label: "Under Review", value: "2", icon: "⏳" },
    { label: "Approved Amount", value: "₹42L", icon: "✅" },
    { label: "Active Application", value: "HLP-2025-00142", icon: "🏷️" },
  ];

  const handleEdit = (key) => {
    setIsEditing(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const maskValue = (value) => {
    if (!value) return "";
    return value.slice(-4).padStart(value.length, "*");
  };

  return (
    <div className="profile-main-container">
      {/* Compact Header Section */}
      <div className="profile-header-section">
        <div className="profile-header-content">
          <div className="profile-avatar-container">
            <div className="profile-avatar-mini">
              <img src={userPhoto} alt="Profile" />
              <div className="online-status"></div>
            </div>
          </div>
          <div className="profile-header-info">
            <div className="user-title-row">
                <h1>{formData.fullName}</h1>
                <span className="user-status-badge">Verified</span>
            </div>
            <p className="user-id">User ID: <strong>USR-00142</strong></p>
          </div>
        </div>

        {/* Tab Navigation Inside Header */}
        <div className="profile-tabs-nav">
          <button
            className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            👤 Personal Info
          </button>
          <button
            className={`tab-btn ${activeTab === 'loans' ? 'active' : ''}`}
            onClick={() => setActiveTab('loans')}
          >
            📊 Loan Summary
          </button>
          <button
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Account Settings
          </button>
        </div>
      </div>

      {/* Dynamic Content Area */}
      <div className="profile-content-container">
        {activeTab === 'personal' && (
          <div className="tab-panel profile-card fade-in">
            <div className="card-body">
              <div className="details-table">
                {personalDetailsFields.map((field) => (
                  <div key={field.key} className="detail-row">
                    <div className="detail-label">{field.label}</div>
                    <div className="detail-value-wrapper">
                      {isEditing[field.key] ? (
                        <div className="edit-mode">
                          <input
                            type={field.type}
                            value={formData[field.key]}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            className="edit-input"
                          />
                          <button className="save-icon-btn" onClick={() => handleEdit(field.key)}>✓</button>
                        </div>
                      ) : (
                        <div className="view-mode">
                          <span className="value-text">
                            {field.masked ? maskValue(formData[field.key]) : formData[field.key]}
                          </span>
                          {field.editable && (
                            <button className="edit-icon-small" onClick={() => handleEdit(field.key)}>✏️</button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'loans' && (
          <div className="tab-panel profile-card fade-in">
            <div className="card-body">
              <div className="loan-grid">
                {loanDetails.map((loan, index) => (
                  <div key={index} className="loan-item">
                    <div className="loan-icon">{loan.icon}</div>
                    <div className="loan-info">
                      <p className="loan-label">{loan.label}</p>
                      <p className="loan-value">{loan.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="tab-panel profile-card fade-in">
            <div className="card-body">
              <div className="settings-list">
                <button className="setting-btn">
                  <span className="setting-icon">🔐</span>
                  <span className="setting-text">Change Password</span>
                  <span className="arrow">›</span>
                </button>
                <button className="setting-btn">
                  <span className="setting-icon">📧</span>
                  <span className="setting-text">Verify Email</span>
                  <span className="arrow">›</span>
                </button>
                <button className="setting-btn danger">
                  <span className="setting-icon">🚪</span>
                  <span className="setting-text">Logout</span>
                  <span className="arrow">›</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}