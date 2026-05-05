import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import logo from "../../assets/logo.png";
import AgentDashboard from "./AgentDashboard";
import { getUser, logoutUser } from "../../utils/auth";
import "../../Components/Header.css";

const AGENT_NAV_LINKS = [
  { label: "Lead Details",           href: "/agent/dashboard" },
  { label: "Application Submission", href: "/agent/applications" },
  { label: "Doc Action",             href: "/agent/docaction" },
];

function AgentHeader() {
  const navigate  = useNavigate();
  const agentUser = getUser();

  const agent = {
    name:  agentUser?.name  || "Agent",
    email: agentUser?.email || "",
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

          {/* Logo — goes to home, not agent login */}
          <div className="hdr-logo" onClick={() => navigate("/")}>
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
              agent={{ ...agent, photo: "https://via.placeholder.com/100", gender: "—", phone: agentUser?.mobile || "—", address: "—", loansGiven: 0 }}
              closeModal={() => setShowProfile(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default AgentHeader;
