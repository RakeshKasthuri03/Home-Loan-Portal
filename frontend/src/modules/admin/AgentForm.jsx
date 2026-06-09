import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/AgentForm.css';
import axios from 'axios';
import notify from '../../utils/notify';
// Props:
// - show: boolean (whether to render modal)
// - initial: { firstName, lastName, email, phone, tier }
// - tiers: array of tier strings
// - onCancel: () => void
// - onSubmit: (agent) => void

export default function AgentForm({ show, initial = {}, tiers = ['Silver','Gold','Platinum'], onCancel, onSubmit }) {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
    confirmpassword: '',
    tier: tiers[0],
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // If `show` is explicitly false, hide. If `show` is undefined (rendered as a page route), render in page mode.
  const pageMode = typeof show === 'undefined';
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // client-side validation
    const newErrors = {};
    if (!form.firstname || form.firstname.trim().length < 2) newErrors.firstname = 'First name is required (min 2 chars)';
    if (!form.gender) newErrors.gender = 'Please select gender';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.password || form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmpassword) newErrors.confirmpassword = 'Passwords do not match';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      // show first error as toast
      const first = newErrors[Object.keys(newErrors)[0]];
      notify.error(first);
      return;
    }

    try{
       const res=await axios.post('http://localhost:5000/api/agent/signup',form);
        if (res.status >= 200 && res.status < 300) {
            if (pageMode) {
              // navigate immediately to agents list
              notify.success(res.data.message);
              navigate('/admin/agents');
              return;
            } else {
              notify.success(res.data.message, { duration: 3000 });
              if (typeof onSubmit === 'function') {
                onSubmit(res.data.agent);
              }
            }
        }
          else{
              notify.error(res.data.message);
          }
        }
        catch(err){
            notify.error(err.response?.data?.message || "Something went wrong");
        }
        
  };

  

  return (
    <>
      {/* Toaster is provided globally in App.jsx; no local ToastContainer required */}
      {pageMode ? (
        <div className="af-page">
          <div className="af-panel af-panel--page">
            <div className="af-header">
              <h4 className="af-title">Add Agent</h4>
            </div>

            <form className="af-form af-form--page" onSubmit={handleSubmit}>
              <div className="af-row">
                <label>First name</label>
                <input name="firstname" value={form.firstname} onChange={handleChange} required />
                {errors.firstname && <div className="af-error">{errors.firstname}</div>}
              </div>

              <div className="af-row">
                <label>Last name</label>
                <input name="lastname" value={form.lastname} onChange={handleChange} />
              </div>
              <div className="af-row">
                <label>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} required>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <div className="af-error">{errors.gender}</div>}
              </div>

              <div className="af-row">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required />
                {errors.email && <div className="af-error">{errors.email}</div>}
              </div>

              <div className="af-row">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} />
              </div>
              <br />
              <div className="af-row">
                <label>Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} />
                {errors.password && <div className="af-error">{errors.password}</div>}
              </div>
              <div className="af-row">
                <label>Confirm Password</label>
                <input name="confirmpassword" type="password" value={form.confirmpassword} onChange={handleChange} />
                {errors.confirmpassword && <div className="af-error">{errors.confirmpassword}</div>}
              </div>

              <div className="af-row">
                <label>Tier</label>
                <select name="tier" value={form.tier} onChange={handleChange}>
                  {tiers.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="af-actions">
                <button type="button" className="af-btn af-cancel" onClick={onCancel}>Cancel</button>
                <button type="submit" className="af-btn af-primary">Add Agent</button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="af-overlay" onClick={onCancel}>
          <div className="af-panel" onClick={(e) => e.stopPropagation()}>
            <div className="af-header">
              <h4 className="af-title">Add Agent</h4>
              <button className="af-close" onClick={onCancel} aria-label="Close">×</button>
            </div>

            <form className="af-form" onSubmit={handleSubmit}>
              <div className="af-row">
                <label>First name</label>
                <input name="firstname" value={form.firstname} onChange={handleChange} required />
              </div>

              <div className="af-row">
                <label>Last name</label>
                <input name="lastname" value={form.lastname} onChange={handleChange} />
              </div>

              <div className="af-row">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>

              <div className="af-row">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} />
              </div>

              <div className="af-row">
                <label>Tier</label>
                <select name="tier" value={form.tier} onChange={handleChange}>
                  {tiers.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="af-actions">
                <button type="button" className="af-btn af-cancel" onClick={onCancel}>Cancel</button>
                <button type="submit" className="af-btn af-primary">Add Agent</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
