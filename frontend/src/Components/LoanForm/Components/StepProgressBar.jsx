import React from "react";
import "./LoanForm.css";

const StepProgressBar = ({ steps, currentStep }) => {
  return (
    <div className="lf-progress">
      {steps.map((step, index) => {
        const status =
          index < currentStep
            ? "completed"
            : index === currentStep
            ? "active"
            : "pending";

        return (
          <React.Fragment key={index}>
            <div className={`lf-step lf-step--${status}`}>
              <div className="lf-step-circle">
                {status === "completed" ? (
                  <span>✓</span>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className="lf-step-label">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`lf-step-line ${status === "completed" ? "lf-step-line--done" : ""}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepProgressBar;
