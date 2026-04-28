import { NavLink, useNavigate } from "react-router-dom";
import "../../Styles/Sidebar.css";

export default function Sidebar({ user, sections = [] }) {
  const navigate = useNavigate();

  const generateInitials = (fullName) => {
    if (!fullName) return "";
    const names = fullName.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return names[0].charAt(0).toUpperCase();
  };

  return (
    <aside className="sidebar">
      {/* Home link at top-left */}
      <div className="sidebar-home-link" onClick={() => navigate("/")}>
        🏠 <span>Back to Home</span>
      </div>

      <div className="user-card">
        <div className="avatar">{generateInitials(user.name)}</div>
        <h4>{user.name}</h4>
        <p>{user.email}</p>
        <span className="badge">✔ Verified customer</span>
      </div>

      <div className="menu">
        {sections.map((section) => (
          <div key={section.heading}>
            <h5>{section.heading}</h5>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span>{item.label}</span>
                {item.badge ? <span>{item.badge}</span> : null}
              </NavLink>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}