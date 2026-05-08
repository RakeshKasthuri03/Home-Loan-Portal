import "../Styles/LoanForm.css";

const FormField = ({ field, value, onChange, error, fullWidth }) => {
  const { name, label, type, required, placeholder, options, accept, maxLength } = field;

  const baseClass = `lf-input ${error ? "lf-input--error" : ""}`;

  const handleChange = (e) => {
    if (type === "file") {
      onChange(name, e.target.files[0]);
    } else if (type === "checkbox") {
      onChange(name, e.target.checked);
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

      case "checkbox":
        return (
          <label className="lf-checkbox-label">
            <input
              type="checkbox"
              className="lf-checkbox-input"
              checked={!!value}
              onChange={handleChange}
            />
            <span className={`lf-checkbox-box ${value ? "lf-checkbox-box--checked" : ""}`}>
              {value && <span>✓</span>}
            </span>
            <span className="lf-checkbox-text">
              {label}{required && <span className="lf-required"> *</span>}
            </span>
          </label>
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
            {value && <span className="lf-file-chosen">✓ {value.name}</span>}
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
            maxLength={maxLength}
          />
        );
    }
  };

  if (type === "checkbox") {
    return (
      <div className={`lf-field lf-field--checkbox ${fullWidth ? "lf-field--full" : ""}`}>
        {renderInput()}
        {error && <span className="lf-error-msg">{error}</span>}
      </div>
    );
  }

  return (
    <div className={`lf-field ${fullWidth ? "lf-field--full" : ""}`}>
      <label className="lf-label">
        {label}
        {required && <span className="lf-required"> *</span>}
      </label>
      {renderInput()}
      {error && <span className="lf-error-msg">{error}</span>}
    </div>
  );
};

export default FormField;
