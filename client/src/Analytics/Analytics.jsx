// src/components/OrdersChart.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, ResponsiveContainer } from 'recharts';
import { useSpring, animated } from 'react-spring';

const API_URL = `${import.meta.env.VITE_APP_BACKEND_BASEURL}/orders`; // Update with your actual API endpoint

// display chart function
const OrdersChart = () => {
  const [data, setData] = useState([]);
  const [timeFrame, setTimeFrame] = useState('day');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTimeFrame, setActiveTimeFrame] = useState('day');
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalEmailSubs, setTotalEmailSubs] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)

  const fetchData = async () => {
    setIsLoading(true);
    try {

      const localtoken = localStorage.getItem('_auth');

      const response = await axios.get(`${API_URL}/${timeFrame}`, {
        headers: {
          'Authorization': `Bearer ${localtoken}`
        }
      });
      const getAllTotal = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/total/data`, {
        headers: {
          'Authorization': `Bearer ${localtoken}`
        }
      })
      setTotalOrders(getAllTotal.data.totalOrders)
      setTotalProducts(getAllTotal.data.totalProducts)
      setTotalEmailSubs(getAllTotal.data.totalEmails)
      setData(response.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeFrame]);

  const animationProps = useSpring({
    opacity: isLoading ? 0.5 : 1,
    transform: isLoading ? 'scale(0.95)' : 'scale(1)',
    config: { tension: 250, friction: 20 }
  });

  // Formatting function for x-axis labels based on time frame
  const formatXAxis = (tick) => {
    if (timeFrame === 'day') {
      return tick; // days are already formatted
    } else if (timeFrame === 'week') {
      return `Week ${tick}`;
    } else if (timeFrame === 'month') {
      return tick;
    } else if (timeFrame === 'year') {
      return tick;
    }
    return tick;
  };

  const ModifyClick = (timeFrame) => {
    setTimeFrame(timeFrame);
    setActiveTimeFrame(timeFrame);
  };

  return (
    <div className="w-full mx-auto p-4 bg-white shadow-lg rounded-lg">
      <div className="w-full mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-500 p-6 shadow-lg rounded-lg flex flex-col items-center text-white">
            <div className="text-2xl font-bold">Total Products</div>
            <div className="text-xl mt-2">{totalProducts}</div>
          </div>
          <div className="bg-green-500 p-6 shadow-lg rounded-lg flex flex-col items-center text-white">
            <div className="text-2xl font-bold">Total Orders</div>
            <div className="text-xl mt-2">{totalOrders}</div>
          </div>
          <div className="bg-purple-500 p-6 shadow-lg rounded-lg flex flex-col items-center text-white">
            <div className="text-2xl font-bold">Subscriptions</div>
            <div className="text-xl mt-2">{totalEmailSubs}</div>
          </div>
        </div>
      </div>


      <div className="mb-4 flex gap-2">
        {['day', 'week', 'month', 'year'].map((frame) => (
          <button 
            key={frame}
            onClick={() => ModifyClick(frame)}
            className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              activeTimeFrame === frame 
                ? 'bg-blue-950 text-white'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {frame.charAt(0).toUpperCase() + frame.slice(1)}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%">
        <animated.div style={animationProps}>
          <AreaChart
            width={1000}
            height={500}
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={timeFrame === 'day' ? "day" : timeFrame === 'week' ? "week" : timeFrame === 'month' ? "month" : "date"} tickFormatter={formatXAxis} angle={0} textAnchor="end" dy={10}>
              <Label value={timeFrame === 'day' ? "Days of Week" : timeFrame === 'week' ? "Weeks of Year" : timeFrame === 'month' ? "Months of Year" : "Year"} offset={-10} position="insideBottom" className="text-gray-700 font-semibold" />
            </XAxis>
            <YAxis>
              <Label value="Total Orders" angle={-90} position="insideLeft" className="text-gray-700 font-semibold" />
            </YAxis>
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="totalOrders" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </animated.div>
      </ResponsiveContainer>
      
    </div>
  );
};

export default OrdersChart;
