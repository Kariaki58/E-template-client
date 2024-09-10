import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ProductUploadContext } from '../../contextApi/ProductContext';
import { CartContext } from '../../contextApi/cartContext';
import { Toaster, toast } from 'react-hot-toast';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import { Link } from 'react-router-dom';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Cloudinary } from '@cloudinary/url-gen';
import './ProductList.css';
import { RotatingLines } from 'react-loader-spinner';
import ScrollToTop from '../../ScrollToTop';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { Helmet } from 'react-helmet'; // For SEO

// Lazy load EmailPopUp
const EmailPopUp = React.lazy(() => import('./Footer'));

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
    currentPage,
    setCurrentPage,
  } = useContext(ProductUploadContext);

  const { addToCart } = useContext(CartContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [productsPerPage] = useState(10);
  const isAuthenticated = useIsAuthenticated();
  const [display, setDisplay] = useState(false);
  const user = useAuthUser();

  // Debounce scroll handler
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  };

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }
    const handleScroll = debounce(() => {
      if (window.scrollY >= 1100 && window.scrollY <= 1500) {
        if (JSON.parse(localStorage.getItem('is-sub')) === null) {
          setDisplay(true);
        }
      }
    }, 200);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isAuthenticated]);

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price);
  };

  // Add to cart handler with memoization
  const handleAddToCart = useCallback((product) => {
    if (product.sizes.length > 0 || product.colors.length > 0) {
      setSelectedProduct(product);
    } else {
      addToCart(product._id, 1, currentPage);
      toast.success(`${product.name} added to cart!`);
    }
  }, [addToCart, currentPage]);

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

    addToCart(selectedProduct._id, 1, selectedSize, selectedColor, currentPage);
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

  // Memoized sorting
  const sortedProducts = useMemo(() => sortProducts(products, sortOption), [products, sortOption]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts;

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchAllProducts(page);
  };

  const totalPages = Math.ceil(total / productsPerPage);

  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center mt-2">
        <RotatingLines
          visible={true}
          height="96"
          width="96"
          color="grey"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Product List - Your Store</title>
        <meta name="description" content="Browse through our selection of high-quality products." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "http://schema.org",
            "@type": "Product",
            "name": selectedProduct?.name || "Product List",
            "image": selectedProduct?.images ? selectedProduct.images[0] : '',
            "description": selectedProduct ? truncateText(selectedProduct.description, 160) : '',
            "sku": selectedProduct?._id,
            "offers": {
              "@type": "Offer",
              "priceCurrency": "NGN",
              "price": selectedProduct ? formatPrice(selectedProduct?.price.$numberDecimal) : '',
            }
          })}
        </script>
      </Helmet>

      {display ? <React.Suspense fallback={<div>Loading...</div>}><EmailPopUp /></React.Suspense> : <></>}
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
            <div className="w-full p-4 hover:shadow-md rounded-lg flex flex-col justify-between bg-white relative" key={data._id}>
              <Link to={`products/content/${data._id}`}>
                <img
                  loading="lazy"  // Lazy-load images for performance
                  src={cld
                    .image(`images/${data.images[0].split('/')[8].split('.')[0]}`)
                    .resize('c_fill,w_500,h_500,g_auto')
                    .delivery('q_auto')
                    .format('auto')
                    .toURL()}
                  alt={`${data.name} product image`}  // Descriptive alt text
                  className="rounded-lg"
                />
              </Link>
              <div className="p-4">
                <p className="font-semibold text-gray-800">
                  {truncateText(data.name, 17)}
                </p>
                {data.percentOff > 1 ? (
                  <span className='bg-orange-500 text-white p-2 rounded-full absolute top-5 right-5'>
                    {data.percentOff}%
                  </span>
                ): <></>}
                <div className={`text-gray-800 font-semibold ${data.percentOff ? 'line-through' : ''}`}>
                  {formatPrice(
                    data.price.$numberDecimal
                      ? parseFloat(data.price.$numberDecimal)
                      : data.price
                  )}
                </div>
                {data.percentOff ? (
                  <div className='text-gray-800 font-semibold'>
                    {formatPrice(
                      data.price.$numberDecimal
                        ? parseFloat(data.price - (data.price.$numberDecimal * (Number(data.percentOff) / 100)))
                        : data.price - (data.price * (Number(data.percentOff) / 100))
                    )}
                  </div>
                ): <></>}
              </div>
              {!user || (!user.isAdmin) ? (
                <div className="flex justify-center mt-auto">
                  <button
                    className="border text-black border-gray-950 hover:text-white py-2 px-4 rounded-lg sm:text-xl hover:bg-gray-950 w-60"
                  onClick={() => handleAddToCart(data)}
                  disabled={loading}
                >
                  Add to Cart
                </button>
              </div>
              ): <></>}
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center my-6">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 mx-1 rounded-lg ${currentPage === index + 1 ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Add to cart with selection modal */}
        {selectedProduct ? (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">{selectedProduct.name}</h2>

              {selectedProduct.sizes.length > 0 && (
                <div className="mb-4">
                  <label htmlFor="size" className="block font-semibold mb-2">Select Size:</label>
                  <select
                    id="size"
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="border rounded-lg py-2 px-3"
                  >
                    <option value="">-- Select Size --</option>
                    {selectedProduct.sizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              )}

              {selectedProduct.colors.length > 0 && (
                <div className="mb-4">
                  <label htmlFor="color" className="block font-semibold mb-2">Select Color:</label>
                  <select
                    id="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="border rounded-lg py-2 px-3"
                  >
                    <option value="">-- Select Color --</option>
                    {selectedProduct.colors.map((color) => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-between mt-4">
                <button
                  onClick={handleConfirmSelection}
                  className="bg-gray-800 text-white py-2 px-4 rounded-lg"
                >
                  Confirm
                </button>
                <button
                  onClick={handleCancelSelection}
                  className="bg-gray-400 text-black py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ): <></>}
      </div>

      {/* Scroll to Top */}
      <ScrollToTop />
      
      <Toaster />
    </>
  );
};

export default ProductList;
