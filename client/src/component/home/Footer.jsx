import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import facebook from '/facebook.png';
import instagram from '/instagram.jpeg';
import linkedin from '/linkedin.png';
import x from '/x.png';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";


const useEmailSubscription = () => {
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (email, onSuccess) => {
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/newsletter`, { email }, { withCredentials: true });
            if (response.data.error) {
                toast.error(response.data.error);
            } else {
                toast.success(response.data.message);
                if (onSuccess) onSuccess();
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Please try again!";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return { loading, handleSubscribe };
};

const EmailForm = ({ email, setEmail, handleSubscribe, loading, buttonText }) => (
    <form className="flex" onSubmit={(e) => { e.preventDefault(); handleSubscribe(email, () => setEmail('')); }}>
        <input
            type="email"
            value={email}
            className="w-full px-4 py-2 rounded-l bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            onChange={(e) => setEmail(e.target.value)}
            required
        />
        <button
            type="submit"
            className={`px-4 py-2 text-sm bg-blue-500 text-white font-semibold rounded-r hover:bg-blue-600 transition duration-300`}
        >
            {loading ? 'Sending...' : buttonText}
        </button>
    </form>
);

export const EmailPopUp = () => {
    const [isPopupVisible, setIsPopupVisible] = useState(true);
    const [email, setEmail] = useState('');
    const { loading, handleSubscribe } = useEmailSubscription();

    return (
        <>
            {isPopupVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg p-8 w-full max-w-lg relative text-center shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105">
                        <button
                            className="absolute top-3 right-4 text-gray-300 text-2xl hover:text-white"
                            onClick={() => setIsPopupVisible(false)}
                        >
                            &times;
                        </button>
                        <h2 className="text-xl md:text-3xl font-bold mb-4">Join Our Creative Community!</h2>
                        <p className="mb-6 text-md md:text-lg">
                            Be the first to get exclusive updates, tips, and offers straight to your inbox.
                        </p>
                        <EmailForm
                            email={email}
                            setEmail={setEmail}
                            handleSubscribe={handleSubscribe}
                            loading={loading}
                            buttonText="Get Access Now"
                        />
                        <p className="mt-4 text-sm">
                            No spam, just quality content. Unsubscribe anytime.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

const SocialLink = ({ href, src, alt }) => (
    <Link to={href} className="text-gray-400 hover:text-white transition duration-300">
        <img src={src} alt={alt} width={40} height={40} className='rounded-full' />
    </Link>
);

const Footer = () => {
    const [email, setEmail] = useState('');
    const { loading, handleSubscribe } = useEmailSubscription();

    return (
        <footer className="bg-gray-950 text-gray-300 py-16">
            <div className="mx-auto px-4">
                <div className="flex flex-wrap justify-between gap-2">
                    <div className="w-full md:w-1/4 mb-8 md:mb-0">
                        <h2 className="text-2xl font-bold text-white mb-6">OverLow</h2>
                        <p className="text-gray-400 mb-6">
                            Your one-stop shop for all your needs. Enjoy a seamless shopping experience with our wide range of products.
                        </p>
                        <div className='text-gray-100 font-bold'>
                            <p>Feel the impact of selling online, get a professional website - <span><Link to='/offer/paymentPlan' className='text-blue-500'>click here</Link></span></p>
                        </div>
                    </div>

                    <div className="w-full md:w-1/4 mb-8 md:mb-0">
                        <h3 className="text-xl font-semibold text-white mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><Link to="/" className="hover:text-white">Home</Link></li>
                            <li><Link to="/about-us" className="hover:text-white">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                            <li><Link to="/faq" className="hover:text-white">FAQs</Link></li>
                        </ul>
                    </div>

                    <div className="w-full md:w-1/4 mb-8 md:mb-0">
                        <h3 className="text-xl font-semibold text-white mb-6">Company</h3>
                        <ul className="space-y-3">
                            <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
                            <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
                            <li><Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
                            <li><Link to="/terms-conditions" className="hover:text-white">Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    <div className="w-full md:w-1/4">
                        <h3 className="text-xl sm:text-lg font-semibold text-white mb-2">Newsletter</h3>
                        <p className="text-gray-400 mb-4">
                            Subscribe to our newsletter to get the latest updates and offers.
                        </p>
                        <EmailForm
                            email={email}
                            setEmail={setEmail}
                            handleSubscribe={handleSubscribe}
                            loading={loading}
                            buttonText="Subscribe"
                        />
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm">© {new Date().getFullYear()} OverLow. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <SocialLink href="https://www.facebook.com" src={facebook} alt="Facebook" />
                        <SocialLink href="https://www.instagram.com" src={instagram} alt="Instagram" />
                        <SocialLink href="https://www.linkedin.com/in/kariakistephen58/" src={linkedin} alt="LinkedIn" />
                        <SocialLink href="https://x.com" src={x} alt="X" />
                    </div>
                </div>
            </div>
            <ToastContainer />
        </footer>
    );
};

export default Footer;
