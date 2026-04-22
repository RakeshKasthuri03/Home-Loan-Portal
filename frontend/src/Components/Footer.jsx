import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterestP,
  FaGooglePlusG,
} from "react-icons/fa";
import "../Styles/Footer.css";
import Image from 'react-bootstrap/Image';
 import logo from '../assets/logo.png'
function Footer(){
  return (
    <footer className="footer light-blue">
      <Container>
        <Row className="py-5">
          {/* Logo & About */}
          <Col md={3} sm={12}>
            <Image className="footer-logo" src={logo}  />
            
            <h6>About Us</h6>
            <p className="footer-text">
               We help turn your dream of owning a home into reality with simple, transparent, and affordable home loan solutions.
            </p>
            <h6>Contact Us</h6>
            <p className="mb-1">📞 +91 9999 999 999</p>
            <p>✉️ mlrrhomeloan@gmail.com</p>
          </Col>
 
          {/* Information */}
          <Col md={3} sm={6} className="mb-4">
            <h5 className="footer-title">Information</h5>
            <ul className="footer-links">
              <li>About Us</li>
              <li>Blog</li>
              <li>Testimonials</li>
              <li>Calculators</li>
            </ul>
          </Col>
 
          {/* Helpful Links */}
          <Col md={3} sm={6} className="mb-4">
            <h5 className="footer-title">Helpful Links</h5>
            <ul className="footer-links">
              <li>Services</li>
              <li>Supports</li>
              <li>Terms & Condition</li>
              <li>Privacy Policy</li>
            </ul>
          </Col>
 
          {/* Subscribe */}
          <Col md={3} sm={12}>
            <h5 className="footer-title">Talk to a Home Loan Expert</h5>
            <Form>
              <Form.Control
                type="tel"
                placeholder="Enter your Phone number"
                className="mb-2"
              />
              <Button className="subscribe-btn w-100">
                Request a Call Back
              </Button>
            </Form>
          </Col>
        </Row>
 
        {/* Social & Copyright */}
        <Row className="footer-bottom py-3 align-items-center">
          <Col md={6} className="text-md-start text-center">
            <div className="social-icons">
              
              <FaFacebookF />
              <FaGooglePlusG />
              <FaTwitter />
              <FaInstagram />
            </div>
          </Col>
          <Col md={6} className="text-md-end text-center">
            <small>© 2026 MLRR Home Loans Ltd. All Rights Reserved</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
 
export default Footer;