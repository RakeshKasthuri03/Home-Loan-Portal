import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import logo from '../assets/logo.png';

import Login from '../modules/user/Login';
import SignUp from '../modules/user/SignUp';

import { getUser, logoutUser } from '../utils/auth';
import '../Styles/Header.css';

const NAV_LINKS = [
  { label: 'About Us',    href: '/' },
  { label: 'Loans',       href: '/loan-types' },
  { label: 'Calculators', href: '/calculator' },
  { label: 'Contact Us',  href: '/contact' },
];

function Header() {
  const navigate = useNavigate();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode]           = useState('login');
  const [scrolled, setScrolled]           = useState(false);
  const [menuOpen, setMenuOpen]           = useState(false);
  const [user, setUser]                   = useState(getUser());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
    setUser(getUser());
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate('/');
  };

  return (
    <>
      <header className={`hdr-main ${scrolled ? 'hdr-main--scrolled' : ''} ${menuOpen ? 'hdr-main--open' : ''}`}>
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
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                className="hdr-nav-link"
                href={link.href}
                onClick={
                  link.href.startsWith('/')
                    ? e => { e.preventDefault(); navigate(link.href); }
                    : undefined
                }
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hdr-actions">
            {user ? (
              <>
                <button
                  className="hdr-btn hdr-btn--ghost"
                  onClick={() => {
                    if (user.role === "admin") navigate("/admin/dashboard");
                    else if (user.role === "agent") navigate("/agent/dashboard");
                    else navigate("/dashboard");
                  }}
                >
                  My Dashboard
                </button>
                <button className="hdr-btn hdr-btn--ghost" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <button className="hdr-btn hdr-btn--ghost" onClick={openLogin}>
                Sign In
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={`hdr-hamburger ${menuOpen ? 'hdr-hamburger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="hdr-mobile-menu">
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                className="hdr-mobile-link"
                href={link.href}
                onClick={e => {
                  if (link.href.startsWith('/')) {
                    e.preventDefault();
                    navigate(link.href);
                  }
                  setMenuOpen(false);
                }}
              >
                {link.label}
              </a>
            ))}

            <div className="hdr-mobile-actions">
              {user ? (
                <>
                  <button
                    className="hdr-btn hdr-btn--ghost w-100"
                    onClick={() => {
                      setMenuOpen(false);
                      if (user.role === 'admin') navigate('/admin/dashboard');
                      else if (user.role === 'agent') navigate('/agent/dashboard');
                      else navigate('/dashboard');
                    }}
                  >
                    My Dashboard
                  </button>
                  <button
                    className="hdr-btn hdr-btn--ghost w-100"
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  className="hdr-btn hdr-btn--ghost w-100"
                  onClick={() => {
                    setMenuOpen(false);
                    openLogin();
                  }}
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="overlay">
          {authMode === 'login' && (
            <Login
              closeModal={handleCloseModal}
              openRegister={() => setAuthMode('signup')}
            />
          )}
          {authMode === 'signup' && (
            <SignUp
              closeModal={handleCloseModal}
              openLogin={() => setAuthMode('login')}
            />
          )}
        </div>
      )}
    </>
  );
}

export default Header;
