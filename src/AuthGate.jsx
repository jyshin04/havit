import React, { useState } from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import Logo from "./Logo";

export default function AuthGate({ onAuth }) {
  const [mode, setMode] = useState(null); // null, 'signup', 'login'

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-rose-100 via-white to-rose-200 px-4">
      {!mode && (
        <div className="flex flex-col items-center gap-6 p-10 w-full max-w-sm min-h-[420px]">
          <div className="mb-2"><Logo className="w-14 h-14" /></div>
          <h1 className="text-3xl font-bold text-rose-500 tracking-tight mb-2">Welcome to Havit!</h1>
          <p className="text-gray-400 text-sm mb-4">Sign up or log in to continue</p>
          <div className="flex gap-4 w-full justify-center">
            <button
              type="button"
              className="bg-rose-500 text-white font-bold py-2 px-8 rounded-lg text-lg hover:bg-rose-600 shadow-md transition-all duration-150"
              onClick={() => setMode('signup')}
            >
              Sign Up
            </button>
            <button
              type="button"
              className="bg-gray-100 text-gray-700 font-bold py-2 px-8 rounded-lg text-lg hover:bg-gray-300 shadow-md transition-all duration-150"
              onClick={() => setMode('login')}
            >
              Login
            </button>
          </div>
        </div>
      )}
      {mode === 'signup' && <SignUp onSignUp={onAuth} onBack={() => setMode(null)} />}
      {mode === 'login' && <Login onLogin={onAuth} onBack={() => setMode(null)} />}
    </div>
  );
}
