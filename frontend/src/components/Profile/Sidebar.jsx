
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/auth';
import { FaHeart, FaHistory, FaCog, FaSignOutAlt, FaStore, FaExclamationTriangle, FaCrown, FaStar, FaUserCircle, FaBell } from 'react-icons/fa';
import { motion } from 'framer-motion';

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

const Sidebar = ({ data, seller }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Enhanced debugging and validation
  console.group('🎨 Sidebar Component Debug');
  console.log('Raw data prop:', data);
  console.log('Raw seller prop:', seller);
  console.log('Data type:', typeof data);
  console.log('Seller type:', typeof seller);
  console.log('Data keys:', data ? Object.keys(data) : 'null/undefined');
  console.log('Seller keys:', seller ? Object.keys(seller) : 'null/undefined');
  console.groupEnd();

  const isActive = (path) => {
    if (path === "/account/profile") {
      return location.pathname === "/account/profile" || location.pathname === "/account/profile/my-profile";
    }
    return location.pathname.startsWith(path);
  };

  // ✅ Enhanced avatar handling with debugging
  const getAvatarSrc = () => {
    console.group('🖼️ Avatar Resolution Debug');
    console.log('data?.avatar:', data?.avatar);
    
    try {
      // Check if avatar exists and is valid
      if (!data?.avatar) {
        console.log('❌ No avatar found, using default');
        console.groupEnd();
        return "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?ga=GA1.1.710266921.1749747219&semt=ais_hybrid&w=740";
      }

      // Check if it's already a full URL
      if (data.avatar.startsWith("http://") || data.avatar.startsWith("https://")) {
        console.log('✅ Using full URL avatar:', data.avatar);
        console.groupEnd();
        return data.avatar;
      }

      // Construct local URL
      const localUrl = `${BASE_URL}/${data.avatar}`;
      console.log('✅ Using local avatar:', localUrl);
      console.groupEnd();
      return localUrl;
    } catch (error) {
      console.error('❌ Error in getAvatarSrc:', error);
      console.groupEnd();
      return "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?ga=GA1.1.710266921.1749747219&semt=ais_hybrid&w=740";
    }
  };

  const avatarSrc = getAvatarSrc();

  // ✅ Enhanced user data extraction
  const getUserInfo = () => {
    try {
      if (!data) {
        return {
          username: 'Profile',
          email: 'Not available',
          hasData: false
        };
      }

      const rawUser = data.data || data;
      const firstName = rawUser.firstName || '';
      const lastName = rawUser.lastName || '';
      const username = rawUser.username || rawUser.name || 'Profile';

      const fullName = [firstName, lastName].filter(Boolean).join(' ');
      const displayName = fullName || username;

      const phone = rawUser.phone || '';
      const email = rawUser.email || '';

      const validPhone = (phone && !phone.includes('00000000')) ? phone : '';
      const validEmail = (email && !email.includes('bookbalcony.local')) ? email : '';

      // Contact subtitle logic:
      // If phone is available -> show phone
      // Else if email is available -> show email
      // If both available -> show phone!
      const contactInfo = validPhone || validEmail || 'Not available';

      const userInfo = {
        username: displayName,
        email: contactInfo,
        hasData: !!(displayName !== 'Profile' || validPhone || validEmail),
        isPremium: rawUser.isPremium || false,
        isSeller: rawUser.isSeller || false
      };

      return userInfo;
    } catch (error) {
      console.error('❌ Error extracting user info:', error);
      return {
        username: 'Profile',
        email: 'Not available',
        hasData: false,
        error: true
      };
    }
  };

  const userInfo = getUserInfo();

  // ✅ Enhanced seller status detection
  const getSellerStatus = () => {
    console.group('🏪 Seller Status Detection Debug');
    console.log('userInfo.isSeller:', userInfo.isSeller);
    console.log('seller prop:', seller);
    
    try {
      // Check seller data structure - could be nested
      let sellerStatus = null;
      
      if (seller?.data?.status) {
        sellerStatus = seller.data.status;
        console.log('✅ Status found at seller.data.status:', sellerStatus);
      } else if (seller?.status) {
        sellerStatus = seller.status;
        console.log('✅ Status found at seller.status:', sellerStatus);
      }

      console.log('Detected seller status:', sellerStatus);

      // Determine status type
      if (sellerStatus === "Approved") {
        console.log('✅ User is a verified seller');
        console.groupEnd();
        return { type: 'verified', status: 'Approved', hasData: true };
      }
      
      if (sellerStatus === "Pending") {
        console.log('⏳ Seller application is pending');
        console.groupEnd();
        return { type: 'pending', status: 'Pending', hasData: true };
      }
      
      if (sellerStatus === "Rejected") {
        console.log('❌ Seller application was rejected');
        console.groupEnd();
        return { type: 'rejected', status: 'Rejected', hasData: true };
      }

      // Check for data inconsistency
      if (userInfo.isSeller && !seller) {
        console.warn('⚠️ Data inconsistency: User marked as seller but no seller data');
        console.groupEnd();
        return { type: 'inconsistent', status: 'Data Issue', hasData: false };
      }
      
      console.log('ℹ️ User is not a seller');
      console.groupEnd();
      return { type: 'normal', status: 'Not a Seller', hasData: false };
    } catch (error) {
      console.error('❌ Error in getSellerStatus:', error);
      console.groupEnd();
      return { type: 'error', status: 'Error', hasData: false, error: true };
    }
  };

  const sellerStatus = getSellerStatus();

  const handleLogout = () => {
    console.log('👋 Logging out from sidebar...');
    localStorage.clear();
    dispatch(authActions.logout());
    navigate("/account/login");
  };

  // ✅ Error handler for image loading
  const handleImageError = (e) => {
    console.error('❌ Avatar image failed to load:', e.target.src);
    e.target.src = "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?ga=GA1.1.710266921.1749747219&semt=ais_hybrid&w=740";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-2xl text-white 
        w-full sm:w-80 md:w-72 lg:w-64 xl:w-60 
        h-auto p-4 sm:p-5 
        flex flex-col justify-start items-center 
        shadow-xl border border-zinc-700/50 backdrop-blur-sm
        before:absolute before:inset-0 before:rounded-2xl before:p-[1px] 
        before:bg-gradient-to-br before:from-yellow-400/20 before:via-transparent before:to-purple-500/20 
        before:-z-10 before:blur-sm"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div>

      {/* ✅ Error Display Banner */}
      {(!userInfo.hasData || userInfo.error) && (
        <div className="w-full mb-3 p-2 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-xs">
          <FaExclamationTriangle className="flex-shrink-0" />
          <span>Profile data loading issue. Some info may be unavailable.</span>
        </div>
      )}

      {/* Mobile Profile */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full sm:hidden mb-4 bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 rounded-xl p-3 flex items-center gap-3 shadow-lg backdrop-blur-md border border-zinc-700/30"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500 rounded-full blur-md opacity-50 animate-pulse"></div>
          <div className="relative rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="User Avatar"
                className="w-12 h-12 rounded-full object-cover border border-zinc-900"
                onError={handleImageError}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-zinc-700 border border-zinc-900 flex items-center justify-center">
                <FaUserCircle className="text-zinc-400 text-2xl" />
              </div>
            )}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-3.5 h-3.5 rounded-full border border-zinc-900 animate-pulse"></div>
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <h2 className="text-sm font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent truncate">
            {userInfo.username}
          </h2>
          <p className="text-[11px] text-zinc-400 truncate">{userInfo.email}</p>
          {!userInfo.hasData && (
            <p className="text-[10px] text-red-400 mt-0.5">⚠️ Limited data</p>
          )}
        </div>
      </motion.div>

      {/* Desktop Avatar */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="hidden sm:flex flex-col items-center mt-1"
      >
        <div className="relative group">
          {/* Animated glow effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500 rounded-full blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-300 animate-pulse"></div>
          
          {/* Avatar container with gradient border */}
          <div className="relative rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500 group-hover:scale-105 transition-transform duration-300">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="User Avatar"
                className="w-16 h-16 md:w-16 md:h-16 rounded-full object-cover border-2 border-zinc-900"
                onError={handleImageError}
              />
            ) : (
              <div className="w-16 h-16 md:w-16 md:h-16 rounded-full bg-zinc-700 border-2 border-zinc-900 flex items-center justify-center">
                <FaUserCircle className="text-zinc-400 text-3xl" />
              </div>
            )}
          </div>
          
          {/* Online status indicator */}
          <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-zinc-900 shadow-md shadow-green-500/50 animate-pulse"></div>
          
          {/* Premium badge if applicable */}
          {userInfo.isPremium && (
            <div className="absolute -top-1 -right-1 bg-gradient-to-br from-yellow-400 to-yellow-600 w-6 h-6 rounded-full flex items-center justify-center shadow-md shadow-yellow-500/50 animate-bounce">
              <FaCrown className="text-white text-[10px]" />
            </div>
          )}
        </div>
        
        <motion.h2 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-2 text-sm md:text-base font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent text-center px-1"
        >
          {userInfo.username}
        </motion.h2>
        <p className="text-[11px] text-zinc-400 mt-0.5 text-center px-1 truncate w-full max-w-[180px]">
          {userInfo.email}
        </p>
        
        {/* Warning for limited data */}
        {!userInfo.hasData && (
          <div className="mt-1 px-2.5 py-0.5 bg-red-500/10 border border-red-500/30 rounded-full">
            <span className="text-[10px] text-red-400">⚠️ Limited data</span>
          </div>
        )}
        
        {/* Stats or badge */}
        <div className="mt-1.5 flex gap-1">
          <div className="px-2.5 py-0.5 bg-zinc-800/60 rounded-full border border-zinc-700/50 backdrop-blur-sm flex items-center gap-1">
            <FaStar className="text-yellow-400 text-[10px]" />
            <span className="text-[10px] font-medium text-zinc-300">Member</span>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="mt-3 w-full flex flex-col gap-1 px-0.5">
        {[
          { to: "/account/profile", icon: <FaUserCircle />, label: "My Profile", gradient: "from-yellow-400 to-amber-500" },
          { to: "/account/profile/favourites", icon: <FaHeart />, label: "Favourites", gradient: "from-red-400 to-pink-400" },
          { to: "/account/profile/orderHistory", icon: <FaHistory />, label: "Order History", gradient: "from-blue-400 to-cyan-400" },
          { to: "/account/profile/my-subscriptions", icon: <FaBell />, label: "My Subscriptions", gradient: "from-green-400 to-emerald-400" },
          { to: "/account/profile/settings", icon: <FaCog />, label: "Settings", gradient: "from-purple-400 to-pink-400" },
        ].map((item, index) => {
          const active = isActive(item.to);
          return (
            <motion.div
              key={item.to}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.05 }}
            >
              <Link
                to={item.to}
                className={`relative group flex items-center gap-2.5 pl-3.5 pr-3 py-2 rounded-lg transition-all duration-200 overflow-hidden
                ${active
                    ? "bg-gradient-to-r from-zinc-800 to-zinc-700/90 border-l-[3px] border-yellow-400 shadow-md shadow-yellow-400/10"
                    : "hover:bg-zinc-800/50 hover:translate-x-0.5"
                  }`}
              >
                {/* Animated background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-200`}></div>
                
                {/* Icon with glow effect */}
                <div className={`relative text-base z-10 transition-all duration-200 
                  ${active 
                    ? "text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]" 
                    : "text-zinc-400 group-hover:text-yellow-300"
                  }`}
                >
                  {item.icon}
                </div>
                
                <span className={`text-xs font-semibold z-10 transition-all duration-200 
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-md shadow-yellow-400/50"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}

        {/* ✅ Enhanced Seller Section */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-2"
        >
          {sellerStatus.error ? (
            <div className="flex items-center gap-2 pl-3.5 pr-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
              <FaExclamationTriangle className="text-base" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold">Status Error</span>
                <span className="text-[10px] opacity-70">Unable to load seller status</span>
              </div>
            </div>
          ) : sellerStatus.type === 'verified' ? (
            <Link
              to="/account/profile/verified-seller-info"
              className="relative group flex items-center gap-2.5 pl-3.5 pr-3 py-2 rounded-lg transition-all duration-300 
                bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 
                shadow-md shadow-yellow-500/20 hover:shadow-yellow-500/40
                text-black overflow-hidden transform hover:scale-[1.01]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              <div className="text-base text-black group-hover:scale-105 transition-transform duration-200 z-10 drop-shadow-sm">
                <FaStore />
              </div>
              <div className="flex flex-col z-10 leading-tight">
                <span className="text-xs font-bold drop-shadow-sm">Verified Seller</span>
                <span className="text-[10px] opacity-80">Manage your store</span>
              </div>
              <FaCrown className="ml-auto text-sm opacity-80 group-hover:rotate-12 transition-transform duration-200 z-10" />
            </Link>
          ) : sellerStatus.type === 'pending' ? (
            <Link
              to="/account/profile/seller-application-submitted"
              className="relative group flex items-center gap-2.5 pl-3.5 pr-3 py-2 rounded-lg transition-all duration-200 
                bg-gradient-to-r from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 hover:to-amber-500/30 
                text-orange-300 shadow-sm border border-orange-500/30 overflow-hidden"
            >
              <div className="text-base z-10 animate-pulse text-orange-400">
                <FaStore />
              </div>
              <div className="flex flex-col z-10 leading-tight">
                <span className="text-xs font-semibold text-orange-300">Under Review</span>
                <span className="text-[10px] text-orange-400/80">Checking application</span>
              </div>
            </Link>
          ) : sellerStatus.type === 'rejected' ? (
            <Link
              to="/account/profile/become-seller"
              className="relative group flex items-center gap-2.5 pl-3.5 pr-3 py-2 rounded-lg transition-all duration-200 
                bg-gradient-to-r from-red-500/20 to-rose-500/20 hover:from-red-500/30 hover:to-rose-500/30 
                text-red-300 shadow-sm border border-red-500/30 overflow-hidden"
            >
              <div className="text-base z-10 text-red-400">
                <FaExclamationTriangle />
              </div>
              <div className="flex flex-col z-10 leading-tight">
                <span className="text-xs font-semibold text-red-300">Application Rejected</span>
                <span className="text-[10px] text-red-400/80">Click to re-apply</span>
              </div>
            </Link>
          ) : sellerStatus.type === 'inconsistent' ? (
            <Link
              to="/account/profile/become-seller"
              className="relative group flex items-center gap-2.5 pl-3.5 pr-3 py-2 rounded-lg transition-all duration-200 
                bg-gradient-to-r from-red-500/20 to-rose-500/20 hover:from-red-500/30 
                text-red-300 shadow-sm border border-red-500/30 overflow-hidden"
            >
              <div className="text-base z-10 text-red-400 animate-bounce">
                <FaExclamationTriangle />
              </div>
              <div className="flex flex-col z-10 leading-tight">
                <span className="text-xs font-semibold text-red-300">Data Issue</span>
                <span className="text-[10px] text-red-400/80">Click to re-apply</span>
              </div>
            </Link>
          ) : (
            <Link
              to="/account/profile/become-seller"
              className="relative group flex items-center gap-2.5 pl-3.5 pr-3 py-2 rounded-lg transition-all duration-300
                bg-gradient-to-r from-zinc-800 to-zinc-700/80 hover:from-yellow-400 hover:to-yellow-500
                border border-yellow-400/30 hover:border-yellow-400
                shadow-sm hover:shadow-md hover:shadow-yellow-400/20
                overflow-hidden transform hover:scale-[1.01]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0 
                translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              
              <div className="text-base text-yellow-400 group-hover:text-black transition-colors duration-200 z-10">
                <FaStore />
              </div>
              <div className="flex flex-col z-10 leading-tight">
                <span className="text-xs font-bold text-yellow-300 group-hover:text-black transition-colors duration-200">
                  Become a Seller
                </span>
                <span className="text-[10px] text-yellow-400/70 group-hover:text-black/80 transition-colors duration-200">
                  Start selling on BookBalcony
                </span>
              </div>
              <FaStar className="ml-auto text-xs text-yellow-400 group-hover:text-black opacity-60 group-hover:opacity-100 
                transition-all duration-200 z-10" />
            </Link>
          )}
        </motion.div>
      </nav>

      {/* Logout Button */}
      <motion.button
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={handleLogout}
        className="mt-3 mb-0.5 flex items-center gap-2 px-3 py-2
          bg-gradient-to-r from-red-500/90 to-red-600/90 hover:from-red-600 hover:to-red-700 
          text-white rounded-lg transition-all duration-200 w-full justify-center 
          shadow-md shadow-red-500/20 hover:shadow-red-500/40
          transform hover:scale-[1.01] active:scale-95
          border border-red-400/30 group overflow-hidden relative cursor-pointer"
      >
        <FaSignOutAlt className="text-xs z-10 group-hover:rotate-180 transition-transform duration-300" />
        <span className="text-xs font-semibold z-10">Log Out</span>
      </motion.button>

      {/* Bottom decorative line */}
      <div className="w-full h-0.5 mt-2 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent rounded-full"></div>
    </motion.div>
  );
};

export default Sidebar;