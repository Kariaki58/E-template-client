import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../contextApi/cartContext';

const CartPage = () => {
    const { cartItems, addToCart, updateCartItemQuantity, decrementCart, removeFromCart, clearCart , incrementCart} = useContext(CartContext);

    const handleIncreaseQuantity = (pid, quantity, pos) => {
        incrementCart(pid, quantity, pos)
    };

    const handleDecreaseQuantity = (pid, quantity, pos) => {
        decrementCart(pid, quantity, pos)
    };

    return (
        <div className="container mx-auto p-8 min-h-screen">
            <h1 className="text-4xl font-bold text-gray-800 mb-10">Shopping Cart</h1>
            {cartItems.items?.length > 0 ? (
                <>
                    <div className="flex justify-between mb-8">
                        <button
                            onClick={clearCart}
                            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                        >
                            Clear Cart
                        </button>
                        <div className="text-lg font-semibold text-gray-700">
                            Total: ${cartItems.totalPrice}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {cartItems.items.map((item, index) => (
                            <div key={item._id} className="flex p-6 shadow-md rounded-lg">
                                <img src={item.productId.images[0]} alt={item.productId.name} className="w-40 h-40 object-cover rounded-md" />
                                <div className="ml-2 flex-1">
                                    <h2 className="text-2xl font-medium text-gray-800">{item.productId.name}</h2>
                                    {
                                        item.size && <p className="text-gray-600">Size: {item.size}</p>
                                    }
                                    {
                                        item.color && <p className="text-gray-600">Color: {item.color}</p>
                                    }
                                    <div className="mt-4 flex items-center">
                                        <button
                                            onClick={() => handleDecreaseQuantity(item.productId._id, 1, index)}
                                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-l-md hover:bg-gray-400 transition duration-300"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1 border-t border-b border-gray-300">{item.quantity}</span>
                                        <button
                                            onClick={() => handleIncreaseQuantity(item.productId._id, 1, index)}
                                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-r-md hover:bg-gray-400 transition duration-300"
                                            
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="mt-4 flex justify-between items-center">
                                        <p className="text-lg font-semibold text-gray-800">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                                        <button
                                            onClick={() => removeFromCart(index, item._id)}
                                            className="text-red-500 hover:text-red-700 transition duration-300"
                                        >
                                            Remove
                                        </button>
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
