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
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

const ProductSections = () => {
  const { addToCart } = useContext(CartContext);
  const [selectedImage, setSelectedImage] = useState('');
  const params = useParams();
  const [writeReview, setWriteReview] = useState(false);
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
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
        setTotalPrice(fetchedProduct.price * quantity);

        if (fetchedProduct.images && fetchedProduct.images.length > 0) {
          setSelectedImage(fetchedProduct.images[0]);
        }
      } catch (error) {
        console.error("Error fetching product data: ", error);
        toast.error("Error fetching product data.");
      }
    };

    fetchData();
  }, [params.id, quantity]);

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
    setTotalPrice(product.price * newQuantity);
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        {product ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="relative">
                <Carousel
                  showThumbs={true}
                  autoPlay
                  infiniteLoop
                  interval={3000}
                  showArrows={true}
                  showStatus={false}
                  className="rounded-lg overflow-hidden"
                >
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      height={484}
                      width={484}
                      alt={`Thumbnail ${index + 1}`}
                      className={`object-cover rounded-lg cursor-pointer border ${
                        selectedImage === image ? 'border-gray-500' : 'border-gray-300'
                      } hover:border-gray-500 transition-all duration-200`}
                      onClick={() => setSelectedImage(image)}
                    />
                  ))}
                </Carousel>
              </div>
              <div className="flex flex-col">
                <h1 className="text-3xl lg:text-4xl font-extrabold mb-6 text-gray-900">{product.name}</h1>
                <p className="text-sm text-gray-600 mb-4">Prices may vary during checkout.</p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, index) => (
                      <IoStarSharp key={index} className="text-xl lg:text-2xl" />
                    ))}
                  </div>
                  <p className="text-sm lg:text-base text-gray-600">{product.rating.count} Reviews</p>
                </div>
                <div className="flex gap-4 mb-6 items-center">
                  <p className="text-2xl lg:text-3xl text-gray-800 font-bold">
                    Total Price: ${formatPrice(totalPrice)}
                  </p>
                </div>
                {product.colors.length > 0 && (
                  <div className="mb-4">
                    <h2 className="text-lg lg:text-xl font-semibold mb-2">Available Colors</h2>
                    <select
                      className="px-4 py-2 w-full lg:w-60 rounded-lg border border-gray-300 bg-white"
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
                    <h2 className="text-lg lg:text-xl font-semibold mb-2">Available Sizes</h2>
                    <select
                      className="px-4 py-2 w-full lg:w-60 rounded-lg border border-gray-300 bg-white"
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
                <div className="mb-6">
                  <h2 className="text-lg lg:text-xl font-semibold mb-2">Quantity</h2>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="px-4 py-2 w-full lg:w-60 rounded-lg border border-gray-300 bg-white"
                    min="1"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
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

            <div className="mt-12">
              <h2 className="text-2xl lg:text-3xl font-semibold mb-8">Product Details</h2>
              <div className="product-details text-base lg:text-lg text-gray-700 leading-relaxed">
                <p dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
              <div className="mt-12">
                <h2 className="text-2xl lg:text-3xl font-semibold mb-8">Customer Reviews</h2>
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
          <p className="text-lg lg:text-xl text-center text-gray-700">Loading product details...</p>
        )}
      </div>
    </div>
  );
};

export default ProductSections;
