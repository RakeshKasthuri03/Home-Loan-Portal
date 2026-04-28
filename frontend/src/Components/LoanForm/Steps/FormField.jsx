import React from "react";
import "../Styles/LoanForm.css";

const FormField = ({ field, value, onChange, error, fullWidth }) => {
  const { name, label, type, required, placeholder, options, accept } = field;

  const baseClass = `lf-input ${error ? "lf-input--error" : ""}`;

  const handleChange = (e) => {
    if (type === "file") {
      onChange(name, e.target.files[0]);
    } else {
      onChange(name, e.target.value);
    }
  };

  const renderInput = () => {
    switch (type) {
      case "select":
        return (
          <select className={baseClass} value={value || ""} onChange={handleChange}>
            {options.map((opt) => (
              <option key={opt} value={opt.startsWith("Select") ? "" : opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case "textarea":
        return (
          <textarea
            className={baseClass}
            value={value || ""}
            onChange={handleChange}
            placeholder={placeholder}
            rows={3}
          />
        );

      case "file":
        return (
          <div className="lf-file-wrapper">
            <label className="lf-file-label">
              <span className="lf-file-icon">📎</span>
              <span className="lf-file-text">
                {value ? value.name : `Choose file (${accept})`}
              </span>
              <input
                type="file"
                accept={accept}
                onChange={handleChange}
                className="lf-file-input"
              />
            </label>
            {value && <span className="lf-file-chosen">{value.name}</span>}
          </div>
        );

      default:
        return (
          <input
            type={type}
            className={baseClass}
            value={value || ""}
            onChange={handleChange}
            placeholder={placeholder}
          />
        );
    }
  };

  return (
    <div className={`lf-field ${fullWidth ? "lf-field--full" : ""}`}>
      <label className="lf-label">
        {label}
        {required && <span className="lf-required">*</span>}
      </label>
      {renderInput()}
      {error && <span className="lf-error-msg">{error}</span>}
    </div>
  );
};

export default FormField;
