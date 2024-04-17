import React from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from "react-router-dom";
import './App.css'
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import OTP from "./pages/OTP/OTP";
import ResetPassword from './pages/ResetPassword';
import RedirectInterceptor from "./helpers/axios_provider"

// Hàm kiểm tra token
const isAuthenticated = () => {
  const accessToken = localStorage.getItem('accessToken');
  // return true nếu có token
  return !!accessToken;
};


function App() {

  return (
    <BrowserRouter>
      <RedirectInterceptor/>
      <Routes>
        {/* <Route
          path="/"
          element={isAuthenticated() ? <Navigate to="/" replace /> : <Navigate to="/login" replace />}
        >
          <Route index element={<HomePage />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NoPage />} />
        </Route> */}
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path='/otp/:slug' element={<OTP/>} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;