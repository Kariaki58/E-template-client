import React from 'react';
import { BsCartCheck } from "react-icons/bs";
import { FaRegAddressBook } from "react-icons/fa";
import { Link, Outlet } from 'react-router-dom';
import { GrLogout } from "react-icons/gr";
import { PiChartLineUpBold } from "react-icons/pi";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";


const Sellers = () => {
  return (
    <div className='flex'>
      <div className='w-20 h-screen flex-2 sm:block xl:w-72 border-gray-300 border-r-2'>
        <ul className='leading-10 px-4'>
          <Link to="/dashboard/admin">
            <li className='flex items-center text-xl gap-4 mt-10 cursor-pointer sm:bg-gray-950 sm:text-white rounded-lg p-4'>
              <PiChartLineUpBold />
              <p>Analytics</p>
            </li>
          </Link>
          <Link to="/dashboard/admin/orders">
            <li className='flex items-center text-xl gap-4 mt-3 cursor-pointer sm:bg-gray-950 sm:text-white rounded-lg p-4'>
              <BsCartCheck className='text-2xl'/>
              <p className='hidden sm:block'>Orders</p>
            </li>
          </Link>
          <Link to="/dashboard/admin/products">
            <li className='flex items-center text-xl gap-4 mt-3 cursor-pointer sm:bg-gray-950 sm:text-white rounded-lg p-4'>
              <MdOutlineProductionQuantityLimits className='text-2xl'/>
              <p className='hidden sm:block'>Products</p>
            </li>
          </Link>
          <Link to="/dashboard/admin/emails">
            <li className='flex items-center text-xl gap-4 mt-3 cursor-pointer sm:bg-gray-950 sm:text-white rounded-lg p-4'>
              <MdOutlineProductionQuantityLimits className='text-2xl'/>
              <p className='hidden sm:block'>Email</p>
            </li>
          </Link>
          <li className='flex items-center text-xl gap-4 mt-16 cursor-pointer sm:bg-gray-950 sm:text-white rounded-lg p-4'>
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

export default Sellers;
