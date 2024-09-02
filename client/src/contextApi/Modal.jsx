import React, { useState } from 'react';
import { createContext } from 'react';
import { useNavigate } from 'react-router-dom';


export const context = createContext()

const Modal = ({children}) => {
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()
    const handleToggle = () => {
        setIsOpen(prev => !prev)
        if (location.pathname === '/login' || location.pathname === '/sign-up') {
          navigate('/')
        }
    }
  return (
    <context.Provider value={{isOpen, setIsOpen, handleToggle}}>
      {children}
    </context.Provider>
  );
}

export default Modal;
