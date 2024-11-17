// header component
import React from 'react';

const Header = ({ banner }) => {
  return (
    <header className='relative h-auto'>
      <div className='relative w-full'>
        <div className='flex flex-col items-center justify-center text-center text-white mt-0'>
          <img 
            src={banner} 
            alt="Banner" 
            className='w-full h-auto md:h-[500px] object-cover'
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
