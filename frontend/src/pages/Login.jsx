import { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async () => {
        const res = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        console.log(data);

        if (data.success) {
            alert("Đăng nhập thành công");
        } else {
            alert(data.message);
        }

    };

    return (
        <div className="login-container">
            <div className="login-card">

                <h2>Welcomeback</h2>
                <p className="subtitle">
                    Build an outstanding profile together and receive ideal career opportunities
                </p>

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

                <div className="forgot">Forgot password?</div>

                <button className="login-btn" onClick={handleLogin}>Login</button>

                <p className="or">Or login with</p>

                <button className="google-btn">
                    <img src="https://cdn-icons-png.flaticon.com/512/281/281764.png" />
                    Google
                </button>

                <p className="register">
                    Don't have an account yet?{" "}
                    <Link to="/register">Register now</Link>
                </p>

            </div>
        </div>
    );

}
export default Login;

