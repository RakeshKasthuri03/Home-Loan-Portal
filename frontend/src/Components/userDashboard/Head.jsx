import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../utils/auth";

export default function Head({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h3 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>🏠 MLRR Home Loans</h3>
      </div>

      <div className="header-right">
        <span className="notify-dot" />
        <button className="primary-btn" onClick={() => navigate("/loan-types")}>
          + New application
        </button>
        <div className="header-user">
          <div className="header-avatar">{initials}</div>
          <div className="header-user-info">
            <span className="header-user-name">{user?.name || "User"}</span>
            <span className="header-user-email">{user?.email}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          ⎋ Logout
        </button>
      </div>
    </header>
  );
}
