import CreateEvent from "../pages/CreateEvent";
import EventDetail from "../pages/EventDetail";
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import OTP from "../pages/OTP/OTP";
import PaymentResult from "../pages/PaymentResult/PaymentResult";
import ProfileCustomer from "../pages/ProfileCustomer";
import ResetPassword from "../pages/ResetPassword";
import SignUp from "../pages/SignUp";

const publicRoutes = [
    {path: '/sign-up', component: <SignUp/>},
    {path: '/login', component: <Login/>},
    {path: '/otp/:slug', component: <OTP/>},
    {path: '/reset-password', component: <ResetPassword/>},
];
const privateRoutes = [
    {path: '/', component: <HomePage/>},
    {path: '/profile', component: <ProfileCustomer/>},
    {path: '/create-event', component: <CreateEvent/>},
    {path: '/event-detail/:slug', component: <EventDetail/>},
    {path: '/payment-result/:slug', component: <PaymentResult/>},
];

export {publicRoutes, privateRoutes};