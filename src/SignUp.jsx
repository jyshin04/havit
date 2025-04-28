import React, { useState } from "react";
import Logo from "./Logo";

export default function SignUp({ onSignUp, onSwitchMode }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  
  function handleSubmit(e) {
    e.preventDefault();
    if (!id || !password || !confirm) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    // Save user to localStorage for MVP (not secure)
    localStorage.setItem("havit_user", JSON.stringify({ id, password }));
    onSignUp({ id });
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit} className="p-10 flex flex-col gap-5 w-full max-w-sm min-h-[420px]">
          <div className="flex flex-col items-center mb-2">
            {/* Logo at the top, if available */}
            <div className="mb-2"><Logo className="w-14 h-14" /></div>
            <h2 className="text-3xl font-bold text-rose-500 tracking-tight">Create Account</h2>
            <p className="text-gray-400 text-sm mt-1">Sign up to get started</p>
          </div>
          <input
            type="text"
            placeholder="User ID"
            value={id}
            onChange={e => setId(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-rose-300 bg-gray-50 transition"
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-rose-300 bg-gray-50 transition"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-rose-300 bg-gray-50 transition"
          />
          {error && <div className="bg-red-50 border border-red-200 text-red-500 text-sm text-center rounded p-2 animate-fadein">{error}</div>}
          <button
            type="submit"
            className="bg-rose-500 text-white font-bold py-2 rounded-lg mt-2 hover:bg-rose-600 shadow-md transition-all duration-150"
          >
            Sign Up
          </button>
          <div className="flex flex-row justify-between items-center mt-4">
            <span className="text-gray-400 text-sm">Already have an account?</span>
            <button
              type="button"
              className="text-rose-500 font-bold text-sm hover:underline px-2"
              onClick={onSwitchMode}
            >
              Login
            </button>
          </div>
        </form>
    </div>
  );
}
