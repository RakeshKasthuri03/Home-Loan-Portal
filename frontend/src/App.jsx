import { useState } from 'react'

import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './Components/Header'
import './style.css'
import Footer from './Components/Footer'
import Home from './pages/Home'
import Login from './pages/auth/Login';
function App() {
 
  return (
    <>
  
    <BrowserRouter>
    <Routes>
      <Route  to path="/" element={<Home/>}/>
      <Route to path='/login' element={<Login/>}/>
    </Routes>
    </BrowserRouter>
    

    </>
  )
}

export default App
