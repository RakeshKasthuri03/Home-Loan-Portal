import React from "react";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import signup from "../../assets/signup.png";
import logo from "../../assets/logo.png";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../../Validations/auth.schema";

import "../../Styles/signup.css";

function SignUp({ closeModal, openLogin }) {

  /* ✅ React Hook Form + Zod */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  /* ✅ Submit */
  const onSubmit = (data) => {
    console.log("Signup Data:", data);
    openLogin(); // switch to login modal
  };

  return (
    <div className="SignUp">
      <Container>
        <Row className="align-items-center">

          {/* Left Image */}
          <Col md={6} className="d-none d-md-flex login-image-wrapper">
            <Image
              src={signup}
              alt="Sign Up Illustration"
              className="login-side-image border-radius-16"
              fluid
            />
          </Col>

          {/* Right Form */}
          <Col md={6}>
            <div className="login-box position-relative">

              {/* Close Button */}
              <Button
                type="button"
                className="btn btn-light position-absolute top-0 end-0"
                onClick={closeModal}
              >
                <FontAwesomeIcon icon={faXmark} />
              </Button>

              {/* Header */}
              <div className="text-center mb-1">
                <Image src={logo} height={60} />
                <h3 className="fw-bold">Sign Up</h3>
                <hr />
              </div>

              {/* ✅ FORM */}
              <Form onSubmit={handleSubmit(onSubmit)}>

                {/* Names */}
                <div className="name-form-row">
                  <Form.Group className="form-group">
                    <Form.Label className="heading">First Name</Form.Label>
                    <Form.Control {...register("firstName")} />
                    
                  </Form.Group>

                  <Form.Group className="form-group">
                    <Form.Label className="heading">Middle Name</Form.Label>
                    <Form.Control {...register("middleName")} />
                  </Form.Group>

                  <Form.Group className="form-group">
                    <Form.Label className="heading">Last Name</Form.Label>
                    <Form.Control {...register("lastName")} />
                  </Form.Group>
                </div>
                    <small className="text-danger">{errors.lastName?.message}</small>

                {/* Email */}
                <Form.Group className="mb-2">
                  <Form.Label className="heading">Email</Form.Label>
                  <Form.Control type="email" {...register("email")} />
                  <small className="text-danger">{errors.email?.message}</small>
                </Form.Group>

                {/* Phone */}
                <div className="phone-form-row">
                  <Form.Group className="form-group country-select">
                    <Form.Label className="heading">Country</Form.Label>
                    <Form.Select {...register("countryCode")}>
                      <option value="+1">USA (+1)</option>
                      <option value="+91">India (+91)</option>
                      <option value="+44">UK (+44)</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="form-group">
                    <Form.Label className="heading">Phone</Form.Label>
                    <Form.Control type="tel" {...register("phone")} />
                    <small className="text-danger">{errors.phone?.message}</small>
                  </Form.Group>
                </div>

                {/* Gender */}
                <Form.Group className="mb-2">
                  <Form.Label className="heading">Gender</Form.Label>
                  <Form.Select {...register("gender")}>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
                  <small className="text-danger">{errors.gender?.message}</small>

                {/* Password */}
                <div className="password-row">
                  <Form.Group className="password-group">
                    <Form.Label className="heading">Password</Form.Label>
                    <Form.Control type="password" {...register("password")} />
                    <small className="text-danger">{errors.password?.message}</small>
                  </Form.Group>

                  <Form.Group className="password-group">
                    <Form.Label className="heading">Confirm Password</Form.Label>
                    <Form.Control type="password" {...register("confirmPassword")} />
                    <small className="text-danger">
                      {errors.confirmPassword?.message}
                    </small>
                  </Form.Group>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="hdr-btn hdr-btn--primary w-100 mt-3"
                >
                  Sign Up
                </button>

                {/* Switch to Login */}
                <p className="text-center mt-3">
                  Already have an account?{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      openLogin();
                    }}
                  >
                    Login
                  </a>
                </p>

              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SignUp;