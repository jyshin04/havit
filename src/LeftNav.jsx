import React from "react";
import Logo from "./Logo";

const navItems = [
  { key: "home", label: "Home", icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 11.9L12 4l9 7.9V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
    </svg>
  ) },
  { key: "record", label: "Record", icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="currentColor" />
      <path d="M12 7v10M7 12h10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ) },
  { key: "you", label: "You", icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <circle cx="12" cy="9" r="4" />
      <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" strokeLinecap="round" />
    </svg>
  ) },
];

export default function LeftNav({ current, onNavigate }) {
  return (
    <aside className="hidden lg:flex flex-col w-56 h-screen bg-white border-r border-gray-200 py-8 px-4 fixed top-0 left-0 z-40">
      <div className="mb-10 pl-1"><Logo /></div>
      <nav className="flex flex-col gap-2">
        {navItems.map(item => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-semibold transition-colors ${current === item.key ? 'bg-rose-50 text-rose-500' : 'text-gray-700 hover:bg-gray-100'}`}
            style={{ color: current === item.key ? '#f87171' : undefined }}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
