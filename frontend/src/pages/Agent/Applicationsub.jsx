import React, { useState } from "react";
import { Container, Card, Button, Row, Col, Badge } from "react-bootstrap";
import AgentHeader from "./AgentHeader";

function Applicationsub() {

  // ✅ Mock applications data
  const [applications, setApplications] = useState([
    {
      id: 1,
      customerName: "Ramesh Kumar",
      loanType: "Home Loan",
      loanAmount: "₹45,00,000",
      mobile: "9876543210",
      status: "Pending",
      documents: ["Aadhar", "PAN", "Salary Slip", "Bank Statement"],
    },
    {
      id: 2,
      customerName: "Suresh Raj",
      loanType: "Personal Loan",
      loanAmount: "₹8,00,000",
      mobile: "9123456780",
      status: "Pending",
      documents: ["Aadhar", "PAN"],
    },
  ]);

  // ✅ Handle Accept / Reject
  const updateStatus = (id, newStatus) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
  };

  return (
    <>
      <AgentHeader />

      <Container className="mt-4">
        <h4 className="mb-4 fw-bold">📄 Applications Submitted</h4>

        {applications.length === 0 ? (
          <p className="text-muted">No applications found</p>
        ) : (
          applications.map(app => (
            <Card key={app.id} className="mb-3 shadow-sm">
              <Card.Body>
                <Row className="align-items-center">

                  {/* Left Side */}
                  <Col md={8}>
                    <h6 className="fw-bold mb-1">{app.customerName}</h6>

                    <div className="text-muted small">
                      {app.loanType} • {app.loanAmount}
                    </div>

                    <div className="text-muted small mb-2">
                      Mobile: {app.mobile}
                    </div>

                    {/* ✅ Documents Section */}
                    <div>
                      <span className="fw-semibold small">Documents:</span>
                      <div className="mt-1">
                        {app.documents.map((doc, index) => (
                          <Badge key={index} bg="secondary" className="me-1">
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Col>

                  {/* Right Side */}
                  <Col md={4} className="text-md-end mt-3 mt-md-0">
                    {app.status === "Pending" ? (
                      <>
                        <Button
                          size="sm"
                          variant="success"
                          className="me-2"
                          onClick={() => updateStatus(app.id, "Accepted")}
                        >
                          Accept
                        </Button>

                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => updateStatus(app.id, "Rejected")}
                        >
                          Reject
                        </Button>
                      </>
                    ) : (
                      <Badge
                        bg={app.status === "Accepted" ? "success" : "danger"}
                      >
                        {app.status}
                      </Badge>
                    )}
                  </Col>

                </Row>
              </Card.Body>
            </Card>
          ))
        )}
      </Container>
    </>
  );
}

export default Applicationsub;