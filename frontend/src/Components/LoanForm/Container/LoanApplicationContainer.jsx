import React, { useState } from "react";
import { LOAN_TYPES } from "../../../utils/loanTypeConfig";
import StepProgressBar from "../Steps/StepProgressBar";
import StepRenderer from "../Steps/StepRenderer";
import "../Styles/LoanForm.css";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
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
    if (validate()) { setCurrentStep((s) => s + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };
  const handleBack = () => { setCurrentStep((s) => s - 1); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const handleSubmit = () => {
    if (validate()) { console.log("Form submitted:", formData); setSubmitted(true); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };

  // Count filled required fields across all steps
  const totalRequired = steps.flatMap(s => s.fields.filter(f => f.required)).length;
  const totalFilled   = steps.flatMap(s => s.fields.filter(f => f.required && formData[f.name] && formData[f.name] !== "")).length;
  const progressPct   = Math.round((totalFilled / totalRequired) * 100);

  if (submitted) {
    return (
      <div className="lf-card">
        <div className="lf-success">
          <div className="lf-success-icon">🎉</div>
          <h2>Application Submitted!</h2>
          <p>
            Thank you for applying for a <strong>{loanConfig.label}</strong>.<br />
            Our team will review your application and contact you within 2 business days.
          </p>
          <div className="lf-ref-box">Ref: {refNumber}</div>
          <br />
          <button className="lf-btn lf-btn--next" onClick={() => { setSubmitted(false); setCurrentStep(0); setFormData({}); setErrors({}); }}>
            Apply for Another Loan
          </button>
        </div>
      </div>
    );
  }

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="lf-layout">

      {/* ── SIDEBAR CHECKLIST ──────────────────────────────────────────── */}
      <aside className={`lf-sidebar ${sidebarOpen ? "lf-sidebar--open" : ""}`}>
        <div className="lf-sidebar-header">
          <span>📋 Application Checklist</span>
          <button className="lf-sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <div className="lf-sidebar-progress">
          <div className="lf-sidebar-progress-bar">
            <div className="lf-sidebar-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <span>{progressPct}% complete · {totalFilled}/{totalRequired} fields filled</span>
        </div>

        {steps.map((step, si) => {
          const isStepDone    = si < currentStep;
          const isStepCurrent = si === currentStep;
          const requiredFields = step.fields.filter(f => f.required);
          const filledCount    = requiredFields.filter(f => formData[f.name] && formData[f.name] !== "").length;

          return (
            <div key={si} className={`lf-checklist-step ${isStepCurrent ? "lf-checklist-step--active" : ""} ${isStepDone ? "lf-checklist-step--done" : ""}`}>
              <div className="lf-checklist-step-header">
                <span className="lf-checklist-num">
                  {isStepDone ? "✓" : si + 1}
                </span>
                <div>
                  <div className="lf-checklist-title">{step.title}</div>
                  {!isStepDone && (
                    <div className="lf-checklist-count">{filledCount}/{requiredFields.length} required fields</div>
                  )}
                </div>
              </div>

              {/* Show field list for current and upcoming steps */}
              {(isStepCurrent || (!isStepDone && si === currentStep + 1)) && (
                <ul className="lf-checklist-fields">
                  {step.fields.map((f) => {
                    const filled = formData[f.name] && formData[f.name] !== "";
                    return (
                      <li key={f.name} className={filled ? "lf-field-done" : f.required ? "lf-field-required" : "lf-field-optional"}>
                        <span>{filled ? "✓" : f.required ? "•" : "○"}</span>
                        {f.label}
                        {!f.required && <span className="lf-optional-tag">optional</span>}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}

        {/* Documents needed summary */}
        <div className="lf-sidebar-docs">
          <div className="lf-sidebar-docs-title">📎 Documents needed</div>
          {steps.flatMap(s => s.fields.filter(f => f.type === "file")).map(f => (
            <div key={f.name} className="lf-sidebar-doc-item">
              {formData[f.name] ? "✅" : f.required ? "📄" : "📋"} {f.label}
              {!f.required && <span className="lf-optional-tag">optional</span>}
            </div>
          ))}
        </div>
      </aside>

      {/* ── MAIN FORM ──────────────────────────────────────────────────── */}
      <div className="lf-main">

        {/* Checklist toggle button */}
        <button className="lf-checklist-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          📋 View Checklist
          <span className="lf-toggle-badge">{progressPct}%</span>
        </button>

        <div className="lf-card">
          {/* Progress fill bar */}
          <div className="lf-progress-fill-bar">
            <div className="lf-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>

          <StepProgressBar steps={steps} currentStep={currentStep} />

          {/* Next step hint */}
          {!isLastStep && (
            <div className="lf-next-hint">
              Next: <strong>{steps[currentStep + 1].title}</strong> — {steps[currentStep + 1].subtitle}
            </div>
          )}

          <StepRenderer
            step={steps[currentStep]}
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />

          <div className="lf-nav">
            {currentStep > 0 ? (
              <button className="lf-btn lf-btn--back" onClick={handleBack}>← Back</button>
            ) : <span />}

            <span className="lf-step-count">Step {currentStep + 1} of {steps.length}</span>

            {isLastStep ? (
              <button className="lf-btn lf-btn--submit" onClick={handleSubmit}>Submit Application ✓</button>
            ) : (
              <button className="lf-btn lf-btn--next" onClick={handleNext}>Save & Continue →</button>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && <div className="lf-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default LoanApplicationContainer;
