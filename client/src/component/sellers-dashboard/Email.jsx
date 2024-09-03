import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


toast.configure();
const EmailList = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/admin/email`, { withCredentials: true });

        if (response.data.error) {
          throw new Error(response.data.error)
        }
        setEmails(response.data.emails);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.err) {
          setError(err.response.data.error)
        } else {
          setError('Please check your internet')
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1 className='text-2xl font-bold'>Email List</h1>
      <ul>
        {emails.map((email, index) => (
          <li key={index}>{email}</li>
        ))}
      </ul>
      <ToastContainer />
    </div>
  );
};

export default EmailList;
