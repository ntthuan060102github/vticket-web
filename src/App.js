import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import './App.css'
import SignUp from "./pages/SignUp";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign_up" element={<SignUp />} />
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