

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Upload, X, ChevronLeft, ChevronRight, Eye,
  Check, Image as ImageIcon, Loader2, AlertCircle,
  ArrowLeft, Save, CheckCircle2, Calendar, Clock
} from "lucide-react";
import Alert from "../Alert/Alert";
import { useAlert } from "../Alert/useAlert";
import Loader from "../Loader/Loader";

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
  "Business & Economics",
  "History & Politics",
  "Geography & Environment",
  "Economics & Finance",
  "Philosophy & Ethics",
  "Psychology & Mental Health",
  "Poetry",
  "Art, Design & Photography",
  "Travel & Adventure",
  "School Textbooks (Class 9-12)",
  "Higher Education & University",
  "Children & Young Adult",
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
    goLiveOption: "immediately", // "immediately" | "scheduled"
    goLiveDateOnly: "",
    goLiveTimeOnly: "12:00",
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

    if (name === "price") {
      const cleanedValue = value.replace(/[^\d]/g, '').replace(/^0+/, '').slice(0, 8); // Max ₹9,99,99,999
      setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
    } else if (name === "stock") {
      const cleanedValue = value.replace(/[^\d]/g, '').replace(/^0+/, '').slice(0, 5); // Max 99,999
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

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    }

    if (!formData.author.trim()) {
      newErrors.author = "Author name is required";
    } else if (formData.author.trim().length < 2) {
      newErrors.author = "Author name must be at least 2 characters long";
    }

    if (!formData.price || parseInt(formData.price) <= 0) newErrors.price = "Valid price is required";
    if (!formData.desc.trim()) newErrors.desc = "Description is required";
    if (formData.desc.length < 20) newErrors.desc = "Description should be at least 20 characters";
    if (!formData.language.trim()) newErrors.language = "Language is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = "Valid stock quantity is required";
    if (images.length === 0) newErrors.images = "At least one product image is required";

    if (formData.goLiveOption === "scheduled") {
      if (!formData.goLiveDateOnly) {
        newErrors.goLiveDate = "Go-live date is required";
      } else if (!formData.goLiveTimeOnly) {
        newErrors.goLiveDate = "Go-live time is required";
      } else {
        const fullDate = new Date(`${formData.goLiveDateOnly}T${formData.goLiveTimeOnly}`);
        if (isNaN(fullDate.getTime())) {
          newErrors.goLiveDate = "Invalid date or time selected";
        } else if (fullDate.getTime() <= Date.now()) {
          newErrors.goLiveDate = "Scheduled go-live date & time cannot be in the past. Please pick a future date and time.";
        }
      }
    }

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
    const hasImages = images.length > 0;
    const hasBasicFields = formData.title.trim().length >= 3 &&
      formData.author.trim().length >= 2 &&
      Number(formData.price) > 0 &&
      formData.desc.trim().length >= 20 &&
      formData.language.trim() !== "" &&
      formData.category !== "";
    
    if (formData.goLiveOption === "scheduled") {
      if (!formData.goLiveDateOnly || !formData.goLiveTimeOnly) return false;
      const fullDate = new Date(`${formData.goLiveDateOnly}T${formData.goLiveTimeOnly}`);
      if (isNaN(fullDate.getTime()) || fullDate.getTime() <= Date.now()) return false;
    }

    return hasImages && hasBasicFields;
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
      const finalGoLiveDate = (formData.goLiveOption === "scheduled" && formData.goLiveDateOnly)
        ? `${formData.goLiveDateOnly}T${formData.goLiveTimeOnly || "00:00"}`
        : '';

      formDataToSend.append('title', formData.title || '');
      formDataToSend.append('author', formData.author || '');
      formDataToSend.append('price', parseInt(formData.price) || 0);
      formDataToSend.append('desc', formData.desc || '');
      formDataToSend.append('language', formData.language || '');
      formDataToSend.append('category', formData.category || '');
      formDataToSend.append('editionOrPublishYear', formData.editionOrPublishYear || '');
      formDataToSend.append('stock', parseInt(formData.stock) || 1);
      formDataToSend.append('goLiveOption', formData.goLiveOption || 'immediately');
      formDataToSend.append('goLiveDate', finalGoLiveDate);

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
        errorMsg = err.response.data.message.replace(/^books validation failed:\s*/i, '').replace(/^[a-z]+:\s*/i, '');
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error.replace(/^books validation failed:\s*/i, '').replace(/^[a-z]+:\s*/i, '');
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
      error("Please fix all errors in the form before previewing");
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
    <div className="min-h-[calc(100vh-4.2rem)] lg:h-[calc(100vh-4.2rem)] lg:max-h-[calc(100vh-4.2rem)] overflow-y-auto lg:overflow-hidden bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white p-3 sm:p-4 flex items-center justify-center">
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

      {/* Upload Progress Overlay */}
      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900/90 backdrop-blur-xl p-5 rounded-xl border border-yellow-500/50 shadow-2xl max-w-sm w-full mx-4">
            <div className="text-center">
              <Loader size="sm" />
              <h3 className="text-base font-bold text-white mb-1 mt-2">Uploading Product</h3>
              <p className="text-zinc-400 mb-3 text-xs">Please wait...</p>
              
              <div className="relative w-full h-1.5 bg-zinc-700 rounded-full overflow-hidden mb-2">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              
              <p className="text-yellow-400 text-xs font-bold">{uploadProgress}%</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl h-auto lg:h-full flex flex-col justify-between bg-zinc-900/80 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-zinc-700/80 shadow-2xl overflow-y-auto lg:overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-700/60 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
              List Your Product
            </h1>
          </div>
          <span className="text-xs text-zinc-400 italic">Create a professional listing for your book</span>
        </div>

        {!previewMode ? (
          <div className="flex-1 flex flex-col justify-between overflow-y-auto lg:overflow-hidden my-2">
            {/* Main Side-by-Side Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 lg:overflow-hidden">
              
              {/* Left Column: Image Upload (4 cols on lg) */}
              <div className="col-span-1 lg:col-span-4 flex flex-col justify-between bg-zinc-800/40 p-3 rounded-lg border border-zinc-700/50">
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-white flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-yellow-400" />
                      Book Covers <span className="text-red-400">*</span>
                    </label>
                    <span className="text-xs px-2 py-0.5 bg-zinc-800 rounded-full border border-zinc-700 text-zinc-300">
                      {images.length}/{MAX_IMAGES}
                    </span>
                  </div>

                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative min-h-[120px] lg:flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-all ${
                      dragActive 
                        ? 'border-yellow-400 bg-yellow-400/5' 
                        : errors.images 
                          ? 'border-red-500/50 bg-red-500/5'
                          : 'border-zinc-700/60 bg-zinc-800/40'
                    } ${images.length >= MAX_IMAGES ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-zinc-500'}`}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files)}
                      disabled={images.length >= MAX_IMAGES}
                      className={`absolute inset-0 w-full h-full opacity-0 ${images.length >= MAX_IMAGES ? 'pointer-events-none' : 'cursor-pointer'}`}
                    />
                    
                    <div className="p-3 text-center">
                      <Upload className={`w-8 h-8 mx-auto mb-2 ${errors.images ? 'text-red-400' : 'text-yellow-400'}`} />
                      <p className="text-xs font-semibold text-white mb-1">
                        {images.length >= MAX_IMAGES ? 'Max Images Uploaded' : 'Upload Cover Images'}
                      </p>
                      <p className={`text-[11px] mb-2 ${errors.images ? 'text-red-400' : 'text-zinc-400'}`}>
                        {errors.images || 'Drag & drop or click to browse'}
                      </p>
                      <span className="inline-block text-[10px] text-zinc-400 bg-zinc-800 px-2 py-1 rounded border border-zinc-700">PNG, JPG, WEBP • Max 5MB</span>
                    </div>
                  </div>
                </div>

                {/* Thumbnails Grid */}
                {images.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 mt-3 h-16 flex-shrink-0">
                    {images.map((img, index) => (
                      <div key={index} className="relative group h-full">
                        <div className="relative overflow-hidden rounded bg-zinc-800 border border-zinc-700 h-full">
                          <img
                            src={img.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {index === 0 && (
                            <div className="absolute top-1 left-1 px-1 py-0.2 bg-yellow-400 rounded text-[9px] font-bold text-black">
                              Main
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-1 -right-1 p-0.5 bg-red-500 rounded-full text-white hover:bg-red-600 shadow"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 p-2 bg-yellow-400/5 rounded border border-yellow-400/20 text-[11px] text-zinc-300 flex-shrink-0">
                    💡 <span className="text-yellow-400 font-semibold">Tip:</span> Clear cover images increase buyer interest by 40%.
                  </div>
                )}
              </div>

              {/* Right Column: Form Fields Grid (8 cols on lg) */}
              <div className="col-span-1 lg:col-span-8 flex flex-col justify-between lg:overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs flex-1">
                  {/* Title (Span 2) */}
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-200 mb-1">
                      Book Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder={placeholders.title}
                      className={`w-full px-3 py-2 rounded-md bg-zinc-800/90 border text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:ring-1 ${
                        errors.title ? 'border-red-500 focus:ring-red-400' : 'border-zinc-700 focus:ring-yellow-400'
                      }`}
                    />
                    {errors.title && <p className="text-[10px] text-red-400 mt-0.5">{errors.title}</p>}
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-200 mb-1">
                      Author Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      placeholder={placeholders.author}
                      className={`w-full px-3 py-2 rounded-md bg-zinc-800/90 border text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:ring-1 ${
                        errors.author ? 'border-red-500 focus:ring-red-400' : 'border-zinc-700 focus:ring-yellow-400'
                      }`}
                    />
                    {errors.author && <p className="text-[10px] text-red-400 mt-0.5">{errors.author}</p>}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-200 mb-1">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 rounded-md bg-zinc-800/90 border text-white text-xs focus:outline-none focus:ring-1 ${
                        errors.category ? 'border-red-500 focus:ring-red-400' : 'border-zinc-700 focus:ring-yellow-400'
                      }`}
                    >
                      <option value="" disabled>Select category</option>
                      {categoriesList.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-[10px] text-red-400 mt-0.5">{errors.category}</p>}
                  </div>

                  {/* Price (₹) */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-200 mb-1">
                      Price (₹) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder={placeholders.price}
                      inputMode="numeric"
                      className={`w-full px-3 py-2 rounded-md bg-zinc-800/90 border text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:ring-1 ${
                        errors.price ? 'border-red-500 focus:ring-red-400' : 'border-zinc-700 focus:ring-yellow-400'
                      }`}
                    />
                    {errors.price && <p className="text-[10px] text-red-400 mt-0.5">{errors.price}</p>}
                  </div>

                  {/* Stock Quantity */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-200 mb-1">
                      Stock Quantity <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder={placeholders.stock}
                      inputMode="numeric"
                      className={`w-full px-3 py-2 rounded-md bg-zinc-800/90 border text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:ring-1 ${
                        errors.stock ? 'border-red-500 focus:ring-red-400' : 'border-zinc-700 focus:ring-yellow-400'
                      }`}
                    />
                    {errors.stock && <p className="text-[10px] text-red-400 mt-0.5">{errors.stock}</p>}
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-200 mb-1">
                      Language <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      placeholder={placeholders.language}
                      className={`w-full px-3 py-2 rounded-md bg-zinc-800/90 border text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:ring-1 ${
                        errors.language ? 'border-red-500 focus:ring-red-400' : 'border-zinc-700 focus:ring-yellow-400'
                      }`}
                    />
                    {errors.language && <p className="text-[10px] text-red-400 mt-0.5">{errors.language}</p>}
                  </div>

                  {/* Edition / Year */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-200 mb-1">
                      Edition / Publish Year
                    </label>
                    <input
                      type="text"
                      name="editionOrPublishYear"
                      value={formData.editionOrPublishYear}
                      onChange={handleChange}
                      placeholder={placeholders.editionOrPublishYear}
                      className="w-full px-3 py-2 rounded-md bg-zinc-800/90 border border-zinc-700 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    />
                  </div>

                  {/* Go-Live Schedule (Span 2) */}
                  <div className="col-span-1 sm:col-span-2 bg-zinc-800/50 p-2.5 rounded-md border border-zinc-700/60">
                    <label className="block text-xs font-semibold text-yellow-400 mb-1 flex items-center gap-1">
                      🚀 Go-Live Schedule
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <label className={`flex items-center gap-2 p-2 rounded cursor-pointer border transition-all ${
                        formData.goLiveOption === "immediately" ? "bg-yellow-400/10 border-yellow-400/60 text-white" : "bg-zinc-800 border-zinc-700 text-zinc-400"
                      }`}>
                        <input
                          type="radio"
                          name="goLiveOption"
                          value="immediately"
                          checked={formData.goLiveOption === "immediately"}
                          onChange={handleChange}
                          className="accent-yellow-400"
                        />
                        <span>Immediately after Admin Approval</span>
                      </label>

                      <label className={`flex items-center gap-2 p-2 rounded cursor-pointer border transition-all ${
                        formData.goLiveOption === "scheduled" ? "bg-yellow-400/10 border-yellow-400/60 text-white" : "bg-zinc-800 border-zinc-700 text-zinc-400"
                      }`}>
                        <input
                          type="radio"
                          name="goLiveOption"
                          value="scheduled"
                          checked={formData.goLiveOption === "scheduled"}
                          onChange={handleChange}
                          className="accent-yellow-400"
                        />
                        <span>Schedule Date & Time</span>
                      </label>
                    </div>

                    {formData.goLiveOption === "scheduled" && (
                      <div className="mt-2 text-xs space-y-1.5">
                        <label className="block text-[11px] font-semibold text-zinc-300">
                          Select Go-Live Date & Time <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {/* Date Input with Calendar Icon */}
                          <div>
                            <label className="block text-[10px] text-zinc-400 mb-0.5 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-yellow-400" /> Go-Live Date
                            </label>
                            <input
                              type="date"
                              name="goLiveDateOnly"
                              value={formData.goLiveDateOnly}
                              onChange={handleChange}
                              min={new Date().toISOString().split('T')[0]}
                              className={`w-full px-2.5 py-1.5 rounded bg-zinc-900 border text-white text-xs focus:outline-none focus:ring-1 ${
                                errors.goLiveDate ? 'border-red-500 focus:ring-red-400' : 'border-zinc-700 focus:ring-yellow-400'
                              }`}
                            />
                          </div>

                          {/* Time Input with Clock Icon */}
                          <div>
                            <label className="block text-[10px] text-zinc-400 mb-0.5 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-yellow-400" /> Go-Live Time
                            </label>
                            <input
                              type="time"
                              name="goLiveTimeOnly"
                              value={formData.goLiveTimeOnly}
                              onChange={handleChange}
                              className={`w-full px-2.5 py-1.5 rounded bg-zinc-900 border text-white text-xs focus:outline-none focus:ring-1 ${
                                errors.goLiveDate ? 'border-red-500 focus:ring-red-400' : 'border-zinc-700 focus:ring-yellow-400'
                              }`}
                            />
                          </div>
                        </div>
                        {errors.goLiveDate && <p className="text-[10px] text-red-400 mt-0.5">{errors.goLiveDate}</p>}
                      </div>
                    )}
                  </div>

                  {/* Description (Span 2) */}
                  <div className="col-span-1 sm:col-span-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-zinc-200">
                        Description <span className="text-red-400">*</span>
                      </label>
                      <span className={`text-[11px] ${formData.desc.length < 20 ? 'text-yellow-400' : 'text-zinc-400'}`}>
                        {formData.desc.length} chars {formData.desc.length < 20 && '(min 20)'}
                      </span>
                    </div>
                    <textarea
                      name="desc"
                      value={formData.desc}
                      onChange={handleChange}
                      placeholder={placeholders.desc}
                      rows={3}
                      className={`w-full px-3 py-2 rounded-md bg-zinc-800/90 border text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:ring-1 resize-none ${
                        errors.desc ? 'border-red-500 focus:ring-red-400' : 'border-zinc-700 focus:ring-yellow-400'
                      }`}
                    />
                    {errors.desc && <p className="text-[10px] text-red-400">{errors.desc}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-700/60 flex-shrink-0 mt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-2 rounded-md bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all text-xs font-medium"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={handlePreview}
                disabled={!isFormValid()}
                className="px-7 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:from-yellow-500 hover:to-yellow-600 flex items-center gap-1.5 text-xs shadow-md"
              >
                <Eye className="w-4 h-4" />
                Preview Listing
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between overflow-y-auto lg:overflow-hidden my-2">
            {/* Preview Mode */}
            <div className="flex items-center justify-between pb-2 border-b border-zinc-700/60 flex-shrink-0">
              <h2 className="text-sm font-bold text-white">Product Preview</h2>
              <span className="text-xs px-2.5 py-0.5 bg-green-500/20 rounded-full border border-green-500/30 text-green-400 font-semibold">
                Ready to Publish
              </span>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-y-auto lg:overflow-hidden bg-zinc-800/30 p-3 rounded-lg border border-zinc-700/50 my-2">
              {/* Image Preview */}
              <div className="col-span-1 lg:col-span-5 flex flex-col justify-between">
                <div className="relative rounded-lg overflow-hidden border border-zinc-700 h-48 lg:flex-1 bg-zinc-900 flex items-center justify-center max-h-56">
                  <img
                    src={images[currentImageIndex]?.preview}
                    alt="Product"
                    className="max-h-full max-w-full object-contain"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-zinc-900/80 rounded text-xs font-bold text-yellow-400">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </div>

                {images.length > 1 && (
                  <div className="flex gap-2 mt-2 h-12 flex-shrink-0">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`flex-1 rounded overflow-hidden border transition-all ${
                          idx === currentImageIndex ? 'border-yellow-400' : 'border-zinc-700 opacity-60'
                        }`}
                      >
                        <img src={img.preview} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details Preview */}
              <div className="col-span-1 lg:col-span-7 flex flex-col justify-between text-xs space-y-2 lg:overflow-hidden">
                <div>
                  <h3 className="text-base font-bold text-white truncate">{formData.title}</h3>
                  <p className="text-xs text-yellow-400 font-medium truncate">by {formData.author}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-yellow-900/20 p-2 rounded border border-yellow-500/30 min-w-0 overflow-hidden">
                    <p className="text-[10px] text-yellow-300">Price</p>
                    <p className="text-base font-bold text-yellow-400 truncate" title={`₹${formData.price}`}>
                      ₹{formData.price ? Number(formData.price).toLocaleString('en-IN') : 0}
                    </p>
                  </div>
                  <div className="bg-green-900/20 p-2 rounded border border-green-500/30 min-w-0 overflow-hidden">
                    <p className="text-[10px] text-green-300">Stock</p>
                    <p className="text-base font-bold text-green-400 truncate" title={formData.stock}>
                      {formData.stock ? Number(formData.stock).toLocaleString('en-IN') : 0}
                    </p>
                  </div>
                </div>

                <div className="bg-zinc-900/60 p-2.5 rounded border border-zinc-700 space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-zinc-400">Category:</span><span className="text-white font-medium truncate ml-1">{formData.category}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-400">Language:</span><span className="text-white font-medium truncate ml-1">{formData.language}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-400">Edition/Year:</span><span className="text-white font-medium truncate ml-1">{formData.editionOrPublishYear || "N/A"}</span></div>
                  <div className="flex justify-between pt-1 border-t border-zinc-700/50">
                    <span className="text-zinc-400">Go-Live Schedule:</span>
                    <span className="text-yellow-400 font-semibold truncate ml-1">
                      {formData.goLiveOption === "immediately"
                        ? "Immediately after Admin Approval"
                        : `Scheduled: ${formData.goLiveDateOnly ? new Date(`${formData.goLiveDateOnly}T${formData.goLiveTimeOnly || "00:00"}`).toLocaleString() : "Not set"}`}
                    </span>
                  </div>
                </div>

                <div className="bg-zinc-900/60 p-2.5 rounded border border-zinc-700 flex-1 lg:overflow-hidden">
                  <p className="text-xs font-semibold text-yellow-400 mb-1">Description</p>
                  <p className="text-zinc-300 text-xs line-clamp-4 leading-relaxed break-words break-all">{formData.desc}</p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-700/60 flex-shrink-0">
              <button
                type="button"
                onClick={() => setPreviewMode(false)}
                disabled={isUploading}
                className="px-5 py-2 rounded-md bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all text-xs font-medium flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Edit Details
              </button>
              
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isUploading}
                className="px-7 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:from-yellow-500 hover:to-yellow-600 flex items-center gap-1.5 text-xs shadow-md"
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
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerAddBook;