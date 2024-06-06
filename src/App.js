import * as React from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes, 
  Outlet,
  Router
} from "react-router-dom";
import axios from 'axios';

import './App.css'
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import OTP from "./pages/OTP/OTP";
import ResetPassword from './pages/ResetPassword';
import RedirectInterceptor from "./helpers/axios_provider"
import CreateEvent from './pages/CreateEvent';
import HomePage from './pages/HomePage';
import ProfileCustomer from './pages/ProfileCustomer';


import { publicRoutes, privateRoutes } from './routes';

const PrivateRoute = ({ isAuthenticated }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};


function App() {
  const accessToken = localStorage.getItem('access');

  const isAuthenticated = () => {
    return !!accessToken;
  };

  const role = localStorage.getItem('role');

  return (
    <BrowserRouter>
      <RedirectInterceptor/>
      <Routes>
        {/* <Route element={<PrivateRoute isAuthenticated={isAuthenticated()} />}>
          {role === "customer" && (
            <Route>
              <Route path="/" element={isAuthenticated() ? <HomePage /> : <Navigate to="/login" replace />} /> 
              <Route path="/profile" element={isAuthenticated() ? <ProfileCustomer /> : <Navigate to="/login" replace />} /> 
            </Route>
          )}

          {role === "business" && (
            <Route>
              <Route path="/" element={isAuthenticated() ? <HomePage /> : <Navigate to="/login" replace />} /> 
              <Route path="/create-event" element={isAuthenticated() ? <CreateEvent /> : <Navigate to="/login" replace />} /> 
            </Route>
          )}
        </Route>
        <Route path="/sign-up" element={!isAuthenticated() && <SignUp />} />
        <Route path="/login" element={!isAuthenticated()  && <Login /> } />
        <Route path='/otp/:slug' element={<OTP/>} />
        <Route path="/reset-password" element={<ResetPassword />} /> */}
        {publicRoutes.map((route, index) =>{
          return <Route key={index} path={route.path} element={route.component}/>;
        }
        )}
        {privateRoutes.map((route, index) =>{
          return <Route key={index} path={route.path} element={route.component}/>;
        }
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App;