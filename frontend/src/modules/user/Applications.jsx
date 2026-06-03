import { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken, getUser } from '../../utils/auth';
import './../../../src/Styles/Applications.css';

export default function Applications({ user }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const storedUser = getUser();
      
      if (!token || !storedUser?.id) {
        setError('Please login to view applications');
        setLoading(false);
        return;
      }

      const res = await axios.get('/api/loan/my-applications', {
        headers: { authorization: `Bearer ${token}` }
      });
      
      console.log('Fetched applications:', res.data);
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  // Categorize applications
  const currentLoans = applications.filter(app => 
    ['approved', 'disbursed'].includes(app.status)
  );
  const pendingLoans = applications.filter(app => 
    ['draft', 'submitted', 'under_review', 'documents_pending'].includes(app.status)
  );
  const completedLoans = applications.filter(app => 
    ['closed', 'rejected'].includes(app.status)
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '—';
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  const getStatusStyle = (status) => {
    const styles = {
      draft: { background: '#f3f4f6', color: '#6b7280' },
      submitted: { background: '#fef3c7', color: '#d97706' },
      under_review: { background: '#dbeafe', color: '#2563eb' },
      documents_pending: { background: '#fff7ed', color: '#ea580c' },
      approved: { background: '#dcfce7', color: '#16a34a' },
      rejected: { background: '#fee2e2', color: '#dc2626' },
      disbursed: { background: '#d1fae5', color: '#059669' },
      closed: { background: '#e5e7eb', color: '#374151' }
    };
    return styles[status] || { background: '#f3f4f6', color: '#6b7280' };
  };

  const getStatusLabel = (status) => {
    const labels = {
      draft: 'Draft',
      submitted: 'Submitted',
      under_review: 'Under Review',
      documents_pending: 'Docs Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      disbursed: 'Disbursed',
      closed: 'Closed'
    };
    return labels[status] || status;
  };

  const getLoanTypeLabel = (type) => {
    const labels = {
      PURCHASE: 'Home Purchase',
      PLOT: 'Plot Loan',
      NRI: 'NRI Home Loan',
      RENOVATION: 'Renovation Loan',
      BALANCE_TRANSFER: 'Balance Transfer'
    };
    return labels[type] || type;
  };

  // Calculate end date based on sanctioned tenure
  const calculateEndDate = (startDate, tenure) => {
    if (!startDate || !tenure) return '—';
    const start = new Date(startDate);
    const years = parseInt(tenure) || 0;
    const end = new Date(start.setFullYear(start.getFullYear() + years));
    return formatDate(end);
  };

  const renderApplicationRow = (app) => (
    <tr key={app._id || app.applicationId} className="app-row">
      <td>
        <div className="app-id-cell">
          <span className="app-id">{app.applicationId || '—'}</span>
          <span className="loan-type-label">{getLoanTypeLabel(app.loanType)}</span>
        </div>
      </td>
      <td className="amount-cell">
        {formatCurrency(app.sanctionedDetails?.sanctionedAmount || app.financialDetails?.loanAmount)}
      </td>
      <td>{formatDate(app.sanctionedDetails?.sanctionDate || app.processing?.approvedAt || app.createdAt)}</td>
      <td>{calculateEndDate(app.sanctionedDetails?.sanctionDate || app.processing?.approvedAt, app.sanctionedDetails?.sanctionedTenure || app.financialDetails?.loanTenure)}</td>
      <td>{app.sanctionedDetails?.interestRate ? `${app.sanctionedDetails.interestRate}%` : '—'}</td>
      <td>
        <span className="action-badge admin-action">
          {app.status === 'approved' || app.status === 'disbursed' ? '✅ Approved' : 
           app.status === 'rejected' ? '❌ Rejected' : 
           app.status === 'under_review' ? '🔍 Reviewing' : '⏳ Pending'}
        </span>
      </td>
      <td>
        <span className="action-badge agent-action">
          {app.assignedAgent ? '👤 Assigned' : '⏳ Unassigned'}
        </span>
      </td>
      <td>
        <span className="table-status-pill" style={getStatusStyle(app.status)}>
          {getStatusLabel(app.status)}
        </span>
      </td>
    </tr>
  );

  const renderApplicationCard = (app) => (
    <div className={`loan-card ${app.status === 'closed' || app.status === 'rejected' ? 'loan-completed' : 'loan-active'}`} key={app._id || app.applicationId}>
      <div className="loan-card-header">
        <div className="loan-type">{getLoanTypeLabel(app.loanType)}</div>
        <span className="table-status-pill" style={getStatusStyle(app.status)}>
          {getStatusLabel(app.status)}
        </span>
      </div>

      <div className="loan-card-body">
        <div className="loan-amount">
          {formatCurrency(app.sanctionedDetails?.sanctionedAmount || app.financialDetails?.loanAmount)}
        </div>
        <div className="loan-dates">
          <div>
            <small className="muted">Start</small>
            <div className="date">{formatDate(app.sanctionedDetails?.sanctionDate || app.processing?.approvedAt || app.createdAt)}</div>
          </div>
          <div>
            <small className="muted">End</small>
            <div className="date">{calculateEndDate(app.sanctionedDetails?.sanctionDate || app.processing?.approvedAt, app.sanctionedDetails?.sanctionedTenure || app.financialDetails?.loanTenure)}</div>
          </div>
        </div>
      </div>

      <div className="loan-info-row">
        <div className="info-item">
          <small className="muted">Interest</small>
          <span>{app.sanctionedDetails?.interestRate ? `${app.sanctionedDetails.interestRate}%` : '—'}</span>
        </div>
        <div className="info-item">
          <small className="muted">EMI</small>
          <span>{formatCurrency(app.sanctionedDetails?.emiAmount)}</span>
        </div>
      </div>

      <div className="loan-actions-row">
        <span className="action-badge admin-action">
          {app.status === 'approved' || app.status === 'disbursed' ? '✅ Admin Approved' : 
           app.status === 'rejected' ? '❌ Rejected' : '⏳ Admin Pending'}
        </span>
        <span className="action-badge agent-action">
          {app.assignedAgent ? '👤 Agent Assigned' : '⏳ No Agent'}
        </span>
      </div>

      <div className="loan-card-footer">
        <span className="app-id-small">{app.applicationId}</span>
        <button className="btn-primary" onClick={() => window.location.href = `/dashboard/loan-tracker?id=${app.applicationId}`}>
          View Details
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="Applications-main">
        <div className="dashboard-main">
          <h2>My Applications</h2>
          <div className="loading-state">Loading applications...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="Applications-main">
        <div className="dashboard-main">
          <h2>My Applications</h2>
          <div className="error-state">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="Applications-main">
      <div className="dashboard-main">
        <h2>{user?.name ?? 'User'} – My Applications</h2>

        {/* PENDING APPLICATIONS TABLE */}
        {pendingLoans.length > 0 && (
          <section className="applications-section">
            <h3>📋 Pending Applications</h3>
            <div className="admin-table-wrap">
              <table className="admin-data-table applications-table">
                <thead>
                  <tr>
                    <th>Application ID</th>
                    <th>Loan Amount</th>
                    <th>Applied On</th>
                    <th>Expected End</th>
                    <th>Interest</th>
                    <th>Admin Action</th>
                    <th>Agent Action</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLoans.map(app => renderApplicationRow(app))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* CURRENT LOANS - APPROVED/DISBURSED */}
        <section className="applications-section">
          <h3>✅ Current Loans</h3>
          {currentLoans.length === 0 ? (
            <p className="text-muted">No active loans at the moment.</p>
          ) : (
            <>
              {/* Table view for desktop */}
              <div className="admin-table-wrap desktop-only">
                <table className="admin-data-table applications-table">
                  <thead>
                    <tr>
                      <th>Application ID</th>
                      <th>Loan Amount</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Interest</th>
                      <th>Admin Action</th>
                      <th>Agent Action</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentLoans.map(app => renderApplicationRow(app))}
                  </tbody>
                </table>
              </div>
              {/* Card view for mobile */}
              <div className="loans-grid mobile-only">
                {currentLoans.map(app => renderApplicationCard(app))}
              </div>
            </>
          )}
        </section>

        {/* COMPLETED/CLOSED LOANS */}
        <section className="applications-section mt-24">
          <h3>📁 Completed / Closed Loans</h3>
          {completedLoans.length === 0 ? (
            <p className="text-muted">No completed or closed loans.</p>
          ) : (
            <>
              {/* Table view for desktop */}
              <div className="admin-table-wrap desktop-only">
                <table className="admin-data-table applications-table">
                  <thead>
                    <tr>
                      <th>Application ID</th>
                      <th>Loan Amount</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Interest</th>
                      <th>Admin Action</th>
                      <th>Agent Action</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedLoans.map(app => renderApplicationRow(app))}
                  </tbody>
                </table>
              </div>
              {/* Card view for mobile */}
              <div className="loans-grid mobile-only">
                {completedLoans.map(app => renderApplicationCard(app))}
              </div>
            </>
          )}
        </section>

        {applications.length === 0 && (
          <div className="empty-state">
            <p>You haven't applied for any loans yet.</p>
            <button className="btn-primary" onClick={() => window.location.href = '/loan-types'}>
              Apply for a Loan →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
