import React, { useState } from "react";
import { addChallenge } from "./challengesData";

export default function AddChallengePage({ onBack, onChallengeAdded }) {
  // Form state
  const [product, setProduct] = useState("");
  const [points, setPoints] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");
  const [photoRequirement, setPhotoRequirement] = useState("");
  const [duration, setDuration] = useState("");
  const [likes, setLikes] = useState("");
  const [rating, setRating] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundPreview, setBackgroundPreview] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Handle image upload and preview
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }

  function handleBackgroundChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setBackgroundImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setBackgroundPreview(reader.result);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Basic validation
    if (!product || !points || !image || !backgroundImage || !description || !reward || !photoRequirement || !duration || !likes || !rating || !productDesc) {
      setError("Please fill out all fields and upload both images.");
      return;
    }
    // For now, store image as a data URL (in-memory only)
    addChallenge({
      product,
      points: Number(points),
      image: imagePreview, // In production, upload to server or CDN
      backgroundImage: backgroundPreview,
      description,
      reward,
      photoRequirement,
      duration,
      likes,
      rating: Number(rating),
      productDesc
    });
    setSuccess(true);
    setError("");
    if (onChallengeAdded) onChallengeAdded();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <button onClick={onBack} className="mb-4 text-rose-500 hover:underline">&larr; Back to Admin Page</button>
        <h2 className="text-3xl font-bold mb-6 text-center">Add New Challenge</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="font-semibold">Product Name</span>
            <span className="text-xs text-gray-500">Example: <b>Shiseido White Lucent Brightening Gel Cream</b></span>
            <input type="text" value={product} onChange={e => setProduct(e.target.value)} className="border rounded px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-semibold">Points</span>
            <span className="text-xs text-gray-500">How many points does this challenge reward? Example: <b>100</b></span>
            <input type="number" value={points} onChange={e => setPoints(e.target.value)} className="border rounded px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-semibold">Product Image</span>
            <span className="text-xs text-gray-500">Upload a product image. Example: <b>/shiseido.png</b> or upload a new one below.</span>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded mt-2" />}
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-semibold">Background Image</span>
            <span className="text-xs text-gray-500">Upload a background image for the challenge detail page. Example: <b>/shiseido-background.webp</b> (should be wide, landscape-oriented, and visually representative of the product or theme).</span>
            <input type="file" accept="image/*" onChange={handleBackgroundChange} />
            {backgroundPreview && <img src={backgroundPreview} alt="Background Preview" className="w-32 h-20 object-cover rounded mt-2" />}
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-semibold">Short Description</span>
            <span className="text-xs text-gray-500">Describe the challenge duration and frequency. Example: <b>2 months | Apply once daily.</b></span>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="border rounded px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-semibold">Reward</span>
            <span className="text-xs text-gray-500">What does the user get if they complete the challenge? Example: <b>$10 refund if completed</b></span>
            <input type="text" value={reward} onChange={e => setReward(e.target.value)} className="border rounded px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-semibold">Photo Requirement</span>
            <span className="text-xs text-gray-500">What kind of photo should the user upload? Example: <b>Upload daily face photo</b></span>
            <input type="text" value={photoRequirement} onChange={e => setPhotoRequirement(e.target.value)} className="border rounded px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-semibold">Duration</span>
            <span className="text-xs text-gray-500">How long does the challenge last? Example: <b>2 months</b></span>
            <input type="text" value={duration} onChange={e => setDuration(e.target.value)} className="border rounded px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-semibold">Likes</span>
            <span className="text-xs text-gray-500">How many likes does the product have? Example: <b>3.2k</b></span>
            <input type="text" value={likes} onChange={e => setLikes(e.target.value)} className="border rounded px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-semibold">Rating</span>
            <span className="text-xs text-gray-500">How is the product rated (0-5)? Example: <b>4.7</b></span>
            <input type="number" step="0.1" min="0" max="5" value={rating} onChange={e => setRating(e.target.value)} className="border rounded px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-semibold">Product Description</span>
            <span className="text-xs text-gray-500">Detailed product description. Example: <b>Brightening gel cream with Sakura and ReNeura Technology+™ for even, luminous skin. Lightweight, deeply hydrating, and suitable for all skin types.</b></span>
            <textarea value={productDesc} onChange={e => setProductDesc(e.target.value)} className="border rounded px-3 py-2" rows={3} />
          </label>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">Challenge added successfully!</div>}
          <button type="submit" className="bg-rose-500 text-white font-bold py-2 rounded-lg hover:bg-rose-600 shadow-md transition-all duration-150">Submit Challenge</button>
        </form>
      </div>
    </div>
  );
}
