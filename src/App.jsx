import React, { useState } from "react";
import ChallengeList from "./ChallengeList";
import SignUp from "./SignUp";
import Login from "./Login";
import TopNav from "./TopNav";
import ChallengeDetail from "./ChallengeDetail";
import Dashboard from "./Dashboard";
import BottomNav from "./BottomNav";
import LeftNav from "./LeftNav";
import OpeningPage from "./OpeningPage";
import AdminPage from "./AdminPage";
import { getChallenges } from "./challengesData";

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

// sampleChallenges moved to challengesData.js


export default function App() {
  // Challenge data state
  const [challenges, setChallenges] = useState(getChallenges());

  // Remove a challenge and all associated data
  function handleLeaveChallenge(challengeId) {
    if (!window.confirm("Are you sure you want to leave this challenge? This will delete all your past records for this challenge and cannot be undone.")) return;
    setJoined(prev => { const copy = { ...prev }; delete copy[challengeId]; return copy; });
    setProgress(prev => { const copy = { ...prev }; delete copy[challengeId]; return copy; });
    setCompletion(prev => { const copy = { ...prev }; delete copy[challengeId]; return copy; });
    setPoints(prev => { const copy = { ...prev }; delete copy[challengeId]; return copy; });
    if (showDashboard && showDashboard.id === challengeId) setShowDashboard(null);
  }
  const [user, setUser] = React.useState(() => {
    const saved = localStorage.getItem("havit_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [showOpening, setShowOpening] = useState(true);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [selected, setSelected] = useState(null);
  const [joined, setJoined] = useState({}); // { [challengeId]: challengeObj }
  const [progress, setProgress] = useState({}); // { [challengeId]: { [date]: { url, file, ts } } }
  const [showDashboard, setShowDashboard] = useState(null); // challenge object
  const [completion, setCompletion] = useState({}); // { [challengeId]: true }
  const [points, setPoints] = useState({}); // { [challengeId]: number }
  
  const [tab, setTab] = useState("home"); // home, record, you

  function handleJoin(challenge) {
    setJoined(j => ({ ...j, [challenge.id]: challenge }));
    setShowDashboard(challenge);
    setTab("record");
  }

  function handleUpload(challengeId, dateStr, upload) {
    setProgress(prev => {
      const prevChallenge = prev[challengeId] || {};
      let newChallenge;
      if (upload === null) {
        // Deletion: remove the date's upload
        newChallenge = { ...prevChallenge };
        delete newChallenge[dateStr];
      } else {
        newChallenge = { ...prevChallenge, [dateStr]: upload };
      }
      return {
        ...prev,
        [challengeId]: newChallenge
      };
    });
  }

  function handleComplete(challengeId) {
    setCompletion(prev => ({ ...prev, [challengeId]: true }));
  }

  if (showOpening) {
    return <OpeningPage onFinish={() => setShowOpening(false)} />;
  }
  if (!user) {
    return authMode === 'login' ? (
      <Login onLogin={setUser} onSwitchMode={() => setAuthMode('signup')} />
    ) : (
      <SignUp onSignUp={setUser} onSwitchMode={() => setAuthMode('login')} />
    );
  }
  // Admin user route
  if (user.isAdmin) {
    return <AdminPage onLogout={handleLogout} />;
  }
  function handleLogout() {
    setUser(null);
    localStorage.removeItem("havit_user");
  }
  return (
    <>
      {/* Logout button for desktop */}
      <button
        className="fixed top-4 right-4 z-50 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg shadow transition hidden lg:block"
        onClick={handleLogout}
      >
        Log Out
      </button>
      {showOpening && <OpeningPage onFinish={() => setShowOpening(false)} />}
      <div className="min-h-screen bg-[#f1f1f1] flex lg:flex-row" style={{ filter: showOpening ? 'blur(2px)' : 'none', pointerEvents: showOpening ? 'none' : 'auto' }}>
        {/* Sidebar for desktop */}
        <LeftNav current={tab} onNavigate={setTab} />
        <div className="flex-1 flex flex-col min-h-screen lg:ml-56">
          <main className="flex flex-col items-center justify-start py-8 px-2 lg:px-12 lg:py-12 max-w-5xl mx-auto w-full">
            {tab === "record" ? (
              showDashboard ? (
                <>
                  <Dashboard
                    challenge={showDashboard}
                    progress={progress[showDashboard.id]}
                    onUpload={(dateStr, upload) => handleUpload(showDashboard.id, dateStr, upload)}
                    completion={completion[showDashboard.id]}
                    onComplete={() => handleComplete(showDashboard.id)}
                    joinedChallenges={Object.values(joined)}
                    onSwitchChallenge={c => setShowDashboard(c)}
                    onLeaveChallenge={handleLeaveChallenge}
                  />
                  <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-md mx-auto justify-center">
                    <button
                      className="flex-1 px-4 py-2 rounded bg-rose-100 text-rose-600 font-bold shadow hover:bg-rose-200 transition"
                      onClick={() => { setShowDashboard(null); setTab('home'); }}
                    >
                      Back to Challenges
                    </button>
                    <button
                      className="flex-1 px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 transition"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to leave this challenge? This will delete all your past records for this challenge and cannot be undone.')) {
                          handleLeaveChallenge(showDashboard.id);
                        }
                      }}
                    >
                      Leave Challenge
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-gray-500 mt-20 text-center">Join a challenge to start recording your progress!</div>
              )
            ) : tab === "you" ? (
              <div className="mt-16 text-center text-gray-700">
                <h2 className="text-2xl font-semibold mb-4">Your Challenges</h2>
                {/* User Points Display */}
                <div className="mb-4 text-lg text-rose-500 font-bold">Your Points: {Object.keys(completion).reduce((sum, id) => {
                  if (completion[id]) {
                    const ch = challenges.find(c => String(c.id) === String(id));
                    return sum + (ch ? (parseInt(ch.points, 10) || 0) : 0);
                  }
                  return sum;
                }, 0)}</div>
                {Object.keys(joined).length === 0 ? (
                  <div className="text-gray-400">You haven't joined any challenges yet.</div>
                ) : (
                  <ul className="space-y-4">
                    {Object.entries(joined).map(([id, challenge]) => (
                      <li key={id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
                        <img src={challenge.image} alt={challenge.product} className="w-16 h-16 object-cover rounded-lg" />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{challenge.product}</div>
                          <div className="text-xs text-gray-500">Duration: {challenge.duration}</div>
                          <div className="text-xs text-gray-500">Current Progress: {(() => {
                            const challengeProgress = progress[id] || {};
                            const { start, end } = getChallengeRange(challenge.duration);
                            const totalDays = Math.round((end - start) / (1000*60*60*24)) + 1;
                            const completed = Object.keys(challengeProgress).length;
                            return Math.round((completed / totalDays) * 100);
                          })()}%</div>
                          <div className="text-xs text-gray-500">Points: {challenge.points}</div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            className="px-3 py-1 rounded bg-rose-100 text-rose-600 text-xs font-semibold hover:bg-rose-200"
                            onClick={() => { setShowDashboard(challenge); setTab('record'); }}
                          >
                            View
                          </button>
                          <button
                            className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-300"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to leave this challenge? This will delete all your past records for this challenge and cannot be undone.')) {
                                handleLeaveChallenge(id);
                              }
                            }}
                          >
                            Leave
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              !selected ? (
                <>
                  <TopNav />
                  <ChallengeList
                    challenges={challenges}
                    onSelect={setSelected}
                  />
                </>
              ) : (
                <ChallengeDetail
                  challenge={selected}
                  onBack={() => setSelected(null)}
                  onJoin={() => handleJoin(selected)}
                  joined={!!joined[selected.id]}
                />
              )
            )}
          </main>
          <footer className="mt-auto py-8 text-gray-400 text-sm text-center w-full"> {new Date().getFullYear()} Havit. MVP for testing purposes.</footer>
          {/* BottomNav for mobile only */}
          <div className="lg:hidden">
            <BottomNav current={tab} onNavigate={setTab} />
          </div>
        </div>
      </div>
    </>
  );
}

