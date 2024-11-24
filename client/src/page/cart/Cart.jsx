// cart checkout page
import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../contextApi/cartContext';
import { RotatingLines } from 'react-loader-spinner';

const CartPage = () => {
    const { cartItems, incrementCart, decrementCart, removeFromCart, clearCart, loading, error, fetchCartItems } = useContext(CartContext);

    const handleIncreaseQuantity = (pid, quantity, pos) => {
        incrementCart(pid, quantity, pos);
    };

    const handleDecreaseQuantity = (pid, quantity, pos) => {
        decrementCart(pid, quantity, pos);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
        }).format(price);
    };

    if (loading) {
        return (
          <div className='flex justify-center items-center mt-2'>
            <RotatingLines
              visible={true}
              height="96"
              width="96"
              color="grey"
              strokeWidth="5"
              animationDuration="0.75"
              ariaLabel="rotating-lines-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        )
    }

    if (error) {
        return <div className='text-red-700 text-2xl'>error</div>
    }
    
    return (
        <div className="container mx-auto p-4 sm:p-8 min-h-screen">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-6 sm:mb-10">Shopping Cart</h1>
            {cartItems && cartItems.items && cartItems.items?.length > 0 ? (
                <>
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
                        <button
                            onClick={() => clearCart(cartItems._id)}
                            className="px-4 py-2 sm:px-6 sm:py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 text-sm sm:text-base"
                        >
                            Clear Cart
                        </button>
                        <div className="text-lg sm:text-xl font-semibold text-gray-700 mt-4 sm:mt-0">
                            Total: {formatPrice(cartItems.totalPrice)}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:gap-8">
                        {cartItems && cartItems.items && cartItems.items.map((item, index) => (
                            <div key={item._id} className="flex gap-2 flex-row p-4 sm:p-6 shadow-md rounded-lg">
                                <Link to={`/products/content/${item.productId._id}`}>
                                    <img src={item.productId.images[0]} alt={item.productId.name} className="w-40 h-40 object-cover rounded-md" />
                                </Link>
                                <div className="ml-0 sm:ml-4 flex-1 mt-4 sm:mt-0">
                                    <h2 className="text-xl sm:text-2xl font-medium text-gray-800">{item.productId.name}</h2>
                                    {item.size && <p className="text-gray-800"><span>Size:</span> <span className="font-semibold">{item.size}</span></p>}
                                    {item.color && <p className="text-gray-800 text-sm"><span>Color:</span> <span className="font-semibold">{item.color}</span></p>}
                                    <div className="mt-4 flex items-center justify-center space-x-2">
                                        <button
                                            onClick={() => handleDecreaseQuantity(item.productId._id, 1, index)}
                                            className="px-3 py-2 bg-primary text-black font-bold text-xl rounded-md hover:bg-primary-dark transition-all duration-300 ease-in-out flex items-center justify-center shadow-md transform hover:scale-105"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded-md text-lg font-semibold shadow-sm">{item.quantity}</span>
                                        <button
                                            onClick={() => handleIncreaseQuantity(item.productId._id, 1, index)}
                                            className="px-3 py-2 bg-primary text-black font-bold text-xl rounded-md hover:bg-primary-dark transition-all duration-300 ease-in-out flex items-center justify-center shadow-md transform hover:scale-105"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="mt-4 flex justify-between items-center">
                                        <p className="text-lg sm:text-xl font-semibold text-gray-800">
                                            {formatPrice((parseFloat(item.price) * item.quantity).toFixed(2))}
                                        </p>
                                        <button
                                            onClick={() => removeFromCart(index, item._id)}
                                            className="text-red-500 hover:text-red-700 transition duration-300 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-around items-center gap-4">
                        <Link to="/">
                            <button className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-950 text-white rounded-md hover:bg-gray-600 transition duration-300 text-sm sm:text-base">
                                Continue Shopping
                            </button>
                        </Link>
                        <Link to="/checkout">
                            <button className="px-4 py-2 sm:px-6 sm:py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 text-sm sm:text-base">
                                Proceed to Checkout
                            </button>
                        </Link>
                    </div>
                </>
            ) : (
                <div className="text-center mt-10 sm:mt-20">
                    <p className="text-xl sm:text-2xl text-gray-700">Your cart is empty.</p>
                    <Link to="/">
                        <button className="mt-6 sm:mt-8 px-4 py-2 sm:px-6 sm:py-3 bg-gray-950 text-white rounded-md hover:bg-gray-600 transition duration-300 text-sm sm:text-base">
                            Continue Shopping
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CartPage;
