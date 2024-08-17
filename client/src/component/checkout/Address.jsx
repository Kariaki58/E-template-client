import React, { useState } from 'react';

const Address = () => {
    const [shippingDetails, setShippingDetails] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
      });
    
      const [paymentMethod, setPaymentMethod] = useState('credit');
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails((prevDetails) => ({
          ...prevDetails,
          [name]: value,
        }));
      };
    
      const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        alert('Order placed successfully!');
      };
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
                placeholder='full name'
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
                placeholder='email'
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
                placeholder='street number, house number or more infomation'
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
                placeholder='city'
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
                placeholder='state'
                id='state'
                name='state'
                value={shippingDetails.state}
                onChange={handleChange}
                className='border border-gray-300 rounded-md w-full py-2 px-3 text-sm md:text-base focus:outline-none focus:border-gray-500'
                required
              />
            </div>
            <div>
              <label htmlFor='zip' className='block mb-2 text-sm md:text-base font-medium'>ZIP Code(optional)</label>
              <input
                type='text'
                placeholder='optional zip'
                id='zip'
                name='zip'
                value={shippingDetails.zip}
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
                  placeholder='phone number with country code'
                  value={shippingDetails.phone}
                  onChange={handleChange}
                  className='border border-gray-300 rounded-md w-full py-2 px-3 text-sm md:text-base focus:outline-none focus:border-gray-500'
                  required
                />
              </div>
            </div>
          </div>

          <h2 className='text-2xl font-semibold mb-6 border-b pb-2'>Payment Method</h2>
          <div className='mb-8'>
            <label className='inline-flex items-center mb-2'>
              <input
                type='radio'
                name='payment'
                value='credit'
                checked={paymentMethod === 'credit'}
                onChange={handlePaymentChange}
                className='form-radio h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300'
              />
              <span className='ml-2 text-sm md:text-base'>Credit Card</span>
            </label>
            <label className='inline-flex items-center ml-6'>
              <input
                type='radio'
                name='payment'
                value='paypal'
                checked={paymentMethod === 'paypal'}
                onChange={handlePaymentChange}
                className='form-radio h-4 w-4 text-gray-600 focus:ring-blue-500 border-gray-300'
              />
              <span className='ml-2 text-sm md:text-base'>PayPal</span>
            </label>
          </div>
          <button
            type='submit'
            className='bg-gray-950 text-white py-3 px-6 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm md:text-base transition-colors w-full md:w-auto'
          >
            Pay
          </button>
        </form>
      </div>
  );
}

export default Address;
