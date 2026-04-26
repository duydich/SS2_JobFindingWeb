import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./studentprofile.css";

function StudentProfile() {
    const [user, setUser] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    // LOAD USER TỪ BACKEND
    useEffect(() => {
        const fetchUser = async () => {
            const userId = localStorage.getItem("userId");

            if (!userId) {
                console.log("No userId found");
                return;
            }

            try {
                const res = await fetch(`http://localhost:5000/api/profile/${userId}`,
                    {
                        method: "GET", // Khai báo rõ ràng đây là hành động Lấy dữ liệu về
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
    }, []);

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

    // SAVE PROFILE
    const handleSave = async () => {
        const userId = localStorage.getItem("userId");

        // Clone user object and remove system fields
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
                    <button className="back-btn" onClick={() => navigate("/explore")}>
                        <ArrowLeft size={20} />
                    </button>
                    <h2>Edit Profile</h2>
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
                            onClick={() => fileInputRef.current.click()}
                            style={{ cursor: "pointer" }}
                        >
                            <img
                                src={user.avatar || "https://i.pravatar.cc/150"}
                                alt="Avatar"
                            />
                            <div className="avatar-overlay">Change</div>
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            style={{ display: "none" }} 
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                        <p className="hint">
                            Recommended: Square JPG or PNG, 400x400px.
                        </p>
                    </div>

                    {/* CONTACT */}
                    <div className="card">
                        <h4>Contact Information</h4>

                        <label>Phone</label>
                        <input
                            value={user.phone || ""}
                            onChange={(e) => handleChange("phone", e.target.value)}
                        />

                        <label>Email</label>
                        <input
                            value={user.email || ""}
                            onChange={(e) => handleChange("email", e.target.value)}
                        />

                        <label>Location</label>
                        <input
                            value={user.location || ""}
                            onChange={(e) => handleChange("location", e.target.value)}
                        />
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
                            onChange={(e) =>
                                handleChange("name", e.target.value)
                            }
                        />

                        <label>Bio</label>
                        <textarea
                            value={user.bio || ""}
                            onChange={(e) =>
                                handleChange("bio", e.target.value)
                            }
                        />
                    </div>

                    {/* EXTRA */}
                    <div className="card">
                        <h4>Extra Info</h4>

                        <label>School / Company</label>
                        <input
                            value={user.company || ""}
                            onChange={(e) =>
                                handleChange("company", e.target.value)
                            }
                        />

                        <label>Website</label>
                        <input
                            value={user.website || ""}
                            onChange={(e) =>
                                handleChange("website", e.target.value)
                            }
                        />
                    </div>

                </div>
            </div>

            {/* FOOTER */}
            <div className="profile-footer">
                <button className="discard" onClick={() => window.location.reload()}>Discard Changes</button>
                <button className="save-btn" onClick={handleSave}>
                    Save Changes
                </button>
            </div>

        </div>
    );
};

export default StudentProfile;