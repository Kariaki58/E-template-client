import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { FaLocationDot } from "react-icons/fa6";
import { MdOutlineAddIcCall, MdOutlineAccessTime } from "react-icons/md";
import axios from 'axios';


const formatHours = (hours) => {
  const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const formattedDays = [];
  let group = [];
  let currentRange = '';

  // Helper function to format time in 12-hour format
  const formatTime = (time) => {
    if (!time) return 'Closed';
    const [hour, minute] = time.split(':');
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = ((hour % 12) || 12).toString();
    return `${formattedHour}:${minute} ${period}`;
  };

  // Iterate over the days to group them by similar hours
  dayOrder.forEach((day, index) => {
    const { open, close } = hours[day] || {};
    const openTime = formatTime(open);
    const closeTime = formatTime(close);
    const timeRange = open && close ? `${openTime} - ${closeTime}` : 'Closed';

    if (timeRange === currentRange) {
      group.push(day.charAt(0).toUpperCase() + day.slice(1));
    } else {
      if (group.length > 1) {
        formattedDays.push(`${group[0]}-${group[group.length - 1]}: ${currentRange}`);
      } else if (group.length === 1) {
        formattedDays.push(`${group[0]}: ${currentRange}`);
      }
      currentRange = timeRange;
      group = [day.charAt(0).toUpperCase() + day.slice(1)];
    }

    if (index === dayOrder.length - 1 && group.length > 0) {
      if (group.length > 1) {
        formattedDays.push(`${group[0]}-${group[group.length - 1]}: ${currentRange}`);
      } else {
        formattedDays.push(`${group[0]}: ${currentRange}`);
      }
    }
  });

  return formattedDays;
};


const Contact = ({ location, contact, support, openHours, storeDescription }) => {
  const formattedHours = formatHours(openHours);

  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    name: '',
    phoneNumber: '',
    userEmail: '',
  });
  const [loading, setLoading] = useState(false);
  // console.log(store)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_BASEURL}/send/email`,
        formData,
        { withCredentials: true }
      );

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success(response.data.message);
        setFormData({ subject: '', message: '', name: '', phoneNumber: '', userEmail: '' }); // Clear form
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="px-4 py-8 lg:px-16">
        <section>
          <div className='w-[480px] mx-auto my-10'>
            <h2 className="text-center text-3xl font-semibold mb-4">Our Address</h2>
            <p className="text-center mb-6 mt-10 text-gray-600">
              {storeDescription}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start space-x-4 border-r pr-32">
              <FaLocationDot className="text-5xl text-[#FA9090]" aria-hidden="true" />
              <div>
                <h3 className="font-semibold">Location</h3>
                <p className='text-gray-600'>{location}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 border-r pr-32">
              <MdOutlineAddIcCall className="text-5xl text-[#FA9090]" aria-hidden="true" />
              <div>
                <h3 className="font-semibold text-xl">Support</h3>
                <p className='text-gray-600'>Mobile: {contact}</p>
                <p className='text-gray-600'>Support: {support}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <MdOutlineAccessTime className="text-5xl text-[#FA9090]" aria-hidden="true" />
              <div>
                <h3 className="font-semibold">Opening Hours</h3>
                {formattedHours.map((line, index) => (
                  <p key={index} className='text-gray-600'>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <div className='w-full md:w-[520px] mx-auto mb-16'>
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Ready to Get Started?</h2>
            <p className="text-center mb-8 text-gray-500">Simply complete the form below, and our customer service team will get in touch within 3 business days.</p>
          </div>
          
          <form className="max-w-xl mx-auto space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                id="userEmail"
                type="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleChange}
                placeholder="Your Email *"
                className="border border-gray-300 outline-none focus:outline-none p-4 rounded-full w-full"
                required
              />
              <input
                id="subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Your Subject *"
                className="border border-gray-300 outline-none focus:outline-none p-4 rounded-full w-full"
                required
              />
            </div>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message *"
              rows="5"
              className="border border-gray-300 outline-none focus:outline-none p-4 rounded-3xl w-full"
              required
            ></textarea>
            
            <button
              type="submit"
              className={`bg-black hover:bg-[#FA9090] w-full text-white py-3 px-6 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition ease-in-out duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Enquiry'}
            </button>
          </form>
        </section>
      </main>
      <Toaster />
    </>
  );
};

export default Contact;
