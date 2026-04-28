import React from "react";
import { Container, Image, Button, Row, Col, Card } from "react-bootstrap";
function AgentDashboard({agent, closeModal }) {
//   const agent = {
//     name: "Arun Kumar",
//     email: "arun.kumar@loanportal.com",
//     gender: "Male",
//     phone: "+91 98765 43210",
//     address: "Coimbatore, Tamil Nadu",
//     loansGiven: 42,
//     photo: "https://via.placeholder.com/100",
//   };
  return (
    <>
    <div>
        

    <Container className="p-4 bg-white  rounded shadow" style={{ maxWidth: "500px" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Agent Profile</h5>
        <Button variant="outline-secondary" size="sm" onClick={closeModal}>
          ✕
        </Button>
      </div>

 {/* Profile Info */}
      <div className="text-center mb-3">
      <Image src={agent.photo} roundedCircle width={100} height={100} />
      <h5 className="mt-2">{agent.name}</h5>
      <p className="text-muted mb-0">{agent.email}</p>
      </div>
      <Card className="border-0">
       <Card.Body className="p-0">
             <Row className="gy-2">
            <Col xs={6}><strong>Gender</strong></Col>
            <Col xs={6}>{agent.gender}</Col>


            <Col xs={6}><strong>Phone</strong></Col>
            <Col xs={6}>{agent.phone}</Col>


            <Col xs={6}><strong>Address</strong></Col>
            <Col xs={6}>{agent.address}</Col>


            <Col xs={6}><strong>Loans Given</strong></Col>
            <Col xs={6}>{agent.loansGiven}</Col>
        </Row>
       </Card.Body>
     </Card>
  </Container>
    </div>
    </>
  );
}

export default AgentDashboard;