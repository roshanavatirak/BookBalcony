import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/auth';
import { FaHeart, FaHistory, FaCog, FaSignOutAlt, FaStore, FaExclamationTriangle, FaCrown, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Sidebar = ({ data, seller }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const avatarSrc = data?.avatar?.startsWith("http")
    ? data.avatar
    : data?.avatar 
      ? `http://localhost:3000/${data.avatar}`
      : "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg";

  const handleLogout = () => {
    localStorage.clear();
    dispatch(authActions.logout());
    navigate("/signin");
  };

  const getSellerStatus = () => {
    if (seller?.data?.status === "Approved" || seller?.status === "Approved") {
      return { type: 'verified', status: 'Approved' };
    }
    
    if (seller?.data?.status === "Pending" || seller?.status === "Pending") {
      return { type: 'pending', status: 'Pending' };
    }
    
    if (data?.isSeller && !seller) {
      return { type: 'inconsistent', status: 'Data Issue' };
    }
    
    return { type: 'normal', status: 'Not a Seller' };
  };

  const sellerStatus = getSellerStatus();
  console.log("Sidebar - Seller Status:", sellerStatus, { userIsSeller: data?.isSeller, sellerData: seller });

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl text-white 
        w-full sm:w-80 md:w-72 lg:w-64 xl:w-60 
        h-auto sm:min-h-screen p-6 sm:p-8 
        flex flex-col justify-start items-center 
        shadow-2xl border border-zinc-700/50 backdrop-blur-sm
        before:absolute before:inset-0 before:rounded-3xl before:p-[1px] 
        before:bg-gradient-to-br before:from-yellow-400/20 before:via-transparent before:to-purple-500/20 
        before:-z-10 before:blur-sm"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>

      {/* Mobile Profile */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full sm:hidden mb-6 bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 rounded-2xl p-4 flex items-center gap-4 shadow-lg backdrop-blur-md border border-zinc-700/30"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500 rounded-full blur-md opacity-50 animate-pulse"></div>
          <div className="relative rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500">
            <img
              src={avatarSrc}
              alt="User Avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-zinc-900"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-zinc-900 animate-pulse"></div>
        </div>
        <div className="flex flex-col">
          <h2 className="text-base font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
            {data?.username || "Profile"}
          </h2>
          <p className="text-xs text-zinc-400">{data?.email || "Not available"}</p>
        </div>
      </motion.div>

      {/* Desktop Avatar */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="hidden sm:flex flex-col items-center mt-4"
      >
        <div className="relative group">
          {/* Animated glow effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>
          
          {/* Avatar container with gradient border */}
          <div className="relative rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500 group-hover:scale-105 transition-transform duration-300">
            <img
              src={avatarSrc}
              alt="User Avatar"
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-zinc-900"
            />
          </div>
          
          {/* Online status indicator */}
          <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-3 border-zinc-900 shadow-lg shadow-green-500/50 animate-pulse"></div>
          
          {/* Premium badge if applicable */}
          {data?.isPremium && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-yellow-600 w-8 h-8 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50 animate-bounce">
              <FaCrown className="text-white text-xs" />
            </div>
          )}
        </div>
        
        <motion.h2 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-lg md:text-xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent"
        >
          {data?.username || "Profile"}
        </motion.h2>
        <p className="text-sm text-zinc-400 mt-1">{data?.email || "Not available"}</p>
        
        {/* Stats or badge */}
        <div className="mt-3 flex gap-2">
          <div className="px-3 py-1 bg-zinc-800/50 rounded-full border border-zinc-700/50 backdrop-blur-sm flex items-center gap-1">
            <FaStar className="text-yellow-400 text-xs" />
            <span className="text-xs text-zinc-300">Member</span>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="mt-8 sm:mt-10 w-full flex flex-col gap-2 px-1">
        {[
          { to: "/profile", icon: <FaHeart />, label: "Favourites", gradient: "from-red-400 to-pink-400" },
          { to: "/profile/orderHistory", icon: <FaHistory />, label: "Order History", gradient: "from-blue-400 to-cyan-400" },
          { to: "/profile/settings", icon: <FaCog />, label: "Settings", gradient: "from-purple-400 to-pink-400" },
        ].map((item, index) => {
          const active = isActive(item.to);
          return (
            <motion.div
              key={item.to}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Link
                to={item.to}
                className={`relative group flex items-center gap-3 pl-5 pr-4 py-3.5 rounded-xl transition-all duration-300 overflow-hidden
                ${active
                    ? "bg-gradient-to-r from-zinc-800 to-zinc-700 border-l-[5px] border-yellow-400 shadow-lg shadow-yellow-400/20"
                    : "hover:bg-zinc-800/50 hover:translate-x-1"
                  }`}
              >
                {/* Animated background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Icon with glow effect */}
                <div className={`relative text-lg z-10 transition-all duration-300 
                  ${active 
                    ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" 
                    : "text-zinc-400 group-hover:text-yellow-300 group-hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.3)]"
                  }`}
                >
                  {item.icon}
                </div>
                
                <span className={`text-sm font-medium z-10 transition-all duration-300 
                  ${active 
                    ? "text-white" 
                    : "text-zinc-300 group-hover:text-yellow-100"
                  }`}
                >
                  {item.label}
                </span>

                {/* Active indicator line */}
                {active && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}

        {/* Seller Section with Enhanced Styles */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-4"
        >
          {sellerStatus.type === 'verified' ? (
            <Link
              to="/profile/verified-seller-info"
              className="relative group flex items-center gap-3 pl-5 pr-4 py-4 rounded-xl transition-all duration-500 
                bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 
                shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:shadow-xl
                text-black overflow-hidden transform hover:scale-[1.02]"
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {/* Sparkle effects */}
              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
              <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-ping animation-delay-200"></div>
              
              <div className="text-xl text-black group-hover:scale-110 transition-transform duration-300 z-10 drop-shadow-md">
                <FaStore />
              </div>
              <div className="flex flex-col z-10">
                <span className="text-sm font-bold drop-shadow-sm">Verified Seller</span>
                <span className="text-xs opacity-80">Manage your store</span>
              </div>
              <FaCrown className="ml-auto text-lg opacity-80 group-hover:rotate-12 transition-transform duration-300 z-10" />
            </Link>
          ) : sellerStatus.type === 'pending' ? (
            <Link
              to="/profile/seller-application-submitted"
              className="relative group flex items-center gap-3 pl-5 pr-4 py-4 rounded-xl transition-all duration-300 
                bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 
                text-orange-700 hover:text-orange-800 shadow-md hover:shadow-lg 
                border border-orange-200 overflow-hidden transform hover:scale-[1.02]"
            >
              {/* Pulsing background */}
              <div className="absolute inset-0 bg-orange-200 opacity-0 group-hover:opacity-20 animate-pulse"></div>
              
              <div className="text-lg z-10 animate-pulse">
                <FaStore />
              </div>
              <div className="flex flex-col z-10">
                <span className="text-sm font-semibold">Under Review</span>
                <span className="text-xs opacity-70">We're checking your application</span>
              </div>
            </Link>
          ) : sellerStatus.type === 'inconsistent' ? (
            <Link
              to="/profile/become-seller"
              className="relative group flex items-center gap-3 pl-5 pr-4 py-4 rounded-xl transition-all duration-300 
                bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 
                text-red-700 hover:text-red-800 shadow-md hover:shadow-lg 
                border border-red-200 overflow-hidden transform hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-red-200 opacity-0 group-hover:opacity-20 animate-pulse"></div>
              
              <div className="text-lg z-10 animate-bounce">
                <FaExclamationTriangle />
              </div>
              <div className="flex flex-col z-10">
                <span className="text-sm font-semibold">Data Issue</span>
                <span className="text-xs opacity-70">Please re-apply</span>
              </div>
            </Link>
          ) : (
            <Link
              to="/profile/become-seller"
              className="relative group flex items-center gap-3 pl-5 pr-4 py-4 rounded-xl transition-all duration-500
                bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-yellow-400 hover:to-yellow-500
                border border-yellow-400/30 hover:border-yellow-400
                shadow-md hover:shadow-xl hover:shadow-yellow-400/20
                overflow-hidden transform hover:scale-[1.02]"
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0 
                translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
              <div className="text-lg text-yellow-400 group-hover:text-black transition-colors duration-300 z-10 
                group-hover:scale-110 group-hover:rotate-12 transform">
                <FaStore />
              </div>
              <div className="flex flex-col z-10">
                <span className="text-sm font-semibold text-yellow-300 group-hover:text-black transition-colors duration-300">
                  Become a Seller
                </span>
                <span className="text-xs text-yellow-400/70 group-hover:text-black/70 transition-colors duration-300">
                  Start selling on BookBalcony
                </span>
              </div>
              <FaStar className="ml-auto text-yellow-400 group-hover:text-black opacity-50 group-hover:opacity-100 
                transition-all duration-300 z-10 group-hover:rotate-180 transform" />
            </Link>
          )}
        </motion.div>
      </nav>

      {/* Logout Button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        onClick={handleLogout}
        className="mt-8 sm:mt-auto mb-4 flex items-center gap-3 px-4 py-3 
          bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
          text-white rounded-xl transition-all duration-300 w-full justify-center 
          shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:shadow-xl
          transform hover:scale-[1.02] active:scale-95
          border border-red-400/30 group overflow-hidden relative"
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 translate-y-full 
          group-hover:translate-y-0 transition-transform duration-300"></div>
        
        <FaSignOutAlt className="z-10 group-hover:rotate-180 transition-transform duration-500" />
        <span className="text-sm font-semibold z-10">Log Out</span>
      </motion.button>

      {/* Bottom decorative line */}
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent rounded-full"></div>
    </motion.div>
  );
};

export default Sidebar;