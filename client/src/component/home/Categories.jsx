import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import { productContext } from '../../contextApi/ProductContext';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setSortByCategory } = useContext(productContext);
  const scrollRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/category/get`, { withCredentials: true });
        setCategories(response.data.message.slice(0, 2));
      } catch (err) {
        setError('Failed to load categories.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const scrollInterval = setInterval(() => {
        if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth) {
          scrollContainer.scrollLeft = 0;
        } else {
          scrollContainer.scrollLeft += 2;
        }
      }, 20);

      return () => clearInterval(scrollInterval);
    }
  }, [categories]);

  if (loading) return <div className="text-center py-10">Loading categories...</div>;
  if (error) return <div className="text-center text-red-600 py-10">{error}</div>;

  return (
    <div className="bg-gray-100">
      <h2 className="text-2xl font-bold mb-2 text-center pt-7">Shop by Category</h2>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto whitespace-nowrap no-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        {categories.map((category) => (
          <div
            key={category._id}
            className="group relative flex-shrink-0 w-40 h-20 overflow-hidden rounded-lg p-2 m-2 cursor-pointer"
            onClick={() => setSortByCategory(category.name)}
          >
            <h3 className="text-lg font-semibold text-black">{category.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
