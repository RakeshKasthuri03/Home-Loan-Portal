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

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminApplications from "./pages/Admin/AdminApplications";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminAgents from "./pages/Admin/AdminAgents";

import EmiPage from "./pages/calculators/EmiPage";
import EligibilityPage from "./pages/calculators/EligibilityPage";
import NavBarCal from "./Components/calculator/NavBarCal";

import UserDashboard from "./Components/userDashboard/UserDashboard";
import { isLoggedIn } from "./utils/auth";

const ProtectedRoute = ({ children }) =>
  isLoggedIn() ? children : <Navigate to="/login" replace />;

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/loan-types" element={<LoanTypes />} />
          <Route path="/apply" element={<LoanApply />} />

          <Route path="/calculator" element={<NavBarCal />}>
            <Route index element={<Navigate to="emi" replace />} />
            <Route path="emi" element={<EmiPage />} />
            <Route path="eligibility" element={<EligibilityPage />} />
          </Route>
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        </Route>

          <Route path="/login" element={<Login />} />
        <Route path="/agent" element={<Navigate to="/login?role=agent" replace />} />
        <Route path="/admin" element={<Navigate to="/login?role=admin" replace />} />

        <Route element={<AgentLayout />}>
          <Route
            path="/agent/dashboard"
            element={
              <ProtectedRoute>
                <LeadsDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/applications"
            element={
              <ProtectedRoute>
                <Applicationsub />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route element={<AdminLayout />}>
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/applications"
            element={
              <ProtectedRoute>
                <AdminApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/agents"
            element={
              <ProtectedRoute>
                <AdminAgents />
              </ProtectedRoute>
            }
          />
        </Route>
  
  

        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
