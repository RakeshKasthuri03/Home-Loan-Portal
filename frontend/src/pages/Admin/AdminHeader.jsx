import { useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import { FiSettings, FiUser, FiLogOut, FiUserPlus } from "react-icons/fi";
import logo from "../../assets/logo.png";
import "../../Components/Header.css";
import "../../Styles/AdminHeader.css";

function AdminHeader() {
  const navigate = useNavigate();

  return (
    <header className="hdr-main">
      <div className="hdr-inner">

        {/* LOGO */}
        <div className="hdr-logo" onClick={() => navigate("/admin")}>
          <Image src={logo} alt="MLRR" height={44} />
          <div className="hdr-logo-text">
            <span className="hdr-logo-name">MLRR</span>
            <span className="hdr-logo-sub">Admin Portal</span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="hdr-actions">

          <button
            className="primary-btn bg-primary"
            onClick={() => navigate("/admin/agents")}
          >
            <FiUserPlus size={16} style={{ marginRight: 6 }} />
            Add Agent
          </button>

          <button
            className="icon-btn"
            onClick={() => navigate("/admin/settings")}
            title="Settings"
          >
            <FiSettings size={18} />
          </button>

          <button
            className="icon-btn"
            onClick={() => navigate("/admin/profile")}
            title="Account"
          >
            <FiUser size={18} />
          </button>

          <button
            className="logout-btn bg-primary primary-btn"
            onClick={() => navigate("/login")}
          >
            <FiLogOut size={16} style={{ marginRight: 6 }} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;