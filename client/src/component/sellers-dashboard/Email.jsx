import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

const EmailList = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emailContent, setEmailContent] = useState({
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/admin/email`, { withCredentials: true });

        if (response.data.error) {
          throw new Error(response.data.error);
        }
        setEmails(response.data.emails);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError('Please check your internet connection');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  const handleInputChange = (name, value) => {
    setEmailContent((prevContent) => ({
      ...prevContent,
      [name]: value,
    }));
  };

  const handleSendEmail = async () => {
    setSending(true);
    if (emailContent.subject === '') {
      setSending(false)
      toast.error('subject is required')
      return
    }
    if (emailContent.message === '') {
      setSending(false)
      toString.error('message is required')
      return
    }
    try {
      await axios.post(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/admin/send-email`, emailContent, { withCredentials: true });
      toast.success('Emails sent successfully!');
      setEmailContent({ subject: '', message: '' });
    } catch (err) {
      if (err.response && error.response.data) {
        toast.error(err.response.data.error)
      } else {
        toast.error('Failed to send emails');
      }
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className='text-center text-gray-600'>Loading...</div>;
  }

  if (error) {
    return <div className='text-center text-red-600'>{error}</div>;
  }

  return (
    <div className='container mx-auto p-8 bg-white shadow-lg rounded-lg'>
      <h1 className='text-3xl font-bold mb-6 text-gray-800'>Email List</h1>
      <div className='flex flex-col lg:flex-row gap-8'>
        {/* Email Form Section */}
        <div className='flex-1 bg-gray-50 p-8 rounded-lg shadow-md'>
          <h2 className='text-2xl font-semibold mb-6 text-gray-800'>Send Email</h2>
          <div className='space-y-6'>
            {/* Subject Input */}
            <div>
              <label className='block text-lg font-medium mb-2 text-gray-700'>Subject</label>
              <input
                type='text'
                name='subject'
                value={emailContent.subject}
                onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                className='border border-gray-300 rounded-lg w-full p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter email subject'
              />
            </div>

            {/* Message Input */}
            <div>
              <label className='block text-lg font-medium mb-2 text-gray-700'>Message</label>
              <ReactQuill
                value={emailContent.message}
                onChange={(value) => handleInputChange('message', value)}
                placeholder="Compose your message..."
                className="w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ minHeight: '20px' }}
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendEmail}
              className='bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-500 transition duration-150 flex items-center justify-center'
              disabled={sending}
            >
              {sending ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <path fill="none" d="M0 0h24v24H0z"/>
                    <path d="M4 12c0 1.38.56 2.63 1.48 3.54l1.41-1.41C6.4 13.09 6 12.09 6 11s.4-2.09.89-2.89L4.88 6.88C3.97 7.77 4 9.08 4 12zm12-4c0-1.38-.56-2.63-1.48-3.54l-1.41 1.41C17.6 10.91 18 11.91 18 13s-.4 2.09-.89 2.89l1.41 1.41C18.03 14.63 18 13.32 18 12zM4 12c0 2.5 0 .5 0 0zm12 0c0-2.5 0-.5 0 0z"/>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Email'
              )}
            </button>
          </div>
        </div>

        {/* Email List Section */}
        <div className='flex-1 bg-gray-50 p-8 rounded-lg shadow-md'>
          <h2 className='text-2xl font-semibold mb-6 text-gray-800'>Manage Email List</h2>
          <ul className='list-disc list-inside space-y-2'>
            {emails.map((email, index) => (
              <li key={index} className='text-lg text-gray-700'>{email}</li>
            ))}
          </ul>
        </div>
      </div>
      <Toaster position='bottom-right' />
    </div>
  );
};

export default EmailList;
