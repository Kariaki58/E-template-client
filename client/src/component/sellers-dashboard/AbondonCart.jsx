import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AbandonedCart = () => {
    const [abandonedCarts, setAbandonedCarts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const fetchAbandonedCarts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/abandoned-carts`, {
                    params: { page: currentPage, limit: itemsPerPage },
                    withCredentials: true
                });
                setAbandonedCarts(response.data.carts);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                setError('Error fetching abandoned carts');
            } finally {
                setLoading(false);
            }
        };

        fetchAbandonedCarts();
    }, [currentPage, itemsPerPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className='text-red-700 text-2xl text-center'>{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Abandoned Carts</h1>
            {abandonedCarts.length > 0 ? (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {abandonedCarts.map(cart => (
                                    <tr key={cart._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{cart.userId.name}</div>
                                            <div className="text-sm text-gray-500">{cart.userId.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <ul>
                                                {cart.items.map(item => (
                                                    <li key={item._id} className="text-sm text-gray-900">
                                                        {item.productId.name} ({item.size}, {item.color})
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <ul>
                                                {cart.items.map(item => (
                                                    <li key={item._id} className="text-sm text-gray-900">
                                                        {item.quantity} x ${item.price}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">${cart.totalPrice.toFixed(2)}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between mt-4">
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)} 
                            disabled={currentPage === 1}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Previous
                        </button>
                        <span className="self-center">Page {currentPage} of {totalPages}</span>
                        <button 
                            onClick={() => handlePageChange(currentPage + 1)} 
                            disabled={currentPage === totalPages}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-center text-lg text-gray-700">No abandoned carts found.</p>
            )}
        </div>
    );
};

export default AbandonedCart;
