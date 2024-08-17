import React, { useState } from 'react';
import { IoStarSharp } from 'react-icons/io5';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const ReviewForm = ({ setWriteReview, productId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    // Validate inputs
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    // Create form data to send to the server
    const formData = new FormData();
    formData.append('rating', rating);
    formData.append('comment', comment);
    formData.append('name', name);
    formData.append('email', email);
    if (file) {
      formData.append('file', file);
    }
    // send the data to the backend
  };

  const handleCancel = () => {
    // Clear form
    setRating(0);
    setComment('');
    setName('');
    setEmail('');
    setFile(null);
    setWriteReview(false);
  };

  return (
    <div className="w-full max-w-lg p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">
        Submit Your Review
      </h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <form onSubmit={handleSubmit}>
        {/* Rating Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex">
            {[...Array(5)].map((_, index) => (
              <IoStarSharp
                key={index}
                className={`text-3xl cursor-pointer transition-colors ${
                  index < rating ? 'text-yellow-500' : 'text-gray-300'
                }`}
                onClick={() => handleRatingChange(index + 1)}
                aria-label={`Rate ${index + 1} stars`}
                role="button"
              />
            ))}
          </div>
        </div>

        {/* Comment Section */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="comment"
          >
            Comment
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Write your review here..."
            required
          />
        </div>

        {/* Optional File Upload */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="file-upload"
          >
            Upload Picture (Optional)
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-gray-700 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-200 hover:file:bg-gray-300 transition-colors"
          />
          {file && (
            <div className="mt-2 flex items-center">
              <span className="text-sm text-gray-700">{file.name}</span>
              <AiOutlineCloseCircle
                className="ml-2 text-red-500 cursor-pointer hover:text-red-600 transition-colors"
                onClick={() => setFile(null)}
                aria-label="Remove uploaded file"
                role="button"
              />
            </div>
          )}
        </div>

        {/* User Info Section */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Your Name"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Your Email"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Submit Review
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
