import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import logo from "../../assets/logo.png";
import AgentDashboard from "./AgentDashboard";
import { getUser, logoutUser } from "../../utils/auth";
import "../../styles/Header.css";
import axios from "axios";

const AGENT_NAV_LINKS = [
  { label: "Lead Details",           href: "/agent/dashboard" },
  { label: "Application Submission", href: "/agent/applications" },
  { label: "Doc Action",             href: "/agent/docaction" },
];

function AgentHeader() {
   const [agentUser, setAgentUser] = useState(null);
const [loading, setLoading] = useState(true);

const navigate = useNavigate();

const getAgent = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem("mlrr_user"));
    const id = userData?.id;

    if (!id) {
      console.warn("No user ID found");
      navigate("/login");
      return;
    }

    const token = localStorage.getItem("mlrr_token");

    const res = await axios.get(
      `http://localhost:5000/api/agent/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setAgentUser(res.data);
    console.log("Agent Data Response:", res.data);

    
  } catch (err) {
    console.error("Failed to fetch agent data", err);
    
    // Optional: redirect if unauthorized
    if (err.response?.status === 401) {
      navigate("/login");
    }

  } finally {
    setLoading(false);
  }
};

useEffect(() => {
 // console.log("Agent User State Updated:", agentUser);
  getAgent();
}, []);

useEffect(() => {
  console.log("✅ AgentUser updated:", agentUser);
}, [agentUser]);


const agent = {
  name: agentUser
    ? `${agentUser.firstname} ${agentUser.lastname}`
    : "Agent",
  email: agentUser?.email || "",
  phone: agentUser?.phone || "",
  gender: agentUser?.gender || "",
  loansgiven: agentUser?.loansgiven || 0,
  photo: null,
};


  const [showProfile, setShowProfile] = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showProfile ? "hidden" : "auto";
  }, [showProfile]);

  const handleLogout = () => {
    logoutUser();
    navigate("/agent");
  };

  const initials = agent.name
    .split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      <header className={`hdr-main ${scrolled ? "hdr-main--scrolled" : ""}`}>
        <div className="hdr-inner">

          {/* Logo */}
          <div className="hdr-logo" style={{ cursor: "default" }}>
            <Image src={logo} alt="MLRR" height={52} width={52} />
            <div className="hdr-logo-text">
              <span className="hdr-logo-name">MLRR</span>
              <span className="hdr-logo-sub">Agent Portal</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hdr-nav">
            {AGENT_NAV_LINKS.map(link => (
              <a
                key={link.label}
                className="hdr-nav-link"
                href={link.href}
                onClick={e => { e.preventDefault(); navigate(link.href); }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hdr-actions">
            <span className="hdr-agent-name">{agent.name}</span>
            <div
              className="hdr-avatar-initials"
              onClick={() => setShowProfile(true)}
              title="View profile"
            >
              {initials}
            </div>
            <button className="hdr-btn hdr-btn--ghost" onClick={handleLogout}>
              Logout
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className={`hdr-hamburger ${menuOpen ? "hdr-hamburger--open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="hdr-mobile-menu">
            {AGENT_NAV_LINKS.map(link => (
              <a
                key={link.label}
                className="hdr-mobile-link"
                href={link.href}
                onClick={e => { e.preventDefault(); navigate(link.href); setMenuOpen(false); }}
              >
                {link.label}
              </a>
            ))}
            <div className="hdr-mobile-actions">
              <button className="hdr-btn hdr-btn--ghost w-100" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Profile Modal */}
      {showProfile && (
        <div className="overlay" onClick={() => setShowProfile(false)}>
          <div onClick={e => e.stopPropagation()}>
          <AgentDashboard
            agent={{
              id: agentUser?._id,
              name: `${agentUser?.firstname || ""} ${agentUser?.lastname || ""}`,
              email: agentUser?.email || "",
              phone: agentUser?.phone || "",
              gender: agentUser?.gender || "",
              address: agentUser?.address || "",
              loansGiven: agentUser?.loansgiven || 0,
              photo: agentUser?.profilePhoto || "https://via.placeholder.com/100",
            }}
            closeModal={() => setShowProfile(false)}
            onUpdated={() => getAgent()}
          />


          </div>
        </div>
      )}
    </>
  );
}

export default AgentHeader;
