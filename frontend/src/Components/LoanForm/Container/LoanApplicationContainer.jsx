import React, { useState } from "react";
import { LOAN_TYPES } from "../Config/loanTypeConfig";
import StepProgressBar from "../Components/StepProgressBar";
import StepRenderer from "../Components/StepRenderer";
import "../Components/LoanForm.css";

const generateRef = () =>
  "MLRR" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);

const LoanApplicationContainer = ({ loanTypeKey }) => {
  const loanConfig = LOAN_TYPES[loanTypeKey];
  const steps = loanConfig.steps;

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [refNumber] = useState(generateRef);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const step = steps[currentStep];
    const newErrors = {};
    step.fields.forEach((field) => {
      if (field.required) {
        const val = formData[field.name];
        if (!val || (typeof val === "string" && val.trim() === "")) {
          newErrors[field.name] = `${field.label} is required`;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = () => {
    if (validate()) {
      console.log("Form submitted:", formData);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (submitted) {
    return (
      <div className="lf-card">
        <div className="lf-success">
          <div className="lf-success-icon">🎉</div>
          <h2>Application Submitted!</h2>
          <p>
            Thank you for applying for a <strong>{loanConfig.label}</strong>.
            <br />
            Our team will review your application and contact you within 2 business days.
          </p>
          <div className="lf-ref-box">Ref: {refNumber}</div>
          <br />
          <button
            className="lf-btn lf-btn--next"
            onClick={() => {
              setSubmitted(false);
              setCurrentStep(0);
              setFormData({});
              setErrors({});
            }}
          >
            Apply for Another Loan
          </button>
        </div>
      </div>
    );
  }

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="lf-card">
      <StepProgressBar steps={steps} currentStep={currentStep} />

      <StepRenderer
        step={steps[currentStep]}
        formData={formData}
        onChange={handleChange}
        errors={errors}
      />

      <div className="lf-nav">
        {currentStep > 0 ? (
          <button className="lf-btn lf-btn--back" onClick={handleBack}>
            ← Back
          </button>
        ) : (
          <span />
        )}

        <span className="lf-step-count">
          Step {currentStep + 1} of {steps.length}
        </span>

        {isLastStep ? (
          <button className="lf-btn lf-btn--submit" onClick={handleSubmit}>
            Submit Application ✓
          </button>
        ) : (
          <button className="lf-btn lf-btn--next" onClick={handleNext}>
            Next →
          </button>
        )}
      </div>
    </div>
  );
};

export default LoanApplicationContainer;
