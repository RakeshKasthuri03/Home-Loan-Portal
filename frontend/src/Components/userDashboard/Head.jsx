export default function Head() {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h3>🏠 HomeLoan Portal</h3>
      </div>

      <div className="header-right">
        <span className="notify-dot"></span>
        <button className="primary-btn">+ New application</button>
      </div>
    </header>
  );
}