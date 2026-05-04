import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './style.css'
import Home from './pages/Home'
import Login from './pages/auth/Login';
import LoanApply from './pages/loanpages/LoanApply';
import LoanTypes from './pages/loanpages/LoanTypes';
import UserDashboard from './Components/userDashboard/UserDashboard';
import LeadsDetails from './pages/Agent/LeadsDetails';
import { isLoggedIn } from './utils/auth';
import MainLayout from './Layout/MainLayout';
import EmiPage from './pages/calculators/EmiPage';
import NavBarCal from './Components/calculator/NavBarCal';
import EligibilityPage from './pages/calculators/EligibilityPage';
import AdminLayout from './Layout/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminApplications from './pages/Admin/AdminApplications';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminAgents from './pages/Admin/AdminAgents';
// Redirect to home if not logged in
const ProtectedRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout/>}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/loan-types" element={<LoanTypes />} />
        
        <Route path="/calculator" element={<NavBarCal />}>
            <Route index element={<Navigate to="emi" />} />
            <Route path="emi" element={<EmiPage />} />
            <Route path="eligibility" element={<EligibilityPage />} />
          </Route>

        <Route path="/apply" element={<LoanApply />} />
        <Route path="/agent" element={<LeadsDetails />} />
        <Route path="/*" element={
                                            <ProtectedRoute>
                                              <UserDashboard />
                                            </ProtectedRoute>
                                          }/>
       </Route>
       <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
          <Route index element={<AdminDashboard />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/agents" element={<AdminAgents />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
