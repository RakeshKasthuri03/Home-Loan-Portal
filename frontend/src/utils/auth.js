const AUTH_KEY = "mlrr_user";
const TOKEN_KEY = "mlrr_token";
import axios from 'axios';

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

const MOCK_USERS = [
 
  { id: 3, name: "Agent Karthik", email: "agent@mlrr.com",    mobile: "7777777777", password: "agent123",   role: "agent" },
  { id: 4, name: "Admin User",    email: "admin@mlrr.com",    mobile: "6666666666", password: "admin123",   role: "admin" },
];
 
export const loginUser = (identifier, password) => {
  const user = MOCK_USERS.find(
    (u) =>
      (u.email === identifier || u.mobile === identifier) &&
      u.password === password
  );
  if (user) {
    const { password: _, ...safeUser } = user;
    localStorage.setItem(AUTH_KEY, JSON.stringify(safeUser));
    return { success: true, user: safeUser };
  }
  return { success: false, error: "Invalid email/mobile or password" };
};

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
      localStorage.setItem(AUTH_KEY, JSON.stringify({ id: userData.id ,role: userData.role}));
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
