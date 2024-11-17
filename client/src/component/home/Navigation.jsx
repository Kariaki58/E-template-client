// navigation component
import React, { useEffect, useState } from 'react';
import { GoPerson } from "react-icons/go";
import { PiShoppingCartLight } from "react-icons/pi";
import { RxCross1 } from "react-icons/rx";
import { IoIosSearch } from "react-icons/io";
import { FaBars } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useContext } from 'react';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import { context } from '../../contextApi/Modal';
import logo from '/assets/betterlogo.png';
import { motion } from 'framer-motion';

const Navigation = ({ logoImage }) => {
  const { handleToggle, setIsOpen: openModal } = useContext(context);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <motion.nav
      className={`bg-white shadow-lg w-full transition-all duration-300 py-3 ${isScrolled ? 'fixed top-0 z-50 border-b border-gray-200' : ''}`}
    >
      <div className="container mx-auto flex items-center justify-between px-2">
        {/* Logo */}
        <Link to='/' className="flex items-center">
          <img src={logoImage} width={60} alt="Logo" className="h-10 md:h-12" />
        </Link>

        {/* Main Navigation Links */}
        <ul className="hidden md:flex items-center gap-8 flex-1 justify-center text-gray-700 font-medium">
          <li>
            <Link to='/' className="hover:text-blue-600 transition duration-200">Home</Link>
          </li>
          <li>
            <Link to='/contact' className="hover:text-blue-600 transition duration-200">Contact</Link>
          </li>
          <li>
            <Link to='/faq' className="hover:text-blue-600 transition duration-200">FAQ</Link>
          </li>
        </ul>

        {/* Search Bar and Icons */}
        <div className="flex items-center gap-4">
          <div className={`relative ${isSearchOpen ? 'flex w-full' : ''}`}>
            <motion.input
              className={`border-b border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-600 transition-all duration-300 ${
                isSearchOpen || window.innerWidth >= 768 ? 'block' : 'hidden'
              } w-full md:w-64`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="search"
              placeholder="Search..."
            />
            <span onClick={toggleSearch} className="cursor-pointer text-gray-500 md:hidden">
              {isSearchOpen ? <RxCross1 className="text-2xl" /> : <IoIosSearch className="text-2xl" />}
            </span>
          </div>

          {/* Cart Icon */}
          {!user || !user.isAdmin ? (
            <Link to='/cart'>
              <PiShoppingCartLight className="text-2xl text-gray-700 hover:text-blue-600 transition duration-200 cursor-pointer" />
            </Link>
          ) : null}

          {/* User Account Dropdown */}
          <div className="relative">
            <GoPerson
              className="text-2xl text-gray-700 hover:text-blue-600 transition duration-200 cursor-pointer"
              onClick={() => setIsOpen((prev) => !prev)}
            />
            {isOpen && (
              <ul className='bg-white border border-gray-200 shadow-lg right-0 p-2 rounded-lg flex flex-col items-center absolute w-40 top-12 z-50'>
                {!isAuthenticated ? (
                  <>
                    <Link className='w-full hover:bg-gray-100 rounded p-2 cursor-pointer' to="/login" onClick={handleToggle}>
                      <li onClick={() => setIsOpen(false)}>Login</li>
                    </Link>
                    <Link className='w-full hover:bg-gray-100 rounded p-2 cursor-pointer' to="/sign-up" onClick={handleToggle}>
                      <li onClick={() => setIsOpen(false)}>Sign Up</li>
                    </Link>
                  </>
                ) : (
                  <Link className='w-full hover:bg-gray-100 rounded p-2 cursor-pointer' to={user.isAdmin ? '/dashboard/admin' : '/dashboard/user'} onClick={() => setIsOpen(false)}>
                    <li>My Account</li>
                  </Link>
                )}
              </ul>
            )}
          </div>
          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden flex items-center">
            <FaBars
              className="text-2xl text-gray-700 cursor-pointer"
              onClick={toggleMenu}
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu (Slider) */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: menuOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 120 }}
        className="fixed top-0 left-0 h-full w-3/4 max-w-xs bg-white shadow-lg z-50 p-6 flex flex-col space-y-4"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <RxCross1 className="text-2xl cursor-pointer text-gray-700" onClick={toggleMenu} />
        </div>
        <Link to='/' className="text-gray-700 hover:text-blue-600 text-lg" onClick={toggleMenu}>Home</Link>
        <Link to='/contact' className="text-gray-700 hover:text-blue-600 text-lg" onClick={toggleMenu}>Contact</Link>
        <Link to='/faq' className="text-gray-700 hover:text-blue-600 text-lg" onClick={toggleMenu}>FAQ</Link>
      </motion.div>
    </motion.nav>
  );
};

export default Navigation;
