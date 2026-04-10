import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock, Briefcase } from "lucide-react";
import "./Login.css";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();

            if (data.success) {
                alert("Đăng ký thành công");
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
                    <Briefcase size={20} />
                    <span>JobFinder</span>
                </div>

                <h2>Create your account</h2>
                <p className="subtitle">
                    Join us and explore part-time job opportunities
                </p>

                {/* NAME */}
                <label>FULL NAME</label>
                <div className="input-group">
                    <span><User size={16} /></span>
                    <input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

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

                <button className="login-btn" onClick={handleRegister}>
                    Register
                </button>

                <p className="or">Or continue with</p>

                <button className="google-btn">
                    Continue with Google
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