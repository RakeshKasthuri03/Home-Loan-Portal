import { NavLink, useNavigate } from "react-router-dom";
import "../../Styles/Sidebar.css";

export default function Sidebar({
  user,
  sections = [],
  role = "user",
  basePath = "",   // ✅ ADD THIS
}) {
  const navigate = useNavigate();

  const generateInitials = (fullName) => {
    if (!fullName) return "";
    const names = fullName.trim().split(" ");
    return names.length >= 2
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : names[0][0].toUpperCase();
  };

  // ✅ Builds absolute path safely
  const resolvePath = (to) => {
    if (!to) return basePath;
    if (to.startsWith("/")) return to;
    return `${basePath}/${to}`.replace(/\/+/g, "/");
  };

  return (
    <aside className="sidebar">
      <div className="user-card">
        <div className="avatar">{generateInitials(user.name)}</div>
        <h4>{user.name}</h4>
        <p>{user.email}</p>
        <span className="badge">
          {role === "admin" ? "Administrator" : "✔ Verified customer"}
        </span>
      </div>

      <div className="menu">
        {sections.map((section) => (
          <div key={section.heading}>
            <h5>{section.heading}</h5>

            {section.items.map((item) => (
              <NavLink
                key={item.label}
                to={resolvePath(item.to)}
                end={item.to}
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
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
            onClick={() => navigate("/loan-types")}
          >
            Apply for a New Loan →
          </button>
        )}
      </div>
    </aside>
  );
}