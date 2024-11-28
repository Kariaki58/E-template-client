// product context api
import { createContext, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

export const ProductUploadContext = createContext();

export const ProductUploadProvider = ({ children }) => {
  const [productName, setProductName] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState(null);
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1);
  const [faqItems, setFaqItems] = useState([]);
  const [search, setSearch] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        // Create FormData instance to package all data
        const formData = new FormData();

        // Add product details to FormData
        formData.append('productName', productName);
        formData.append('description', description);
        formData.append('percentOff', 0);
        formData.append('price', parseFloat(price));
        formData.append('stock', parseInt(stock, 10));
        formData.append('category', selectedCategory.value);
        
        // Add sizes and colors
        selectedSizes.forEach((size, index) => {
            formData.append(`sizes[${index}]`, size.value);
        });
        selectedColors.forEach((color, index) => {
            formData.append(`colors[${index}]`, color.value);
        });

        productImages.forEach((image) => {
          formData.append('images', image);
        });


        // Add FAQ items if applicable
        faqItems.forEach((faq, index) => {
            formData.append(`faqItems[${index}][question]`, faq.question);
            formData.append(`faqItems[${index}][answer]`, faq.answer);
        });

        // Decide endpoint based on whether it's an edit or new upload
        const url = editingProductId
            ? `${import.meta.env.VITE_APP_BACKEND_BASEURL}/upload/update/${editingProductId}`
            : `${import.meta.env.VITE_APP_BACKEND_BASEURL}/upload/add`;

        // Make the API request
        const response = await axios.post(url, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });

        if (response.data.error) {
            toast.error(response.data.error);
        } else {
            toast.success(editingProductId ? 'Product updated successfully!' : 'Product uploaded successfully!');
            resetForm();
            fetchAllProducts();
        }
    } catch (error) {
        if (error.response && error.response.data) {
          toast.error(error.response.data.error);
        } else {
          console.error(error);
          toast.error('An unexpected error occurred.');
        }
    } finally {
        setLoading(false);
    }
  };


  const handleEditProduct = (product) => {
    setEditingProductId(product._id);
    setProductName(product.productName);
    setProductImages(product.images);
    setSelectedSizes(product.size.map((size) => ({ value: size, label: size })));
    setSelectedColors(product.color.map((color) => ({ value: color, label: color })));
    setSelectedCategory({ value: product.category, label: product.category });
    setStock(product.stock.toString());
    setDescription(product.description);
    setPrice(product.price.toString());
  };

  const handleDeleteProduct = async (productId) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_APP_BACKEND_BASEURL}/upload/delete/${productId}`,
        { withCredentials: true }
      );

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success('Product deleted successfully!');
        fetchAllProducts();
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error)
      } else {
        toast.error('An error occurred while deleting the product.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}?page=${page}`, {
        withCredentials: true,
      });

      setTotal(response.data.total);
  
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        const data = response.data.message;
        const uniqueCategories = data.reduce((acc, current) => {
          const isDuplicate = acc.some(item => item.category === current.category);
          if (!isDuplicate) {
            acc.push(current);
          }
          return acc;
        }, []);
        setCategories(uniqueCategories);
        setProducts(data || []);
        setFilteredProducts(data || []);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error)
      } else {
        toast.error('An error occurred while fetching products.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  

  const resetForm = () => {
    setProductName('');
    setProductImages([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedCategory(null);
    setStock('');
    setDescription(null);
    setPrice('');
    setEditingProductId(null);
    setImagePreviews([]);
  };
  
  const filterProductsByCategory = (products, category) => {
    if (!category) return products;
    if (category === 'All') return products
    return products.filter(product => product.category === category);
  };

  const SortByCategory = (category) => {
    setSelectedCategory(category);
    const filtered = filterProductsByCategory(products, category);
    setFilteredProducts(filtered);
  };

  const sortProducts = (products, sortOption) => {
    if (!sortOption) return products;

    switch (sortOption) {
      case 'Highest to Lowest':
        return [...products].sort((a, b) => b.price - a.price);
      case 'Lowest to Highest':
        return [...products].sort((a, b) => a.price - b.price);
      case 'Latest':
        return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return products;
    }
  };

  return (
    <ProductUploadContext.Provider
      value={{
        productName,
        setProductName,
        productImages,
        selectedSizes,
        setSelectedSizes,
        selectedColors,
        setSelectedColors,
        selectedCategory,
        setSelectedCategory,
        filterProductsByCategory,
        stock,
        setStock,
        description,
        setDescription,
        price,
        setPrice,
        loading,
        handleSubmit,
        handleEditProduct,
        handleDeleteProduct,
        fetchAllProducts,
        products: filteredProducts,
        resetForm,
        categories,
        setCategories,
        sortOption,
        setSortOption,
        sortProducts,
        SortByCategory,
        setProductImages,
        imagePreviews,
        setImagePreviews,
        total,
        setFilteredProducts,
        setProducts,
        faqItems,
        setFaqItems,
        currentPage,
        setCurrentPage,
        search,
        setSearch
      }}
    >
      {children}
      <Toaster />
    </ProductUploadContext.Provider>
  );
};

export const useProductUpload = () => useContext(ProductUploadContext);
