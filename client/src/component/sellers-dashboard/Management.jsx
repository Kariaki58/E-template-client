// admin management dashboard
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CreatableSelect from 'react-select/creatable';
import { useProductUpload } from '../../contextApi/ProductContext';
import { useDropzone } from "react-dropzone";
import { FaTrash } from 'react-icons/fa';
import { RotatingLines } from 'react-loader-spinner'
import { Toaster, toast } from 'react-hot-toast';
import { DatePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import 'quill/dist/quill.snow.css';
import Quill from 'quill';



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

const generateCouponCode = () => {
  return `COUPON-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingProductId, setEditingProductId] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({});
  const [couponCode, setCouponCode] = useState("");
  const [couponPercent, setCouponPercent] = useState("");
  const [date, setDate] = useState(null);

  
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  const handleDateChange = (value) => {
    setDate(value);
  };

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
      console.log(response.data)
      setProducts(response.data.products);
      setTotalPages(Math.ceil(response.data.total / 10));
      setCouponCode(response.data.products[0].coupon)
      setCouponPercent(response.data.products[0].couponPercent)
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
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
    console.log(product.category)
    setUpdatedProduct({
      ...product,
      size: product.sizes.map(size => ({ value: size, label: size })),
      color: product.colors.map(color => ({ value: color, label: color })),
      category:  { value: product.category, label: product.category },
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
  
      await axios.put(
        `${import.meta.env.VITE_APP_BACKEND_BASEURL}/admin/product/edit`,
        updatedProductData,
        { withCredentials: true }
      );
  
      setProducts(
        products.map((product) =>
          product._id === editingProductId ? { ...product, ...updatedProductData } : product
        )
      );
      toast.success("Product updated successfully");
      setEditingProductId(null);
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error)
      } else {
        toast.error("Failed to update product");
      }
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

  const handleApplyCoupon = async () => {
    if (!date) {
      toast.error('date is required')
      return
    }
    if (!couponCode) {
      toast.error('code is required')
      return
    }
    if (!couponPercent) {
      toast.error('coupon percent is required')
      return
    }
    if (Number(couponPercent) < 1) {
      toast.error('coupon must be greater than zero')
      return
    }
    try {
      const selectedProductData = products.map(id => ( { productId: id._id, couponCode, couponPercent }))
      
      await axios.post(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/admin/coupons`, { coupons: selectedProductData, date }, { withCredentials: true });
      toast.success('Coupon applied to selected products');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to apply coupon');
    }
  };

  const handleCouponPercentChange = (e) => {
    setCouponPercent(e.target.value);
  };

  const handleGenerateCoupon = () => {
    setCouponCode(generateCouponCode());
  };

  const handleCouponInputChange = (e) => {
    setCouponCode(e.target.value);
  };

  const removeCoupon = async () => {
    try {
      const respone = await axios.post(`${import.meta.env.VITE_APP_BACKEND_BASEURL}/admin/coupons/delete`, { couponCode, couponPercent }, { withCredentials: true })
      toast.success(respone.data.message)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to apply coupon');
    } finally {
      setCouponCode('')
      setCouponPercent('')
      setDate(null)
    }
  }

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['image', 'video', 'blockquote', 'code-block'],
            ['clean'],
          ],
        },
      });
  
      // When Quill editor content changes, update state
      quillInstance.current.on('text-change', () => {
        const currentContent = quillInstance.current.root.innerHTML;
        setUpdatedProduct((prevState) => ({ ...prevState, description: currentContent }));
      });
    }
  
    // Set the initial content of Quill editor only if it's not yet initialized
    if (quillInstance.current && updatedProduct.description !== undefined && quillInstance.current.root.innerHTML !== updatedProduct.description) {
      quillInstance.current.root.innerHTML = updatedProduct.description;
    }
  }, [updatedProduct.description]);
  

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
    <div className="h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Product Management</h1>

      <div className="space-y-6 mb-10">
  {/* Coupon Code Input and Generate Button */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
    <input
      type="text"
      value={couponCode}
      onChange={handleCouponInputChange}
      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
      placeholder="Enter Coupon Code"
    />
    <button
      onClick={handleGenerateCoupon}
      className="w-full md:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
    >
      Generate Coupon
    </button>
  </div>

  {/* Coupon Percent and Expiration Date */}
  <div className="flex flex-col md:flex-row items-center gap-8">
    <div className="w-full md:w-auto">
      <label className="block text-lg font-medium text-gray-700 mb-2">Coupon Percent Off</label>
      <input
        type="number"
        value={couponPercent}
        onChange={handleCouponPercentChange}
        className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
        placeholder="Enter percent off"
      />
    </div>
    <div className="w-full md:w-auto">
      <h1 className="block text-lg font-medium text-gray-700 mb-2">Select Coupon Expiration Date</h1>
      <DatePicker 
        value={date} 
        onChange={handleDateChange} 
        className="w-full p-3 rounded-lg border border-gray-300 focus:border-blue-500 shadow-sm focus:ring-2 focus:ring-blue-400 transition duration-200"
      />
    </div>
  </div>

  {/* Apply and Remove Coupon Buttons */}
  <div className="flex items-center space-x-4">
    <button
      onClick={handleApplyCoupon}
      className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-400 transition duration-200"
    >
      Apply Coupon
    </button>
    <button
      onClick={removeCoupon}
      className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400 transition duration-200"
    >
      Remove Coupon
    </button>
    </div>
  </div>
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
              <div ref={editorRef} style={{ height: '300px', border: '1px solid #ccc' }} />
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
