import React, { useState } from "react";
import { LOAN_TYPES } from "../Config/loanTypeConfig";
import LoanApplicationContainer from "../Container/LoanApplicationContainer";
import Header from "../../Header";
import Footer from "../../Footer";
import "../Components/LoanForm.css";

const LoanApply = () => {
  const [selectedType, setSelectedType] = useState(null);

  return (
    <>
      <div className="lf-page">
        <div className="lf-page-header">
          <h1>Apply for a Home Loan</h1>
          <p>Simple, fast, and transparent — get started in minutes</p>
        </div>

        {/* Loan Type Selector */}
        <div className="lf-type-selector">
          {Object.values(LOAN_TYPES).map((loan) => (
            <div
              key={loan.key}
              className={`lf-type-card ${selectedType === loan.key ? "lf-type-card--active" : ""}`}
              onClick={() => {
                setSelectedType(loan.key);
                window.scrollTo({ top: 200, behavior: "smooth" });
              }}
            >
              <span className="lf-type-icon">{loan.icon}</span>
              <span className="lf-type-label">{loan.label}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        {selectedType ? (
          <LoanApplicationContainer loanTypeKey={selectedType} />
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
