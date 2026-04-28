import { useState } from "react";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/logo.png";
import login from "../../assets/login.png";
import { loginUser } from "../../utils/auth";
import '../../Styles/Login.css';

const Login = ({ closeModal }) => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword]     = useState("");
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const result = loginUser(identifier, password);
      setLoading(false);

      if (result.success) {
        if (closeModal) closeModal();
        if (result.user.role === "agent") {
          navigate("/agent");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(result.error);
      }
    }, 600); // small delay for UX feel
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
              <Button
                type="button"
                className="btn btn-light position-absolute top-0 end-0"
                onClick={closeModal}
              >
                <FontAwesomeIcon icon={faXmark} />
              </Button>

              <div className="text-center mb-4">
                <Image src={logo} height={60} className="mb-3" />
                <h1 className="h4 fw-bold heading">Login to Your Account</h1>
                <Button variant="light" className="border w-100 py-2 mt-2">
                  <i className="fa-brands fa-google me-2 google-linear"></i>
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
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="heading">Password</Form.Label>
                  <Form.Control
                    className="border-0 border-bottom"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-between mb-3">
                  <Form.Check label="Remember me" />
                  <a href="/forgot-password" className="text-decoration-none para">
                    Forgot password?
                  </a>
                </div>

                {/* Demo hint */}
                <div className="demo-hint">
                  <strong>Demo:</strong> rahul@gmail.com / rahul123
                </div>

                <div className="d-flex flex-column align-items-center mt-3">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100 mb-2"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Login"}
                  </Button>
                  <p className="mb-0">
                    Don't have an account? <a href="#">Create Account</a>
                  </p>
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
