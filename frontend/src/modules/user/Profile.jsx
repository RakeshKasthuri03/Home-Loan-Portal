import { useState, useEffect } from "react";
import userPhoto from "../../assets/user.png";
import axios from "axios";
import { getToken } from "../../utils/auth";
import { clearAuth } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Profile({ user, applications = [], onProfileUpdated }) {
  const [activeTab, setActiveTab] = useState("personal"); // Default tab
  const [isEditing, setIsEditing] = useState({});
  const [formData, setFormData] = useState({...user});
  const [saving, setSaving] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [pwdForm, setPwdForm] = useState({ newPassword: "", confirmPassword: "" });
  const navigate = useNavigate();

  useEffect(() => {
    setFormData({ ...user });
  }, [user]);

  const personalDetailsFields = [
    { label: "Full Name", key: "firstName", backendKey: "firstname", type: "text", editable: true },
    { label: "Email Address", key: "email", backendKey: "email", type: "email", editable: true },
    { label: "Mobile Number", key: "phone", backendKey: "phone", type: "tel", editable: true },
    { label: "Gender", key: "gender", backendKey: "gender", type: "text", editable: true },
  ];

  // Compute real loan summary from applications prop
  const totalApps = applications?.length || 0;
  const underReviewCount = applications.filter(a => ["submitted","under_review"].includes(a.status)).length;
  const approvedApp = applications.find(a => a.status === 'approved' || a.status === 'disbursed');
  const approvedAmount = approvedApp?.sanctionedDetails?.sanctionedAmount || approvedApp?.financialDetails?.loanAmount || 0;
  const activeApp = applications.find(a => ["submitted","under_review","documents_pending","approved","disbursed"].includes(a.status));

  const loanDetails = [
    { label: "Total Applications", value: String(totalApps), icon: "📋" },
    { label: "Under Review", value: String(underReviewCount), icon: "⏳" },
    { label: "Approved Amount", value: approvedAmount ? `₹${Number(approvedAmount).toLocaleString('en-IN')}` : "—", icon: "✅" },
    { label: "Active Application", value: activeApp?.applicationId || "—", icon: "🏷️" },
  ];

  const handleEdit = (key) => {
    setIsEditing(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (field) => {
    setSaving(true);
    try {
      const token = getToken();
      if (token && user?._id) {
        // Map frontend key to backend key
        const updateData = { [field.backendKey]: formData[field.key] };
        const response = await axios.put(
          `http://localhost:5000/user/${user._id}`,
          updateData,
          { headers: { authorization: `Bearer ${token}` } }
        );
        console.log("Profile updated:", response.data);
        // Notify parent to refresh user data
        if (onProfileUpdated && response.data.user) {
          onProfileUpdated(response.data.user);
        }
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setSaving(false);
      setIsEditing(prev => ({ ...prev, [field.key]: false }));
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const handlePasswordChange = async () => {
    if (!pwdForm.newPassword || pwdForm.newPassword !== pwdForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/forgot-password', {
        email: formData.email,
        newPassword: pwdForm.newPassword,
        confirmPassword: pwdForm.confirmPassword
      });
      alert(response.data?.message || 'Password updated');
      setShowChangePassword(false);
      setPwdForm({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Password change error', err);
      alert(err.response?.data?.message || 'Failed to change password');
    }
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
              <img src={formData.profilePhoto || userPhoto} alt="Profile" />

              
              <div className="online-status"></div>
            </div>
          </div>
          <div className="profile-header-info">
            <div className="user-title-row">
                <h1>{formData.firstName} {formData.lastName}</h1>
                <span className="user-status-badge">Verified</span>
            </div>
            <p className="user-id"><strong>{formData.userId} </strong></p>
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
                            value={formData[field.key] || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            className="edit-input"
                            disabled={saving}
                          />
                          <button 
                            className="save-icon-btn" 
                            onClick={() => handleSave(field)}
                            disabled={saving}
                          >
                            {saving ? '...' : '✓'}
                          </button>
                        </div>
                      ) : (
                        <div className="view-mode">
                          <span className="value-text">
                            {field.masked ? maskValue(formData[field.key]) : (formData[field.key] || '-')}
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
              <div className="user-loan-grid">
                {loanDetails.map((loan, index) => (
                  <div key={index} className="user-loan-item">
                    <div className="user-loan-icon">{loan.icon}</div>
                    <div className="user-loan-info">
                      <p className="user-loan-label">{loan.label}</p>
                      <p className="user-loan-value">{loan.value}</p>
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
                <button className="setting-btn" onClick={() => setShowChangePassword(true)}>
                  <span className="setting-icon">🔐</span>
                  <span className="setting-text">Change Password</span>
                  <span className="arrow">›</span>
                </button>
                <button className="setting-btn" onClick={() => alert('A verification link has been sent to your email (stub).')}>
                  <span className="setting-icon">📧</span>
                  <span className="setting-text">Verify Email</span>
                  <span className="arrow">›</span>
                </button>
                <button className="setting-btn danger" onClick={handleLogout}>
                  <span className="setting-icon">🚪</span>
                  <span className="setting-text">Logout</span>
                  <span className="arrow">›</span>
                </button>
              </div>
                {showChangePassword && (
                  <div style={{ marginTop: 12, padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff' }}>
                    <h4 style={{ marginTop: 0 }}>Change Password</h4>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <input type="password" placeholder="New password" value={pwdForm.newPassword} onChange={e => setPwdForm(p => ({ ...p, newPassword: e.target.value }))} className="lt-input" />
                      <input type="password" placeholder="Confirm password" value={pwdForm.confirmPassword} onChange={e => setPwdForm(p => ({ ...p, confirmPassword: e.target.value }))} className="lt-input" />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="lt-btn lt-btn--primary" onClick={handlePasswordChange}>Save</button>
                      <button className="lt-btn" onClick={() => setShowChangePassword(false)}>Cancel</button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
