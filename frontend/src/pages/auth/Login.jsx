import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Briefcase } from "lucide-react";
import "./login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.success) {
                localStorage.setItem("userId", data.data._id);
                localStorage.setItem("role", data.data.role);
                
                if (data.data.role === "recruiter") {
                    navigate("/recruiter");
                } else {
                    navigate("/explore");
                }
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("An error occurred during login.");
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

                <h2>Welcome Back</h2>
                <p className="subtitle">
                    Login to manage your jobs or find opportunities
                </p>

                <form onSubmit={handleLogin}>
                    {/* EMAIL */}
                    <label>EMAIL ADDRESS</label>
                    <div className="input-group">
                        <span><Mail size={16} /></span>
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
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
                            required
                        />
                    </div>

                    <p className="forgot">Forgot password?</p>

                    <button type="submit" className="login-btn">
                        Login
                    </button>
                </form>

                <p className="or">Or continue with</p>

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