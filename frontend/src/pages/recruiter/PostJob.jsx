import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Briefcase, Mail, Phone, MapPin, DollarSign, Tag, Info, Plus, Trash, Image as ImageIcon } from "lucide-react";
import "./postjob.css";

function PostJob() {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const userId = localStorage.getItem("userId");
    const draftKey = `job_draft_${userId}`;
    
    const [loading, setLoading] = useState(false);
    const [otherIndustry, setOtherIndustry] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        company: "",
        salary: "",
        industry: "",
        jobType: "Part-time",
        address: "",
        contactEmail: "",
        contactPhones: [""],
        description: "",
        requirements: "",
        img: "" 
    });

    const industries = [
        "Information Technology",
        "Food & Beverage",
        "Retail & Sales",
        "Marketing & Communication",
        "Education & Training",
        "Healthcare & Medical",
        "Office & Administration",
        "Construction & Engineering",
        "Logistics & Transport",
        "Other"
    ];

    useEffect(() => {
        if (!userId) navigate("/login");
        
        const fetchData = async () => {
            // 1. Tải Draft nếu là tạo mới
            if (!id) {
                const draft = localStorage.getItem(draftKey);
                if (draft) {
                    try {
                        const parsedDraft = JSON.parse(draft);
                        if (parsedDraft.salary) parsedDraft.salary = parsedDraft.salary.replace(/[^0-9]/g, "");
                        setFormData(prev => ({ ...prev, ...parsedDraft }));
                    } catch (e) { console.error("Draft parse error", e); }
                }
            }

            // 2. Tải Profile (Chỉ lấy các trường contact nếu chúng đang trống)
            try {
                const res = await fetch(`http://localhost:5000/api/profile/${userId}`);
                const data = await res.json();
                if (data.success) {
                    setFormData(prev => ({
                        ...prev,
                        company: prev.company || data.data.company || "",
                        contactEmail: prev.contactEmail || data.data.email || "",
                        contactPhones: (prev.contactPhones && prev.contactPhones[0] !== "") ? prev.contactPhones : [data.data.phone || ""]
                    }));
                }
            } catch (err) { console.error(err); }

            // 3. Tải Dữ liệu Job nếu là Edit
            if (id) {
                try {
                    const res = await fetch(`http://localhost:5000/api/jobs/${id}`);
                    const data = await res.json();
                    if (data.success) {
                        console.log("🔍 DEBUG - Loaded Job Data:", data.data); // LOG DEBUG THEO YÊU CẦU
                        const jobData = data.data;
                        
                        let displaySalary = jobData.salary || "";
                        if (displaySalary) displaySalary = displaySalary.replace(/[^0-9]/g, "");
                        
                        setFormData(prev => ({
                            ...prev,
                            ...jobData,
                            salary: displaySalary,
                            img: jobData.img || "" // Đảm bảo gán img rõ ràng
                        }));

                        if (!industries.includes(jobData.industry)) {
                            setFormData(prev => ({ ...prev, industry: "Other" }));
                            setOtherIndustry(jobData.industry);
                        }
                    }
                } catch (err) { console.error("Fetch job error:", err); }
            }
        };

        fetchData();
    }, [id, userId, navigate, draftKey]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "salary") {
            const numericValue = value.replace(/[^0-9]/g, "");
            setFormData(prev => ({ ...prev, [name]: numericValue }));
            return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Kiểm tra dung lượng (Cảnh báo nếu > 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("Image is too large! Please choose a file under 5MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, img: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePhoneChange = (index, value) => {
        const numericValue = value.replace(/[^0-9]/g, "");
        setFormData(prev => {
            const newPhones = [...prev.contactPhones];
            newPhones[index] = numericValue;
            return { ...prev, contactPhones: newPhones };
        });
    };

    const addPhoneField = () => {
        setFormData(prev => ({ ...prev, contactPhones: [...prev.contactPhones, ""] }));
    };

    const removePhoneField = (index) => {
        setFormData(prev => ({
            ...prev,
            contactPhones: prev.contactPhones.filter((_, i) => i !== index)
        }));
    };

    const handleExit = () => {
        if (window.confirm("You have unsaved changes. Are you sure you want to exit?")) {
            navigate("/recruiter");
        }
    };

    const handleCancel = () => {
        if (window.confirm("Changes not saved. We will keep a draft for your next visit. Exit?")) {
            localStorage.setItem(draftKey, JSON.stringify(formData));
            navigate("/recruiter");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const finalIndustry = formData.industry === "Other" ? otherIndustry : formData.industry;
        
        if (!finalIndustry) {
            alert("Please specify the industry");
            setLoading(false);
            return;
        }

        let formattedSalary = formData.salary;
        if (formattedSalary && !formattedSalary.includes("VNĐ")) {
            const unit = formData.jobType === "Part-time" ? "hour" : "month";
            const formattedNum = Number(formattedSalary).toLocaleString('vi-VN');
            formattedSalary = `${formattedNum} VNĐ/${unit}`;
        }

        const requestBody = { 
            title: formData.title,
            company: formData.company,
            salary: formattedSalary,
            industry: finalIndustry,
            jobType: formData.jobType,
            address: formData.address,
            contactEmail: formData.contactEmail,
            contactPhones: formData.contactPhones,
            description: formData.description,
            requirements: formData.requirements,
            img: formData.img,
            recruiter: userId 
        };

        const url = id 
            ? `http://localhost:5000/api/jobs/${id}`
            : "http://localhost:5000/api/jobs/create";
        
        const method = id ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });

            const data = await res.json();
            if (data.success) {
                alert(id ? "Job updated successfully!" : "Job saved successfully!");
                localStorage.removeItem(draftKey);
                navigate("/recruiter");
            } else {
                alert("Server error: " + (data.error || data.message));
            }
        } catch (err) {
            alert("Network error: Could not save job");
            console.error("FETCH ERROR:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recruiter-dashboard post-job-page">
            <div className="content">
                <div className="page-top">
                    <button className="back-btn" onClick={handleExit}>
                        <ArrowLeft size={20} />
                    </button>
                    <div className="header-text">
                        <h1>{id ? "Edit Job Posting" : "Post a New Job"}</h1>
                        <p>Provide detailed information to find the best candidates.</p>
                    </div>
                </div>

                <form className="post-job-form" onSubmit={handleSubmit}>
                    
                    {/* IMAGE UPLOAD SECTION */}
                    <div className="dashboard-card banner-section">
                        <div className="card-header no-border">
                            <h3><ImageIcon size={18} /> Job Banner / Image</h3>
                        </div>
                        
                        <div className="banner-upload-box" onClick={() => fileInputRef.current.click()}>
                            <img 
                                src={formData.img || "https://placehold.co/800x400/f8fafc/94a3b8?text=Click+to+upload+banner"} 
                                alt="Job Banner" 
                                className="banner-img"
                            />
                            <div className="banner-overlay">
                                <Plus size={24} />
                                <span>Change Banner Image</span>
                            </div>
                        </div>

                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            style={{ display: "none" }} 
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <p className="hint">Recommended: 800x400px (2:1 ratio). Max size: 5MB.</p>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-header no-border">
                            <h3><Briefcase size={18} /> Basic Information</h3>
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>JOB TITLE</label>
                                <div className="input-with-icon">
                                    <Briefcase size={16} />
                                    <input name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Senior Developer" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>COMPANY NAME</label>
                                <div className="input-with-icon">
                                    <Info size={16} />
                                    <input name="company" value={formData.company} onChange={handleInputChange} placeholder="Your Company" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>SALARY (VNĐ)</label>
                                <div className="input-with-icon">
                                    <DollarSign size={16} />
                                    <input type="text" name="salary" value={formData.salary} onChange={handleInputChange} placeholder={formData.jobType === "Part-time" ? "e.g. 50000" : "e.g. 10000000"} required />
                                </div>
                                <p className="salary-hint">
                                    {formData.jobType === "Part-time" ? "* Salary calculated per hour (VNĐ/hour)" : "* Salary calculated per month (VNĐ/month)"}
                                </p>
                            </div>
                            <div className="form-group">
                                <label>INDUSTRY</label>
                                <div className="input-with-icon">
                                    <Tag size={16} />
                                    <select name="industry" value={formData.industry} onChange={handleInputChange} required>
                                        <option value="">Select Industry</option>
                                        {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                                    </select>
                                </div>
                                {formData.industry === "Other" && (
                                    <div className="input-with-icon" style={{marginTop: "10px"}}>
                                        <Tag size={16} />
                                        <input value={otherIndustry} onChange={(e) => setOtherIndustry(e.target.value)} placeholder="Enter your industry..." required />
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label>JOB TYPE</label>
                                <div className="job-type-selector">
                                    <label className={formData.jobType === "Full-time" ? "active" : ""}>
                                        <input type="radio" name="jobType" value="Full-time" checked={formData.jobType === "Full-time"} onChange={handleInputChange} />
                                        Full-time
                                    </label>
                                    <label className={formData.jobType === "Part-time" ? "active" : ""}>
                                        <input type="radio" name="jobType" value="Part-time" checked={formData.jobType === "Part-time"} onChange={handleInputChange} />
                                        Part-time
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-header no-border">
                            <h3><MapPin size={18} /> Location & Contact</h3>
                        </div>
                        <div className="form-grid">
                            <div className="form-group full">
                                <label>WORK ADDRESS</label>
                                <div className="input-with-icon">
                                    <MapPin size={16} />
                                    <input name="address" value={formData.address} onChange={handleInputChange} placeholder="Full office address" required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>CONTACT EMAIL</label>
                                <div className="input-with-icon">
                                    <Mail size={16} />
                                    <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} placeholder="hr@company.com" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>CONTACT NUMBERS</label>
                                {formData.contactPhones && formData.contactPhones.map((phone, index) => (
                                    <div key={index} className="phone-input-group">
                                        <div className="input-with-icon">
                                            <Phone size={16} />
                                            <input type="text" value={phone} onChange={(e) => handlePhoneChange(index, e.target.value)} placeholder="Phone number" />
                                        </div>
                                        {formData.contactPhones.length > 1 && (
                                            <button type="button" className="remove-btn-outside" onClick={() => removePhoneField(index)}><Trash size={18} /></button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" className="add-more" onClick={addPhoneField}><Plus size={14} /> Add another phone</button>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-header no-border">
                            <h3><Info size={18} /> Job Details</h3>
                        </div>
                        <div className="form-group full">
                            <label>JOB DESCRIPTION</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe the role..." required />
                        </div>
                        <div className="form-group full">
                            <label>REQUIREMENTS</label>
                            <textarea name="requirements" value={formData.requirements} onChange={handleInputChange} placeholder="What skills are needed?" />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
                        <button type="submit" className="post-btn" disabled={loading}>{loading ? "Processing..." : "Save"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PostJob;