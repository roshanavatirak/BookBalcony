
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaEye, FaFireAlt, FaStar, FaShoppingCart, FaClock, FaCheckCircle, FaExclamationTriangle, FaBan } from 'react-icons/fa';
import { useFavourites } from '../../context/FavouriteContext';
import { motion } from 'framer-motion';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

function BookCard({ data, onRemove }) {
  const location = useLocation();
  const { favouriteIds, addToFavourites, removeFromFavourites } = useFavourites();

  const isFavouriteBook = favouriteIds.includes(data._id);

  const handleAddToFavourites = async (e) => {
    e.preventDefault();
    await addToFavourites(data._id);
  };

  const handleRemoveFromFavourites = async (e) => {
    e.preventDefault();
    await removeFromFavourites(data._id);
    if (onRemove) onRemove();
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const stock = data?.stock < 0 ? 0 : data?.stock;
    const status = data?.productStatus?.toLowerCase();
    
    // Check if available for purchase
    if (status === "not available") {
      alert("⚠️ This book is not available for purchase!");
      return;
    }
    if (stock === 0 || status === "sold out") {
      alert("⚠️ This book is currently out of stock!");
      return;
    }
    if (status === "arriving soon") {
      alert("⏰ This book is arriving soon. Please check back later!");
      return;
    }

    try {
      const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
        bookid: data._id,
      };
      
      // Correct API call format - send bookid in body
      const response = await axios.put(
        `${API_URL}/add-to-cart`,
        {}, // Send bookid in request body
        { headers }
      );
      
      alert(response.data.message || "✅ Book added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(error.response?.data?.message || "❌ Failed to add to cart!");
    }
  };

  // Get stock status
  const getStockStatus = () => {
    const stock = data.stock < 0 ? 0 : data.stock;
    const isOutOfStock = stock === 0;
    const status = data.productStatus?.toLowerCase();

    if (status === "not available") {
      return { 
        color: "bg-gray-500/20 border-gray-500/50 text-gray-300", 
        icon: FaExclamationTriangle,
        text: "N/A",
        available: false,
        hoverText: "Not Available",
        hoverIcon: FaBan,
        hoverColor: "from-gray-500 to-gray-600"
      };
    }
    if (isOutOfStock || status === "sold out") {
      return { 
        color: "bg-red-500/20 border-red-500/50 text-red-300", 
        icon: FaExclamationTriangle,
        text: "Out",
        available: false,
        hoverText: "Sold Out",
        hoverIcon: FaExclamationTriangle,
        hoverColor: "from-red-500 to-red-600"
      };
    }
    if (status === "arriving soon") {
      return { 
        color: "bg-blue-500/20 border-blue-500/50 text-blue-300", 
        icon: FaClock,
        text: "Soon",
        available: false,
        hoverText: "Arriving Soon",
        hoverIcon: FaClock,
        hoverColor: "from-blue-500 to-blue-600"
      };
    }
    return { 
      color: "bg-green-500/20 border-green-500/50 text-green-300", 
      icon: FaCheckCircle,
      text: stock,
      available: true,
      hoverText: "Quick Add",
      hoverIcon: FaShoppingCart,
      hoverColor: "from-yellow-400 to-yellow-500"
    };
  };

  const stockStatus = getStockStatus();
  const StatusIcon = stockStatus.icon;
  const HoverIcon = stockStatus.hoverIcon;

  return (
    <Link to={`/view-book-details/${data._id}`} className="group block">
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-yellow-400/20 transition-all duration-300 border border-zinc-700/50 hover:border-yellow-400/30"
      >
        {/* Image Section */}
        <div className="relative bg-zinc-900/50 overflow-hidden h-[220px] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
          
          <motion.img
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5 }}
            src={data.url}
            alt={data.title}
            className="h-full w-full object-cover"
          />

          {/* Status Badge - Top Left */}
          <div className="absolute top-2 left-2 z-20">
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full backdrop-blur-sm border ${stockStatus.color} text-[9px] font-bold`}>
              <StatusIcon className="text-[8px]" />
              <span>{stockStatus.text}</span>
            </div>
          </div>

          {/* Heart Icon - Top Right */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={isFavouriteBook ? handleRemoveFromFavourites : handleAddToFavourites}
            className="absolute top-2 right-2 z-20 bg-black/60 backdrop-blur-sm hover:bg-yellow-400 text-yellow-400 hover:text-black p-2 rounded-full border border-yellow-400/20 transition-all duration-300 shadow-lg"
          >
            {isFavouriteBook ? <FaHeart className="text-xs" /> : <FaRegHeart className="text-xs" />}
          </motion.button>

          {/* Stats Overlay - Bottom */}
          <div className="absolute bottom-2 left-2 right-2 z-20 flex items-center justify-between">
            {data.views > 0 && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded-full border border-white/10">
                <FaEye className="text-purple-400 text-[8px]" />
                <span className="text-white text-[9px] font-semibold">{data.views}</span>
              </div>
            )}

            {data.sold > 0 && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-500/50">
                <FaFireAlt className="text-green-400 text-[8px]" />
                <span className="text-green-300 text-[9px] font-semibold">{data.sold}</span>
              </div>
            )}
          </div>

          {/* Hover Overlay - Shows different message based on status */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <motion.button
              whileHover={{ scale: stockStatus.available ? 1.05 : 1 }}
              whileTap={{ scale: stockStatus.available ? 0.95 : 1 }}
              onClick={stockStatus.available ? handleQuickAdd : (e) => e.preventDefault()}
              className={`flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r ${stockStatus.hoverColor} ${
                stockStatus.available ? 'text-black cursor-pointer hover:brightness-110' : 'text-white cursor-not-allowed'
              } rounded-full font-bold text-xs shadow-lg transition-all`}
            >
              <HoverIcon className="text-xs" />
              {stockStatus.hoverText}
            </motion.button>
          </div>

          {/* Popular Badge */}
          {data.sold > 10 && (
            <div className="absolute top-2 right-12 z-10">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md shadow-lg">
                🔥
              </div>
            </div>
          )}

          {/* New Badge */}
          {data.postedAt && new Date(data.postedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
            <div className="absolute top-8 left-2 z-10">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md shadow-lg">
                NEW
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-3">
          {/* Category Tag */}
          {data.category && (
            <span className="inline-block px-1.5 py-0.5 bg-purple-500/20 text-purple-300 text-[9px] font-semibold rounded border border-purple-500/30 mb-1.5">
              {data.category}
            </span>
          )}

          {/* Title */}
          <h2 className="text-sm font-bold text-white mb-1 line-clamp-2 group-hover:text-yellow-400 transition-colors duration-300 leading-snug">
            {data.title}
          </h2>

          {/* Author */}
          <p className="text-[10px] text-zinc-400 mb-2 truncate">
            by <span className="text-zinc-300 font-medium">{data.author}</span>
          </p>

          {/* Rating & Stock */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} className="text-yellow-400 text-[9px]" />
              ))}
            </div>
            {stockStatus.available && data.stock && (
              <span className="text-zinc-500 text-[9px]">
                {data.stock} left
              </span>
            )}
          </div>

          {/* Price & Language */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              ₹{data.price}
            </span>
            {data.language && (
              <span className="text-[9px] text-zinc-500 uppercase tracking-wider">
                {data.language}
              </span>
            )}
          </div>

          {/* Remove button on Favourites page */}
          {location.pathname.toLowerCase().includes("/profile/favourites") && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRemoveFromFavourites}
              className="mt-2 w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-1.5 rounded-lg transition-all duration-300 text-xs shadow-lg"
            >
              Remove
            </motion.button>
          )}
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
        </div>
      </motion.div>
    </Link>
  );
}

export default BookCard;