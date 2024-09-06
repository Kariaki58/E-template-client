import React, { useContext, useEffect, useState } from 'react';
import PaystackPop from '@paystack/inline-js';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { CartContext } from '../../contextApi/cartContext';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';

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
  const isAuth = useIsAuthenticated();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [shippingFee, setShippingFee] = useState(1000);

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

  const calculateTotalAmount = () => {
    if (!cartItems.items) {
      return 0;
    }
    return cartItems.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
              { cartId: cartItems._id, shippingDetails, status: transaction.status }, { withCredentials: true }
            );
            toast.success(response.data.message);
          } else {
            const getLocalCart = JSON.parse(localStorage.getItem('items') || '[]');
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/order/add`, { cart: getLocalCart, shippingDetails, status: transaction.status, couponCode });
            if (response.data.error) {
              toast.error(response.data.error);
            } else { 
              toast.success(response.data.message);
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
        <div className='rounded-lg p-6 mb-10'>
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
              className="border rounded-md py-2 px-3 mt-2 w-full"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <button
              className="mt-2 bg-gray-900 text-white py-2 px-4 rounded-md"
              onClick={handleCouponApply}
            >
              Apply Coupon
            </button>
          </div>
          <div className="flex justify-between items-center mt-4 pt-4">
            <span className="text-lg md:text-xl font-semibold">Shipping Fee:</span>
            <span className="text-lg md:text-xl font-semibold">{formatPrice(shippingFee)}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-lg md:text-xl font-semibold">Discount:</span>
            <span className="text-lg md:text-xl font-semibold">{discount}%</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-lg md:text-xl font-semibold">Total:</span>
            <span className="text-lg md:text-xl font-semibold">{formatPrice(calculateTotalAmount() - (discount / 100 * calculateTotalAmount()) + shippingFee)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Shipping Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 mb-8">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="border rounded-md py-2 px-3 w-full"
                value={shippingDetails.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="border rounded-md py-2 px-3 w-full"
                value={shippingDetails.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="address" className="block mb-2 text-sm font-medium">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                className="border rounded-md py-2 px-3 w-full"
                value={shippingDetails.address}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="city" className="block mb-2 text-sm font-medium">City</label>
              <input
                type="text"
                id="city"
                name="city"
                className="border rounded-md py-2 px-3 w-full"
                value={shippingDetails.city}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="state" className="block mb-2 text-sm font-medium">State</label>
              <input
                type="text"
                id="state"
                name="state"
                className="border rounded-md py-2 px-3 w-full"
                value={shippingDetails.state}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="zip" className="block mb-2 text-sm font-medium">Zip Code</label>
              <input
                type="text"
                id="zip"
                name="zip"
                className="border rounded-md py-2 px-3 w-full"
                value={shippingDetails.zip}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="country" className="block mb-2 text-sm font-medium">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                className="border rounded-md py-2 px-3 w-full"
                value={shippingDetails.country}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block mb-2 text-sm font-medium">Phone Number</label>
              <input
                type="text"
                id="phone"
                name="phone"
                className="border rounded-md py-2 px-3 w-full"
                value={shippingDetails.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold">Payment Method</h3>
            <div className="space-y-4 mt-4">
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="payStack"
                  checked={selectedPaymentMethod === 'payStack'}
                  onChange={() => setSelectedPaymentMethod('payStack')}
                />
                Paystack
              </label>
              {/* <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="flutterwave"
                  checked={selectedPaymentMethod === 'flutterwave'}
                  onChange={() => setSelectedPaymentMethod('flutterwave')}
                />
                Flutterwave
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={selectedPaymentMethod === 'paypal'}
                  onChange={() => setSelectedPaymentMethod('paypal')}
                />
                Paypal
              </label>
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={selectedPaymentMethod === 'stripe'}
                  onChange={() => setSelectedPaymentMethod('stripe')}
                />
                Stripe
              </label> */}
            </div>
          </div>

          <button
            type="submit"
            className={`py-2 px-4 w-full block rounded-md text-white ${loading ? 'bg-gray-500' : 'bg-gray-900'}`}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </form>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default Checkout;
