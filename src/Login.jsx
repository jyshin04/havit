import React, { useState } from "react";
import Logo from "./Logo";

export default function Login({ onLogin, onSwitchMode }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // Admin login logic
    if (id === "havitadmin" && password === "havit0422") {
      onLogin({ id: "havitadmin", isAdmin: true });
      return;
    }
    const saved = localStorage.getItem("havit_user");
    if (!saved) {
      setError("No account found. Please sign up first.");
      return;
    }
    const user = JSON.parse(saved);
    if (user.id !== id || user.password !== password) {
      setError("Invalid credentials.");
      return;
    }
    onLogin({ id });
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit} className="p-10 flex flex-col gap-5 w-full max-w-sm min-h-[420px]">
          <div className="flex flex-col items-center mb-2">
            {/* Logo at the top, if available */}
            <div className="mb-2"><Logo className="w-14 h-14" /></div>
            <h2 className="text-3xl font-bold text-rose-500 tracking-tight">Welcome Back</h2>
            <p className="text-gray-400 text-sm mt-1">Login to your account</p>
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
          {error && <div className="bg-red-50 border border-red-200 text-red-500 text-sm text-center rounded p-2 animate-fadein">{error}</div>}
          <button
            type="submit"
            className="bg-rose-500 text-white font-bold py-2 rounded-lg mt-2 hover:bg-rose-600 shadow-md transition-all duration-150"
          >
            Login
          </button>
          <div className="flex flex-row justify-between items-center mt-4">
            <span className="text-gray-400 text-sm">Don’t have an account?</span>
            <button
              type="button"
              className="text-rose-500 font-bold text-sm hover:underline px-2"
              onClick={onSwitchMode}
            >
              Sign up
            </button>
          </div>
        </form>
    </div>
  );
}
