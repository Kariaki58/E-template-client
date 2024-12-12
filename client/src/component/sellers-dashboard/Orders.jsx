// order management dashboard for admin
import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { OrderContext } from '../../contextApi/Orders';
import axios from 'axios';
import UserAddressModal from './UserAddressModal';
import '../../App.css';
import { RotatingLines } from 'react-loader-spinner';
import { Toaster, toast } from 'react-hot-toast';

const Orders = () => {
  const { orders, fetchAllOrders, loading, error } = useContext(OrderContext);
  const [selectedOrder, setSelectedOrder] = useState(null); // Store the entire order object
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isCustomEmailModalOpen, setIsCustomEmailModalOpen] = useState(false);
  const [customTemplate, setCustomTemplate] = useState('');
  const [statusLoading, setStatusLoading] = useState(false); 
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10; // Set the number of orders per page

  useEffect(() => {
    fetchAllOrders(); // Fetch orders when the component mounts
  }, []);

  const closeModal = () => {
    setIsAddressModalOpen(false)
  }

  // Calculate the current orders to display based on the current page
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle status update, including custom email for cancellation
  const handleStatusChange = async (orderId, newStatus, customTemplate = '') => {
    setStatusLoading(true); // Start the loader
    try {
      const payload = { status: newStatus };
      if (newStatus === 'Cancelled' && customTemplate) {
        payload.customTemplate = customTemplate; // Send custom template for cancellation
      }
      const localtoken = localStorage.getItem('_auth')
      await axios.patch(
        `${import.meta.env.VITE_APP_BACKEND_BASEURL}/order/admin/${orderId}`,
        payload,
        { headers: { 'Authorization': `Bearer ${localtoken}` } }
      );
      fetchAllOrders(); // Refetch orders after update
      toast.success('Order status updated successfully');
    } catch (err) {
      toast.error(
        err.response && err.response.data ? err.response.data.error : 'Error updating order status'
      );
    } finally {
      setStatusLoading(false); // Stop the loader
      setCustomTemplate(''); // Reset custom template
    }
  };

  // Handle selecting a status from dropdown
  const handleSelectChange = (order) => (e) => {
    const newStatus = e.target.value;
    setSelectedOrder(order); // Set the selected order for modals and actions

    if (newStatus === 'Cancelled') {
      const confirmCancel = window.confirm('Are you sure you want to cancel this order?');
      if (confirmCancel) {
        setIsCustomEmailModalOpen(true); // Open custom email modal for cancellation
      }
    } else {
      handleStatusChange(order._id, newStatus); // Directly update the status for other options
    }
  };

  // Fetch user address and open modal
  const fetchUserAddress = async (order) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/user/address/${order.shippingAddress._id}`);
      
      setSelectedOrder({ ...order, address: response.data }); // Set selected order with address
      setIsAddressModalOpen(true); // Open address modal
    } catch (err) {
      toast.error(err.response && err.response.data ? err.response.data.error : 'Error fetching user address');
    }
  };

  // Format price for display
  const formatPrice = (price) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);

  // Close custom email modal
  const onClose = () => {
    setIsCustomEmailModalOpen(false);
  };

  // Handle saving and sending the custom email
  const handleSave = () => {
    if (customTemplate.trim() === '') {
      alert('Please enter a message');
      return;
    }
    handleStatusChange(selectedOrder._id, 'Cancelled', customTemplate);
    onClose();
  };

  // Loading state
  if (loading)
    return (
      <div className="flex justify-center items-center mt-20">
        <RotatingLines
          visible={true}
          height="96"
          width="96"
          color="grey"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
        />
      </div>
    );

  // Error state
  if (error) return <p>Error: {error}</p>;

  // Pagination buttons
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mb-10 custom-scrollbar w-full">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Admin Orders</h1>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse overflow-x-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left whitespace-nowrap text-gray-800">Product Name</th>
              <th className="py-2 px-4 text-left whitespace-nowrap text-gray-800">User</th>
              <th className="py-2 px-4 text-left whitespace-nowrap text-gray-800">Total Amount</th>
              <th className="py-2 px-4 text-left whitespace-nowrap text-gray-800">Qty</th>
              <th className="py-2 px-4 text-left whitespace-nowrap text-gray-800">Color</th>
              <th className="py-2 px-4 text-left whitespace-nowrap text-gray-800">Size</th>
              <th className="py-2 px-4 text-left whitespace-nowrap text-gray-800">Status</th>
              <th className="py-2 px-4 text-left whitespace-nowrap text-gray-800">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="py-2 px-4 whitespace-nowrap text-gray-700">{order.productName}</td>
                <td
                  className="py-2 px-4 cursor-pointer underline whitespace-nowrap text-gray-700"
                  onClick={() => fetchUserAddress(order)}
                >
                  {order.shippingAddress.name}
                </td>
                <td className="py-2 px-4 whitespace-nowrap text-gray-700">{formatPrice(order.price)}</td>
                <td className="py-2 px-4 whitespace-nowrap text-gray-700">{order.quantity}</td>
                <td className="py-2 px-4 whitespace-nowrap text-gray-700">{order.color}</td>
                <td className="py-2 px-4 whitespace-nowrap text-gray-700">{order.size}</td>
                <td className="py-2 px-4 whitespace-nowrap text-gray-700">
                  <select
                    value={order.status}
                    onChange={handleSelectChange(order)}
                    className="border p-2 rounded text-gray-700"
                    disabled={statusLoading} // Disable dropdown during loading
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  {statusLoading && selectedOrder?._id === order._id && (
                    <div className="ml-2 inline-block">
                      <RotatingLines
                        visible={true}
                        height="20"
                        width="20"
                        color="grey"
                        strokeWidth="5"
                        animationDuration="0.75"
                        ariaLabel="rotating-lines-loading"
                      />
                    </div>
                  )}
                </td>
                <td className="py-2 px-4 whitespace-nowrap text-gray-700">
                  <button
                    onClick={() => fetchUserAddress(order)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    View User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-4 py-2 border ${
              currentPage === number ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
            }`}
          >
            {number}
          </button>
        ))}
      </div>

      {/* Address Modal */}
      {isAddressModalOpen && selectedOrder && (
        <UserAddressModal
          isAddressModalOpen
          selectedOrder={selectedOrder.shippingAddress}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default Orders;
