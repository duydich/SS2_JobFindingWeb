import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import JobCard from "../../components/JobCard";
import "./employmenthistory.css";

function EmploymentHistory() {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            navigate("/login");
            return;
        }
        fetchStudentApplications();
    }, [userId]);

    const fetchStudentApplications = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/applications/student/${userId}`);
            const data = await res.json();
            if (data.success) {
                setApplications(data.data);
            }
        } catch (err) {
            console.error("Fetch application history error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async (appId) => {
        if (!window.confirm("Are you sure you want to withdraw this application?")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/applications/${appId}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) {
                alert("Application withdrawn successfully");
                fetchStudentApplications();
            } else {
                alert(data.message || "Failed to withdraw application");
            }
        } catch (err) {
            console.error("Withdraw error:", err);
            alert("An error occurred. Please try again.");
        }
    };

    const filterApps = (status) => applications.filter(app => app.status === status);

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="history-page">
            <div className="history-header">
                <button className="back-btn" onClick={() => navigate("/explore")}>
                    <ArrowLeft size={24} />
                    <span>Back</span>
                </button>
                <h1>Employment History</h1>
            </div>

            <div className="history-content">
                <section className="history-section">
                    <div className="section-title">
                        <Clock size={20} className="icon-pending" />
                        <h2>Pending Applications</h2>
                    </div>
                    <div className="job-grid">
                        {filterApps("pending").map(app => (
                            <JobCard 
                                key={app._id} 
                                job={app.job} 
                                onClick={() => navigate(`/job-preview/${app.job?._id}`)} 
                                status={app.job?.status === "deleted" ? "deleted" : app.status} 
                                extraAction={
                                    <button 
                                        className="withdraw-btn" 
                                        onClick={() => handleWithdraw(app._id)}
                                    >
                                        Withdraw Application
                                    </button>
                                }
                            />
                        ))}
                        {filterApps("pending").length === 0 && <p className="empty-msg">No pending applications.</p>}
                    </div>
                </section>

                <section className="history-section">
                    <div className="section-title">
                        <CheckCircle size={20} className="icon-accepted" />
                        <h2>Accepted Applications</h2>
                    </div>
                    <div className="job-grid">
                        {filterApps("accepted").map(app => (
                            <JobCard 
                                key={app._id} 
                                job={app.job} 
                                onClick={() => navigate(`/job-preview/${app.job?._id}`)} 
                                status={app.job?.status === "deleted" ? "deleted" : app.status} 
                                extraAction={
                                    <button 
                                        className="withdraw-btn" 
                                        onClick={() => handleWithdraw(app._id)}
                                    >
                                        Remove Record
                                    </button>
                                }
                            />
                        ))}
                        {filterApps("accepted").length === 0 && <p className="empty-msg">No accepted applications.</p>}
                    </div>
                </section>

                <section className="history-section">
                    <div className="section-title">
                        <XCircle size={20} className="icon-rejected" />
                        <h2>Rejected Applications</h2>
                    </div>
                    <div className="job-grid">
                        {filterApps("rejected").map(app => (
                            <JobCard 
                                key={app._id} 
                                job={app.job} 
                                onClick={() => navigate(`/job-preview/${app.job?._id}`)} 
                                status={app.job?.status === "deleted" ? "deleted" : app.status} 
                                extraAction={
                                    <button 
                                        className="withdraw-btn" 
                                        onClick={() => handleWithdraw(app._id)}
                                    >
                                        Remove Record
                                    </button>
                                }
                            />
                        ))}
                        {filterApps("rejected").length === 0 && <p className="empty-msg">No rejected applications.</p>}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default EmploymentHistory;