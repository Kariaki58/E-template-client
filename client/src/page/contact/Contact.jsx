import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    subject: 'From A Customer',
    message: '',
    userEmail: '',
  });
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleQuillChange = (value) => {
    setFormData({
      ...formData,
      message: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/send/email`, formData, { withCredentials:true })

      if (response.data.error) {
        toast.error(response.data.error)
      } else {
        toast.success(response.data.message)
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error)
      } else {
        toast.error("something went wrong")
      }
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg m-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Us</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="userEmail">
            Your Email
          </label>
          <input
            type="email"
            name="userEmail"
            id="userEmail"
            placeholder="your-email@example.com"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.userEmail}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="message">
            Message
          </label>
          <ReactQuill
            id="message"
            value={formData.message}
            onChange={handleQuillChange}
            className="w-full mt-1 p-2 border-gray-300 rounded-md focus:ring-gray-900 focus:border-gray-900 h-52 mb-8"
            placeholder="Your message here..."
            required
          />
        </div>
        <button
          type="submit"
          className="w-full p-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-600 transition duration-300"
        >
          { loading ? 'Sending message...' : 'Send Message' }
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Contact;
