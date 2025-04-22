import React from "react";

export default function ChallengeDetail({ challenge, onBack, onJoin, joined }) {
  return (
    <div className="w-full min-h-screen mt-0 pb-8 bg-white">
      <button className="mb-4 text-rose-500 hover:text-rose-400 font-semibold hover:underline mt-4 ml-2" onClick={onBack}>&larr; Back to Challenges</button>
      {/* Product Image with pink background */}
      {/* Responsive background image fill for ChallengeDetail */}
      <div className="w-full aspect-[16/9] md:aspect-[2/1] overflow-hidden">
        <img
          src={(() => {
            if (challenge.product.toLowerCase().includes('shiseido')) return '/shiseido-background.webp';
            if (challenge.product.toLowerCase().includes('medicube')) return '/medicube-background.jpg';
            if (challenge.product.toLowerCase().includes("paula")) return '/paula-background.avif';
            if (challenge.product.toLowerCase().includes('amazon')) return '/amazon-background.png';
            return challenge.image;
          })()}
          alt={challenge.product}
          className="w-full h-full object-cover object-center"
        />
      </div>
      {/* Main Content Card */}
      <div className="w-full px-10 md:px-40 pt-8 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1 leading-tight">{challenge.product.replace(/^(.*?)\s+/, '')}</h1>
        <div className="text-base font-medium text-gray-500 mb-3">{challenge.product.split(' ')[0]}</div>
        {/* Rating and Likes Row */}
        <div className="flex items-center gap-2 mb-2">
          {[1,2,3,4,5].map(i => (
            <svg key={i} className={`w-6 h-6 ${challenge.rating >= i ? 'text-rose-400' : 'text-gray-300'}`} fill={challenge.rating >= i ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <polygon points="12,2 15,9 22,9.5 17,14.5 18.5,22 12,18.5 5.5,22 7,14.5 2,9.5 9,9" />
            </svg>
          ))}
          <span className="text-lg font-semibold text-gray-900 ml-1">{challenge.rating.toFixed(1)}</span>
          <svg className="w-6 h-6 text-rose-400 ml-4 inline" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className="text-lg font-semibold text-rose-400 ml-1">{challenge.likes}</span>
        </div>
        {/* Product Description */}
        <div className="text-black text-xs font-light mb-5 leading-snug">{challenge.productDesc}</div>
        {/* Challenge Requirements */}
        <div className="mb-5">
          <div className="font-bold text-rose-500 mb-2">Challenge Requirements:</div>
          <ul className="list-disc list-inside text-gray-700 text-xs font-light space-y-1">
            <li><span className="font-bold">Duration:</span> {challenge.duration}</li>
            <li><span className="font-bold">Instructions:</span> Apply 1-2 times daily / take photo after product appliance / photo has to show your full face</li>
          </ul>
        </div>
        {/* Join Button */}
        <button
          className={`w-full flex justify-between items-center px-12 md:px-40 py-4 rounded-full text-lg font-semibold transition mb-2 ${joined ? 'border-2 border-rose-400 text-rose-500 bg-white cursor-default' : 'bg-rose-500 text-white hover:bg-rose-600'}`}
          onClick={joined ? undefined : onJoin}
          disabled={joined}
        >
          <span>{joined ? "Joined!" : "Buy & Join Challenge"}</span>
          {!joined && <span className="text-base font-semibold">| $15.90</span>}
        </button>
        <div 
          className={`text-center text-gray-400 text-xs mt-1 underline cursor-pointer ${joined ? 'pointer-events-none opacity-60' : ''}`}
          onClick={() => { if (!joined) onJoin(); }}
        >Already Have? Join Challenge</div>
      </div>
    </div>
  );
}
