import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../utils/auth";
import logo from "../../assets/logo.png";

export default function AgentLogin() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword]     = useState("");
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const result = loginUser(identifier, password);
      setLoading(false);

      if (result.success && result.user.role === "agent") {
        navigate("/agent/dashboard");
      } else if (result.success) {
        setError("Access denied. This portal is for agents only.");
      } else {
        setError(result.error);
      }
    }, 500);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, Poppins, sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: "16px", padding: "40px 48px", width: "100%", maxWidth: "420px", boxShadow: "0 8px 32px rgba(15,37,87,0.10)" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <img src={logo} alt="MLRR" height={52} style={{ marginBottom: "12px" }} />
          <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800, color: "#0f2557" }}>Agent Portal</h2>
          <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#6b7280" }}>Sign in to manage your leads</p>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "10px 14px", fontSize: "0.85rem", color: "#dc2626", marginBottom: "16px", textAlign: "center" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Email / Mobile</label>
            <input
              type="text"
              style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #d1d5db", borderRadius: "8px", fontSize: "0.92rem", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
              placeholder="agent@mlrr.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Password</label>
            <input
              type="password"
              style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #d1d5db", borderRadius: "8px", fontSize: "0.92rem", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Demo hint */}
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "8px 12px", fontSize: "0.78rem", color: "#15803d", textAlign: "center", marginBottom: "16px" }}>
            <strong>Demo:</strong> agent@mlrr.com / agent123
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "11px", background: "#0f4c8a", color: "white", border: "none", borderRadius: "8px", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Signing in..." : "Sign In as Agent"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.82rem", color: "#9ca3af" }}>
          Not an agent?{" "}
          <span style={{ color: "#0f4c8a", cursor: "pointer", fontWeight: 600 }} onClick={() => navigate("/")}>
            Go to Home
          </span>
        </p>
      </div>
    </div>
  );
}
