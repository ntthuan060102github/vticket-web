import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import './App.css'
import Login from "./pages/Login/Login";


function App() {

  return (
    <BrowserRouter>
      <Routes>
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