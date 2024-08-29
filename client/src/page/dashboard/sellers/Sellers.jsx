import React from 'react';
import { BsCartCheck } from 'react-icons/bs';
import { FaRegAddressBook } from 'react-icons/fa';
import { Link, Outlet } from 'react-router-dom';
import { GrLogout } from 'react-icons/gr';
import { PiChartLineUpBold } from 'react-icons/pi';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { GrCloudUpload } from "react-icons/gr";

const Sellers = () => {
  return (
    <div className="flex">
      <div className="h-screen flex-2 xl:w-72 border-gray-300 border-r-2">
        <ul className="leading-10 px-4">
          <Link to="/dashboard/admin">
            <li className="flex items-center text-xl gap-4 mt-10 cursor-pointer bg-gray-950 text-white sm:bg-gray-950 sm:text-white rounded-lg p-4">
              <PiChartLineUpBold />
              <p className="hidden md:block">Analytics</p>
            </li>
          </Link>
          <Link to="/dashboard/admin/orders">
            <li className="flex items-center text-xl gap-4 mt-3 cursor-pointer bg-gray-950 text-white sm:bg-gray-950 sm:text-white rounded-lg p-4">
              <BsCartCheck className="text-2xl" />
              <p className="hidden md:block">Orders</p>
            </li>
          </Link>
          <Link to="/dashboard/admin/products">
            <li className="flex items-center text-xl gap-4 mt-3 cursor-pointer bg-gray-950 text-white sm:bg-gray-950 sm:text-white rounded-lg p-4">
              <MdOutlineProductionQuantityLimits className="text-2xl" />
              <p className="hidden md:block">Products</p>
            </li>
          </Link>
          <Link to='/dashboard/admin/products/management'>
            <li className='flex items-center text-xl gap-4 mt-3 cursor-pointer bg-gray-950 text-white sm:bg-gray-950 sm:text-white rounded-lg p-4'>
              <GrCloudUpload className='text-2xl'/>
              <p className='hidden md:block'>Management</p>
            </li>
          </Link>
          <Link to="/dashboard/admin/emails">
            <li className="flex items-center text-xl gap-4 mt-3 cursor-pointer text-white bg-gray-950 sm:bg-gray-950 sm:text-white rounded-lg p-4">
              <FaRegAddressBook className="text-2xl" />
              <p className="hidden md:block">Email</p>
            </li>
          </Link>
          <li className="flex items-center text-xl gap-4 mt-16 cursor-pointer bg-gray-950 text-white sm:bg-gray-950 sm:text-white rounded-lg p-4">
            <GrLogout />
            <p className="hidden md:block">Sign Out</p>
          </li>
        </ul>
      </div>
      <div className="flex-1 p-4 overflow-x-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Sellers;
