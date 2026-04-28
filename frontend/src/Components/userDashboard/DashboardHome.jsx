import { useParams } from "react-router-dom";

export default function DashboardHome() {
  const { username } = useParams();

  return (
    <div className="dashboard-main">
      <h2>Good morning, {username} 👋</h2>
      <p>You have 2 applications under review.</p>

      {/* you can paste your full dashboard UI here */}
    </div>
  );
}