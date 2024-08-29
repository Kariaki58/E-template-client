import React, { useState, useEffect } from 'react';
import { IoStarSharp } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import cute_gril from '/assets/image-open.jpeg'
import axios from 'axios';


const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(2);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const params = useParams()
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/review/get/${params.id}`);
        if (response.data.error) {
          throw new Error(response.data.error)
        }
        setReviews(response.data.message);
        setTotalPages(Math.ceil(response.data.message.length / reviewsPerPage));
      } catch (err) {
        setError('Failed to load reviews. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-3xl p-4 rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Reviews</h1>
      <div>
        {currentReviews.length === 0 ? (
          <p>No reviews available.</p>
        ) : (
          currentReviews.map((review) => (
            <article key={review._id} className="mb-6 border-b pb-4 border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <div className="flex">
                  {[...Array(review.rating)].map((_, index) => (
                    <IoStarSharp
                      key={index}
                      className={`w-5 h-5 ${
                        index < review.rating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-600">{new Date(review.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-shrink-0 w-12 h-12 overflow-hidden rounded-full bg-gray-200">
                  <img
                    src={cute_gril}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{review.userId.email.split('@')[0]}</p>
                  <p className="mt-2 text-gray-700">{review.comment}</p>
                  {review.reviewImage && (
                    <div className="mt-4 w-32 h-32 overflow-hidden rounded-lg">
                      <img
                        src={review.reviewImage}
                        alt="Review"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
      <div className="flex justify-center mt-6 items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`mr-2 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors ${
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Previous
        </button>
        <span className="mx-4 text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`ml-2 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors ${
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReviewList;
