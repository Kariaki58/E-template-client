import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { RotatingLines } from 'react-loader-spinner';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [view, setView] = useState('daily');
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/api/orders/analytics`, { withCredentials: true });
        console.log(response.data)
        setData(response.data);
      } catch (error) {
        setError("Error fetching analytics data");
      }
    };

    fetchData();
  }, []);

  const handleViewChange = (event) => {
    setView(event.target.value);
  };

  const formatLabel = (label, view) => {
    if (view === 'daily') {
      return format(parseISO(label), 'MMM d, yyyy');
    } else if (view === 'weekly') {
      return `Week ${label}`;
    } else if (view === 'monthly') {
      return format(parseISO(label), 'MMM yyyy');
    } else if (view === 'yearly') {
      return `Year ${label}`;
    }
    return label;
  };

  const generateChartData = (orders) => {
    return orders.map(order => ({
      date: formatLabel(order._id, view),
      count: order.count,
    }));
  };

  const chartData = () => {
    switch (view) {
      case 'daily':
        return generateChartData(data?.dailyOrders);
      case 'weekly':
        return generateChartData(data?.weeklyOrders);
      case 'monthly':
        return generateChartData(data?.monthlyOrders);
      case 'yearly':
        return generateChartData(data?.yearlyOrders);
      default:
        return generateChartData(data?.dailyOrders);
    }
  };

  return (
    <div className="p-2 mx-auto rounded-lg shadow-md">
      <h2 className="md:text-2xl text-lg font-semibold mb-2 text-gray-800 text-center">Order Analytics</h2>
      <div className="mb-2">
        <label htmlFor="view" className="block text-gray-700 font-medium mb-2">Select View:</label>
        <select
          id="view"
          value={view}
          onChange={handleViewChange}
          className="block bg-gray-100 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-blue-500 transition duration-150 ease-in-out"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div className='text-red-500'>
        { error ? error : <></>}
      </div>
      {data ? (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData()}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area type="monotone" dataKey="count" stroke="#8884d8" fillOpacity={1} fill="url(#colorCount)" />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className='flex justify-center items-center mt-20'>
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
      )}
    </div>
  );
};

export default Analytics;
