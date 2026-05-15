

import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { useParams, Link } from 'react-router-dom';
import { extractIdFromSlug } from '../../utils/bookSlug';
import { GrLanguage } from "react-icons/gr";
import { motion, AnimatePresence } from 'framer-motion';
import BookCard from '../BookCard/BookCard';
import { FaRegHeart, FaHeart, FaCartPlus, FaShoppingBag, FaCrown, FaEye, FaFireAlt, FaCheckCircle, FaBox, FaClock, FaShieldAlt, FaTruck, FaUndo, FaStar, FaBookOpen, FaCalendar, FaExclamationTriangle, FaChevronLeft, FaChevronRight, FaTrashAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { FiEdit, FiShare2 } from "react-icons/fi";
import { MdDeleteOutline, MdOutlineInventory2 } from "react-icons/md";
import { useFavourites } from '../../context/FavouriteContext';
import { useNavigate } from "react-router-dom";
import { HiSparkles } from "react-icons/hi";
import Alert from "../Alert/Alert";
import { useAlert } from "../Alert/useAlert";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

const ViewBookDetails = () => {
  const { id: rawParam } = useParams();
  const id = extractIdFromSlug(rawParam);
  const [Data, setData] = useState();
  const [SimilarBooks, setSimilarBooks] = useState([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [sellerName, setSellerName] = useState("");
  const [isViewTracked, setIsViewTracked] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isInCart, setIsInCart] = useState(false);
  const [checkingCart, setCheckingCart] = useState(true);
  const [removingFromCart, setRemovingFromCart] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [isDescClamped, setIsDescClamped] = useState(false);
  const descRef = useRef(null);

  const { alert, showAlert, hideAlert, success, error, warning, info } = useAlert();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const isPremium = useSelector((state) => state.auth.isPremium);

  const { favouriteIds, addToFavourites, removeFromFavourites } = useFavourites();
  const isFavourite = favouriteIds.includes(id);
  const navigate = useNavigate();

  const canViewSeller = role === "admin" || isPremium === true;

  // Get book images array (support both single url and multiple images)
  const getBookImages = () => {
    if (!Data) return [];
    
    // Check if Data.images exists and is an array with items
    if (Data.images && Array.isArray(Data.images) && Data.images.length > 0) {
      // Extract URLs from the images array (backend structure: [{url, publicId}])
      return Data.images.map(img => img.url || img);
    }
    
    // Fallback to Data.url if images array doesn't exist
    if (Data.url) {
      return [Data.url];
    }
    
    return [];
  };

  const bookImages = getBookImages();
  const hasMultipleImages = bookImages.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % bookImages.length);
    setImageLoaded(false);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + bookImages.length) % bookImages.length);
    setImageLoaded(false);
  };

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: id,
  };

  // Check if book is in cart
  const checkIfInCart = async () => {
    if (!isLoggedIn) {
      setCheckingCart(false);
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/get-user-cart`, { 
        headers: {
          id: localStorage.getItem("id"),
          authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      const cartItems = res.data.data || [];
      const bookInCart = cartItems.some(item => item._id === id);
      setIsInCart(bookInCart);
    } catch (error) {
      console.error("Error checking cart:", error);
    } finally {
      setCheckingCart(false);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API_URL}/get-book-by-id/${id}`);
        setData(res.data.data);
        setViewCount(res.data.data.views || 0);

        console.log("📚 Book data fetched:", {
          title: res.data.data.title,
          hasImages: !!res.data.data.images,
          imagesCount: res.data.data.images?.length || 0,
          images: res.data.data.images,
          url: res.data.data.url
        });

        if (res.data.data.seller) {
          try {
            const sellerRes = await axios.get(`${API_URL}/get-user-info/${res.data.data.seller}`);
            setSellerName(sellerRes.data.username || sellerRes.data.email);
          } catch (err) {
            console.error("Error fetching seller info:", err);
            setSellerName("Unknown Seller");
          }
        }

        const simRes = await axios.get(`${API_URL}/get-similar-books/${res.data.data.category}`);
        setSimilarBooks(simRes.data.data.filter(book => book._id !== id));
      } catch (err) {
        console.error("Error fetching book:", err);
      }
    };
    fetch();
    checkIfInCart();
  }, [id]);

  useEffect(() => {
    const trackView = async () => {
      if (!isViewTracked && Data) {
        try {
          await axios.post(`${API_URL}/track-view/${id}`);
          setIsViewTracked(true);
          setViewCount(prev => prev + 1);
        } catch (err) {
          console.error("Error tracking view:", err);
        }
      }
    };
    trackView();
  }, [id, Data, isViewTracked]);

  // Reset image index and loading state when Data changes
  useEffect(() => {
    if (Data) {
      setCurrentImageIndex(0);
      setImageLoaded(false);
    }
  }, [Data]);

  const handleFavourite = async () => {
    if (isFavourite) {
      await removeFromFavourites(id);
    } else {
      await addToFavourites(id);
    }
  };

  const isAvailableForPurchase = () => {
    const stock = Data?.stock < 0 ? 0 : Data?.stock;
    const status = Data?.productStatus?.toLowerCase();
    
    return stock > 0 && 
           status !== "not available" && 
           status !== "sold out" &&
           status !== "arriving soon";
  };

  const getButtonText = () => {
    const stock = Data?.stock < 0 ? 0 : Data?.stock;
    const status = Data?.productStatus?.toLowerCase();
    
    if (status === "not available") {
      return "Not Available";
    } else if (stock === 0 || status === "sold out") {
      return "Out of Stock";
    } else if (status === "arriving soon") {
      return "Arriving Soon";
    }
    return "Buy Now";
  };

  const handleBuyNow = () => {
    if (!isAvailableForPurchase()) {
      const stock = Data?.stock < 0 ? 0 : Data?.stock;
      const status = Data?.productStatus?.toLowerCase();
      
      if (status === "not available") {
        alert("⚠️ This book is not available for purchase!");
      } else if (stock === 0 || status === "sold out") {
        alert("⚠️ This book is currently out of stock!");
      } else if (status === "arriving soon") {
        alert("⏰ This book is arriving soon. Please check back later!");
      }
      return;
    }

    navigate(`/checkout/${id}`, {
      state: {
        book: {
          id: Data._id,
          title: Data.title,
          price: Data.price,
          discount: Data.discount,
          image: Data.image,
        },
      },
    });
  };

  const handleCart = async () => {
    if (!isAvailableForPurchase()) {
      const stock = Data?.stock < 0 ? 0 : Data?.stock;
      const status = Data?.productStatus?.toLowerCase();
      
      if (status === "not available") {
        alert("⚠️ This book is not available for purchase!");
      } else if (stock === 0 || status === "sold out") {
        alert("⚠️ This book is currently out of stock!");
      } else if (status === "arriving soon") {
        alert("⏰ This book is arriving soon. Please check back later!");
      }
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/add-to-cart`,
        {},
        { headers }
      );
      success("🎉 Book added to your cart!");
      setIsInCart(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(error.response?.data?.message || "Failed to add to cart!");
    }
  };

  const handleRemoveFromCart = async () => {
    setRemovingFromCart(true);
    try {
      await axios.put(
        `${API_URL}/remove-from-cart/${id}`,
        {},
        { headers }
      );
      success("🗑️ Book removed from your cart!");
      setIsInCart(false);
    } catch (error) {
      console.error("Error removing from cart:", error);
      alert(error.response?.data?.message || "Failed to remove from cart!");
    } finally {
      setRemovingFromCart(false);
    }
  };

  const handleShare = () => {
    setShowSharePopup(true);
    if (navigator.share) {
      navigator.share({
        title: Data?.title,
        text: `Check out this book: ${Data?.title} by ${Data?.author}`,
        url: window.location.href,
      });
    }
  };

  const getStatusBadge = () => {
    const stock = Data?.stock < 0 ? 0 : Data?.stock;
    const isOutOfStock = stock === 0;
    const status = Data?.productStatus?.toLowerCase();

    if (status === "not available") {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-500/20 border border-gray-500/50 rounded-full backdrop-blur-sm">
          <FaExclamationTriangle className="text-gray-400 text-xs" />
          <span className="text-gray-300 font-semibold text-xs">Not Available</span>
        </div>
      );
    }

    if (isOutOfStock || status === "sold out") {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 border border-red-500/50 rounded-full backdrop-blur-sm">
          <FaBox className="text-red-400 text-xs" />
          <span className="text-red-300 font-semibold text-xs">Out of Stock</span>
        </div>
      );
    }

    if (status === "arriving soon") {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 border border-blue-500/50 rounded-full backdrop-blur-sm">
          <FaClock className="text-blue-400 text-xs" />
          <span className="text-blue-300 font-semibold text-xs">Arriving Soon</span>
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 border border-green-500/50 rounded-full backdrop-blur-sm">
        <FaCheckCircle className="text-green-400 text-xs" />
        <span className="text-green-300 font-semibold text-xs">In Stock ({stock})</span>
      </div>
    );
  };

  const canPurchase = isAvailableForPurchase();

  if (!Data) {
    return (
      <div className="h-screen bg-zinc-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {/* Alert Component */}
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          duration={alert.duration}
          position={alert.position}
          autoClose={alert.autoClose}
          onClose={hideAlert}
        />
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-gray-900 via-zinc-900 to-black min-h-screen relative overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.03, 0.06, 0.03],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.03, 0.06, 0.03],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 py-6 px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-4 flex items-center gap-2 text-xs"
          >
            <Link to="/" className="text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-1">
              <HiSparkles className="text-sm" />
              Home
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-400">{Data?.category}</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-200 font-medium truncate max-w-[200px]">{Data?.title}</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl shadow-2xl p-4 border border-zinc-700/50">
                <div className="relative aspect-[5/4] flex items-center justify-center overflow-hidden rounded-xl bg-zinc-900/50">
                  {bookImages.length > 0 ? (
                    <motion.img
                      key={currentImageIndex}
                      src={bookImages[currentImageIndex]}
                      alt={`${Data?.title} - Image ${currentImageIndex + 1}`}
                      className="max-h-full w-auto object-contain"
                      onLoad={() => setImageLoaded(true)}
                      onError={(e) => {
                        console.error("Image failed to load:", bookImages[currentImageIndex]);
                        setImageLoaded(true);
                        e.target.src = 'https://via.placeholder.com/400x500/1f2937/facc15?text=No+Image';
                      }}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 text-zinc-500">
                      <FaBox className="text-5xl" />
                      <p className="text-sm">No image available</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                  {/* Image Navigation Arrows */}
                  {hasMultipleImages && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 border border-white/10"
                      >
                        <FaChevronLeft className="text-lg" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-300 border border-white/10"
                      >
                        <FaChevronRight className="text-lg" />
                      </motion.button>
                    </>
                  )}
                </div>

                {/* Image Indicator Dots */}
                {hasMultipleImages && (
                  <div className="flex justify-center gap-1.5 mt-3">
                    {bookImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentImageIndex(index);
                          setImageLoaded(false);
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex
                            ? 'bg-yellow-400 w-6'
                            : 'bg-zinc-600 hover:bg-zinc-500'
                        }`}
                      />
                    ))}
                  </div>
                )}

                <div className="absolute top-6 right-6 flex flex-col gap-2">
                  {isLoggedIn && role === "user" && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-zinc-900/80 backdrop-blur-sm text-yellow-400 hover:bg-yellow-400 hover:text-black shadow-lg border border-yellow-400/20 transition-all duration-300 rounded-full text-lg p-2.5"
                      onClick={handleFavourite}
                    >
                      {isFavourite ? <FaHeart /> : <FaRegHeart />}
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-zinc-900/80 backdrop-blur-sm text-yellow-400 hover:bg-yellow-400 hover:text-black shadow-lg border border-yellow-400/20 transition-all duration-300 rounded-full text-lg p-2.5"
                    onClick={handleShare}
                  >
                    <FiShare2 />
                  </motion.button>
                </div>

                {Data?.sold > 0 && (
                  <div className="absolute bottom-6 right-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-500/50"
                    >
                      <FaFireAlt className="text-green-400 text-xs" />
                      <span className="text-green-300 font-semibold text-xs">
                        {Data?.sold} sold
                      </span>
                    </motion.div>
                  </div>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 grid grid-cols-3 gap-3"
              >
                <div className="bg-zinc-800/50 backdrop-blur-sm rounded-lg p-2.5 border border-zinc-700/50 text-center">
                  <FaShieldAlt className="text-yellow-400 text-xl mx-auto mb-1" />
                  <p className="text-zinc-400 text-[10px] font-medium">Secure</p>
                </div>
                <div className="bg-zinc-800/50 backdrop-blur-sm rounded-lg p-2.5 border border-zinc-700/50 text-center">
                  <FaTruck className="text-yellow-400 text-xl mx-auto mb-1" />
                  <p className="text-zinc-400 text-[10px] font-medium">Fast Ship</p>
                </div>
                <div className="bg-zinc-800/50 backdrop-blur-sm rounded-lg p-2.5 border border-zinc-700/50 text-center">
                  <FaUndo className="text-yellow-400 text-xl mx-auto mb-1" />
                  <p className="text-zinc-400 text-[10px] font-medium">Returns</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-3">
                {getStatusBadge()}
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent leading-tight"
              >
                {Data?.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-zinc-400 text-sm mb-3 flex items-center gap-1.5"
              >
                <FaBookOpen className="text-purple-400 text-xs" />
                by <span className="text-purple-300 font-semibold">{Data?.author}</span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2 mb-4"
              >
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} className="text-yellow-400 text-sm" />
                  ))}
                </div>
                <span className="text-zinc-400 text-xs">(4.8)</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400 text-xs">{viewCount} reviews</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-4"
              >
                <div className="inline-flex items-baseline gap-2 bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 border border-yellow-400/30 rounded-xl px-4 py-2">
                  <span className="text-3xl font-bold text-yellow-400">₹{Data?.price}</span>
                  <span className="text-zinc-400 text-sm">+ tax</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-4"
              >
                <h3 className="text-sm font-semibold text-purple-200 mb-2 flex items-center gap-1.5">
                  <HiSparkles className="text-yellow-400 text-sm" />
                  About This Book
                </h3>
                <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-3 border border-zinc-700/50">
                  <p
                    ref={(el) => {
                      descRef.current = el;
                      if (el && !descExpanded) {
                        // Check if the text is actually overflowing
                        requestAnimationFrame(() => {
                          setIsDescClamped(el.scrollHeight > el.clientHeight);
                        });
                      }
                    }}
                    className={`text-zinc-300 leading-relaxed text-sm ${descExpanded ? '' : 'line-clamp-4'}`}
                  >
                    {Data?.desc}
                  </p>
                  {(isDescClamped || descExpanded) && (
                    <button
                      onClick={() => setDescExpanded(!descExpanded)}
                      className="mt-2 text-yellow-400 hover:text-yellow-300 text-xs font-semibold tracking-wide transition-colors duration-200"
                    >
                      {descExpanded ? '▲ Read Less' : '▼ Read More'}
                    </button>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="grid grid-cols-3 gap-2 mb-4"
              >
                <div className="bg-zinc-800/50 backdrop-blur-sm rounded-lg p-2.5 border border-zinc-700/50">
                  <GrLanguage className="text-yellow-400 text-lg mb-1" />
                  <p className="text-zinc-500 text-[10px] mb-0.5">Language</p>
                  <p className="text-zinc-200 font-semibold text-xs truncate">{Data?.language}</p>
                </div>
                <div className="bg-zinc-800/50 backdrop-blur-sm rounded-lg p-2.5 border border-zinc-700/50">
                  <FaCalendar className="text-yellow-400 text-lg mb-1" />
                  <p className="text-zinc-500 text-[10px] mb-0.5">Year</p>
                  <p className="text-zinc-200 font-semibold text-xs truncate">{Data?.editionOrPublishYear}</p>
                </div>
                <div className="bg-zinc-800/50 backdrop-blur-sm rounded-lg p-2.5 border border-zinc-700/50">
                  <MdOutlineInventory2 className="text-yellow-400 text-lg mb-1" />
                  <p className="text-zinc-500 text-[10px] mb-0.5">Category</p>
                  <p className="text-zinc-200 font-semibold text-xs truncate">{Data?.category}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-3 mb-4"
              >
                <motion.button
                  whileHover={{ scale: canPurchase ? 1.02 : 1 }}
                  whileTap={{ scale: canPurchase ? 0.98 : 1 }}
                  onClick={handleBuyNow}
                  disabled={!canPurchase}
                  className={`flex-1 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                    canPurchase
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 shadow-yellow-500/30"
                      : Data?.productStatus?.toLowerCase() === "arriving soon"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-not-allowed"
                      : Data?.productStatus?.toLowerCase() === "not available"
                      ? "bg-gradient-to-r from-gray-500 to-gray-600 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-red-600 text-white cursor-not-allowed"
                  }`}
                >
                  {Data?.productStatus?.toLowerCase() === "arriving soon" ? (
                    <>
                      <FaClock className="text-base" />
                      Arriving Soon
                    </>
                  ) : Data?.productStatus?.toLowerCase() === "not available" ? (
                    <>
                      <FaExclamationTriangle className="text-base" />
                      Not Available
                    </>
                  ) : !canPurchase ? (
                    <>
                      <FaBox className="text-base" />
                      Out of Stock
                    </>
                  ) : (
                    <>
                      <FaShoppingBag className="text-base" />
                      Buy Now
                    </>
                  )}
                </motion.button>
                
                {/* Cart Button - Shows Add or Remove based on cart status */}
                {checkingCart ? (
                  <motion.button
                    className="flex-1 px-6 py-3 bg-zinc-800 text-zinc-600 border-2 border-zinc-700 rounded-xl font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2"
                    disabled
                  >
                    <div className="w-4 h-4 border-2 border-zinc-600 border-t-transparent rounded-full animate-spin" />
                    Loading...
                  </motion.button>
                ) : isInCart ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRemoveFromCart}
                    disabled={removingFromCart}
                    className={`flex-1 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                      removingFromCart
                        ? "bg-red-400/50 text-white cursor-not-allowed border-2 border-red-400/50"
                        : "bg-red-500/20 text-red-400 border-2 border-red-400 hover:bg-red-500 hover:text-white"
                    }`}
                  >
                    {removingFromCart ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Removing...
                      </>
                    ) : (
                      <>
                        <FaTrashAlt className="text-base" />
                        Remove from Cart
                      </>
                    )}
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: canPurchase ? 1.02 : 1 }}
                    whileTap={{ scale: canPurchase ? 0.98 : 1 }}
                    onClick={handleCart}
                    disabled={!canPurchase}
                    className={`flex-1 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                      canPurchase
                        ? "bg-zinc-800 text-yellow-400 border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black"
                        : "bg-zinc-800 text-zinc-600 border-2 border-zinc-700 cursor-not-allowed"
                    }`}
                  >
                    <FaCartPlus className="text-base" />
                    Add to Cart
                  </motion.button>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 backdrop-blur-sm rounded-xl p-4 border border-zinc-700/50"
              >
                <h3 className="text-sm font-semibold text-purple-200 mb-3 flex items-center gap-1.5">
                  <FaBox className="text-yellow-400 text-sm" />
                  Seller Information
                </h3>

                {canViewSeller ? (
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-black rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg">
                      {sellerName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-zinc-100 font-bold text-sm">{sellerName}</p>
                      <p className="text-zinc-400 text-xs flex items-center gap-1">
                        <FaCheckCircle className="text-green-400 text-[10px]" />
                        Verified Seller
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="filter blur-md pointer-events-none select-none">
                      <div className="flex items-center gap-3">
                        <div className="bg-yellow-400 text-black rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                          S
                        </div>
                        <div>
                          <p className="text-zinc-100 font-bold text-sm">Seller Name</p>
                          <p className="text-zinc-400 text-xs">Verified Seller</p>
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/90 rounded-lg">
                      <FaCrown className="text-yellow-400 text-3xl mb-2" />
                      <p className="text-yellow-400 font-bold text-sm mb-1">Premium Feature</p>
                      <p className="text-zinc-300 text-xs mb-3 text-center px-2">
                        Unlock seller details
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/premium')}
                        className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-full font-bold text-xs hover:from-yellow-500 hover:to-yellow-600 transition duration-300 flex items-center gap-1.5 shadow-lg shadow-yellow-500/30"
                      >
                        <FaCrown className="text-xs" />
                        Join Premium
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>

          {SimilarBooks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-12"
            >
              <h3 className="text-xl font-bold text-purple-100 mb-4 flex items-center gap-2">
                <HiSparkles className="text-yellow-400 text-lg" />
                Similar Books
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-zinc-800">
                {SimilarBooks.map((book, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + i * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="min-w-[220px] sm:min-w-[240px]"
                  >
                    <BookCard data={book} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl border border-zinc-700"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <FaCheckCircle className="text-white text-3xl" />
              </motion.div>
              <h2 className="text-2xl font-bold text-green-400 mb-3">Payment Successful!</h2>
              <p className="text-zinc-300 text-sm mb-2">
                You've purchased <span className="font-bold text-yellow-400">{paymentDetails?.title}</span>
              </p>
              <p className="text-xl text-yellow-400 font-bold mb-4">₹{paymentDetails?.price} paid</p>
              <button
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold px-6 py-2.5 rounded-full hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg text-sm"
                onClick={() => (window.location.href = "/order-history")}
              >
                Go to Order History
              </button>
              <p className="text-xs text-zinc-500 mt-3">Redirecting in 5 seconds...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSharePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4"
            onClick={() => setShowSharePopup(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-zinc-700"
            >
              <h3 className="text-xl font-bold text-yellow-400 mb-3 flex items-center gap-2">
                <FiShare2 />
                Share This Book
              </h3>
              <p className="text-zinc-300 text-sm mb-4">Link copied to clipboard!</p>
              <button
                onClick={() => setShowSharePopup(false)}
                className="w-full px-6 py-2.5 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-500 transition-colors text-sm"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ViewBookDetails;