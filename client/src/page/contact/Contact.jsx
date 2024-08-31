import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    userEmail: '',
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Logic to send the email goes here
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
          <label className="block text-gray-700 font-medium mb-2" htmlFor="subject">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            id="subject"
            placeholder="Subject"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.subject}
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
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
