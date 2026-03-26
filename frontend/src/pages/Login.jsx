import { useState } from "react";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async () => {
        const res = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        console.log(data);

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
                    <input type="text" placeholder="Email" />
                </div>

                <label>Password</label>
                <div className="input-group">
                    <span>"logo password"</span>
                    <input type="password" placeholder="Password" />
                </div>

                <div className="forgot">Forgot password?</div>

                <button className="login-btn">Login</button>

                <p className="or">Or login with</p>

                <button className="google-btn">Google</button>

                <p>1 trong 2 cai</p>

                <button className="google-btn">
                    <img src="https://cdn-icons-png.flaticon.com/512/281/281764.png" />
                    Google
                </button>

                <p className="register">
                    Don't have an account yet? <span>Register now</span>
                </p>

            </div>
        </div>
    );

}
export default Login;

