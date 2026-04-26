import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";
import "./savedjobs.css";

function SavedJobs() {
    const [jobs, setJobs] = useState([]);
    const [unsavedIds, setUnsavedIds] = useState([]); 
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!userId) {
            navigate("/login");
            return;
        }
        fetchSavedJobs();
    }, [userId, navigate]);

    const fetchSavedJobs = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/saved-jobs/${userId}`);
            const data = await res.json();
            if (data.success) {
                setJobs(data.data);
            }
        } catch (err) {
            console.error("Fetch saved jobs error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleSave = async (jobId) => {
        try {
            const res = await fetch("http://localhost:5000/api/saved-jobs/toggle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, jobId })
            });
            const data = await res.json();
            
            if (data.success) {
                if (data.isSaved) {
                    setUnsavedIds(prev => prev.filter(id => id !== jobId));
                } else {
                    setUnsavedIds(prev => [...prev, jobId]);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const isJobUnsaved = (id) => unsavedIds.includes(id);

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="saved-jobs-page">
            <div className="content">
                
                <div className="page-header">
                    <button className="back-btn-small" onClick={() => navigate("/explore")}>
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="page-title">Saved Jobs</h1>
                </div>

                {jobs.length === 0 ? (
                    <div className="empty-state">
                        <Heart size={48} color="#cbd5e1" />
                        <p>You haven't saved any jobs yet.</p>
                        <button className="browse-btn" onClick={() => navigate("/explore")}>Browse Jobs</button>
                    </div>
                ) : (
                    <div className="job-grid"> {/* Dùng chung class job-grid từ explore */}
                        {jobs.map((job) => (
                            <div className="job-card" key={job._id}>
                                <img src={job.img || "https://picsum.photos/300/200"} alt="" />
                                <div className="job-body">
                                    <div className="job-top">
                                        <h4>{job.title}</h4>
                                        <div className="heart-icon-box" onClick={() => handleToggleSave(job._id)}>
                                            <Heart 
                                                size={20} 
                                                fill={isJobUnsaved(job._id) ? "none" : "#4f46e5"} 
                                                color={isJobUnsaved(job._id) ? "#94a3b8" : "#4f46e5"}
                                                style={{cursor: "pointer", transition: "0.2s"}}
                                            />
                                        </div>
                                    </div>
                                    <p>{job.company}</p>
                                    <div className="job-info">
                                        <span>{job.address}</span>
                                        <span className="salary">{job.salary}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SavedJobs;