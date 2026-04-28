import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import Header from './Components/Header'
import './style.css'
import Footer from './Components/Footer'
function App() {
  return (
    <>
      <Header/>
    {/* <div className="min-h-screen bg-black flex items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-500">
        Tailwind v4 ✅ Working
      </h1>
    </div> */}
    <Footer/>
 

    </>
  )
}

export default App
