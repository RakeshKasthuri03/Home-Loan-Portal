import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import AgentLayout from "./layouts/AgentLayout";
import AdminLayout from "./layouts/AdminLayout";

import { getUser } from "./utils/auth";
import ScrollToTop from "./components/ScrollToTop";

// User module
import Login from "./modules/user/Login";
import UserDashboard from "./modules/user/UserDashboard";

// Loan module
import LoanApply from "./modules/loan/LoanApply";
import LoanTypes from "./modules/loan/LoanTypes";

// Admin module
import AdminLogin from "./modules/admin/AdminLogin";
import AdminDashboard from "./modules/admin/AdminDashboard";
import AdminApplications from "./modules/admin/AdminApplications";
import AdminUsers from "./modules/admin/AdminUsers";
import AdminAgents from "./modules/admin/AdminAgents";

// Agent module
import AgentLogin from "./modules/agent/AgentLogin";
import LeadsDetails from "./modules/agent/LeadsDetails";
import Applicationsub from "./modules/agent/Applicationsub";
import DocumentAction from "./modules/agent/DocumentAction";

// Calculator
import EmiPage from "./calculator/EmiPage";
import EligibilityPage from "./calculator/EligibilityPage";
import NavBarCal from "./calculator/NavBarCal";

// Contact
import ContactLayout from "./contact/ContactLayout";
import AgentForm from "./modules/admin/AgentForm";

const ProtectedRoute = ({ children, requiredRole }) => {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) {
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "agent") return <Navigate to="/agent/dashboard" replace />;
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>

          {/* ── PUBLIC + USER ROUTES ── */}
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/loan-types" element={<LoanTypes />} />
            <Route path="/apply"      element={<LoanApply />} />
            <Route path="/login"      element={<Login />} />
            <Route path="/contact"    element={<ContactLayout />} />
            <Route path="/calculator" element={<NavBarCal />}>
              <Route index element={<Navigate to="emi" replace />} />
              <Route path="emi"         element={<EmiPage />} />
              <Route path="eligibility" element={<EligibilityPage />} />
            </Route>

            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute requiredRole="user">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* ── AGENT ROUTES ── */}
          <Route path="/agent" element={<AgentLogin />} />
          <Route element={<AgentLayout />}>
            <Route path="/agent/dashboard"    element={<ProtectedRoute><LeadsDetails /></ProtectedRoute>} />
            <Route path="/agent/applications" element={<ProtectedRoute><Applicationsub /></ProtectedRoute>} />
            <Route path="/agent/docaction"    element={<ProtectedRoute><DocumentAction /></ProtectedRoute>} />
          </Route>

          {/* ── ADMIN ROUTES ── */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard"    element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/applications" element={<ProtectedRoute><AdminApplications /></ProtectedRoute>} />
            <Route path="/admin/users"        element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/agents"       element={<ProtectedRoute><AdminAgents /></ProtectedRoute>} />
            <Route path="/admin/form"         element={<ProtectedRoute><AgentForm /></ProtectedRoute>} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
