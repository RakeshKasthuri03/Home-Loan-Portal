import { useState, useEffect, useCallback, useRef } from "react";
import { LOAN_TYPES } from "../../utils/loanTypeConfig";
import { FIELD_VALIDATORS } from "../../Validations/LoanValidation";
import StepProgressBar from "./StepProgressBar";
import StepRenderer from "./StepRenderer";
import { createApplication, saveProgress, submitApplication, uploadLoanDocument, getMyApplications } from "../../utils/loanApi";
import notify from "../../utils/notify";
import "./LoanForm.css";

const LoanApplicationContainer = ({ loanTypeKey }) => {
  const loanConfig = LOAN_TYPES[loanTypeKey];
  const steps = loanConfig.steps;

  // Use ref to track if restriction check has started
  const checkStarted = useRef(false);

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [refNumber, setRefNumber] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [applicationId, setApplicationId] = useState(null); // Don't load from localStorage initially
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(""); // "saving", "saved", "error"
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isCheckingRestriction, setIsCheckingRestriction] = useState(true);

  // ✅ Only save applicationId to localStorage AFTER it's created (not on load)
  useEffect(() => {
    if (applicationId) {
      localStorage.setItem(`app_${loanTypeKey}`, JSON.stringify(applicationId));
    }
  }, [applicationId, loanTypeKey]);

  // ✅ Check for restrictions on load (without creating application)
  useEffect(() => {
    const checkRestrictions = async () => {
      if (checkStarted.current) return;
      checkStarted.current = true;
      
      setIsCheckingRestriction(true);
      
      try {
        // First check if there's an existing draft in localStorage for THIS loan type
        const storedAppId = localStorage.getItem(`app_${loanTypeKey}`);
        
        if (storedAppId) {
          // User has a draft for this loan type - try to resume it via API
          console.log('📂 Found stored applicationId, calling API to verify/resume...');
          const result = await createApplication(loanTypeKey);
          
          if (result.success) {
            const app = result.data.application;
            setApplicationId(app._id);
            if (app.applicationId) setRefNumber(app.applicationId);
            
            // Restore form data if resuming
            if (result.data.isExisting) {
              console.log("✅ Resuming existing draft:", app._id);
              const restoredData = {};
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
            }
            setIsInitialized(true);
          } else if (result.statusCode === 403) {
            // User has a DIFFERENT loan type active - show restriction
            handleRestrictionError(result);
          } else {
            // Some other error - clear stale localStorage and let user start fresh
            localStorage.removeItem(`app_${loanTypeKey}`);
            setIsInitialized(true);
          }
        } else {
          // No stored application - check if user has ANY active application
          const appsResult = await getMyApplications();
          
          if (appsResult.success) {
            const activeApp = appsResult.data.applications?.find(app => 
              ['draft', 'submitted', 'under_review', 'documents_pending'].includes(app.status)
            );
            
            if (activeApp && activeApp.loanType !== loanTypeKey) {
              // User has a different loan type active - block them
              const errorMsg = `You already have a ${activeApp.loanType} application in progress (Status: ${activeApp.status}). Please complete or close it before applying for another loan.`;
              setInitError(errorMsg);
              notify.error(errorMsg, { position: "top-right", duration: 7000 });
            } else {
              // No blocking application - user can proceed
              setIsInitialized(true);
            }
          } else {
            // Couldn't check - let them proceed (backend will catch it)
            setIsInitialized(true);
          }
        }
      } catch (error) {
        console.error("Check restrictions error:", error);
        setIsInitialized(true); // Let them try, backend will validate
      } finally {
        setIsCheckingRestriction(false);
      }
    };
    
    checkRestrictions();
  }, [loanTypeKey]);

  const handleRestrictionError = (result) => {
    const existing = result.existingApplication;
    const errorMsg = `You already have a ${existing?.loanType} application in progress (Status: ${existing?.status}). Please complete or close it before applying for another loan.`;
    setInitError(errorMsg);
    localStorage.removeItem(`app_${loanTypeKey}`);
    notify.error(errorMsg, { position: "top-right", duration: 7000 });
  };

  // Auto-save function (only runs if we have an applicationId)
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

  // Auto-save when step changes or after typing stops (only if applicationId exists)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (applicationId && Object.keys(formData).length > 0) {
        autoSave();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData, autoSave, applicationId]);

  const handleChange = async (name, value) => {
    if (value instanceof File) {
      setUploadingFiles((prev) => ({ ...prev, [name]: true }));
      const uploadResult = await uploadLoanDocument(value, name);
      setUploadingFiles((prev) => ({ ...prev, [name]: false }));

      if (uploadResult.success) {
        const url = uploadResult.data?.url || uploadResult.data?.file?.url || uploadResult.data?.doc?.url;
        if (url) {
          setFormData((prev) => ({ ...prev, [name]: url }));
          if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
          return;
        }
      }

      setErrors((prev) => ({
        ...prev,
        [name]: uploadResult.error || 'Unable to upload file. Please try again.',
      }));
      return;
    }

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

  // ✅ Create application when user completes FIRST STEP (not on page load)
  const handleNext = async () => {
    if (validate()) {
      setIsSaving(true);
      
      // If on first step and no applicationId yet, create the application now
      if (currentStep === 0 && !applicationId) {
        const result = await createApplication(loanTypeKey);
        
        if (result.success) {
          const app = result.data.application;
          setApplicationId(app._id);
          if (app.applicationId) setRefNumber(app.applicationId);
          
          // Save the first step data
          await saveProgress(app._id, formData, 1);
          
          notify.success("Application created! Your progress will be auto-saved.", { position: "top-right", duration: 3000 });
        } else if (result.statusCode === 403) {
          // Restriction - user has another loan type active
          handleRestrictionError(result);
          setIsSaving(false);
          return; // Don't proceed to next step
        } else {
          notify.error(result.error || "Failed to create application", { position: "top-right", duration: 5000 });
          setIsSaving(false);
          return;
        }
      } else if (applicationId) {
        // Save progress for subsequent steps
        await saveProgress(applicationId, formData, currentStep + 1);
      }
      
      setIsSaving(false);
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
        
        // ✅ NEW: Clear localStorage after successful submission
        localStorage.removeItem(`app_${loanTypeKey}`);
        
        notify.success("🎉 Application submitted successfully!", { position: "top-right", duration: 5000 });
        console.log("Application submitted:", result.data);
      } else {
        setErrors({ submit: result.error || "Failed to submit application" });
        notify.error(result.error || "❌ Failed to submit application. Please try again.", { position: "top-right", duration: 5000 });
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

  // Show loading while checking restrictions
  if (isCheckingRestriction) {
    return (
      <div className="lf-card">
        {/* Toaster handled globally in App.jsx */}
        <div style={{
          padding: '60px',
          textAlign: 'center',
          color: '#666'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '20px' }}>⏳</div>
          <p>Checking eligibility...</p>
        </div>
      </div>
    );
  }

  // Show error if application couldn't be loaded (restriction)
  if (initError) {
    return (
      <div className="lf-card">
        {/* Toaster handled globally in App.jsx */}
        <div style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#fff3cd',
          border: '2px solid #ff6b6b',
          borderRadius: '8px',
          color: '#d32f2f'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⛔</div>
          <h2 style={{ color: '#d32f2f', marginBottom: '15px' }}>Application Not Available</h2>
          <p style={{ fontSize: '16px', marginBottom: '20px', lineHeight: '1.6' }}>
            {initError}
          </p>
          <button
            className="lf-btn lf-btn--primary"
            onClick={() => window.location.href = '/dashboard'}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="lf-card">
        {/* Toaster handled globally in App.jsx */}
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
      {/* Toaster handled globally in App.jsx */}

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
            uploadingFiles={uploadingFiles}
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

