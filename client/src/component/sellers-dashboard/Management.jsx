import React, { useState, useEffect } from "react";
import axios from "axios";
import CreatableSelect from 'react-select/creatable';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useProductUpload } from '../../contextApi/ProductContext';
import { useDropzone } from "react-dropzone";
import { FaTrash } from 'react-icons/fa';
import { RotatingLines } from 'react-loader-spinner'
import { Toaster, toast } from 'react-hot-toast';


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
      setProducts(response.data.products);
      setTotalPages(Math.ceil(response.data.total / 10));
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('unexpected error occured')
      }
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
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('unexpected error occured')
      }
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);
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

      let images = [];
  
      if (productImages.length > 0) {
        const uploadPromises = productImages.map(async (img) => {
          let imgUrl = await uploadFile(img, "image", imgTimestamp, imgSignature);
          imgUrl = String(imgUrl)
          if (imgUrl.startsWith('https://')) {
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

  if (loading) {
    return (
      <div className='flex justify-center items-center mt-2'>
        <RotatingLines
          visible={true}
          height="96"
          width="96"
          color="grey"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    )
  }

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Product Management</h1>
      {products.map((product, productIdx) => (
        <div key={product._id} className="mb-4">
          {editingProductId === product._id ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <lable>Product Name</lable>
              <input
                type="text"
                name="name"
                value={updatedProduct.name || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Product Name"
              />
              <lable className="mt-5 block">Price</lable>
              <input
                type="number"
                name="price"
                value={updatedProduct.price || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Price"
              />
              <label className="mt-5 block">Percent Off</label>
              <input
                type="number"
                name="percent"
                value={updatedProduct.percent || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="percentage off"
              />
              <label className="mt-5 block">Stock</label>
              <input
                type="number"
                name="stock"
                value={updatedProduct.stock || ""}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Stock"
              />
              <label className="mt-5 block">Product Description</label>
              <ReactQuill 
                value={updatedProduct.description} 
                onChange={handleQuillChange}
                placeholder="Description"
                className="w-full mt-1 border-gray-300 rounded-md focus:ring-gray-900 focus:border-gray-900 h-52"
              />
              <div className="h-8"></div>
              <label className="mt-5 block">Sizes</label>
              <CreatableSelect
                isMulti
                name="size"
                options={sizeOptions}
                value={updatedProduct.size || []}
                onChange={(selected) => handleSelectChange('size', selected)}
                className="w-full"
                classNamePrefix="select"
              />
              <label className="mt-5 block">Colors</label>
              <CreatableSelect
                isMulti
                name="color"
                options={colorOptions}
                value={updatedProduct.color || []}
                onChange={(selected) => handleSelectChange('color', selected)}
                className="w-full"
                classNamePrefix="select"
              />
              <label className="mt-5 block">Category</label>
              <CreatableSelect
                name="category"
                options={categoryOptions}
                value={updatedProduct.category || {}}
                onChange={(selected) => handleSelectChange('category', selected)}
                className="w-full"
                classNamePrefix="select"
              />
              <lable className="mt-5 block">Images</lable>
              <div {...getRootProps()} className="border-2 border-dashed p-4 text-center cursor-pointer mb-4">
                <input {...getInputProps()} />
                <p>Drag & drop images here, or click to select images</p>
              </div>
              <div className="flex flex-wrap gap-4">
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative">
                    <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded-md" />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" className="px-4 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-600" onClick={onCancel}>
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-wrap gap-4 bg-gray-50 p-2 rounded-md shadow-sm">
              <div className="mt-2 flex space-x-2">
                  {product.images.slice(0, 3).map((image, idx) => (
                    <img key={idx} src={image} alt={`Product ${idx}`} className="w-16 h-16 object-cover rounded-md" />
                  ))}
              </div>
              <div className="w-full md:w-1/2">
                <h2 className="text-lg font-bold text-gray-800">{product.name}</h2>
                <p className="text-gray-700">Price: {formatPrice(product.price - (product.price * (product.percentOff / 100)))}</p>
                <p className="text-gray-700">Stock: {product.stock}</p>
                <p className="text-gray-700">percentOff: {product.percentOff}</p>
              </div>
              <div className="flex w-full md:w-auto items-center justify-end space-x-2 mt-4 md:mt-0">
                <button onClick={() => handleEditClick(product)} className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
                  Edit
                </button>
                <button onClick={() => handleDeleteClick(product._id)} className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600">
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => handlePageClick(idx + 1)}
            className={`px-4 py-2 mx-1 ${currentPage === idx + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-md`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
      <Toaster />
    </div>
  );
};

export default ProductManagement;
