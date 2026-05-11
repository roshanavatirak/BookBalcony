

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Upload, X, ChevronLeft, ChevronRight, Eye, 
  Check, Image as ImageIcon, Loader2, AlertCircle, 
  ArrowLeft, Save, CheckCircle2
} from "lucide-react";
import Alert from "../Alert/Alert";
import { useAlert } from "../Alert/useAlert";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

const categoriesList = [
  "Engineering",
  "Medical & NEET Preparation",
  "JEE & Engineering Entrance Prep",
  "UPSC & Civil Services Prep",
  "Government & Banking Exams",
  "Science & Technology",
  "Computer Science & IT",
  "Fiction (General)",
  "Fantasy & Science Fiction",
  "Thriller, Mystery & Suspense",
  "Romance",
  "Motivational & Self-Help",
  "Biography & Autobiography",
  "Literature & Classics",
  "Mythology & Spirituality",
  "History & Politics",
  "Geography & Environment",
  "Economics & Finance",
  "Philosophy & Ethics",
  "Psychology & Mental Health",
  "Poetry",
  "Art, Design & Photography",
  "Travel & Adventure",
  "Children's Books",
  "Young Adult (YA)",
  "Language Learning & Communication",
  "Law & Legal Studies",
  "Data Science, AI & Machine Learning",
  "Comics & Graphic Novels",
  "Cookbooks & Food Culture",
  "Business / Startup",
  "Other",
];

const SellerAddBook = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    desc: "",
    language: "",
    category: "",
    editionOrPublishYear: "",
    stock: "",
  });

  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { alert, hideAlert, success, error, warning } = useAlert();

  const MAX_IMAGES = 3;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "price" || name === "stock") {
      const cleanedValue = value.replace(/[^\d]/g, '').replace(/^0+/, '');
      setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.author.trim()) newErrors.author = "Author name is required";
    if (!formData.price || parseInt(formData.price) <= 0) newErrors.price = "Valid price is required";
    if (!formData.desc.trim()) newErrors.desc = "Description is required";
    if (formData.desc.length < 20) newErrors.desc = "Description should be at least 20 characters";
    if (!formData.language.trim()) newErrors.language = "Language is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = "Valid stock quantity is required";
    if (images.length === 0) newErrors.images = "At least one product image is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (files) => {
    if (images.length >= MAX_IMAGES) {
      warning(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    const validFiles = [];
    const fileArray = Array.from(files);
    
    for (let i = 0; i < fileArray.length && images.length + validFiles.length < MAX_IMAGES; i++) {
      const file = fileArray[i];
      
      if (file.size > MAX_FILE_SIZE) {
        warning(`${file.name} exceeds 5MB limit`);
        continue;
      }
      
      if (!file.type.startsWith('image/')) {
        warning(`${file.name} is not an image file`);
        continue;
      }
      
      validFiles.push(file);
    }

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, { file, preview: e.target.result }]);
        if (errors.images) {
          setErrors(prev => ({ ...prev, images: "" }));
        }
      };
      reader.onerror = () => {
        error(`Failed to read ${file.name}`);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (currentImageIndex >= images.length - 1) {
      setCurrentImageIndex(Math.max(0, images.length - 2));
    }
  };

  const isFormValid = () => {
    return Object.entries(formData).every(([_, val]) => val.toString().trim() !== "") && images.length > 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      error("Please fix all errors before submitting");
      setPreviewMode(false);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('title', formData.title || '');
      formDataToSend.append('author', formData.author || '');
      formDataToSend.append('price', parseInt(formData.price) || 0);
      formDataToSend.append('desc', formData.desc || '');
      formDataToSend.append('language', formData.language || '');
      formDataToSend.append('category', formData.category || '');
      formDataToSend.append('editionOrPublishYear', formData.editionOrPublishYear || '');
      formDataToSend.append('stock', parseInt(formData.stock) || 1);
      
      images.forEach((img) => {
        formDataToSend.append('images', img.file);
      });

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const res = await axios.post(
        `${API_URL}/seller/add-book`,
        formDataToSend,
        {
          headers: {
            id: localStorage.getItem("id"),
            authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        }
      );
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      success("Product listed successfully!");
      
      setTimeout(() => {
        navigate("/seller/myproducts");
      }, 1500);
      
    } catch (err) {
      console.error("❌ Add book error:", err);
      
      let errorMsg = "Failed to add product. Please try again.";
      
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.response?.data?.errors) {
        const errors = err.response.data.errors
          .map(e => `${e.field}: ${e.message}`)
          .join(', ');
        errorMsg = `Validation failed: ${errors}`;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      error(errorMsg);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePreview = () => {
    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      error("Please fill in all required fields correctly");
      return;
    }
    setPreviewMode(true);
  };

  const placeholders = {
    title: "e.g., The Complete Guide to Engineering Mathematics",
    author: "e.g., Dr. Rajesh Kumar",
    price: "e.g., 499",
    desc: "Provide a detailed description including condition, key features...",
    language: "e.g., English, Hindi, or Bilingual",
    editionOrPublishYear: "e.g., 5th Edition (2023) or 2023",
    stock: "e.g., 10",
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white px-4 sm:px-8 py-6 flex justify-center">
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={hideAlert}
          autoClose={alert.autoClose}
          duration={alert.duration}
          position={alert.position}
        />
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900/90 backdrop-blur-xl p-6 rounded-2xl border border-yellow-500/50 shadow-2xl max-w-md w-full mx-4">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Uploading Product</h3>
              <p className="text-zinc-400 mb-4 text-sm">Please wait...</p>
              
              <div className="relative w-full h-2 bg-zinc-700 rounded-full overflow-hidden mb-3">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              
              <p className="text-yellow-400 font-bold">{uploadProgress}%</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl bg-zinc-900/50 rounded-2xl px-6 sm:px-10 py-6 shadow-xl border border-zinc-700">
        {/* Header */}
        <div className="mb-6 text-center">
  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent mb-2">
    List Your Product
  </h1>

  <p className="text-zinc-400 text-sm italic">
    Create a professional listing for your book
  </p>

  <hr className="mt-4 border-zinc-700 rounded-full mx-auto w-1/2" />
</div>


        {!previewMode ? (
          <div>
            {/* Image Upload */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-lg font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-yellow-400" />
                  Product Images <span className="text-red-400">*</span>
                </label>
                <span className="text-xs px-3 py-1 bg-zinc-800 rounded-full border border-zinc-700">
                  {images.length}/{MAX_IMAGES}
                </span>
              </div>
              
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl transition-all ${
                  dragActive 
                    ? 'border-yellow-400 bg-yellow-400/5' 
                    : errors.images 
                      ? 'border-red-500/50 bg-red-500/5'
                      : 'border-zinc-700/50 bg-zinc-800/30'
                } ${images.length >= MAX_IMAGES ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-zinc-600'}`}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  disabled={images.length >= MAX_IMAGES}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                
                <div className="p-8 text-center">
                  <Upload className={`w-10 h-10 mx-auto mb-3 ${errors.images ? 'text-red-400' : 'text-yellow-400'}`} />
                  <p className="text-sm font-semibold text-white mb-2">
                    {images.length >= MAX_IMAGES ? 'Gallery Complete' : 'Upload Product Images'}
                  </p>
                  <p className={`text-xs mb-3 ${errors.images ? 'text-red-400' : 'text-zinc-400'}`}>
                    {errors.images || 'Drag & drop or click to browse'}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-zinc-800 rounded border border-zinc-700 text-zinc-300">PNG, JPG, WEBP</span>
                    <span className="px-2 py-1 bg-zinc-800 rounded border border-zinc-700 text-zinc-300">Max 5MB</span>
                    <span className="px-2 py-1 bg-zinc-800 rounded border border-zinc-700 text-zinc-300">Up to {MAX_IMAGES} images</span>
                  </div>
                </div>
              </div>

              {/* Image Preview Grid */}
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="relative overflow-hidden rounded-lg bg-zinc-800 border border-zinc-700 group-hover:border-zinc-600">
                        <img
                          src={img.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover transition-all group-hover:scale-110"
                        />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-yellow-400 rounded text-xs font-bold text-black">
                            Primary
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <hr className="my-6 border-zinc-700" />

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className={key === "desc" ? "md:col-span-2" : ""}>
                  <label className="block mb-2 text-sm font-semibold text-zinc-300 flex items-center gap-1">
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                    {(key === "title" || key === "price" || key === "author" || key === "desc" || key === "language" || key === "category" || key === "stock") && (
                      <span className="text-red-400">*</span>
                    )}
                  </label>
                  {key === "category" ? (
                    <>
                      <select
                        name={key}
                        value={value}
                        onChange={handleChange}
                        className={`w-full px-3 py-2.5 rounded-lg bg-zinc-800 border text-white text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors[key] 
                            ? 'border-red-500/50 focus:ring-red-400' 
                            : 'border-zinc-700 focus:ring-yellow-400'
                        }`}
                      >
                        <option value="" disabled>Select a category</option>
                        {categoriesList.map((cat, idx) => (
                          <option key={idx} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {errors[key] && (
                        <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors[key]}
                        </p>
                      )}
                    </>
                  ) : key === "desc" ? (
                    <>
                      <textarea
                        name={key}
                        value={value}
                        onChange={handleChange}
                        placeholder={placeholders[key]}
                        rows={4}
                        className={`w-full px-3 py-2.5 rounded-lg bg-zinc-800 border placeholder:text-zinc-500 text-white text-sm focus:outline-none focus:ring-2 transition-all resize-none ${
                          errors[key] 
                            ? 'border-red-500/50 focus:ring-red-400' 
                            : 'border-zinc-700 focus:ring-yellow-400'
                        }`}
                      />
                      <div className="flex items-center justify-between mt-1">
                        {errors[key] && (
                          <p className="text-xs text-red-400 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors[key]}
                          </p>
                        )}
                        <p className={`text-xs ml-auto ${value.length < 20 ? 'text-yellow-400' : 'text-zinc-400'}`}>
                          {value.length} characters {value.length < 20 && '(min 20)'}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <input
                        type={key === "price" || key === "stock" ? "text" : "text"}
                        name={key}
                        value={value}
                        onChange={handleChange}
                        placeholder={placeholders[key]}
                        inputMode={key === "price" || key === "stock" ? "numeric" : "text"}
                        className={`w-full px-3 py-2.5 rounded-lg bg-zinc-800 border placeholder:text-zinc-500 text-white text-sm focus:outline-none focus:ring-2 transition-all ${
                          errors[key] 
                            ? 'border-red-500/50 focus:ring-red-400' 
                            : 'border-zinc-700 focus:ring-yellow-400'
                        }`}
                      />
                      {errors[key] && (
                        <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors[key]}
                        </p>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 pt-6 border-t border-zinc-700">
              <button
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-zinc-700 text-white font-semibold hover:bg-zinc-600 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              
              <button
                onClick={handlePreview}
                disabled={!isFormValid()}
                className="w-full sm:w-auto px-8 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:from-yellow-500 hover:to-yellow-600 flex items-center justify-center gap-2 text-sm"
              >
                <Eye className="w-4 h-4" />
                Preview Listing
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Preview Mode */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Product Preview</h2>
              <span className="text-xs px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30 text-green-400 font-semibold">
                Ready to List
              </span>
            </div>

            <div className="bg-zinc-800/40 p-6 rounded-xl border border-zinc-700">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Image Slider */}
                <div className="lg:w-1/2">
                  <div className="relative group">
                    <div className="relative overflow-hidden rounded-xl border-2 border-zinc-700">
                      <img
                        src={images[currentImageIndex]?.preview}
                        alt="Product"
                        className="w-full h-80 object-cover"
                      />
                      <div className="absolute top-3 right-3 px-3 py-1 bg-zinc-900/80 backdrop-blur-sm rounded-lg text-xs font-bold text-yellow-400">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </div>
                    
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-zinc-900/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-zinc-800"
                        >
                          <ChevronLeft className="w-5 h-5 text-yellow-400" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-zinc-900/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-zinc-800"
                        >
                          <ChevronRight className="w-5 h-5 text-yellow-400" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {images.length > 1 && (
                    <div className="flex gap-2 mt-3">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`flex-1 rounded-lg overflow-hidden transition-all ${
                            idx === currentImageIndex 
                              ? 'ring-2 ring-yellow-400' 
                              : 'ring-1 ring-zinc-700 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img.preview} alt={`Thumb ${idx + 1}`} className="w-full h-16 object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="lg:w-1/2 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{formData.title}</h3>
                    <p className="text-base text-yellow-400">by {formData.author}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-yellow-900/20 p-3 rounded-lg border border-yellow-500/30">
                      <p className="text-xs text-yellow-300 mb-1">Price</p>
                      <p className="text-2xl font-bold text-yellow-400">₹{formData.price}</p>
                    </div>
                    <div className="bg-green-900/20 p-3 rounded-lg border border-green-500/30">
                      <p className="text-xs text-green-300 mb-1">Stock</p>
                      <p className="text-2xl font-bold text-green-400">{formData.stock}</p>
                    </div>
                  </div>

                  <div className="space-y-2 bg-zinc-900/50 p-4 rounded-lg border border-zinc-700 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Category:</span>
                      <span className="text-white font-semibold">{formData.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Language:</span>
                      <span className="text-white font-semibold">{formData.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Edition/Year:</span>
                      <span className="text-white font-semibold">{formData.editionOrPublishYear || "Not specified"}</span>
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700">
                    <p className="text-xs font-semibold text-yellow-400 mb-2">Description</p>
                    <p className="text-zinc-300 text-sm leading-relaxed">{formData.desc}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 pt-6 border-t border-zinc-700">
                <button
                  onClick={() => setPreviewMode(false)}
                  disabled={isUploading}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-zinc-700 text-white font-semibold hover:bg-zinc-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Edit Details
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={isUploading}
                  className="w-full sm:w-auto px-8 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:from-yellow-500 hover:to-yellow-600 flex items-center justify-center gap-2 text-sm"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Publish Listing
                      <Save className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerAddBook;