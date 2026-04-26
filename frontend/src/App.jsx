import { BrowserRouter, Routes, Route } from "react-router-dom";
import AboutUs from "./pages/about/AboutUs";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Explore from "./pages/explore/Explore";
import StudentProfile from "./pages/studentprofile/StudentProfile"
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";
import PostJob from "./pages/recruiter/PostJob";
import SavedJobs from "./pages/savedjobs/SavedJobs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/studentprofile" element={<StudentProfile />} />
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        <Route path="/recruiterprofile" element={<RecruiterProfile />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/edit-job/:id" element={<PostJob />} />
        <Route path="/saved" element={<SavedJobs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;