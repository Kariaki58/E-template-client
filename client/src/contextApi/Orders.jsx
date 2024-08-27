import axios from "axios";
import { createContext, useEffect, useState } from "react";
import React from 'react';

export const OrderContext = createContext();

const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch orders for the logged-in user
    const fetchUserOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/order/user`, { withCredentials: true });
            setOrders(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Add a new order
    const addOrder = async (orderData) => {
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/order`, orderData, { withCredentials: true });
            setOrders(prevOrders => [...prevOrders, response.data.order]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all orders (admin)
    const fetchAllOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/order/admin`, { withCredentials: true });
            setOrders(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch orders on component mount
    useEffect(() => {
        fetchUserOrders();
    }, []);

    return (
        <OrderContext.Provider value={{ orders, addOrder, fetchUserOrders, fetchAllOrders, loading, error }}>
            {children}
        </OrderContext.Provider>
    );
};

export default OrderProvider;
