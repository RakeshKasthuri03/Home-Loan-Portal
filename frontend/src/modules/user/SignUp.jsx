import React from "react";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import signup from "../../assets/signup.png";
import logo from "../../assets/logo.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../../Validations/SignupValidation";
import "../../styles/signup.css";
import axios from "axios";
import notify from "../../utils/notify";

function SignUp({ closeModal, openLogin }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      countryCode: "+91",
    },
  });

  const onSubmit = async (data) => {
    try {
      data.phone = data.countryCode + data.phone;
      delete data.countryCode;

      const user = {
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        password: data.password,
        confirmpassword: data.confirmPassword,
      };

      const res = await axios.post("http://localhost:5000/signup", user);

      if (res.status === 201) {
        notify.success("Signup successful! Please login.");
        setTimeout(() => {
          openLogin();
        }, 2000);
      } else {
        notify.error(res.data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      notify.error(
        error?.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="SignUp">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="d-none d-md-flex login-image-wrapper">
            <Image src={signup} className="login-side-image" fluid />
          </Col>

          <Col md={6}>
            <div className="login-box position-relative">
              <Button
                type="button"
                className="btn btn-light position-absolute top-0 end-0"
                onClick={closeModal}
              >
                <FontAwesomeIcon icon={faXmark} />
              </Button>

              <div className="text-center mb-1">
                <Image src={logo} height={60} />
                <h3 className="fw-bold">Sign Up</h3>
                <hr />
              </div>

              <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="name-form-row">
                  <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control {...register("firstName")} />
                    <small className="text-danger">
                      {errors.firstName?.message}
                    </small>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Middle Name</Form.Label>
                    <Form.Control {...register("middleName")} />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control {...register("lastName")} />
                    <small className="text-danger">
                      {errors.lastName?.message}
                    </small>
                  </Form.Group>
                </div>

                <Form.Group className="mb-2">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" {...register("email")} />
                  <small className="text-danger">
                    {errors.email?.message}
                  </small>
                </Form.Group>

                <div className="phone-form-row">
                  <Form.Group>
                    <Form.Label>Country</Form.Label>
                    <Form.Select {...register("countryCode")}>
                      <option value="+91">India (+91)</option>
                      <option value="+1">USA (+1)</option>
                      <option value="+44">UK (+44)</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type="tel" {...register("phone")} />
                    <small className="text-danger">
                      {errors.phone?.message}
                    </small>
                  </Form.Group>
                </div>

                <Form.Group className="mb-2">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select {...register("gender")}>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                  <small className="text-danger">
                    {errors.gender?.message}
                  </small>
                </Form.Group>

                <div className="password-row">
                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      {...register("password")}
                    />
                    <small className="text-danger">
                      {errors.password?.message}
                    </small>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      {...register("confirmPassword")}
                    />
                    <small className="text-danger">
                      {errors.confirmPassword?.message}
                    </small>
                  </Form.Group>
                </div>

                <button
                  type="submit"
                  className="hdr-btn hdr-btn--primary w-100 mt-3"
                >
                  Sign Up
                </button>

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