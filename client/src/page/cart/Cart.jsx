import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import airpod from '/assets/1.jpg';
import apple_glass from '/assets/apple_glass.png';
import apple_watch from '/assets/Apple_.jpg';
import iphone from '/assets/iphon.png';
import femaledress from '/assets/femaledress.jpg';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: 'Stylish Jacket',
            image: airpod,
            size: 'M',
            color: 'Black',
            quantity: 1,
            price: 59.99,
        },
        {
            id: 2,
            name: 'Classic Watch',
            image: iphone,
            size: 'N/A',
            color: 'Silver',
            quantity: 1,
            price: 129.99,
        },
        {
            id: 3,
            name: 'apple watch',
            image: apple_watch,
            size: 'N/A',
            color: 'Silver',
            quantity: 1,
            price: 129.99,
        }
    ]);

    const handleClearCart = () => {
        setCartItems([]);
    };

    const handleIncreaseQuantity = (id) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        ));
    };

    const handleDecreaseQuantity = (id) => {
        setCartItems(cartItems.map(item =>
            item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        ));
    };

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    return (
        <div className="container mx-auto p-8 min-h-screen">
            <h1 className="text-4xl font-bold text-gray-800 mb-10">Shopping Cart</h1>
            {cartItems.length > 0 ? (
                <>
                    <div className="flex justify-between mb-8">
                        <button
                            onClick={handleClearCart}
                            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                        >
                            Clear Cart
                        </button>
                        <div className="text-lg font-semibold text-gray-700">
                            Total: ${calculateTotalPrice()}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex p-6 shadow-md rounded-lg">
                                <img src={item.image} alt={item.name} className="w-40 h-40 object-cover rounded-md" />
                                <div className="ml-2 flex-1">
                                    <h2 className="text-2xl font-medium text-gray-800">{item.name}</h2>
                                    <p className="text-gray-600">Size: {item.size}</p>
                                    <p className="text-gray-600">Color: {item.color}</p>
                                    <div className="mt-4 flex items-center">
                                        <button
                                            onClick={() => handleDecreaseQuantity(item.id)}
                                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-l-md hover:bg-gray-400 transition duration-300"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1 border-t border-b border-gray-300">{item.quantity}</span>
                                        <button
                                            onClick={() => handleIncreaseQuantity(item.id)}
                                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-r-md hover:bg-gray-400 transition duration-300"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="mt-4 flex justify-between items-center">
                                        <p className="text-lg font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 flex justify-around items-center gap-4">
                        <Link to="/">
                          <button className="px-6 py-3 bg-gray-950 text-white rounded-md hover:bg-gray-600 transition duration-300">
                            Continue Shopping
                          </button>
                        </Link>
                        <Link to="/checkout">
                          <button className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300">
                              Proceed to Checkout
                          </button>
                        </Link>
                    </div>
                </>
            ) : (
                <div className="text-center mt-20">
                    <p className="text-2xl text-gray-700">Your cart is empty.</p>
                    <Link to="/">
                      <button className="mt-8 px-6 py-3 bg-gray-950 text-white rounded-md hover:bg-gray-600 transition duration-300">
                        Continue Shopping
                      </button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CartPage;
