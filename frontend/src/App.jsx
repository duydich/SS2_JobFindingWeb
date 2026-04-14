import { BrowserRouter, Routes, Route } from "react-router-dom";
import AboutUs from "./pages/about/AboutUs";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Explore from "./pages/explore/Explore";
import StudentProfile from "./pages/studentprofile/StudentProfile"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/studentprofile" element={<StudentProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;