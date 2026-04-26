import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Briefcase, Mail, Phone, Calendar, DollarSign, Building, Heart } from "lucide-react";
import "./jobpreview.css";

function JobPreview() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const currentUserId = localStorage.getItem("userId");

    useEffect(() => {
        fetchJobDetails();
        if (currentUserId) {
            checkIfSaved();
        }
    }, [id, currentUserId]);

    const fetchJobDetails = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/jobs/${id}`);
            const data = await res.json();
            if (data.success) {
                setJob(data.data);
            } else {
                alert("Job not found");
                navigate("/explore");
            }
        } catch (err) {
            console.error("Fetch job error:", err);
        } finally {
            setLoading(false);
        }
    };

    const checkIfSaved = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/saved-jobs/${currentUserId}`);
            const data = await res.json();
            if (data.success) {
                const savedIds = data.data.map(j => j._id);
                setIsSaved(savedIds.includes(id));
            }
        } catch (err) {
            console.error("Check saved error:", err);
        }
    };

    const handleToggleSave = async () => {
        if (!currentUserId) {
            alert("Please login to save jobs!");
            navigate("/login");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/saved-jobs/toggle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: currentUserId, jobId: id })
            });
            const data = await res.json();
            if (data.success) {
                setIsSaved(data.isSaved);
            }
        } catch (err) {
            console.error("Toggle save error:", err);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!job) return <div className="not-found">Job not found</div>;

    return (
        <div className="job-preview-page">
            <div className="preview-wrapper">
                {/* Nút Back nằm tách biệt hoàn toàn bên ngoài container */}
                <button className="back-btn-side" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                    <span>Back</span>
                </button>

                <div className="preview-container">
                    <header className="preview-header">
                        <div className="header-actions">
                            <button className={`save-btn ${isSaved ? 'saved' : ''}`} onClick={handleToggleSave}>
                                <Heart size={20} fill={isSaved ? "#4f46e5" : "none"} color={isSaved ? "#4f46e5" : "currentColor"} />
                                {isSaved ? "Saved" : "Save Job"}
                            </button>
                        </div>
                    </header>

                    <main className="preview-content">
                        <section className="job-hero">
                            <img src={job.img || "https://picsum.photos/800/400"} alt={job.title} className="job-banner" />
                            <div className="job-title-section">
                                <div className="job-main-info">
                                    <h1>{job.title}</h1>
                                    <div className="company-info">
                                        <Building size={18} />
                                        <span>{job.company}</span>
                                    </div>
                                </div>
                                <div className="job-meta">
                                    <div className="meta-item">
                                        <MapPin size={18} />
                                        <span>{job.address}</span>
                                    </div>
                                    <div className="meta-item">
                                        <Briefcase size={18} />
                                        <span>{job.jobType}</span>
                                    </div>
                                    <div className="meta-item">
                                        <DollarSign size={18} />
                                        <span className="salary">{job.salary}</span>
                                    </div>
                                    <div className="meta-item">
                                        <Calendar size={18} />
                                        <span>Posted on {new Date(job.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="preview-grid">
                            <div className="main-col">
                                <section className="description-section">
                                    <h3>Description</h3>
                                    <p>{job.description}</p>
                                </section>

                                <section className="requirements-section">
                                    <h3>Requirements</h3>
                                    <p>{job.requirements || "No specific requirements listed."}</p>
                                </section>
                            </div>

                            <div className="side-col">
                                <section className="contact-section">
                                    <h3>Contact Information</h3>
                                    {job.contactEmail && (
                                        <div className="contact-item">
                                            <Mail size={18} />
                                            <span>{job.contactEmail}</span>
                                        </div>
                                    )}
                                    {job.contactPhones && job.contactPhones.length > 0 && (
                                        <div className="contact-item">
                                            <Phone size={18} />
                                            <span>{job.contactPhones.join(", ")}</span>
                                        </div>
                                    )}
                                    {!job.contactEmail && (!job.contactPhones || job.contactPhones.length === 0) && (
                                        <p>No contact information provided.</p>
                                    )}
                                </section>

                                <section className="recruiter-section">
                                    <h3>Posted by</h3>
                                    <div className="recruiter-info">
                                        <p><strong>Name:</strong> {job.recruiter?.name || "Unknown"}</p>
                                        <p><strong>Email:</strong> {job.recruiter?.email || "Not provided"}</p>
                                    </div>
                                </section>

                                <button className="apply-btn" onClick={() => alert("Apply feature coming soon!")}>
                                    Apply for this job
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default JobPreview;