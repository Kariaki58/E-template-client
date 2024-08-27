import React, { useContext, useEffect, useState } from 'react';
import PaystackPop from '@paystack/inline-js';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { CartContext } from '../../contextApi/cartContext';

const Checkout = () => {
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);
  const { cartItems, loading: cartloading } = useContext(CartContext);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('payStack');

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/address`, { withCredentials: true });
        const {
          address,
          city,
          state,
          zipCode,
          country,
          phoneNumber,
          email,
          name,
        } = response.data.message;

        setShippingDetails({
          name,
          email,
          address,
          city,
          state,
          zip: zipCode,
          country,
          phone: phoneNumber,
        });
      } catch (error) {
        console.error('Error fetching shipping details:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalAmount = calculateTotalAmount() * 100; // Convert to kobo for Paystack

    if (selectedPaymentMethod === 'payStack') {
      handlePaystackPayment(totalAmount);
    } else if (selectedPaymentMethod === 'flutterwave') {
      handleFlutterwavePayment(totalAmount);
    } else if (selectedPaymentMethod === 'paypal') {
      handlePaypalPayment(totalAmount);
    } else if (selectedPaymentMethod === 'stripe') {
      handleStripePayment(totalAmount);
    }
  };

  const handlePaystackPayment = (totalAmount) => {
    const popup = new PaystackPop();

    popup.newTransaction({
      key: 'pk_test_fe3c7c857fbdf1e647efae4259d89937f3914562',
      email: shippingDetails.email,
      amount: totalAmount,
      channels: ['card', 'bank', 'ussd', 'qr', 'eft', 'mobile_money', 'bank_transfer'],
      onSuccess: async (transaction) => {
        try {
          const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/order`,
            { cartId: cartItems._id, shippingDetails, status: transaction.success }, { withCredentials: true }
          );
          console.log('Order successful:', response.data);
        } catch (error) {
          console.error('Payment verification failed:', error.message);
        }
      },
      onCancel: () => {
        console.log('Payment cancelled');
      },
      onError: (error) => {
        console.error('Payment error:', error.message);
      },
    });
  };

  const handleFlutterwavePayment = (totalAmount) => {
    // Implement Flutterwave payment logic
  };

  const handlePaypalPayment = (totalAmount) => {
    // Implement Paypal payment logic
  };

  const handleStripePayment = (totalAmount) => {
    // Implement Stripe payment logic
  };

  if (cartloading) {
    return <div>loading...</div>
  }

  const calculateTotalAmount = () => {
    if (!cartItems.items) {
      return []
    }
    return cartItems.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 lg:p-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      <div className="rounded-lg p-6 mb-10">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Order Summary</h2>
        <ul className="space-y-4">
          {cartItems.items && cartItems.items.length ? (
            cartItems.items.map((item, index) => (
              <li key={index} className="flex justify-between items-center border-b pb-2">
                <img src={item.productId.images[0]} className="h-10" alt={item.productId.name} />
                <span>{item.quantity} x {formatPrice(item.price.toFixed(2))}</span>
                <span>{formatPrice((item.price * item.quantity).toFixed(2))}</span>
              </li>
            ))
          ) : (
            <div>No items in the cart.</div>
          )}
        </ul>
        <div className="flex justify-between items-center mt-4 pt-4">
          <span className="text-lg md:text-xl font-semibold">Total:</span>
          <span className="text-lg md:text-xl font-semibold">{formatPrice(calculateTotalAmount())}</span>
        </div>
      </div>

      <div className="rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Shipping Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 mb-8">
            {/* Shipping details input fields */}
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block mb-2 text-sm md:text-base font-medium">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Full name"
                value={shippingDetails.name}
                onChange={handleChange}
                className="border border-gray-300 rounded-md w-full py-2 px-3 text-sm md:text-base focus:outline-none focus:border-gray-500"
                required
              />
            </div>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-2 text-sm md:text-base font-medium">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={shippingDetails.email}
                onChange={handleChange}
                className="border border-gray-300 rounded-md w-full py-2 px-3 text-sm md:text-base focus:outline-none focus:border-gray-500"
                required
              />
            </div>
            {/* Address */}
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="address" className="block mb-2 text-sm md:text-base font-medium">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Street number, house number, or more information"
                value={shippingDetails.address}
                onChange={handleChange}
                className="border border-gray-300 rounded-md w-full py-2 px-3 text-sm md:text-base focus:outline-none focus:border-gray-500"
                required
              />
            </div>
            {/* City */}
            <div>
              <label htmlFor="city" className="block mb-2 text-sm md:text-base font-medium">City</label>
              <input
                type="text"
                id="city"
                name="city"
                placeholder="City"
                value={shippingDetails.city}
                onChange={handleChange}
                className="border border-gray-300 rounded-md w-full py-2 px-3 text-sm md:text-base focus:outline-none focus:border-gray-500"
                required
              />
            </div>
            {/* Country */}
            <div>
              <label htmlFor="country" className="block mb-2 text-sm md:text-base font-medium">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                placeholder="Country"
                value={shippingDetails.country}
                onChange={handleChange}
                className="border border-gray-300 rounded-md w-full py-2 px-3 text-sm md:text-base focus:outline-none focus:border-gray-500"
                required
              />
            </div>
            {/* State */}
            <div>
              <label htmlFor="state" className="block mb-2 text-sm md:text-base font-medium">State</label>
              <input
                type="text"
                id="state"
                name="state"
                placeholder="State"
                value={shippingDetails.state}
                onChange={handleChange}
                className="border border-gray-300 rounded-md w-full py-2 px-3 text-sm md:text-base focus:outline-none focus:border-gray-500"
                required
              />
            </div>
            <div>
              <input
                type="text"
                id="zip"
                name="zip"
                placeholder="ZIP Code"
                value={shippingDetails.zip}
                onChange={handleChange}
                className="border border-gray-300 rounded-md w-full py-2 px-3 text-sm md:text-base focus:outline-none focus:border-gray-500"
                />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="phone" className="block mb-2 text-sm md:text-base font-medium">Phone Number</label>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="Phone number"
                value={shippingDetails.phone}
                onChange={handleChange}
                className="border border-gray-300 rounded-md w-full py-2 px-3 text-sm md:text-base focus:outline-none focus:border-gray-500"
                required
              />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Payment Method</h2>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="payStack"
                  name="paymentMethod"
                  value="payStack"
                  checked={selectedPaymentMethod === 'payStack'}
                  onChange={() => setSelectedPaymentMethod('payStack')}
                  className="mr-2"
                />
                <label htmlFor="payStack" className="text-sm md:text-base">Paystack</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="flutterwave"
                  name="paymentMethod"
                  value="flutterwave"
                  checked={selectedPaymentMethod === 'flutterwave'}
                  onChange={() => setSelectedPaymentMethod('flutterwave')}
                  className="mr-2"
                />
                <label htmlFor="flutterwave" className="text-sm md:text-base">Flutterwave</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="paypal"
                  name="paymentMethod"
                  value="paypal"
                  checked={selectedPaymentMethod === 'paypal'}
                  onChange={() => setSelectedPaymentMethod('paypal')}
                  className="mr-2"
                />
                <label htmlFor="paypal" className="text-sm md:text-base">PayPal</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="stripe"
                  name="paymentMethod"
                  value="stripe"
                  checked={selectedPaymentMethod === 'stripe'}
                  onChange={() => setSelectedPaymentMethod('stripe')}
                  className="mr-2"
                />
                <label htmlFor="stripe" className="text-sm md:text-base">Stripe</label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-950 text-white py-3 px-4 rounded-md font-semibold text-lg hover:bg-gray-700 transition duration-300"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Complete Purchase'}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Checkout;