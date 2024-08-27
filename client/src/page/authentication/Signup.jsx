import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RxCross1 } from 'react-icons/rx';
import { context } from '../../contextApi/Modal';
import axios from 'axios';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';


const SignupPage = () => {
    const { handleToggle } = useContext(context);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [error, setError] = useState('');
    const signIn = useSignIn();
    const navigate = useNavigate();

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (email === '' || password === '' || confirmPass === '') {
            setError('Please fill in all fields');
        } else if (!isValidEmail(email)) {
            setError('Please enter a valid email address');
        } else if (password !== confirmPass) {
            setError('Passwords do not match');
        } else {
            try {
                setError('');
                const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/register`, { email, password }, { withCredentials: true });
                const { message, token, isAdmin } = response.data;

                if (signIn({
                    auth: {
                        token,
                        type: 'Bearer'
                    },
                    userState: {
                        isAdmin
                    }
                })) {
                } else {
                    throw new Error('Failed to login');
                }
                toast.success(message)
                setTimeout(() => {
                    navigate('/')
                }, 2000)
            } catch (err) {
                toast.error('An error occurred during signup. Please try again.');
            }
        }
    };

    return (
        <div
            className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full md:inset-0 max-h-full bg-gray-900 bg-opacity-50"
            tabIndex="-1"
            aria-hidden="true"
        >
            <div className="m-10 flex items-center justify-center w-full">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
                    {error && (
                        <p className="text-red-500 text-center mb-4">{error}</p>
                    )}
                    <form onSubmit={handleSignup}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-bold mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-bold mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="confirmPassword" className="block text-sm font-bold mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                                placeholder="Confirm your password"
                                value={confirmPass}
                                onChange={(e) => setConfirmPass(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="w-full bg-gray-950 text-white py-2 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-300"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                    <p className="text-center mt-6">
                        Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Log In</Link>
                    </p>
                    <RxCross1 className='absolute top-10 right-10 text-2xl hover:cursor-pointer' onClick={handleToggle} />
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default SignupPage;
