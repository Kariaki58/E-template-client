import React, { useState } from 'react';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

const CustomEmailModal = ({ isOpen, onClose, onSave, setStatus }) => {
  const [emailMessage, setEmailMessage] = useState('');

  const handleSave = () => {
    if (emailMessage.trim() === '') {
      return alert('Please enter a message');
    }
    onSave(emailMessage);
    setStatus('Cancelled')
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Enter Email Message for Cancelled Order</h2>
        <ReactQuill 
          value={emailMessage} 
          onChange={(e) => setEmailMessage(e.target.value)}
          placeholder="Description"
          className="w-full h-32 p-2 border rounded"
        />
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 mr-2 rounded">Cancel</button>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
        </div>
      </div>
    </div>
  );
};

export default CustomEmailModal;
