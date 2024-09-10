import React from 'react';
import banner from '/assets/banner1.png';

const Header = () => {
  return (
    <header className='relative h-auto'>
      <div className='relative w-full'>
        <div className='flex flex-col items-center justify-center text-center text-white'>
          <img 
            src={banner} 
            alt="Banner" 
            className='w-full h-auto object-cover'
          />
          {/* Uncomment and adjust the heading as needed */}
          {/* <h1 className='text-base sm:text-2xl md:text-4xl mb-4 font-light'>
            Experience the future of augmented reality.
            Elevate your digital interactions with Apple Vision Pro—where innovation meets immersive technology.
            Buy now and transform your reality!
          </h1> */}
        </div>
      </div>
    </header>
  );
}

export default Header;
