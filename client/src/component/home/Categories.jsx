import React, { useContext, useState } from 'react';
import { ProductUploadContext } from '../../contextApi/ProductContext';

const Categories = () => {
  const { categories, SortByCategory } = useContext(ProductUploadContext);
  const [activeCategory, setActiveCategory] = useState('All');

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    SortByCategory(category);
  };

  return (
    <section className="bg-gray-100" aria-labelledby="category-heading">
      {/* Improved Heading for SEO */}
      <h2 id="category-heading" className="text-2xl text-gray-800 font-bold mb-2 text-center pt-7">
        Shop by Category
      </h2>

      <div
        className="flex overflow-x-auto whitespace-nowrap no-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
        role="list"  // Role for better navigation
        aria-label="Categories"  // ARIA label for screen readers
      >
        {/* 'All' Category */}
        <div
          className={`group relative flex-shrink-0 w-40 h-20 overflow-hidden rounded-lg p-2 m-2 cursor-pointer ${
            activeCategory === 'All' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
          }`}
          onClick={() => handleCategoryClick('All')}
          role="listitem"  // For screen readers
          tabIndex={0}  // Make it focusable
          aria-pressed={activeCategory === 'All'}  // ARIA state for assistive technologies
          aria-label="All Categories"  // Clear description for screen readers
        >
          <h3 className="text-lg font-semibold">All</h3>
        </div>

        {/* Dynamic Categories */}
        {categories.map((category, index) => (
          <div
            key={index}
            className={`group relative flex-shrink-0 w-40 h-20 overflow-hidden rounded-lg p-2 m-2 cursor-pointer ${
              activeCategory === category.category ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
            }`}
            onClick={() => handleCategoryClick(category.category)}
            role="listitem"
            tabIndex={0}
            aria-pressed={activeCategory === category.category}
            aria-label={`Category: ${category.category}`}
          >
            <h3 className="text-lg font-semibold">{category.category}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default React.memo(Categories);
