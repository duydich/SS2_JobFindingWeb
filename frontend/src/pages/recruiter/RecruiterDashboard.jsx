import { useState, useEffect } from "react";
import { Plus, Trash, Edit, Briefcase, LogOut, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./recruiterdashboard.css";

function RecruiterDashboard() {
    const [jobs, setJobs] = useState([]);
    const [user, setUser] = useState(null);

    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        fetchJobs();
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        if (!userId) return;
        try {
            const res = await fetch(`http://localhost:5000/api/profile/${userId}`);
            const data = await res.json();
            if (data.success) setUser(data.data);
        } catch (err) {
            console.error("Fetch profile error:", err);
        }
    };

    const fetchJobs = async () => {
        const res = await fetch("http://localhost:5000/api/jobs");
        const data = await res.json();
        if (data.success) {
            const myJobs = data.data.filter(j => j.recruiter === userId || j.recruiter?._id === userId);
            setJobs(myJobs);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this job?")) {
            const res = await fetch(`http://localhost:5000/api/jobs/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) fetchJobs();
        }
    };

    return (
        <div className="recruiter-dashboard">
            <nav className="nav">
                <div className="nav-left">
                    <h2 className="logo">JobFinder <span>Recruiter</span></h2>
                </div>
                <div className="nav-right">
                    <div
                        className="nav-item avatar"
                        onClick={() => navigate("/recruiterprofile")}
                    >
                        <img src={user?.avatar || "https://i.pravatar.cc/40?img=3"} alt="Profile" />
                    </div>

                    <div className="nav-item" onClick={() => {
                        localStorage.removeItem("userId");
                        navigate("/login");
                    }}>
                        <LogOut size={18} />
                    </div>
                </div>
            </nav>

            <div className="content">
                <h1>Manage Your Job Postings</h1>
                
                <div className="dashboard-card">
                    <div className="card-header">
                        <p>Total Postings: {jobs.length}</p>
                        <button className="add-btn" onClick={() => navigate("/post-job")}>
                            <Plus size={18} /> Post a Job
                        </button>
                    </div>

                    <div className="job-list">
                        {jobs.map(job => (
                            <div key={job._id} className="job-item">
                                {job.img && (
                                    <div className="job-banner">
                                        <img src={job.img} alt="Banner" />
                                    </div>
                                )}
                                <div className="job-info">
                                    <h3 className="job-title">{job.title}</h3>
                                    <div className="job-details">
                                        <p><Briefcase size={14} /> {job.company} • {job.salary}</p>
                                        <p><MapPin size={14} /> {job.address}</p>
                                    </div>
                                    <div className="job-tags">
                                        <span className="tag-industry">{job.industry}</span>
                                        <span className="tag-type">{job.jobType}</span>
                                    </div>
                                </div>
                                <div className="job-actions">
                                    <button className="btn-edit" title="Edit" onClick={() => navigate(`/edit-job/${job._id}`)}>
                                        <Edit size={18}/>
                                    </button>
                                    <button className="btn-delete" title="Delete" onClick={() => handleDelete(job._id)}>
                                        <Trash size={18}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                        {jobs.length === 0 && (
                            <div className="empty-state">
                                <Briefcase size={40} />
                                <p>No job postings yet. Start by adding one!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecruiterDashboard;