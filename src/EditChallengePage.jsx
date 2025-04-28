import React, { useState } from "react";
import { updateChallenge } from "./challengesData";

export default function EditChallengePage({ challenge, onBack, onEdited }) {
  // Form state, initialized with current challenge values
  const [product, setProduct] = useState(challenge.product);
  const [points, setPoints] = useState(challenge.points);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(challenge.image);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundPreview, setBackgroundPreview] = useState(challenge.backgroundImage);
  const [description, setDescription] = useState(challenge.description);
  const [reward, setReward] = useState(challenge.reward);
  const [photoRequirement, setPhotoRequirement] = useState(challenge.photoRequirement);
  const [duration, setDuration] = useState(challenge.duration);
  const [likes, setLikes] = useState(challenge.likes);
  const [rating, setRating] = useState(challenge.rating);
  const [productDesc, setProductDesc] = useState(challenge.productDesc);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
    if (!product || !points || !imagePreview || !backgroundPreview || !description || !reward || !photoRequirement || !duration || !likes || !rating || !productDesc) {
      setError("Please fill out all fields and upload both images.");
      return;
    }
    if (!window.confirm("Are you sure you want to save these changes? This will update the challenge for all users.")) return;
    updateChallenge({
      id: challenge.id,
      product,
      points: Number(points),
      image: imagePreview,
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
    if (onEdited) onEdited();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <button onClick={onBack} className="mb-4 border border-black text-black bg-white px-4 py-1 rounded hover:bg-black hover:text-white transition">&larr; Back to List</button>
        <h2 className="text-3xl font-bold mb-6 text-center">Edit Challenge</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="font-semibold">Product Name</span>
            <input type="text" value={product} onChange={e => setProduct(e.target.value)} className="border rounded px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-semibold">Points</span>
            <input type="number" value={points} onChange={e => setPoints(e.target.value)} className="border rounded px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-semibold">Product Image</span>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded mt-2" />}
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-semibold">Background Image</span>
            <input type="file" accept="image/*" onChange={handleBackgroundChange} />
            {backgroundPreview && <img src={backgroundPreview} alt="Background Preview" className="w-32 h-20 object-cover rounded mt-2" />}
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-semibold">Short Description</span>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="border rounded px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-semibold">Reward</span>
            <input type="text" value={reward} onChange={e => setReward(e.target.value)} className="border rounded px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-semibold">Photo Requirement</span>
            <input type="text" value={photoRequirement} onChange={e => setPhotoRequirement(e.target.value)} className="border rounded px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-semibold">Duration</span>
            <input type="text" value={duration} onChange={e => setDuration(e.target.value)} className="border rounded px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-semibold">Likes</span>
            <input type="text" value={likes} onChange={e => setLikes(e.target.value)} className="border rounded px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-semibold">Rating</span>
            <input type="number" step="0.1" min="0" max="5" value={rating} onChange={e => setRating(e.target.value)} className="border rounded px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-semibold">Product Description</span>
            <textarea value={productDesc} onChange={e => setProductDesc(e.target.value)} className="border rounded px-3 py-2" rows={3} />
          </label>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">Challenge updated successfully!</div>}
          <button type="submit" className="border border-black text-black bg-white font-bold py-2 rounded-lg hover:bg-black hover:text-white transition-all duration-150">Save Changes & Upload</button>
        </form>
      </div>
    </div>
  );
}
