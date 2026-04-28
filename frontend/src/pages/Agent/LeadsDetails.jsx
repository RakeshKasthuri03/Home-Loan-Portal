import React, { useState } from "react";
import usersData from "./users.json";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import AgentHeader from "./AgentHeader";
import AgentUserDetails from "./AgentUserdetails";
import "../../Styles/Agentheader.css";
import "../../Styles/LeadDetails.css";

function LeadsDetails() {
  // ✅ Find agent
  const agent = usersData.find(a => a.agentName === "Arun Kumar");

  // ✅ Modal state
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ Safety guard
  if (!agent || !Array.isArray(agent.users)) {
    return (
      <>
        <AgentHeader />
        <Container className="mt-5 text-center">
          <p className="text-muted">No leads found for this agent.</p>
        </Container>
      </>
    );
  }

  // ✅ Status badge helper
  const statusVariant = (status = "") => {
    if (status === "Approved") return "success";
    if (status.includes("Pending")) return "warning";
    if (status === "Submitted") return "primary";
    return "secondary";
  };

  return (
    <>
      <AgentHeader />

      {/* ── DASHBOARD SUMMARY ───────────────────────── */}
      <Container className="mt-4">
        <Row className="g-3">
          <Col md={3}>
            <Card className="agent-stat-card">
              <div className="stat-title">Customers referred</div>
              <div className="stat-value">18</div>
              <div className="stat-sub">This quarter</div>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="agent-stat-card">
              <div className="stat-title">Loans closed</div>
              <div className="stat-value ">11</div>
              <div className="stat-sub">61% conversion</div>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="agent-stat-card">
              <div className="stat-title">Total loan value</div>
              <div className="stat-value">₹4.2Cr</div>
              <div className="stat-sub">Disbursed this quarter</div>
            </Card>
          </Col>

          <Col md={3}>
            <Card className="agent-stat-card">
              <div className="stat-title">Commission</div>
              <div className="stat-value ">₹84K</div>
              <div className="stat-sub">Pending: ₹21K</div>
            </Card>
          </Col>
        </Row>

        {/* ── MONTHLY TARGETS ───────────────────────── */}
       <Card className="agent-target-card mt-4">
  <div className="d-flex justify-content-between mb-3">
    <h6 className="mb-0">Monthly targets — April 2025</h6>
    <span className="text-muted small">22 days remaining</span>
  </div>

  <div className="target-row">
    <span>Customers referred</span>
    <div className="target-bar indigo" style={{ width: "80%" }} />
  </div>

  <div className="target-row">
    <span>Loans closed</span>
    <div className="target-bar emerald" style={{ width: "65%" }} />
  </div>

  <div className="target-row">
    <span>Loan value disbursed</span>
    <div className="target-bar amber" style={{ width: "72%" }} />
    <div className="target-amount">₹1.8Cr</div>
  </div>
</Card>
      </Container>

      {/* ── LEADS SECTION ─────────────────────────── */}
      <div className="LeadsDetails">
        <Container className="mt-5">
          {/* Page title */}
          <div className="mb-4">
            <h4 className="mb-1">Lead Details</h4>
            <p className="text-muted">
              Leads handled by <strong>{agent.agentName}</strong>
            </p>
          </div>

          {/* Lead Cards */}
          <Row className="g-4">
            {agent.users.map(user => (
              <Col md={4} sm={6} xs={12} key={user.id}>
                <Card
                  className="lead-profile-card text-center shadow-sm position-relative"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedUser(user);
                    setShowUserModal(true);
                  }}
                >
                  <Card.Body>
                    {/* Status */}
                    <Badge
                      bg={statusVariant(user.status)}
                      className="position-absolute top-0 end-0 m-2"
                    >
                      {user.status || "Unknown"}
                    </Badge>

                    {/* Avatar */}
                    <Image
                      src={user.avatar || "https://via.placeholder.com/90"}
                      roundedCircle
                      width={90}
                      height={90}
                      className="mb-3"
                    />

                    <h6 className="fw-semibold mb-1">{user.name}</h6>
                    <div className="text-muted small mb-2">{user.phone}</div>

                    <div className="small text-muted">
                      <div><strong>Bank:</strong> {user.bank}</div>
                      <div><strong>Loan:</strong> {user.loanAmount}</div>
                    </div>

                    <div className="mt-3">
                      <span className="view-profile-text">VIEW DETAILS</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* ── USER DETAILS MODAL ───────────────────── */}
      <AgentUserDetails
        show={showUserModal}
        user={selectedUser}
        onClose={() => setShowUserModal(false)}
      />
    </>
  );
}

export default LeadsDetails;
``