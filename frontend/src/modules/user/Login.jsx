import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import google from "../../assets/google.png";
import logo from "../../assets/logo.png";
import login from "../../assets/login.png";
import { saveAuth } from "../../utils/auth";
import "../../styles/Login.css";

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ForgotPasswordModal from '../../Components/ForgotPasswordModal';

const Login = ({ closeModal, openRegister, onLoginSuccess }) => {
  const navigate = useNavigate();
  
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [showForgot, setShowForgot] = useState(false);
     

    
    
   
const handleSubmit = async (e) => {
  try {
  e.preventDefault();
  console.log("Submitting Login with credentials:", credentials);

    setError("");
    setLoading(true);

    const res = await axios.post('http://localhost:5000/signin',credentials);

    const token = res.data.token;
    const user = res.data.result;
   
    console.log("Login Response:", res.data);
    
    // Save auth data with role
    saveAuth(user, token);
    
    if (res.status === 200) {
      toast.success("Login successful..!");
      if (closeModal) closeModal();
      if (onLoginSuccess) onLoginSuccess();
      if (!onLoginSuccess) {
        console.log("Navigating to dashboard...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    }

  } catch (error) {
    console.error("Login Error:", error);
      toast.error(error?.response?.data?.message || "Login failed. Please try again.");
    setError(
      error?.response?.data?.message || "Login failed. Please try again."
    );
  } finally {
    setLoading(false);
  }
};


  
  return (
    <div className="Login">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="d-none d-md-block">
            <Image src={login} fluid />
          </Col>

          <Col md={6}>
            <div className="login-box position-relative">
              {closeModal && (
                <Button
                  type="button"
                  className="btn btn-light position-absolute top-0 end-0"
                  onClick={closeModal}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </Button>
              )}

              <div className="text-center mb-4">
                <Image src={logo} height={60} className="mb-3" />
                <h1 className="h4 fw-bold heading">Login to Your Account</h1>
                <Button variant="light" className="border w-100 py-2 mt-2"
                 >
                  <Image src={google} height={20} className="me-2 google-linear" />
                  Continue with Google
                </Button>
              </div>

              {error && (
                <div className="alert alert-danger py-2 text-center" style={{ fontSize: "0.85rem" }}>
                  {error}
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="heading">Email / Mobile</Form.Label>
                  <Form.Control
                    className="border-0 border-bottom"
                    type="text"
                    placeholder="Enter email or mobile number"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="heading">Password</Form.Label>
                  <Form.Control
                    className="border-0 border-bottom"
                    type="password"
                    placeholder="Enter password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-between mb-3">
                  <Form.Check label="Remember me" />
                  <button type="button" className="btn btn-link p-0 para" onClick={() => setShowForgot(true)}>
                    Forgot password?
                  </button>
                </div>

                {/* <div className="demo-hint">
                  <strong>Customer:</strong> rahul@gmail.com / rahul123<br />
                  <strong>Agent:</strong> agent@mlrr.com / agent123<br />
                  <strong>Admin:</strong> admin@mlrr.com / admin123
                </div> */}

                <div className="d-flex flex-column align-items-center mt-3">
                  <Button type="submit" variant="primary" className="w-100 mb-2" disabled={loading}>
                    {loading ? "Signing in..." : "Login"}
                  </Button>
                  <p>
                    Don't have an account?{" "}
                    <a
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        if (openRegister) openRegister();
                      }}
                    >
                      Create Account
                    </a>
                  </p>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <ForgotPasswordModal open={showForgot} onClose={() => setShowForgot(false)} />
    </div>
  );
};

export default Login;
