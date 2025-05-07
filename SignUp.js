import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (event) => {
        event.preventDefault();
        setMessage("");

        try {
            const response = await axios.post(
                "http://localhost:5000/signup",
                { user_name: name, email: email, user_password: password }, // ✅ Matches backend
                { withCredentials: true } // ✅ Ensures cookies are sent
            );

            if (response.status === 201) {
                setMessage("Signup successful! 🎉");
                navigate("/login"); // ✅ Redirects after signup
            }
        } catch (error) {
            setMessage(error.response?.data?.error || "Something went wrong.");
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <form className="login-form" onSubmit={handleSignup}>
                    <h2>Signup</h2>
                    <div className="input-login-group">
                        <input type="text" name="authSignupName" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="input-login-group">
                        <input type="email" name="authSignupEmail" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="input-login-group">
                        <input type="password" name="authSignupPassword" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    {message && <p className="message">{message}</p>}
                    <button type="submit" name="authSignupSubmit" className="login-btn">Signup</button>
                </form>
            </div>
        </div>

    );
};

export default Signup;
