import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./recruiterprofile.css";

function RecruiterProfile() {
    const [user, setUser] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    // LOAD USER TỪ BACKEND
    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) {
                navigate("/login");
                return;
            }

            // Check for DRAFT scoped to this specific user
            const draftKey = `recruiter_profile_draft_${userId}`;
            const draft = localStorage.getItem(draftKey);
            
            if (draft) {
                try {
                    const parsedDraft = JSON.parse(draft);
                    // Double check if the draft actually belongs to this user (extra safety)
                    if (parsedDraft._id === userId) {
                        setUser(parsedDraft);
                        return;
                    } else {
                        localStorage.removeItem(draftKey); // Clear invalid draft
                    }
                } catch (e) {
                    console.error("Draft parse error", e);
                }
            }

            try {
                const res = await fetch(`http://localhost:5000/api/profile/${userId}`,
                    {
                        method: "GET",
                        headers: {"Content-Type": "application/json"}
                    }
                );

                const data = await res.json();

                if (data.success) {
                    setUser(data.data);
                } else {
                    console.log("Fetch user failed");
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };

        fetchUser();
    }, [navigate, userId]);

    // HANDLE INPUT CHANGE
    const handleChange = (field, value) => {
        setUser((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    // HANDLE AVATAR CHANGE
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleChange("avatar", reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // ACTION: BACK (TOP LEFT) - No saving, just confirm exit
    const handleExit = () => {
        if (window.confirm("You have unsaved changes. Are you sure you want to exit?")) {
            navigate("/recruiter");
        }
    };

    // ACTION: DISCARD (BOTTOM) - Keep draft + confirm exit
    const handleDiscard = () => {
        if (window.confirm("Changes not saved. We will keep a draft for your next visit. Exit?")) {
            localStorage.setItem(`recruiter_profile_draft_${userId}`, JSON.stringify(user));
            navigate("/recruiter");
        }
    };

    // ACTION: SAVE (BOTTOM) - Save to DB + clear draft
    const handleSave = async () => {
        const { _id, __v, createdAt, ...updateData } = user;

        try {
            const res = await fetch(
                `http://localhost:5000/api/update/${userId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updateData)
                }
            );

            const data = await res.json();

            if (data.success) {
                alert("Saved successfully!");
                localStorage.removeItem(`recruiter_profile_draft_${userId}`); 
                navigate("/recruiter");
            } else {
                alert("Save failed: " + (data.error || "Server error"));
            }
        } catch (err) {
            console.error("Save error:", err);
        }
    };

    // LOADING
    if (!user) return <div style={{ padding: 20 }}>Loading...</div>;

    return (
        <div className="profile-container recruiter-profile">
            <div className="profile-header">
                <div className="header-left">
                    <button className="back-btn" onClick={handleExit}>
                        <ArrowLeft size={20} />
                    </button>
                    <h2>Recruiter Profile</h2>
                </div>
            </div>

            <div className="profile-grid">
                <div className="left">
                    <div className="card">
                        <h4>Company Logo / Avatar</h4>
                        <div className="avatar-box" onClick={() => fileInputRef.current.click()} style={{ cursor: "pointer" }}>
                            <img src={user.avatar || "https://i.pravatar.cc/150?img=3"} alt="Avatar" />
                            <div className="avatar-overlay">Change</div>
                        </div>
                        <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={handleFileChange} />
                        <p className="hint">Square image recommended.</p>
                    </div>
                    <div className="card">
                        <h4>Contact Details</h4>
                        <label>Phone</label>
                        <input value={user.phone || ""} onChange={(e) => handleChange("phone", e.target.value)} />
                        <label>Work Email</label>
                        <input value={user.email || ""} onChange={(e) => handleChange("email", e.target.value)} />
                        <label>Office Location</label>
                        <input value={user.location || ""} onChange={(e) => handleChange("location", e.target.value)} />
                    </div>
                </div>

                <div className="right">
                    <div className="card">
                        <h4>Professional Information</h4>
                        <label>Full Name</label>
                        <input value={user.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
                        <label>Job Title</label>
                        <input value={user.title || ""} placeholder="e.g. HR Manager" onChange={(e) => handleChange("title", e.target.value)} />
                        <label>Company Name</label>
                        <input value={user.company || ""} onChange={(e) => handleChange("company", e.target.value)} />
                        <label>Company Website</label>
                        <input value={user.website || ""} placeholder="https://..." onChange={(e) => handleChange("website", e.target.value)} />
                        <label>Company Bio / About</label>
                        <textarea value={user.bio || ""} placeholder="Tell candidates about your company..." onChange={(e) => handleChange("bio", e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="profile-footer">
                <button className="discard" onClick={handleDiscard}>Discard Changes</button>
                <button className="save-btn" onClick={handleSave}>Save Changes</button>
            </div>
        </div>
    );
}

export default RecruiterProfile;