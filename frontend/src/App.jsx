import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './style.css'
import Home from './pages/Home'
import Login from './pages/auth/Login';
import { LoanApply } from './Components/LoanForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/apply"   element={<LoanApply />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
