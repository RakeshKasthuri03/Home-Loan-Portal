import { useState, useEffect, useCallback } from "react";
import { LOAN_TYPES } from "../../utils/loanTypeConfig";
import { FIELD_VALIDATORS } from "../../Validations/LoanValidation";
import StepProgressBar from "./StepProgressBar";
import StepRenderer from "./StepRenderer";
import { createApplication, saveProgress, submitApplication } from "../../utils/loanApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoanForm.css";

const LoanApplicationContainer = ({ loanTypeKey }) => {
  const loanConfig = LOAN_TYPES[loanTypeKey];
  const steps = loanConfig.steps;

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(""); // "saving", "saved", "error"
  const [isInitialized, setIsInitialized] = useState(false);

  // Create application on first load or resume existing draft
  useEffect(() => {
    const initApplication = async () => {
      // Prevent multiple initializations
      if (isInitialized || applicationId) return;
      
      if (loanTypeKey) {
        const result = await createApplication(loanTypeKey);
        if (result.success) {
          const app = result.data.application;
          setApplicationId(app._id);
          
          if (app.applicationId) {
            setRefNumber(app.applicationId);
          }
          
          // If existing draft, restore the form data
          if (result.data.isExisting) {
            console.log("Resuming existing draft:", app._id);
            
            // Restore form data from all sections
            const restoredData = {};
            
            // Flatten nested objects back to form fields
            if (app.basicDetails) Object.assign(restoredData, app.basicDetails);
            if (app.coApplicant) Object.assign(restoredData, app.coApplicant);
            if (app.employmentDetails) Object.assign(restoredData, app.employmentDetails);
            if (app.financialDetails) Object.assign(restoredData, app.financialDetails);
            if (app.propertyDetails) Object.assign(restoredData, app.propertyDetails);
            if (app.plotDetails) Object.assign(restoredData, app.plotDetails);
            if (app.renovationDetails) Object.assign(restoredData, app.renovationDetails);
            if (app.balanceTransferDetails) Object.assign(restoredData, app.balanceTransferDetails);
            if (app.documents) Object.assign(restoredData, app.documents);
            if (app.consent) Object.assign(restoredData, app.consent);
            
            setFormData(restoredData);
            setCurrentStep(app.currentStep || 0);
          } else {
            console.log("New application created:", app._id);
          }
          
          setIsInitialized(true);
        } else {
          console.error("Failed to create/load application:", result.error);
        }
      }
    };
    initApplication();
  }, [loanTypeKey, isInitialized, applicationId]);

  // Auto-save function
  const autoSave = useCallback(async () => {
    if (!applicationId || Object.keys(formData).length === 0) return;
    
    setIsSaving(true);
    setSaveStatus("saving");
    
    const result = await saveProgress(applicationId, formData, currentStep);
    
    if (result.success) {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 2000);
    } else {
      setSaveStatus("error");
      console.error("Auto-save failed:", result.error);
    }
    
    setIsSaving(false);
  }, [applicationId, formData, currentStep]);

  // Auto-save when step changes or after typing stops
  useEffect(() => {
    const timer = setTimeout(() => {
      if (applicationId && Object.keys(formData).length > 0) {
        autoSave();
      }
    }, 2000); // Auto-save 2 seconds after last change

    return () => clearTimeout(timer);
  }, [formData, autoSave]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const step = steps[currentStep];
    const newErrors = {};
    step.fields.forEach((field) => {
      const val = formData[field.name];
      if (field.required) {
        if (field.type === "checkbox") {
          if (!val) { newErrors[field.name] = `${field.label} — consent is required`; return; }
        } else if (!val || (typeof val === "string" && val.trim() === "")) {
          newErrors[field.name] = `${field.label} is required`;
          return;
        }
      }
      // Pattern validation
      if (val && field.pattern && FIELD_VALIDATORS[field.pattern]) {
        const err = FIELD_VALIDATORS[field.pattern](val);
        if (err) newErrors[field.name] = err;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validate()) {
      // Save progress before moving to next step
      if (applicationId) {
        await saveProgress(applicationId, formData, currentStep + 1);
      }
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const handleBack = () => { setCurrentStep((s) => s - 1); window.scrollTo({ top: 0, behavior: "smooth" }); };
  
  const handleSubmit = async () => {
    if (validate()) {
      setIsSaving(true);
      
      // First save the final data
      await saveProgress(applicationId, formData, currentStep);
      
      // Then submit the application
      const result = await submitApplication(applicationId);
      
      if (result.success) {
        setRefNumber(result.data.application.applicationId || applicationId);
        setSubmitted(true);
        toast.success("🎉 Application submitted successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.log("Application submitted:", result.data);
      } else {
        setErrors({ submit: result.error || "Failed to submit application" });
        toast.error(result.error || "❌ Failed to submit application. Please try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.error("Submit error:", result.error);
      }
      
      setIsSaving(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Count filled required fields across all steps
  const totalRequired = steps.flatMap(s => s.fields.filter(f => f.required)).length;
  const totalFilled   = steps.flatMap(s => s.fields.filter(f => f.required && formData[f.name] && formData[f.name] !== "")).length;
  const progressPct   = Math.round((totalFilled / totalRequired) * 100);

  if (submitted) {
    return (
      <div className="lf-card">
        <ToastContainer />
        <div className="lf-success">
          <div className="lf-success-icon">🎉</div>
          <h2>Application Submitted!</h2>
          <p>
            Thank you for applying for a <strong>{loanConfig.label}</strong>.<br />
            Our team will review your application and contact you within 2 business days.
          </p>
          <div className="lf-ref-box">Ref: {refNumber}</div>
          <br />
          <button className="lf-btn lf-btn--next" onClick={() => { 
            setSubmitted(false); 
            setCurrentStep(0); 
            setFormData({}); 
            setErrors({}); 
            setApplicationId(null);
            setRefNumber("");
            setIsInitialized(false); // Allow creating new application
          }}>
            Apply for Another Loan
          </button>
        </div>
      </div>
    );
  }

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="lf-layout">
      {/* Toast Container for notifications */}
      <ToastContainer />

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

        {/* Save status indicator */}
        {saveStatus && (
          <div className={`lf-save-status lf-save-status--${saveStatus}`}>
            {saveStatus === "saving" && "💾 Saving..."}
            {saveStatus === "saved" && "✅ Saved"}
            {saveStatus === "error" && "❌ Save failed"}
          </div>
        )}

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

          {/* Review summary on last (consent) step */}
          {isLastStep && (
            <div className="lf-review-summary">
              <h4 className="lf-review-title">📋 Review Your Application</h4>
              <p className="lf-review-subtitle">Please review all details before signing and submitting.</p>
              {steps.slice(0, -1).map((step, si) => {
                const filledFields = step.fields.filter(f => f.type !== "file" && formData[f.name]);
                if (filledFields.length === 0) return null;
                return (
                  <div key={si} className="lf-review-section">
                    <div className="lf-review-section-title">{step.title}</div>
                    <div className="lf-review-fields">
                      {filledFields.map(f => (
                        <div key={f.name} className="lf-review-field">
                          <span className="lf-review-label">{f.label}</span>
                          <span className="lf-review-value">
                            {typeof formData[f.name] === "boolean"
                              ? (formData[f.name] ? "Yes" : "No")
                              : formData[f.name]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
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

