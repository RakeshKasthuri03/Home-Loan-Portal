import { useState } from "react";
import axios from "axios";
import { getToken } from "../../utils/auth";
import "./LoanForm.css";

const FormField = ({ field, value, onChange, error, fullWidth }) => {
  const { name, label, type, required, placeholder, options, accept, maxLength } = field;
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  const baseClass = `lf-input ${error ? "lf-input--error" : ""}`;

  const handleChange = async (e) => {
    if (type === "file") {
      const file = e.target.files[0];
      if (!file) return;
      setUploading(true);
      setFileName(file.name);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const token = getToken();
        const res = await axios.post("http://localhost:5000/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        // Store the URL string (not the File object)
        const url = res.data.file?.url || res.data.url || "";
        onChange(name, url);
      } catch (err) {
        console.error("File upload failed:", err);
        onChange(name, "");
        setFileName("");
      }
      setUploading(false);
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
                {uploading ? "Uploading..." : fileName ? fileName : `Choose file (${accept})`}
              </span>
              <input
                type="file"
                accept={accept}
                onChange={handleChange}
                className="lf-file-input"
                disabled={uploading}
              />
            </label>
            {value && typeof value === "string" && (
              <span className="lf-file-chosen">✓ Uploaded</span>
            )}
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

