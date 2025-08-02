import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/syncverse-logo.jpg";
import "./LoginPage.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegisterMode
      ? "http://localhost:5000/register"
      : "http://localhost:5000/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("user", username);
        navigate("/dashboard");
      } else {
        setStatusMessage(data.error || "An error occurred.");
      }
    } catch (err) {
      console.error("Login/Register error:", err); // Log error details
      setStatusMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <div className="thread-line"></div>
      <div className="login-card">
        <img src={logo} alt="SyncVerse Logo" className="login-logo" />
        <h2 className="login-title">
          {isRegisterMode ? "Register" : "Login"} to{" "}
          <span style={{ color: "#000" }}>SyncVerse</span>
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">
            {isRegisterMode ? "Register" : "Login"}
          </button>
        </form>

        {statusMessage && (
          <p className="text-sm text-red-500 mt-2">{statusMessage}</p>
        )}

        <p className="login-toggle">
          {isRegisterMode ? "Already have an account?" : "Don't have an account?"}{" "}
          <span onClick={() => setIsRegisterMode(!isRegisterMode)}>
            {isRegisterMode ? "Login" : "Register"}
          </span>
        </p>
      </div>
    </div>
  );
}
