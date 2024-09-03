import React, { useState } from 'react';
import { IoStarSharp } from 'react-icons/io5';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import axios from 'axios';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import { Toaster, toast } from 'react-hot-toast';


const ReviewForm = ({ setWriteReview, productId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const isAuthenticated = useIsAuthenticated();

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Reuse the uploadFile function from your product upload page
  const uploadFile = async (file, type, timestamp, signature) => {
    const folder = type === 'image' ? 'images' : 'videos';
    const data = new FormData();
    data.append('file', file);
    data.append('timestamp', timestamp);
    data.append('signature', signature);
    data.append('api_key', import.meta.env.VITE_APP_CLOUDINARY_API_KEY);
    data.append('folder', folder);

    try {
      const cloudName = import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME;
      const resourceType = type === 'image' ? 'image' : 'video';
      const api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const res = await axios.post(api, data);
      const { secure_url } = res.data;
      return secure_url;
    } catch (error) {
      toast.error('Error uploading file. Please try again.');
      return null;
    }
  };

  const getSignatureForUpload = async (folder) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_BASEURL}/api/gensignature`,
        { folder },
        { withCredentials: true }
      );
      if (res.data.error) throw new Error(res.data.error);
      return res.data;
    } catch (error) {
      toast.error('Error generating upload signature.');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (rating === 0) {
      toast.error('Please select a rating.');
      setLoading(false);
      return;
    }
  
    try {
      let imageUrl = null;
  
      if (file) {
        const { timestamp, signature } = await getSignatureForUpload('images');
        imageUrl = await uploadFile(file, 'image', timestamp, signature);
        if (!imageUrl) {
          setLoading(false);
          return;
        }
      }
  
      const reviewData = {
        rating,
        comment,
        imageUrl,
        productId,
      };
  
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_BASEURL}/review/add`,
        reviewData,
        { withCredentials: true }
      );
    
      if (response.data.error) {
        toast.error(response.data.error || 'An error occurred while submitting the review.');
      } else {
        toast.success(response.data.message || 'Review submitted successfully!');
        setRating(0);
        setComment('');
        setFile(null);
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = () => {
    setRating(0);
    setComment('');
    setFile(null);
    setWriteReview(false);
  };

  return (
    <div className="w-full max-w-lg p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">
        Submit Your Review
      </h2>
      {isAuthenticated && (
        <>
          <form onSubmit={handleSubmit}>
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
            <div className="flex justify-between">
              <button
                type="submit"
                className="px-4 py-2 bg-gray-950 text-white rounded-lg hover:bg-gray-700 transition-colors"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Review'}
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
        </>
      )}
      <Toaster />
    </div>
  );
};

export default ReviewForm;
