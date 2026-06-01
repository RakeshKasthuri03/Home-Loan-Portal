import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { LOAN_TYPES } from "../../utils/loanTypeConfig";
import LoanApplicationContainer from "./LoanApplicationContainer";
import { isLoggedIn } from "../../utils/auth";
import Login from "../user/Login";
import SignUp from "../user/SignUp";
import "./LoanForm.css";

const LoanApply = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [showAuthModal, setShowAuthModal] = useState(!isLoggedIn());
  const [authMode, setAuthMode] = useState('login');

  useEffect(() => {
    if (!loggedIn) {
      setShowAuthModal(true);
    }
  }, [loggedIn]);

  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam && LOAN_TYPES[typeParam]) {
      setSelectedType(typeParam);
    }
  }, [searchParams]);

  const handleCloseModal = () => {
    setShowAuthModal(false);
    setAuthMode('login');
    setLoggedIn(isLoggedIn());
  };

  const handleLoginSuccess = () => {
    setLoggedIn(true);
    setShowAuthModal(false);
  };

  if (!loggedIn) {
    return (
      <div className="lf-page">
        <div className="lf-auth-warning">
          <p>Please login to continue your loan application.</p>
          <button className="btn-primary" onClick={() => setShowAuthModal(true)}>
            Sign In
          </button>
        </div>
        {showAuthModal && (
          <div className="overlay">
            {authMode === 'login' ? (
              <Login
                closeModal={handleCloseModal}
                openRegister={() => setAuthMode('signup')}
                onLoginSuccess={handleLoginSuccess}
              />
            ) : (
              <SignUp
                closeModal={handleCloseModal}
                openLogin={() => setAuthMode('login')}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="lf-page">
      {selectedType ? (
        <>
          <div className="lf-selected-type">
            <span>Applying for: <strong>{LOAN_TYPES[selectedType]?.label}</strong></span>
            <button className="lf-change-btn" onClick={() => navigate('/loan-types')}>
              Change
            </button>
          </div>
          <LoanApplicationContainer loanTypeKey={selectedType} />
        </>
      ) : (
        <div style={{ textAlign: "center", color: "#6b7280", marginTop: 8, fontSize: "0.95rem" }}>
          👆 Select a loan type above to begin your application
        </div>
      )}
    </div>
  );
};

export default LoanApply;
