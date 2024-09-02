import { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

export const ProductUploadContext = createContext();

export const ProductUploadProvider = ({ children }) => {
  const [productName, setProductName] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const uploadFile = async (file, type, timestamp, signature) => {
    const folder = type === 'image' ? 'images' : 'videos';
    const data = new FormData();
    data.append('file', file);
    data.append('timestamp', timestamp);
    data.append('signature', signature);
    data.append('api_key', import.meta.env.VITE_APP_CLOUDINARY_API_KEY);
    data.append('folder', folder);

    try {
      const cloudName = import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME;
      const resourceType = type === 'image' ? 'image' : 'video';
      const api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const res = await axios.post(api, data);
      const { secure_url } = res.data;
      return secure_url;
    } catch (error) {
      toast.error('Something went wrong on the server');
      return null;
    }
  };

  const getSignatureForUpload = async (folder) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_BASEURL}/api/gensignature`,
        { folder },
        { withCredentials: true }
      );
      if (res.data.error) throw new Error(res.data.error);
      return res.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Something went wrong');
      }
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { timestamp: imgTimestamp, signature: imgSignature } = await getSignatureForUpload('images');
      let images = [];
      const uploadPromises = productImages.map(async (img) => {
        const imgUrl = await uploadFile(img, 'image', imgTimestamp, imgSignature);
        if (imgUrl) {
          images.push(imgUrl);
        }
      });

      await Promise.all(uploadPromises);

      const url = editingProductId
        ? `${import.meta.env.VITE_APP_BACKEND_BASEURL}/upload/update/${editingProductId}`
        : `${import.meta.env.VITE_APP_BACKEND_BASEURL}/upload/add`;

      const response = await axios.post(
        url,
        {
          productName,
          description,
          gender: '',
          percentOff: 0,
          size: selectedSizes.map((option) => option.value),
          color: selectedColors.map((option) => option.value),
          price: parseFloat(price),
          stock: parseInt(stock, 10),
          images,
          materials: [],
          features: [],
          rating: {},
          category: selectedCategory ? selectedCategory.value : '',
        },
        { withCredentials: true }
      );

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success(editingProductId ? 'Product updated successfully!' : 'Product uploaded successfully!');
        resetForm();
        fetchAllProducts(); // Fetch updated products after submission
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
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
      toast.error('An error occurred while deleting the product.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_BASEURL}`, {
        withCredentials: true,
      });

      console.log(response.data.message)

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
        setProducts(response.data.message || []);
        setFilteredProducts(response.data.message || []);
      }
    } catch (error) {
      toast.error('An error occurred while fetching products.');
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
    setDescription('');
    setPrice('');
    setEditingProductId(null); // Reset editing state
    setImagePreviews([])
  };

  const filterProductsByCategory = (products, category) => {
    if (!category) return products;
    if (category === 'All') return products
    return products.filter(product => product.category === category);
  };

  const SortByCategory = (category) => {
    setSelectedCategory(category);

    // Filter products by selected category
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
        setImagePreviews
      }}
    >
      {children}
      <ToastContainer />
    </ProductUploadContext.Provider>
  );
};

export const useProductUpload = () => useContext(ProductUploadContext);
