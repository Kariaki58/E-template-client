import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaystackPop from '@paystack/inline-js';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const PaymentPlan = () => {
  const navigate = useNavigate();
  const popup = new PaystackPop();
  const [email, setEmail] = useState('');
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(null);

  const plans = [
    {
      name: 'Basic',
      price: '₦10000',
      features: ['Admin Page access', 'Receiving payment', 'Customize to your need'],
      buttonText: 'Choose Basic',
    },
    {
      name: 'Pro',
      price: '₦20000',
      features: ['All basic', 'Add Campaign', 'Email Automation', 'Optimize SEO and performance'],
      buttonText: 'Choose Pro',
    },
    {
      name: 'Enterprise',
      price: '₦50000',
      features: ['All Pro plan', 'Background image removal', 'Image upload optimization', 'Contact for more'],
      buttonText: 'Choose Enterprise',
    },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price.split('₦')[1]);
  };

  const handleEmailSubmit = () => {
    if (!email) {
      toast.error('Please enter a valid email address');
      return;
    }
    setShowEmailPopup(false);
    processPayment(selectedPlanIndex);
  };

  const processPayment = (index) => {
    popup.newTransaction({
      key: import.meta.env.VITE_APP_PAYSTACK_DEVELOPER,
      email: email,
      amount: Number(plans[index].price.split('₦')[1]) * 100,
      planInterval: 'monthly',
      subscriptionLimit: 1,
      onSuccess: async (transaction) => {
        const adding = { ...transaction, email }
        const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/make-admin`, adding, { withCredentials: true });

        if (response.data.error) {
          toast.error(response.data.error);
        } else {
          toast.success(response.data.message);
          setTimeout(() => {
            // navigate to a page, where you can get, cloudinary details, paystack, and maybe more
            navigate('/');
          }, 3000);
        }
      },
      onLoad: () => {},
      onCancel: () => {},
      onError: async () => {
        await axios.post(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/make-admin`, { statuserror: 'failed' });
        toast.error('Payment error');
      },
    });
  };

  const handlePlanSelection = (index) => {
    setSelectedPlanIndex(index);
    setShowEmailPopup(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Select Your Payment Plan</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800">{plan.name}</h2>
              <p className="text-2xl font-bold text-blue-600 my-4">{formatPrice(plan.price)}<span className="text-lg">/mo</span></p>
              <ul className="text-left mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="text-gray-600 my-2 flex items-center">
                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button onClick={() => handlePlanSelection(index)} className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-500">
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {showEmailPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter Your Email</h2>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex justify-end space-x-4">
              <button onClick={() => setShowEmailPopup(false)} className="bg-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-400">
                Cancel
              </button>
              <button onClick={handleEmailSubmit} className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-500">
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default PaymentPlan;
