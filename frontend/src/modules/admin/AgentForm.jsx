import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/AgentForm.css';
import axios from 'axios';
import notify from '../../utils/notify';
import CustomSelect from '../../components/CustomSelect';

export default function AgentForm({
  show,
  initial = {},
  tiers = ['Silver','Gold','Platinum'],
  onCancel,
  onSubmit
}) {

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

  const pageMode = typeof show === 'undefined';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // ✅ First Name (4–10 chars)
    if (!form.firstname || form.firstname.trim().length < 4) {
      newErrors.firstname = "First name must be at least 4 characters";
    } else if (form.firstname.length > 10) {
      newErrors.firstname = "Max 10 characters allowed";
    }

    // ✅ Last Name
    if (form.lastname && form.lastname.length < 4) {
      newErrors.lastname = "Last name must be at least 4 characters";
    }

    // ✅ Gender
    if (!form.gender) {
      newErrors.gender = "Please select gender";
    }

    // ✅ Email (gmail / outlook only)
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com)$/.test(form.email)
    ) {
      newErrors.email = "Only Gmail or Outlook emails allowed";
    }

    // ✅ Phone
    if (!form.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9][0-9]{9}$/.test(form.phone)) {
      newErrors.phone = "Phone must start with 6,7,8,9 and be 10 digits";
    } else if (/(.)\1\1/.test(form.phone)) {
      newErrors.phone = "No digit should repeat more than twice consecutively";
    }

    // ✅ Password
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    // ✅ Confirm Password
    if (form.password !== form.confirmpassword) {
      newErrors.confirmpassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      notify.error(newErrors[Object.keys(newErrors)[0]]);
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/agent/signup',
        form
      );

      if (res.status >= 200 && res.status < 300) {
        if (pageMode) {
          notify.success(res.data.message);
          navigate('/admin/agents');
          return;
        } else {
          notify.success(res.data.message);
          if (typeof onSubmit === 'function') {
            onSubmit(res.data.agent);
          }
        }
      } else {
        notify.error(res.data.message);
      }
    } catch (err) {
      notify.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      {pageMode ? (
        <div className="af-page">
          <div className="af-panel af-panel--page">
            <div className="af-header">
              <h4 className="af-title">Add Agent</h4>
            </div>

            <form className="af-form af-form--page" onSubmit={handleSubmit}>

              <div className="af-row">
                <label>First name</label>
                <input name="firstname" value={form.firstname} onChange={handleChange} />
                {errors.firstname && <div className="af-error">{errors.firstname}</div>}
              </div>

              <div className="af-row">
                <label>Last name</label>
                <input name="lastname" value={form.lastname} onChange={handleChange} />
                {errors.lastname && <div className="af-error">{errors.lastname}</div>}
              </div>

              <div className="af-row">
                <label>Gender</label>
                <CustomSelect
                  value={form.gender}
                  onChange={val => setForm(s => ({ ...s, gender: val }))}
                  placeholder="Select gender"
                  options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Other", label: "Other" },
                  ]}
                />
                {errors.gender && <div className="af-error">{errors.gender}</div>}
              </div>

              <div className="af-row">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} />
                {errors.email && <div className="af-error">{errors.email}</div>}
              </div>

              <div className="af-row">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} />
                {errors.phone && <div className="af-error">{errors.phone}</div>}
              </div>
              <br></br>

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
                <CustomSelect
                  value={form.tier}
                  onChange={val => setForm(s => ({ ...s, tier: val }))}
                  options={tiers.map(t => ({ value: t, label: t }))}
                />
              </div>

              <div className="af-actions">
                <button
                  type="button"
                  className="af-btn af-cancel"
                  onClick={() => pageMode ? navigate('/admin/agents') : onCancel && onCancel()}
                >
                  Cancel
                </button>
                <button type="submit" className="af-btn af-primary">
                  Add Agent
                </button>
              </div>

            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
