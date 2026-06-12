import { useState } from "react";
import { useFormik } from "formik";
import notify from "../utils/notify";
import { LOAN_CHIPS, HOURS } from "../utils/Contact";
import { contactSchema } from "../Validations/ContactValidation";
import "../Styles/contact.css"
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

      notify.success("Request submitted successfully!");

      setSubmitted(true);

      // Reset after success (optional)
      setTimeout(() => {
        resetForm();
        setSubmitted(false);
      }, 2000);
    },
    onError: () => {
      notify.error("Please fix the errors before submitting");
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
            <div className="mlrr-card-value">mlrrhomeloan@gmail.com</div>
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
      </div>
    </section>
  );
}


