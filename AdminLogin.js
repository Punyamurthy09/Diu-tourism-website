import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Auth/login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setMessage("");

        try {
            const response = await axios.post(
                "http://localhost:5000/adminLogin",
                { email, password },
                { withCredentials: true }
            );
            if (response.status === 200) {
                setMessage("Login successful! 🎉");
                navigate("/"); // ✅ Redirect after login
            }
        } catch (error) {
            setMessage(error.response?.data?.error || "Something went wrong.");
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <form className="login-form" onSubmit={handleLogin}>
                    <h2>Admin Login</h2>
                    <div className="input-login-group" >
                        <input
                            name="authAdminEmail"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-login-group" >
                        <input
                            name="authAdminPassword"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {message && <p className="login-message">{message}</p>}
                    <button type="submit" name="authAdminLoginSubmit" className="login-btn">Login</button>
                </form>
            </div>
        </div>

    );
};

export default Login;