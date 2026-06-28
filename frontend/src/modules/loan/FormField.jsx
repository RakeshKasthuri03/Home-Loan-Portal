import { useState } from "react";
import axios from "axios";
import { getToken, getUser } from "../../utils/auth";
import "./LoanForm.css";
import CustomSelect from "../../components/CustomSelect";

const FormField = ({ field, value, onChange, error, fullWidth }) => {
  const { name, label, type, required, placeholder, options, accept, maxLength } = field;

  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  const me = getUser();
  // lock key identity fields coming from profile so user cannot edit them in application
  const locked = me && (name === "fullName" || name === "email" || name === "gender" || name === "eSignature");

  const baseClass = `lf-input ${error ? "lf-input--error" : ""}`;

  // ✅ HANDLE INPUT CHANGE
  const handleChange = async (e) => {
    // Prevent editing locked profile fields
    if (locked && type !== "file") return;
    if (type === "file") {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(true);
      setFileName(file.name);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const token = getToken();

        const res = await axios.post(
          "http://localhost:5000/api/upload",
          formData,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : ""
            }
          }
        );

        // ✅ store uploaded file URL
        const url = res.data?.file?.url || "";

        onChange(name, url);

      } catch (err) {
        console.error("File upload failed:", err);

        alert(
          err.response?.data?.message ||
          "Upload failed. Only PDF/DOC/DOCX allowed"
        );

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

  // ✅ RENDER INPUT BASED ON TYPE
  const renderInput = () => {
    switch (type) {

      case "select":
        return (
          <CustomSelect
            value={value || ""}
            onChange={(val) => !locked && onChange(name, val)}
            placeholder={options[0] || "Select..."}
            options={options
              .filter(opt => !opt.startsWith("Select"))
              .map(opt => ({ value: opt, label: opt }))
            }
          />
        );

      case "textarea":
        return (
          <textarea
            className={baseClass}
            value={value || ""}
            onChange={handleChange}
            readOnly={locked}
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

      // ✅ ✅ FILE INPUT (FINAL)
      case "file": {
        const displayName =
          typeof value === "string" && value
            ? value.split("/").pop()
            : fileName;

        return (
          <div className="lf-file-wrapper">
            <label className="lf-file-label">
              <span className="lf-file-icon">📎</span>

              <span className="lf-file-text">
                {uploading
                  ? "Uploading..."
                  : displayName
                  ? displayName
                  : `Choose file (${accept || ".pdf,.doc,.docx"})`}
              </span>

              <input
                type="file"
                accept={accept || ".pdf,.doc,.docx"}
                onChange={handleChange}
                className="lf-file-input"
                disabled={uploading}
              />
            </label>

            {/* ✅ Uploading */}
            {uploading && (
              <span className="lf-file-chosen">Uploading…</span>
            )}

            {/* ✅ Uploaded */}
            {!uploading && value && (
              <div className="lf-file-chosen">
                ✓ {displayName}

                <br />

                {/* ✅ VIEW FILE */}
                {(() => {
                  const raw = value || "";
                  const normalized = (typeof raw === 'string' && raw.startsWith('/http')) ? raw.slice(1) : raw;
                  return (
                    <a href={normalized} target="_blank" rel="noreferrer">
                      View
                    </a>
                  );
                })()}
              </div>
            )}
          </div>
        );
      }

      default:
        return (
          <input
            type={type}
            className={baseClass}
            value={value || ""}
            onChange={handleChange}
            readOnly={locked}
            title={locked ? "Taken from your profile — not editable" : undefined}
            placeholder={placeholder}
            maxLength={maxLength}
          />
        );
    }
  };

  // ✅ CHECKBOX UI
  if (type === "checkbox") {
    return (
      <div className={`lf-field lf-field--checkbox ${fullWidth ? "lf-field--full" : ""}`}>
        {renderInput()}
        {error && <span className="lf-error-msg">{error}</span>}
      </div>
    );
  }

  // ✅ DEFAULT UI
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