import React from 'react';
import { BsCartCheck } from 'react-icons/bs';
import { FaRegAddressBook } from 'react-icons/fa';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { GrLogout } from 'react-icons/gr';
import { PiChartLineUpBold } from 'react-icons/pi';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { GrCloudUpload } from "react-icons/gr";
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


toast.configure();
const Sellers = () => {
  const signOut = useSignOut()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      signOut();
      const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/signout`, {}, { withCredentials: true });
      
      if (response.data.error) {
        toast.error(response.data.error || 'An error occurred while signing out.');
      } else {
        toast.success(response.data.message || 'Signed out successfully!');
        navigate('/login');
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
    }
  };


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
          <li onClick={handleSignOut} className="flex items-center text-xl gap-4 mt-16 cursor-pointer bg-gray-950 text-white sm:bg-gray-950 sm:text-white rounded-lg p-4">
            <GrLogout />
            <p className="hidden md:block">Sign Out</p>
          </li>
        </ul>
      </div>
      <div className="flex-1 p-4 overflow-x-auto">
        <Outlet />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Sellers;
