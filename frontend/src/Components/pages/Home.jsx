import React, { useRef, useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import AnimateOnScroll from "./homeAnimations/AnimationOnScroll";
import CountUpNumber from "./homeAnimations/CountUpNumber";
import logo from "../../assets/logo.png";

import "../../Styles/Home.css";
import Header from "../Header";
import Footer from "../Footer";

function Home() {
  /* ✅ Stats scroll detection */
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect(); // ✅ run ONCE
        }
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    if (statsRef.current) observer.observe(statsRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
    <Header/>
    <div className="Home">

      {/* HERO SECTION */}
      <AnimateOnScroll>
        <section className="hero-section">
          <Container>
            <Row className="align-items-center py-5">
              <Col md={6}>
                <h1 className="fw-bold mb-3">
                  Make Your Dream Home a Reality
                </h1>

                <p className="text-muted mb-4">
                  Home loans starting from <strong>8.35% interest</strong>
                </p>

               
                <Button variant="outline-primary" className="px-4">
                  Check Eligibility
                </Button>
              </Col>

              <Col md={6} className="text-center">
                <img src={logo} alt="Home Loan" className="img-fluid" />
              </Col>
            </Row>
          </Container>
        </section>
      </AnimateOnScroll>

     
      <AnimateOnScroll>
     <section className="loan-type py-4">
        <Container className="text-center">
        <h2 className="fw-bold mb-2">Choose Your Home Loan Option</h2>
        <p className="text-muted mb-4">
          Select the way you want to apply for your MLRR Home Loan — directly from a bank
          or with our best‑interest assistance.
        </p>

        <Button className="navy-blue me-3 mb-2">
          MLRR HOME LOAN
        </Button>

        <Button className="blue-color mb-2">
          Apply from Selected Bank
        </Button>
        </Container>
     </section>
      </AnimateOnScroll>
      <AnimateOnScroll>
        <section id="key-benefits" className="key-benefits py-5">
          <Container>
            <Row className="text-center mb-5">
              <Col>
                <h2>Why Choose Our Home Loans</h2>
                <p className="text-muted">
                  Simple, secure and designed for your dream home
                </p>
              </Col>
            </Row>
          </Container>
        </section>
      </AnimateOnScroll>
     <AnimateOnScroll>
      
    <section className="Customer-review py-5">
      <Container>
        <h2 className="review-title mb-4">What our customers say</h2>

        <Row className="g-4">
          <Col md={4}>
            <div className="review-card">
              <span className="quote-mark">“</span>
              <h5>Perfect for Loan Solutions</h5>
              <p>
                Recently I had a conversation with our executive. I received a
                better solution in a very short time with great support and
                behaviour.
              </p>

              <div className="review-footer">
                <div className="user-info">
                  <span className="user-icon"></span>
                  <div>
                    <strong>Amit Chahal</strong>
                    <small>15th Jan 2026</small>
                  </div>
                </div>
                <div className="stars">★★★★☆</div>
              </div>
            </div>
          </Col>

          <Col md={4}>
            <div className="review-card">
              <span className="quote-mark">“</span>
              <h5>Excellent Support for CIBIL Report</h5>
              <p>
                The team helped me download my CIBIL report smoothly. They were
                patient, knowledgeable, and resolved my issue efficiently.
              </p>

              <div className="review-footer">
                <div className="user-info">
                  <span className="user-icon"></span>
                  <div>
                    <strong>Sindhu Gowda</strong>
                    <small>16th Jan 2026</small>
                  </div>
                </div>
                <div className="stars">★★★★★</div>
              </div>
            </div>
          </Col>

          <Col md={4}>
            <div className="review-card">
              <span className="quote-mark">“</span>
              <h5>Best Place for Taking Loans</h5>
              <p>
                Customer care was very responsive and explained everything
                clearly. Overall the experience was smooth and helpful.
              </p>

              <div className="review-footer">
                <div className="user-info">
                  <span className="user-icon"></span>
                  <div>
                    <strong>Kokil Barnwal</strong>
                    <small>17th Jan 2026</small>
                  </div>
                </div>
                <div className="stars">★★★★☆</div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  
     </AnimateOnScroll>

      {/* ✅ STATS SECTION (COUNTERS START ON SCROLL) */}
      <section ref={statsRef} className="stats-section py-5">
        <Container>
          <Row className="text-center g-4">

            <Col md={3}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h2 className="text-dark fw-bold">
                    <CountUpNumber start={statsVisible} end={50000} suffix="+" />
                  </h2>
                  <p>Loans Disbursed</p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h2 className="text-dark fw-bold">
                    <CountUpNumber start={statsVisible} end={75000} suffix="+" />
                  </h2>
                  <p>Applications Processed</p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h2 className="text-dark fw-bold">
                    ₹<CountUpNumber start={statsVisible} end={2500} suffix=" Cr+" />
                  </h2>
                  <p>Loan Amount Approved</p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h2 className="= text-dark fw-bold">
                    <CountUpNumber start={statsVisible} end={98} suffix="%" />
                  </h2>
                  <p>Customer Satisfaction</p>
                </Card.Body>
              </Card>
            </Col>

          </Row>
        </Container>
      </section>

    </div>
    <Footer/>
    </>
  );
}

export default Home;