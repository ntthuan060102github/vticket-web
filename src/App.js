import React from 'react';
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import './App.css'
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import OTP from "./pages/OTP/OTP";
import ResetPassword from './pages/ResetPassword';
import RedirectInterceptor from "./helpers/axios_provider"


function App() {

  return (
    <BrowserRouter>
      <RedirectInterceptor/>
      <Routes>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path='/OTP/:slug' element={<OTP />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        {/* <Route path="/" element={<HomePage />}>
          <Route index element={<HomePage />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NoPage />} />
        </Route> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App;