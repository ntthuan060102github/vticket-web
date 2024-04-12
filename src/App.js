import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import './App.css'
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign_up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
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