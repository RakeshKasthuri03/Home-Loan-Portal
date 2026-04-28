import React from "react";
import {
  Modal,
  Container,
  Image,
  Button,
  Row,
  Col,
  Card,
  Badge,
} from "react-bootstrap";

function AgentUserDetails({ show, onClose, user }) {
  if (!user) return null;

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Body>
        <Container className="p-4">

          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Customer Details</h5>
            <Button variant="outline-secondary" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>

          {/* Profile */}
          <div className="text-center mb-4">
            <Image
              src={user.avatar}
              roundedCircle
              width={90}
              height={90}
              className="mb-2"
            />
            <h5>{user.name}</h5>
            <p className="text-muted mb-0">{user.phone}</p>
            <Badge bg="primary" className="mt-1">{user.bank}</Badge>
          </div>

          {/* User Info */}
          <Card className="mb-4">
            <Card.Body>
              <Row className="gy-2">
                <Col xs={6}><strong>Email</strong></Col>
                <Col xs={6}>{user.email}</Col>

                <Col xs={6}><strong>Loan Amount</strong></Col>
                <Col xs={6}>{user.loanAmount}</Col>

                <Col xs={6}><strong>Status</strong></Col>
                <Col xs={6}>
                  <Badge bg={user.status?.includes("Pending") ? "warning" : "success"}>
                    {user.status}
                  </Badge>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Documents Section */}
          <h6 className="mb-3">Submitted Documents</h6>

          <Row className="g-3">
            {user.documents.map((doc, index) => (
              <Col md={4} key={index}>
                <Card className="text-center shadow-sm h-100">
                  <Card.Body>
                    <Image
                      src="/folder-icon.png"
                      width={40}
                      className="mb-2"
                    />
                    <div className="fw-semibold">{doc.name}</div>
                    <Badge
                      bg={doc.status === "Verified" ? "success" : "warning"}
                      className="mt-2"
                    >
                      {doc.status}
                    </Badge>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

        </Container>
      </Modal.Body>
    </Modal>
  );
}

export default AgentUserDetails;