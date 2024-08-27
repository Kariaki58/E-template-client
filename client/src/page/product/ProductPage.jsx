import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { IoStarSharp } from 'react-icons/io5';
import axios from 'axios';
import ReviewForm from '../../component/product/ReviewForm';
import ReviewList from '../../component/product/ReviewList';
import 'react-toastify/dist/ReactToastify.css';
import { CartContext } from '../../contextApi/cartContext';
import { ToastContainer, toast } from 'react-toastify';
import '../../App.css'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';

const ProductSections = () => {
  const { addToCart } = useContext(CartContext);
  const [selectedImage, setSelectedImage] = useState('');
  const params = useParams();
  const [writeReview, setWriteReview] = useState(false);
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0); // New state for total price
  const [showDetailsPrompt, setShowDetailsPrompt] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/products/${params.id}`, { withCredentials: true });
        if (response.data.error) {
          throw new Error(response.data.error);
        }
        const fetchedProduct = response.data.message;
        setProduct(fetchedProduct);
        setTotalPrice(fetchedProduct.price * quantity); // Initialize total price

        if (fetchedProduct.images && fetchedProduct.images.length > 0) {
          setSelectedImage(fetchedProduct.images[0]);
        }
      } catch (error) {
        console.error("Error fetching product data: ", error);
        toast.error("Error fetching product data.");
      }
    };

    fetchData();
  }, [params.id, quantity]); // Add quantity to dependencies

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size.");
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      toast.error("Please select a color.");
      return;
    }

    addToCart(params.id, quantity, selectedSize, selectedColor);
    toast.success(`${product.name} added to cart with ${selectedColor || ''} color and ${selectedSize || ''} size!`);
  };

  const handleCheckout = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size.");
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      toast.error("Please select a color.");
      return;
    }

    if (selectedSize && selectedColor) {
      navigate(`/checkout/${params.id}?color=${selectedColor}&size=${selectedSize}&quantity=${quantity}`);
    } else {
      setShowDetailsPrompt(true);
    }
  };

  const handleQuantityChange = (e) => {
    const newQuantity = Number(e.target.value);
    setQuantity(newQuantity);
    setTotalPrice(product.price * newQuantity); // Update total price when quantity changes
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-50">
      <ToastContainer />
      <div className="w-full max-w-6xl rounded-lg overflow-hidden">
        {product ? (
          <>
            <div className="flex flex-col lg:flex-row gap-8 p-6">
              <div className="w-full lg:w-1/2 flex flex-col items-center">
                <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-96">
                  <img
                    src={selectedImage}
                    alt="Product"
                    className="absolute w-full h-64 object-cover rounded-lg transition-transform duration-300 transform hover:scale-105"
                  />
                </div>
                <div className="flex gap-2 mt-4 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg cursor-pointer border ${
                        selectedImage === image ? 'border-gray-500' : 'border-gray-300'
                      } hover:border-gray-500 transition-all duration-200`}
                      onClick={() => setSelectedImage(image)}
                    />
                  ))}
                </div>
              </div>
              <div className="w-full lg:w-1/2 flex flex-col p-4 sm:p-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-gray-900">{product.name}</h1>
                <p className="text-xs sm:text-sm text-gray-500 mb-4">Prices may vary during checkout.</p>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, index) => (
                      <IoStarSharp key={index} className="text-lg sm:text-xl md:text-2xl" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">{product.rating.count} Reviews</p>
                </div>
                <div className="flex gap-4 mb-4 items-center">
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-800 font-bold">
                    Total Price: ${formatPrice(totalPrice)}
                  </p>
                </div>
                {product.colors.length > 0 && (
                  <div className="mb-4">
                    <h2 className="text-base sm:text-lg font-semibold mb-2">Available Colors</h2>
                    <select
                      className="px-4 py-2 w-full sm:w-40 rounded-lg border border-gray-300"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                    >
                      <option value="">Select Color</option>
                      {product.colors.map((color, index) => (
                        <option key={index} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {product.sizes.length > 0 && (
                  <div className="mb-4">
                    <h2 className="text-base sm:text-lg font-semibold mb-2">Available Sizes</h2>
                    <select
                      className="px-4 py-2 w-full sm:w-40 rounded-lg border border-gray-300"
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                    >
                      <option value="">Select Size</option>
                      {product.sizes.map((size, index) => (
                        <option key={index} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="mb-4">
                  <h2 className="text-base sm:text-lg font-semibold mb-2">Quantity</h2>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="px-4 py-2 w-full sm:w-40 rounded-lg border border-gray-300"
                    min="1"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <button
                    onClick={handleAddToCart}
                    className="w-full sm:w-auto bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleCheckout}
                    className="w-full sm:w-auto bg-gray-950 text-white py-2 px-4 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 rounded-lg">
              <h2 className="text-xl sm:text-2xl font-semibold mb-6">Product Details</h2>
              <div className="product-details">
                <p className="" dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
              <div className="mt-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-6">Customer Reviews</h2>
                <ReviewList reviews={product.reviews} />
                {writeReview ? (
                  <ReviewForm setWriteReview={setWriteReview} />
                ) : (
                  <button
                    onClick={() => setWriteReview(true)}
                    className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    Write a Review
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="text-lg text-gray-700">Loading product...</p>
        )}
      </div>
    </div>
  );
};

export default ProductSections;
