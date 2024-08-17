import React, { useState } from 'react';
import { RxCross1 } from "react-icons/rx";


const Ads = () => {
    const [isOpen, setIsOpen] = useState(true)
  return (
    <div className={`flex justify-center relative bg-gray-950 text-white p-2 ${isOpen? 'block': 'hidden'}`}>
        <p className='text-sm sm:text-base'>
            buy 5 get 1 free writing long ads writing long ads again
        </p>
        <RxCross1 className='absolute top-1/2 transform -translate-y-1/2 right-10 cursor-pointer bottom-0' onClick={() => setIsOpen(prev => !prev)}/>
    </div>
  );
}

export default Ads;
