import React, { useState } from 'react';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the default CSS for react-toastify

const sizeOptions = [
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
];

const colorOptions = [
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'black', label: 'Black' },
];

const categoryOptions = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'home', label: 'Home' },
  { value: 'toys', label: 'Toys' },
];

const Products = () => {
  const [productName, setProductName] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      toast.error('Something went wrong in the server');
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
      if (res.data.error) throw new Error(res.data.error)
      return res.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("something went wrong")
      }
      return null
    }
  };

  const handleImageUpload = (e) => {
    setProductImages([...productImages, ...Array.from(e.target.files)]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
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
  
      const url = `${import.meta.env.VITE_APP_BACKEND_BASEURL}/upload/add`;
      const response = await axios.post(
        url,
        {
          productName: productName,
          description: description,
          gender: '',
          percentOff: 0,
          size: selectedSizes.map(option => option.value),
          color: selectedColors.map(option => option.value),
          price: parseFloat(price),
          currency: 'USD',
          stock: parseInt(stock, 10),
          images: images,
          materials: [],
          features: [],
          rating: {},
          category: selectedCategory ? selectedCategory.value : '',
        },
        { withCredentials: true }
      );
  
      if (response.data.error) {
        toast.error(response.data.error)
      } else {
        toast.success('Product uploaded successfully!');
        setProductName('');
        setProductImages([]);
        setSelectedSizes([]);
        setSelectedColors([]);
        setSelectedCategory(null);
        setStock('');
        setDescription('');
        setPrice('');
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const Check = (select) => {
    setSelectedCategory(select);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Upload Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-950">Product Name:</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-gray-900 focus:border-gray-900"
            />
          </div>

          <div>
            <label className="block text-gray-950">Product Images:</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-gray-900 focus:border-gray-900"
            />
          </div>

          <div>
            <label className="block text-gray-950">Size:</label>
            <CreatableSelect
              isMulti
              options={sizeOptions}
              value={selectedSizes}
              onChange={(selected) => setSelectedSizes(selected)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="block text-gray-950">Color:</label>
            <CreatableSelect
              isMulti
              options={colorOptions}
              value={selectedColors}
              onChange={(selected) => setSelectedColors(selected)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="block text-gray-950">Category:</label>
            <CreatableSelect
              options={categoryOptions}
              value={selectedCategory}
              onChange={(selected) => Check(selected)}
              className="mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-gray-950">Available Stock:</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-gray-900 focus:border-gray-900"
            />
          </div>

          <div>
            <label className="block text-gray-950">Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-gray-900 focus:border-gray-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-950">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-gray-900 focus:border-gray-900"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-gray-950 text-white font-semibold rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-900 focus:ring-opacity-50"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default Products;
