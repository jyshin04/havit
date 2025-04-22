import React from "react";

export default function BottomNav({ current, onNavigate }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t  h-20 flex justify-around items-center">
      <button
        className="flex flex-col items-center text-xs focus:outline-none"
        onClick={() => onNavigate("home")}
      >
        <svg
          className={`w-8 h-8 mb-1 ${current === "home" ? "text-rose-400" : "text-gray-700"}`}
          fill={current === "home" ? "#f87171" : "#374151"}
          viewBox="0 0 24 24"
        >
          <path d="M3 11.9L12 4l9 7.9V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
        </svg>
        <span className={`text-xs font-bold ${current === "home" ? "text-rose-400" : "text-gray-700"}`}>Home</span>
      </button>
      <button
        className="flex flex-col items-center justify-center -mt-8 focus:outline-none"
        onClick={() => onNavigate("record")}
        style={{ zIndex: 2 }}
      >
        <span className={`flex items-center justify-center w-16 h-16 rounded-full border-4 border-white ${current === "record" ? "bg-rose-400" : "bg-gray-700"}`}>
          <svg
            className="w-9 h-9"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="12" fill={current === "record" ? "#f87171" : "#374151"} />
            <path d="M12 7v10M7 12h10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </span>
        <span className={`text-xs font-bold ${current === "record" ? "text-rose-400" : "text-gray-700"}`}>Record</span>
      </button>
      <button
        className="flex flex-col items-center text-xs focus:outline-none"
        onClick={() => onNavigate("you")}
      >
        <svg
          className={`w-8 h-8 mb-1 ${current === "you" ? "text-rose-400" : "text-gray-700"}`}
          fill="none"
          stroke={current === "you" ? "#f87171" : "#374151"}
          strokeWidth="2.2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="9" r="4" />
          <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" strokeLinecap="round" />
        </svg>
        <span className={`text-xs font-bold ${current === "you" ? "text-rose-400" : "text-gray-700"}`}>You</span>
      </button>
    </nav>
  );
}
