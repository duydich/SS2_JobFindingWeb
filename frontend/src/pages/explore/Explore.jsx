import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./explore.css";
import { Search, MapPin, Heart, Briefcase, LogOut, Coffee, ShoppingBag, Monitor, Megaphone, DollarSign, Tag, ChevronDown } from "lucide-react";

function Explore() {
  const navigate = useNavigate();
  const [jobtitle, setJobtitle] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [salaryType, setSalaryType] = useState("month"); // month or hour
  const [industry, setIndustry] = useState("");
  const [customIndustry, setCustomIndustry] = useState("");
  const [showIndustryOther, setShowIndustryOther] = useState(false);
  
  const [jobs, setJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [user, setUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem("userId"));

  const industries = [
    "Information Technology",
    "Food & Beverage",
    "Retail & Sales",
    "Marketing & Communication",
    "Education & Training",
    "Healthcare & Medical",
    "Office & Administration",
    "Construction & Engineering",
    "Logistics & Transport",
    "Other"
  ];

  useEffect(() => {
    fetchJobs();
    if (currentUserId) {
      fetchSavedJobIds();
      fetchUserProfile();
    }
  }, [currentUserId]);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/profile/${currentUserId}`);
      const data = await res.json();
      if (data.success) setUser(data.data);
    } catch (err) { console.error(err); }
  };

  const fetchJobs = async () => {
    const res = await fetch(`http://localhost:5000/api/jobs?keyword=${jobtitle}`);
    const data = await res.json();
    if (data.success) setJobs(data.data);
  };

  const handleSearch = () => {
    const finalIndustry = industry === "Other" ? customIndustry : industry;
    const query = new URLSearchParams({
      keyword: jobtitle,
      location: location,
      salary: salary,
      salaryType: salaryType,
      industry: finalIndustry
    }).toString();
    navigate(`/search?${query}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const fetchSavedJobIds = async () => {
// ... (rest of the code remains similar)
    try {
      const res = await fetch(`http://localhost:5000/api/saved-jobs/${currentUserId}`);
      const data = await res.json();
      if (data.success) {
        setSavedJobIds(data.data.map(j => j._id));
      }
    } catch (err) { console.error(err); }
  };

  const handleToggleSave = async (jobId) => {
    if (!currentUserId) {
      alert("Please login to save jobs!");
      navigate("/login");
      return;
    }
    
    try {
      const res = await fetch("http://localhost:5000/api/saved-jobs/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, jobId })
      });
      const data = await res.json();
      
      if (data.success) {
        if (data.isSaved) {
          setSavedJobIds(prev => [...prev, jobId]);
        } else {
          setSavedJobIds(prev => prev.filter(id => id !== jobId));
        }
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const isSaved = (id) => savedJobIds.includes(id);

  return (
    <div className="explore">

      {/* NAVBAR */}
      <div className="nav">
        <div className="nav-left">
          <h2 className="logo" onClick={() => navigate("/")} style={{cursor: "pointer"}}>JobFinder</h2>
        </div>

        <div className="nav-right">
          {!currentUserId ? (
            <div className="auth-btns">
              <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
              <button className="join-btn" onClick={() => navigate("/register")}>Join</button>
            </div>
          ) : (
            <>
              <div className="nav-item" onClick={() => navigate("/saved")}>
                <Heart 
                  size={18} 
                  fill={savedJobIds.length > 0 ? "#4f46e5" : "none"} 
                  color={savedJobIds.length > 0 ? "#4f46e5" : "currentColor"} 
                />
                <span>Saved</span>
              </div>

              <div className="nav-item avatar" onClick={() => navigate(user?.role === "recruiter" ? "/recruiter" : "/studentprofile")}>
                <img src={user?.avatar || "https://i.pravatar.cc/40"} alt="Profile" />
              </div>

              <div className="nav-item" title="Logout" onClick={() => { 
                localStorage.removeItem("userId"); 
                localStorage.removeItem("role"); 
                setCurrentUserId(null);
                window.location.reload(); 
              }}>
                <LogOut size={18} />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="explore-content">
        {/* HERO */}
        <div className="hero">
          <h1>Explore <span>part-time</span> jobs near you</h1>
          <p>Browse jobs tailored for students and freshers.</p>
          <div className="search-box" onKeyDown={handleKeyDown}>
            <div className="input-group">
              <div className="input">
                <Briefcase size={16} />
                <input type="text" placeholder="Job title..." value={jobtitle} onChange={(e) => setJobtitle(e.target.value)} />
              </div>
              <div className="input">
                <MapPin size={16} />
                <input type="text" placeholder="Location..." value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
            </div>

            <div className="input-group">
              <div className="input salary-input">
                <DollarSign size={16} />
                <input type="number" placeholder="Min salary..." value={salary} onChange={(e) => setSalary(e.target.value)} />
                <select value={salaryType} onChange={(e) => setSalaryType(e.target.value)}>
                  <option value="month">/mo</option>
                  <option value="hour">/hr</option>
                </select>
              </div>
              
              <div className="input industry-input">
                <Tag size={16} />
                {industry === "Other" ? (
                  <input 
                    type="text" 
                    placeholder="Enter industry..." 
                    value={customIndustry} 
                    onChange={(e) => setCustomIndustry(e.target.value)}
                    onBlur={() => { if(!customIndustry) setIndustry(""); }}
                    autoFocus
                  />
                ) : (
                  <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
                    <option value="">All Industries</option>
                    {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                )}
              </div>
            </div>
            
            <button className="search-btn" onClick={handleSearch}>Search Jobs</button>
          </div>
        </div>

        {/* JOB GRID */}
        <div className="section">
          <div className="section-header"><h2>Recommended jobs</h2></div>
          <div className="job-grid">
            {jobs.map((job) => (
              <div className="job-card" key={job._id} onClick={() => navigate(`/job-preview/${job._id}`)}>
                <img src={job.img || "https://picsum.photos/300/200"} alt="" />
                <div className="job-body">
                  <div className="job-top">
                    <h4>{job.title}</h4>
                    <div className="heart-icon-box" onClick={(e) => { e.stopPropagation(); handleToggleSave(job._id); }}>
                      <Heart 
                          size={20} 
                          fill={isSaved(job._id) ? "#4f46e5" : "none"} 
                          color={isSaved(job._id) ? "#4f46e5" : "#94a3b8"}
                          style={{cursor: "pointer", transition: "0.2s"}}
                      />
                    </div>
                  </div>
                  <p>{job.company}</p>
                  <div className="job-tags">
                    <span className="tag-industry">{job.industry}</span>
                    <span className="tag-type">{job.jobType}</span>
                  </div>
                  <div className="job-info">
                    <span>{job.address}</span>
                    <span className="salary">{job.salary}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h2>Browse by category</h2>
          <div className="category-grid">
            <div className="category big" onClick={() => {setJobtitle("Food"); fetchJobs();}}><Coffee /><p>Food & Beverage</p></div>
            <div className="category small" onClick={() => {setJobtitle("Retail"); fetchJobs();}}><ShoppingBag /><p>Retail</p></div>
            <div className="category small orange" onClick={() => {setJobtitle("Office"); fetchJobs();}}><Monitor /><p>Office</p></div>
            <div className="category small purple" onClick={() => {setJobtitle("Marketing"); fetchJobs();}}><Megaphone /><p>Marketing</p></div>
          </div>
        </div>
      </div>

      <div className="footer">
        <div><h3>JobFinder</h3><p>Helping students find jobs near them.</p></div>
        <div><h4>Product</h4><p>Privacy</p><p>Terms</p></div>
        <div><h4>Support</h4><p>Help</p><p>Contact</p></div>
      </div>
    </div>
  );
};

export default Explore;