import React, { useEffect, useRef, useState } from "react";

// OpeningPage overlays the app with an animated welcome and rotating sentences.
export default function OpeningPage({ onFinish }) {
  const [show, setShow] = useState(true);
  const [rotatingIdx, setRotatingIdx] = useState(0);
  const sentences = [
    "Earn rewards for real reviews.",
    "Help brands improve.",
    "Build trust that lasts."
  ];
  const rotatingInterval = useRef();

  // Auto-rotate sentences
  useEffect(() => {
    rotatingInterval.current = setInterval(() => {
      setRotatingIdx(idx => (idx + 1) % sentences.length);
    }, 1900);
    return () => clearInterval(rotatingInterval.current);
  }, []);

  // Click anywhere to dismiss
  function handleDismiss() {
    setShow(false);
    if (onFinish) setTimeout(onFinish, 400); // allow fade-out
  }

  return show ? (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-400"
      style={{ cursor: "pointer", minHeight: "100vh", minWidth: "100vw" }}
      onClick={handleDismiss}
    >
      <div className="flex flex-col items-center gap-2 select-none">
        <span
          className="text-base text-gray-400 tracking-wider mb-0 "
          style={{ letterSpacing: "0.08em", fontWeight: 500, marginBottom: 0 }}
        >
          welcome to
        </span>
        <span
          className="text-5xl md:text-6xl font-black text-gray-900 tracking-widest lowercase "
          style={{
            fontFamily: 'Poppins, sans-serif',
            letterSpacing: '0.01em',
            marginTop: -8,
            marginBottom: 30
          }}
        >
          havit
        </span>
        <div className="h-10 mt-2 flex items-center relative w-full min-w-[320px] justify-center flex-nowrap min-w-0">
  {sentences.map((sentence, i) => (
    <span
      key={sentence}
      className={`absolute left-0 right-0 mx-auto text-base md:text-lg font-semibold text-rose-400 transition-opacity duration-500 ${rotatingIdx === i ? 'opacity-100 animate-fadein' : 'opacity-0'} flex justify-center w-auto text-center whitespace-nowrap`}
      style={{
        willChange: 'opacity, transform',
        transition: 'opacity 0.5s, transform 0.5s',
        transform: rotatingIdx === i ? 'translateY(0)' : 'translateY(16px)',
      }}
    >
      {sentence}
    </span>
  ))}
</div>
      </div>
    </div>
  ) : null;
}
