import React from "react";

export default function TopNav() {
  return (
    <header className="w-full py-2 px-6 bg-white flex items-center justify-between border-b border-gray-200 sticky top-0 z-30" style={{marginTop: 0}}>
      <h1 className="text-xl font-black text-gray-900 tracking-widest lowercase" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '0.01em' }}>havit</h1>
      <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none" aria-label="Search">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </header>
  );
}
