import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { OrderContext } from '../../contextApi/Orders';
import axios from 'axios';
import UserAddressModal from './UserAddressModal';
import '../../App.css';
import { RotatingLines } from 'react-loader-spinner';
import { Toaster, toast } from 'react-hot-toast';
import CustomEmailModal from './CustomEmailModal'; // Import modal for custom email input

const Orders = () => {
  const { orders, fetchAllOrders, loading, error } = useContext(OrderContext);
  const [selectedOrder, setSelectedOrder] = useState(null); // Store the entire order object for better flexibility
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isCustomEmailModalOpen, setIsCustomEmailModalOpen] = useState(false);
  const [customTemplate, setCustomTemplate] = useState('');

  useEffect(() => {
    fetchAllOrders(); // Fetch orders when the component mounts
  }, []);

  // Handle status update including custom email for cancellation
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const payload = { status: newStatus };
      if (newStatus === 'Cancelled' && customTemplate) {
        payload.customTemplate = customTemplate;
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
      toast.error('Error fetching user address');
    }
  };

  // Format price for display
  const formatPrice = (price) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);

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
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
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

      {/* Custom Email Modal */}
      <CustomEmailModal
        isOpen={isCustomEmailModalOpen}
        onClose={() => setIsCustomEmailModalOpen(false)}
        onSave={(emailMessage) => {
          setCustomTemplate(emailMessage); // Save the custom email message
          handleStatusChange(selectedOrder._id, 'Cancelled'); // Update status after custom email input
        }}
      />

      <Toaster />
    </div>
  );
};

export default Orders;
