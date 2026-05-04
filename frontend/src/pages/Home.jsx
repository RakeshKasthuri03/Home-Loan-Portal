import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import AnimateOnScroll from "./homeAnimations/AnimationOnScroll";
import CountUpNumber from "./homeAnimations/CountUpNumber";
import hero from "../assets/hero.png";

import "../Styles/Home.css";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

/* ── data ──────────────────────────────────────────────────────────────────── */
const LOAN_TYPES = [
  { icon: "🏠", title: "Home Purchase",     desc: "Buy your dream home with competitive rates starting 8.35%" },
  { icon: "🏘️", title: "NRI Home Purchase", desc: "Specially designed for Non-Resident Indians to invest in property back home" },
  { icon: "🏗️", title: "Plot Purchase",     desc: "Purchase a residential plot to build your dream home at your own pace" },
  { icon: "🏡", title: "Home Renovation",   desc: "Upgrade your home with easy top-up loan options" },
];

const BENEFITS = [
  { icon: "⚡", title: "Quick Approval",       desc: "Get in-principle approval within 48 hours of application" },
  { icon: "📉", title: "Lowest Interest Rates", desc: "Rates starting at 8.35% p.a. — one of the best in market" },
  { icon: "📋", title: "Minimal Documents",     desc: "Simple paperwork with doorstep document pickup available" },
  { icon: "🔒", title: "100% Secure",           desc: "Bank-grade encryption keeps your data safe at all times" },
  { icon: "🤝", title: "Dedicated Support",     desc: "Personal loan advisor assigned to guide you end-to-end" },
  { icon: "💰", title: "Flexible Tenure",       desc: "Choose repayment tenure from 5 to 30 years as per comfort" },
];

const REVIEWS = [
  {
    title: "Perfect for Loan Solutions",
    body: "I received a better solution in a very short time with great support and behaviour from the team.",
    name: "Amit Chahal", date: "15th Jan 2026", stars: "★★★★☆", initials: "AC",
  },
  {
    title: "Excellent Support for CIBIL",
    body: "The team helped me download my CIBIL report smoothly. Patient, knowledgeable, and efficient.",
    name: "Sindhu Gowda", date: "16th Jan 2026", stars: "★★★★★", initials: "SG",
  },
  {
    title: "Best Place for Taking Loans",
    body: "Customer care was very responsive and explained everything clearly. Smooth and helpful experience.",
    name: "Kokil Barnwal", date: "17th Jan 2026", stars: "★★★★☆", initials: "KB",
  },
];

const STEPS = [
  { n: "01", title: "Fill Application",   desc: "Complete our simple multi-step online form in under 10 minutes." },
  { n: "02", title: "Upload Documents",   desc: "Upload your KYC, income proof and property documents digitally." },
  { n: "03", title: "Verification",       desc: "Our team verifies your details and assesses eligibility." },
  { n: "04", title: "Loan Disbursed",     desc: "Approved amount is credited directly to your account." },
];

/* ── component ─────────────────────────────────────────────────────────────── */
function Home() {
  const navigate = useNavigate();
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="Home">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}

        <section className="hero-section">
          <Container>
            <Row className="align-items-center g-5">
              <Col lg={6}>
                <div>
                  <span style={{color: "#ffffff", fontsize: "1.2rem"}}>Trusted by <span className="side-head">50,000+ </span>homeowners</span> 
                </div>
                <h1>
                  Make Your <span className="highlight">Dream Home</span> a Reality
                </h1>
                <p className="hero-subtitle">
                  Fast approvals, lowest interest rates, and a dedicated advisor — everything you need to own your home, simplified.
                </p>
                <div className="hero-rate-pill">
                  <div>
                    <div className="rate-value">8.35%</div>
                  </div>
                  <div className="rate-label">
                    Interest p.a.<br />
                    <strong style={{ color: "#fff", fontSize: "0.75rem" }}>Starting rate · No hidden charges</strong>
                  </div>
                </div>
                <div className="hero-actions">
                  <a className="btn-hero-primary" onClick={() => navigate("/loan-types")} style={{ cursor: "pointer" }}>
                    Check Eligibility →
                  </a>
                  <a className="btn-hero-outline" href="#how-it-works">
                    How it works
                  </a>
                </div>


              </Col>
            </Row>
          </Container>
          {/* Image pinned to top-right of hero */}
                  <img
        src={hero}
        alt="Home loan illustration"
        className="hero-corner-image"
      />
        </section>

        {/* ── LOAN TYPES ───────────────────────────────────────────────────── */}
        <AnimateOnScroll>
          <section className="loan-types-section">
            <Container>
              <div className="text-center">
                <span className="section-tag">Loan Products</span>
                <h2 className="section-title">Choose Your Loan Type</h2>
                <p className="section-subtitle">Pick the right product for your home journey</p>
              </div>
              <Row className="g-4">
                {LOAN_TYPES.map((lt) => (
                  <Col md={6} lg={3} key={lt.title}>
                    <div className="loan-type-card" onClick={() => navigate("/loan-types")}>
                      <span className="loan-type-icon">{lt.icon}</span>
                      <h5>{lt.title}</h5>
                      <p>{lt.desc}</p>
                      <div className="card-arrow">→</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Container>
          </section>
        </AnimateOnScroll>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
        <AnimateOnScroll>
          <section id="how-it-works" className="how-it-works">
            <Container>
              <Row className="align-items-center g-5">
                <Col lg={6}>
                  <span className="section-tag">Process</span>
                  <h2 className="section-title">Get Your Loan in 4 Simple Steps</h2>
                  <p className="section-subtitle">From application to disbursal — we make it effortless</p>
                  {STEPS.map((s) => (
                    <div className="step-item" key={s.n}>
                      <div className="step-number">{s.n}</div>
                      <div className="step-content">
                        <h5>{s.title}</h5>
                        <p>{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </Col>
                <Col lg={6}>
                  <div className="how-it-works-visual">
                    <h3>Why customers choose MLRR</h3>
                    <p>Numbers that speak for themselves</p>
                    {[
                      { icon: "🏆", val: "50,000+", label: "Loans Disbursed" },
                      { icon: "⚡", val: "48 hrs",  label: "Average Approval Time" },
                      { icon: "😊", val: "98%",     label: "Customer Satisfaction" },
                      { icon: "💰", val: "₹2500 Cr+", label: "Total Loan Amount Approved" },
                    ].map((s) => (
                      <div className="visual-stat" key={s.label}>
                        <span className="stat-icon">{s.icon}</span>
                        <div className="stat-info">
                          <strong>{s.val}</strong>
                          <span>{s.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            </Container>
          </section>
        </AnimateOnScroll>

        {/* ── KEY BENEFITS ─────────────────────────────────────────────────── */}
        <AnimateOnScroll>
          <section id="key-benefits" className="key-benefits">
            <Container>
              <div className="text-center">
                <span className="section-tag">Why Us</span>
                <h2 className="section-title">Why Choose MLRR Home Loans</h2>
                <p className="section-subtitle">Simple, secure and designed for your dream home</p>
              </div>
              <Row className="g-4">
                {BENEFITS.map((b) => (
                  <Col md={6} lg={4} key={b.title}>
                    <div className="benefit-card">
                      <div className="benefit-icon-wrap">{b.icon}</div>
                      <h5>{b.title}</h5>
                      <p>{b.desc}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </Container>
          </section>
        </AnimateOnScroll>

        {/* ── STATS ────────────────────────────────────────────────────────── */}
        <section ref={statsRef} className="stats-section">
          <Container>
            <div className="d-flex justify-content-center align-items-center flex-wrap gap-0">
              {[
                { end: 50000, suffix: "+",      label: "Loans Disbursed" },
                { end: 75000, suffix: "+",      label: "Applications Processed" },
                { end: 2500,  suffix: " Cr+",   label: "Loan Amount Approved", prefix: "₹" },
                { end: 98,    suffix: "%",      label: "Customer Satisfaction" },
              ].map((s, i) => (
                <React.Fragment key={s.label}>
                  {i > 0 && <div className="stat-divider d-none d-md-block" style={{ height: 60 }} />}
                  <div className="stat-card" style={{ flex: "1 1 200px" }}>
                    <h2>
                      {s.prefix}
                      <CountUpNumber start={statsVisible} end={s.end} suffix={s.suffix} />
                    </h2>
                    <p>{s.label}</p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </Container>
        </section>

        {/* ── REVIEWS ──────────────────────────────────────────────────────── */}
        <AnimateOnScroll>
          <section className="reviews-section">
            <Container>
              <div className="text-center">
                <span className="section-tag">Testimonials</span>
                <h2 className="section-title">What Our Customers Say</h2>
                <p className="section-subtitle">Real stories from real homeowners</p>
              </div>
              <Row className="g-4">
                {REVIEWS.map((r) => (
                  <Col md={4} key={r.name}>
                    <div className="review-card">
                      <span className="quote-mark">"</span>
                      <h5>{r.title}</h5>
                      <p>{r.body}</p>
                      <div className="review-footer">
                        <div className="user-info">
                          <div className="user-avatar">{r.initials}</div>
                          <div>
                            <strong>{r.name}</strong>
                            <small>{r.date}</small>
                          </div>
                        </div>
                        <div className="stars">{r.stars}</div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Container>
          </section>
        </AnimateOnScroll>

        {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
        <AnimateOnScroll>
          <section className="cta-section">
            <Container>
              <h2>Ready to Own Your Dream Home?</h2>
              <p>Join 50,000+ happy homeowners. Apply online in minutes no branch visit needed.</p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <button className="btn-hero-primary" onClick={() => navigate("/loan-types")}>
                  Start Application →
                </button>
                <a className="btn-hero-outline" href="tel:+919999999999">
                  📞 Talk to an Expert
                </a>
              </div>
            </Container>
          </section>
        </AnimateOnScroll>

      </div>
    </>
  );
}

export default Home;
