import React, { useState } from 'react';
import { RxCross1 } from "react-icons/rx";

const Ads = () => {
  const [isOpen, setIsOpen] = useState(true);

  // Toggle visibility of the ad
  const handleClose = () => setIsOpen(prev => !prev);

  return (
    <aside 
      className={`flex justify-center items-center relative bg-gray-950 text-white p-2 ${isOpen ? 'block' : 'hidden'}`}
      aria-hidden={!isOpen}  // Hides from screen readers if not open
      aria-label="Advertisement"  // Add context for screen readers
      role="complementary"  // Define a complementary landmark for ads
    >
      <p className='text-sm sm:text-base'>
        Free Shipping for orders up to 100k
      </p>
      
      {/* Close button with aria-label */}
      <button 
        aria-label="Close advertisement"
        className='absolute top-1/2 transform -translate-y-1/2 right-10 cursor-pointer'
        onClick={handleClose}
      >
        <RxCross1 />
      </button>
    </aside>
  );
}

export default React.memo(Ads);
