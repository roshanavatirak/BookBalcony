import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Rao from "../../assets/Rao.png";
import { 
  FaBookOpen, 
  FaShoppingCart, 
  FaTruck, 
  FaStore, 
  FaChartLine, 
  FaUsers,
  FaUser,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft
} from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

// Onboarding slides with enhanced content
const pages = [
  {
    title: "Welcome to BookBalcony",
    subtitle: "Your Premium Book Marketplace",
    icon: <FaBookOpen className="text-4xl text-yellow-400" />,
    desc: (
      <div className="space-y-3">
        <p className="text-sm text-zinc-300 leading-relaxed">
          Discover a world where book lovers connect, trade, and explore literary treasures with ease and confidence.
        </p>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300">
            <FaShoppingCart className="text-lg text-yellow-400 mx-auto mb-1" />
            <p className="text-[10px] text-zinc-400">Easy Shopping</p>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300">
            <FaTruck className="text-lg text-yellow-400 mx-auto mb-1" />
            <p className="text-[10px] text-zinc-400">Fast Delivery</p>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300">
            <FaUsers className="text-lg text-yellow-400 mx-auto mb-1" />
            <p className="text-[10px] text-zinc-400">Community</p>
          </div>
        </div>
        <blockquote className="border-l-2 border-yellow-400 pl-3 italic text-yellow-200/80 text-xs mt-4">
          "A reader lives a thousand lives before he dies. The man who never reads lives only one."
          <span className="block text-[10px] text-zinc-500 mt-1">— George R.R. Martin</span>
        </blockquote>
      </div>
    ),
  },
  {
    title: "Meet the Visionary",
    subtitle: "Built with passion for readers",
    icon: (
      <div className="relative">
        <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <img
          src={Rao}
          alt="Roshan Avatirak"
          className="w-16 h-16 rounded-full border-2 border-yellow-400 shadow-xl shadow-yellow-400/30 relative z-10 object-cover"
        />
      </div>
    ),
    desc: (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-yellow-400/10 to-orange-400/10 p-4 rounded-xl border border-yellow-400/30 backdrop-blur-sm">
          <p className="text-sm text-zinc-200 leading-relaxed mb-2">
            Hi, I'm <span className="font-bold text-yellow-300 text-base">Roshan Avatirak</span> 👋
          </p>
          <p className="text-xs text-zinc-300 leading-relaxed">
            As a passionate developer and avid reader, I created BookBalcony to bridge the gap between book enthusiasts. 
            My vision is to empower students and readers with a seamless platform to buy, sell, and discover books.
          </p>
        </div>
        <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-zinc-700">
          <FaChartLine className="text-2xl text-green-400" />
          <div>
            <p className="text-xs font-semibold text-white">Growing Community</p>
            <p className="text-[10px] text-zinc-400">Join thousands of book lovers already on BookBalcony</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "How BookBalcony Works",
    subtitle: "Simple, efficient, and powerful",
    icon: <FaStore className="text-4xl text-yellow-400" />,
    desc: (
      <div className="space-y-4">
        {/* For Buyers */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-4 rounded-xl border border-blue-400/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-blue-400 rounded-lg flex items-center justify-center">
              <FaShoppingCart className="text-white text-xs" />
            </div>
            <h4 className="font-bold text-sm text-white">For Book Buyers</h4>
          </div>
          <ul className="space-y-2 text-xs text-zinc-300">
            {[
              "Browse curated collections and trending books",
              "Add items to cart with one-click checkout",
              "Track orders in real-time with live updates",
              "Rate sellers and books for community trust"
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <FaCheckCircle className="text-blue-400 mt-0.5 flex-shrink-0 text-[10px]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* For Sellers */}
        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-4 rounded-xl border border-yellow-400/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-yellow-400 rounded-lg flex items-center justify-center">
              <FaStore className="text-black text-xs" />
            </div>
            <h4 className="font-bold text-sm text-white">For Book Sellers</h4>
          </div>
          <ul className="space-y-2 text-xs text-zinc-300">
            {[
              "List unlimited books with detailed descriptions",
              "Manage inventory via intuitive seller dashboard",
              "Process orders efficiently with built-in tools",
              "Grow your reach with integrated marketing features"
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <FaCheckCircle className="text-yellow-400 mt-0.5 flex-shrink-0 text-[10px]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: "Tell Us Your Name",
    subtitle: "Personalize your BookBalcony experience",
    icon: <FaUser className="text-4xl text-yellow-400" />,
    desc: (
      <div className="space-y-3">
        <p className="text-xs text-zinc-300 leading-relaxed text-center">
          Welcome to the community! Please enter your first and last name so we can personalize your profile.
        </p>
      </div>
    ),
    isFinal: true,
  },
];

const OnboardingModal = ({ onClose }) => {
  const [page, setPage] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const isFinalPage = pages[page].isFinal;

  const next = async () => {
    if (isFinalPage) {
      if (!firstName.trim()) {
        alert("Please enter your First Name");
        return;
      }

      setLoading(true);
      try {
        await axios.post(
          `${API_URL}/update-name`,
          { firstName: firstName.trim(), lastName: lastName.trim() },
          {
            headers: {
              id: localStorage.getItem("id"),
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        localStorage.removeItem("showOnboarding");
        window.dispatchEvent(new CustomEvent("userInfoUpdated"));
        onClose();
      } catch (err) {
        console.error("❌ Failed to update name:", err);
        localStorage.removeItem("showOnboarding");
        onClose();
      } finally {
        setLoading(false);
      }
    } else {
      setPage(page + 1);
    }
  };

  const previous = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    next();
  };

  const handlePrevious = () => {
    setDirection(-1);
    previous();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-black max-w-2xl w-full rounded-2xl shadow-2xl border border-yellow-400/30 overflow-hidden"
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-orange-400/5 pointer-events-none"></div>
        
        {/* Header with progress - NO CLOSE BUTTON */}
        <div className="relative border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl p-4">
          <div className="flex items-center justify-center mb-4">
            <motion.h3 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-medium text-yellow-400"
            >
              Step {page + 1} of {pages.length}
            </motion.h3>
          </div>

          {/* Enhanced progress bar */}
          <div className="flex gap-1.5">
            {pages.map((_, idx) => (
              <motion.div
                key={idx}
                className="relative flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden"
                initial={false}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400"
                  initial={{ width: idx < page ? "100%" : "0%" }}
                  animate={{ 
                    width: idx < page ? "100%" : idx === page ? "100%" : "0%",
                    opacity: idx <= page ? 1 : 0.3
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
                {idx === page && (
                  <motion.div
                    className="absolute inset-0 bg-white/30"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="relative p-5 max-h-[55vh] overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Icon */}
              <motion.div 
                className="flex justify-center mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                {pages[page].icon}
              </motion.div>

              {/* Title */}
              <motion.h2 
                className="text-xl sm:text-2xl font-bold text-white mb-1 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {pages[page].title}
              </motion.h2>

              {/* Subtitle */}
              <motion.p 
                className="text-yellow-400/80 text-center mb-5 text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {pages[page].subtitle}
              </motion.p>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {pages[page].desc}
              </motion.div>

              {/* Name Inputs on Step 4 */}
              {isFinalPage && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-4 space-y-3 max-w-md mx-auto"
                >
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      First Name <span className="text-yellow-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Roshan"
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-zinc-800 border border-zinc-700 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white transition-all"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Avatirak"
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-zinc-800 border border-zinc-700 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white transition-all"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer with navigation buttons */}
        <div className="relative border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-xl p-4">
          <div className="flex gap-3">
            {page > 0 && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={handlePrevious}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 border border-zinc-700 hover:border-zinc-600 group"
              >
                <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
                <span>Previous</span>
              </motion.button>
            )}
            
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-black text-sm font-bold rounded-lg transition-all duration-300 shadow-lg shadow-yellow-400/25 hover:shadow-yellow-400/40 hover:scale-[1.02] transform group"
            >
              {isFinalPage ? (
                <>
                  <span>Get Started 🎉</span>
                  <FaCheckCircle className="text-sm group-hover:scale-110 transition-transform" />
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(39, 39, 42, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(250, 204, 21, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(250, 204, 21, 0.7);
        }
      `}</style>
    </div>
  );
};

export default OnboardingModal;