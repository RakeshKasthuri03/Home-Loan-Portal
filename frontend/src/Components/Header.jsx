import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import logo from '../assets/logo.png';
import Login from '../pages/auth/Login';
import { getUser, logoutUser } from '../utils/auth';
import './Header.css';

const NAV_LINKS = [
  { label: 'Loans',       href: '/loan-types' },
  { label: 'Calculators', href: '#calculators' },
  { label: 'About Us',    href: '#key-benefits' },
  { label: 'Contact Us',  href: '#contact' },
];

function Header() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [user, setUser]           = useState(getUser());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Refresh user state when login modal closes
  const handleCloseModal = () => {
    setShowLogin(false);
    setUser(getUser());
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate('/');
  };

  return (
    <>
      {/* ── TOP BAR ──────────────────────────────────────────────────────── */}
      <div className="hdr-topbar">
        <div className="hdr-topbar-inner">
          <div className="hdr-topbar-left">
            <span>📞 +91 98485 70949</span>
            <span className="hdr-topbar-divider" />
            <span>✉️ mlrrhomeloan@gmail.com</span>
          </div>
          <div className="hdr-topbar-right">
            <span>⏰ Mon – Sat, 9 AM – 6 PM</span>
            <span className="hdr-topbar-divider" />
            <span>🇮🇳 India</span>
          </div>
        </div>
      </div>

      {/* ── MAIN NAV ─────────────────────────────────────────────────────── */}
      <header className={`hdr-main ${scrolled ? 'hdr-main--scrolled' : ''}`}>
        <div className="hdr-inner">

          {/* Logo */}
          <div className="hdr-logo" onClick={() => navigate('/')}>
            <Image src={logo} alt="MLRR" height={52} width={52} />
            <div className="hdr-logo-text">
              <span className="hdr-logo-name">MLRR</span>
              <span className="hdr-logo-sub">Home Loans</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hdr-nav">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                className="hdr-nav-link"
                href={link.href}
                onClick={link.href.startsWith('/') ? (e) => { e.preventDefault(); navigate(link.href); } : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hdr-actions">
            {user ? (
              <>
                <button className="hdr-btn hdr-btn--ghost" onClick={() => navigate('/dashboard')}>
                  My Dashboard
                </button>
                <button className="hdr-btn hdr-btn--ghost" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <button className="hdr-btn hdr-btn--ghost" onClick={() => setShowLogin(true)}>
                Sign In
              </button>
            )}
            <button className="hdr-btn hdr-btn--primary" onClick={() => navigate('/loan-types')}>
              Apply Now
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`hdr-hamburger ${menuOpen ? 'hdr-hamburger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* ── MOBILE MENU ──────────────────────────────────────────────── */}
        {menuOpen && (
          <div className="hdr-mobile-menu">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                className="hdr-mobile-link"
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith('/')) { e.preventDefault(); navigate(link.href); }
                  setMenuOpen(false);
                }}
              >
                {link.label}
              </a>
            ))}
            <div className="hdr-mobile-actions">
              <button className="hdr-btn hdr-btn--ghost w-100" onClick={() => { setShowLogin(true); setMenuOpen(false); }}>
                Sign In
              </button>
              <button className="hdr-btn hdr-btn--primary w-100" onClick={() => { navigate('/loan-types'); setMenuOpen(false); }}>
                Apply Now
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Login Modal */}
      {showLogin && (
        <div className="login-overlay">
          <Login closeModal={handleCloseModal} />
        </div>
      )}
    </>
  );
}

export default Header;
