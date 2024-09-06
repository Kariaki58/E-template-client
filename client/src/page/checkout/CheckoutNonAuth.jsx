import React, { useState, useEffect } from 'react';
import PaystackPop from '@paystack/inline-js';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';

const CheckoutNonAuth = () => {
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
  const [product, setProduct] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const { id: productId } = useParams();
  const isAuth = useIsAuthenticated();
  const [loading, setLoading] = useState(false);

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0); // percentage discount
  const [shippingFee, setShippingFee] = useState(1000);

  const getQueryParams = () => {
    const queryParams = new URLSearchParams(window.location.search);
    return {
      color: queryParams.get('color'),
      size: queryParams.get('size'),
      quantity: queryParams.get('quantity'),
    };
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

  const { color, size, quantity } = getQueryParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/products/${productId}`, { withCredentials: true });
        setProduct(response.data.product);
        setTotalAmount(response.data.product.price * quantity); // Adjust total based on quantity
      } catch (error) {
        toast.error('Error fetching product details');
      }
    };

    fetchProduct();
  }, [productId, quantity]);

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
        toast.error('Error fetching shipping details');
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
  };

  const calculateDiscountedPrice = () => {
    if (!product) return 0;
    const productTotal = product.price * quantity;
    const discountAmount = productTotal * (discount / 100);
    return productTotal - discountAmount;
  };

  const calculateTotalAmount = () => {
    const discountedPrice = calculateDiscountedPrice();
    return discountedPrice + shippingFee;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const popup = new PaystackPop();
    try {
      popup.newTransaction({
        key: import.meta.env.VITE_APP_PAYSTACK_USER,
        email: shippingDetails.email,
        amount: calculateTotalAmount() * 100, // Total in kobo (Paystack requires this)
        channels: ['card', 'bank', 'ussd', 'qr', 'eft', 'mobile_money', 'bank_transfer'],
        onSuccess: async (transaction) => {
          try {
            if (isAuth) {
              const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/order/place`, {
                productId,
                color,
                size,
                quantity,
                shippingDetails,
                status: 'Paid',
              }, { withCredentials: true });
              toast.success(response.data.message);
            } else {
              const getLocalCart = JSON.parse(localStorage.getItem('items') || '[]');
              const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/order/add`, {
                cart: getLocalCart,
                status: transaction.success,
                shippingDetails,
              });
              toast.success(response.data.message);
            }
          } catch (error) {
            const errorMessage = error.response?.data?.error || 'Payment verification failed';
            toast.error(errorMessage);
          }
        },
        onCancel: () => {
          toast.error('Payment cancelled');
        },
        onError: () => {
          toast.error('Payment error');
        },
      });
    } catch (error) {
      toast.error('Paystack issues');
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 lg:p-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
        <div className="rounded-lg p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Order Summary</h2>
          {product ? (
            <div>
              <ul className="space-y-4">
                <li className="flex justify-between items-center border-b pb-2">
                  <img src={product.images[0]} className="h-10" alt={product.name} />
                  <span>{quantity} x {formatPrice(product.price.toFixed(2))}</span>
                  <span>{formatPrice(product.price.toFixed(2) * quantity)}</span>
                </li>
              </ul>
            </div>
          ) : (
            <div>Loading product details...</div>
          )}
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
            <span className="text-lg md:text-xl font-semibold">{formatPrice(calculateTotalAmount())}</span>
          </div>
        </div>
      </div>
      <div className="rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Shipping Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 mb-8">
            {Object.keys(shippingDetails).map((key) => (
              <div key={key}>
                <label htmlFor={key} className="block mb-2 text-sm md:text-base font-medium">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  type={key === 'phone' ? 'tel' : 'text'}
                  id={key}
                  name={key}
                  value={shippingDetails[key]}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-md py-2 px-3"
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-md font-semibold text-lg"
          >
            place Order
          </button>
        </form>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default CheckoutNonAuth;
