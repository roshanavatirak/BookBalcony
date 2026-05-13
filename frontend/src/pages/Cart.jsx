import React, { useState, useEffect } from 'react';
import Loader from "../components/Loader/Loader";
import axios from 'axios';
import { FaTrashAlt, FaShoppingCart, FaShieldAlt, FaTruck, FaLock, FaCheckCircle, FaArrowRight, FaHeart, FaTag, FaBox, FaStar } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSparkles } from "react-icons/hi";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/get-user-cart`, { headers });
      setCart(res.data.data || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
    setLoading(false);
  };

  const removeFromCart = async (bookid) => {
    setRemovingId(bookid);
    try {
      await axios.put(`${API_URL}/remove-from-cart/${bookid}`, {}, { headers });
      setCart(prev => prev.filter(item => item._id !== bookid));
    } catch (error) {
      alert("Failed to remove item.");
      console.error(error);
    } finally {
      setRemovingId(null);
    }
  };

  const placeOrdernew = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    navigate(`/checkout/cart`, {
      state: {
        cartItems: cart
      },
    });
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
  const savings = cart.reduce((sum, item) => sum + (item.discount || 0), 0);

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-zinc-900 to-black min-h-screen relative overflow-hidden">
      {/* Animated Background */}
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

      <div className="relative z-10 px-3 py-3 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-36 lg:pb-32">
        {loading ? (
          <div className="w-full h-[70vh] flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <>
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 sm:mb-8"
            >
              <div className="flex flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
                <div>
                  <h1 className="text-xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent mb-1 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
                    <FaShoppingCart className="text-yellow-400 text-xl sm:text-4xl" />
                    Your Cart
                  </h1>
                  <p className="text-zinc-400 text-[11px] sm:text-base flex items-center gap-1 sm:gap-2">
                    <HiSparkles className="text-yellow-400" />
                    {cart.length > 0 
                      ? `${cart.length} book${cart.length !== 1 ? 's' : ''} ready for checkout`
                      : 'Start building your collection'}
                  </p>
                </div>

                {cart.length > 0 && (
                  <div className="flex flex-col items-end gap-0.5">
                    <div className="text-right">
                      <p className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wider">Subtotal</p>
                      <p className="text-lg sm:text-3xl font-bold text-yellow-400">₹{totalAmount}</p>
                    </div>
                    {savings > 0 && (
                      <div className="flex items-center gap-1 text-green-400 text-[10px] sm:text-xs">
                        <FaTag className="text-[8px] sm:text-[10px]" />
                        <span>You saved ₹{savings}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              {cart.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-3 gap-1.5 sm:gap-4 mb-3 sm:mb-6"
                >
                  <div className="bg-zinc-800/50 backdrop-blur-sm rounded-lg p-1.5 sm:p-3 border border-zinc-700/50 text-center">
                    <FaShieldAlt className="text-green-400 text-sm sm:text-xl mx-auto mb-0.5 sm:mb-1" />
                    <p className="text-zinc-300 text-[9px] sm:text-xs font-semibold">Secure Payment</p>
                  </div>
                  <div className="bg-zinc-800/50 backdrop-blur-sm rounded-lg p-1.5 sm:p-3 border border-zinc-700/50 text-center">
                    <FaTruck className="text-blue-400 text-sm sm:text-xl mx-auto mb-0.5 sm:mb-1" />
                    <p className="text-zinc-300 text-[9px] sm:text-xs font-semibold">Fast Delivery</p>
                  </div>
                  <div className="bg-zinc-800/50 backdrop-blur-sm rounded-lg p-1.5 sm:p-3 border border-zinc-700/50 text-center">
                    <FaCheckCircle className="text-purple-400 text-sm sm:text-xl mx-auto mb-0.5 sm:mb-1" />
                    <p className="text-zinc-300 text-[9px] sm:text-xs font-semibold">Quality Assured</p>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Empty Cart State */}
            {cart.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center"
              >
                <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-zinc-700/50 max-w-md">
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaShoppingCart className="text-7xl sm:text-8xl text-zinc-600 mb-6 mx-auto" />
                  </motion.div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-zinc-300 mb-3">Your Cart is Empty</h2>
                  <p className="text-zinc-500 mb-6 text-sm sm:text-base">
                    Discover amazing books and start building your collection today!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/')}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-6 sm:px-8 py-3 rounded-full font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg shadow-yellow-500/30"
                  >
                    <HiSparkles />
                    Explore Books
                    <FaArrowRight className="text-sm" />
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-2.5 sm:space-y-4 mb-4 sm:mb-6">
                  <AnimatePresence>
                    {cart.map((item, i) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-zinc-700/50 hover:border-yellow-400/30 transition-all duration-300 overflow-hidden"
                      >
                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/5 to-transparent" />
                        </div>

                        <div className="relative p-2.5 sm:p-6">
                          <div className="flex flex-row gap-2.5 sm:gap-6">
                            {/* Book Image */}
                            <div className="relative flex-shrink-0">
                              <div className="relative w-16 h-20 sm:w-28 sm:h-36 rounded-lg sm:rounded-xl overflow-hidden shadow-lg group-hover:shadow-yellow-400/20 transition-shadow duration-300">
                                <img
                                  src={item.url}
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                              </div>
                              
                              {/* Stock Badge */}
                              {item.stock && (
                                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-green-500 text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-lg">
                                  {item.stock} left
                                </div>
                              )}
                            </div>

                            {/* Book Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 sm:gap-4 mb-1 sm:mb-2">
                                <div className="flex-1">
                                  <h2 className="text-sm sm:text-xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300 line-clamp-1 sm:line-clamp-2">
                                    {item.title}
                                  </h2>
                                  <p className="text-[10px] sm:text-sm text-zinc-400 mt-0.5 sm:mt-1">
                                    by {item.author || 'Unknown Author'}
                                  </p>
                                </div>

                                {/* Remove Button - Desktop */}
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => removeFromCart(item._id)}
                                  className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                                    removingId === item._id
                                      ? "bg-red-400/50 text-white cursor-not-allowed"
                                      : "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white"
                                  }`}
                                  disabled={removingId === item._id}
                                >
                                  {removingId === item._id ? (
                                    <span className="text-xs animate-pulse">Removing...</span>
                                  ) : (
                                    <>
                                      <FaTrashAlt className="text-xs" />
                                      Remove
                                    </>
                                  )}
                                </motion.button>
                              </div>

                              <p className="text-[10px] sm:text-sm text-zinc-400 mb-1.5 sm:mb-3 line-clamp-1 sm:line-clamp-3">
                                {item.desc || 'No description available'}
                              </p>

                              {/* Bottom Row - Price & Features */}
                              <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
                                {/* Price */}
                                <div className="flex items-baseline gap-1 sm:gap-2">
                                  <span className="text-base sm:text-2xl font-bold text-yellow-400">₹{item.price}</span>
                                  {item.discount > 0 && (
                                    <span className="text-[10px] sm:text-sm text-zinc-500 line-through">₹{item.price + item.discount}</span>
                                  )}
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-0.5 sm:gap-1 bg-zinc-700/50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full">
                                  <FaStar className="text-yellow-400 text-[8px] sm:text-[10px]" />
                                  <span className="text-[10px] sm:text-xs text-zinc-300 font-semibold">4.8</span>
                                </div>

                                {/* Category Badge */}
                                {item.category && (
                                  <span className="text-[8px] sm:text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full border border-purple-500/30 font-semibold">
                                    {item.category}
                                  </span>
                                )}
                              </div>

                              {/* Remove Button - Mobile */}
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => removeFromCart(item._id)}
                                className={`sm:hidden w-full mt-2 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md font-semibold text-[11px] transition-all duration-300 ${
                                  removingId === item._id
                                    ? "bg-red-400/50 text-white cursor-not-allowed"
                                    : "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white"
                                }`}
                                disabled={removingId === item._id}
                              >
                                {removingId === item._id ? (
                                  <span className="text-[10px] animate-pulse">Removing...</span>
                                ) : (
                                  <>
                                    <FaTrashAlt className="text-[10px]" />
                                    Remove from Cart
                                  </>
                                )}
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Promotional Banner */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-sm border border-purple-500/30 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 mb-4 sm:mb-6"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-purple-500/20 rounded-full p-2 sm:p-3">
                      <FaBox className="text-purple-400 text-sm sm:text-xl" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-[11px] sm:text-base">Free Delivery on Orders Above ₹499</p>
                      <p className="text-zinc-400 text-[10px] sm:text-sm">
                        {totalAmount >= 499 
                          ? '🎉 Congratulations! You qualify for free delivery'
                          : `Add ₹${499 - totalAmount} more to get free delivery`
                        }
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Fixed Checkout Footer */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="fixed left-0 right-0 bg-gradient-to-t from-zinc-900 via-zinc-900/95 to-transparent backdrop-blur-lg border-t border-zinc-700/50 px-3 py-2 sm:p-6 z-40 bottom-[72px] lg:bottom-0"
                >
                  <div className="max-w-7xl mx-auto">
                    <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
                      {/* Total Summary */}
                      <div className="flex items-center gap-3 sm:gap-6">
                        <div>
                          <p className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wider mb-0.5 sm:mb-1">Total Amount</p>
                          <p className="text-lg sm:text-3xl font-bold text-yellow-400 flex items-baseline gap-1 sm:gap-2">
                            ₹{totalAmount}
                            {savings > 0 && (
                              <span className="text-[10px] sm:text-sm text-green-400 font-normal">(-₹{savings})</span>
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-1.5 text-[8px] sm:text-xs text-zinc-400 bg-zinc-800/60 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-zinc-700/40">
                          <FaLock className="text-green-400 text-[8px] sm:text-[10px]" />
                          <span>Secure checkout</span>
                        </div>
                      </div>

                      {/* Checkout Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={placeOrdernew}
                        disabled={placingOrder}
                        className="sm:w-auto bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black px-4 py-2.5 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl font-bold text-xs sm:text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/30 flex items-center justify-center gap-2 sm:gap-3 whitespace-nowrap"
                      >
                        {placingOrder ? (
                          <>
                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs sm:text-base">Processing...</span>
                          </>
                        ) : (
                          <>
                            <FaLock className="text-[10px] sm:text-sm" />
                            Checkout
                            <FaArrowRight className="text-[10px] sm:text-sm" />
                          </>
                        )}
                      </motion.button>
                    </div>

                    {/* Trust Line - hidden on mobile */}
                    <div className="hidden sm:flex items-center justify-center gap-6 mt-3 pt-3 border-t border-zinc-800/60 text-xs text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <FaCheckCircle className="text-green-400 text-[10px]" />
                        <span>SSL Encrypted</span>
                      </div>
                      <span className="text-zinc-700">•</span>
                      <div className="flex items-center gap-1.5">
                        <FaShieldAlt className="text-blue-400 text-[10px]" />
                        <span>Safe Payments</span>
                      </div>
                      <span className="text-zinc-700">•</span>
                      <div className="flex items-center gap-1.5">
                        <FaTruck className="text-purple-400 text-[10px]" />
                        <span>Fast Shipping</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;