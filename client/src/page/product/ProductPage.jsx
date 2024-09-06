import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoStarSharp } from 'react-icons/io5';
import axios from 'axios';
import ReviewForm from '../../component/product/ReviewForm';
import ReviewList from '../../component/product/ReviewList';
import { CartContext } from '../../contextApi/cartContext';
import { Toaster, toast } from 'react-hot-toast';
import '../../App.css'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { Cloudinary } from '@cloudinary/url-gen';
import { RotatingLines } from 'react-loader-spinner'


const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME,
  },
});

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
  const [loading, setLoading] = useState(true)
  const [showDetailsPrompt, setShowDetailsPrompt] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/products/${params.id}`, { withCredentials: true });

        if (response.data.error) {
          throw new Error(response.data.error);
        }
        const fetchedProduct = response.data.product;
        setProduct(fetchedProduct);
        setTotalPrice(fetchedProduct.price * quantity);

        if (fetchedProduct.images && fetchedProduct.images.length > 0) {
          setSelectedImage(fetchedProduct.images[0]);
        }
      } catch (error) {
        if (error.response && error.response.data) {
          toast.error(error.response.data.error)
        } else {
          toast.error("Error fetching product data.");
        }
      } finally {
        setLoading(false)
      }
    };

    fetchData();
  }, [params.id]);

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

  if (loading) {
    return (
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
    )
  }

  const buttonClassNames = (isSelected) =>
    `px-4 py-2 rounded-lg border ${isSelected ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'} hover:bg-blue-500 hover:text-white transition-all`;

  return (
    <div className="bg-gray-100 py-3 px-2 sm:px-6 lg:px-8">
      <Toaster />
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
                      src={cld.image(`images/${image.split('/')[8].split('.')[0]}`)
                      .resize('c_fill,w_600,h_600,g_auto')
                      .delivery('q_auto')
                      .format('auto')
                      .toURL()}
                      alt="Optimized Image"
                    />
                  ))}
                </Carousel>
              </div>
              <div className="flex flex-col">
                <h1 className="text-3xl lg:text-4xl font-extrabold mb-6 text-gray-800">{product.name}</h1>
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
                    Total Price: ${formatPrice(totalPrice - (product.price * (product.percentOff / 100)) )}
                  </p>
                </div>
                <div className='grid md:grid-cols-2 grid-cols-1'>
                  {product.colors.length > 0 && (
                    <div className="mb-4">
                      <h2 className="text-md text-gray-800 lg:text-xl font-semibold mb-2">Available Colors</h2>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedColor(color)}
                            className={buttonClassNames(selectedColor === color)}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.sizes.length > 0 && (
                    <div className="mb-4">
                      <h2 className="text-md text-gray-800 lg:text-xl font-semibold mb-2">Available Sizes</h2>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedSize(size)}
                            className={buttonClassNames(selectedSize === size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mb-6">
                    <h2 className="text-lg lg:text-xl font-semibold mb-2 text-gray-800">Quantity</h2>
                    <input
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="px-4 py-2 rounded-lg border border-gray-300 bg-white"
                      min="1"
                    />
                  </div>
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
              <h2 className="text-2xl lg:text-3xl font-semibold mb-8 text-gray-800">Product Details</h2>
              <div className="product-details text-base lg:text-lg text-gray-700 leading-relaxed">
                <p dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
              <div className="mt-12">
                <h2 className="text-2xl lg:text-3xl font-semibold mb-8 text-gray-800">Customer Reviews</h2>
                <ReviewList reviews={product.reviews} />
                {writeReview ? (
                  <ReviewForm setWriteReview={setWriteReview} productId={params.id} />
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
