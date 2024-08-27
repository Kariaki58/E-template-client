import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import CreatableSelect from 'react-select/creatable';
import 'react-toastify/dist/ReactToastify.css';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useProductUpload } from '../../contextApi/ProductContext';
import { useDropzone } from "react-dropzone";
import { FaTrash } from 'react-icons/fa';

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

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingProductId, setEditingProductId] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({});
  const {
    loading,
    productImages,
    setProductImages,
    imagePreviews,
    setImagePreviews
  } = useProductUpload();

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async (page) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_BASEURL}/admin/products?page=${page}&limit=10`,
        { withCredentials: true }
      );
      setProducts(response.data.message);
      setTotalPages(Math.ceil(response.data.total / 10));
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const onDrop = (acceptedFiles) => {
    setProductImages((prev) => [...prev, ...acceptedFiles]);
    setImagePreviews((prev) => [...prev, ...acceptedFiles.map(file => URL.createObjectURL(file))]);
  };

  const removeImage = (index) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*', multiple: true });

  const handleEditClick = (product) => {
    setEditingProductId(product._id);
    setUpdatedProduct({
      ...product,
      size: product.sizes.map(size => ({ value: size, label: size })),
      color: product.colors.map(color => ({ value: color, label: color })),
      category: categoryOptions.find(cat => cat.value === product.category),
    });
    setProductImages(product.images || []);
    setImagePreviews(product.images || []);
  };

  const handleDeleteClick = async (productId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_BACKEND_BASEURL}/admin/product/${productId}`,
        { withCredentials: true }
      );
      setProducts(products.filter((product) => product._id !== productId));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(error.response.data.error);
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
      toast.error("Sorry Something went wrong");
      return null;
    }
  };

  const uploadFile = async (file, type, timestamp, signature) => {
    const folder = type === "image" ? "images" : "videos";
    const data = new FormData();
    data.append("file", file);
    data.append("timestamp", timestamp);
    data.append("signature", signature);
    data.append("api_key", import.meta.env.VITE_APP_CLOUDINARY_API_KEY);
    data.append("folder", folder);

    try {
      const cloudName = import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME;
      const resourceType = type === "image" ? "image" : "video";
      const api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const res = await axios.post(api, data);
      const { secure_url } = res.data;
      return secure_url;
    } catch (error) {
      toast.error("Sorry Something went wrong in the server");
      return null;
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const { timestamp: imgTimestamp, signature: imgSignature } = await getSignatureForUpload('images');

      console.log(productImages)
      let images = [];
  
      if (productImages.length > 0) {
        const uploadPromises = productImages.map(async (img) => {
          let imgUrl = await uploadFile(img, "image", imgTimestamp, imgSignature);
          imgUrl = String(imgUrl)
          if (imgUrl.startsWith('https://')) {
            console.log(imgUrl)
            images.push(imgUrl);
          }
        });
        await Promise.all(uploadPromises);
      }
  
      const updatedProductData = {
        ...updatedProduct,
        images: images, // Use the updated images array
        sizes: updatedProduct.size.map(s => s.value),
        colors: updatedProduct.color.map(c => c.value),
        category: updatedProduct.category.value,
      };
  
      const response = await axios.put(
        `${import.meta.env.VITE_APP_BACKEND_BASEURL}/admin/product/edit`,
        updatedProductData,
        { withCredentials: true }
      );
  
      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }
  
      setProducts(
        products.map((product) =>
          product._id === editingProductId ? { ...product, ...updatedProductData } : product
        )
      );
      toast.success("Product updated successfully");
      setEditingProductId(null);
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedProduct({ ...updatedProduct, [name]: value });
  };

  const handleSelectChange = (field, selected) => {
    setUpdatedProduct({ ...updatedProduct, [field]: selected });
  };

  const handleQuillChange = (value) => {
    setUpdatedProduct({ ...updatedProduct, description: value });
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const onCancel = () => {
    setEditingProductId(null);
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>
      {products.map((product, productIdx) => (
        <div key={product._id} className="mb-4">
          {editingProductId === product._id ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                name="name"
                value={updatedProduct.name || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Product Name"
              />
              <input
                type="number"
                name="price"
                value={updatedProduct.price || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Price"
              />
              <input
                type="number"
                name="stock"
                value={updatedProduct.stock || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Stock"
              />
              <ReactQuill 
                value={updatedProduct.description} 
                onChange={handleQuillChange}
                placeholder="Description"
                className="w-full mt-1 border-gray-300 rounded-md focus:ring-gray-900 focus:border-gray-900 h-52"
              />
              <div className="h-8"></div>
              <CreatableSelect
                isMulti
                name="size"
                options={sizeOptions}
                value={updatedProduct.size}
                onChange={(selected) => handleSelectChange('size', selected)}
                className="w-full mt-1"
                placeholder="Size"
              />
              <CreatableSelect
                isMulti
                name="color"
                options={colorOptions}
                value={updatedProduct.color}
                onChange={(selected) => handleSelectChange('color', selected)}
                className="w-full mt-1"
                placeholder="Color"
              />
              <CreatableSelect
                name="category"
                options={categoryOptions}
                value={updatedProduct.category}
                onChange={(selected) => handleSelectChange('category', selected)}
                className="w-full mt-1"
                placeholder="Category"
              />
              <div className="border border-gray-300 p-4 rounded-md">
                <div {...getRootProps()} className="cursor-pointer">
                  <input {...getInputProps()} />
                  <p className="text-sm text-gray-600">
                    Drag 'n' drop some files here, or click to select files
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                  {imagePreviews.map((url, idx) => (
                    <div key={idx} className="relative">
                      <img src={url} alt={`Preview ${idx}`} className="w-full h-32 object-cover rounded-md" />
                      <button
                        type="button"
                        className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-full"
                        onClick={() => removeImage(idx)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  {loading ? "Updating..." : "Update Product"}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-md">
              <div>
                <h2 className="text-lg font-bold">{product.name}</h2>
                <p className="text-gray-600">${product.price}</p>
                <p className="text-gray-600">Stock: {product.stock}</p>
                <div className="mt-2 flex space-x-2">
                  {product.images.slice(0, 3).map((image, idx) => (
                    <img key={idx} src={image} alt={`Product ${idx}`} className="w-16 h-16 object-cover rounded-md" />
                  ))}
                </div>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEditClick(product)}
                  className="px-4 py-2 bg-yellow-400 text-white rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(product._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="flex justify-center mt-4 space-x-2">
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => handlePageClick(idx + 1)}
            className={`px-4 py-2 rounded-md ${
              currentPage === idx + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProductManagement;
