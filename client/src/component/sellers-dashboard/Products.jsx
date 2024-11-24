// product dashboard
import React, { useState, useEffect, useRef } from 'react';
import CreatableSelect from 'react-select/creatable';
import { useProductUpload } from '../../contextApi/ProductContext';
import 'quill/dist/quill.snow.css';
import Quill from 'quill';
import { useDropzone } from 'react-dropzone';
import { FaTrash } from 'react-icons/fa';
import Accordion from './Accordion'; // Import the updated Accordion component

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
  { value: 'Men Collection', label: 'Men collection' },
  { value: 'Female Collection', label: 'Female Collection' },
  { value: 'Kids Collection', label: 'Kids Collection' },
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
    setImagePreviews,
    faqItems,
    setFaqItems,
  } = useProductUpload();

  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    await handleSubmit(e);
    if (!loading && quillInstance.current) {
      quillInstance.current.root.innerHTML = '';
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

      quillInstance.current.on('text-change', () => {
        const currentContent = quillInstance.current.root.innerHTML;
        setDescription(currentContent);
      });
    }
  }, [description]);


  const onDrop = async (acceptedFiles) => {
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file)); // URL for preview
    setImagePreviews([...imagePreviews, ...newPreviews]); // Update image previews
    setProductImages(prev => [...productImages, ...acceptedFiles]); // Keep raw files for upload
  };

  const removeImage = (index) => {
    const updatedImagePreviews = imagePreviews.filter((_, i) => i !== index);
    const updatedProductImages = productImages.filter((_, i) => i !== index);
    setImagePreviews(updatedImagePreviews);
    setProductImages(updatedProductImages);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*', multiple: true });

  return (
    <div className="max-w-4xl mx-auto p-3 bg-white rounded-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Upload Product</h2>
      <form onSubmit={handleSubmitProduct} className="space-y-6">
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
            <div ref={editorRef} style={{ height: '300px', border: '1px solid #ccc' }} />
          </div>
        </div>

        <Accordion faqItems={faqItems} setFaqItems={setFaqItems} />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-gray-900 text-white rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
        >
          {loading ? 'Uploading...' : 'Upload Product'}
        </button>
      </form>
    </div>
  );
  };

export default Products;
