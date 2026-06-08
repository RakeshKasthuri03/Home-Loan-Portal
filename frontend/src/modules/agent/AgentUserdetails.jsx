import React, { useState } from "react";
import {
  Modal,
  Container,
  Button,
  Row,
  Col,
  Card,
  Badge,
  Tab,
  Nav,
  Table,
  ProgressBar,
} from "react-bootstrap";
import { agentStartReview, agentRecommend, agentRequestDocs, agentAddRemarks, agentVerifyDoc } from "../../utils/loanApi";

const LOAN_LABELS = {
  PURCHASE: "Home Loan",
  PLOT: "Plot Loan",
  RENOVATION: "Renovation Loan",
  NRI: "NRI Loan",
  BALANCE_TRANSFER: "Balance Transfer",
};

const DOC_NAMES = {
  panDoc: "PAN Card",
  aadharDoc: "Aadhaar Card",
  photoDoc: "Passport Photo",
  salarySlip: "Salary Slip",
  bankStatement: "Bank Statement",
  itr: "ITR / Form 16",
  propertyDoc: "Property Documents",
  agreementCopy: "Agreement Copy",
  nocCert: "NOC Certificate",
  passportDoc: "Passport Copy",
  visaDoc: "Visa Copy",
  overseasAddressProof: "Overseas Address Proof",
  poaDoc: "Power of Attorney",
  plotDoc: "Plot Documents",
  encumbrance: "Encumbrance Certificate",
  renovationEstimate: "Renovation Estimate",
  renovationQuote: "Renovation Quote",
  loanStatement: "Loan Statement",
  foreclosureLetter: "Foreclosure Letter",
};

const STATUS_COLORS = {
  draft: { bg: "#f3f4f6", color: "#6b7280" },
  submitted: { bg: "#fef3c7", color: "#92400e" },
  under_review: { bg: "#dbeafe", color: "#1e40af" },
  documents_pending: { bg: "#fce7f3", color: "#9d174d" },
  approved: { bg: "#dcfce7", color: "#166534" },
  rejected: { bg: "#fee2e2", color: "#991b1b" },
  disbursed: { bg: "#d1fae5", color: "#065f46" },
};

function AgentUserDetails({ show, onClose, application, onRefresh }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [actionLoading, setActionLoading] = useState(false);
  const [remarkText, setRemarkText] = useState("");

  if (!application) return null;
  const app = application;

  // Derived values
  const name = app.basicDetails?.fullName || `${app.user?.firstname || ""} ${app.user?.lastname || ""}`.trim() || "—";
  const email = app.basicDetails?.email || app.user?.email || "—";
  const phone = app.basicDetails?.mobile || app.user?.phone || "—";

  const formatAmount = (amt) => {
    if (!amt) return "—";
    if (amt >= 10000000) return `₹${(amt / 10000000).toFixed(2)} Cr`;
    if (amt >= 100000) return `₹${(amt / 100000).toFixed(2)} L`;
    return `₹${Number(amt).toLocaleString("en-IN")}`;
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  // Document processing
  const docs = [];
  if (app.documents) {
    Object.entries(app.documents).forEach(([key, value]) => {
      if (key === "_id" || key === "$init") return;
      if (value && typeof value === "object" && value.url) {
        docs.push({ key, name: DOC_NAMES[key] || key, url: value.url, status: value.status || "pending", uploadedAt: value.uploadedAt });
      } else if (value && typeof value === "string" && value.startsWith("http")) {
        docs.push({ key, name: DOC_NAMES[key] || key, url: value, status: "pending", uploadedAt: null });
      }
    });
  }

  const docStats = {
    total: docs.length,
    verified: docs.filter(d => d.status === "verified").length,
    pending: docs.filter(d => d.status === "pending").length,
    rejected: docs.filter(d => d.status === "rejected").length,
    processed: docs.filter(d => d.status === "processed").length,
  };

  // Timeline
  const timeline = [];
  if (app.createdAt) timeline.push({ label: "Application Created", date: app.createdAt });
  if (app.processing?.submittedAt) timeline.push({ label: "Submitted", date: app.processing.submittedAt });
  if (app.processing?.reviewedAt) timeline.push({ label: "Review Started", date: app.processing.reviewedAt });
  if (app.processing?.approvedAt) timeline.push({ label: "Approved", date: app.processing.approvedAt });
  if (app.processing?.rejectedAt) timeline.push({ label: "Rejected", date: app.processing.rejectedAt });
  if (app.processing?.disbursedAt) timeline.push({ label: "Disbursed", date: app.processing.disbursedAt });
  timeline.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Actions
  const handleAction = async (action) => {
    setActionLoading(true);
    let res;
    switch (action) {
      case "start_review":
        res = await agentStartReview(app._id);
        break;
      case "recommend": {
        const rec = prompt("Enter your recommendation for this application:");
        if (!rec) { setActionLoading(false); return; }
        res = await agentRecommend(app._id, rec);
        break;
      }
      case "request_docs": {
        const docReq = prompt("Specify which documents are needed:");
        if (!docReq) { setActionLoading(false); return; }
        res = await agentRequestDocs(app._id, docReq);
        break;
      }
      default: break;
    }
    setActionLoading(false);
    if (res?.success) {
      // notify parent to refresh
      if (onRefresh) onRefresh();
      // dispatch a global event so other dashboards can update
      try { window.dispatchEvent(new CustomEvent('mlrr:application-updated', { detail: { id: app._id, type: 'recommendation' } })); } catch(e){}
    }
    else if (res && !res.success) alert(res.error || "Action failed");
  };

  const handleAddRemark = async () => {
    if (!remarkText.trim()) return;
    setActionLoading(true);
    const res = await agentAddRemarks(app._id, remarkText);
    setActionLoading(false);
    if (res?.success) {
      setRemarkText("");
      if (onRefresh) onRefresh();
      try { window.dispatchEvent(new CustomEvent('mlrr:application-updated', { detail: { id: app._id, type: 'remark' } })); } catch(e){}
    } else alert(res?.error || "Failed to add remark");
  };

  const handleDocAction = async (docKey, status) => {
    setActionLoading(true);
    const res = await agentVerifyDoc(app._id, docKey, status);
    setActionLoading(false);
    if (res?.success && onRefresh) onRefresh();
    else if (res && !res.success) alert(res.error || "Failed");
  };

  // Render helpers
  const InfoRow = ({ label, value }) => {
    if (!value && value !== 0) return null;
    return (
      <div style={{ display: "flex", padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
        <div style={{ width: "40%", fontWeight: 600, fontSize: "0.84rem", color: "#374151" }}>{label}</div>
        <div style={{ width: "60%", fontSize: "0.84rem", color: "#1f2937" }}>{value}</div>
      </div>
    );
  };

  const SectionCard = ({ title, children }) => (
    <Card className="mb-3" style={{ border: "1px solid #e5e7eb", borderRadius: "10px" }}>
      <Card.Body style={{ padding: "20px" }}>
        <h6 style={{ fontWeight: 700, color: "#0f2557", marginBottom: "14px", fontSize: "0.95rem", borderBottom: "2px solid #e5e7eb", paddingBottom: "8px" }}>
          {title}
        </h6>
        {children}
      </Card.Body>
    </Card>
  );

  return (
    <Modal show={show} onHide={onClose} fullscreen dialogClassName="agent-detail-modal">
      <Modal.Header style={{ background: "#0f2557", color: "#fff", padding: "16px 28px", border: "none" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.2rem", fontWeight: 800, color: "#fff",
            }}>
              {name[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h5 style={{ margin: 0, fontWeight: 700, color: "#fff" }}>{name}</h5>
              <div style={{ fontSize: "0.82rem", opacity: 0.8 }}>
                {app.applicationId} &bull; {LOAN_LABELS[app.loanType] || app.loanType} &bull; {formatAmount(app.financialDetails?.loanAmount)}
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{
            padding: "5px 14px", borderRadius: "100px", fontSize: "0.78rem", fontWeight: 700,
            background: STATUS_COLORS[app.status]?.bg || "#f3f4f6",
            color: STATUS_COLORS[app.status]?.color || "#6b7280",
          }}>
            {app.status?.replace(/_/g, " ").toUpperCase()}
          </span>
          <Button variant="light" size="sm" onClick={onClose} style={{ fontWeight: 700 }}>Close</Button>
        </div>
      </Modal.Header>

      <Modal.Body style={{ padding: 0, background: "#f8f9fc" }}>
        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          {/* Tab Navigation */}
          <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 28px" }}>
            <Nav variant="tabs" style={{ borderBottom: "none" }}>
                {[
                { key: "overview", label: "Overview" },
                { key: "personal", label: "Personal & Employment" },
                { key: "financial", label: "Financial & Loan" },
                { key: "property", label: "Property / Asset" },
                { key: "documents", label: `Documents (${docs.length})` },
                { key: "timeline", label: "Timeline & Remarks" },
                { key: "actions", label: "Actions" },
                { key: "raw", label: "Raw Data" },
              ].map(tab => (
                <Nav.Item key={tab.key}>
                  <Nav.Link
                    eventKey={tab.key}
                    style={{
                      fontWeight: 600, fontSize: "0.84rem", color: activeTab === tab.key ? "#0f2557" : "#6b7280",
                      borderBottom: activeTab === tab.key ? "3px solid #0f2557" : "3px solid transparent",
                      borderTop: "none", borderLeft: "none", borderRight: "none",
                      background: "transparent", padding: "14px 18px",
                    }}
                  >
                    {tab.label}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </div>

          {/* Tab Content */}
          <Container style={{ padding: "28px", maxWidth: "1200px" }}>
            <Tab.Content>
              {/* ═══════════ OVERVIEW TAB ═══════════ */}
              <Tab.Pane eventKey="overview">
                {/* Quick Summary Cards */}
                <Row className="g-3 mb-4">
                  <Col md={3}>
                    <Card style={{ border: "none", borderRadius: "10px", background: "#eff6ff" }}>
                      <Card.Body className="text-center" style={{ padding: "20px" }}>
                        <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1e40af" }}>
                          {formatAmount(app.financialDetails?.loanAmount)}
                        </div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6b7280" }}>Loan Amount</div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card style={{ border: "none", borderRadius: "10px", background: "#f0fdf4" }}>
                      <Card.Body className="text-center" style={{ padding: "20px" }}>
                        <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#166534" }}>
                          {app.financialDetails?.loanTenure || "—"}
                        </div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6b7280" }}>Tenure (Years)</div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card style={{ border: "none", borderRadius: "10px", background: "#fef3c7" }}>
                      <Card.Body className="text-center" style={{ padding: "20px" }}>
                        <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#92400e" }}>
                          {app.financialDetails?.cibilScore || "—"}
                        </div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6b7280" }}>CIBIL Score</div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card style={{ border: "none", borderRadius: "10px", background: "#fce7f3" }}>
                      <Card.Body className="text-center" style={{ padding: "20px" }}>
                        <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#9d174d" }}>
                          {docStats.verified}/{docStats.total}
                        </div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6b7280" }}>Docs Verified</div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Document Verification Progress */}
                {docStats.total > 0 && (
                  <Card className="mb-4" style={{ border: "1px solid #e5e7eb", borderRadius: "10px" }}>
                    <Card.Body>
                      <div className="d-flex justify-content-between mb-2">
                                   <Button
                                     variant="success"
                                     onClick={() => handleAction("recommend")}
                                     disabled={(() => {
                                       const remarks = app.processing?.remarks || [];
                                       const rec = [...remarks].reverse().find(r => typeof r.text === 'string' && r.text.toLowerCase().includes('agent recommendation'));
                                       return !!rec;
                                     })()}
                                     style={{ fontWeight: 600 }}
                                   >
                                     {(() => {
                                       const remarks = app.processing?.remarks || [];
                                       const rec = [...remarks].reverse().find(r => typeof r.text === 'string' && r.text.toLowerCase().includes('agent recommendation'));
                                       return rec ? 'Recommended' : 'Recommend for Approval';
                                     })()}
                                   </Button>
                        <span style={{ color: "#16a34a" }}>Verified: {docStats.verified}</span>
                        <span style={{ color: "#f59e0b" }}>Pending: {docStats.pending}</span>
                        <span style={{ color: "#dc2626" }}>Rejected: {docStats.rejected}</span>
                      </div>
                    </Card.Body>
                  </Card>
                )}

                {/* Key Info Grid */}
                <Row className="g-3">
                  <Col md={6}>
                    <SectionCard title="Applicant Summary">
                      <InfoRow label="Full Name" value={name} />
                      <InfoRow label="Mobile" value={phone} />
                      <InfoRow label="Email" value={email} />
                      <InfoRow label="PAN Card" value={app.basicDetails?.panCard} />
                      <InfoRow label="City" value={app.basicDetails?.city} />
                      <InfoRow label="Employment" value={app.employmentDetails?.employmentType} />
                      <InfoRow label="Monthly Income" value={app.employmentDetails?.monthlyIncome ? `₹${Number(app.employmentDetails.monthlyIncome).toLocaleString("en-IN")}` : null} />
                    </SectionCard>
                  </Col>
                  <Col md={6}>
                    <SectionCard title="Loan Summary">
                      <InfoRow label="Loan Type" value={LOAN_LABELS[app.loanType] || app.loanType} />
                      <InfoRow label="Application ID" value={app.applicationId} />
                      <InfoRow label="Status" value={app.status?.replace(/_/g, " ").toUpperCase()} />
                      <InfoRow label="Loan Amount" value={formatAmount(app.financialDetails?.loanAmount)} />
                      <InfoRow label="Tenure" value={app.financialDetails?.loanTenure ? `${app.financialDetails.loanTenure} years` : null} />
                      <InfoRow label="Applied On" value={formatDate(app.createdAt)} />
                      <InfoRow label="Days Since Applied" value={app.createdAt ? Math.floor((Date.now() - new Date(app.createdAt).getTime()) / 86400000) : null} />
                    </SectionCard>
                  </Col>
                </Row>

                {/* Co-Applicant Quick View */}
                {app.coApplicant?.hasCoApplicant && app.coApplicant.hasCoApplicant !== "No" && (
                  <SectionCard title="Co-Applicant">
                    <Row>
                      <Col md={6}><InfoRow label="Name" value={app.coApplicant.coApplicantName} /></Col>
                      <Col md={6}><InfoRow label="Relation" value={app.coApplicant.hasCoApplicant} /></Col>
                      <Col md={6}><InfoRow label="Income" value={app.coApplicant.coApplicantIncome ? `₹${Number(app.coApplicant.coApplicantIncome).toLocaleString("en-IN")}` : null} /></Col>
                      <Col md={6}><InfoRow label="PAN" value={app.coApplicant.coApplicantPAN} /></Col>
                    </Row>
                  </SectionCard>
                )}
              </Tab.Pane>

              {/* ═══════════ RAW DATA TAB ═══════════ */}
              <Tab.Pane eventKey="raw">
                <SectionCard title="Raw Application JSON">
                  <div style={{ maxHeight: '60vh', overflowY: 'auto', background: '#0f1724', color: '#e6f1ff', padding: 12, borderRadius: 6 }}>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.78rem' }}>
{JSON.stringify(app, null, 2)}
                    </pre>
                  </div>
                </SectionCard>
              </Tab.Pane>

              {/* ═══════════ PERSONAL & EMPLOYMENT TAB ═══════════ */}
              <Tab.Pane eventKey="personal">
                <Row className="g-3">
                  <Col md={6}>
                    <SectionCard title="Personal Information">
                      <InfoRow label="Full Name" value={app.basicDetails?.fullName} />
                      <InfoRow label="Date of Birth" value={formatDate(app.basicDetails?.dob)} />
                      <InfoRow label="Gender" value={app.basicDetails?.gender} />
                      <InfoRow label="Mobile" value={app.basicDetails?.mobile} />
                      <InfoRow label="Email" value={app.basicDetails?.email} />
                      <InfoRow label="PAN Card" value={app.basicDetails?.panCard} />
                      <InfoRow label="Aadhaar (Last 4)" value={app.basicDetails?.aadharLast4} />
                      <InfoRow label="Marital Status" value={app.basicDetails?.maritalStatus} />
                    </SectionCard>
                  </Col>
                  <Col md={6}>
                    <SectionCard title="Address Details">
                      <InfoRow label="Residential Address" value={app.basicDetails?.residentialAddress} />
                      <InfoRow label="City" value={app.basicDetails?.city} />
                      <InfoRow label="State" value={app.basicDetails?.state} />
                      <InfoRow label="PIN Code" value={app.basicDetails?.pinCode} />
                    </SectionCard>

                    {/* NRI Specific */}
                    {(app.basicDetails?.passport || app.basicDetails?.countryOfResidence || app.basicDetails?.visaType || app.basicDetails?.overseasMobile) && (
                      <SectionCard title="NRI Information">
                        <InfoRow label="Passport Number" value={app.basicDetails?.passport} />
                        <InfoRow label="Country of Residence" value={app.basicDetails?.countryOfResidence} />
                        <InfoRow label="Visa Type" value={app.basicDetails?.visaType} />
                        <InfoRow label="Overseas Mobile" value={app.basicDetails?.overseasMobile} />
                      </SectionCard>
                    )}
                  </Col>
                </Row>

                <SectionCard title="Employment Details">
                  <Row>
                    <Col md={6}>
                      <InfoRow label="Employment Type" value={app.employmentDetails?.employmentType} />
                      <InfoRow label="Company Name" value={app.employmentDetails?.companyName} />
                      <InfoRow label="Designation" value={app.employmentDetails?.designation} />
                      <InfoRow label="Work Experience" value={app.employmentDetails?.workExperience ? `${app.employmentDetails.workExperience} years` : null} />
                    </Col>
                    <Col md={6}>
                      <InfoRow label="Monthly Income" value={app.employmentDetails?.monthlyIncome ? `₹${Number(app.employmentDetails.monthlyIncome).toLocaleString("en-IN")}` : null} />
                      <InfoRow label="Income Currency" value={app.employmentDetails?.incomeCurrency} />
                      <InfoRow label="Office Address" value={app.employmentDetails?.officeAddress} />
                    </Col>
                  </Row>
                </SectionCard>

                {/* Co-Applicant Full Details */}
                {app.coApplicant?.hasCoApplicant && app.coApplicant.hasCoApplicant !== "No" && (
                  <SectionCard title="Co-Applicant Details">
                    <Row>
                      <Col md={6}>
                        <InfoRow label="Has Co-Applicant" value={app.coApplicant.hasCoApplicant} />
                        <InfoRow label="Name" value={app.coApplicant.coApplicantName} />
                        <InfoRow label="Relation" value={app.coApplicant.coApplicantRelation} />
                      </Col>
                      <Col md={6}>
                        <InfoRow label="Mobile" value={app.coApplicant.coApplicantMobile} />
                        <InfoRow label="Monthly Income" value={app.coApplicant.coApplicantIncome ? `₹${Number(app.coApplicant.coApplicantIncome).toLocaleString("en-IN")}` : null} />
                        <InfoRow label="PAN Card" value={app.coApplicant.coApplicantPAN} />
                      </Col>
                    </Row>
                  </SectionCard>
                )}
              </Tab.Pane>

              {/* ═══════════ FINANCIAL & LOAN TAB ═══════════ */}
              <Tab.Pane eventKey="financial">
                <SectionCard title="Financial Details">
                  <Row>
                    <Col md={6}>
                      <InfoRow label="Requested Loan Amount" value={formatAmount(app.financialDetails?.loanAmount)} />
                      <InfoRow label="Loan Tenure" value={app.financialDetails?.loanTenure ? `${app.financialDetails.loanTenure} years` : null} />
                      <InfoRow label="Existing Loans" value={app.financialDetails?.existingLoans} />
                      <InfoRow label="Existing EMI" value={app.financialDetails?.existingEMI ? `₹${Number(app.financialDetails.existingEMI).toLocaleString("en-IN")}` : null} />
                    </Col>
                    <Col md={6}>
                      <InfoRow label="Bank Name" value={app.financialDetails?.bankName} />
                      <InfoRow label="Account Type" value={app.financialDetails?.accountType} />
                      <InfoRow label="CIBIL Score" value={app.financialDetails?.cibilScore} />
                      <InfoRow label="NRE Account" value={app.financialDetails?.nreAccount} />
                      <InfoRow label="Remittance Mode" value={app.financialDetails?.remittanceMode} />
                    </Col>
                  </Row>
                </SectionCard>

                {/* Balance Transfer */}
                {app.balanceTransferDetails && Object.values(app.balanceTransferDetails).some(v => v) && (
                  <SectionCard title="Balance Transfer Details">
                    <Row>
                      <Col md={6}>
                        <InfoRow label="Current Bank" value={app.balanceTransferDetails.currentBank} />
                        <InfoRow label="Current Loan Amount" value={formatAmount(app.balanceTransferDetails.currentLoanAmount)} />
                        <InfoRow label="Current EMI" value={app.balanceTransferDetails.currentEMI ? `₹${Number(app.balanceTransferDetails.currentEMI).toLocaleString("en-IN")}` : null} />
                        <InfoRow label="Current ROI" value={app.balanceTransferDetails.currentROI ? `${app.balanceTransferDetails.currentROI}%` : null} />
                      </Col>
                      <Col md={6}>
                        <InfoRow label="Loan Start Date" value={formatDate(app.balanceTransferDetails.loanStartDate)} />
                        <InfoRow label="Remaining Tenure" value={app.balanceTransferDetails.remainingTenure ? `${app.balanceTransferDetails.remainingTenure} years` : null} />
                        <InfoRow label="Loan Account No" value={app.balanceTransferDetails.loanAccountNo} />
                        <InfoRow label="Top-Up Required" value={app.balanceTransferDetails.topUpRequired} />
                      </Col>
                    </Row>
                  </SectionCard>
                )}

                {/* Sanctioned Details */}
                {app.sanctionedDetails && Object.values(app.sanctionedDetails).some(v => v) && (
                  <SectionCard title="Sanctioned Details">
                    <Row>
                      <Col md={6}>
                        <InfoRow label="Sanctioned Amount" value={formatAmount(app.sanctionedDetails.sanctionedAmount)} />
                        <InfoRow label="Sanctioned Tenure" value={app.sanctionedDetails.sanctionedTenure} />
                        <InfoRow label="Interest Rate" value={app.sanctionedDetails.interestRate ? `${app.sanctionedDetails.interestRate}%` : null} />
                      </Col>
                      <Col md={6}>
                        <InfoRow label="EMI Amount" value={app.sanctionedDetails.emiAmount ? `₹${Number(app.sanctionedDetails.emiAmount).toLocaleString("en-IN")}` : null} />
                        <InfoRow label="Processing Fee" value={app.sanctionedDetails.processingFee ? `₹${Number(app.sanctionedDetails.processingFee).toLocaleString("en-IN")}` : null} />
                        <InfoRow label="Sanction Date" value={formatDate(app.sanctionedDetails.sanctionDate)} />
                      </Col>
                    </Row>
                  </SectionCard>
                )}

                {/* Disbursement */}
                {app.disbursement && Object.values(app.disbursement).some(v => v) && (
                  <SectionCard title="Disbursement Details">
                    <Row>
                      <Col md={6}>
                        <InfoRow label="Disbursed Amount" value={formatAmount(app.disbursement.disbursedAmount)} />
                        <InfoRow label="Disbursement Date" value={formatDate(app.disbursement.disbursementDate)} />
                      </Col>
                      <Col md={6}>
                        <InfoRow label="Account Number" value={app.disbursement.accountNumber} />
                        <InfoRow label="IFSC Code" value={app.disbursement.ifscCode} />
                        <InfoRow label="Transaction Ref" value={app.disbursement.transactionRef} />
                      </Col>
                    </Row>
                  </SectionCard>
                )}
              </Tab.Pane>

              {/* ═══════════ PROPERTY / ASSET TAB ═══════════ */}
              <Tab.Pane eventKey="property">
                {/* Property Details */}
                {app.propertyDetails && Object.values(app.propertyDetails).some(v => v) && (
                  <SectionCard title="Property Details">
                    <Row>
                      <Col md={6}>
                        <InfoRow label="Property Type" value={app.propertyDetails.propertyType} />
                        <InfoRow label="Property Location" value={app.propertyDetails.propertyLocation} />
                        <InfoRow label="Property Value" value={formatAmount(app.propertyDetails.propertyValue)} />
                        <InfoRow label="Builder / Developer" value={app.propertyDetails.builderName} />
                      </Col>
                      <Col md={6}>
                        <InfoRow label="Possession Status" value={app.propertyDetails.possessionStatus} />
                        <InfoRow label="Property Address" value={app.propertyDetails.propertyAddress} />
                        <InfoRow label="POA Holder (NRI)" value={app.propertyDetails.poaHolder} />
                      </Col>
                    </Row>
                  </SectionCard>
                )}

                {/* Plot Details */}
                {app.plotDetails && Object.values(app.plotDetails).some(v => v) && (
                  <SectionCard title="Plot Details">
                    <Row>
                      <Col md={6}>
                        <InfoRow label="Plot Location" value={app.plotDetails.plotLocation} />
                        <InfoRow label="Plot Area" value={app.plotDetails.plotArea} />
                        <InfoRow label="Plot Value" value={formatAmount(app.plotDetails.plotValue)} />
                        <InfoRow label="DTCP Approved" value={app.plotDetails.dtcpApproved} />
                      </Col>
                      <Col md={6}>
                        <InfoRow label="Plot Purpose" value={app.plotDetails.plotPurpose} />
                        <InfoRow label="Seller Name" value={app.plotDetails.sellerName} />
                        <InfoRow label="Plot Address" value={app.plotDetails.plotAddress} />
                      </Col>
                    </Row>
                  </SectionCard>
                )}

                {/* Renovation Details */}
                {app.renovationDetails && Object.values(app.renovationDetails).some(v => v) && (
                  <SectionCard title="Renovation Details">
                    <Row>
                      <Col md={6}>
                        <InfoRow label="Renovation Type" value={app.renovationDetails.renovationType} />
                        <InfoRow label="Property Owned" value={app.renovationDetails.propertyOwned} />
                        <InfoRow label="Estimated Cost" value={formatAmount(app.renovationDetails.estimatedCost)} />
                      </Col>
                      <Col md={6}>
                        <InfoRow label="Contractor Name" value={app.renovationDetails.contractorName} />
                        <InfoRow label="Property Address" value={app.renovationDetails.propertyAddress} />
                      </Col>
                    </Row>
                  </SectionCard>
                )}

                {/* Show message if no property data */}
                {!app.propertyDetails && !app.plotDetails && !app.renovationDetails && (
                  <Card style={{ border: "1px solid #e5e7eb", borderRadius: "10px" }}>
                    <Card.Body className="text-center" style={{ padding: "40px", color: "#9ca3af" }}>
                      No property or asset details available for this application.
                    </Card.Body>
                  </Card>
                )}
              </Tab.Pane>

              {/* ═══════════ DOCUMENTS TAB ═══════════ */}
              <Tab.Pane eventKey="documents">
                {/* Doc Stats */}
                <Row className="g-3 mb-4">
                  <Col md={3}>
                    <div style={{ background: "#f3f4f6", borderRadius: "10px", padding: "16px 20px", textAlign: "center" }}>
                      <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f2557" }}>{docStats.total}</div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#6b7280" }}>Total Documents</div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div style={{ background: "#dcfce7", borderRadius: "10px", padding: "16px 20px", textAlign: "center" }}>
                      <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#16a34a" }}>{docStats.verified}</div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#6b7280" }}>Verified</div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div style={{ background: "#fef9c3", borderRadius: "10px", padding: "16px 20px", textAlign: "center" }}>
                      <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#92400e" }}>{docStats.pending}</div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#6b7280" }}>Pending</div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div style={{ background: "#fee2e2", borderRadius: "10px", padding: "16px 20px", textAlign: "center" }}>
                      <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#dc2626" }}>{docStats.rejected}</div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#6b7280" }}>Rejected</div>
                    </div>
                  </Col>
                </Row>

                {/* Document Table */}
                {docs.length > 0 ? (
                  <Card style={{ border: "1px solid #e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
                    <Table responsive hover style={{ margin: 0, fontSize: "0.85rem" }}>
                      <thead style={{ background: "#f8f9fa" }}>
                        <tr>
                          <th style={{ padding: "12px 16px", fontWeight: 600, color: "#374151" }}>Document</th>
                          <th style={{ padding: "12px 16px", fontWeight: 600, color: "#374151" }}>Status</th>
                          <th style={{ padding: "12px 16px", fontWeight: 600, color: "#374151" }}>Uploaded</th>
                          <th style={{ padding: "12px 16px", fontWeight: 600, color: "#374151" }}>File</th>
                          <th style={{ padding: "12px 16px", fontWeight: 600, color: "#374151" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {docs.map((doc) => (
                          <tr key={doc.key}>
                            <td style={{ padding: "12px 16px", fontWeight: 600, color: "#1f2937" }}>{doc.name}</td>
                            <td style={{ padding: "12px 16px" }}>
                              <span style={{
                                padding: "3px 10px", borderRadius: "100px", fontSize: "0.73rem", fontWeight: 700,
                                background: doc.status === "verified" ? "#dcfce7" : doc.status === "rejected" ? "#fee2e2" : doc.status === "processed" ? "#e6f0ff" : "#fef9c3",
                                  color: doc.status === "verified" ? "#16a34a" : doc.status === "rejected" ? "#dc2626" : doc.status === "processed" ? "#075985" : "#92400e",
                              }}>
                                {doc.status.toUpperCase()}
                              </span>
                            </td>
                            <td style={{ padding: "12px 16px", color: "#6b7280", fontSize: "0.8rem" }}>
                              {doc.uploadedAt ? formatDate(doc.uploadedAt) : "—"}
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <a href={doc.url} target="_blank" rel="noreferrer" style={{ fontSize: "0.8rem", color: "#2563eb", fontWeight: 600 }}>
                                View File
                              </a>
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <div style={{ display: "flex", gap: "6px" }}>
                                <button
                                  onClick={() => handleDocAction(doc.key, "verified")}
                                  disabled={doc.status === "verified" || doc.status === "processed" || actionLoading}
                                  style={{
                                    padding: "4px 10px", border: "none", borderRadius: "5px", fontSize: "0.75rem", fontWeight: 600,
                                    background: doc.status === "verified" ? "#f3f4f6" : "#dcfce7",
                                    color: doc.status === "verified" ? "#9ca3af" : "#16a34a",
                                    cursor: doc.status === "verified" ? "default" : "pointer",
                                  }}
                                >
                                  Verify
                                </button>
                                <button
                                  onClick={() => handleDocAction(doc.key, "rejected")}
                                  disabled={doc.status === "rejected" || doc.status === "processed" || actionLoading}
                                  style={{
                                    padding: "4px 10px", border: "none", borderRadius: "5px", fontSize: "0.75rem", fontWeight: 600,
                                    background: doc.status === "rejected" ? "#f3f4f6" : "#fee2e2",
                                    color: doc.status === "rejected" ? "#9ca3af" : "#dc2626",
                                    cursor: doc.status === "rejected" ? "default" : "pointer",
                                  }}
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card>
                ) : (
                  <Card style={{ border: "1px solid #e5e7eb", borderRadius: "10px" }}>
                    <Card.Body className="text-center" style={{ padding: "40px", color: "#9ca3af" }}>
                      No documents uploaded yet.
                    </Card.Body>
                  </Card>
                )}
              </Tab.Pane>

              {/* ═══════════ TIMELINE & REMARKS TAB ═══════════ */}
              <Tab.Pane eventKey="timeline">
                <Row className="g-3">
                  <Col md={6}>
                    <SectionCard title="Application Timeline">
                      {timeline.length > 0 ? (
                        <div style={{ position: "relative", paddingLeft: "20px" }}>
                          {timeline.map((item, i) => (
                            <div key={i} style={{ position: "relative", paddingBottom: i < timeline.length - 1 ? "20px" : "0", paddingLeft: "16px" }}>
                              <div style={{
                                position: "absolute", left: "-6px", top: "4px",
                                width: "12px", height: "12px", borderRadius: "50%",
                                background: i === timeline.length - 1 ? "#0f2557" : "#d1d5db",
                                border: "2px solid #fff", boxShadow: "0 0 0 2px " + (i === timeline.length - 1 ? "#0f2557" : "#d1d5db"),
                              }} />
                              {i < timeline.length - 1 && (
                                <div style={{ position: "absolute", left: "0px", top: "16px", width: "1px", height: "calc(100% - 12px)", background: "#e5e7eb" }} />
                              )}
                              <div style={{ fontSize: "0.84rem", fontWeight: 600, color: "#1f2937" }}>{item.label}</div>
                              <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{formatDate(item.date)} at {new Date(item.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>No timeline events yet.</p>
                      )}
                    </SectionCard>

                    {/* Processing Info */}
                    {app.processing?.rejectionReason && (
                      <SectionCard title="Rejection Reason">
                        <div style={{ background: "#fee2e2", padding: "12px 16px", borderRadius: "8px", fontSize: "0.85rem", color: "#991b1b" }}>
                          {app.processing.rejectionReason}
                        </div>
                      </SectionCard>
                    )}
                  </Col>

                  <Col md={6}>
                    <SectionCard title="Remarks & Notes">
                      {app.processing?.remarks?.length > 0 ? (
                        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                          {app.processing.remarks.map((r, i) => (
                            <div key={i} style={{ padding: "10px 14px", background: i % 2 === 0 ? "#f9fafb" : "#fff", borderRadius: "6px", marginBottom: "6px" }}>
                              <div style={{ fontSize: "0.84rem", color: "#1f2937" }}>{r.text}</div>
                              <div style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: "4px" }}>
                                {r.date ? formatDate(r.date) + " " + new Date(r.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : ""}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>No remarks added yet.</p>
                      )}

                      {/* Add Remark Input */}
                      <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
                        <input
                          type="text"
                          value={remarkText}
                          onChange={(e) => setRemarkText(e.target.value)}
                          placeholder="Add a remark..."
                          style={{
                            flex: 1, padding: "8px 12px", border: "1.5px solid #d1d5db",
                            borderRadius: "6px", fontSize: "0.84rem", outline: "none",
                          }}
                          onKeyDown={(e) => e.key === "Enter" && handleAddRemark()}
                        />
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={handleAddRemark}
                          disabled={actionLoading || !remarkText.trim()}
                          style={{ fontWeight: 600, fontSize: "0.8rem" }}
                        >
                          Add
                        </Button>
                      </div>
                    </SectionCard>
                  </Col>
                </Row>
              </Tab.Pane>

              {/* ═══════════ ACTIONS TAB ═══════════ */}
              <Tab.Pane eventKey="actions">
                <SectionCard title="Application Actions">
                  <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "20px" }}>
                    Perform actions on this application based on its current status: <strong>{app.status?.replace(/_/g, " ")}</strong>
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                    {(app.status === "submitted" || app.status === "documents_pending") && (
                      <Button
                        variant="primary"
                        onClick={() => handleAction("start_review")}
                        disabled={actionLoading}
                        style={{ fontWeight: 600 }}
                      >
                        Start Review
                      </Button>
                    )}
                    {app.status === "under_review" && (
                      <>
                        <Button
                          variant="success"
                          onClick={() => handleAction("recommend")}
                          disabled={actionLoading}
                          style={{ fontWeight: 600 }}
                        >
                          Recommend for Approval
                        </Button>
                        <Button
                          variant="warning"
                          onClick={() => handleAction("request_docs")}
                          disabled={actionLoading}
                          style={{ fontWeight: 600 }}
                        >
                          Request Additional Documents
                        </Button>
                      </>
                    )}
                    {(app.status === "approved" || app.status === "disbursed") && (
                      <div style={{ background: "#dcfce7", padding: "12px 20px", borderRadius: "8px", fontSize: "0.85rem", color: "#166534", fontWeight: 600 }}>
                        This application has been {app.status}. No further agent actions required.
                      </div>
                    )}
                    {app.status === "rejected" && (
                      <div style={{ background: "#fee2e2", padding: "12px 20px", borderRadius: "8px", fontSize: "0.85rem", color: "#991b1b", fontWeight: 600 }}>
                        This application has been rejected.
                      </div>
                    )}
                  </div>
                </SectionCard>

                {/* Consent Info */}
                {app.consent && (
                  <SectionCard title="Applicant Consent">
                    <InfoRow label="Declaration" value={app.consent.consentDeclaration ? "Yes" : "No"} />
                    <InfoRow label="Credit Check" value={app.consent.consentCreditCheck ? "Yes" : "No"} />
                    <InfoRow label="Marketing" value={app.consent.consentMarketing ? "Yes" : "No"} />
                    <InfoRow label="E-Signature" value={app.consent.eSignature} />
                    <InfoRow label="Consent Date" value={formatDate(app.consent.consentDate)} />
                  </SectionCard>
                )}
              </Tab.Pane>
            </Tab.Content>
          </Container>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
}

export default AgentUserDetails;
