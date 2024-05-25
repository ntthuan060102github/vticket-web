import * as React from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes, 
  Outlet
} from "react-router-dom";
import './App.css'
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import OTP from "./pages/OTP/OTP";
import ResetPassword from './pages/ResetPassword';
import RedirectInterceptor from "./helpers/axios_provider"
import CreateEvent from './pages/CreateEvent';
import HomePage from './pages/HomePage';
import ProfileCustomer from './pages/ProfileCustomer';

const PrivateRoute = ({ isAuthenticated }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  const [accessToken,setAccessToken] = React.useState('');
  React.useEffect(()=>{
    setAccessToken(localStorage.getItem('access'))
  },([]))

  const isAuthenticated = () => {
    return !!accessToken;
  };

  const role = localStorage.getItem('role');

  return (
    <BrowserRouter>
      <RedirectInterceptor/>
      <Routes>
        <Route element={<PrivateRoute isAuthenticated={isAuthenticated()} />}>
          <Route path='/' element={role === 'customer' && <HomePage />} />
          {/* <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NoPage />} /> */}
        </Route>
        <Route path="/profile" element={isAuthenticated() ? <ProfileCustomer /> : <Navigate to="/login" replace />} />
        <Route path="/create-event" element={isAuthenticated() ? <CreateEvent /> : <Navigate to="/login" replace />} />
        <Route path="/sign-up" element={!isAuthenticated() ? <SignUp /> : <Navigate to="/" replace />} />
        <Route path="/login" element={!isAuthenticated()  ? <Login /> : <Navigate to="/" replace />} />
        <Route path='/otp/:slug' element={<OTP/>} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;