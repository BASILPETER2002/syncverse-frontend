import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username, password);
    } else {
      alert("Please enter both username and password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-4">
      <div className="bg-[#1e293b] border border-gray-700 rounded-2xl p-10 w-full max-w-[400px] shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-cyan-400 mb-1 animate-pulse">SyncVerse</h2>
          <p className="text-gray-400 text-sm">Your universe, synced.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username */}
          <div>
            <label className="text-sm text-gray-300 block mb-1">Username</label>
            <div className="relative">
              <FaUser className="absolute top-3.5 left-3 text-cyan-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#f1f2f4] border border-gray-600 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                placeholder="Enter username"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-300 block mb-1">Password</label>
            <div className="relative">
              <FaLock className="absolute top-3.5 left-3 text-cyan-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#e9ebee] border border-gray-600 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                placeholder="Enter password"
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Buttons */}
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2.5 rounded-lg transition duration-300"
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => alert("Registration coming soon")}
            className="w-full text-sm text-cyan-400 hover:underline text-center mt-1"
          >
            Don’t have an account? Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
