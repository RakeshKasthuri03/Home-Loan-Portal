import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import LoanApply from "./pages/loanpages/LoanApply";
import LoanTypes from "./pages/loanpages/LoanTypes";

import MainLayout from "./Layout/MainLayout";
import AgentLayout from "./Layout/AgentLayout";
import AdminLayout from "./Layout/AdminLayout";

import LeadsDetails from "./pages/Agent/LeadsDetails";
import Applicationsub from "./pages/Agent/Applicationsub";
import DocumentAction from "./pages/Agent/DocumentAction";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminApplications from "./pages/Admin/AdminApplications";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminAgents from "./pages/Admin/AdminAgents";

import EmiPage from "./pages/calculators/EmiPage";
import EligibilityPage from "./pages/calculators/EligibilityPage";
import NavBarCal from "./Components/calculator/NavBarCal";

import AdminLogin from "./pages/auth/AdminLogin";
import AgentLogin from "./pages/auth/AgentLogin";
import UserDashboard from "./Components/userDashboard/UserDashboard";
import { isLoggedIn, getUser } from "./utils/auth";
import ScrollToTop from "./Components/ScrollToTop";
import Contact from "./pages/Contact";

const ProtectedRoute = ({ children, requiredRole }) => {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) {
    // redirect to correct portal
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "agent") return <Navigate to="/agent/dashboard" replace />;
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>

        {/* ── PUBLIC + USER ROUTES (with main header/footer) ── */}
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/loan-types" element={<LoanTypes />} />
          <Route path="/apply"      element={<LoanApply />} />
          <Route path="/login"      element={<Login />} />
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/calculator" element={<NavBarCal />}>
            <Route index element={<Navigate to="emi" replace />} />
            <Route path="emi"         element={<EmiPage />} />
            <Route path="eligibility" element={<EligibilityPage />} />
          </Route>

          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute requiredRole="customer">
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
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
