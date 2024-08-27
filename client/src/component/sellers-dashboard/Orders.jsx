import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { OrderContext } from '../../contextApi/Orders';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserAddressModal from './UserAddressModal'; // Import the modal component

const Orders = () => {
  const { orders, fetchAllOrders, loading, error } = useContext(OrderContext);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [status, setStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleStatusChange = async (orderId) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_APP_BACKEND_BASEURL}/order/admin/${orderId}`,
        { status },
        { withCredentials: true }
      );
      fetchAllOrders();
    } catch (err) {
      console.error('Error updating order status:', err.message);
    }
  };

  const handleSelectChange = (orderId, newStatus) => {
    setSelectedOrderId(orderId);
    setStatus(newStatus);
  };

  const fetchUserAddress = async (orderId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/user/address/${orderId}`);
      setUserAddress(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching user address:', error.message);
    }
  };

  const navigateToUserDetails = (orderId) => {
    fetchUserAddress(orderId);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Admin Orders</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="w-full bg-gray-100">
            <th className="py-2 px-4 text-left">Order ID</th>
            <th className="py-2 px-4 text-left">User</th>
            <th className="py-2 px-4 text-left">Total Amount</th>
            <th className='py-2 px-4 text-left'>Qty</th>
            <th className='py-2 px-4 text-left'>Color</th>
            <th className='py-2 px-4 text-left'>Size</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id} className="border-t">
              <td className="py-2 px-4">{order._id}</td>
              <td
                className="py-2 px-4 cursor-pointer"
                onClick={() => navigateToUserDetails(order.shippingAddress._id)}
              >
                {order.shippingAddress.name}
              </td>
              <td className="py-2 px-4">{formatPrice(order.price)}</td>
              <td className='py-2 px-4'>{order.quantity}</td>
              <td className='py-2 px-4'>{order.color}</td>
              <td className='py-2 px-4'>{order.size}</td>
              <td className="py-2 px-4">
                <select
                  value={selectedOrderId === order._id ? status : order.status}
                  onChange={(e) => handleSelectChange(order._id, e.target.value)}
                  onBlur={() => handleStatusChange(order._id)}
                  className="border p-1 rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              <td className="py-2 px-4">
                <button
                  onClick={() => navigateToUserDetails(order.shippingAddress._id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  View User
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <UserAddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        address={userAddress}
      />
    </div>
  );
}

export default Orders;
