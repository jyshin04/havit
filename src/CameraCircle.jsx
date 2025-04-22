import React, { forwardRef, useEffect, useRef, useState } from "react";

// CameraCircle: main camera UI component
//
// To adjust the CAMERA CIRCLE SIZE, change the 'size' prop (default: 320)
// To adjust the PINK RING THICKNESS, change strokeWidth in the SVG (default: 16)
// To adjust the PINK RING SIZE, change the +32 offset in the SVG size, cx/cy, and radius
// To adjust ANIMATION SPEED, edit the .animate-pink-ring CSS in animate.css

const CameraCircle = forwardRef(function CameraCircle({ size = 320, onCapture, frozenPhoto = null, disabled = false, showRing = false }, ref) {
  const videoRef = useRef();
  const [error, setError] = useState(null);
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    let stream;
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreaming(true);
        }
      } catch (err) {
        setError("Camera access denied or unavailable.");
      }
    }
    startCamera();
    return () => {
      if (stream && stream.getTracks) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Force camera to resume when frozenPhoto is cleared
  useEffect(() => {
    if (!frozenPhoto && !streaming && !error) {
      // Try to restart camera
      async function restartCamera() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setStreaming(true);
          }
        } catch (err) {
          setError("Camera access denied or unavailable.");
        }
      }
      restartCamera();
    }
  }, [frozenPhoto, streaming, error]);

  function handleCapture() {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(video, 0, 0, size, size);
    ctx.restore();
    const dataUrl = canvas.toDataURL("image/png");
    if (onCapture) onCapture(dataUrl);
  }

  // Support ref forwarding for animation overlay
  const containerRef = useRef();
  React.useImperativeHandle(ref, () => ({
    container: containerRef.current,
    async capturePhoto() {
      if (!videoRef.current) return null;
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(video, 0, 0, size, size);
      ctx.restore();
      return canvas.toDataURL("image/png");
    }
  }));

  return (
    <div ref={containerRef} className="flex flex-col justify-center items-center w-full my-4">
      <div
        className="relative flex justify-center items-center bg-gray-100"
        style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", boxShadow: "0 4px 24px 0 #0001" }}
      >
        {showRing && (
          // Pink animated ring SVG
          // To adjust RING SIZE: change '+ 32' (makes ring larger/smaller around camera)
          // To adjust RING THICKNESS: change strokeWidth (default: 16)
          // To adjust ANIMATION: see .animate-pink-ring in animate.css
          <svg
            className="absolute inset-0 w-full h-full z-10 animate-pink-ring"
            style={{ pointerEvents: 'none', transform: 'rotate(-90deg)' }}
            viewBox={`0 0 ${size + 32} ${size + 32}`}
          >
            <circle
              cx={(size + 32) / 2} // Center of SVG
              cy={(size + 32) / 2}
              r={(size / 2) + 10}   // RING RADIUS: bigger value = larger ring
              fill="none"
              stroke="#f87171"
              strokeWidth="14"      // RING THICKNESS: bigger value = thicker ring
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * ((size / 2) + 16)}
              strokeDashoffset={2 * Math.PI * ((size / 2) + 16)}
            />
          </svg>
        )}
        {error ? (
          <div className="flex items-center justify-center w-full h-full text-rose-600 font-semibold text-center px-4">
            {error}
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              width={size}
              height={size}
              className="object-cover w-full h-full"
              style={{ borderRadius: "50%" }}
            />
            {frozenPhoto && (
              <img
                src={frozenPhoto}
                alt="Frozen"
                className="absolute inset-0 object-cover w-full h-full"
                style={{ borderRadius: "50%", zIndex: 2 }}
              />
            )}
          </>
        )}
        {!streaming && !error && !frozenPhoto && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-gray-500 font-semibold">
            Loading camera…
          </div>
        )}
      </div>

    </div>
  );
});

export default CameraCircle;
