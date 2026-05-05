import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { LOAN_TYPES } from "../../utils/loanTypeConfig";
import LoanApplicationContainer from "../../Components/LoanForm/Container/LoanApplicationContainer";
import { isLoggedIn } from "../../utils/auth";
import "../../Components/LoanForm/Styles/LoanForm.css";

const LoanApply = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);

  // Redirect to login if not signed in
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam && LOAN_TYPES[typeParam]) {
      setSelectedType(typeParam);
    }
  }, [searchParams]);

  if (!isLoggedIn()) return null;

  return (
    <>
      <div className="lf-page">
        <div className="lf-page-header">
          <h1>Apply for a Home Loan</h1>
          <p>Simple, fast, and transparent — get started in minutes</p>
        </div>

        {/* Form */}
        {selectedType ? (
          <>
            {/* Show selected loan type with option to change */}
            <div className="lf-selected-type">
              <span>Applying for: <strong>{LOAN_TYPES[selectedType]?.label}</strong></span>
              <button
                className="lf-change-btn"
                onClick={() => navigate('/loan-types')}
              >
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
    </>
  );
};

export default LoanApply;
