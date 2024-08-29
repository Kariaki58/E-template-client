import React from 'react';
import { Link } from 'react-router-dom';
import facebook from '/facebook.png'
import instagram from '/instagram.jpeg'
import linkedin from '/linkedin.png'
import x from '/x.png'


const Footer = () => {
    return (
        <footer className="bg-gray-950 text-gray-300 py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-between">
                    {/* Logo and Description */}
                    <div className="w-full md:w-1/3 mb-8 md:mb-0">
                        <h2 className="text-2xl font-bold text-white mb-4">OverLow</h2>
                        <p className="text-gray-400">
                            Your one-stop shop for all your needs. Enjoy a seamless shopping experience with our wide range of products.
                        </p>
                        <div className='text-gray-100 font-bold'>
                            <p>Feel the impact of selling online, get a professional website - <span><Link to='/offer/paymentPlan' className='text-blue-500'>click here</Link></span></p>
                        </div>
                    </div>
                    {/* Navigation Links */}
                    <div className="w-full md:w-1/3 mb-8 md:mb-0">
                        <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="hover:text-white">Home</Link></li>
                            <li><Link to="/about-us" className="hover:text-white">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                            <li><Link to="/faq" className="hover:text-white">FAQs</Link></li>
                        </ul>
                    </div>
                    <div className="w-full md:w-1/3">
                        <h3 className="text-xl font-semibold text-white mb-4">Newsletter</h3>
                        <p className="text-gray-400 mb-4">
                            Subscribe to our newsletter to get the latest updates and offers.
                        </p>
                        <form className="flex">
                            <input
                                type="email"
                                className="w-full px-4 py-2 rounded-l bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your email"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-r hover:bg-blue-600 transition duration-300"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-5 border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex space-x-4">
                        <Link to="" className="text-gray-400 hover:text-white transition duration-300">
                            <img src={facebook} width={40} height={40}/>
                        </Link>
                        <Link to="https://www.instagram.com/stephenkariaki/" className="text-gray-400 hover:text-white transition duration-300">
                            <img src={instagram} width={40} height={40} className='rounded-full' />
                        </Link>
                        <Link to="https://www.linkedin.com/in/kariakistephen58/" className="text-gray-400 hover:text-white transition duration-300">
                            <img src={linkedin} width={40} height={40} className='rounded-full' />
                        </Link>
                        <Link to="https://x.com/SKariaki" className="text-gray-400 hover:text-white transition duration-300">
                            <img src={x} width={40} height={40} className='rounded-full' />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
