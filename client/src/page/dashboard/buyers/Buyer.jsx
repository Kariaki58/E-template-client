import React from 'react';
import { BsCartCheck } from "react-icons/bs";
import { FaRegAddressBook } from "react-icons/fa";
import { Link, Outlet } from 'react-router-dom';
import { GrLogout } from "react-icons/gr";


const Buyer = () => {
  return (
    <div className='flex'>
      <div className='w-20 h-screen flex-2 sm:block xl:w-72 border-gray-300 border-r-2'>
        <ul className='leading-10 px-4'>
          <Link to="/dashboard/user">
            <li className='flex items-center text-xl gap-4 mt-10 cursor-pointer sm:bg-gray-950 sm:text-white rounded-lg p-4'>
              <BsCartCheck className='text-2xl'/>
              <p className='hidden sm:block'>My Orders</p>
            </li>
          </Link>
          <Link to="/dashboard/user/address">
            <li className='flex items-center text-xl gap-4 mt-5 cursor-pointer sm:bg-gray-950 sm:text-white rounded-lg p-4'>
              <FaRegAddressBook className=''/>
              <p className='hidden sm:block'>Account</p>
            </li>
          </Link>
          <li className='flex items-center text-xl gap-4 mt-72 cursor-pointer sm:bg-gray-950 sm:text-white rounded-lg p-4'>
            <GrLogout />
            <p className='hidden sm:block'>Sign Out</p>
          </li>
        </ul>
      </div>
      <div className='w-96 flex-1 p-4'>
        <Outlet />
      </div>
    </div>
  );
}

export default Buyer;
