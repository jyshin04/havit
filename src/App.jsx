import React, { useState } from "react";
import ChallengeList from "./ChallengeList";
import TopNav from "./TopNav";
import ChallengeDetail from "./ChallengeDetail";
import Dashboard from "./Dashboard";
import BottomNav from "./BottomNav";

const sampleChallenges = [
  {
    id: 1,
    product: "Shiseido White Lucent Brightening Gel Cream",
    image: "/shiseido.png",
    description: "2 months | Apply once daily.",
    reward: "$10 refund if completed",
    photoRequirement: "Upload daily face photo",
    duration: "2 months",
    likes: "3.2k",
    rating: 4.7,
    productDesc: "Brightening gel cream with Sakura and ReNeura Technology+™ for even, luminous skin. Lightweight, deeply hydrating, and suitable for all skin types."
  },
  {
    id: 2,
    product: "medicube Collagen Niacinamide Jelly Cream",
    image: "/medicube.png",
    description: "1 month | Apply 1-2 times daily.",
    reward: "Earn 500 points",
    photoRequirement: "Photo after each use",
    duration: "1 month",
    likes: "4.4k",
    rating: 4.5,
    productDesc: "Niacinamide & Freeze-Dried Hydrolyzed Collagen - Boosts skin's barrier hydration and gives 24h Glow & Lifted Look - Korean skincare."
  },
  {
    id: 3,
    product: "Paula's Choice CLEAR Back & Body Exfoliating Acne Spray",
    image: "/paula.png",
    description: "2 months | Use twice daily.",
    reward: "$15 refund if expectations not met",
    photoRequirement: "Daily back/shoulder photo",
    duration: "2 months",
    likes: "2.9k",
    rating: 4.2,
    productDesc: "2% Salicylic Acid spray for body and back acne. Clears breakouts, unclogs pores, and soothes redness for smoother skin."
  },
  {
    id: 4,
    product: "Amazon Basic Care Hair Regrowth Treatment",
    image: "/amazon.png",
    description: "3 months | Apply twice daily.",
    reward: "Earn 1000 points",
    photoRequirement: "Weekly scalp photo",
    duration: "3 months",
    likes: "1.5k",
    rating: 4.0,
    productDesc: "Minoxidil topical solution for hair regrowth. Clinically proven to help regrow hair on the scalp for both men and women."
  }
];

export default function App() {
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
    setProgress(prev => ({
      ...prev,
      [challengeId]: {
        ...(prev[challengeId] || {}),
        [dateStr]: upload
      }
    }));
  }

  function handleComplete(challengeId) {
    setCompletion(prev => ({ ...prev, [challengeId]: true }));
  }

  return (
    <div className="min-h-screen bg-[#f1f1f1]">

      <main className="flex flex-col items-center justify-start py-8 px-2">
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
              />
              <button
                className="mt-8 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={() => { setShowDashboard(null); setTab("home"); }}
              >
                Back to Challenges
              </button>
            </>
          ) : (
            <div className="text-gray-500 mt-20 text-center">Join a challenge to start recording your progress!</div>
          )
        ) : tab === "you" ? (
          <div className="mt-16 text-center text-gray-700">
            <h2 className="text-2xl font-semibold mb-4">Your Challenges</h2>
            {Object.keys(joined).length === 0 ? (
              <div className="text-gray-400">You haven't joined any challenges yet.</div>
            ) : (
              <ul className="space-y-4">
                {Object.entries(joined).map(([id, challenge]) => (
                  <li key={id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
                    <img src={challenge.image} alt={challenge.product} className="w-16 h-16 object-cover rounded-lg border" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{challenge.product}</div>
                      <div className="text-xs text-gray-500">Duration: {challenge.duration}</div>
                      <div className="text-xs text-gray-500">Completed: {completion[id] ? "Yes" : "No"}</div>
                      <div className="text-xs text-gray-500">Points: {points[id] ? points[id] : 0}</div>
                    </div>
                    <button
                      className="px-3 py-1 rounded bg-rose-100 text-rose-600 text-xs font-semibold hover:bg-rose-200"
                      onClick={() => { setShowDashboard(challenge); setTab("record"); }}
                    >
                      View
                    </button>
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
                challenges={sampleChallenges}
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
      <footer className="mt-auto py-8 text-gray-400 text-sm text-center w-full">© {new Date().getFullYear()} Havit. MVP for testing purposes.</footer>
      <BottomNav current={tab} onNavigate={setTab} />
    </div>
  );
}

