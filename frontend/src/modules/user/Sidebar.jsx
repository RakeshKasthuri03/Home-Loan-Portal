import { NavLink, useNavigate } from "react-router-dom";
import "../../styles/Sidebar.css";
import Upload from "../../Components/Upload/Upload";
import axios from "axios";
import { getToken } from "../../utils/auth";

export default function Sidebar({ user, sections = [], role = "user", onProfileUpdated }) {
  const navigate = useNavigate();

  // Use the user prop passed from UserDashboard (which fetches from backend)
  const displayUser = user || { name: 'User' };
  const initials = displayUser?.name
    ? displayUser.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const profilePhoto = displayUser?.profilePhoto || null;

  const handleUploaded = async (res) => {
    // server may return updated user in res.user or a file/url in other keys
    console.log('Upload result in Sidebar.handleUploaded:', res);
    const updated = res?.user;
    let url = res?.url || res?.file?.url || res?.doc?.url || (res?.user && res.user.profilePhoto) || null;

    // Normalize relative upload paths to absolute URL for dev server
    if (url && typeof url === 'string' && url.startsWith('/')) {
      const base = import.meta?.env?.VITE_API_BASE || 'http://localhost:5000';
      url = `${base}${url}`;
    }

    if (updated) {
      // Update user in backend
      try {
        const token = getToken();
        if (token && displayUser?._id) {
          const response = await axios.put(
            `http://localhost:5000/user/${displayUser._id}`,
            updated,
            { headers: { authorization: `Bearer ${token}` } }
          );
          if (onProfileUpdated) onProfileUpdated(response.data.user || updated);
        }
      } catch (err) {
        console.error("Failed to update user profile:", err);
      }
      return;
    }

    if (url) {
      const newUser = { ...(displayUser || {}), profilePhoto: url };
      // Update user profile photo in backend
      try {
        const token = getToken();
        if (token && displayUser?._id) {
          const response = await axios.put(
            `http://localhost:5000/user/${displayUser._id}`,
            { profilePhoto: url },
            { headers: { authorization: `Bearer ${token}` } }
          );
          if (onProfileUpdated) onProfileUpdated(response.data.user || newUser);
        }
      } catch (err) {
        console.error("Failed to update profile photo:", err);
      }
    }
  };  return (
    <aside className="sidebar">

      {/* User card */}
      <div className="user-card">
        <div className="avatar" style={{ position: 'relative' }}>
          {profilePhoto ? (
            <img src={profilePhoto} alt="avatar" style={{ width: 70, height:70, borderRadius:50, objectFit:'cover' }} />
          ) : (
            initials
          )}
          {role !== 'admin' && (
            <span style={{ position: 'absolute', right: -6, bottom: -6 }}>
              <Upload
                uploadUrl="/api/upload"
                fieldName="file"
                accept="image/*"
                purpose="profile"
                userId={displayUser?._id}
                onUploaded={handleUploaded}
                compact={true}
              />
            </span>
          )}
        </div>
        <h4>{displayUser?.name || role}</h4>
        <p>{displayUser?.email}</p>
        <span className="badge">
          {role === "admin" ? "Administrator" : "✔ Verified"}
        </span>

        {/* Upload control for profile photo */}
      </div>

      {/* Nav */}
      <div className="menu">
        {sections.map((section) => (
          <div key={section.heading}>
            <h5>{section.heading}</h5>
            {section.items.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === "/dashboard"}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span>{item.label}</span>
                {item.badge && <span>{item.badge}</span>}
              </NavLink>
            ))}
          </div>
        ))}

        {role === "user" && (
          <button
            className="primary-btn"
            style={{ marginTop: "12px", width: "100%", fontSize: "0.85rem" }}
            onClick={() => navigate("/loan-types")}
          >
            Apply for a New Loan →
          </button>
        )}
      </div>

      {/* Back to home */}
      <div className="sidebar-home-link" onClick={() => navigate("/")}>
        ← Back to Home
      </div>

    </aside>
  );
}