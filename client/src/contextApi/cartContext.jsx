import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isAuth = useIsAuthenticated();

  const fetchCartItems = async () => {
    if (isAuth) {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/cart`, { withCredentials: true });
        setCartItems(response.data.cart);
      } catch (error) {
        if (error.response && error.response.data) {
          setError(error.response.data.error)
        } else {
          setError('Error fetching cart items');
        }
      } finally {
        setLoading(false);
      }
    } else {
      const cartItems = JSON.parse(localStorage.getItem('items') || '[]');
      const totalPrice = cartItems.reduce((sum, item) => {
        return sum + (item.productId.price - (item.productId.price * (item.productId.percentOff / 100))) * item.quantity
         
      }, 0);
      const data = { _id: '1', userId: '1', items: cartItems, totalPrice };
      setCartItems(data);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [isAuth]);

  const updateCartTotalPrice = (cart) => {
    return cart.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
  };

  const addToCart = async (productId, quantity, size = '', color = '', currentPage) => {
    try {
      if (isAuth) {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_BACKEND_BASEURL}/cart/add`,
          { productId, quantity, size, color },
          { withCredentials: true }
        );
        setCartItems(response.data.cart);
      } else {
        console.log(currentPage)
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}?page=${currentPage}`, { withCredentials: true });
        const product = response.data.message.find((item) => item._id === productId);

        if (product) {
          const cart = JSON.parse(localStorage.getItem('items') || '[]');
          const existingItemIndex = cart.findIndex(
            (item) =>
              item.productId._id === productId &&
              (!size || item.size === size) &&
              (!color || item.color === color)
          );

          if (existingItemIndex >= 0) {
            cart[existingItemIndex].quantity += quantity;
          } else {
            cart.push({
              productId: product,
              quantity,
              size,
              color,
              totalPrice: product.price - ((product.percentOff / 100) * product.price),
              price: product.price - ((product.percentOff / 100) * product.price)
            });
          }
          const totalPrice = updateCartTotalPrice(cart);
          localStorage.setItem('items', JSON.stringify(cart));
          setCartItems({ _id: '1', userId: '1', items: cart, totalPrice });
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error)
      } else {
        setError('Error adding item to cart');
      }
    }
  };

  const clearCart = async (id) => {
    try {
      if (isAuth) {
        await axios.delete(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/cart/${id}`, { withCredentials: true });
        setCartItems([]);
      } else {
        localStorage.removeItem('items');
        setCartItems([]);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error)
      } else {
        setError('Error clearing cart');
      }
    }
  };

  const decrementCart = async (productId, quantity, pos) => {
    try {
      if (isAuth) {
        const response = await axios.patch(
          `${import.meta.env.VITE_APP_BACKEND_BASEURL}/cart/decrement`,
          { productId, quantity, pos },
          { withCredentials: true }
        );
        setCartItems(response.data.cart);
      } else {
        const cart = JSON.parse(localStorage.getItem('items') || '[]');
        const itemIndex = cart.findIndex((item) => item.productId._id === productId);

        if (itemIndex >= 0 && cart[itemIndex].quantity > 1) {
          cart[itemIndex].quantity -= 1;
          const totalPrice = updateCartTotalPrice(cart);
          localStorage.setItem('items', JSON.stringify(cart));
          setCartItems({ _id: '1', userId: '1', items: cart, totalPrice });
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error)
      } else {
        setError('Error decrementing cart');
      }
    }
  };

  const incrementCart = async (productId, quantity, pos) => {
    try {
      if (isAuth) {
        const response = await axios.patch(
          `${import.meta.env.VITE_APP_BACKEND_BASEURL}/cart/increment`,
          { productId, quantity, pos },
          { withCredentials: true }
        );
        setCartItems(response.data.cart);
      } else {
        const cart = JSON.parse(localStorage.getItem('items') || '[]');
        const itemIndex = cart.findIndex((item) => item.productId._id === productId);

        if (itemIndex >= 0) {
          cart[itemIndex].quantity += 1;
          const totalPrice = updateCartTotalPrice(cart);
          localStorage.setItem('items', JSON.stringify(cart));
          setCartItems({ _id: '1', userId: '1', items: cart, totalPrice });
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error)
      } else {
        setError('Error incrementing cart');
      }
    }
  };

  const removeFromCart = async (pos, cartItemId) => {
    try {
      if (isAuth) {
        const response = await axios.delete(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/delete/cart/${pos}/${cartItemId}`, { withCredentials: true });
        setCartItems(response.data.cart);
      } else {
        const cart = JSON.parse(localStorage.getItem('items') || '[]');
        const updatedCart = cart.filter((item, index) => index !== pos);

        const totalPrice = updateCartTotalPrice(updatedCart);
        localStorage.setItem('items', JSON.stringify(updatedCart));
        setCartItems({ _id: '1', userId: '1', items: updatedCart, totalPrice });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error)
      } else {
        setError('Error removing item from cart');
      }
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, error, setError, fetchCartItems, addToCart, removeFromCart, incrementCart, decrementCart, loading, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
