import { useState } from "react";
import "./Login.css"; // dùng lại css tam thoi
import { Link } from "react-router-dom";

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
            console.log(data);

            if (data.success) {
                alert("Đăng ký thành công ");
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error(error);
            alert("Lỗi kết nối server ");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">

                <h2>Create Account</h2>
                <p className="subtitle">
                    Join us and explore career opportunities
                </p>

                {/* NAME */}
                <label>Name</label>
                <div className="input-group">
                    <span>"logo name"</span>
                    <input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* EMAIL */}
                <label>Email</label>
                <div className="input-group">
                    <span>"logo email"</span>
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {/* PASSWORD */}
                <label>Password</label>
                <div className="input-group">
                    <span>"logo password"</span>
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

                <p className="or">Or register with</p>

                <button className="google-btn">
                    <img src="https://cdn-icons-png.flaticon.com/512/281/281764.png" />
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