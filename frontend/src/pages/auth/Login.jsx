import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Briefcase } from "lucide-react";
import "./login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        const res = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.success) {
            alert("Đăng nhập thành công");
            // lấy user object
            const user = data.data;

            // Lấy role từ object user
            const role = user.role;  // Thêm dòng này

            // chỉ lưu ID
            localStorage.setItem("userId", user._id);

            // redirect theo role
            if (role === "recruiter") {
                navigate("/recruiter");
            } else {
                navigate("/explore"); // default = student
            }
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">

                {/* LOGO */}
                <div className="logo">
                    <Briefcase size={20} />
                    <span>JobFinder</span>
                </div>

                <h2>Welcome to JobFinder</h2>
                <p className="subtitle">
                    Sign in to continue finding part-time jobs
                </p>

                {/* EMAIL */}
                <label>EMAIL</label>
                <div className="input-group">
                    <span><Mail size={16} /></span>
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {/* PASSWORD */}
                <label>PASSWORD</label>
                <div className="input-group">
                    <span><Lock size={16} /></span>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="forgot">Forgot password?</div>

                <button className="login-btn" onClick={handleLogin}>
                    Login
                </button>

                <p className="or">Or login with</p>

                <button className="google-btn">
                    Continue with Google
                </button>

                <p className="register">
                    Don't have an account?{" "}
                    <Link to="/register">Register now</Link>
                </p>

            </div>
        </div>
    );
}

export default Login;