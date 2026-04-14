import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./explore.css";
import { Search, MapPin, Heart, Briefcase, User, LogOut, Coffee, ShoppingBag, Monitor, Megaphone } from "lucide-react";

function Explore() {

  const navigate = useNavigate();

  const [jobtitle, setJobtitle] = useState("");
  const [location, setLocation] = useState("");


  const jobs = [
    {
      title: "Senior Barista",
      company: "The Coffee Club",
      salary: "$22/hr",
      distance: "300m away",
      img: "https://picsum.photos/300/200?random=1"
    },
    {
      title: "Retail Assistant",
      company: "The Iconic",
      salary: "$25/hr",
      distance: "1.2km away",
      img: "https://picsum.photos/300/200?random=2"
    },
    {
      title: "Office Admin",
      company: "Tech Solutions",
      salary: "$28/hr",
      distance: "2.5km away",
      img: "https://picsum.photos/300/200?random=3"
    },
    {
      title: "Marketing Intern",
      company: "Creative Agency",
      salary: "$20/hr",
      distance: "500m away",
      img: "https://picsum.photos/300/200?random=4"
    }
  ];

  return (
    <div className="explore">

      {/* NAVBAR */}
      <div className="nav">

        {/* LEFT */}
        <div className="nav-left">
          <h2 className="logo">JobFinder</h2>
        </div>

        {/* CENTER */}
        <div className="nav-center">
          <div className="search-bar">
            <Search size={16} />
            <input placeholder="Search for opportunities..." />
          </div>
        </div>

        {/* RIGHT */}
        <div className="nav-right">

          {/* SAVED JOB */}
          <div
            className="nav-item"
            onClick={() => navigate("/saved")}
          >
            <Heart size={18} />
            <span>Saved</span>
          </div>

          {/* PROFILE */}
          <div
            className="nav-item avatar"
            onClick={() => navigate("/studentprofile")}
          >
            <img src="https://i.pravatar.cc/40" alt="" />
          </div>

          {/* LOGOUT */}
          <div
            className="nav-item"
            onClick={() => {
              localStorage.removeItem("userId");
              navigate("/login");
            }}
          >
            <LogOut size={18} />
          </div>

        </div>
      </div>

      {/* HERO */}
      <div className="hero">
        <h1>
          Explore <span>part-time</span> jobs near you
        </h1>
        <p>Browse jobs tailored for students and freshers.</p>

        <div className="search-box">
          <div className="input">
            <Briefcase size={16} />
            <input
              type="text"
              placeholder="Job title..."
              value={jobtitle}
              onChange={(e) => setJobtitle(e.target.value)}
            />

          </div>

          <div className="input">
            <MapPin size={16} />
            <input
              type="text"
              placeholder="Location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <button>Search Jobs</button>
        </div>
      </div>

      {/* JOB GRID */}
      <div className="section">
        <div className="section-header">
          <h2>Recommended jobs</h2>
        </div>

        <div className="job-grid">
          {jobs.map((job, i) => (
            <div className="job-card" key={i}>
              <img src={job.img} alt="" />

              <div className="job-body">
                <div className="job-top">
                  <h4>{job.title}</h4>
                  <Heart size={16} />
                </div>

                <p>{job.company}</p>

                <div className="job-info">
                  <span>{job.distance}</span>
                  <span className="salary">{job.salary}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORY */}
      <div className="section">
        <h2>Browse by category</h2>

        <div className="category-grid">

          <div className="category big">
            <Coffee />
            <p>Food & Beverage</p>
          </div>

          <div className="category small">
            <ShoppingBag />
            <p>Retail</p>
          </div>

          <div className="category small orange">
            <Monitor />
            <p>Office</p>
          </div>

          <div className="category small purple">
            <Megaphone />
            <p>Marketing</p>
          </div>

        </div>
      </div>

      {/* JOB NEAR */}
      <div className="section">
        <h2>Jobs near you</h2>

        <div className="job-row">
          {jobs.slice(0, 3).map((job, i) => (
            <div className="job-large" key={i}>
              <img src={job.img} alt="" />

              <div className="job-content">
                <h4>{job.title}</h4>
                <p>{job.company}</p>

                <div className="job-bottom">
                  <span>{job.salary}</span>
                  <span className="details">Details</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <div>
          <h3>JobFinder</h3>
          <p>Helping students find jobs near them.</p>
        </div>

        <div>
          <h4>Product</h4>
          <p>Privacy</p>
          <p>Terms</p>
        </div>

        <div>
          <h4>Support</h4>
          <p>Help</p>
          <p>Contact</p>
        </div>
      </div>

    </div>
  );
};

export default Explore;