import { NavLink, useNavigate } from "react-router-dom";
import "../../Styles/Sidebar.css";

export default function Sidebar({ user, sections = [], role = "user" }) {
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <aside className="sidebar">

      {/* User card */}
      <div className="user-card">
        <div className="avatar">{initials}</div>
        <h4>{user?.name || "User"}</h4>
        <p>{user?.email}</p>
        <span className="badge">
          {role === "admin" ? "Administrator" : "✔ Verified"}
        </span>
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
          <button className="primary-btn" style={{ marginTop: "12px", width: "100%", fontSize: "0.85rem" }} onClick={() => navigate("/loan-types")}>
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
