// navigation component
import React, { useEffect, useState } from 'react';
import { GoPerson } from "react-icons/go";
import { PiShoppingCartLight } from "react-icons/pi";
import { RxCross1 } from "react-icons/rx";
import { IoIosSearch } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useContext } from 'react';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import { context } from '../../contextApi/Modal';
import logo from '/assets/betterlogo.png';
import { motion } from 'framer-motion';

const Navigation = () => {
  const { handleToggle, setIsOpen: openModal } = useContext(context);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/sign-up')) {
      navigate('/');
    } else if (user && user.isAdmin && (location.pathname.includes('/dashboard/user') || location.pathname === '/cart')) {
      navigate('/dashboard/admin');
    } else if (user && !user.isAdmin && location.pathname === '/dashboard/admin') {
      navigate('/login');
      openModal(true);
    }
  }, [location.pathname]);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <motion.div
      className="bg-white shadow-md fixed w-full top-0 left-0 z-50 transition-all duration-300"
      animate={{ opacity: isScrolled ? 1 : 0, y: isScrolled ? 0 : -100 }}
    >
      <ul className="mx-auto flex items-center justify-between px-4 gap-2">
        <li>
          <Link to='/'>
            <img src={logo} width={60} alt="Logo" />
          </Link>
        </li>

        <li className="flex items-center gap-4 w-full flex-1 justify-center">
          {/* Show the input on md screens and above, and only show the icon on smaller screens */}
          <motion.div
            className={`flex items-center transition-all duration-300 ease-in-out w-full md:w-auto ${isSearchOpen ? 'justify-center' : 'justify-end'}`}
          >
            {/* Input is hidden on small screens and visible from md screens */}
            <motion.input
              className={`border-b border-black rounded-lg p-2 focus:outline-none ${
                isSearchOpen || window.innerWidth >= 768 ? 'block' : 'hidden'
              } w-full md:w-full`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="search"
              placeholder="Search..."
            />
            {/* Only show the icon on small screens */}
            <span onClick={toggleSearch} className="cursor-pointer md:hidden">
              {isSearchOpen ? <RxCross1 /> : <IoIosSearch className="text-2xl" />}
            </span>
          </motion.div>
        </li>

        <li className="flex items-center gap-6">
          {!user || !user.isAdmin ? (
            <div className="flex items-center">
              <Link to='/cart'>
                <PiShoppingCartLight className="hover:text-blue-500 transition duration-200 cursor-pointer text-2xl" />
              </Link>
            </div>
          ) : null}

          <div className="flex items-center relative">
            <GoPerson
              className="hover:text-blue-500 transition duration-200 cursor-pointer text-2xl"
              onClick={() => setIsOpen((prev) => !prev)}
            />
            {isOpen && (
              <ul className='bg-white right-0 p-2 flex justify-center flex-col items-center absolute w-32 top-12 z-50'>
                {!isAuthenticated ? (
                  <>
                    <Link className='hover:bg-gray-200 p-2 w-full cursor-pointer' to="/login" onClick={handleToggle}>
                      <li onClick={() => setIsOpen(false)}>Login</li>
                    </Link>
                    <Link className='hover:bg-gray-200 p-2 w-full cursor-pointer' to="/sign-up" onClick={handleToggle}>
                      <li onClick={() => setIsOpen(false)}>Sign Up</li>
                    </Link>
                  </>
                ) : (
                  <Link className='hover:bg-gray-200 p-2 w-full cursor-pointer' to={user.isAdmin ? '/dashboard/admin' : '/dashboard/user'} onClick={() => setIsOpen(false)}>
                    <li>My Account</li>
                  </Link>
                )}
              </ul>
            )}
          </div>
        </li>
      </ul>
    </motion.div>
  );
};

export default Navigation;
