import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-blue-700 px-4">
      <div className="w-full max-w-sm bg-white bg-opacity-10 backdrop-blur-sm p-10 rounded-2xl shadow-lg text-white">
        <h1 className="text-3xl font-bold text-center mb-2">SyncVerse</h1>
        <p className="text-center text-sm text-white mb-8 opacity-80">
          Enter the gateway to your universe 🔗
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-white"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Password with icon */}
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 pr-10 rounded-lg bg-white bg-opacity-20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaSearch className="absolute right-3 top-3 text-white opacity-80" />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-white text-blue-600 font-semibold py-3 rounded-lg hover:bg-opacity-80 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-6 opacity-80">
          Don't have an account?{" "}
          <button
            type="button"
            className="underline text-white hover:text-blue-200"
            onClick={() => alert("Registration coming soon")}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
