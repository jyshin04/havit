import React, { useState } from "react";

export default function ChallengeList({ challenges, onSelect }) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDropdown = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-2xl mx-auto mt-12 px-2 md:px-4">
      {challenges.map((challenge) => (
        <div key={challenge.id} className="relative">
          <div className={`bg-white p-6 flex items-center gap-6 transition relative pointer-events-none ${openDropdown === challenge.id ? 'rounded-t-2xl rounded-b-none' : 'rounded-2xl'}`}>
            <img
              src={challenge.image}
              alt={challenge.product}
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div className="flex-1 pointer-events-none pr-16 text-center">
              <h2 className="text-base font-semibold text-gray-900 mb-1">{challenge.product}</h2>
              <p className="text-gray-700 text-xs mb-2">{challenge.description}</p>

            </div>
            <div className="absolute top-0 left-0 h-full" style={{ width: '80%' }}>
              <div
                className="w-full h-full cursor-pointer pointer-events-auto"
                onClick={() => handleDropdown(challenge.id)}
              />
            </div>
            <div className="absolute top-0 right-0 h-full flex items-center justify-center" style={{ width: '20%' }}>
              <div
                className="w-full h-full flex items-center justify-center cursor-pointer pointer-events-auto"
                onClick={(e) => { e.stopPropagation(); onSelect(challenge); }}
              >
                <svg className="w-7 h-7 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
                </svg>
              </div>
            </div>
          </div>
          {/* Dropdown below card, in normal flow */}
          <div className="overflow-hidden transition-all duration-300" style={{maxHeight: openDropdown === challenge.id ? 200 : 0, opacity: openDropdown === challenge.id ? 1 : 0}}>
            {openDropdown === challenge.id && (
              <div className="rounded-b-2xl rounded-t-none bg-rose-100 px-6 py-4" style={{marginTop: 0}}>
                <div className="flex items-center gap-3 mb-2">
                  {/* Stars */}
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className={`w-5 h-5 ${challenge.rating >= i ? 'text-rose-400' : 'text-gray-300'}`} fill={challenge.rating >= i ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <polygon points="12,2 15,9 22,9.5 17,14.5 18.5,22 12,18.5 5.5,22 7,14.5 2,9.5 9,9" />
                    </svg>
                  ))}
                  <span className="text-base font-semibold text-gray-900 ml-1">{challenge.rating.toFixed(1)}</span>
                  {/* Likes */}
                  <svg className="w-6 h-6 text-rose-400 ml-4 inline" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span className="text-base font-semibold text-rose-400 ml-1">{challenge.likes}</span>
                </div>
                <div className="text-gray-700 text-sm">{challenge.productDesc}</div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
