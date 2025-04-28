// Central challenge data store for the app
// Note: This is in-memory and will reset on page reload. For persistence, use a backend or localStorage.

let challenges = [
  {
    id: 1,
    product: "Shiseido White Lucent Brightening Gel Cream",
    points: 100,
    image: "/shiseido.png",
    backgroundImage: "/shiseido-background.webp",
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
    backgroundImage: "/medicube-background.jpg",
    description: "1 month | Apply 1-2 times daily.",
    reward: "Earn 500 points",
    photoRequirement: "Photo after each use",
    duration: "1 month",
    likes: "4.4k",
    rating: 4.5,
    productDesc: "Niacinamide & Freeze-Dried Hydrolyzed Collagen - Boosts skin's barrier hydration and gives 24h Glow & Lifted Look - Korean skincare.",
    points: 100
  },
  {
    id: 3,
    product: "Paula's Choice CLEAR Back & Body Exfoliating Acne Spray",
    image: "/paula.png",
    backgroundImage: "/paula-background.avif",
    description: "2 months | Use twice daily.",
    reward: "$15 refund if expectations not met",
    photoRequirement: "Daily back/shoulder photo",
    duration: "2 months",
    likes: "2.9k",
    rating: 4.2,
    productDesc: "2% Salicylic Acid spray for body and back acne. Clears breakouts, unclogs pores, and soothes redness for smoother skin.",
    points: 100
  },
  {
    id: 4,
    product: "Amazon Basic Care Hair Regrowth Treatment",
    image: "/amazon.png",
    backgroundImage: "/amazon-background.png",
    description: "3 months | Apply twice daily.",
    reward: "Earn 1000 points",
    photoRequirement: "Weekly scalp photo",
    duration: "3 months",
    likes: "1.5k",
    rating: 4.0,
    productDesc: "Minoxidil topical solution for hair regrowth. Clinically proven to help regrow hair on the scalp for both men and women.",
    points: 100
  }
];

export function getChallenges() {
  return challenges;
}

export function addChallenge(newChallenge) {
  // id is auto-generated as next integer
  const nextId = challenges.length > 0 ? Math.max(...challenges.map(c => c.id)) + 1 : 1;
  challenges.push({ ...newChallenge, id: nextId });
}

export function removeChallenge(id) {
  const idx = challenges.findIndex(c => c.id === id);
  if (idx !== -1) challenges.splice(idx, 1);
}

export function updateChallenge(updatedChallenge) {
  const idx = challenges.findIndex(c => c.id === updatedChallenge.id);
  if (idx !== -1) challenges[idx] = { ...challenges[idx], ...updatedChallenge };
}
