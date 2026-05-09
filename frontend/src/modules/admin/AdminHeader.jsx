import { useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import { FiLogOut } from "react-icons/fi";
import logo from "../../assets/logo.png";
import { logoutUser } from "../../utils/auth";
import "../../styles/Header.css";
import "../../styles/AdminHeader.css";

function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/admin");
  };

  return (
    <header className="hdr-main">
      <div className="hdr-inner">

        {/* LOGO — no routing, just branding */}
        <div className="hdr-logo" style={{ cursor: "default" }}>
          <Image src={logo} alt="MLRR" height={44} />
          <div className="hdr-logo-text">
            <span className="hdr-logo-name">MLRR</span>
            <span className="hdr-logo-sub">Admin Portal</span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="hdr-actions">
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut size={16} style={{ marginRight: 6 }} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
