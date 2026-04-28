import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './style.css'
import Home from './pages/Home'
import Login from './pages/auth/Login';
import { LoanApply } from './Components/LoanForm';
import MainLayout from './Layout/MainLayout';
import LeadsDetails from '../src/pages/Agent/LeadsDetails';
import Applicationsub from './pages/Agent/Applicationsub';
import LoanTypes from './pages/loanpages/loantypes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout/>}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/loantypes" element={<LoanTypes />} />
        <Route path="/appsub" element={<Applicationsub />} />
        <Route path="/leaddetails" element={<LeadsDetails/>} />
        <Route path='/apply' element={<LoanApply/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
