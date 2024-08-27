import React, { useContext, useState, useEffect } from 'react';
import { ProductUploadContext } from '../../contextApi/ProductContext';
import { CartContext } from '../../contextApi/cartContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import { Link } from 'react-router-dom';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';


export const ProductSizesOrColorDisplay = ({ sizesAvailable, colorsAvailable, onSelectSize, onSelectColor, onClose, onCancel }) => {
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
            <select onChange={onSelectColor} className="px-4 py-2 w-full rounded-lg">
              <option value="">Select Color</option>
              {colorsAvailable.map((color, index) => (
                <option key={index} value={color}>{color}</option>
              ))}
            </select>
          </div>
        )}

        {sizesAvailable.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Available Sizes</h2>
            <select onChange={onSelectSize} className="px-4 py-2 w-full rounded-lg">
              <option value="">Select Size</option>
              {sizesAvailable.map((size, index) => (
                <option key={index} value={size}>{size}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded-lg mr-2">Cancel</button>
          <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Confirm</button>
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
    setSortOption
  } = useContext(ProductUploadContext);
  
  const { addToCart } = useContext(CartContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
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
      toast.success(`${selectedProduct.name} added to cart with ${selectedColor} color and ${selectedSize} size!`);
      setSelectedProduct(null);
      setSelectedSize('');
      setSelectedColor('');
    } else {
      toast.error("Please select size and color before confirming.");
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

  const filteredProducts = filterProductsByCategory(products, sortByCategory);
  const sortedProducts = sortProducts(filteredProducts, sortOption);

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
      <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {sortedProducts.map((data) => (
          <div className='w-full hover:shadow-md p-4 bg-white rounded-lg flex flex-col justify-between' key={data._id}>
            <Link to={`products/content/${data._id}`}>
              <div className="h-48 flex items-center justify-center">
                <img src={data.images[0]} alt={data.name} className="h-full object-contain" />
              </div>
            </Link>
            <div className="mt-4 h-20">
              <p className="font-semibold text-gray-800">
                {truncateText(data.name, 19)}
              </p>
              <div className="text-gray-950 font-semibold">
                {formatPrice(data.price.$numberDecimal ? parseFloat(data.price.$numberDecimal) : data.price)}
              </div>
            </div>
            {
              isAuthenticated && (
                <div className="flex justify-center mt-auto">
                  <button className="border text-black border-gray-950 hover:text-white py-2 px-4 rounded-lg sm:text-xl hover:bg-gray-950 w-60" onClick={() => handleAddToCart(data)}>
                    Add to Cart
                  </button>
                </div>
              )
            }
          </div>
        ))}
      </div>

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

      <ToastContainer />
    </div>
  );
};

export default ProductList;