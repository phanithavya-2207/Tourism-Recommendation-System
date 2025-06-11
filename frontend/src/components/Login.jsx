import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../styles/Login.scss";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [verificationSent, setVerificationSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/login", { username, password });
            if (response.data.success) {
                localStorage.setItem("user", JSON.stringify(response.data.user));
                navigate("/dashboard");
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError("Invalid credentials or user does not exist!");
        }
    };

    const handleForgotPassword = async () => {
        if (!emailOrPhone.trim()) {
            alert("Please enter your Email or Phone to receive the verification code.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/forgot-password", { emailOrPhone });
            if (response.data.success) {
                setVerificationSent(true);
            } else {
                alert(response.data.message);
            }
        } catch (err) {
            alert("Error sending verification code.");
        }
    };

    const handleResetPassword = async () => {
        if (!verificationCode.trim() || !newPassword.trim()) {
            alert("Please enter the verification code and a new password.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/reset-password", {
                emailOrPhone,
                verificationCode,
                newPassword,
            });

            if (response.data.success) {
                alert("Password reset successful! You can now log in.");
                setShowForgotPassword(false);
            } else {
                alert(response.data.message);
            }
        } catch (err) {
            alert("Error resetting password.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit">Login</button>
                </form>
                <p className="forgot-password" onClick={() => setShowForgotPassword(true)}>Forgot Password?</p>
                <p className="register-link">
                    Don't have an account? <span onClick={() => navigate("/register")}>Register</span>
                </p>
            </div>

            {showForgotPassword && (
                <div className="forgot-password-dialog">
                    <div className="dialog-content">
                        <h3>Reset Password</h3>
                        <input 
                            type="text" 
                            placeholder="Enter Email/Phone" 
                            value={emailOrPhone} 
                            onChange={(e) => setEmailOrPhone(e.target.value)} 
                            required 
                        />
                        <button onClick={handleForgotPassword}>Send Code</button>
                        {verificationSent && (
                            <>
                                <input 
                                    type="text" 
                                    placeholder="Enter Verification Code" 
                                    value={verificationCode} 
                                    onChange={(e) => setVerificationCode(e.target.value)} 
                                    required 
                                />
                                <input 
                                    type="password" 
                                    placeholder="Enter New Password" 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                    required 
                                />
                                <button onClick={handleResetPassword}>Reset Password</button>
                            </>
                        )}
                        <button className="cancel-btn" onClick={() => setShowForgotPassword(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
