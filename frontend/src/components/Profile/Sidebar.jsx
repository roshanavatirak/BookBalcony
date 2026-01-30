// // import React from 'react';
// // import { Link, useNavigate, useLocation } from 'react-router-dom';
// // import { useDispatch } from 'react-redux';
// // import { authActions } from '../../store/auth';
// // import { FaHeart, FaHistory, FaCog, FaSignOutAlt, FaStore, FaExclamationTriangle, FaCrown, FaStar, FaUserCircle } from 'react-icons/fa';
// // import { motion } from 'framer-motion';

// // const Sidebar = ({ data, seller }) => {
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   // ✅ Enhanced debugging and validation
// //   console.group('🎨 Sidebar Component Debug');
// //   console.log('Raw data prop:', data);
// //   console.log('Raw seller prop:', seller);
// //   console.log('Data type:', typeof data);
// //   console.log('Seller type:', typeof seller);
// //   console.log('Data keys:', data ? Object.keys(data) : 'null/undefined');
// //   console.log('Seller keys:', seller ? Object.keys(seller) : 'null/undefined');
// //   console.groupEnd();

// //   const isActive = (path) => location.pathname === path;

// //   // ✅ Enhanced avatar handling with debugging
// //   const getAvatarSrc = () => {
// //     console.group('🖼️ Avatar Resolution Debug');
// //     console.log('data?.avatar:', data?.avatar);
    
// //     try {
// //       // Check if avatar exists and is valid
// //       if (!data?.avatar) {
// //         console.log('❌ No avatar found, using default');
// //         console.groupEnd();
// //         return "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?ga=GA1.1.710266921.1749747219&semt=ais_hybrid&w=740";
// //       }

// //       // Check if it's already a full URL
// //       if (data.avatar.startsWith("http://") || data.avatar.startsWith("https://")) {
// //         console.log('✅ Using full URL avatar:', data.avatar);
// //         console.groupEnd();
// //         return data.avatar;
// //       }

// //       // Construct local URL
// //       const localUrl = `http://localhost:3000/${data.avatar}`;
// //       console.log('✅ Using local avatar:', localUrl);
// //       console.groupEnd();
// //       return localUrl;
// //     } catch (error) {
// //       console.error('❌ Error in getAvatarSrc:', error);
// //       console.groupEnd();
// //       return "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?ga=GA1.1.710266921.1749747219&semt=ais_hybrid&w=740";
// //     }
// //   };

// //   const avatarSrc = getAvatarSrc();

// //   // ✅ Enhanced user data extraction
// //   const getUserInfo = () => {
// //     console.group('👤 User Info Extraction Debug');
    
// //     try {
// //       // Check if data exists
// //       if (!data) {
// //         console.warn('⚠️ No data prop provided');
// //         console.groupEnd();
// //         return {
// //           username: 'Profile',
// //           email: 'Not available',
// //           hasData: false
// //         };
// //       }

// //       // Extract username - check multiple possible locations
// //       let username = null;
// //       if (data.username) {
// //         username = data.username;
// //         console.log('✅ Username found at data.username:', username);
// //       } else if (data.data?.username) {
// //         username = data.data.username;
// //         console.log('✅ Username found at data.data.username:', username);
// //       } else if (data.name) {
// //         username = data.name;
// //         console.log('✅ Username found at data.name:', username);
// //       }

// //       // Extract email - check multiple possible locations
// //       let email = null;
// //       if (data.email) {
// //         email = data.email;
// //         console.log('✅ Email found at data.email:', email);
// //       } else if (data.data?.email) {
// //         email = data.data.email;
// //         console.log('✅ Email found at data.data.email:', email);
// //       }

// //       const userInfo = {
// //         username: username || 'Profile',
// //         email: email || 'Not available',
// //         hasData: !!(username || email),
// //         isPremium: data.isPremium || data.data?.isPremium || false,
// //         isSeller: data.isSeller || data.data?.isSeller || false
// //       };

// //       console.log('📦 Extracted user info:', userInfo);
// //       console.groupEnd();
// //       return userInfo;
// //     } catch (error) {
// //       console.error('❌ Error extracting user info:', error);
// //       console.groupEnd();
// //       return {
// //         username: 'Profile',
// //         email: 'Not available',
// //         hasData: false,
// //         error: true
// //       };
// //     }
// //   };

// //   const userInfo = getUserInfo();

// //   // ✅ Enhanced seller status detection
// //   const getSellerStatus = () => {
// //     console.group('🏪 Seller Status Detection Debug');
// //     console.log('userInfo.isSeller:', userInfo.isSeller);
// //     console.log('seller prop:', seller);
    
// //     try {
// //       // Check seller data structure - could be nested
// //       let sellerStatus = null;
      
// //       if (seller?.data?.status) {
// //         sellerStatus = seller.data.status;
// //         console.log('✅ Status found at seller.data.status:', sellerStatus);
// //       } else if (seller?.status) {
// //         sellerStatus = seller.status;
// //         console.log('✅ Status found at seller.status:', sellerStatus);
// //       }

// //       console.log('Detected seller status:', sellerStatus);

// //       // Determine status type
// //       if (sellerStatus === "Approved") {
// //         console.log('✅ User is a verified seller');
// //         console.groupEnd();
// //         return { type: 'verified', status: 'Approved', hasData: true };
// //       }
      
// //       if (sellerStatus === "Pending") {
// //         console.log('⏳ Seller application is pending');
// //         console.groupEnd();
// //         return { type: 'pending', status: 'Pending', hasData: true };
// //       }
      
// //       if (sellerStatus === "Rejected") {
// //         console.log('❌ Seller application was rejected');
// //         console.groupEnd();
// //         return { type: 'rejected', status: 'Rejected', hasData: true };
// //       }

// //       // Check for data inconsistency
// //       if (userInfo.isSeller && !seller) {
// //         console.warn('⚠️ Data inconsistency: User marked as seller but no seller data');
// //         console.groupEnd();
// //         return { type: 'inconsistent', status: 'Data Issue', hasData: false };
// //       }
      
// //       console.log('ℹ️ User is not a seller');
// //       console.groupEnd();
// //       return { type: 'normal', status: 'Not a Seller', hasData: false };
// //     } catch (error) {
// //       console.error('❌ Error in getSellerStatus:', error);
// //       console.groupEnd();
// //       return { type: 'error', status: 'Error', hasData: false, error: true };
// //     }
// //   };

// //   const sellerStatus = getSellerStatus();

// //   const handleLogout = () => {
// //     console.log('👋 Logging out from sidebar...');
// //     localStorage.clear();
// //     dispatch(authActions.logout());
// //     navigate("/signin");
// //   };

// //   // ✅ Error handler for image loading
// //   const handleImageError = (e) => {
// //     console.error('❌ Avatar image failed to load:', e.target.src);
// //     e.target.src = "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?ga=GA1.1.710266921.1749747219&semt=ais_hybrid&w=740";
// //   };

// //   return (
// //     <motion.div 
// //       initial={{ opacity: 0, x: -20 }}
// //       animate={{ opacity: 1, x: 0 }}
// //       transition={{ duration: 0.5 }}
// //       className="relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl text-white 
// //         w-full sm:w-80 md:w-72 lg:w-64 xl:w-60 
// //         h-auto sm:min-h-screen p-6 sm:p-8 
// //         flex flex-col justify-start items-center 
// //         shadow-2xl border border-zinc-700/50 backdrop-blur-sm
// //         before:absolute before:inset-0 before:rounded-3xl before:p-[1px] 
// //         before:bg-gradient-to-br before:from-yellow-400/20 before:via-transparent before:to-purple-500/20 
// //         before:-z-10 before:blur-sm"
// //     >
// //       {/* Decorative elements */}
// //       <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl"></div>
// //       <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>

// //       {/* ✅ Error Display Banner */}
// //       {(!userInfo.hasData || userInfo.error) && (
// //         <div className="w-full mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-xs">
// //           <FaExclamationTriangle className="flex-shrink-0" />
// //           <span>Profile data loading issue. Some info may be unavailable.</span>
// //         </div>
// //       )}

// //       {/* Mobile Profile */}
// //       <motion.div 
// //         initial={{ scale: 0.9, opacity: 0 }}
// //         animate={{ scale: 1, opacity: 1 }}
// //         transition={{ delay: 0.2 }}
// //         className="w-full sm:hidden mb-6 bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 rounded-2xl p-4 flex items-center gap-4 shadow-lg backdrop-blur-md border border-zinc-700/30"
// //       >
// //         <div className="relative">
// //           <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500 rounded-full blur-md opacity-50 animate-pulse"></div>
// //           <div className="relative rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500">
// //             {avatarSrc ? (
// //               <img
// //                 src={avatarSrc}
// //                 alt="User Avatar"
// //                 className="w-16 h-16 rounded-full object-cover border-2 border-zinc-900"
// //                 onError={handleImageError}
// //               />
// //             ) : (
// //               <div className="w-16 h-16 rounded-full bg-zinc-700 border-2 border-zinc-900 flex items-center justify-center">
// //                 <FaUserCircle className="text-zinc-400 text-3xl" />
// //               </div>
// //             )}
// //           </div>
// //           <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-zinc-900 animate-pulse"></div>
// //         </div>
// //         <div className="flex flex-col flex-1 min-w-0">
// //           <h2 className="text-base font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent truncate">
// //             {userInfo.username}
// //           </h2>
// //           <p className="text-xs text-zinc-400 truncate">{userInfo.email}</p>
// //           {!userInfo.hasData && (
// //             <p className="text-xs text-red-400 mt-1">⚠️ Limited data</p>
// //           )}
// //         </div>
// //       </motion.div>

// //       {/* Desktop Avatar */}
// //       <motion.div 
// //         initial={{ scale: 0.8, opacity: 0 }}
// //         animate={{ scale: 1, opacity: 1 }}
// //         transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
// //         className="hidden sm:flex flex-col items-center mt-4"
// //       >
// //         <div className="relative group">
// //           {/* Animated glow effect */}
// //           <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>
          
// //           {/* Avatar container with gradient border */}
// //           <div className="relative rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500 group-hover:scale-105 transition-transform duration-300">
// //             {avatarSrc ? (
// //               <img
// //                 src={avatarSrc}
// //                 alt="User Avatar"
// //                 className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-zinc-900"
// //                 onError={handleImageError}
// //               />
// //             ) : (
// //               <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-zinc-700 border-4 border-zinc-900 flex items-center justify-center">
// //                 <FaUserCircle className="text-zinc-400 text-5xl" />
// //               </div>
// //             )}
// //           </div>
          
// //           {/* Online status indicator */}
// //           <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-3 border-zinc-900 shadow-lg shadow-green-500/50 animate-pulse"></div>
          
// //           {/* Premium badge if applicable */}
// //           {userInfo.isPremium && (
// //             <div className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-yellow-600 w-8 h-8 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50 animate-bounce">
// //               <FaCrown className="text-white text-xs" />
// //             </div>
// //           )}
// //         </div>
        
// //         <motion.h2 
// //           initial={{ y: 10, opacity: 0 }}
// //           animate={{ y: 0, opacity: 1 }}
// //           transition={{ delay: 0.4 }}
// //           className="mt-4 text-lg md:text-xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent text-center px-2"
// //         >
// //           {userInfo.username}
// //         </motion.h2>
// //         <p className="text-sm text-zinc-400 mt-1 text-center px-2 truncate w-full max-w-full">
// //           {userInfo.email}
// //         </p>
        
// //         {/* Warning for limited data */}
// //         {!userInfo.hasData && (
// //           <div className="mt-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full">
// //             <span className="text-xs text-red-400">⚠️ Limited data</span>
// //           </div>
// //         )}
        
// //         {/* Stats or badge */}
// //         <div className="mt-3 flex gap-2">
// //           <div className="px-3 py-1 bg-zinc-800/50 rounded-full border border-zinc-700/50 backdrop-blur-sm flex items-center gap-1">
// //             <FaStar className="text-yellow-400 text-xs" />
// //             <span className="text-xs text-zinc-300">Member</span>
// //           </div>
// //         </div>
// //       </motion.div>

// //       {/* Navigation */}
// //       <nav className="mt-8 sm:mt-10 w-full flex flex-col gap-2 px-1">
// //         {[
// //           { to: "/profile", icon: <FaHeart />, label: "Favourites", gradient: "from-red-400 to-pink-400" },
// //           { to: "/profile/orderHistory", icon: <FaHistory />, label: "Order History", gradient: "from-blue-400 to-cyan-400" },
// //           { to: "/profile/settings", icon: <FaCog />, label: "Settings", gradient: "from-purple-400 to-pink-400" },
// //         ].map((item, index) => {
// //           const active = isActive(item.to);
// //           return (
// //             <motion.div
// //               key={item.to}
// //               initial={{ x: -20, opacity: 0 }}
// //               animate={{ x: 0, opacity: 1 }}
// //               transition={{ delay: 0.5 + index * 0.1 }}
// //             >
// //               <Link
// //                 to={item.to}
// //                 className={`relative group flex items-center gap-3 pl-5 pr-4 py-3.5 rounded-xl transition-all duration-300 overflow-hidden
// //                 ${active
// //                     ? "bg-gradient-to-r from-zinc-800 to-zinc-700 border-l-[5px] border-yellow-400 shadow-lg shadow-yellow-400/20"
// //                     : "hover:bg-zinc-800/50 hover:translate-x-1"
// //                   }`}
// //               >
// //                 {/* Animated background on hover */}
// //                 <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
// //                 {/* Icon with glow effect */}
// //                 <div className={`relative text-lg z-10 transition-all duration-300 
// //                   ${active 
// //                     ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" 
// //                     : "text-zinc-400 group-hover:text-yellow-300 group-hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.3)]"
// //                   }`}
// //                 >
// //                   {item.icon}
// //                 </div>
                
// //                 <span className={`text-sm font-medium z-10 transition-all duration-300 
// //                   ${active 
// //                     ? "text-white" 
// //                     : "text-zinc-300 group-hover:text-yellow-100"
// //                   }`}
// //                 >
// //                   {item.label}
// //                 </span>

// //                 {/* Active indicator line */}
// //                 {active && (
// //                   <motion.div 
// //                     layoutId="activeIndicator"
// //                     className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"
// //                   />
// //                 )}
// //               </Link>
// //             </motion.div>
// //           );
// //         })}

// //         {/* ✅ Enhanced Seller Section with Error Handling */}
// //         <motion.div
// //           initial={{ y: 20, opacity: 0 }}
// //           animate={{ y: 0, opacity: 1 }}
// //           transition={{ delay: 0.8 }}
// //           className="mt-4"
// //         >
// //           {sellerStatus.error ? (
// //             <div className="flex items-center gap-3 pl-5 pr-4 py-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
// //               <FaExclamationTriangle className="text-lg" />
// //               <div className="flex flex-col">
// //                 <span className="text-sm font-semibold">Status Error</span>
// //                 <span className="text-xs opacity-70">Unable to load seller status</span>
// //               </div>
// //             </div>
// //           ) : sellerStatus.type === 'verified' ? (
// //             <Link
// //               to="/profile/verified-seller-info"
// //               className="relative group flex items-center gap-3 pl-5 pr-4 py-4 rounded-xl transition-all duration-500 
// //                 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 
// //                 shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:shadow-xl
// //                 text-black overflow-hidden transform hover:scale-[1.02]"
// //             >
// //               {/* Animated shine effect */}
// //               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
// //               {/* Sparkle effects */}
// //               <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
// //               <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-ping animation-delay-200"></div>
              
// //               <div className="text-xl text-black group-hover:scale-110 transition-transform duration-300 z-10 drop-shadow-md">
// //                 <FaStore />
// //               </div>
// //               <div className="flex flex-col z-10">
// //                 <span className="text-sm font-bold drop-shadow-sm">Verified Seller</span>
// //                 <span className="text-xs opacity-80">Manage your store</span>
// //               </div>
// //               <FaCrown className="ml-auto text-lg opacity-80 group-hover:rotate-12 transition-transform duration-300 z-10" />
// //             </Link>
// //           ) : sellerStatus.type === 'pending' ? (
// //             <Link
// //               to="/profile/seller-application-submitted"
// //               className="relative group flex items-center gap-3 pl-5 pr-4 py-4 rounded-xl transition-all duration-300 
// //                 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 
// //                 text-orange-700 hover:text-orange-800 shadow-md hover:shadow-lg 
// //                 border border-orange-200 overflow-hidden transform hover:scale-[1.02]"
// //             >
// //               {/* Pulsing background */}
// //               <div className="absolute inset-0 bg-orange-200 opacity-0 group-hover:opacity-20 animate-pulse"></div>
              
// //               <div className="text-lg z-10 animate-pulse">
// //                 <FaStore />
// //               </div>
// //               <div className="flex flex-col z-10">
// //                 <span className="text-sm font-semibold">Under Review</span>
// //                 <span className="text-xs opacity-70">We're checking your application</span>
// //               </div>
// //             </Link>
// //           ) : sellerStatus.type === 'rejected' ? (
// //             <Link
// //               to="/profile/become-seller"
// //               className="relative group flex items-center gap-3 pl-5 pr-4 py-4 rounded-xl transition-all duration-300 
// //                 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 
// //                 text-red-700 hover:text-red-800 shadow-md hover:shadow-lg 
// //                 border border-red-200 overflow-hidden transform hover:scale-[1.02]"
// //             >
// //               <div className="absolute inset-0 bg-red-200 opacity-0 group-hover:opacity-20 animate-pulse"></div>
              
// //               <div className="text-lg z-10">
// //                 <FaExclamationTriangle />
// //               </div>
// //               <div className="flex flex-col z-10">
// //                 <span className="text-sm font-semibold">Application Rejected</span>
// //                 <span className="text-xs opacity-70">Please re-apply</span>
// //               </div>
// //             </Link>
// //           ) : sellerStatus.type === 'inconsistent' ? (
// //             <Link
// //               to="/profile/become-seller"
// //               className="relative group flex items-center gap-3 pl-5 pr-4 py-4 rounded-xl transition-all duration-300 
// //                 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 
// //                 text-red-700 hover:text-red-800 shadow-md hover:shadow-lg 
// //                 border border-red-200 overflow-hidden transform hover:scale-[1.02]"
// //             >
// //               <div className="absolute inset-0 bg-red-200 opacity-0 group-hover:opacity-20 animate-pulse"></div>
              
// //               <div className="text-lg z-10 animate-bounce">
// //                 <FaExclamationTriangle />
// //               </div>
// //               <div className="flex flex-col z-10">
// //                 <span className="text-sm font-semibold">Data Issue</span>
// //                 <span className="text-xs opacity-70">Please re-apply</span>
// //               </div>
// //             </Link>
// //           ) : (
// //             <Link
// //               to="/profile/become-seller"
// //               className="relative group flex items-center gap-3 pl-5 pr-4 py-4 rounded-xl transition-all duration-500
// //                 bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-yellow-400 hover:to-yellow-500
// //                 border border-yellow-400/30 hover:border-yellow-400
// //                 shadow-md hover:shadow-xl hover:shadow-yellow-400/20
// //                 overflow-hidden transform hover:scale-[1.02]"
// //             >
// //               {/* Animated gradient background */}
// //               <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0 
// //                 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
// //               <div className="text-lg text-yellow-400 group-hover:text-black transition-colors duration-300 z-10 
// //                 group-hover:scale-110 group-hover:rotate-12 transform">
// //                 <FaStore />
// //               </div>
// //               <div className="flex flex-col z-10">
// //                 <span className="text-sm font-semibold text-yellow-300 group-hover:text-black transition-colors duration-300">
// //                   Become a Seller
// //                 </span>
// //                 <span className="text-xs text-yellow-400/70 group-hover:text-black/70 transition-colors duration-300">
// //                   Start selling on BookBalcony
// //                 </span>
// //               </div>
// //               <FaStar className="ml-auto text-yellow-400 group-hover:text-black opacity-50 group-hover:opacity-100 
// //                 transition-all duration-300 z-10 group-hover:rotate-180 transform" />
// //             </Link>
// //           )}
// //         </motion.div>
// //       </nav>

// //       {/* Logout Button */}
// //       <motion.button
// //         initial={{ y: 20, opacity: 0 }}
// //         animate={{ y: 0, opacity: 1 }}
// //         transition={{ delay: 0.9 }}
// //         onClick={handleLogout}
// //         className="mt-8 sm:mt-auto mb-4 flex items-center gap-3 px-4 py-3 
// //           bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
// //           text-white rounded-xl transition-all duration-300 w-full justify-center 
// //           shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:shadow-xl
// //           transform hover:scale-[1.02] active:scale-95
// //           border border-red-400/30 group overflow-hidden relative"
// //       >
// //         {/* Animated background */}
// //         <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 translate-y-full 
// //           group-hover:translate-y-0 transition-transform duration-300"></div>
        
// //         <FaSignOutAlt className="z-10 group-hover:rotate-180 transition-transform duration-500" />
// //         <span className="text-sm font-semibold z-10">Log Out</span>
// //       </motion.button>

// //       {/* Bottom decorative line */}
// //       <div className="w-full h-1 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent rounded-full"></div>
// //     </motion.div>
// //   );
// // };

// // export default Sidebar;


// import React from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { authActions } from '../../store/auth';
// import { FaHeart, FaHistory, FaCog, FaSignOutAlt, FaStore, FaExclamationTriangle, FaCrown, FaStar, FaUserCircle, FaBell } from 'react-icons/fa';
// import { motion } from 'framer-motion';

// const Sidebar = ({ data, seller }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // ✅ Enhanced debugging and validation
//   console.group('🎨 Sidebar Component Debug');
//   console.log('Raw data prop:', data);
//   console.log('Raw seller prop:', seller);
//   console.log('Data type:', typeof data);
//   console.log('Seller type:', typeof seller);
//   console.log('Data keys:', data ? Object.keys(data) : 'null/undefined');
//   console.log('Seller keys:', seller ? Object.keys(seller) : 'null/undefined');
//   console.groupEnd();

//   const isActive = (path) => location.pathname === path;

//   // ✅ Enhanced avatar handling with debugging
//   const getAvatarSrc = () => {
//     console.group('🖼️ Avatar Resolution Debug');
//     console.log('data?.avatar:', data?.avatar);
    
//     try {
//       // Check if avatar exists and is valid
//       if (!data?.avatar) {
//         console.log('❌ No avatar found, using default');
//         console.groupEnd();
//         return "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?ga=GA1.1.710266921.1749747219&semt=ais_hybrid&w=740";
//       }

//       // Check if it's already a full URL
//       if (data.avatar.startsWith("http://") || data.avatar.startsWith("https://")) {
//         console.log('✅ Using full URL avatar:', data.avatar);
//         console.groupEnd();
//         return data.avatar;
//       }

//       // Construct local URL
//       const localUrl = `http://localhost:3000/${data.avatar}`;
//       console.log('✅ Using local avatar:', localUrl);
//       console.groupEnd();
//       return localUrl;
//     } catch (error) {
//       console.error('❌ Error in getAvatarSrc:', error);
//       console.groupEnd();
//       return "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?ga=GA1.1.710266921.1749747219&semt=ais_hybrid&w=740";
//     }
//   };

//   const avatarSrc = getAvatarSrc();

//   // ✅ Enhanced user data extraction
//   const getUserInfo = () => {
//     console.group('👤 User Info Extraction Debug');
    
//     try {
//       // Check if data exists
//       if (!data) {
//         console.warn('⚠️ No data prop provided');
//         console.groupEnd();
//         return {
//           username: 'Profile',
//           email: 'Not available',
//           hasData: false
//         };
//       }

//       // Extract username - check multiple possible locations
//       let username = null;
//       if (data.username) {
//         username = data.username;
//         console.log('✅ Username found at data.username:', username);
//       } else if (data.data?.username) {
//         username = data.data.username;
//         console.log('✅ Username found at data.data.username:', username);
//       } else if (data.name) {
//         username = data.name;
//         console.log('✅ Username found at data.name:', username);
//       }

//       // Extract email - check multiple possible locations
//       let email = null;
//       if (data.email) {
//         email = data.email;
//         console.log('✅ Email found at data.email:', email);
//       } else if (data.data?.email) {
//         email = data.data.email;
//         console.log('✅ Email found at data.data.email:', email);
//       }

//       const userInfo = {
//         username: username || 'Profile',
//         email: email || 'Not available',
//         hasData: !!(username || email),
//         isPremium: data.isPremium || data.data?.isPremium || false,
//         isSeller: data.isSeller || data.data?.isSeller || false
//       };

//       console.log('📦 Extracted user info:', userInfo);
//       console.groupEnd();
//       return userInfo;
//     } catch (error) {
//       console.error('❌ Error extracting user info:', error);
//       console.groupEnd();
//       return {
//         username: 'Profile',
//         email: 'Not available',
//         hasData: false,
//         error: true
//       };
//     }
//   };

//   const userInfo = getUserInfo();

//   // ✅ Enhanced seller status detection
//   const getSellerStatus = () => {
//     console.group('🏪 Seller Status Detection Debug');
//     console.log('userInfo.isSeller:', userInfo.isSeller);
//     console.log('seller prop:', seller);
    
//     try {
//       // Check seller data structure - could be nested
//       let sellerStatus = null;
      
//       if (seller?.data?.status) {
//         sellerStatus = seller.data.status;
//         console.log('✅ Status found at seller.data.status:', sellerStatus);
//       } else if (seller?.status) {
//         sellerStatus = seller.status;
//         console.log('✅ Status found at seller.status:', sellerStatus);
//       }

//       console.log('Detected seller status:', sellerStatus);

//       // Determine status type
//       if (sellerStatus === "Approved") {
//         console.log('✅ User is a verified seller');
//         console.groupEnd();
//         return { type: 'verified', status: 'Approved', hasData: true };
//       }
      
//       if (sellerStatus === "Pending") {
//         console.log('⏳ Seller application is pending');
//         console.groupEnd();
//         return { type: 'pending', status: 'Pending', hasData: true };
//       }
      
//       if (sellerStatus === "Rejected") {
//         console.log('❌ Seller application was rejected');
//         console.groupEnd();
//         return { type: 'rejected', status: 'Rejected', hasData: true };
//       }

//       // Check for data inconsistency
//       if (userInfo.isSeller && !seller) {
//         console.warn('⚠️ Data inconsistency: User marked as seller but no seller data');
//         console.groupEnd();
//         return { type: 'inconsistent', status: 'Data Issue', hasData: false };
//       }
      
//       console.log('ℹ️ User is not a seller');
//       console.groupEnd();
//       return { type: 'normal', status: 'Not a Seller', hasData: false };
//     } catch (error) {
//       console.error('❌ Error in getSellerStatus:', error);
//       console.groupEnd();
//       return { type: 'error', status: 'Error', hasData: false, error: true };
//     }
//   };

//   const sellerStatus = getSellerStatus();

//   const handleLogout = () => {
//     console.log('👋 Logging out from sidebar...');
//     localStorage.clear();
//     dispatch(authActions.logout());
//     navigate("/signin");
//   };

//   // ✅ Error handler for image loading
//   const handleImageError = (e) => {
//     console.error('❌ Avatar image failed to load:', e.target.src);
//     e.target.src = "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?ga=GA1.1.710266921.1749747219&semt=ais_hybrid&w=740";
//   };

//   return (
//     <motion.div 
//       initial={{ opacity: 0, x: -20 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ duration: 0.5 }}
//       className="relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl text-white 
//         w-full sm:w-80 md:w-72 lg:w-64 xl:w-60 
//         h-auto sm:min-h-screen p-6 sm:p-8 
//         flex flex-col justify-start items-center 
//         shadow-2xl border border-zinc-700/50 backdrop-blur-sm
//         before:absolute before:inset-0 before:rounded-3xl before:p-[1px] 
//         before:bg-gradient-to-br before:from-yellow-400/20 before:via-transparent before:to-purple-500/20 
//         before:-z-10 before:blur-sm"
//     >
//       {/* Decorative elements */}
//       <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl"></div>
//       <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>

//       {/* ✅ Error Display Banner */}
//       {(!userInfo.hasData || userInfo.error) && (
//         <div className="w-full mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-xs">
//           <FaExclamationTriangle className="flex-shrink-0" />
//           <span>Profile data loading issue. Some info may be unavailable.</span>
//         </div>
//       )}

//       {/* Mobile Profile */}
//       <motion.div 
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ delay: 0.2 }}
//         className="w-full sm:hidden mb-6 bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 rounded-2xl p-4 flex items-center gap-4 shadow-lg backdrop-blur-md border border-zinc-700/30"
//       >
//         <div className="relative">
//           <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500 rounded-full blur-md opacity-50 animate-pulse"></div>
//           <div className="relative rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500">
//             {avatarSrc ? (
//               <img
//                 src={avatarSrc}
//                 alt="User Avatar"
//                 className="w-16 h-16 rounded-full object-cover border-2 border-zinc-900"
//                 onError={handleImageError}
//               />
//             ) : (
//               <div className="w-16 h-16 rounded-full bg-zinc-700 border-2 border-zinc-900 flex items-center justify-center">
//                 <FaUserCircle className="text-zinc-400 text-3xl" />
//               </div>
//             )}
//           </div>
//           <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-zinc-900 animate-pulse"></div>
//         </div>
//         <div className="flex flex-col flex-1 min-w-0">
//           <h2 className="text-base font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent truncate">
//             {userInfo.username}
//           </h2>
//           <p className="text-xs text-zinc-400 truncate">{userInfo.email}</p>
//           {!userInfo.hasData && (
//             <p className="text-xs text-red-400 mt-1">⚠️ Limited data</p>
//           )}
//         </div>
//       </motion.div>

//       {/* Desktop Avatar */}
//       <motion.div 
//         initial={{ scale: 0.8, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
//         className="hidden sm:flex flex-col items-center mt-4"
//       >
//         <div className="relative group">
//           {/* Animated glow effect */}
//           <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>
          
//           {/* Avatar container with gradient border */}
//           <div className="relative rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500 group-hover:scale-105 transition-transform duration-300">
//             {avatarSrc ? (
//               <img
//                 src={avatarSrc}
//                 alt="User Avatar"
//                 className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-zinc-900"
//                 onError={handleImageError}
//               />
//             ) : (
//               <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-zinc-700 border-4 border-zinc-900 flex items-center justify-center">
//                 <FaUserCircle className="text-zinc-400 text-5xl" />
//               </div>
//             )}
//           </div>
          
//           {/* Online status indicator */}
//           <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-3 border-zinc-900 shadow-lg shadow-green-500/50 animate-pulse"></div>
          
//           {/* Premium badge if applicable */}
//           {userInfo.isPremium && (
//             <div className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-yellow-600 w-8 h-8 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50 animate-bounce">
//               <FaCrown className="text-white text-xs" />
//             </div>
//           )}
//         </div>
        
//         <motion.h2 
//           initial={{ y: 10, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.4 }}
//           className="mt-4 text-lg md:text-xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent text-center px-2"
//         >
//           {userInfo.username}
//         </motion.h2>
//         <p className="text-sm text-zinc-400 mt-1 text-center px-2 truncate w-full max-w-full">
//           {userInfo.email}
//         </p>
        
//         {/* Warning for limited data */}
//         {!userInfo.hasData && (
//           <div className="mt-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full">
//             <span className="text-xs text-red-400">⚠️ Limited data</span>
//           </div>
//         )}
        
//         {/* Stats or badge */}
//         <div className="mt-3 flex gap-2">
//           <div className="px-3 py-1 bg-zinc-800/50 rounded-full border border-zinc-700/50 backdrop-blur-sm flex items-center gap-1">
//             <FaStar className="text-yellow-400 text-xs" />
//             <span className="text-xs text-zinc-300">Member</span>
//           </div>
//         </div>
//       </motion.div>

//       {/* Navigation */}
//       <nav className="mt-8 sm:mt-10 w-full flex flex-col gap-2 px-1">
//         {[
//           { to: "/profile", icon: <FaHeart />, label: "Favourites", gradient: "from-red-400 to-pink-400" },
//           { to: "/profile/orderHistory", icon: <FaHistory />, label: "Order History", gradient: "from-blue-400 to-cyan-400" },
//           { to: "/profile/my-subscriptions", icon: <FaBell />, label: "My Subscriptions", gradient: "from-green-400 to-emerald-400" }, // ✅ NEW
//           { to: "/profile/settings", icon: <FaCog />, label: "Settings", gradient: "from-purple-400 to-pink-400" },
//         ].map((item, index) => {
//           const active = isActive(item.to);
//           return (
//             <motion.div
//               key={item.to}
//               initial={{ x: -20, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: 0.5 + index * 0.1 }}
//             >
//               <Link
//                 to={item.to}
//                 className={`relative group flex items-center gap-3 pl-5 pr-4 py-3.5 rounded-xl transition-all duration-300 overflow-hidden
//                 ${active
//                     ? "bg-gradient-to-r from-zinc-800 to-zinc-700 border-l-[5px] border-yellow-400 shadow-lg shadow-yellow-400/20"
//                     : "hover:bg-zinc-800/50 hover:translate-x-1"
//                   }`}
//               >
//                 {/* Animated background on hover */}
//                 <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
//                 {/* Icon with glow effect */}
//                 <div className={`relative text-lg z-10 transition-all duration-300 
//                   ${active 
//                     ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" 
//                     : "text-zinc-400 group-hover:text-yellow-300 group-hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.3)]"
//                   }`}
//                 >
//                   {item.icon}
//                 </div>
                
//                 <span className={`text-sm font-medium z-10 transition-all duration-300 
//                   ${active 
//                     ? "text-white" 
//                     : "text-zinc-300 group-hover:text-yellow-100"
//                   }`}
//                 >
//                   {item.label}
//                 </span>

//                 {/* Active indicator line */}
//                 {active && (
//                   <motion.div 
//                     layoutId="activeIndicator"
//                     className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"
//                   />
//                 )}
//               </Link>
//             </motion.div>
//           );
//         })}

//         {/* ✅ Enhanced Seller Section with Error Handling */}
//         <motion.div
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.8 }}
//           className="mt-4"
//         >
//           {sellerStatus.error ? (
//             <div className="flex items-center gap-3 pl-5 pr-4 py-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
//               <FaExclamationTriangle className="text-lg" />
//               <div className="flex flex-col">
//                 <span className="text-sm font-semibold">Status Error</span>
//                 <span className="text-xs opacity-70">Unable to load seller status</span>
//               </div>
//             </div>
//           ) : sellerStatus.type === 'verified' ? (
//             <Link
//               to="/profile/verified-seller-info"
//               className="relative group flex items-center gap-3 pl-5 pr-4 py-4 rounded-xl transition-all duration-500 
//                 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 
//                 shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:shadow-xl
//                 text-black overflow-hidden transform hover:scale-[1.02]"
//             >
//               {/* Animated shine effect */}
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
//               {/* Sparkle effects */}
//               <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
//               <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-ping animation-delay-200"></div>
              
//               <div className="text-xl text-black group-hover:scale-110 transition-transform duration-300 z-10 drop-shadow-md">
//                 <FaStore />
//               </div>
//               <div className="flex flex-col z-10">
//                 <span className="text-sm font-bold drop-shadow-sm">Verified Seller</span>
//                 <span className="text-xs opacity-80">Manage your store</span>
//               </div>
//               <FaCrown className="ml-auto text-lg opacity-80 group-hover:rotate-12 transition-transform duration-300 z-10" />
//             </Link>
//           ) : sellerStatus.type === 'pending' ? (
//             <Link
//               to="/profile/seller-application-submitted"
//               className="relative group flex items-center gap-3 pl-5 pr-4 py-4 rounded-xl transition-all duration-300 
//                 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 
//                 text-orange-700 hover:text-orange-800 shadow-md hover:shadow-lg 
//                 border border-orange-200 overflow-hidden transform hover:scale-[1.02]"
//             >
//               {/* Pulsing background */}
//               <div className="absolute inset-0 bg-orange-200 opacity-0 group-hover:opacity-20 animate-pulse"></div>
              
//               <div className="text-lg z-10 animate-pulse">
//                 <FaStore />
//               </div>
//               <div className="flex flex-col z-10">
//                 <span className="text-sm font-semibold">Under Review</span>
//                 <span className="text-xs opacity-70">We're checking your application</span>
//               </div>
//             </Link>
//           ) : sellerStatus.type === 'rejected' ? (
//             <Link
//               to="/profile/become-seller"
//               className="relative group flex items-center gap-3 pl-5 pr-4 py-4 rounded-xl transition-all duration-300 
//                 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 
//                 text-red-700 hover:text-red-800 shadow-md hover:shadow-lg 
//                 border border-red-200 overflow-hidden transform hover:scale-[1.02]"
//             >
//               <div className="absolute inset-0 bg-red-200 opacity-0 group-hover:opacity-20 animate-pulse"></div>
              
//               <div className="text-lg z-10">
//                 <FaExclamationTriangle />
//               </div>
//               <div className="flex flex-col z-10">
//                 <span className="text-sm font-semibold">Application Rejected</span>
//                 <span className="text-xs opacity-70">Please re-apply</span>
//               </div>
//             </Link>
//           ) : sellerStatus.type === 'inconsistent' ? (
//             <Link
//               to="/profile/become-seller"
//               className="relative group flex items-center gap-3 pl-5 pr-4 py-4 rounded-xl transition-all duration-300 
//                 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 
//                 text-red-700 hover:text-red-800 shadow-md hover:shadow-lg 
//                 border border-red-200 overflow-hidden transform hover:scale-[1.02]"
//             >
//               <div className="absolute inset-0 bg-red-200 opacity-0 group-hover:opacity-20 animate-pulse"></div>
              
//               <div className="text-lg z-10 animate-bounce">
//                 <FaExclamationTriangle />
//               </div>
//               <div className="flex flex-col z-10">
//                 <span className="text-sm font-semibold">Data Issue</span>
//                 <span className="text-xs opacity-70">Please re-apply</span>
//               </div>
//             </Link>
//           ) : (
//             <Link
//               to="/profile/become-seller"
//               className="relative group flex items-center gap-3 pl-5 pr-4 py-4 rounded-xl transition-all duration-500
//                 bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-yellow-400 hover:to-yellow-500
//                 border border-yellow-400/30 hover:border-yellow-400
//                 shadow-md hover:shadow-xl hover:shadow-yellow-400/20
//                 overflow-hidden transform hover:scale-[1.02]"
//             >
//               {/* Animated gradient background */}
//               <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0 
//                 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              
//               <div className="text-lg text-yellow-400 group-hover:text-black transition-colors duration-300 z-10 
//                 group-hover:scale-110 group-hover:rotate-12 transform">
//                 <FaStore />
//               </div>
//               <div className="flex flex-col z-10">
//                 <span className="text-sm font-semibold text-yellow-300 group-hover:text-black transition-colors duration-300">
//                   Become a Seller
//                 </span>
//                 <span className="text-xs text-yellow-400/70 group-hover:text-black/70 transition-colors duration-300">
//                   Start selling on BookBalcony
//                 </span>
//               </div>
//               <FaStar className="ml-auto text-yellow-400 group-hover:text-black opacity-50 group-hover:opacity-100 
//                 transition-all duration-300 z-10 group-hover:rotate-180 transform" />
//             </Link>
//           )}
//         </motion.div>
//       </nav>

//       {/* Logout Button */}
//       <motion.button
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.9 }}
//         onClick={handleLogout}
//         className="mt-8 sm:mt-auto mb-4 flex items-center gap-3 px-4 py-3
//           bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
//           text-white rounded-xl transition-all duration-300 w-full justify-center 
//           shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:shadow-xl
//           transform hover:scale-[1.02] active:scale-95
//           border border-red-400/30 group overflow-hidden relative"
//       >
//         {/* Animated background */}
//         <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 translate-y-full 
//           group-hover:translate-y-0 transition-transform duration-300"></div>
        
//         <FaSignOutAlt className="z-10 group-hover:rotate-180 transition-transform duration-500" />
//         <span className="text-sm font-semibold z-10">Log Out</span>
//       </motion.button>

//       {/* Bottom decorative line */}
//       <div className="w-full h-1 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent rounded-full"></div>
//     </motion.div>
//   );
// };

// export default Sidebar;

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/auth';
import { FaHeart, FaHistory, FaCog, FaSignOutAlt, FaStore, FaExclamationTriangle, FaCrown, FaStar, FaUserCircle, FaBell } from 'react-icons/fa';
import { motion } from 'framer-motion';

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

  const isActive = (path) => location.pathname === path;

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
      const localUrl = `http://localhost:3000/${data.avatar}`;
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
    console.group('👤 User Info Extraction Debug');
    
    try {
      // Check if data exists
      if (!data) {
        console.warn('⚠️ No data prop provided');
        console.groupEnd();
        return {
          username: 'Profile',
          email: 'Not available',
          hasData: false
        };
      }

      // Extract username - check multiple possible locations
      let username = null;
      if (data.username) {
        username = data.username;
        console.log('✅ Username found at data.username:', username);
      } else if (data.data?.username) {
        username = data.data.username;
        console.log('✅ Username found at data.data.username:', username);
      } else if (data.name) {
        username = data.name;
        console.log('✅ Username found at data.name:', username);
      }

      // Extract email - check multiple possible locations
      let email = null;
      if (data.email) {
        email = data.email;
        console.log('✅ Email found at data.email:', email);
      } else if (data.data?.email) {
        email = data.data.email;
        console.log('✅ Email found at data.data.email:', email);
      }

      const userInfo = {
        username: username || 'Profile',
        email: email || 'Not available',
        hasData: !!(username || email),
        isPremium: data.isPremium || data.data?.isPremium || false,
        isSeller: data.isSeller || data.data?.isSeller || false
      };

      console.log('📦 Extracted user info:', userInfo);
      console.groupEnd();
      return userInfo;
    } catch (error) {
      console.error('❌ Error extracting user info:', error);
      console.groupEnd();
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
    navigate("/signin");
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

      {/* ✅ Error Display Banner */}
      {(!userInfo.hasData || userInfo.error) && (
        <div className="w-full mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-xs">
          <FaExclamationTriangle className="flex-shrink-0" />
          <span>Profile data loading issue. Some info may be unavailable.</span>
        </div>
      )}

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
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="User Avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-zinc-900"
                onError={handleImageError}
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-zinc-700 border-2 border-zinc-900 flex items-center justify-center">
                <FaUserCircle className="text-zinc-400 text-3xl" />
              </div>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-zinc-900 animate-pulse"></div>
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <h2 className="text-base font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent truncate">
            {userInfo.username}
          </h2>
          <p className="text-xs text-zinc-400 truncate">{userInfo.email}</p>
          {!userInfo.hasData && (
            <p className="text-xs text-red-400 mt-1">⚠️ Limited data</p>
          )}
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
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="User Avatar"
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-zinc-900"
                onError={handleImageError}
              />
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-zinc-700 border-4 border-zinc-900 flex items-center justify-center">
                <FaUserCircle className="text-zinc-400 text-5xl" />
              </div>
            )}
          </div>
          
          {/* Online status indicator */}
          <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-3 border-zinc-900 shadow-lg shadow-green-500/50 animate-pulse"></div>
          
          {/* Premium badge if applicable */}
          {userInfo.isPremium && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-yellow-600 w-8 h-8 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50 animate-bounce">
              <FaCrown className="text-white text-xs" />
            </div>
          )}
        </div>
        
        <motion.h2 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-lg md:text-xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent text-center px-2"
        >
          {userInfo.username}
        </motion.h2>
        <p className="text-sm text-zinc-400 mt-1 text-center px-2 truncate w-full max-w-full">
          {userInfo.email}
        </p>
        
        {/* Warning for limited data */}
        {!userInfo.hasData && (
          <div className="mt-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full">
            <span className="text-xs text-red-400">⚠️ Limited data</span>
          </div>
        )}
        
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
          { to: "/profile/my-subscriptions", icon: <FaBell />, label: "My Subscriptions", gradient: "from-green-400 to-emerald-400" },
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

        {/* ✅ Enhanced Seller Section with Error Handling */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-4"
        >
          {sellerStatus.error ? (
            <div className="flex items-center gap-3 pl-5 pr-4 py-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              <FaExclamationTriangle className="text-lg" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Status Error</span>
                <span className="text-xs opacity-70">Unable to load seller status</span>
              </div>
            </div>
          ) : sellerStatus.type === 'verified' ? (
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
          ) : sellerStatus.type === 'rejected' ? (
            <Link
              to="/profile/become-seller"
              className="relative group flex items-center gap-3 pl-5 pr-4 py-4 rounded-xl transition-all duration-300 
                bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 
                text-red-700 hover:text-red-800 shadow-md hover:shadow-lg 
                border border-red-200 overflow-hidden transform hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-red-200 opacity-0 group-hover:opacity-20 animate-pulse"></div>
              
              <div className="text-lg z-10">
                <FaExclamationTriangle />
              </div>
              <div className="flex flex-col z-10">
                <span className="text-sm font-semibold">Application Rejected</span>
                <span className="text-xs opacity-70">Please re-apply</span>
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

      {/* ✅ Spacer for proper spacing between seller section and logout */}
      <div className="flex-grow min-h-[24px] mt-6"></div>

      {/* Logout Button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        onClick={handleLogout}
        className="mt-6 mb-4 flex items-center gap-3 px-4 py-3
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