import React, { useEffect, useState } from "react";
import axios from "axios";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(10); // Number of customers per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_BASEURL}/admin/email`,
          {
            params: {
              page: currentPage,
              limit: perPage,
            },
            withCredentials: true,
          }
        );

        setCustomers(response.data?.emails);
        setTotalPages(response.data?.totalPages); // Assuming the API returns total pages
      } catch (error) {
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, perPage]); // Fetch data whenever the current page changes

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Customer Emails</h1>

      {/* Loading State */}
      {loading && <div className="text-gray-500 text-center">Loading...</div>}

      {/* Error State */}
      {error && <div className="text-red-600 text-center mt-4">{error}</div>}

      {/* Table Section */}
      {!loading && !error && (
        <section className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600 border-b">Email</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600 border-b">Customer Since</th>
                </tr>
              </thead>
              <tbody>
                {customers?.map((customer) => (
                  <tr key={customer.email} className="hover:bg-gray-50 transition duration-200">
                    <td className="py-4 px-6 text-sm text-gray-700 border-b">{customer.email}</td>
                    <td className="py-4 px-6 text-sm text-gray-700 border-b">{customer.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-l-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-r-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Customer;
