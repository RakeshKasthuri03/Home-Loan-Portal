import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import logo from "../../assets/logo.png";
import AgentDashboard from "./AgentDashboard";
import "../../Components/Header.css";


/* ✅ Safe localStorage reader */
const getAgentFromStorage = () => {
  return {
    
    name: "Arun Kumar",
    email: "arun.kumar@loanportal.com",
    gender: "Male",
    phone: "+91 98765 43210",
    address: "Coimbatore, Tamil Nadu",
    loansGiven: 42,
    photo: "https://via.placeholder.com/100",
  };
};

const AGENT_NAV_LINKS = [
  { label: "Lead Details", href: "/leaddetails" },
  { label: "Application Submission", href: "/appsub" },
  { label: "Doc Action", href: "/docaction" },
];

function AgentHeader() {
  const navigate = useNavigate();

  const [agent, setAgent] = useState(getAgentFromStorage());
  const [showProfile, setShowProfile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
 const [showLogin, setShowLogin] = useState(false);

  /* ✅ Protect route */



  /* ✅ Scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ✅ Body scroll lock */
  useEffect(() => {
    document.body.style.overflow = showProfile ? "hidden" : "auto";
  }, [showProfile]);

  return (
    <>
      {/* ── TOP BAR ───────────────────────────────── */}
      <div className="hdr-topbar">
        <div className="hdr-topbar-inner">
          <div className="hdr-topbar-left">
            <span>📞 +91 98485 70949</span>
            <span className="hdr-topbar-divider" />
            <span>✉️ mlrrhomeloan@gmail.com</span>
          </div>
          <div className="hdr-topbar-right">
            <span>Agent Panel</span>
          </div>
        </div>
      </div>

      {/* ── MAIN HEADER ───────────────────────────── */}
      <header className={`hdr-main ${scrolled ? "hdr-main--scrolled" : ""}`}>
        <div className="hdr-inner">

          {/* Logo */}
          <div className="hdr-logo" onClick={() => navigate("/agent")}>
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
                onClick={e => {
                  e.preventDefault();
                  navigate(link.href);
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* ✅ DESKTOP ACTIONS */}
          <div className="hdr-actions">

            {/* Notifications */}
            <div className="hdr-notification">
              <span className="hdr-bell">🔔</span>
              {agent.notifications > 0 && (
                <span className="hdr-notification-badge">
                  {agent.notifications}
                </span>
              )}
            </div>

            {/* Agent Name */}
            <span className="hdr-agent-name">
              {agent.name || "Agent"}
            </span>

            {/* Profile Image */}
            <Image
              src={agent.photo || logo}
              alt="Agent Profile"
              width={38}
              height={38}
              roundedCircle
              className="hdr-avatar"
              onClick={() => setShowProfile(true)}
            />
          </div>

          {/* Mobile Hamburger */}
          <button
            className={`hdr-hamburger ${menuOpen ? "hdr-hamburger--open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* ── MOBILE MENU ───────────────────────── */}
        {menuOpen && (
          <div className="hdr-mobile-menu">
            {AGENT_NAV_LINKS.map(link => (
              <a
                key={link.label}
                className="hdr-mobile-link"
                href={link.href}
                onClick={e => {
                  e.preventDefault();
                  navigate(link.href);
                  setMenuOpen(false);
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ── PROFILE MODAL ───────────────────────── */}
      {showProfile && (
        <div className="overlay" onClick={() => setShowProfile(false)}>
          <div onClick={e => e.stopPropagation()}>
            <AgentDashboard
            agent={agent}
              closeModal={() => setShowProfile(false)}
              onProfileUpdate={() => setAgent(getAgentFromStorage())}
            />
          </div>
        </div>
      )}
    
    
  

    </>
  );
}

export default AgentHeader;