import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, Clock, CheckCircle, Trash2, Users, User, ExternalLink, Calendar, MapPin, DollarSign, GraduationCap, Tag } from "lucide-react";
import JobCard from "../../components/JobCard";
import "./recruitmenthistory.css";

function RecruitmentHistory() {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("jobs"); // "jobs" or "applications"
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [fetchingProfile, setFetchingProfile] = useState(false);

    useEffect(() => {
        if (!userId) {
            navigate("/login");
            return;
        }
        fetchAllData();
    }, [userId]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchRecruiterJobs(),
                fetchRecruiterApplications()
            ]);
        } catch (err) {
            console.error("Fetch history error:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecruiterJobs = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/jobs?recruiterId=${userId}&status=all`);
            const data = await res.json();
            if (data.success) {
                setJobs(data.data);
            }
        } catch (err) { console.error(err); }
    };

    const fetchRecruiterApplications = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/applications/recruiter/${userId}`);
            const data = await res.json();
            if (data.success) {
                setApplications(data.data);
            }
        } catch (err) { console.error(err); }
    };

    const handleUpdateAppStatus = async (appId, newStatus) => {
        try {
            const res = await fetch(`http://localhost:5000/api/applications/${appId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                alert(`Application ${newStatus}!`);
                fetchRecruiterApplications();
            }
        } catch (err) { console.error(err); }
    };

    const openProfileModal = async (studentId) => {
        setFetchingProfile(true);
        try {
            const res = await fetch(`http://localhost:5000/api/profile/${studentId}`);
            const data = await res.json();
            if (data.success) {
                setSelectedStudent(data.data);
            }
        } catch (err) {
            console.error("Fetch profile error:", err);
        } finally {
            setFetchingProfile(false);
        }
    };

    const filterJobs = (status) => jobs.filter(j => (j.status || "pending") === status);
    const filterApps = (status) => applications.filter(app => app.status === status);

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="history-page">
            <div className="history-header">
                <button className="back-btn" onClick={() => navigate("/recruiter")}>
                    <ArrowLeft size={24} />
                    <span>Back</span>
                </button>
                <h1>Recruitment Management</h1>
            </div>

            <div className="tabs">
                <button 
                    className={`tab-btn ${activeTab === "jobs" ? "active" : ""}`} 
                    onClick={() => setActiveTab("jobs")}
                >
                    <Briefcase size={18} /> My Job Postings
                </button>
                <button 
                    className={`tab-btn ${activeTab === "applications" ? "active" : ""}`} 
                    onClick={() => setActiveTab("applications")}
                >
                    <Users size={18} /> Candidate Applications
                </button>
            </div>

            <div className="history-content">
                {activeTab === "jobs" ? (
                    <>
                        <section className="history-section">
                            <div className="section-title">
                                <Clock size={20} className="icon-pending" />
                                <h2>Pending Jobs</h2>
                            </div>
                            <div className="job-grid">
                                {filterJobs("pending").map(job => (
                                    <JobCard key={job._id} job={job} onClick={() => navigate(`/job-preview/${job._id}`)} status={job.status} />
                                ))}
                                {filterJobs("pending").length === 0 && <p className="empty-msg">No pending jobs.</p>}
                            </div>
                        </section>

                        <section className="history-section">
                            <div className="section-title">
                                <CheckCircle size={20} className="icon-closed" />
                                <h2>Closed Jobs</h2>
                            </div>
                            <div className="job-grid">
                                {filterJobs("closed").map(job => (
                                    <JobCard key={job._id} job={job} onClick={() => navigate(`/job-preview/${job._id}`)} status={job.status} />
                                ))}
                                {filterJobs("closed").length === 0 && <p className="empty-msg">No closed jobs.</p>}
                            </div>
                        </section>

                        <section className="history-section">
                            <div className="section-title">
                                <Trash2 size={20} className="icon-deleted" />
                                <h2>Deleted Jobs</h2>
                            </div>
                            <div className="job-grid">
                                {filterJobs("deleted").map(job => (
                                    <JobCard key={job._id} job={job} onClick={() => navigate(`/job-preview/${job._id}`)} status={job.status} />
                                ))}
                                {filterJobs("deleted").length === 0 && <p className="empty-msg">No deleted jobs.</p>}
                            </div>
                        </section>
                    </>
                ) : (
                    <>
                        <section className="history-section">
                            <div className="section-title">
                                <Clock size={20} className="icon-pending" />
                                <h2>Pending Applications</h2>
                            </div>
                            <div className="applications-list">
                                {filterApps("pending").map(app => (
                                    <div key={app._id} className="job-item app-card-item">
                                        <div className="job-banner">
                                            <img src={app.job?.img || "https://picsum.photos/200/150"} alt="Job Banner" />
                                        </div>
                                        <div className="job-info">
                                            <div className="title-area">
                                                <h3 className="job-title">{app.job?.title}</h3>
                                                <span className="applied-tag pending">Pending Application</span>
                                            </div>
                                            <div className="job-details">
                                                <p className="candidate-primary"><User size={14} /> <strong>{app.student?.name}</strong> • {app.student?.email}</p>
                                                <p><GraduationCap size={14} /> {app.student?.company || "No school info"} • <Calendar size={14} /> Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="job-tags">
                                                <span className="tag-industry">{app.job?.industry}</span>
                                                <span className="tag-type status-pending">PENDING</span>
                                            </div>
                                        </div>
                                        <div className="job-actions">
                                            <button className="btn-view" title="View Profile" onClick={() => openProfileModal(app.student?._id)}>
                                                <ExternalLink size={18}/>
                                            </button>
                                            <button className="btn-accept" title="Accept" onClick={() => handleUpdateAppStatus(app._id, "accepted")}>
                                                <CheckCircle size={18}/>
                                            </button>
                                            <button className="btn-reject" title="Reject" onClick={() => handleUpdateAppStatus(app._id, "rejected")}>
                                                <Trash2 size={18}/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {filterApps("pending").length === 0 && <p className="empty-msg">No pending applications.</p>}
                            </div>
                        </section>

                        <section className="history-section">
                            <div className="section-title">
                                <CheckCircle size={20} className="icon-accepted" />
                                <h2>Processed Applications</h2>
                            </div>
                            <div className="applications-list">
                                {applications.filter(a => a.status !== "pending").map(app => (
                                    <div key={app._id} className={`job-item app-card-item status-${app.status}`}>
                                        <div className="job-banner">
                                            <img src={app.job?.img || "https://picsum.photos/200/150"} alt="Job Banner" />
                                        </div>
                                        <div className="job-info">
                                            <div className="title-area">
                                                <h3 className="job-title">{app.job?.title}</h3>
                                                <span className={`applied-tag ${app.status}`}>{app.status.toUpperCase()}</span>
                                            </div>
                                            <div className="job-details">
                                                <p className="candidate-primary"><User size={14} /> <strong>{app.student?.name}</strong> • {app.student?.email}</p>
                                                <p><Calendar size={14} /> Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="job-tags">
                                                <span className="tag-industry">{app.job?.industry}</span>
                                                <span className={`tag-type status-${app.status}`}>{app.status.toUpperCase()}</span>
                                            </div>
                                        </div>
                                        <div className="job-actions">
                                            <button className="btn-view" title="View Profile" onClick={() => openProfileModal(app.student?._id)}>
                                                <ExternalLink size={18}/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {applications.filter(a => a.status !== "pending").length === 0 && <p className="empty-msg">No processed applications.</p>}
                            </div>
                        </section>
                    </>
                )}
            </div>

            {/* PROFILE MODAL */}
            {selectedStudent && (
                <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Candidate Profile</h3>
                            <button className="close-modal" onClick={() => setSelectedStudent(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="profile-top">
                                <img src={selectedStudent.avatar || "https://i.pravatar.cc/150"} alt="Avatar" className="modal-avatar" />
                                <div className="profile-main-info">
                                    <h2>{selectedStudent.name}</h2>
                                    <p className="role-tag">Student Candidate</p>
                                </div>
                            </div>
                            
                            <div className="profile-details-grid">
                                <div className="detail-item">
                                    <label>Email</label>
                                    <p>{selectedStudent.email}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Phone</label>
                                    <p>{selectedStudent.phone || "Not provided"}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Location</label>
                                    <p>{selectedStudent.location || "Not provided"}</p>
                                </div>
                                <div className="detail-item">
                                    <label>School/Company</label>
                                    <p>{selectedStudent.company || "Not provided"}</p>
                                </div>
                            </div>

                            <div className="profile-bio">
                                <label>Bio</label>
                                <p>{selectedStudent.bio || "No bio available."}</p>
                            </div>

                            {selectedStudent.website && (
                                <div className="profile-website">
                                    <label>Website</label>
                                    <a href={selectedStudent.website} target="_blank" rel="noopener noreferrer">{selectedStudent.website}</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {fetchingProfile && (
                <div className="modal-overlay">
                    <div className="loading-spinner">Loading Profile...</div>
                </div>
            )}
        </div>
    );
}

export default RecruitmentHistory;