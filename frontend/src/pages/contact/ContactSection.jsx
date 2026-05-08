import { useState } from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { LOAN_CHIPS, HOURS } from "../../utils/Contact";
import { contactSchema } from "../../Validations/contactValidation";
import "../../Styles/contact.css"
export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      city: "",
      loanAmount: "",
      employmentType: "",
      message: "",
      interests: [],
    },
    validationSchema: contactSchema,
    onSubmit: (values, { resetForm }) => {
      console.log("Submitted Data:", values);

      toast.success("Request submitted successfully!");

      setSubmitted(true);

      // Reset after success (optional)
      setTimeout(() => {
        resetForm();
        setSubmitted(false);
      }, 2000);
    },
    onError: () => {
      toast.error("Please fix the errors before submitting");
    },
  });

  const toggleChip = (chip) => {
    const current = formik.values.interests;
    const updated = current.includes(chip)
      ? current.filter((c) => c !== chip)
      : [...current, chip];

    formik.setFieldValue("interests", updated);
  };

  return (
    <section className="mlrr-contact-section">
      <div className="mlrr-contact-grid">
        
        {/* Sidebar */}
        <div className="mlrr-contact-sidebar">
          <div className="mlrr-contact-card">
            <div className="mlrr-card-icon">📞</div>
            <div className="mlrr-card-label">Call Us</div>
            <div className="mlrr-card-value">1800-123-4567</div>
            <div className="mlrr-card-sub">Toll-free · Mon–Sat 9am–7pm</div>
          </div>
          <div className="mlrr-contact-card">
            <div className="mlrr-card-icon">✉️</div>
            <div className="mlrr-card-label">Email Us</div>
            <div className="mlrr-card-value">hello@mlrr.in</div>
            <div className="mlrr-card-sub">We respond within 4 business hours</div>
          </div>
          <div className="mlrr-contact-card">
            <div className="mlrr-card-icon">📍</div>
            <div className="mlrr-card-label">Head Office</div>
            <div className="mlrr-card-value">MLRR Financial Services</div>
            <div className="mlrr-card-sub">Level 12, Prestige Tower, MG Road, Bengaluru – 560001</div>
          </div>
          <div className="mlrr-contact-card">
            <div className="mlrr-card-icon">🕐</div>
            <div className="mlrr-card-label">Business Hours</div>
            {HOURS.map((h) => (
              <div className="mlrr-hours-row" key={h.day}>
                <span className="mlrr-hours-day">{h.day}</span>
                <span className="mlrr-hours-time">{h.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FORM */}
        <form className="mlrr-form-wrap" onSubmit={formik.handleSubmit}>
            
            {/* ROW 1 */}
            <div className="mlrr-form-row">

              <div className="mlrr-form-group">
                <label className="mlrr-label">
                  Full Name <span className="mlrr-req">*</span>
                </label>
                <input
                  className="mlrr-input"
                  name="name"
                  placeholder="e.g. Rahul Sharma"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="error">{formik.errors.name}</p>
                )}
              </div>

              <div className="mlrr-form-group">
                <label className="mlrr-label">
                  Mobile Number <span className="mlrr-req">*</span>
                </label>
                <input
                  className="mlrr-input"
                  name="phone"
                  placeholder="+91 98765 43210"
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="error">{formik.errors.phone}</p>
                )}
              </div>

            </div>

            {/* ROW 2 */}
            <div className="mlrr-form-row">

              <div className="mlrr-form-group">
                <label className="mlrr-label">Email Address</label>
                <input
                  className="mlrr-input"
                  name="email"
                  placeholder="rahul@example.com"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
              </div>

              <div className="mlrr-form-group">
                <label className="mlrr-label">
                  City <span className="mlrr-req">*</span>
                </label>
                <input
                  className="mlrr-input"
                  name="city"
                  placeholder="e.g. Bengaluru"
                  onChange={formik.handleChange}
                  value={formik.values.city}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.city && formik.errors.city && (
                  <p className="error">{formik.errors.city}</p>
                )}
              </div>

            </div>

            {/* INTEREST CHIPS */}
            <div className="mlrr-form-group">
              <label className="mlrr-label">
                I'm Interested In <span className="mlrr-req">*</span>
              </label>
              <div className="mlrr-chip-grid">
                {LOAN_CHIPS.map((chip) => (
                  <div
                    key={chip}
                    className={`mlrr-chip ${
                      formik.values.interests.includes(chip) ? "selected" : ""
                    }`}
                    onClick={() => toggleChip(chip)}
                  >
                    {chip}
                  </div>
                ))}
              </div>
              {formik.touched.interests && formik.errors.interests && (
                <p className="error">{formik.errors.interests}</p>
              )}
            </div>

            {/* ROW 3 */}
            <div className="mlrr-form-row">

              <div className="mlrr-form-group">
                <label className="mlrr-label">Loan Amount Required</label>
                <select
                  className="mlrr-select"
                  name="loanAmount"
                  onChange={formik.handleChange}
                  value={formik.values.loanAmount}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select range...</option>
                  <option>Below ₹25 Lakhs</option>
                  <option>₹25 – ₹50 Lakhs</option>
                  <option>₹50 – ₹75 Lakhs</option>
                </select>
              </div>

              <div className="mlrr-form-group">
                <label className="mlrr-label">Employment Type</label>
                <select
                  className="mlrr-select"
                  name="employmentType"
                  onChange={formik.handleChange}
                  value={formik.values.employmentType}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select type...</option>
                  <option>Salaried</option>
                  <option>Self-Employed</option>
                </select>
              </div>

            </div>

            {/* MESSAGE */}
            <div className="mlrr-form-group">
              <label className="mlrr-label">Additional Message</label>
              <textarea
                className="mlrr-textarea"
                name="message"
                placeholder="Tell us more..."
                onChange={formik.handleChange}
                value={formik.values.message}
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="mlrr-submit-btn hdr-btn hdr-btn--primary"
              onClick={() => {
                if (!formik.isValid) {
                  toast.error("Please fill all required fields correctly");
                }
              }}
            >
              {submitted ? "Submitting..." : "Request Free Consultation"}
            </button>
        </form>
      </div>
    </section>
  );
}