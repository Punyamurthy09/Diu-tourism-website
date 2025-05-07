import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setMessage("");
        
        try {
            const endpoint = isAdminLogin ? "adminLogin" : "login";
            const response = await axios.post(
                `http://localhost:5000/${endpoint}`,
                { email, password },
                { withCredentials: true }
            );
            
            if (response.status === 200) {
                setMessage("Login successful! 🎉");
                navigate("/");
            }
        } catch (error) {
            setMessage(error.response?.data?.error || "Something went wrong.");
        }
    };

    const toggleAdminLogin = (e) => {
        e.preventDefault();
        setIsAdminLogin(!isAdminLogin);
        setMessage("");
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <form className="login-form" onSubmit={handleLogin}>
                    <h2>{isAdminLogin ? "Admin Login" : "User Login"}</h2>
                    <div className="input-login-group">
                        <input
                            name="authUserEmail"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-login-group">
                        <input
                            name="authUserPassword"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {message && <p className="login-message">{message}</p>}
                    <button type="submit" name="authLoginSubmit" className="login-btn">
                        {isAdminLogin ? "Login as Admin" : "Login as User"}
                    </button>
                    {!isAdminLogin && (
                        <button 
                            type="button" 
                            name="authSignupBtn" 
                            className="signUp-btn" 
                            onClick={() => navigate("/signup")}
                        >
                            Signup
                        </button>
                    )}
                </form>
                <div className="admin-login-heading">
                    <Link to="#" onClick={toggleAdminLogin}>
                        {isAdminLogin ? "Login as User" : "Login as Admin"}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;

// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
// import "./login.css";


// const Login = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [message, setMessage] = useState("");
//     const navigate = useNavigate();

//     const handleLogin = async (event) => {
//         event.preventDefault();
//         setMessage("");

//         try {
//             const response = await axios.post(
//                 "http://localhost:5000/login",
//                 { email, password },
//                 { withCredentials: true }
//             );
//             if (response.status === 200) {
//                 setMessage("Login successful! 🎉");
//                 navigate("/"); // ✅ Redirect after login
//             }
//         } catch (error) {
//             setMessage(error.response?.data?.error || "Something went wrong.");
//         }
//     };

//     return (
//         <div className="login-wrapper">


//             <div className="login-container">
//                 <form className="login-form" onSubmit={handleLogin}>
//                     <h2>Login</h2>
//                     <div className="input-login-group" >
//                         <input
//                             name="authUserEmail"
//                             type="email"
//                             placeholder="Email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="input-login-group" >
//                         <input
//                             name="authUserPassword"
//                             type="password"
//                             placeholder="Password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                     </div>
//                     {message && <p className="login-message">{message}</p>}
//                     <button type="submit" name="authLoginSubmit" className="login-btn">Login</button>
//                     <button type="button" name="authSignupBtn" className="signUp-btn" onClick={() => navigate("/signup")}>
//                         Signup
//                     </button>
//                 </form>
//                 <div className="admin-login-heading">
                   
//                     <Link to="/adminLogin">Login As Admin</Link>
                    
//                     </div>
//             </div>
//         </div>

//     );
// };

// export default Login;
