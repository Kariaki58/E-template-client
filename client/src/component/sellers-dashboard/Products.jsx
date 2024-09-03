import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useProductUpload } from '../../contextApi/ProductContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';
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

const Products = () => {
  const {
    productName,
    setProductName,
    setProductImages,
    selectedSizes,
    setSelectedSizes,
    selectedColors,
    productImages,
    setSelectedColors,
    selectedCategory,
    setSelectedCategory,
    stock,
    setStock,
    description,
    setDescription,
    price,
    setPrice,
    loading,
    handleSubmit,
    imagePreviews,
    setImagePreviews
  } = useProductUpload();

  const [images, setImages] = useState([]);

  const onDrop = async (acceptedFiles) => {
    setImages([...images, ...acceptedFiles]);
    setImagePreviews([...imagePreviews, ...acceptedFiles.map(file => URL.createObjectURL(file))]);
    setProductImages(prev => [...productImages, ...Array.from(acceptedFiles)])
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newImagePreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newImagePreviews);
    setProductImages(prev => newImagePreviews)
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*', multiple: true });

  return (
    <div className="max-w-4xl mx-auto p-3 bg-white rounded-lg">
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
              onChange={(selected) => setSelectedCategory(selected)}
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

          <div className='sm:col-span-2'>
            <label className="block text-gray-950">Product Images:</label>
            <div {...getRootProps()} className="dropzone border-dashed border-2 border-gray-300 p-4 rounded-md text-center mb-4 cursor-pointer">
              <input {...getInputProps()} />
              <p>Drag 'n' drop images here, or click to select multiple images</p>
            </div>
            {
              imagePreviews && imagePreviews.length ? (
                <div className="image-previews flex gap-4 w-full overflow-x-auto p-4">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="w-40 flex-shrink-0 relative h-full">
                      <img src={src} alt={`Preview ${index + 1}`} className="max-w-full h-auto rounded-md" />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        onClick={() => removeImage(index)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              ) : <></>
            }
          </div>

          <div className="sm:col-span-2 max-sm:mb-10">
            <label className="block text-gray-950">Description:</label>
            <ReactQuill 
              value={description} 
              onChange={(value) => setDescription(value)}
              required
              className="w-full mt-1 p-2 border-gray-300 rounded-md focus:ring-gray-900 focus:border-gray-900 h-52 mb-8"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-gray-900 text-white rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
        >
          {loading ? 'Uploading...' : 'Upload Product'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Products;
