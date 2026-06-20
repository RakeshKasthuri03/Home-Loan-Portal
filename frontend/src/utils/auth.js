const AUTH_KEY = "mlrr_user";
const TOKEN_KEY = "mlrr_token";
import axios from 'axios';

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════


 

export const getUser = () => {
  try {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

export const saveAuth = (user, token) => {
  try {
    if (user) {
      // Save user with necessary fields including role
      const userData = {
        id: user._id || user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        phone: user.phone,
        role: user.role || 'user'
      };
      // Persist a fuller user profile so frontend can prefill forms (name, email, phone)
      const stored = {
        id: userData.id,
        role: userData.role,
        email: userData.email,
        firstname: userData.firstname,
        lastname: userData.lastname,
        name: user.name || `${user.firstname || ''} ${user.lastname || ''}`.trim(),
        phone: userData.phone,
        // include gender and mobile aliases if present so frontend can prefill/lock fields
        gender: user.gender || userData.gender || null,
        mobile: user.mobile || user.phone || null,
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(stored));
    }
    if (token) localStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    console.error('Failed to save auth', e);
  }
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const clearAuth = () => {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

export const isLoggedIn = () => !!getUser() && !!getToken();
