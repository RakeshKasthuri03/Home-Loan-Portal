import { useState } from 'react';
import './../../../src/Styles/Applications.css';

export default function Applications({ user }) {
  // user.applications expected to be an array of { id, amount, dateTaken, dateEnd, status }
  const initial = Array.isArray(user?.applications) ? user.applications : [];
  const [applications, setApplications] = useState(initial);

  const current = applications.filter(a => a.status && a.status.toLowerCase() !== 'completed');
  const completed = applications.filter(a => a.status && a.status.toLowerCase() === 'completed');

  // If there are no applications from backend, show example cards
  const showExample = applications.length === 0;
  const sampleCurrent = [
    { id: 'ex-cur-1', loanType: 'Home Loan', amount: 1250000, dateTaken: 'Jan 15, 2024', dateEnd: 'Jan 15, 2034', status: 'Active', example: true },
    { id: 'ex-cur-2', loanType: 'Home Loan', amount: 850000, dateTaken: 'Mar 01, 2022', dateEnd: 'Mar 01, 2032', status: 'Active', example: true },
    { id: 'ex-cur-3', loanType: 'Top-up Loan', amount: 250000, dateTaken: 'Jun 20, 2023', dateEnd: 'Jun 20, 2033', status: 'Active', example: true }
  ];

  const sampleCompleted = [
    { id: 'ex-comp-1', loanType: 'Home Loan', amount: 650000, dateTaken: 'Feb 10, 2012', dateEnd: 'Feb 10, 2022', status: 'Completed', example: true },
    { id: 'ex-comp-2', loanType: 'Personal Loan', amount: 150000, dateTaken: 'May 05, 2016', dateEnd: 'May 05, 2021', status: 'Completed', example: true },
    { id: 'ex-comp-3', loanType: 'Car Loan', amount: 420000, dateTaken: 'Aug 18, 2018', dateEnd: 'Aug 18, 2023', status: 'Completed', example: true }
  ];

  const handleRemove = (id) => {
    if (!confirm('Remove this completed loan from your list?')) return;
    setApplications(prev => prev.filter(a => a.id !== id));
    // TODO: optionally call backend to persist removal
  };

  const renderCard = (app, idx) => (
    <div className={`loan-card ${app.status?.toLowerCase() === 'completed' ? 'loan-completed' : 'loan-active'}`} key={app.id || idx}>
      <div className="loan-card-header">
        <div className="loan-type">{app.loanType || 'Home Loan'}</div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          {app.example && <span className="example-badge">Example</span>}
          <div className={`loan-status ${app.status?.toLowerCase()}`}>{app.status || 'Unknown'}</div>
        </div>
      </div>

      <div className="loan-card-body">
        <div className="loan-amount">₹{app.amount?.toLocaleString?.() ?? app.amount}</div>
        <div className="loan-dates">
          <div><small className="muted">Taken</small><div className="date">{app.dateTaken || app.takenDate || '—'}</div></div>
          <div><small className="muted">Ends</small><div className="date">{app.dateEnd || app.endDate || '—'}</div></div>
        </div>
      </div>

      <div className="loan-card-footer">
        {app.status?.toLowerCase() === 'completed' ? (
          <button className="btn-remove" onClick={() => handleRemove(app.id)}>Remove</button>
        ) : (
          <button className="btn-primary" disabled>View details</button>
        )}
      </div>
    </div>
  );

  return (
    <div className="Applications-main ">
    <div className="dashboard-main">
      <h2>{user?.name ?? 'User'} – Applications</h2>

      <section className="applications-section">
        <h3>Current Loans</h3>
        {current.length === 0 ? (
          showExample ? (
            <div className="loans-grid">
              {sampleCurrent.map((app, i) => renderCard(app, i))}
            </div>
          ) : (
            <p className="text-muted">No current loans found.</p>
          )
        ) : (
          <div className="loans-grid">
            {current.map((app, i) => renderCard(app, i))}
          </div>
        )}
      </section>

      <section className="applications-section mt-24">
        <h3>Completed Loans</h3>
        {completed.length === 0 ? (
          showExample ? (
            <div className="loans-grid">
              {sampleCompleted.map((app, i) => renderCard(app, i))}
            </div>
          ) : (
            <p className="text-muted">No completed loans.</p>
          )
        ) : (
          <div className="loans-grid">
            {completed.map((app, i) => renderCard(app, i))}
          </div>
        )}
      </section>
    </div>
    </div>
  );
}
