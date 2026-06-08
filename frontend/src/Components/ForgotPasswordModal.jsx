import { useState } from 'react';
import axios from 'axios';
import './ForgotPasswordModal.css';

export default function ForgotPasswordModal({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!email || !newPassword || !confirmPassword) return setError('All fields are required');
    if (newPassword !== confirmPassword) return setError("Passwords don't match");

    setLoading(true);
    try {
      const base = import.meta?.env?.VITE_API_BASE || 'http://localhost:5000';
      const res = await axios.post(`${base}/forgot-password`, { email, newPassword, confirmPassword });
      setSuccess(res.data?.message || 'Password updated');
      setEmail(''); setNewPassword(''); setConfirmPassword('');
      setTimeout(() => { setLoading(false); onClose && onClose(); }, 900);
    } catch (err) {
      console.error('Forgot password error', err?.response || err);
      setError(err?.response?.data?.message || 'Failed to update password');
      setLoading(false);
    }
  };

  return (
    <div className="fp-overlay">
      <div className="fp-modal">
        <button className="fp-close" onClick={() => onClose && onClose()}>✕</button>
        <h3>Reset Password</h3>
        <p className="fp-sub">Enter your account email and new password.</p>
        {error && <div className="fp-error">{error}</div>}
        {success && <div className="fp-success">{success}</div>}
        <form onSubmit={handleSubmit} className="fp-form">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />

          <label>New password</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />

          <label>Confirm password</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />

          <div className="fp-actions">
            <button type="submit" className="fp-btn-primary" disabled={loading}>{loading? 'Updating…' : 'Update Password'}</button>
            <button type="button" className="fp-btn-ghost" onClick={() => onClose && onClose()} disabled={loading}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
