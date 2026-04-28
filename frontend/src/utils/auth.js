const AUTH_KEY = "mlrr_user";

// Mock users — replace with API call later
const MOCK_USERS = [
  { id: 1, name: "Rahul Nani",       email: "rahul@gmail.com",   mobile: "9999999999", password: "rahul123",   role: "customer" },
  { id: 2, name: "Manohar V",        email: "manohar@gmail.com", mobile: "8888888888", password: "manohar123", role: "customer" },
  { id: 3, name: "Agent Karthik",    email: "agent@mlrr.com",    mobile: "7777777777", password: "agent123",   role: "agent" },
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
};

export const isLoggedIn = () => !!getUser();
