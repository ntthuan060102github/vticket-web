import AllEventTopic from "../pages/AllEventTopic/AllEventTopic";
import CreateEvent from "../pages/CreateEvent";
import DashboardAdmin from "../pages/DashboardAdmin/DashboardAdmin";
import DashboardBusiness from "../pages/DashboardBusiness";
import EventDetail from "../pages/EventDetail";
import EventsForTopic from "../pages/EventsForTopic/EventsForTopic";
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import OTP from "../pages/OTP/OTP";
import PaymentResult from "../pages/PaymentResult/PaymentResult";
import ProfileCustomer from "../pages/ProfileCustomer";
import ResetPassword from "../pages/ResetPassword";
import SearchPage from "../pages/SearchPage";
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
    {path: '/dashboard-business', component: <DashboardBusiness/>},
    {path: '/dashboard-admin', component: <DashboardAdmin/>},
    {path: '/create-event', component: <CreateEvent/>},
    {path: '/event-detail/:slug', component: <EventDetail/>},
    {path: '/events-for-topic/:slug', component: <EventsForTopic/>},
    {path: '/search', component: <SearchPage/>},
    {path: '/all-event-topic', component: <AllEventTopic/>},
    {path: '/payment-result', component: <PaymentResult/>},
];

export {publicRoutes, privateRoutes};