import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IoStarSharp } from 'react-icons/io5';
import ReviewForm from '../../component/product/ReviewForm';
import ReviewList from '../../component/product/ReviewList';
import airpod from '/assets/1.jpg';
import apple_glass from '/assets/apple_glass.png';
import brans from '/assets/brans.jpeg'

const mockProductData = {
  id: 1,
  productName: "Sample Product",
  price: 49.99,
  productDescription: "This is a description of the sample product.",
  productImages: [airpod, apple_glass, brans],
  colors: ["red", "gray", "green"],
  sizes: ["S", "M", "L", "XL"],
};

const ProductSections = () => {
  const [selectedImage, setSelectedImage] = useState('');
  const params = useParams();
  const [writeReview, setWriteReview] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const fetchedProduct = mockProductData;
        setProduct(fetchedProduct);
        if (fetchedProduct.productImages && fetchedProduct.productImages.length > 0) {
          setSelectedImage(fetchedProduct.productImages[0]);
        }
      } catch (error) {
        console.error("Error fetching product data: ", error);
      }
    };

    fetchData();
  }, [params.id]);

  const handleAddToCart = () => {
    alert('Product added to cart');
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-6xl rounded-lg">
        {product ? (
          <>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-1/2 flex flex-col items-center">
                <div className="relative w-full h-96 p-4 sm:p-0">
                  <img
                    src={selectedImage}
                    alt="Product"
                    className="absolute inset-0 w-full h-full object-contain rounded-lg"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  {product.productImages &&
                    product.productImages.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className={`w-20 h-20 sm:w-14 sm:h-14 object-cover rounded-lg cursor-pointer border ${
                          selectedImage === image ? 'border-gray-500' : 'border-gray-300'
                        } hover:border-gray-500 transition-all duration-200`}
                        onClick={() => setSelectedImage(image)}
                      />
                    ))}
                </div>
              </div>

              {/* Product Details */}
              <div className="w-full lg:w-1/2 flex flex-col p-4 sm:p-0">
                <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
                  {product.productName}
                </h1>
                <p className="text-sm text-gray-500 mb-4">
                  Prices may vary during checkout.
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, index) => (
                      <IoStarSharp key={index} className="text-xl sm:text-2xl" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">8 Reviews</p>
                </div>
                <div className="flex gap-4 mb-4 items-center">
                  <p className="text-xl text-gray-800">Price: ${product.price.toFixed(2)}</p>
                </div>

                {product.colors.length > 0 && (
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2">Available Colors</h2>
                    <div className="flex flex-wrap gap-2">
                      <select className='px-4 py-2 w-40 rounded-lg'>
                        <option>Red</option>
                        <option>gray</option>
                        <option>Green</option>
                      </select>
                    </div>
                  </div>
                )}

                {product.sizes.length > 0 && (
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2">Available Sizes</h2>
                    <div className="flex flex-wrap gap-2">
                      <select className='px-4 py-2 w-40 rounded-lg'>
                          <option>S</option>
                          <option>M</option>
                          <option>L</option>
                          <option>XL</option>
                          <option>XXL</option>
                        </select>
                    </div>
                  </div>
                )}

                <div className="flex mb-4 gap-4">
                  <div className="flex items-center w-full sm:w-auto">
                    <input
                      placeholder="Enter coupon code"
                      className="p-3 border border-gray-300 rounded-l-lg w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                    <button
                      className="bg-gray-950 text-white p-3 rounded-r-lg border-2 border-gray-600 hover:bg-gray-700 transition-all w-full sm:w-auto"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <button
                    onClick={handleAddToCart}
                    className="w-full sm:w-auto bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  >
                    Add to Cart
                  </button>
                  <button className="w-full sm:w-auto bg-gray-950 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Description</h2>
              <p className="text-gray-700">{product.productDescription}</p>
            </div>

            <div className="mt-8">
              <p
                className="text-lg sm:text-2xl cursor-pointer text-blue-600 hover:underline"
                onClick={() => setWriteReview((prev) => !prev)}
              >
                Write a Review
              </p>
              {writeReview && (
                <ReviewForm writeReview={writeReview} setWriteReview={setWriteReview} productId={params.id} />
              )}
            </div>

            <ReviewList />
          </>
        ) : (
          <p className="text-center text-gray-600">Loading product details...</p>
        )}
      </div>
    </div>
  );
};

export default ProductSections;
