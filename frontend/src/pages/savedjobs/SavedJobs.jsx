import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";
import "./savedjobs.css";
import JobCard from "../../components/JobCard";

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
                    <div className="job-grid">
                        {jobs.map((job) => (
                            <JobCard 
                                key={job._id}
                                job={job}
                                onClick={() => navigate(`/job-preview/${job._id}`)}
                                onToggleSave={handleToggleSave}
                                isSaved={!isJobUnsaved(job._id)}
                                status={job.status !== "pending" ? job.status : null}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SavedJobs;