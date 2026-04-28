import { useNavigate } from "react-router-dom";

export default function DashboardMain({ dashboardData }) {
  const { user, stats, activeApplication, activities } = dashboardData;
  const navigate = useNavigate();

  return (
    <div className="dashboard-main">

      {/* Welcome */}
      <div className="welcome-card">
        <div>
          <h2>Good morning, {user.name} 👋</h2>
          <p>
            You have {stats[1]?.value || 0} application{stats[1]?.value !== '1' ? 's' : ''} under review and {stats[3]?.value || 0} document{stats[3]?.value !== '1' ? 's' : ''} pending upload.
          </p>
        </div>
        <div>
          <button className="outline-btn" onClick={() => navigate('/loan-tracker')}>Track status</button>
          <button className="primary-btn" onClick={() => navigate('/applications')}>Apply for loan</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats">
        {stats.map((item, index) => (
          <div className="stat-card" key={index}>
            <h4>{item.title}</h4>
            <p className={`stat-number ${item.color ?? ""}`}>
              {item.value}
            </p>
            <span>{item.note}</span>
          </div>
        ))}
      </div>

      {/* Active Application */}
      <div className="application-card">
        <h3>Active application</h3>

        <p>
          <strong>Application #{activeApplication.id}</strong>
        </p>
        <p>
          {activeApplication.loanType} — {activeApplication.amount}
        </p>
        <p>
          Officer: {activeApplication.officer} · Agent:{" "}
          {activeApplication.agent}
        </p>

        <div className="steps">
          {activeApplication.steps.map((step, index) => (
            <span
              key={index}
              className={
                step.status === "done"
                  ? "done"
                  : step.status === "current"
                  ? "current"
                  : ""
              }
            >
              {step.step ? `${step.step} ` : ""}{step.label}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="bottom-grid">
        <div>
          <h3>Quick actions</h3>
          <ul>
            <li>🏠 Apply for a loan</li>
            <li>📄 Upload docs (1 pending)</li>
            <li>🧮 EMI calculator</li>
            <li>🔁 Balance transfer</li>
          </ul>
        </div>

        <div>
          <h3>Recent activity</h3>
          <ul className="activity">
            {activities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}
