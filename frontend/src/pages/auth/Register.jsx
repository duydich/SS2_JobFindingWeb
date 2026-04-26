import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Briefcase } from "lucide-react";
import "./login.css"; // Dùng chung file css viết thường

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRecruiter, setIsRecruiter] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const role = isRecruiter ? "recruiter" : "student";
            const res = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role })
            });

            const data = await res.json();

            if (data.success) {
                alert("Đăng ký thành công");
                navigate("/login");
            } else {
                alert(data.message);
            }

        } catch (error) {
            alert("Lỗi kết nối server");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">

                {/* LOGO */}
                <div className="logo">
                    <Briefcase size={24} />
                    <span>JobFinder</span>
                </div>

                <h2>Create your account</h2>
                <p className="subtitle">
                    Join us and explore part-time job opportunities
                </p>

                {/* NAME */}
                <label>FULL NAME</label>
                <div className="input-group">
                    <span><User size={18} /></span>
                    <input
                        type="text"
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* EMAIL */}
                <label>EMAIL ADDRESS</label>
                <div className="input-group">
                    <span><Mail size={18} /></span>
                    <input
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {/* PASSWORD */}
                <label>PASSWORD</label>
                <div className="input-group">
                    <span><Lock size={18} /></span>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {/* CHECKBOX_RECRUITER */}
                <div className="checkbox-group">
                    <input
                        type="checkbox"
                        id="recruiter-check"
                        checked={isRecruiter}
                        onChange={(e) => setIsRecruiter(e.target.checked)}
                    />
                    <label htmlFor="recruiter-check">I want to be a Recruiter</label>
                </div>

                <button className="login-btn" onClick={handleRegister}>
                    Create Account
                </button>

                <p className="or">Or continue with</p>

                <button className="google-btn">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" width="18" />
                    Google
                </button>

                <p className="register">
                    Already have an account?{" "}
                    <Link to="/login">Login now</Link>
                </p>

            </div>
        </div>
    );
}

export default Register;