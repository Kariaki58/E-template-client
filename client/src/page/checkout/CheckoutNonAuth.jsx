// checkout for non authenticated users
import React, { useState, useEffect } from 'react';
import PaystackPop from '@paystack/inline-js';
import axios from 'axios';
import { useParams, useSearchParams } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import { useNavigate } from 'react-router-dom';


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
  const [selectedLocation, setSelectedLocation] = useState('');
  const [shippingFee, setShippingFee] = useState(0);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0); // percentage discount
  const { id: productId} = useParams();
  const isAuth = useIsAuthenticated();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();


  const locations = [
    { place: 'Nigeria', amount: 1000 },
    { place: 'Ghana', amount: 3000 }
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/products/${productId}`, { withCredentials: true });
        setProduct(response.data.product);
        setTotalAmount(response.data.product.price * (getQueryParams().quantity || 1)); // Adjust total based on quantity
      } catch (error) {
        toast.error('Error fetching product details');
      }
    };

    fetchProduct();
  }, [productId]);

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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const location = locations.find(loc => loc.place === selectedLocation);
    if (location) setShippingFee(location.amount);
  }, [selectedLocation]);

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

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

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
    const productTotal = product.price * (getQueryParams().quantity || 1);
    const discountAmount = productTotal * (discount / 100);
    return productTotal - discountAmount;
  };

  const calculateTotalAmount = () => {
    const discountedPrice = calculateDiscountedPrice();
    return discountedPrice + shippingFee;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedLocation === '') {
      toast.error('Please select a pickup location before placing the order.');
      return;
    }

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
                color: getQueryParams().color,
                size: getQueryParams().size,
                quantity: getQueryParams().quantity,
                shippingDetails,
                couponCode,
                totalAmount: calculateTotalAmount() * 100
              }, { withCredentials: true });
              toast.success(response.data.message);
            } else {
              const color = searchParams.get('color');
              const size = searchParams.get('size');
              const quantity = searchParams.get('quantity');

              const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/order/place`, {
                productId,
                color,
                size,
                quantity,
                shippingDetails,
                couponCode,
                totalAmount: calculateTotalAmount() * 100
              }, { withCredentials: true });
              toast.success(response.data.message);
              localStorage.setItem('items', [])
              navigate("/")
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
    <div className="container mx-auto p-6 md:p-10 lg:p-14 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Order Summary */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-3">Order Summary</h2>
          {product ? (
            <div>
              <ul className="space-y-4">
                <li className="flex justify-between items-center border-b pb-3">
                  <img src={product.images[0]} className="h-16 w-16 object-cover rounded-md" alt={product.name} />
                  <span className="text-lg font-medium">{(getQueryParams().quantity || 1)} x {formatPrice(product.price)}</span>
                  <span className="text-lg font-medium">{formatPrice(product.price * (getQueryParams().quantity || 1))}</span>
                </li>
              </ul>
            </div>
          ) : (
            <div>Loading product details...</div>
          )}
        </div>
        {/* Shipping and Coupon Section */}
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="mt-4">
            <h3 className="text-xl font-semibold text-gray-800">Pick up Location</h3>
            <select
              value={selectedLocation}
              onChange={handleLocationChange}
              className="border rounded-md py-2 px-4 mt-2 w-full bg-gray-100 focus:ring-2 focus:ring-gray-500 outline-none"
            >
              <option value="">Select your location</option>
              {locations.map((loc) => (
                <option key={loc.place} value={loc.place}>{loc.place}</option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-semibold text-gray-800">Coupon Code</h3>
            <input
              type="text"
              className="border rounded-md py-2 px-4 mt-2 w-full bg-gray-100 focus:ring-2 focus:ring-gray-500 outline-none"
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
          <div className="flex justify-between items-center mt-6">
            <span className="font-semibold text-gray-600">Shipping Fee:</span>
            <span className="font-semibold text-gray-800">{formatPrice(shippingFee)}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="font-semibold text-gray-600">Discount:</span>
            <span className="font-semibold text-gray-800">{discount}%</span>
          </div>
          <div className="flex justify-between items-center mt-4 border-t pt-4">
            <span className="text-2xl font-bold text-gray-800">Total:</span>
            <span className="text-2xl font-bold text-gray-800">{formatPrice(calculateTotalAmount())}</span>
          </div>
        </div>
      </div>
      {/* Shipping Form */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-3">Shipping Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {['name', 'email', 'address', 'city', 'state', 'zip', 'phone', 'country'].map((field) => (
              <div key={field}>
                <label className="block font-medium text-gray-800">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type="text"
                  name={field}
                  value={shippingDetails[field]}
                  onChange={handleChange}
                  className="border rounded-md py-2 px-4 mt-2 w-full bg-gray-100 focus:ring-2 focus:ring-gray-500 outline-none"
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-600 transition duration-150"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </form>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default CheckoutNonAuth;
