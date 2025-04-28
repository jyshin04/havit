import React from "react";
import Logo from "./Logo";

export default function TopNav() {
  return (
    <header className="w-full py-2 px-6 bg-white flex items-center border-b border-gray-200 sticky top-0 z-30 lg:hidden" style={{marginTop: 0}}>
      <Logo />
    </header>
  );
}
