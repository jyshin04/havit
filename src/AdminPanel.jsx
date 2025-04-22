import React from "react";

export default function AdminPanel({ joined, progress, completions, points, onCreditPoints }) {
  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-2xl  p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-900">Admin Panel</h2>
      {Object.keys(joined).length === 0 && <div className="text-gray-500">No joined challenges yet.</div>}
      {Object.entries(joined).map(([id, challenge]) => (
        <div key={id} className="mb-6 border-b pb-4 last:border-b-0 last:pb-0">
          <h3 className="font-semibold text-gray-800">{challenge.product}</h3>
          <div className="text-sm text-gray-600 mb-1">Duration: {challenge.duration}</div>
          <div className="text-sm text-gray-600 mb-1">Completed: {completions[id] ? "Yes" : "No"}</div>
          <div className="text-sm text-gray-600 mb-2">Points Credited: {points[id] ? points[id] : 0}</div>
          <button
            className={`px-3 py-1 rounded text-white text-sm font-semibold  transition ${completions[id] && !points[id] ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'}`}
            disabled={!(completions[id] && !points[id])}
            onClick={() => onCreditPoints(id)}
          >
            Credit Points
          </button>
        </div>
      ))}
    </div>
  );
}
