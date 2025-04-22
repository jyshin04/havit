import React, { useRef, useState } from "react";
import CameraCircle from "./CameraCircle";

import "./animate.css";

function parseDuration(duration) {
  const match = duration.match(/(\d+)\s*month/);
  return match ? parseInt(match[1], 10) : 1;
}

function getChallengeRange(duration) {
  const numMonths = parseDuration(duration);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setMonth(end.getMonth() + numMonths);
  end.setDate(end.getDate() - 1); // last day is inclusive
  return { start, end };
}

function getMonthDays(year, month) {
  // month: 0-indexed
  const days = [];
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}


function getShortName(name) {
  if (!name) return '';
  // Map full product names to user-provided short names
  const nameMap = {
    "Shiseido White Lucent Brightening Gel Cream": "Shiseido | Brightening Gel Cream",
    "medicube Collagen Niacinamide Jelly Cream": "medicube | Collagen Jelly Cream",
    "Paula's Choice CLEAR Back & Body Exfoliating Acne Spray": "Paula's Choice | Acne Spray",
    "Amazon Basic Care Hair Regrowth Treatment": "Amazon | Hair Regrowth Treatment",
  };
  return nameMap[name] || name;
}

export default function Dashboard({ challenge, progress, onUpload, completion, onComplete, joinedChallenges = [], onSwitchChallenge }) {
  // --- Calendar date selection state ---
  const [selectedDate, setSelectedDate] = useState(() => {
    const uploads = progress || {};
    const today = new Date();
    today.setHours(0,0,0,0);
    const todayStr = today.toDateString();
    return uploads[todayStr] ? todayStr : null;
  });
  const [monthIdx, setMonthIdx] = useState(0); // 0 = start month
  const fileRef = useRef();
  const uploads = progress || {};

  // --- Animation states ---
  const [photoAnim, setPhotoAnim] = useState({ phase: 'idle', dataUrl: null }); // phase: idle | frozen | animating
  const cameraCircleRef = useRef();
  const calendarCellRef = useRef();

  // Helper to get today string
  const today = new Date();
  today.setHours(0,0,0,0);
  const todayStr = today.toDateString();
  const todayUpload = uploads[todayStr];

  // Challenge period
  const { start, end } = getChallengeRange(challenge.duration);
  const totalDays = Math.round((end - start) / (1000*60*60*24)) + 1;
  const completed = Object.keys(uploads).length;
  const percent = Math.round((completed / totalDays) * 100);

  // Month navigation
  const calendarStart = new Date(start);
  calendarStart.setMonth(calendarStart.getMonth() + monthIdx);
  const year = calendarStart.getFullYear();
  const month = calendarStart.getMonth();
  const monthDays = getMonthDays(year, month);
  const monthName = calendarStart.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Only allow next/prev month if within challenge period
  const canPrev = monthIdx > 0;
  const canNext = (calendarStart.getFullYear() < end.getFullYear()) ||
    (calendarStart.getFullYear() === end.getFullYear() && calendarStart.getMonth() < end.getMonth());

  // Highlight logic
  function isChallengeDay(date) {
    return date >= start && date <= end;
  }
  function isLastChallengeDay(date) {
    return date.toDateString() === end.toDateString();
  }



  // Check if today is after or on the last challenge day
  const afterLastDay = today >= end;

  // Dropdown for switching challenges
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const hasMultiple = joinedChallenges.length > 1;
  const dropdownRef = useRef();
  
  // Close dropdown on outside click
  React.useEffect(() => {
    if (!dropdownOpen) return;
    function handle(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [dropdownOpen]);
  
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl p-12">
      {/* Challenge selection dropdown */}
      <div className="flex flex-col items-center mb-6">
        {/* New Challenge Dropdown Title Style */}
        <div className="w-full flex flex-col items-center mb-2 relative" ref={dropdownRef}>
          <button
            className="flex items-center w-full max-w-sm mx-auto px-6 py-3 rounded-full bg-rose-400 shadow font-bold text-white text-sm justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-rose-300 transition"
            onClick={() => hasMultiple && setDropdownOpen(o => !o)}
            style={{minHeight:'44px'}}
          >
            <span className="truncate text-white font-bold text-sm text-center w-full">{getShortName(challenge.product)}</span>
            {hasMultiple && (
              <svg className={`w-5 h-5 ml-2 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          {/* Dropdown menu for challenge selection */}
          <div className={`w-full max-w-sm mx-auto transition-all duration-300 ${dropdownOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'} overflow-hidden shadow rounded-xl bg-white`}>{hasMultiple && joinedChallenges.map((c) => (
            <button
              key={c.id}
              className={`w-full px-4 py-3 flex items-center justify-center text-center gap-2 text-sm rounded-lg transition ${c.id === challenge.id ? "bg-white text-gray-800 font-bold" : "text-gray-700 font-normal hover:bg-gray-50"}`}
              onClick={() => { setDropdownOpen(false); if (c.id !== challenge.id && onSwitchChallenge) onSwitchChallenge(c); }}
              disabled={c.id === challenge.id}
            >
              <span className="truncate w-full">{getShortName(c.product)}</span>
            </button>
          ))}</div>
        </div>

        {/* Challenge product information */}
        <img src={challenge.image} alt={challenge.product} className="w-28 h-28 rounded-xl mb-3 object-cover" />

        <p className="text-gray-600 text-sm mb-2">{challenge.description}</p>

        {/* Challenge completion UI */}
        {afterLastDay && !completion && (
          <button
            className="mt-4 px-6 py-2 rounded bg-green-600 text-white font-semibold  hover:bg-green-700 transition"
            onClick={onComplete}
          >
            Mark as Complete
          </button>
        )}
        {completion && (
          <div className="mt-4 px-4 py-2 rounded bg-rose-100 text-rose-700 font-semibold text-center">
            You've completed the challenge! Points will be credited shortly.
          </div>
        )}
      </div>
      
      {/* Camera component for taking photos */}
      <CameraCircle
        ref={cameraCircleRef}
        size={320}
        frozenPhoto={photoAnim.phase === 'frozen' || photoAnim.phase === 'animating' ? photoAnim.dataUrl : null}
        disabled={photoAnim.phase !== 'idle'}
        showRing={photoAnim.phase === 'frozen' || photoAnim.phase === 'animating'}
      />
      {/* Row of capture and upload buttons */}
      <div className="relative my-8 w-full" style={{maxWidth: 320, minHeight: 64, margin: '2rem auto 2rem auto'}}>
        {/* Image upload button (left-aligned) */}
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-gray-200 flex items-center justify-center bg-white text-rose-400 text-2xl focus:outline-none focus:ring-2 focus:ring-rose-300 transition disabled:opacity-40 disabled:cursor-not-allowed"
          style={{transform: 'translateY(-50%)'}} // for Safari support
          onClick={() => fileRef.current && fileRef.current.click()}
          disabled={photoAnim.phase !== 'idle'}
          aria-label="Upload Image"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
            <path d="M3 15l5-5c.7-.7 1.8-.7 2.5 0l6.5 6.5" stroke="currentColor" strokeWidth="2" />
            <circle cx="8.5" cy="10.5" r="1.5" fill="currentColor" />
          </svg>
        </button>
        {/* Pink record/capture button (centered absolutely) */}
        <button
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center border-4 border-white focus:outline-none focus:ring-2 focus:ring-rose-300 transition ${photoAnim.phase !== 'idle' ? 'opacity-40 cursor-not-allowed' : ''}`}
          style={{transform: 'translate(-50%, -50%)'}} // for Safari support
          onClick={async () => {
            if (photoAnim.phase !== 'idle' || !cameraCircleRef.current || !cameraCircleRef.current.capturePhoto) return;
            const dataUrl = await cameraCircleRef.current.capturePhoto();
            if (!dataUrl) return;
            setPhotoAnim({ phase: 'frozen', dataUrl });
            setTimeout(() => {
              setPhotoAnim(anim => ({ ...anim, phase: 'animating' }));
              setTimeout(() => {
                setPhotoAnim({ phase: 'idle', dataUrl: null });
                onUpload(todayStr, { url: dataUrl, file: null, ts: Date.now(), fromCamera: true });
              }, 1400);
            }, 400);
          }}
          aria-label="Capture Photo"
          disabled={photoAnim.phase !== 'idle'}
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2.5" fill="#f87171" />
            <circle cx="12" cy="12" r="5" fill="white" />
          </svg>
        </button>
      </div>
      {/* Hidden image upload input (for upload button above) */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files[0];
          if (!file) return;
          const url = URL.createObjectURL(file);
          onUpload(todayStr, { url, file, ts: Date.now(), fromCamera: false });
        }}
      />
      
      {/* Calendar and progress section */}
      <div className="mt-6">
        {/* Selected date image preview */}
        {selectedDate && uploads[selectedDate] && (
          <div className="flex flex-col items-center mb-4 animate-fadein">
            <img src={uploads[selectedDate].url} alt="Upload" className="w-32 h-32 rounded-xl object-cover mb-1" />
            <span className="text-xs text-gray-500">Uploaded {new Date(uploads[selectedDate].ts).toLocaleString()}</span>
          </div>
        )}

        <div className="flex flex-row w-full h-full min-h-[220px]">
          {/* Calendar - left half */}
          <div className="flex flex-col flex-1 w-1/2 min-w-0 pr-2 justify-center">
            {/* Month navigation */}
            <div className="flex items-center justify-center mb-2 gap-2">
              <button
                className={`p-1 rounded-full ${canPrev ? 'bg-rose-100 hover:bg-rose-200' : 'bg-gray-100 cursor-not-allowed'}`}
                disabled={!canPrev}
                onClick={() => setMonthIdx(i => i - 1)}
                aria-label="Previous Month"
              >
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <span className="block font-medium text-gray-700 min-w-[120px] text-center">{monthName}</span>
              <button
                className={`p-1 rounded-full ${canNext ? 'bg-rose-100 hover:bg-rose-200' : 'bg-gray-100 cursor-not-allowed'}`}
                disabled={!canNext}
                onClick={() => setMonthIdx(i => i + 1)}
                aria-label="Next Month"
              >
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2 text-xs">
              {monthDays.map((date, i) => {
                const key = date.toDateString();
                const upload = uploads[key];
                const inChallenge = isChallengeDay(date);
                const isLast = isLastChallengeDay(date);
                const isSelected = selectedDate === key;
                // Animation for today's upload
                const isTodayUpload = key === todayStr && !!todayUpload;
                let bg = 'bg-gray-50';
                let text = 'text-gray-700';
                let font = '';
                if (upload) {
                  bg = 'bg-rose-400';
                  text = 'text-white';
                  font = 'font-bold';
                } else if (inChallenge) {
                  bg = 'bg-rose-50';
                  text = 'text-rose-500';
                  font = 'font-semibold';
                }
                if (isLast) {
                  bg = 'bg-rose-200';
                  font = 'font-bold';
                }
                // Attach ref only to today's cell in current month
                const ref = (key === todayStr && month === today.getMonth() && year === today.getFullYear()) ? calendarCellRef : undefined;
                return (
                  <div
                    key={key}
                    ref={ref}
                    className={`rounded-lg border flex flex-col items-center justify-center aspect-square cursor-pointer ${key === todayStr ? 'border-rose-400' : 'border-gray-200'} ${bg} ${text} ${font} ${isTodayUpload ? 'animate-pop' : ''}`}
                    onClick={() => upload && setSelectedDate(key)}
                  >
                    <span>{date.getDate()}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Vertical divider */}
          <div className="w-px bg-gray-200 mx-2 h-auto min-h-[140px] self-stretch" />
          {/* Progress circle - right half */}
          <div className="flex flex-col flex-1 w-1/2 min-w-0 items-center justify-center pl-2">
            {/* SVG progress circle */}
            <div className="relative w-36 h-36 mb-2">
              <svg className="absolute top-0 left-0" width="140" height="140">
                <circle cx="70" cy="70" r="62" fill="none" stroke="#f3f4f6" strokeWidth="14" />
                <circle
                  cx="70" cy="70" r="62"
                  fill="none"
                  stroke="#f87171"
                  strokeWidth="14"
                  strokeDasharray={2 * Math.PI * 62}
                  strokeDashoffset={2 * Math.PI * 62 * (1 - percent / 100)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.5s' }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-rose-500">{percent}%</span>
            </div>
            {/* Days remaining indicator */}
            <div className="mt-1 text-gray-700 font-semibold text-base">
              {Math.max(0, totalDays - completed)} Days Left
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
