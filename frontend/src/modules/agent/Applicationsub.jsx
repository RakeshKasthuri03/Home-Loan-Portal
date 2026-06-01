import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col, Badge } from "react-bootstrap";
import "../../styles/Applicationsub.css";
import {
  agentGetApplications,
  agentStartReview,
  agentRecommend,
  agentRequestDocs,
  agentAddRemarks,
} from "../../utils/loanApi";

const LOAN_LABELS = {
  PURCHASE: "Home Loan",
  PLOT: "Plot Loan",
  RENOVATION: "Renovation Loan",
  NRI: "NRI Loan",
  BALANCE_TRANSFER: "Balance Transfer",
};

function Applicationsub() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchApplications = async () => {
    const res = await agentGetApplications();
    if (res.success) setApplications(res.data.applications || []);
    setLoading(false);
  };

  useEffect(() => { fetchApplications(); }, []);

  const formatAmount = (amt) => {
    if (!amt) return "—";
    if (amt >= 10000000) return `₹${(amt / 10000000).toFixed(1)} Cr`;
    if (amt >= 100000) return `₹${(amt / 100000).toFixed(1)} L`;
    return `₹${amt.toLocaleString()}`;
  };

  const handleStartReview = async (id) => {
    setActionLoading(id);
    const res = await agentStartReview(id);
    setActionLoading(null);
    if (res.success) fetchApplications();
    else alert(res.error);
  };

  const handleRecommend = async (id) => {
    const rec = prompt("Enter your recommendation:");
    if (!rec) return;
    setActionLoading(id);
    const res = await agentRecommend(id, rec);
    setActionLoading(null);
    if (res.success) { alert("Recommendation submitted!"); fetchApplications(); }
    else alert(res.error);
  };

  const handleRequestDocs = async (id) => {
    const remarks = prompt("Specify which documents are needed:");
    if (!remarks) return;
    setActionLoading(id);
    const res = await agentRequestDocs(id, remarks);
    setActionLoading(null);
    if (res.success) { alert("Document request sent!"); fetchApplications(); }
    else alert(res.error);
  };

  const handleAddRemarks = async (id) => {
    const remarks = prompt("Enter your remarks:");
    if (!remarks) return;
    setActionLoading(id);
    const res = await agentAddRemarks(id, remarks);
    setActionLoading(null);
    if (res.success) { alert("Remarks added!"); fetchApplications(); }
    else alert(res.error);
  };

  const statusBadge = (status) => {
    const map = {
      submitted: "warning",
      under_review: "info",
      documents_pending: "secondary",
      approved: "success",
      rejected: "danger",
      disbursed: "primary",
    };
    return map[status] || "secondary";
  };

  if (loading) return <Container className="mt-4"><p>Loading applications...</p></Container>;

  return (
    <Container className="mt-4">
      <h4 className="mb-4 fw-bold">📄 Applications Assigned</h4>

      {applications.length === 0 ? (
        <p className="text-muted">No applications assigned to you.</p>
      ) : (
        applications.map((app) => (
          <Card key={app._id} className="application-card mb-3 shadow-sm">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={8}>
                  <h6 className="fw-bold mb-1">
                    {app.basicDetails?.fullName || `${app.user?.firstname || ""} ${app.user?.lastname || ""}`.trim() || "—"}
                  </h6>
                  <div className="text-muted small">
                    {LOAN_LABELS[app.loanType] || app.loanType} • {formatAmount(app.financialDetails?.loanAmount)}
                  </div>
                  <div className="text-muted small">
                    Mobile: {app.basicDetails?.mobile || app.user?.phone || "—"}
                  </div>
                  <div className="text-muted small mb-2">
                    ID: {app.applicationId} • Applied: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "—"}
                  </div>
                  <Badge bg={statusBadge(app.status)}>
                    {app.status?.replace(/_/g, " ")}
                  </Badge>
                </Col>
                <Col md={4} className="text-md-end mt-3 mt-md-0">
                  {actionLoading === app._id ? (
                    <span className="text-muted">Processing...</span>
                  ) : (
                    <div className="d-flex flex-column gap-2 align-items-md-end">
                      {(app.status === "submitted" || app.status === "documents_pending") && (
                        <Button size="sm" variant="primary" onClick={() => handleStartReview(app._id)}>
                          Start Review
                        </Button>
                      )}
                      {app.status === "under_review" && (
                        <>
                          <Button size="sm" variant="success" onClick={() => handleRecommend(app._id)}>
                            Recommend
                          </Button>
                          <Button size="sm" variant="warning" onClick={() => handleRequestDocs(app._id)}>
                            Request Docs
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline-secondary" onClick={() => handleAddRemarks(app._id)}>
                        Add Remarks
                      </Button>
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}

export default Applicationsub;
