// checkout page
import React, { useContext, useEffect, useState } from 'react';
import PaystackPop from '@paystack/inline-js';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { CartContext } from '../../contextApi/cartContext';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import { useNavigate } from 'react-router-dom';


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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { cartItems, loading: cartloading } = useContext(CartContext);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('payStack');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const isAuth = useIsAuthenticated();

  const locations = [
    { place: 'Nigeria', amount: 1000 },
    // { place: 'Ghana', amount: 3000 }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
  };

  const handleCouponApply = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/apply-coupon`, { couponCode });
      const { discount } = response.data;
      setDiscount(discount);
      toast.success('Coupon applied successfully!');
    } catch (error) {
      toast.error(error.response?.data.error || 'Failed to apply coupon.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/address`, { withCredentials: true });
        const { address, city, state, zipCode, country, phoneNumber, email, name } = response.data.message;

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
        toast.error('Failed to fetch shipping details.');
      } finally {
        setLoading(false);
      }
    };
    if (isAuth) {
      fetchData();
    }
  }, [isAuth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleLocationChange = (e) => {
    const location = e.target.value;
    setSelectedLocation(location);
    const selectedFee = locations.find(loc => loc.place === location)?.amount || 0;
    setShippingFee(selectedFee);
  };

  const calculateTotalAmount = () => {
    if (!cartItems.items) {
      return 0;
    }
    return cartItems.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedLocation === '') {
      toast.error('Please select a pickup location before placing the order.');
      return;
    }

    const totalAmountBeforeDiscount = calculateTotalAmount();
    const discountedAmount = totalAmountBeforeDiscount * (1 - discount / 100);
    const totalAmount = discountedAmount + shippingFee;

    if (selectedPaymentMethod === 'payStack') {
      handlePaystackPayment(totalAmount * 100); // Paystack expects amount in kobo
    } else if (selectedPaymentMethod === 'flutterwave') {
      handleFlutterwavePayment(totalAmount * 100); // Implement Flutterwave payment logic
    } else if (selectedPaymentMethod === 'paypal') {
      handlePaypalPayment(totalAmount); // Implement Paypal payment logic
    } else if (selectedPaymentMethod === 'stripe') {
      handleStripePayment(totalAmount); // Implement Stripe payment logic
    }
  };

  const handlePaystackPayment = (totalAmount) => {
    const popup = new PaystackPop();

    popup.newTransaction({
      key: import.meta.env.VITE_APP_PAYSTACK_USER,
      email: shippingDetails.email,
      amount: totalAmount,
      channels: ['card', 'bank', 'ussd', 'qr', 'eft', 'mobile_money', 'bank_transfer'],
      onSuccess: async (transaction) => {
        try {
          if (isAuth) {
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/order`,
              { cartId: cartItems._id, shippingDetails, status: transaction.status, totalAmount }, { withCredentials: true }
            );
            toast.success(response.data.message);
          } else {
            const getLocalCart = JSON.parse(localStorage.getItem('items') || '[]');
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/order/add`, { cart: getLocalCart, shippingDetails, status: transaction.status, couponCode, totalAmount });
            if (response.data.error) {
              toast.error(response.data.error);
            } else { 
              toast.success(response.data.message);
              localStorage.setItem('items', []);
              navigate('/');
            }
          }
        } catch (error) {
          toast.error(error.response?.data.error || 'Payment verification failed');
        }
      },
      onCancel: () => {
        toast.error('Payment cancelled');
      },
      onError: (error) => {
        toast.error('Payment error');
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
    return <div>loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 lg:p-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
        <div className="rounded-lg p-6 mb-10 bg-white shadow-lg">
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
        </div>
        <div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Coupon Code</h3>
            <input
              type="text"
              className="border rounded-md py-2 px-3 mt-2 w-full bg-gray-100 focus:ring-2 focus:ring-gray-500 outline-none"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button
              className="mt-3 bg-gray-800 text-white py-2 px-5 rounded-md hover:bg-gray-700 transition duration-150"
              onClick={handleCouponApply}
            >
              Apply Coupon
            </button>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Pick up Location</h3>
            <select
              value={selectedLocation}
              onChange={handleLocationChange}
              className="border py-2 px-4 rounded-md w-full bg-gray-100 focus:ring-2 focus:ring-gray-500 outline-none"
            >
              <option value="">Select Location</option>
              {locations.map((location, index) => (
                <option key={index} value={location.place}>{location.place}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-between items-center mt-4 pt-4">
            <span className="font-semibold">Shipping Fee:</span>
            <span className="font-semibold">{formatPrice(shippingFee)}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="font-semibold">Discount:</span>
            <span className="font-semibold">{discount}%</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="font-semibold">Total:</span>
            <span className="font-semibold">{formatPrice(calculateTotalAmount() - (discount / 100 * calculateTotalAmount()) + shippingFee)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg p-6 bg-white shadow-lg mt-4">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Shipping Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 mb-8">
            {['name', 'email', 'address', 'city', 'state', 'zip', 'phone', 'country'].map((field) => (
              <div key={field}>
                <label className="block font-medium text-gray-800">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type="text"
                  name={field}
                  value={shippingDetails[field]}
                  onChange={handleChange}
                  className="w-full border rounded-md py-2 px-3 mt-2 bg-gray-100 focus:ring-2 focus:ring-gray-500 outline-none"
                  required
                />
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
            <select
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="border py-2 px-4 rounded-md w-full bg-gray-100 focus:ring-2 focus:ring-gray-500 outline-none"
            >
              <option value="payStack">PayStack</option>
              {/* <option value="flutterwave">Flutterwave</option>
              <option value="paypal">PayPal</option>
              <option value="stripe">Stripe</option> */}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500 transition duration-150"
          >
            Place Order
          </button>
        </form>
      </div>
      <Toaster />
    </div>
  );
};

export default Checkout;
