import React, { useState, useEffect } from 'react';
import PaystackPop from '@paystack/inline-js';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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
  const getQueryParams = () => {
    const queryParams = new URLSearchParams(location.search);
    return {
      color: queryParams.get('color'),
      size: queryParams.get('size'),
      quantity: queryParams.get('quantity'),
    };
  };

  const { color, size, quantity } = getQueryParams();
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/products/${productId}`, { withCredentials: true });
        setProduct(response.data.message);
        setTotalAmount(response.data.message.price * 100);
      } catch (error) {
        console.error('Error fetching product details:', error.message);
      }
    };

    fetchProduct();
  }, [productId]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const popup = new PaystackPop();
    try {
      const qty = Number(quantity)
      popup.newTransaction({
        key: 'pk_test_fe3c7c857fbdf1e647efae4259d89937f3914562',
        email: shippingDetails.email,
        amount: qty * totalAmount,
        channels: ['card', 'bank', 'ussd', 'qr', 'eft', 'mobile_money', 'bank_transfer'],
        onSuccess: async (transaction) => {
          try {
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/order/place`, {
              productId,
              color,
              size,
              quantity,
              shippingDetails,
              status: 'Paid'
            }, { withCredentials: true });
            console.log(response.data);
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
    } catch (error) {

    } finally {

    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 lg:p-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      <div className="rounded-lg p-6 mb-10">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Order Summary</h2>
        <ul className="space-y-4">
          {product ? (
            <li className="flex justify-between items-center border-b pb-2">
              <img src={product.images[0]} className="h-10" alt={product.name} />
              <span>{quantity} x {formatPrice(product.price.toFixed(2))}</span>
              <span>{formatPrice(quantity * (totalAmount / 100))}</span>
            </li>
          ) : (
            <div>Loading product details...</div>
          )}
        </ul>
        <div className="flex justify-between items-center mt-4 pt-4">
          <span className="text-lg md:text-xl font-semibold">Total:</span>
          <span className="text-lg md:text-xl font-semibold">{formatPrice(quantity * (totalAmount / 100))}</span>
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
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={shippingDetails[key]}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md w-full py-2 px-3 text-sm md:text-base focus:outline-none focus:border-gray-500"
                  required
                />
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Payment Method</h2>
          <div className="mb-8">
            <label className="inline-flex items-center ml-6">
              <input
                type="radio"
                name="payment"
                value="payStack"
                className="form-radio h-4 w-4 text-gray-600 focus:ring-blue-500 border-gray-300"
                checked
                readOnly
              />
              <span className="ml-2 text-sm md:text-base">PayStack</span>
            </label>
          </div>
          <button
            type="submit"
            className="bg-gray-950 text-white py-3 px-6 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm md:text-base transition-colors w-full md:w-auto"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
};

export default CheckoutNonAuth;
