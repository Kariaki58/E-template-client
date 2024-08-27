import React, { useState } from 'react';
import { GoPerson } from "react-icons/go";
import { PiShoppingCartLight } from "react-icons/pi";
import { RxCross1 } from "react-icons/rx";
import { IoIosSearch } from "react-icons/io";
import { Link } from 'react-router-dom';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useContext } from 'react';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import nigeria from '/niger-icon.png';
import { context } from '../../contextApi/Modal';

const Navigation = () => {
  const { handleToggle } = useContext(context)
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const user = useAuthUser()

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };
  const [isOpen, setIsOpen] = useState(false)
  const isAuth = useIsAuthenticated()

  return (
    <div className="bg-white shadow-md py-4">
      <ul className="container mx-auto flex items-center justify-between px-4 md:px-8 gap-2">
        <li>
          <Link to='/'>
            <h1 className="text-xl font-bold text-gray-800">LOGO</h1>
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
            {!isSearchOpen && (
              <div className="flex items-center p-2 rounded-r-lg">
                <span className="flex gap-1">
                  <img src={nigeria} width={20} alt="Nigeria flag" /> NGN
                </span>
              </div>
            )}
            
          </div>
        </li>
        
        {/* User and Cart Section */}
        <li className="flex items-center gap-6">
          <div className="flex items-center">
            {
              isAuth ? (
                <Link to='/cart'>
                  <PiShoppingCartLight className="hover:text-blue-500 transition duration-200 cursor-pointer text-2xl" />
              </Link>
              ): <></>
            }
            
          </div>
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
