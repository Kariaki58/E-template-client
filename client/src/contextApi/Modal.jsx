import React, { useState } from 'react';
import { createContext } from 'react';


export const context = createContext()

const Modal = ({children}) => {
    const [isOpen, setIsOpen] = useState(false)
    const handleToggle = () => {
        setIsOpen(prev => !prev)
    }
  return (
    <context.Provider value={{isOpen, setIsOpen, handleToggle}}>
      {children}
    </context.Provider>
  );
}

export default Modal;
