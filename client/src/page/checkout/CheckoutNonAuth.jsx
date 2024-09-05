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
  const isAuth = useIsAuthenticated()
  const getQueryParams = () => {
    const queryParams = new URLSearchParams(location.search);
    return {
      color: queryParams.get('color'),
      size: queryParams.get('size'),
      quantity: queryParams.get('quantity'),
    };
  };
  const [loading, setLoading] = useState(false)

  const { color, size, quantity } = getQueryParams();
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/products/${productId}`, { withCredentials: true });
        setProduct(response.data.product);
        setTotalAmount(response.data.product.price * 100);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const popup = new PaystackPop();
    try {
      const qty = Number(quantity)
      popup.newTransaction({
        key: import.meta.env.VITE_APP_PAYSTACK_USER,
        email: shippingDetails.email,
        amount: qty * totalAmount,
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
                status: 'Paid'
              }, { withCredentials: true });
              toast.success(response.data.message)
            } else {
              const getLocalCart = JSON.parse(localStorage.getItem('items') || '[]')
              const respose = await axios.post(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/order/add`, { cart: getLocalCart, status: transaction.success, shippingDetails })

              console.log(respose.data)
            }
            
          } catch (error) {
            toast.error('Payment verification failed:');
          }
        },
        onCancel: () => {
          toast.error('Payment cancelled');
        },
        onError: (error) => {
          toast.error('Payment error')
        },
      });
    } catch (error) {
      toast.error('Paystack issues')
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
            {/* <label className='inline-flex items-center ml-6'>
              <input
                type="radio"
                name='payment'
                value="stripe"
                className='form-radio h-4 w-4 text-gray-600 focus:ring-blue-500 border-gray-300'
                checked
                readOnly
              />
              <span className='ml-2 text-sm md:text-base'>Stripe</span>
            </label> */}
          </div>
          <button
            type="submit"
            className="bg-gray-950 text-white py-3 px-6 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm md:text-base transition-colors w-full md:w-auto"
          >
            Place Order
          </button>
        </form>
      </div>
      <Toaster />
    </div>
  );
};

export default CheckoutNonAuth;
