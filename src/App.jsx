import { useContext, useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './loginform/Login';
import Register from './loginform/Register';
import Chatmain from './chats/Chatmain';
import ThemeMode from './ThemeMode/ThemeMode';
import { AuthContext } from './context/AuthContext';
import ForgotPassword from './loginform/ForgotPassword';


function App() {


  const {currentUser}=useContext(AuthContext)
 

  const ProtectedRoute = ({children})=>{
    if(!currentUser){
     
      return <Navigate to="/login"/>
    }else{
      return children
    }
  }
  const ProtectedRoute2 = ({children})=>{
    if(currentUser){
      return <Navigate to="/"/>
    }else{
      return children
    }
  }
  return (
    
    <div className='w-full h-full '>
      <div className='hidden md:block '>
        <ThemeMode  />
      </div>

      <BrowserRouter>
                <Routes>
                  <Route path="/">
                  <Route index element={<ProtectedRoute> <Chatmain  /> </ProtectedRoute>} />
                    <Route path="login" element={<Login  /> } />
                    <Route path="reset" element={<ForgotPassword  /> } />
                    <Route path="register" element={<Register />} />
                  </Route>
                </Routes>
      </BrowserRouter>   
      
      
    </div>
  )
}

export default App
