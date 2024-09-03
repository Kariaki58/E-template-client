import React, { useEffect, useRef, useContext, useState } from 'react';
import { ProductUploadContext } from '../../contextApi/ProductContext';

const Categories = () => {
  const { categories, SortByCategory } = useContext(ProductUploadContext);
  const [activeCategory, setActiveCategory] = useState('All');


  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    SortByCategory(category);
  };

  return (
    <div className="bg-gray-100">
      <h2 className="text-2xl text-gray-800 font-bold mb-2 text-center pt-7">Shop by Category</h2>
      <div
        className="flex overflow-x-auto whitespace-nowrap no-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div
          className={`group relative flex-shrink-0 w-40 h-20 overflow-hidden rounded-lg p-2 m-2 cursor-pointer ${
            activeCategory === 'All' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
          }`}
          onClick={() => handleCategoryClick('All')}
        >
          <h3 className="text-lg font-semibold">{'All'}</h3>
        </div>
        {categories.map((category, index) => (
          <div
            key={index}
            className={`group relative flex-shrink-0 w-40 h-20 overflow-hidden rounded-lg p-2 m-2 cursor-pointer ${
              activeCategory === category.category ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
            }`}
            onClick={() => handleCategoryClick(category.category)}
          >
            <h3 className="text-lg font-semibold">{category.category}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
