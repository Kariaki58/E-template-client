import React, { useContext, useState, useEffect } from 'react';
import { ProductUploadContext } from '../../contextApi/ProductContext';
import { CartContext } from '../../contextApi/cartContext';
import { Toaster, toast } from 'react-hot-toast';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import { Link } from 'react-router-dom';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Cloudinary } from '@cloudinary/url-gen';
import './ProductList.css';
import { RotatingLines } from 'react-loader-spinner'
import { EmailPopUp } from './Footer';
import ScrollToTop from '../../ScrollToTop';


const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME,
  },
});

const ProductList = () => {
  const {
    products,
    loading,
    sortOption,
    sortProducts,
    fetchAllProducts,
    setSortOption,
    total,
  } = useContext(ProductUploadContext);

  const { addToCart } = useContext(CartContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const isAuthenticated = useIsAuthenticated();
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 1100 && window.scrollY <= 1500) {
        if (!isAuthenticated) {
          setDisplay(true)
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price);
  };

  const handleAddToCart = (product) => {
    if (product.sizes.length > 0 || product.colors.length > 0) {
      setSelectedProduct(product);
    } else {
      addToCart(product._id, 1);
      toast.success(`${product.name} added to cart!`);
    }
  };

  const handleConfirmSelection = () => {
    if (!selectedProduct) {
      toast.error('No product selected.');
      return;
    }

    const requiresSize = selectedProduct.sizes && selectedProduct.sizes.length > 0;
    const requiresColor = selectedProduct.colors && selectedProduct.colors.length > 0;

    if (requiresSize && !selectedSize) {
      toast.error('Please select a size.');
      return;
    }

    if (requiresColor && !selectedColor) {
      toast.error('Please select a color.');
      return;
    }

    addToCart(selectedProduct._id, 1, selectedSize, selectedColor);
    toast.success(
      `${selectedProduct.name} added to cart with ${selectedColor || 'default'} color and ${selectedSize || 'default'} size!`
    );

    setSelectedProduct(null);
    setSelectedSize('');
    setSelectedColor('');
  };

  const handleCancelSelection = () => {
    setSelectedProduct(null);
    setSelectedSize('');
    setSelectedColor('');
  };

  const truncateText = (text, length) => {
    return text.length > length ? text.slice(0, length) + '...' : text;
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchAllProducts(currentPage);
    };
  
    fetchData();
  
  }, [currentPage]);


  const sortedProducts = sortProducts(products, sortOption);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchAllProducts(page);
  };
  
  // Example usage with buttons or pagination controls
  // Assuming you have a total number of pages
  const totalPages = Math.ceil(total / productsPerPage);
  

  if (loading) {
    return (
      <div className='flex justify-center items-center mt-2'>
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


  return (
    <>
      {display ? <EmailPopUp /> : <></>}
      <div className="flex flex-col mt-5 px-4 mb-10">
        <div className="w-full flex justify-center mb-4">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="text-left bg-white border border-gray-300 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Highest to Lowest">Highest to Lowest</option>
            <option value="Lowest to Highest">Lowest to Highest</option>
            <option value="Latest">Latest</option>
          </select>
        </div>
        <div className="gap-2 responsive">
          {currentProducts.map((data) => (
            <div
              className="w-full p-4 hover:shadow-md rounded-lg flex flex-col justify-between bg-white"
              key={data._id}
            >
              <Link to={`products/content/${data._id}`}>
              <img
                key={data._id}
                src={data.images[0]}
                alt={data.name}
                className="rounded-lg"
              />
              </Link>
              <div className="p-4">
                <p className="font-semibold text-gray-800">
                  {truncateText(data.name, 17)}
                </p>
                <div className="text-gray-800 font-semibold">
                  {formatPrice(
                    data.price.$numberDecimal
                      ? parseFloat(data.price.$numberDecimal)
                      : data.price
                  )}
                </div>
              </div>
              {isAuthenticated && (
                <div className="flex justify-center mt-auto">
                  <button
                    className="border text-black border-gray-950 hover:text-white py-2 px-4 rounded-lg sm:text-xl hover:bg-gray-950 w-60"
                    onClick={() => handleAddToCart(data)}
                  >
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() =>
                paginate(currentPage > 1 ? currentPage - 1 : currentPage)
              }
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                paginate(currentPage < totalPages ? currentPage + 1 : currentPage)
              }
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {indexOfFirstProduct + 1}
                </span>{' '}
                to <span className="font-medium">{indexOfLastProduct}</span> of{' '}
                <span className="font-medium">{sortedProducts.length}</span>{' '}
                products
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`${
                      page === currentPage
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    } relative inline-flex items-center border px-4 py-2 text-sm font-medium`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() =>
                    paginate(currentPage > 1 ? currentPage - 1 : currentPage)
                  }
                  className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    paginate(currentPage < totalPages ? currentPage + 1 : currentPage)
                  }
                  className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Select Options</h2>
            {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Size:</label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select size</option>
                  {selectedProduct.sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {selectedProduct.colors && selectedProduct.colors.length > 0 && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Color:</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select color</option>
                  {selectedProduct.colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex justify-end mt-6">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded mr-2"
                onClick={handleCancelSelection}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                onClick={handleConfirmSelection}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster />
      <ScrollToTop />
    </>
  );
};

export default ProductList;
