import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

const Address = () => {
  const [loading, setLoading] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/address`, { withCredentials: true });
        const {
          address,
          city,
          state,
          zipCode,
          country,
          phoneNumber,
          email,
          name,
        } = response.data.message;

        setShippingDetails({
          name,
          email,
          address,
          city,
          state,
          zip: zipCode,
          country,
          phone: phoneNumber,
        });
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/address/add`, shippingDetails, { withCredentials: true });
      const { address, city, state, zipCode, country, phoneNumber, email, name } = response.data.address;

      setShippingDetails({
        name,
        email,
        address,
        city,
        state,
        zip: zipCode,
        country,
        phone: phoneNumber,
      });
      toast.success("Address saved successfully!");
    } catch (error) {
      toast.error("Failed to save address.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className='rounded-lg p-6'>
      <h2 className='text-2xl font-semibold mb-6 border-b pb-2'>Shipping Details</h2>
      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 mb-8'>
          <div>
            <label htmlFor='name' className='block mb-2 text-sm md:text-base font-medium'>Full Name</label>
            <input
              type='text'
              id='name'
              name='name'
              placeholder='Full Name'
              value={shippingDetails.name}
              onChange={handleChange}
              className='border border-gray-300 rounded-md w-full py-2 px-3 text-sm md:text-base focus:outline-none focus:border-gray-500'
              required
            />
          </div>
          <div>
            <label htmlFor='email' className='block mb-2 text-sm md:text-base font-medium'>Email Address</label>
            <input
              type='email'
              id='email'
              placeholder='Email'
              name='email'
              value={shippingDetails.email}
              onChange={handleChange}
              className='border border-gray-300 rounded-md w-full py-2 px-3 text-sm md:text-base focus:outline-none focus:border-gray-500'
              required
            />
          </div>
          <div className='col-span-1 md:col-span-2'>
            <label htmlFor='address' className='block mb-2 text-sm md:text-base font-medium'>Address</label>
            <input
              type='text'
              id='address'
              placeholder='Street number, house number or more information'
              name='address'
              value={shippingDetails.address}
              onChange={handleChange}
              className='border border-gray-300 rounded-md w-full py-2 px-3 text-sm md:text-base focus:outline-none focus:border-gray-500'
              required
            />
          </div>
          <div>
            <label htmlFor='city' className='block mb-2 text-sm md:text-base font-medium'>City</label>
            <input
              type='text'
              placeholder='City'
              id='city'
              name='city'
              value={shippingDetails.city}
              onChange={handleChange}
              className='border border-gray-300 rounded-md w-full py-2 px-3 text-sm md:text-base focus:outline-none focus:border-gray-500'
              required
            />
          </div>
          <div>
            <label htmlFor='state' className='block mb-2 text-sm md:text-base font-medium'>State</label>
            <input
              type='text'
              placeholder='State'
              id='state'
              name='state'
              value={shippingDetails.state}
              onChange={handleChange}
              className='border border-gray-300 rounded-md w-full py-2 px-3 text-sm md:text-base focus:outline-none focus:border-gray-500'
              required
            />
          </div>
          <div>
            <label htmlFor='zip' className='block mb-2 text-sm md:text-base font-medium'>ZIP Code (optional)</label>
            <input
              type='text'
              placeholder='Optional ZIP'
              id='zip'
              name='zip'
              value={shippingDetails.zip}
              onChange={handleChange}
              className='border border-gray-300 rounded-md w-full py-2 px-3 text-sm md:text-base focus:outline-none focus:border-gray-500'
            />
          </div>
          <div>
            <label htmlFor='country' className='block mb-2 text-sm md:text-base font-medium'>Country</label>
            <input
              type='text'
              placeholder='Country'
              id='country'
              name='country'
              value={shippingDetails.country}
              onChange={handleChange}
              className='border border-gray-300 rounded-md w-full py-2 px-3 text-sm md:text-base focus:outline-none focus:border-gray-500'
              required
            />
          </div>
          <div className='col-span-1 md:col-span-2'>
            <label htmlFor='phone' className='block mb-2 text-sm md:text-base font-medium'>Phone Number</label>
            <div className='flex'>
              <input
                type='tel'
                id='phone'
                name='phone'
                placeholder='Phone number with country code'
                value={shippingDetails.phone}
                onChange={handleChange}
                className='border border-gray-300 rounded-md w-full py-2 px-3 text-sm md:text-base focus:outline-none focus:border-gray-500'
                required
              />
            </div>
          </div>
        </div>
        <button
          type='submit'
          className='bg-gray-950 text-white py-3 px-6 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm md:text-base transition-colors w-full md:w-auto'
        >
          Save
        </button>
      </form>

      <Toaster />
    </div>
  );
};

export default Address;
