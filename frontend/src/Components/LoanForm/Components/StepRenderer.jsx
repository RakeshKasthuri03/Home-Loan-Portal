import React from "react";
import FormField from "./FormField";
import "./LoanForm.css";

const StepRenderer = ({ step, formData, onChange, errors }) => {
  return (
    <div className="lf-step-body">
      <div className="lf-step-header">
        <h3 className="lf-step-title">{step.title}</h3>
        <p className="lf-step-subtitle">{step.subtitle}</p>
      </div>

      <div className="lf-fields-grid">
        {step.fields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={formData[field.name]}
            onChange={onChange}
            error={errors[field.name]}
          />
        ))}
      </div>
    </div>
  );
};

export default StepRenderer;
