import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch cart items from the backend
  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/cart`, { withCredentials: true });
        setCartItems(response.data.message);
      } catch (error) {
        setError('Error fetching cart items')
      } finally {
        setLoading(false)
      }
    };

    fetchCartItems();
  }, []);

  // Add item to cart
  const addToCart = async (productId, quantity, size = '', color = '') => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/cart/add`,
        { productId, quantity, size, color },
        { withCredentials: true });
      setCartItems(response.data.cart);
    } catch (error) {
      setError('Error adding item to cart')
    }
  };

  // Update item quantity
  const updateCartItemQuantity = async (cartItemId, quantity) => {
    try {
      await axios.put(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/cart/${cartItemId}`, { quantity }, { withCredentials: true });
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === cartItemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      setError('Error updating cart item');
    }
  };

  const clearCart = async (cartItemId) => {
    try {
      const respone = await axios.delete(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/cart/${cartItemId}`, { withCredentials: true })

      if (respone.data.error) {
        throw respone.data.error
      }
      setCartItems((prevItems) => respone.data.message)
    } catch (error) {
      if (error.respone && error.respone.data && error.respone.data.error)
        setError(error.respone.data.error)
      else
        setError('Error occured while clearing cart')
    }
  }

  const decrementCart = async (productId, quantity, pos) => {
    try {
        const response = await axios.patch(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/cart/decrement`, 
            { productId, quantity, pos }, 
            { withCredentials: true }
        );
        setCartItems(response.data.cart);
    } catch (error) {
        setError('Error incrementing cart');
    }
  }

  const incrementCart = async (productId, quantity, pos) => {
    try {
        const response = await axios.patch(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/cart/increment`, 
            { productId, quantity, pos }, 
            { withCredentials: true }
        );
        setCartItems(response.data.cart);
    } catch (error) {
        setError('Error incrementing cart');
    }
};

  // Remove item from cart
  const removeFromCart = async (pos, cartItemId) => {
    try {
      const response =  await axios.delete(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/delete/cart/${pos}/${cartItemId}`, { withCredentials: true });
      setCartItems(response.data.cart);
    } catch (error) {
      setError('Error removing item from cart');
    }
  };

  return (
    <CartContext.Provider value={{ cartItems,error, setError, addToCart, updateCartItemQuantity, removeFromCart, incrementCart, decrementCart, loading, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
