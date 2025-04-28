import React, { forwardRef, useEffect, useRef } from "react";

// CameraCircle: main camera UI component
//
// To adjust the CAMERA CIRCLE SIZE, change the 'size' prop (default: 320)
// To adjust the PINK RING THICKNESS, change strokeWidth in the SVG (default: 16)
// To adjust the PINK RING SIZE, change the +32 offset in the SVG size, cx/cy, and radius
// To adjust ANIMATION SPEED, edit the .animate-pink-ring CSS in animate.css

const CameraCircle = forwardRef(function CameraCircle({ size = 320, onCapture, frozenPhoto = null, disabled = false, showRing = false }, ref) {
  const videoRef = useRef();

  // Start live camera on mount
  useEffect(() => {
    let stream;
    const video = videoRef.current;
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (video) {
          video.srcObject = stream;
        }
      } catch (err) {
        // Optionally handle error (e.g., show fallback UI)
        console.error("Camera access denied or not available", err);
      }
    }
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (video) {
        video.srcObject = null;
      }
    };
  }, []);

  function handleCapture() {
    if (!videoRef.current) return;
    const video = videoRef.current;
    // Pause the video to "freeze" the frame
    video.pause();
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

  // Resume video when frozenPhoto is cleared
  useEffect(() => {
    if (!frozenPhoto && videoRef.current) {
      videoRef.current.play().catch(() => {}); // resume live feed
    }
  }, [frozenPhoto]);

  // Support ref forwarding for animation overlay
  const containerRef = useRef();
  React.useImperativeHandle(ref, () => ({
    container: containerRef.current,
    async capturePhoto() {
      if (!videoRef.current) return null;
      const video = videoRef.current;
      video.pause(); // Freeze the frame
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();
      // Crop the largest possible centered square from the video
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      const side = Math.min(vw, vh);
      const sx = (vw - side) / 2;
      const sy = (vh - side) / 2;
      ctx.drawImage(video, sx, sy, side, side, 0, 0, size, size);
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
          >
            Your browser does not support the video tag.
          </video>
          {frozenPhoto && (
            <img
              src={frozenPhoto}
              alt="Frozen"
              className="absolute inset-0 object-cover w-full h-full"
              style={{ borderRadius: "50%", zIndex: 2 }}
            />
          )}
        </>

      </div>

    </div>
  );
});

export default CameraCircle;
