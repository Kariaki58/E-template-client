import React, { useContext, useState, useEffect } from 'react';
import { ProductUploadContext } from '../../contextApi/ProductContext';
import { CartContext } from '../../contextApi/cartContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import { Link } from 'react-router-dom';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Cloudinary } from '@cloudinary/url-gen';
import './ProductList.css';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME,
  },
});

export const ProductSizesOrColorDisplay = ({
  sizesAvailable,
  colorsAvailable,
  onSelectSize,
  onSelectColor,
  onClose,
  onCancel,
}) => {
  return (
    <div
      className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full md:inset-0 max-h-full bg-gray-900 bg-opacity-50"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="bg-white rounded-lg p-8 max-w-lg mx-auto">
        {colorsAvailable.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Available Colors</h2>
            <select
              onChange={onSelectColor}
              className="px-4 py-2 w-full rounded-lg"
            >
              <option value="">Select Color</option>
              {colorsAvailable.map((color, index) => (
                <option key={index} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
        )}

        {sizesAvailable.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Available Sizes</h2>
            <select
              onChange={onSelectSize}
              className="px-4 py-2 w-full rounded-lg"
            >
              <option value="">Select Size</option>
              {sizesAvailable.map((size, index) => (
                <option key={index} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded-lg mr-2"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductList = () => {
  const {
    products,
    loading,
    sortOption,
    sortByCategory,
    sortProducts,
    filterProductsByCategory,
    fetchAllProducts,
    setSortOption,
  } = useContext(ProductUploadContext);

  const { addToCart } = useContext(CartContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10); // Set the number of products per page
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    fetchAllProducts();
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
    if (selectedProduct && selectedSize && selectedColor) {
      addToCart(selectedProduct._id, 1, selectedSize, selectedColor);
      toast.success(
        `${selectedProduct.name} added to cart with ${selectedColor} color and ${selectedSize} size!`
      );
      setSelectedProduct(null);
      setSelectedSize('');
      setSelectedColor('');
    } else {
      toast.error('Please select size and color before confirming.');
    }
  };

  const handleCancelSelection = () => {
    setSelectedProduct(null);
    setSelectedSize('');
    setSelectedColor('');
  };

  const truncateText = (text, length) => {
    return text.length > length ? text.slice(0, length) + '...' : text;
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  // Filter and sort products
  const filteredProducts = filterProductsByCategory(products, sortByCategory);
  const sortedProducts = sortProducts(filteredProducts, sortOption);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
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
                src={cld
                  .image(`images/${data.images[0].split('/')[8].split('.')[0]}`)
                  .resize('c_fill,w_500,h_500,g_auto')
                  .delivery('q_auto')
                  .format('auto')
                  .toURL()}
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
                  onClick={() => paginate(page)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                    currentPage === page
                      ? 'z-10 bg-gray-950 text-white'
                      : 'bg-gray-800 text-white hover:bg-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <ToastContainer />
      {selectedProduct && (
        <ProductSizesOrColorDisplay
          sizesAvailable={selectedProduct.sizes}
          colorsAvailable={selectedProduct.colors}
          onSelectSize={(e) => setSelectedSize(e.target.value)}
          onSelectColor={(e) => setSelectedColor(e.target.value)}
          onClose={handleConfirmSelection}
          onCancel={handleCancelSelection}
        />
      )}
    </div>
  );
};

export default ProductList;
