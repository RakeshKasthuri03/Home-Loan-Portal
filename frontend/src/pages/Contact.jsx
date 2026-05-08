import { useState } from "react";
import "../Styles/contact.css"
import { LOAN_CHIPS,STATS,FEATURES,HOURS,FAQ_DATA } from "../utils/Contact";

// ── Sub-components ───────────────────────────────────────────

function AboutSection() {
  return (
    <section className="mlrr-about-hero">
      <div className="mlrr-about-inner">
        <div>
          <h1>We Help You Find Your <em>Dream Home</em> — Affordably</h1>
          <p>MLRR is India's most transparent home loan advisory. We partner with 30+ banks and NBFCs to get you the lowest rates, faster approvals, and zero hidden charges.</p>
          <p>Whether you're a first-time buyer, looking to transfer your loan, or need a top-up — our specialists are here every step of the way.</p>
          <div className="mlrr-stats">
            {STATS.map((s) => (
              <div className="mlrr-stat-card" key={s.label}>
                <div className="mlrr-stat-num">{s.num}</div>
                <div className="mlrr-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mlrr-about-right">
          {FEATURES.map((f) => (
            <div className="mlrr-feature-pill" key={f.title}>
              <div className="mlrr-pill-icon">{f.icon}</div>
              <div>
                <div className="mlrr-pill-title">{f.title}</div>
                <div className="mlrr-pill-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [selectedChips, setSelectedChips] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleChip = (chip) =>
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );

  return (
    <section className="mlrr-contact-section">
      <div className="mlrr-section-header">
        <span className="mlrr-section-tag">📩 Get In Touch</span>
        <h2>Speak to a Loan Specialist Today</h2>
        <p>Fill in your details and we'll match you with the right lender and the best rate — usually within 2 hours.</p>
      </div>

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

        {/* Form */}
        <div className="mlrr-form-wrap">
          <div className="mlrr-form-row">
            <div className="mlrr-form-group">
              <label className="mlrr-label">Full Name <span className="mlrr-req">*</span></label>
              <input className="mlrr-input" type="text" placeholder="e.g. Rahul Sharma" required/>
            </div>
            <div className="mlrr-form-group">
              <label className="mlrr-label">Mobile Number <span className="mlrr-req">*</span></label>
              <input className="mlrr-input" type="tel" placeholder="+91 98765 43210" required/>
            </div>
          </div>

          <div className="mlrr-form-row">
            <div className="mlrr-form-group">
              <label className="mlrr-label">Email Address</label>
              <input className="mlrr-input" type="email" placeholder="rahul@example.com" required/>
            </div>
            <div className="mlrr-form-group">
              <label className="mlrr-label">City <span className="mlrr-req">*</span></label>
              <input className="mlrr-input" type="text" placeholder="e.g. Bengaluru, Mumbai..." required/>
            </div>
          </div>

          <div className="mlrr-form-group">
            <label className="mlrr-label">I'm Interested In <span className="mlrr-req">*</span></label>
            <div className="mlrr-chip-grid">
              {LOAN_CHIPS.map((chip) => (
                <div
                  key={chip}
                  className={`mlrr-chip${selectedChips.includes(chip) ? " selected" : ""}`}
                  onClick={() => toggleChip(chip)}
                >
                  {chip}
                </div>
              ))}
            </div>
          </div>

          <div className="mlrr-form-row">
            <div className="mlrr-form-group">
              <label className="mlrr-label">Loan Amount Required</label>
              <select className="mlrr-select" required>
                <option value="">Select range...</option>
                <option>Below ₹25 Lakhs</option>
                <option>₹25 – ₹50 Lakhs</option>
                <option>₹50 – ₹75 Lakhs</option>
                <option>₹75 Lakhs – ₹1 Crore</option>
                <option>Above ₹1 Crore</option>
              </select>
            </div>
            <div className="mlrr-form-group">
              <label className="mlrr-label">Employment Type</label>
              <select className="mlrr-select" required>
                <option value="">Select type...</option>
                <option>Salaried</option>
                <option>Self-Employed</option>
                <option>Business Owner</option>
                <option>NRI</option>
              </select>
            </div>
          </div>

          <div className="mlrr-form-group">
            <label className="mlrr-label">Additional Message</label>
            <textarea
              className="mlrr-textarea"
              placeholder="Tell us more about your requirement — timeline, property details, or any specific questions..."
            />
          </div>

          <button
            className={`mlrr-submit-btn hdr-btn hdr-btn--primary ${submitted ? " success" : ""}`}
            onClick={() => setSubmitted(true)}
            disabled={submitted}
          >
            {submitted
              ? "Request Sent! MLRR team will call you within 2 hours."
              : "Request Free Consultation"}
          </button>
          <p className="mlrr-form-note">
            By submitting, you agree to our <a href="#">Privacy Policy</a>. We never share your data with third parties.
          </p>
        </div>
      </div>
    </section>
  );
}

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className={`mlrr-faq-item${isOpen ? " open" : ""}`}>
      <button className="mlrr-faq-q" onClick={onToggle}>
        {faq.q}
        <span className="mlrr-faq-chevron">▼</span>
      </button>
      <div className="mlrr-faq-a">
        <div className="mlrr-faq-a-inner">{faq.a}</div>
      </div>
    </div>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section className="mlrr-faq-section">
      <div className="mlrr-faq-bg-text">FAQ</div>
      <div className="mlrr-faq-inner">
        <div className="mlrr-section-header">
          <span className="mlrr-section-tag">❓ Quick Answers</span>
          <h2>Frequently Asked Questions</h2>
          <p>Can't find your answer here? Our team is just one call away.</p>
        </div>
        <div className="mlrr-faq-list">
          {FAQ_DATA.map((faq, i) => (
            <FaqItem
              key={i}
              faq={faq}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Main Export ───────────────────────────────────────────────

export default function Contact() {
  return (
    <>
      <div className="mlrr-root">
        <AboutSection />
        <div className="mlrr-divider" />
        <ContactSection />
        <div className="mlrr-divider" />
        <FaqSection />
      </div>
    </>
  );
}
