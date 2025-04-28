import React, { useState } from "react";
import AddChallengePage from "./AddChallengePage";
import { getChallenges, removeChallenge } from "./challengesData";
import EditChallengePage from "./EditChallengePage";

export default function AdminPage({ onLogout }) {
  const [showAdd, setShowAdd] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [refresh, setRefresh] = useState(0); // force re-render on change
  const [showEdit, setShowEdit] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const challenges = getChallenges();

  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this challenge? This cannot be undone.")) {
      removeChallenge(id);
      setRefresh(r => r + 1);
    }
  }

  if (showAdd) {
    return <AddChallengePage onBack={() => setShowAdd(false)} onChallengeAdded={() => { setShowAdd(false); setRefresh(r => r + 1); }} />;
  }

  if (showRemove) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
          <button onClick={() => setShowRemove(false)} className="mb-4 border border-black text-black bg-white px-4 py-1 rounded hover:bg-black hover:text-white transition">&larr; Back to Admin Page</button>
          <h2 className="text-2xl font-bold mb-6 text-center">Remove Challenge</h2>
          <ul className="divide-y divide-gray-200">
            {challenges.length === 0 && <li className="text-gray-400 text-center py-8">No challenges available.</li>}
            {challenges.map(ch => (
              <li key={ch.id} className="py-4 flex items-center gap-4">
                <img src={ch.image} alt={ch.product} className="w-14 h-14 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{ch.product}</div>
                  <div className="text-xs text-gray-500">Duration: {ch.duration}</div>
                </div>
                <button
                  className="border border-black text-black bg-white px-4 py-1 rounded hover:bg-black hover:text-white transition"
                  onClick={() => handleDelete(ch.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (showEdit && !editTarget) {
    // Show list of challenges to edit
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
          <button onClick={() => setShowEdit(false)} className="mb-4 border border-black text-black bg-white px-4 py-1 rounded hover:bg-black hover:text-white transition">&larr; Back to Admin Page</button>
          <h2 className="text-2xl font-bold mb-6 text-center">Edit Challenge</h2>
          <ul className="divide-y divide-gray-200">
            {challenges.length === 0 && <li className="text-gray-400 text-center py-8">No challenges available.</li>}
            {challenges.map(ch => (
              <li key={ch.id} className="py-4 flex items-center gap-4">
                <img src={ch.image} alt={ch.product} className="w-14 h-14 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{ch.product}</div>
                  <div className="text-xs text-gray-500">Duration: {ch.duration}</div>
                </div>
                <button
                  className="border border-black text-black bg-white px-4 py-1 rounded hover:bg-black hover:text-white transition"
                  onClick={() => setEditTarget(ch)}
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (showEdit && editTarget) {
    return <EditChallengePage challenge={editTarget} onBack={() => setEditTarget(null)} onEdited={() => { setEditTarget(null); setRefresh(r => r + 1); }} />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-8">Admin Page</h1>
      <button
        className="border border-black text-black bg-white font-bold py-2 px-6 rounded-lg hover:bg-black hover:text-white transition mb-4"
        onClick={() => setShowAdd(true)}
      >
        Add Challenge
      </button>
      <button
        className="border border-black text-black bg-white font-bold py-2 px-6 rounded-lg hover:bg-black hover:text-white transition mb-4"
        onClick={() => setShowRemove(true)}
      >
        Remove Challenge
      </button>
      <button
        className="border border-black text-black bg-white font-bold py-2 px-6 rounded-lg hover:bg-black hover:text-white transition mb-6"
        onClick={() => setShowEdit(true)}
      >
        Edit Challenge
      </button>
      <button
        className="border border-black text-black bg-white font-bold py-2 px-6 rounded-lg hover:bg-black hover:text-white transition-all duration-150"
        onClick={onLogout}
      >
        Log Out
      </button>
    </div>
  );
}
