import React from 'react';

const UserAddressModal = ({ isOpen, onClose, address }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/2">
        <h2 className="text-2xl mb-4">User Address</h2>
        <p><strong>Name:</strong> {address.name}</p>
        <p><strong>Email:</strong> {address.email}</p>
        <p><strong>Address:</strong> {address.address}</p>
        <p><strong>City:</strong> {address.city}</p>
        <p><strong>State:</strong> {address.state}</p>
        <p><strong>Zip Code:</strong> {address.zipCode}</p>
        <p><strong>Country:</strong> {address.country}</p>
        <p><strong>Phone Number:</strong> {address.phoneNumber}</p>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default UserAddressModal;
