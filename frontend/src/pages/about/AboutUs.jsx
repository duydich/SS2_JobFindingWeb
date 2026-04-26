import React from "react";
import { Link } from "react-router-dom";
import "./aboutus.css";
import { MapPin, Filter, Bookmark, Briefcase } from "lucide-react";

const AboutUs = () => {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  // Determine the target path based on login status and role
  const getTargetPath = () => {
    if (!userId) return "/login";
    return role === "recruiter" ? "/recruiter" : "/explore";
  };

  return (
    <div className="about-container">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="container nav-inner">
          <div className="nav-logo">JobFinder</div>
          <Link to={getTargetPath()} className="nav-btn">
            {userId ? (role === "recruiter" ? "Go to Dashboard" : "Explore Jobs") : "Sign in"}
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="about-hero">
        <div className="container hero-inner">

          <div className="about-text">
            <h1>
              Find part-time jobs <span>near you</span>
            </h1>

            <p>
              Discover nearby job opportunities tailored for students.
              Join thousands of users finding their first career steps.
            </p>

            <Link to={getTargetPath()} className="link-btn">
              {userId ? "Start Working →" : "Sign in →"}
            </Link>
          </div>

          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
              alt="students"
            />

            <div className="about-badge">
              <MapPin size={16} />
              <div>
                <strong>Local opportunities</strong>
                <span>32 jobs within 3km radius</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="about-features">
        <div className="container">

          <h2>Everything you need to succeed</h2>

          <div className="feature-grid">

            <div className="feature-card">
              <div className="icon-box blue">
                <MapPin />
              </div>
              <h3>Radius Search</h3>
              <p>Find jobs near your campus quickly.</p>
            </div>

            <div className="feature-card">
              <div className="icon-box purple">
                <Filter />
              </div>
              <h3>Advanced Filters</h3>
              <p>Filter by salary, time, and type.</p>
            </div>

            <div className="feature-card">
              <div className="icon-box orange">
                <Bookmark />
              </div>
              <h3>Bookmark Jobs</h3>
              <p>Save jobs and apply anytime.</p>
            </div>

            <div className="feature-card">
              <div className="icon-box indigo">
                <Briefcase />
              </div>
              <h3>Recruiter Suite</h3>
              <p>Tools for employers and students.</p>
            </div>

          </div>

        </div>
      </section>

      {/* STEPS */}
      <section className="about-steps">
        <div className="container">

          <h2>Start your journey in minutes</h2>

          <div className="steps-grid">
            <div className="step">
              <div className="circle">1</div>
              <h4>Create account</h4>
              <p>Sign up using your email.</p>
            </div>

            <div className="step">
              <div className="circle">2</div>
              <h4>Search jobs</h4>
              <p>Find jobs that fit your schedule.</p>
            </div>

            <div className="step">
              <div className="circle">3</div>
              <h4>Apply easily</h4>
              <p>Apply with just one click.</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default AboutUs;