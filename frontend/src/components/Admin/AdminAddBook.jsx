import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Upload, X, ChevronLeft, ChevronRight, ShoppingBag, Sparkles, 
  Eye, Edit3, Check, Image as ImageIcon, TrendingUp, BookOpen, 
  Star, Zap, PackagePlus, Loader2, AlertCircle, CheckCircle2,
  ArrowLeft, Save, Cloud, Shield, Gauge, Crown
} from "lucide-react";

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
  "Other",
];

const AdminAddBook = () => {
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const MAX_IMAGES = 3;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.author.trim()) newErrors.author = "Author name is required";
    if (!formData.price || formData.price <= 0) newErrors.price = "Valid price is required";
    if (!formData.desc.trim()) newErrors.desc = "Description is required";
    if (formData.desc.length < 20) newErrors.desc = "Description should be at least 20 characters";
    if (!formData.language.trim()) newErrors.language = "Language is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.stock || formData.stock < 0) newErrors.stock = "Valid stock quantity is required";
    if (images.length === 0) newErrors.images = "At least one product image is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (files) => {
    if (images.length >= MAX_IMAGES) {
      alert(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    const validFiles = [];
    const fileArray = Array.from(files);
    
    for (let i = 0; i < fileArray.length && images.length + validFiles.length < MAX_IMAGES; i++) {
      const file = fileArray[i];
      
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name} exceeds 5MB limit. Please choose a smaller file.`);
        continue;
      }
      
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file. Please upload PNG, JPG, or WEBP.`);
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
        alert(`Failed to read ${file.name}. Please try again.`);
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
      alert("Please fix all errors before submitting");
      setPreviewMode(false);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formDataToSend = new FormData();
      
      // Append fields individually with proper serialization
      formDataToSend.append('title', formData.title || '');
      formDataToSend.append('author', formData.author || '');
      formDataToSend.append('price', formData.price || '');
      formDataToSend.append('desc', formData.desc || '');
      formDataToSend.append('language', formData.language || '');
      formDataToSend.append('category', formData.category || '');
      formDataToSend.append('editionOrPublishYear', formData.editionOrPublishYear || '');
      formDataToSend.append('stock', formData.stock || '1');
      
      // Append images
      images.forEach((img) => {
        formDataToSend.append('images', img.file);
      });

      console.log('Sending form data:', {
        title: formData.title,
        author: formData.author,
        price: formData.price,
        category: formData.category,
        language: formData.language,
        stock: formData.stock,
        imageCount: images.length
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
        "http://localhost:3000/api/v1/add-book",
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
      
      console.log('✅ Book added successfully:', res.data);
      setShowSuccessModal(true);
      
      setTimeout(() => {
        navigate("/admin/books");
      }, 2000);
      
    } catch (err) {
      console.error("❌ Add book error:", err);
      
      let errorMsg = "Failed to add product. Please try again.";
      
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.response?.data?.errors) {
        const errors = err.response.data.errors
          .map(e => `${e.field}: ${e.message}`)
          .join('\n');
        errorMsg = `Validation failed:\n${errors}`;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      alert(errorMsg);
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
      return;
    }
    setPreviewMode(true);
  };

  const placeholders = {
    title: "e.g., The Complete Guide to Engineering Mathematics",
    author: "e.g., Dr. Rajesh Kumar",
    price: "e.g., 499",
    desc: "Provide a detailed description including condition, key features, and what makes this product valuable...",
    language: "e.g., English, Hindi, or Bilingual",
    category: "Select the most appropriate category",
    editionOrPublishYear: "e.g., 5th Edition (2023) or 2023",
    stock: "e.g., 10",
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const DetailRow = ({ label, value, icon }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-700/30 last:border-0">
      <span className="text-sm text-gray-400 flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        {label}
      </span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border-2 border-green-500/50 shadow-2xl max-w-md mx-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full mb-6 border-4 border-green-500/50">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">Success!</h3>
              <p className="text-gray-300 mb-6">Book has been added to catalog successfully</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Redirecting to books page...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress Overlay */}
      {isUploading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-amber-500/50 shadow-2xl max-w-md w-full mx-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-full mb-6 border-4 border-amber-500/50">
                <Cloud className="w-10 h-10 text-amber-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Adding Book</h3>
              <p className="text-gray-400 mb-6">Please wait while we process the listing...</p>
              
              <div className="relative w-full h-3 bg-slate-700 rounded-full overflow-hidden mb-4">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              
              <p className="text-amber-400 font-bold text-lg">{uploadProgress}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative px-4 sm:px-8 py-12 max-w-7xl mx-auto">
        {/* Premium Header Section */}
        <div className="text-center mb-16">
          {/* <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-amber-700/50 to-yellow-700/50 rounded-full border border-amber-600/50 backdrop-blur-sm">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Admin Control Panel</span>
          </div> */}
          
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-amber-700/40 to-yellow-700/40 rounded-2xl border border-amber-600/50 shadow-lg">
              <PackagePlus className="w-8 h-8 text-amber-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent drop-shadow-2xl">
              Add Book to Catalog
            </h1>
            <div className="p-3 bg-gradient-to-br from-yellow-700/40 to-amber-700/40 rounded-2xl border border-amber-600/50 shadow-lg">
              <BookOpen className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
          
          <p className="text-gray-400 text-xl font-light mb-6 max-w-2xl mx-auto">
            Curate BookBalcony's premium collection with carefully selected titles
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-full border border-amber-700/50">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-gray-300">Admin Access</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-full border border-gray-700/50">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-300">Instant Publishing</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-full border border-gray-700/50">
              <ImageIcon className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Cloud Storage</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-full border border-gray-700/50">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">Secure & Reliable</span>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-slate-800/40 backdrop-blur-2xl rounded-3xl border border-amber-700/30 shadow-2xl overflow-hidden">
          {!previewMode ? (
            <div className="p-8 md:p-12">
              {/* Image Upload Section */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <label className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gradient-to-br from-amber-700/40 to-yellow-700/40 rounded-xl border border-amber-600/50">
                        <ImageIcon className="w-6 h-6 text-amber-400" />
                      </div>
                      Book Cover Gallery
                      <span className="text-red-400 text-lg">*</span>
                    </label>
                    <p className="text-sm text-gray-400 ml-12">Upload high-quality images to showcase the book</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-700/30 to-yellow-700/30 rounded-full border border-amber-600/50">
                    <div className={`w-2 h-2 rounded-full ${images.length > 0 ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                    <span className="text-sm font-semibold text-gray-300">
                      {images.length}/{MAX_IMAGES}
                    </span>
                  </div>
                </div>
                
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 ${
                    dragActive 
                      ? 'border-amber-400 bg-amber-400/5 scale-[1.01] shadow-lg shadow-amber-500/20' 
                      : errors.images 
                        ? 'border-red-500/50 bg-red-500/5'
                        : 'border-gray-700/50 bg-slate-900/30'
                  } ${images.length >= MAX_IMAGES ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-amber-600/70 hover:bg-slate-800/20'}`}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                    disabled={images.length >= MAX_IMAGES}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  
                  <div className="p-16 text-center">
                    <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br rounded-3xl mb-6 border ${
                      errors.images 
                        ? 'from-red-500/10 to-red-500/10 border-red-500/20' 
                        : 'from-amber-700/20 to-yellow-700/20 border-amber-600/30'
                    }`}>
                      {errors.images ? (
                        <AlertCircle className="w-12 h-12 text-red-400" />
                      ) : (
                        <Upload className="w-12 h-12 text-amber-400" />
                      )}
                    </div>
                    <p className="text-xl font-bold text-white mb-3">
                      {images.length >= MAX_IMAGES ? 'Gallery Complete' : 'Upload Book Cover Images'}
                    </p>
                    <p className={`mb-6 ${errors.images ? 'text-red-400 font-semibold' : 'text-gray-400'}`}>
                      {errors.images || 'Drag and drop your images here, or click to browse'}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-gray-700/30">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        <span className="text-gray-300">PNG, JPG, WEBP</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-gray-700/30">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span className="text-gray-300">Max 5MB each</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-gray-700/30">
                        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                        <span className="text-gray-300">Up to {MAX_IMAGES} images</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Preview Grid */}
                {images.length > 0 && (
                  <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-6">
                    {images.map((img, index) => (
                      <div key={index} className="relative group">
                        <div className="relative overflow-hidden rounded-2xl bg-slate-900/50 border-2 border-gray-700/50 group-hover:border-amber-600/70 transition-all duration-300">
                          <img
                            src={img.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-56 object-cover transition-all duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          <div className="absolute top-3 left-3 px-3 py-1.5 bg-slate-900/90 backdrop-blur-sm rounded-lg border border-amber-600/50">
                            <span className="text-xs font-bold text-amber-400">Image {index + 1}</span>
                          </div>
                          
                          {index === 0 && (
                            <div className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg shadow-lg">
                              <span className="text-xs font-bold text-white">Primary</span>
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 p-2.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 hover:scale-110 shadow-lg border-2 border-slate-900"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="relative my-12">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-amber-700/30"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-slate-800/40 text-sm text-amber-400 uppercase tracking-wider font-semibold">Book Information</span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key} className={key === "desc" ? "md:col-span-2" : ""}>
                    <label className="block mb-3 text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
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
                          className={`w-full px-4 py-4 rounded-xl bg-slate-900/50 border text-white focus:outline-none focus:ring-2 transition-all duration-300 hover:border-amber-600/70 ${
                            errors[key] 
                              ? 'border-red-500/50 focus:ring-red-400' 
                              : 'border-gray-700/50 focus:ring-amber-400 focus:border-transparent'
                          }`}
                        >
                          <option value="" disabled>
                            Select a category
                          </option>
                          {categoriesList.map((cat, idx) => (
                            <option key={idx} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                        {errors[key] && (
                          <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
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
                          rows={5}
                          className={`w-full px-4 py-4 rounded-xl bg-slate-900/50 border placeholder:text-gray-500 text-white focus:outline-none focus:ring-2 transition-all duration-300 resize-none hover:border-amber-600/70 ${
                            errors[key] 
                              ? 'border-red-500/50 focus:ring-red-400' 
                              : 'border-gray-700/50 focus:ring-amber-400 focus:border-transparent'
                          }`}
                        />
                        <div className="flex items-center justify-between mt-2">
                          {errors[key] && (
                            <p className="text-sm text-red-400 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              {errors[key]}
                            </p>
                          )}
                          <p className={`text-sm ml-auto ${value.length < 20 ? 'text-yellow-400' : 'text-gray-400'}`}>
                            {value.length} characters {value.length < 20 && '(minimum 20)'}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <input
                          type={key === "price" || key === "stock" ? "number" : "text"}
                          name={key}
                          value={value}
                          onChange={handleChange}
                          placeholder={placeholders[key]}
                          min={key === "price" || key === "stock" ? "0" : undefined}
                          step={key === "price" ? "0.01" : "1"}
                          className={`w-full px-4 py-4 rounded-xl bg-slate-900/50 border placeholder:text-gray-500 text-white focus:outline-none focus:ring-2 transition-all duration-300 hover:border-amber-600/70 ${
                            errors[key] 
                              ? 'border-red-500/50 focus:ring-red-400' 
                              : 'border-gray-700/50 focus:ring-amber-400 focus:border-transparent'
                          }`}
                        />
                        {errors[key] && (
                          <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {errors[key]}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-amber-700/30">
                <button
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-700/50 text-white font-bold hover:bg-slate-600/50 transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105 border border-gray-600/50"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Dashboard
                </button>
                
                <button
                  onClick={handlePreview}
                  disabled={!isFormValid()}
                  className="w-full sm:w-auto group relative px-10 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none hover:scale-105"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                    <Eye className="w-6 h-6" />
                    Preview Listing
                    <Sparkles className="w-5 h-5" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 md:p-12">
              {/* Preview Header */}
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-amber-700/40 to-yellow-700/40 rounded-2xl border border-amber-600/50">
                    <ShoppingBag className="w-7 h-7 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Book Preview</h2>
                    <p className="text-gray-400 text-sm">Review before adding to catalog</p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30">
                  <span className="text-sm font-semibold text-green-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Ready to Publish
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/40 p-8 rounded-2xl border border-amber-700/30">
                <div className="flex flex-col lg:flex-row gap-10">
                  {/* Image Slider */}
                  <div className="lg:w-1/2">
                    <div className="relative group">
                      <div className="relative overflow-hidden rounded-2xl border-4 border-amber-700/50 shadow-2xl">
                        <img
                          src={images[currentImageIndex]?.preview || "https://via.placeholder.com/400x600"}
                          alt="Book Cover"
                          className="w-full h-[550px] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        
                        <div className="absolute top-4 right-4 px-4 py-2 bg-slate-900/90 backdrop-blur-sm rounded-xl border border-amber-600/50">
                          <span className="text-sm font-bold text-amber-400">{currentImageIndex + 1} / {images.length}</span>
                        </div>
                      </div>
                      
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-slate-900/90 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-slate-800 hover:scale-110 border border-amber-600/50 shadow-xl"
                          >
                            <ChevronLeft className="w-6 h-6 text-amber-400" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-slate-900/90 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-slate-800 hover:scale-110 border border-amber-600/50 shadow-xl"
                          >
                            <ChevronRight className="w-6 h-6 text-amber-400" />
                          </button>
                          
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-slate-900/90 backdrop-blur-sm px-4 py-3 rounded-full border border-amber-600/50">
                            {images.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`transition-all duration-300 rounded-full ${
                                  idx === currentImageIndex 
                                    ? 'w-10 h-3 bg-gradient-to-r from-amber-400 to-yellow-400' 
                                    : 'w-3 h-3 bg-gray-600 hover:bg-gray-500'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Gallery */}
                    {images.length > 1 && (
                      <div className="flex gap-4 mt-6">
                        {images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`relative flex-1 rounded-xl overflow-hidden transition-all duration-300 ${
                              idx === currentImageIndex 
                                ? 'ring-4 ring-amber-400 scale-105 shadow-lg shadow-amber-500/30' 
                                : 'ring-2 ring-gray-700/50 opacity-60 hover:opacity-100 hover:ring-amber-600/70'
                            }`}
                          >
                            <img src={img.preview} alt={`Thumb ${idx + 1}`} className="w-full h-24 object-cover" />
                            {idx === currentImageIndex && (
                              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent"></div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Book Details */}
                  <div className="lg:w-1/2 space-y-6">
                    <div>
                      <h3 className="text-4xl font-bold text-white mb-3 leading-tight">{formData.title}</h3>
                      <p className="text-xl text-amber-400 flex items-center gap-2">
                        <span className="text-gray-500">by</span> {formData.author}
                      </p>
                    </div>

                    <div className="h-px bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700"></div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-amber-900/30 to-yellow-900/30 p-5 rounded-2xl border border-amber-500/30 backdrop-blur-sm">
                        <p className="text-xs text-amber-300 uppercase tracking-widest mb-2 font-bold flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                          Price
                        </p>
                        <p className="text-3xl font-black bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">₹{formData.price}</p>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 p-5 rounded-2xl border border-emerald-500/30 backdrop-blur-sm">
                        <p className="text-xs text-emerald-300 uppercase tracking-widest mb-2 font-bold flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                          Stock
                        </p>
                        <p className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">{formData.stock} units</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-slate-900/50 p-5 rounded-2xl border border-gray-700/50">
                      <DetailRow label="Category" value={formData.category} icon="📚" />
                      <DetailRow label="Language" value={formData.language} icon="🌐" />
                      <DetailRow label="Edition/Year" value={formData.editionOrPublishYear || "Not specified"} icon="📅" />
                    </div>

                    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 p-6 rounded-2xl border border-amber-700/30">
                      <p className="text-sm font-bold text-amber-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Book Description
                      </p>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{formData.desc}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-amber-700/30">
                  <button
                    onClick={() => setPreviewMode(false)}
                    disabled={isUploading}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-700/50 text-white font-bold hover:bg-slate-600/50 transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105 border border-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Edit3 className="w-5 h-5" />
                    Edit Details
                  </button>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={isUploading}
                    className="w-full sm:w-auto group relative px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none hover:scale-105"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                      {isUploading ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Check className="w-6 h-6" />
                          Add to Catalog
                          <Save className="w-5 h-5" />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Feature Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl p-6 rounded-2xl border border-amber-700/30 hover:border-amber-600/50 transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-700/40 to-yellow-700/40 rounded-xl border border-amber-600/50">
                <Cloud className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Cloud Storage</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Book images are securely stored on Cloudinary's global CDN for lightning-fast delivery worldwide.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400 font-semibold uppercase">Active</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl p-6 rounded-2xl border border-amber-700/30 hover:border-amber-600/50 transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-700/40 to-yellow-700/40 rounded-xl border border-amber-600/50">
                <Gauge className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Instant Publishing</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Add books in seconds. Our optimized system ensures listings go live immediately after submission.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-yellow-400 font-semibold uppercase">Fast</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl p-6 rounded-2xl border border-amber-700/30 hover:border-amber-600/50 transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-700/40 to-yellow-700/40 rounded-xl border border-amber-600/50">
                <Crown className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Admin Control</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Full administrative access with ability to manage entire catalog and curate BookBalcony's collection.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-amber-400 font-semibold uppercase">Privileged</span>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-gradient-to-r from-amber-800/30 to-yellow-800/30 backdrop-blur-xl p-8 rounded-2xl border border-amber-700/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-amber-700/40 to-yellow-700/40 rounded-xl border border-amber-600/50">
                <BookOpen className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Need Help?</h3>
                <p className="text-gray-400">Check out admin guidelines and catalog management best practices</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300 hover:scale-105 border border-amber-500/30">
              View Guidelines
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddBook;