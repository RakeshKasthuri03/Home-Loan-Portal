import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './style.css'
import Home from './pages/Home'
import Login from './pages/auth/Login';
import LoanApply from './pages/loanpages/LoanApply';

import UserDashboard from './Components/userDashboard/UserDashboard';
import LeadsDetails from './pages/Agent/LeadsDetails';
import { isLoggedIn } from './utils/auth';
import MainLayout from './Layout/MainLayout';
import EmiPage from './pages/calculators/EmiPage';
import Applicationsub from './pages/Agent/Applicationsub';
import AgentLayout from './Layout/AgentLayout';
import LoanTypes from './pages/loanpages/LoanTypes';

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
        <Route path="/calculator" element={<EmiPage />} />
        <Route path="/apply" element={<LoanApply />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        </Route>
        <Route element={<AgentLayout/>}>
          <Route path="/agent" element={<LeadsDetails />} />
          <Route path="/agent/applications" element={<Applicationsub />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
