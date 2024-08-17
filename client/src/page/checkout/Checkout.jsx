import React, { useState } from 'react';
import Address from '../../component/checkout/Address';

const Checkout = () => {

  return (
    <div className='container mx-auto p-4 md:p-8 lg:p-12 mt-20'>
      <h1 className='text-3xl font-bold mb-8 text-center'>Checkout</h1>
      
      <div className='rounded-lg p-6 mb-10'>
        <h2 className='text-2xl font-semibold mb-6 border-b pb-2'>Order Summary</h2>
        <ul className='space-y-4'>
          {/* Example cart items */}
          <li className='flex justify-between items-center border-b pb-2'>
            <span>Product 1</span>
            <span>$29.99 x 2</span>
            <span>$59.98</span>
          </li>
          <li className='flex justify-between items-center border-b pb-2'>
            <span>Product 2</span>
            <span>$49.99 x 1</span>
            <span>$49.99</span>
          </li>
        </ul>
        <div className='flex justify-between items-center mt-4 border-t pt-4'>
          <span className='text-lg md:text-xl font-semibold'>Total:</span>
          <span className='text-lg md:text-xl font-semibold'>$109.97</span>
        </div>
      </div>
      <Address />
    </div>
  );
};

export default Checkout;
