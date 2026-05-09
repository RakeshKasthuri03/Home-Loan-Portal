export default function Applications({ user }) {
  return (
    <div className="dashboard-main">
      <h2>{user?.name ?? "User"} – Applications</h2>
      <p>List of loan applications will appear here.</p>
    </div>
  );
}
