import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, MapPin, Heart, Briefcase, LogOut, DollarSign, Tag, ArrowLeft, Coffee, ShoppingBag, Monitor, Megaphone, Clock } from "lucide-react";
import "./searchpage.css";
import "../explore/explore.css"; 
import JobCard from "../../components/JobCard";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Search states
  const [jobtitle, setJobtitle] = useState(searchParams.get("keyword") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [salary, setSalary] = useState(searchParams.get("salary") || "");
  const [salaryType, setSalaryType] = useState(searchParams.get("salaryType") || "month");
  const [industry, setIndustry] = useState(searchParams.get("industry") || "");
  const [customIndustry, setCustomIndustry] = useState("");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
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
    fetchSearchResults();
    if (currentUserId) {
      fetchSavedJobIds();
      fetchUserProfile();
    }
  }, [searchParams, currentUserId]);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/${currentUserId}`);
      const data = await res.json();
      if (data.success) setUser(data.data);
    } catch (err) { console.error(err); }
  };

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const keyword = searchParams.get("keyword") || "";
      const industryParam = searchParams.get("industry") || "";
      const salaryParam = searchParams.get("salary") || "";
      const locationParam = searchParams.get("location") || "";
      
      let url = `${import.meta.env.VITE_API_URL}/api/jobs?keyword=${keyword}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success) {
        let filteredJobs = data.data;
        
        if (industryParam) {
          filteredJobs = filteredJobs.filter(j => 
            j.industry && j.industry.trim().toLowerCase() === industryParam.trim().toLowerCase()
          );
        }

        if (locationParam) {
          filteredJobs = filteredJobs.filter(j => 
            j.address && j.address.toLowerCase().includes(locationParam.toLowerCase())
          );
        }

        if (salaryParam) {
          const type = searchParams.get("salaryType");
          const searchNum = parseInt(salaryParam.replace(/[^0-9]/g, ""), 10);

          filteredJobs = filteredJobs.filter(j => {
            const jobSalaryStr = j.salary.toLowerCase();
            const jobNum = parseInt(j.salary.replace(/[^0-9]/g, ""), 10);
            
            if (isNaN(jobNum)) return false;

            const matchesAmount = jobNum >= searchNum;
            
            let matchesType = true;
            if (type === "hour") {
              matchesType = jobSalaryStr.includes("/hr") || jobSalaryStr.includes("giờ") || jobSalaryStr.includes("hour");
            } else if (type === "month") {
              matchesType = jobSalaryStr.includes("/mo") || jobSalaryStr.includes("tháng") || jobSalaryStr.includes("month") || (!jobSalaryStr.includes("/hr") && !jobSalaryStr.includes("giờ"));
            }
            return matchesAmount && matchesType;
          });
        }
        
        setJobs(filteredJobs);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobIds = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/saved-jobs/${currentUserId}`);
      const data = await res.json();
      if (data.success) {
        setSavedJobIds(data.data.map(j => j._id));
      }
    } catch (err) { console.error(err); }
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
    if (e.key === "Enter") handleSearch();
  };

  const handleToggleSave = async (jobId) => {
    if (!currentUserId) {
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/saved-jobs/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, jobId })
      });
      const data = await res.json();
      if (data.success) {
        if (data.isSaved) setSavedJobIds(prev => [...prev, jobId]);
        else setSavedJobIds(prev => prev.filter(id => id !== jobId));
      }
    } catch (err) { console.error(err); }
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
              <div className="nav-item" onClick={() => navigate("/employment-history")}>
                <Clock size={18} />
                <span>History</span>
              </div>

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
        <button className="back-link-main" onClick={() => navigate("/explore")}>
          <ArrowLeft size={18} />
          <span>Back to Explore</span>
        </button>

        {/* SEARCH BOX */}
        <div className="search-header-area">
            <h2 className="search-page-title">Search Jobs</h2>
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

        {/* RESULTS */}
        <div className="section">
          {loading ? (
            <div className="section-header">
              <h2>Searching...</h2>
            </div>
          ) : (
            jobs.length > 0 && (
              <div className="section-header">
                <h2>Found {jobs.length} results</h2>
              </div>
            )
          )}
          
          {loading ? (
            <div className="loading-results">Loading matching jobs...</div>
          ) : (
            <div className="job-grid">
              {jobs.map((job) => (
                <JobCard 
                    key={job._id}
                    job={job}
                    onClick={() => navigate(`/job-preview/${job._id}`)}
                    onToggleSave={handleToggleSave}
                    isSaved={isSaved(job._id)}
                />
              ))}
            </div>
          )}
          
          {!loading && jobs.length === 0 && (
            <div className="no-results-box">
              <Search size={48} color="#cbd5e1" />
              <p>No jobs match your filters. Try adjusting your search.</p>
            </div>
          )}
        </div>
      </div>

      <div className="footer">
        <div><h3>JobFinder</h3><p>Helping students find jobs near them.</p></div>
        <div><h4>Product</h4><p>Privacy</p><p>Terms</p></div>
        <div><h4>Support</h4><p>Help</p><p>Contact</p></div>
      </div>
    </div>
  );
}

export default SearchPage;