import { Container, Row, Col, Form, Button, CloseButton, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png"; // adjust path
import login from "../../assets/login.png"
import '../../Styles/Login.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
``
const Login = ({closeModal,onLogin }) => {
  const navigate = useNavigate();
    const[Email,Setemail]=useState("agent@gmail.com");
  const[Password,SetPassword]=useState("1234");
  const handleSubmit = (e) => {
    e.preventDefault();
    // handle login logic here
      if(Email==="agent@gmail.com" && Password==="1234"){
        
       navigate("/leaddetails"); 

      
         // redirect after login
      }

    console.log("Login submitted");
  };

  return (
    <div className="Login">
      <Container>
        <Row className=" align-items-center">
          {/* Left side (optional image / empty) */}
          <Col md={6} className="d-none d-md-flex login-image-wrapper">
      <Image
        src={login}
        alt="Login Illustration"
        className="login-side-image"
        fluid
      />
    </Col>

          {/* Right side login box */}
          <Col md={6}>
            <div className="login-box  position-relative">
           <Button
            type="button"
            className="btn btn-light position-absolute top-0 end-0"
            onClick={closeModal}>
            <FontAwesomeIcon icon={faXmark} />
          </Button>

              

              <div className="text-center mb-5 ">
                <Image src={logo} height={60} className="mb-3" />
                <h1 className="h4 fw-bold heading">Login to Your Account</h1>

                <Button variant="light" className="border w-100 py-2">
                <i className="fa-brands fa-google me-2 google-linear"></i>
                Continue with Google
                </Button>
               
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="heading">Email / Mobile</Form.Label>
                  <Form.Control
                    
                   className="border-0 border-bottom "
                    type="text"
                    placeholder="Enter email or mobile number"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="heading ">Password</Form.Label>
                  <Form.Control
                    className="border-0 border-bottom "
                    type="password"
                    placeholder="Enter password"
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-between mb-3 p">
                  <Form.Check label="Remember me" />
                  <a href="/forgot-password" className="text-decoration-none para">
                    Forgot password?
                  </a>
                </div>
              <div className="d-flex flex-column align-items-center ">
                <Button type="submit" variant="primary" className="w-100 mb-2">
                  Login
                </Button>
                <p>Don't have an account? <a href="#">Create Account</a></p>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;