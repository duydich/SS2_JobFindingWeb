import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./studentprofile.css";

function StudentProfile() {
    const [user, setUser] = useState(null);
    const [aiReview, setAiReview] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const fileInputRef = useRef(null);
    const cvInputRef = useRef(null);
    const navigate = useNavigate();
    
    // Check if we are viewing someone else's profile
    const profileId = searchParams.get("id");
    const currentUserId = localStorage.getItem("userId");
    const isOwnProfile = !profileId || profileId === currentUserId;
    const targetId = profileId || currentUserId;

    // LOAD USER TỪ BACKEND
    useEffect(() => {
        const fetchUser = async () => {
            if (!targetId) {
                console.log("No targetId found");
                return;
            }

            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/${targetId}`,
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
    }, [targetId]);

    // HANDLE INPUT CHANGE
    const handleChange = (field, value) => {
        if (!isOwnProfile) return;
        setUser((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    // HANDLE AVATAR CHANGE
    const handleFileChange = (e) => {
        if (!isOwnProfile) return;
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleChange("avatar", reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // HANDLE CV CHANGE
    const handleCVChange = (e) => {
        if (!isOwnProfile) return;
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleChange("cv", {
                    name: file.name,
                    data: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    // VIEW CV IN NEW TAB
    const handleViewCV = () => {
        if (!user.cv || !user.cv.data) return;
        
        try {
            // Extract base64 content
            const base64Data = user.cv.data.split(",")[1];
            const contentType = user.cv.data.split(",")[0].split(":")[1].split(";")[0];
            
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: contentType });
            
            const fileURL = URL.createObjectURL(blob);
            window.open(fileURL, "_blank");
        } catch (err) {
            console.error("Error viewing CV:", err);
            // Fallback for simple data URI
            const newWindow = window.open();
            newWindow.document.write(`<iframe src="${user.cv.data}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
        }
    };

    // REMOVE CV
    const handleRemoveCV = () => {
        if (!isOwnProfile) return;
        if (window.confirm("Are you sure you want to remove your CV?")) {
            setUser((prev) => ({
                ...prev,
                cv: { name: "", data: "" }
            }));
        }
    };

    // AI CV REVIEW
    const handleAIReview = async () => {
        if (!user.cv || !user.cv.data) {
            alert("Please upload a CV first!");
            return;
        }

        setAiLoading(true);
        setAiReview("");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cv-review`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cvData: user.cv.data })
            });

            const data = await res.json();
            if (data.success) {
                setAiReview(data.data);
            } else {
                alert("AI Review failed: " + data.message);
            }
        } catch (err) {
            console.error("AI Review Error:", err);
            alert("Server error during AI Review");
        } finally {
            setAiLoading(false);
        }
    };

    // SAVE PROFILE
    const handleSave = async () => {
        if (!isOwnProfile) return;
        
        // Clone user object and remove system fields
        const { _id, __v, createdAt, ...updateData } = user;
        console.log("Data being sent to backend:", updateData);

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/update/${currentUserId}`,
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
                setUser(data.data); // update lại data mới nhất
            } else {
                alert("Save failed");
            }
        } catch (err) {
            console.error("Save error:", err);
        }
    };

    // LOADING
    if (!user) return <div style={{ padding: 20 }}>Loading...</div>;

    return (
        <div className="profile-container">

            {/* HEADER */}
            <div className="profile-header">
                <div className="header-left">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                    </button>
                    <h2>{isOwnProfile ? "Edit Profile" : `${user.name}'s Profile`}</h2>
                </div>
            </div>

            <div className="profile-grid">

                {/* LEFT */}
                <div className="left">

                    {/* AVATAR */}
                    <div className="card">
                        <h4>Profile Identity</h4>

                        <div 
                            className="avatar-box" 
                            onClick={() => isOwnProfile && fileInputRef.current.click()}
                            style={{ cursor: isOwnProfile ? "pointer" : "default" }}
                        >
                            <img
                                src={user.avatar || "https://i.pravatar.cc/150"}
                                alt="Avatar"
                            />
                            {isOwnProfile && <div className="avatar-overlay">Change</div>}
                        </div>
                        {isOwnProfile && (
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                style={{ display: "none" }} 
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        )}

                        {isOwnProfile && (
                            <p className="hint">
                                Recommended: Square JPG or PNG, 400x400px.
                            </p>
                        )}
                    </div>

                    {/* CONTACT */}
                    <div className="card">
                        <h4>Contact Information</h4>

                        <label>Phone</label>
                        <input
                            value={user.phone || ""}
                            readOnly={!isOwnProfile}
                            onChange={(e) => handleChange("phone", e.target.value)}
                        />

                        <label>Email</label>
                        <input
                            value={user.email || ""}
                            readOnly={!isOwnProfile}
                            onChange={(e) => handleChange("email", e.target.value)}
                        />

                        <label>Location</label>
                        <input
                            value={user.location || ""}
                            readOnly={!isOwnProfile}
                            onChange={(e) => handleChange("location", e.target.value)}
                        />
                    </div>

                    {/* CV UPLOAD */}
                    <div className="card">
                        <h4>Curriculum Vitae</h4>
                        <div className="cv-box">
                            {user.cv && user.cv.name ? (
                                <div className="cv-info">
                                    <span className="cv-name" onClick={handleViewCV} style={{ cursor: "pointer", color: "#2563eb", textDecoration: "underline" }}>
                                        {user.cv.name}
                                    </span>
                                    <div className="cv-actions">
                                        <button className="view-cv-btn" onClick={handleViewCV}>
                                            View CV
                                        </button>
                                        {!isOwnProfile && (
                                            <a 
                                                href={user.cv.data} 
                                                download={user.cv.name}
                                                className="download-cv-btn"
                                            >
                                                Download
                                            </a>
                                        )}
                                        {isOwnProfile && (
                                            <>
                                                <button className="ai-review-btn" onClick={handleAIReview}>
                                                    ✨ AI Review
                                                </button>
                                                <button className="change-cv-btn" onClick={() => cvInputRef.current.click()}>
                                                    Change
                                                </button>
                                                <button className="remove-cv-btn" onClick={handleRemoveCV}>
                                                    Remove
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="cv-empty">
                                    <p>No CV uploaded yet</p>
                                    {isOwnProfile && (
                                        <button className="upload-cv-btn" onClick={() => cvInputRef.current.click()}>
                                            Upload CV
                                        </button>
                                    )}
                                </div>
                            )}
                            <input
                                type="file"
                                ref={cvInputRef}
                                style={{ display: "none" }}
                                accept=".pdf,.doc,.docx"
                                onChange={handleCVChange}
                            />
                        </div>
                        <p className="hint">Accepted: PDF, DOC, DOCX (Max 10MB)</p>
                    </div>

                </div>

                {/* RIGHT */}
                <div className="right">

                    {/* BIO */}
                    <div className="card">
                        <h4>Student Bio</h4>

                        <label>Full Name</label>
                        <input
                            value={user.name || ""}
                            readOnly={!isOwnProfile}
                            onChange={(e) =>
                                handleChange("name", e.target.value)
                            }
                        />

                        <label>Bio</label>
                        <textarea
                            value={user.bio || ""}
                            readOnly={!isOwnProfile}
                            onChange={(e) =>
                                handleChange("bio", e.target.value)
                            }
                        />
                    </div>

                    {/* AI REVIEW RESULT */}
                    {aiReview && (
                        <div className="card ai-result-card">
                            <h4>✨ Gemini AI Feedback</h4>
                            <div className="ai-content">
                                {aiReview.split("\n").map((line, index) => {
                                    if (line.startsWith("###")) return <h5 key={index}>{line.replace("###", "")}</h5>;
                                    if (line.startsWith("**")) return <p key={index}><strong>{line.replace(/\*\*/g, "")}</strong></p>;
                                    return <p key={index}>{line}</p>;
                                })}
                            </div>
                            <button className="close-ai-btn" onClick={() => setAiReview("")}>Close Feedback</button>
                        </div>
                    )}

                    {/* EXTRA */}
                    <div className="card">
                        <h4>Extra Info</h4>

                        <label>School / Company</label>
                        <input
                            value={user.company || ""}
                            readOnly={!isOwnProfile}
                            onChange={(e) =>
                                handleChange("company", e.target.value)
                            }
                        />

                        <label>Website</label>
                        <input
                            value={user.website || ""}
                            readOnly={!isOwnProfile}
                            onChange={(e) =>
                                handleChange("website", e.target.value)
                            }
                        />
                    </div>

                </div>
            </div>

            {/* AI LOADING OVERLAY */}
            {aiLoading && (
                <div className="ai-overlay">
                    <div className="ai-loader">
                        <div className="spinner"></div>
                        <p>Gemini AI is analyzing your CV...</p>
                    </div>
                </div>
            )}

            {/* FOOTER */}
            {isOwnProfile && (
                <div className="profile-footer">
                    <button className="discard" onClick={() => window.location.reload()}>Discard Changes</button>
                    <button className="save-btn" onClick={handleSave}>
                        Save Changes
                    </button>
                </div>
            )}

        </div>
    );
};

export default StudentProfile;