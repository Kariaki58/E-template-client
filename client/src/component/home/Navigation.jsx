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
import logo from '/assets/betterlogo.png'


const Navigation = () => {
  const { handleToggle, setIsOpen: openModal } = useContext(context);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);  // Scroll state for navigation
  const navigate = useNavigate();
  const user = useAuthUser();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/sign-up')) {
      navigate('/')
    } else {
      if (location.pathname === '/login' || location.pathname === '/sign-up')
        navigate(location.pathname)
      openModal(true)
    }

    if (user && (user.isAdmin && (location.pathname === '/cart'))) {
      navigate('/dashboard/admin')
    }

    if (user && (user.isAdmin && (location.pathname.includes('/dashboard/user')))) {
      navigate('/dashboard/admin')
    }
    if (user && (location.pathname === '/dashboard/admin' && !user.isAdmin)) {
      navigate('/login')
      openModal(true)
    }
  }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };
  const [isOpen, setIsOpen] = useState(false)
  const isAuth = useIsAuthenticated()

  return (
    <div className={`bg-white shadow-md py-4 fixed w-full top-0 left-0 z-50 transition-all duration-300 ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>
      <ul className="mx-auto flex items-center justify-between px-4 gap-2">
        <li className='bg-blue-800'>
          <Link to='/'>
            <img src={logo} width={60}/>
          </Link>
        </li>

        <li className={`flex items-center gap-4 flex-1 ${isSearchOpen ? 'justify-center' : 'justify-end sm:justify-center'}`}>
          <div className={`flex items-center transition-all duration-300 ease-in-out ${isSearchOpen ? 'w-full' : 'w-auto'}`}>
            <input
              className={`border-b border-black rounded-lg p-2 focus:outline-none transition-all duration-300 ease-in-out ${
                isSearchOpen ? 'w-full block' : 'hidden sm:block w-32 md:w-64'
              }`}
              type="search"
              placeholder="Search..."
            />
            <span onClick={toggleSearch} className="cursor-pointer">
              {
                isSearchOpen ? <RxCross1 /> : 
                <IoIosSearch className="text-2xl block sm:hidden"/>
              }
            </span>            
          </div>
        </li>
        <li className="flex items-center gap-2">
          {
            !user || (!user.isAdmin) ? (
              <div className="flex items-center">
                  <Link to='/cart'>
                    <PiShoppingCartLight className="hover:text-blue-500 transition duration-200 cursor-pointer text-2xl" />
                </Link>
              </div>
            ) : <></>
          }
          
          <div className="flex items-center relative">
            <GoPerson className="hover:text-blue-500 transition duration-200 cursor-pointer text-2xl" onClick={() => setIsOpen(prev => !prev)}/>
            {
              isOpen && (
                <ul className='bg-white right-0 p-2 flex justify-center flex-col items-center absolute w-32 top-12 z-50'>
                  {
                    !isAuth ? (
                      <>
                        <Link  className='hover:bg-gray-200 p-2 w-full cursor-pointer' to="/login" onClick={handleToggle}>
                          <li onClick={() => setIsOpen(prev => !prev)}>Login</li>
                        </Link>
                        <Link className='hover:bg-gray-200 p-2 w-full cursor-pointer' to="/sign-up" onClick={handleToggle}>
                          <li  onClick={() => setIsOpen(prev => !prev)}>sign up</li>
                        </Link>
                      </>
                    ) : <Link  onClick={() => setIsOpen(prev => !prev)} className='hover:bg-gray-200 p-2 w-full cursor-pointer' to={user.isAdmin ? '/dashboard/admin' : '/dashboard/user'}><li>my account</li></Link>
                  }
                </ul>
              )
            }
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
