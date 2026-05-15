import React from "react";
import { Heart, MapPin, Briefcase } from "lucide-react";
import "./jobcard.css";

const JobCard = ({ job, onClick, onToggleSave, isSaved, status }) => {
    return (
        <div className="job-card" onClick={onClick}>
            {job.img && <img src={job.img} alt={job.title} />}
            <div className="job-body">
                <div className="job-top">
                    <h4>{job.title}</h4>
                    {onToggleSave && (
                        <div className="heart-icon-box" onClick={(e) => { e.stopPropagation(); onToggleSave(job._id); }}>
                            <Heart 
                                size={20} 
                                fill={isSaved ? "#4f46e5" : "none"} 
                                color={isSaved ? "#4f46e5" : "#94a3b8"}
                                style={{cursor: "pointer", transition: "0.2s"}}
                            />
                        </div>
                    )}
                </div>
                <p>{job.company}</p>
                <div className="job-tags">
                    <span className="tag-industry">{job.industry}</span>
                    <span className="tag-type">{job.jobType}</span>
                </div>
                <div className="job-info">
                    <span><MapPin size={14} /> {job.address}</span>
                    <span className="salary">{job.salary}</span>
                </div>
                {status && (
                    <div className={`job-status status-${status.toLowerCase()}`}>
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobCard;