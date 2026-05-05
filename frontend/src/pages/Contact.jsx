import { useState } from "react";
import "../Styles/contact.css"

// ── Data ─────────────────────────────────────────────────────

const LOAN_CHIPS = [
  "Home Purchase",
  "Balance Transfer",
  "House Renovation",
  "NRI Loan",
  "Not Sure Yet",
];

const STATS = [
  { num: "₹50K Cr+", label: "Loans Disbursed" },
  { num: "2.4 Lakh+", label: "Happy Families" },
  { num: "48 hrs", label: "Avg. Approval Time" },
];

const FEATURES = [
  { icon: "🔍", title: "Compare & Choose", desc: "We compare rates from 30+ lenders instantly, so you always get the best deal on the market." },
  { icon: "📋", title: "End-to-End Assistance", desc: "From document collection to disbursal, our experts handle everything — you focus on your new home." },
  { icon: "🛡️", title: "Zero Hidden Charges", desc: "Complete fee transparency. Our advisory service is free — we earn only when you save." },
  { icon: "📞", title: "Dedicated Loan Manager", desc: "You get a single point of contact throughout — available 6 days a week on call, chat & email." },
];

const HOURS = [
  { day: "Mon – Fri", time: "9:00am – 7:00pm" },
  { day: "Saturday", time: "10:00am – 5:00pm" },
  { day: "Sunday", time: "Closed" },
];

const FAQ_DATA = [
  {
    q: "What is the minimum CIBIL score required for a home loan?",
    a: "Most lenders require a minimum CIBIL score of 700–750 for home loan approval. A score above 750 significantly improves your chances and can help you secure lower interest rates. We work with lenders who also offer solutions for scores between 650–700 with certain conditions. Our advisors can review your profile and suggest the best path forward.",
  },
  {
    q: "How long does it take to get a home loan approved?",
    a: "With complete documentation, in-principle approval typically takes 24–72 hours through MLRR's priority processing. Final sanction and disbursal may take 7–15 working days depending on property verification, legal checks, and technical assessment by the lender. We actively follow up on your behalf to minimise delays.",
  },
  {
    q: "What documents are required to apply for a home loan?",
    a: "The typical documents required are: KYC documents (Aadhaar, PAN, passport), income proof (last 3 months salary slips or 2 years ITR for self-employed), bank statements (last 6 months), property documents (sale agreement, title deed, approved plan), and photographs. Our team will send you a personalised checklist after your consultation call.",
  },
  {
    q: "Can I transfer my existing home loan to a lower interest rate?",
    a: "Yes — a Balance Transfer (BT) can save you lakhs over the loan tenure. If your current lender's rate is more than 0.5% higher than market rates, a transfer typically makes sense. We calculate the break-even point including foreclosure charges and processing fees to confirm if a transfer benefits you before recommending it.",
  },
  {
    q: "Is MLRR's service free? How do you earn?",
    a: "Our service to customers is completely free of charge. MLRR earns a referral fee from the lending institution after your loan is disbursed — similar to how a real estate agent earns from the builder, not the buyer. This means our incentive is perfectly aligned with yours: get you the best rate and close quickly.",
  },
  {
    q: "What is the maximum home loan amount I can get?",
    a: "Lenders typically fund up to 75–90% of the property value (LTV ratio), depending on the loan amount. For loans up to ₹30 lakhs, LTV can be up to 90%. For loans above ₹75 lakhs, LTV is capped at 75%. The final amount also depends on your income, existing obligations (FOIR), and credit profile. Our eligibility calculator gives you an instant estimate.",
  },
  {
    q: "Do you have offices in cities other than Bengaluru?",
    a: "Yes! MLRR has offices in Bengaluru, Mumbai, Hyderabad, Chennai, Pune, and Delhi NCR. We also serve customers across all major Indian cities remotely through video consultation and digital documentation. Simply mention your city in the contact form and we'll assign a local specialist to your case.",
  },
];

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

export default function MLRRContactPage() {
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
