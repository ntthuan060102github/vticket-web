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
import CreateEvent from './pages/CreateEvent';
import ProfileCustomer from './pages/ProfileCustomer';

// Hàm kiểm tra token
const isAuthenticated = () => {
  const accessToken = localStorage.getItem('access');
  // return true nếu có token
  if(accessToken !== null)
    return true;
  return false;
};


function App() {

  return (
    <BrowserRouter>
      <RedirectInterceptor/>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated() ? <Navigate to="/" replace /> : <Navigate to="/login" replace />}
        >
          {/* <Route index element={<HomePage />} /> */}
          {/* <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NoPage />} /> */}
        </Route>
        <Route path="/profile" element={isAuthenticated() ? <ProfileCustomer /> : <Navigate to="/login" replace />} />
        <Route path="/create-event" element={isAuthenticated() ? <CreateEvent /> : <Navigate to="/login" replace />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path='/otp/:slug' element={<OTP/>} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;