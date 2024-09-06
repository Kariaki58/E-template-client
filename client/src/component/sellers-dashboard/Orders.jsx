import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { OrderContext } from '../../contextApi/Orders';
import axios from 'axios';
import UserAddressModal from './UserAddressModal';
import '../../App.css';
import { RotatingLines } from 'react-loader-spinner';
import 'react-quill/dist/quill.snow.css';
import { Toaster, toast } from 'react-hot-toast';

const Orders = () => {
  const { orders, fetchAllOrders, loading, error } = useContext(OrderContext);
  const [selectedOrder, setSelectedOrder] = useState(null); // Store the entire order object
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isCustomEmailModalOpen, setIsCustomEmailModalOpen] = useState(false);
  const [customTemplate, setCustomTemplate] = useState('');
  const [statusLoading, setStatusLoading] = useState(false); // Track status update loading

  useEffect(() => {
    fetchAllOrders(); // Fetch orders when the component mounts
  }, []);

  // Handle status update, including custom email for cancellation
  const handleStatusChange = async (orderId, newStatus, customTemplate = '') => {
    setStatusLoading(true); // Start the loader
    try {
      const payload = { status: newStatus };
      if (newStatus === 'Cancelled' && customTemplate) {
        payload.customTemplate = customTemplate; // Send custom template for cancellation
      }
      await axios.patch(
        `${import.meta.env.VITE_APP_BACKEND_BASEURL}/order/admin/${orderId}`,
        payload,
        { withCredentials: true }
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
    handleStatusChange(selectedOrder._id, 'Cancelled', customTemplate); // Pass orderId, status, and custom template
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

  return (
    <div className="mb-10 custom-scrollbar w-full">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Admin Orders</h1>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse overflow-x-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left whitespace-nowrap text-gray-800">Order ID</th>
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
            {orders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="py-2 px-4 whitespace-nowrap text-gray-700">{order._id}</td>
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

      {/* User Address Modal */}
      <UserAddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        address={selectedOrder?.address}
      />

      {isCustomEmailModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-11/12 max-w-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Custom Email for Cancelled Order</h2>
            <textarea
              value={customTemplate}
              onChange={(e) => setCustomTemplate(e.target.value)}
              placeholder="Enter the email message"
              className="w-full border p-4"
            ></textarea>
            <div className="flex justify-end mt-4">
              <button
                onClick={onClose}
                className="mr-2 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                Save & Send
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
};

export default Orders;
