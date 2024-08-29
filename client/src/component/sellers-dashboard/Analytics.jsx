import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Analytics = () => {
  const [data, setData] = useState(null);
  const [view, setView] = useState('daily');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/api/orders/analytics`, { withCredentials: true });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching analytics data", error);
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

  const generateChartData = (orders, label) => {
    return {
      labels: orders.map(order => formatLabel(order._id, view)),
      datasets: [
        {
          label: `Orders per ${label}`,
          data: orders.map(order => order.count),
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          fill: false,
        },
      ],
    };
  };

  const chartData = () => {
    switch (view) {
      case 'daily':
        return generateChartData(data?.dailyOrders, 'Day');
      case 'weekly':
        return generateChartData(data?.weeklyOrders, 'Week');
      case 'monthly':
        return generateChartData(data?.monthlyOrders, 'Month');
      case 'yearly':
        return generateChartData(data?.yearlyOrders, 'Year');
      default:
        return generateChartData(data?.dailyOrders, 'Day');
    }
  };

  return (
    <div className="p-2 mx-auto rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-2 text-gray-800">Order Analytics</h2>
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
      {data ? (
        <Line data={chartData()} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default Analytics;
