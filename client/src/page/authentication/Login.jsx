// login authentication page
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RxCross1 } from 'react-icons/rx';
import { useContext } from 'react';
import { context } from '../../contextApi/Modal';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';


const LoginPage = () => {
    const { handleToggle } = useContext(context)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false)
    const signIn = useSignIn()
    
    

    const handleLogin = async (e) => {
        e.preventDefault();
        if (email === '' || password === '') {
            setError('Please fill in all fields');
        } else {
            try {
                setLoading(true)
                setError('');

                let checkLocalCart = JSON.parse(localStorage.getItem('items') || '[]')

                if (checkLocalCart && checkLocalCart.length <= 0) {
                    checkLocalCart = null
                }
                const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/login`, { email, password, checkLocalCart }, { withCredentials: true })
                if (response.data.error) {
                    throw new Error(response.data.error)
                }
                const { message, token, isAdmin } = response.data
                toast.success(message)
                if (signIn({
                    auth: {
                        token,
                        type: 'Bearer'
                    },
                    userState: {
                        isAdmin
                    }
                })) {
                    setTimeout(() => {
                        window.location.reload()
                        navigate('/')
                    }, 2000)
                }
            } catch(err) {
                if (err.response && err.response.data)
                    toast.error(err.response.data.error)
                else
                    toast.error('something went wrong')
            } finally {
                setLoading(false)
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
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
                    {error && (
                        <p className="text-red-500 text-center mb-4">{error}</p>
                    )}
                    <form onSubmit={handleLogin}>
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
                        <div className="mb-6">
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
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="w-full bg-gray-950 text-white py-2 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-300"
                            >
                                { !loading ? 'Log In' : 'Loging in...'}
                            </button>
                        </div>
                    </form>
                    <p className="text-center mt-6">
                        Don’t have an account? <Link to="/sign-up" className="text-blue-500 hover:underline">Sign Up</Link>
                    </p>
                    {/* <Link className='text-blue-500 hover:underline'>
                        <p className='text-center mt-2'>
                            forgot password ?
                        </p>
                    </Link> */}
                    <RxCross1 className='absolute top-10 right-10 text-2xl hover:cursor-pointer' onClick={handleToggle}/>
                </div>
            </div>
            <Toaster />
        </div>
    );
};

export default LoginPage;
