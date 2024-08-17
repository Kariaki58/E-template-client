import React, { useContext } from 'react';
import { productContext } from '../../contextApi/ProductContext';

const ProductList = () => {
  const {
    products,
    loading,
    sortOption,
    sortByCategory,
    sortProducts,
    filterProductsByCategory,
    handleSortChange
  } = useContext(productContext);

  if (loading) {
    return <p>Loading</p>;
  }

  const filteredProducts = filterProductsByCategory(products, sortByCategory);
  const sortedProducts = sortProducts(filteredProducts, sortOption);

  return (
    <div className="flex flex-col mt-5 px-4 mb-10">
      <div className="w-full flex justify-center mb-4">
        <select
          value={sortOption}
          onChange={handleSortChange}
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
            <div className="h-48 flex items-center justify-center">
              <img src={data.images[0]} alt={data.name} className="h-full object-contain" />
            </div>
            <div className="mt-4 h-20">
              <p className="font-semibold text-gray-800">{data.name}</p>
              <div className="text-gray-600">
                ₦{data.price.$numberDecimal ? parseFloat(data.price.$numberDecimal).toFixed(2) : data.price}
              </div>
            </div>
            <div className="flex justify-center mt-auto">
              <button className="border text-black border-gray-950 hover:text-white py-2 px-4 rounded-lg sm:text-xl hover:bg-gray-950 w-60">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
