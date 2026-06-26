import React, { useState } from "react";
import { Container, Image, Button, Row, Col, Card, Form, Alert } from "react-bootstrap";
import axios from "axios";
import LoadingOverlay from "../../components/LoadingOverlay";

function AgentDashboard({ agent, closeModal, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState(agent.address || "");
  const [loansGiven, setLoansGiven] = useState(agent.loansGiven || 0);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const token = localStorage.getItem('mlrr_token');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSave = async () => {
    setLoading(true);
    setMsg("");
    try {
      let profilePhoto = agent.profilePhoto || agent.photo;

      // If a file was selected upload it first — use upload.controller to set agent profile
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('purpose', 'profile');
        formData.append('userId', agent.id);

        const upRes = await axios.post(`http://localhost:5000/api/upload`, formData, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            'Content-Type': 'multipart/form-data'
          }
        });

        // upload.controller returns `agent` when it updates agent profile
        profilePhoto = upRes.data?.agent?.profilePhoto || upRes.data?.url || profilePhoto;
      }

      // Now update agent profile
      const body = { address, loansGiven, profilePhoto };
      const res = await axios.patch(`http://localhost:5000/api/agent/${agent.id}`, body, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined }
      });

      setMsg(res.data?.message || 'Updated successfully');
      setEditing(false);
      if (onUpdated) onUpdated();

    } catch (err) {
      console.error('Failed to update agent', err);
      setMsg(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = () => {
    setAddress(agent.address || "");
    setLoansGiven(agent.loansGiven || 0);
    setEditing(true);
  };

  return (
    <div>
      <LoadingOverlay show={loading} />
      <Container className="p-4 bg-white rounded shadow" style={{ maxWidth: "520px" }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Agent Profile</h5>
          <div>
            {!editing && <Button variant="outline-primary" size="sm" onClick={startEdit} style={{ marginRight: 8 }}>Edit</Button>}
            <Button variant="outline-secondary" size="sm" onClick={closeModal}>✕</Button>
          </div>
        </div>

        {msg && <Alert variant={msg.toLowerCase().includes('failed') ? 'danger' : 'success'}>{msg}</Alert>}

        {/* Profile Info */}
        <div className="text-center mb-3">
          <Image src={agent.profilePhoto || agent.photo} roundedCircle width={100} height={100} />
          <h5 className="mt-2">{agent.name}</h5>
          <p className="text-muted mb-0">{agent.email}</p>
        </div>

        <Card className="border-0">
          <Card.Body className="p-0">
            {!editing ? (
              <Row className="gy-2">
                <Col xs={6}><strong>Gender</strong></Col>
                <Col xs={6}>{agent.gender}</Col>

                <Col xs={6}><strong>Phone</strong></Col>
                <Col xs={6}>{agent.phone}</Col>

                <Col xs={6}><strong>Address</strong></Col>
                <Col xs={6}>{agent.address || '—'}</Col>

                <Col xs={6}><strong>Loans Given</strong></Col>
                <Col xs={6}>{agent.loansGiven}</Col>
              </Row>
            ) : (
              <Form>
                <Form.Group className="mb-2">
                  <Form.Label>Profile Photo</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Address</Form.Label>
                  <Form.Control as="textarea" rows={2} value={address} onChange={(e) => setAddress(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Loans Given</Form.Label>
                  <Form.Control type="number" value={loansGiven} onChange={(e) => setLoansGiven(e.target.value)} />
                </Form.Group>

                <div className="d-flex justify-content-end" style={{ gap: 8 }}>
                  <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                  <Button variant="primary" size="sm" onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default AgentDashboard;
