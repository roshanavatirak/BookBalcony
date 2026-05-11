import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../../store/auth';
import axios from 'axios';

// Icons
import {
  FaHome,
  FaInfoCircle,
  FaPlus,
  FaBoxOpen,
  FaUser,
  FaShoppingCart,
  FaTimes,
  FaBars,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaStore,
  FaHeart,
  FaHistory,
  FaExclamationTriangle,
  FaBriefcase,
} from 'react-icons/fa';

// ✅ NOW ACCEPTS SELLER AS PROP - SAME AS SIDEBAR
function Navbar({ seller }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [isSellerApproved, setIsSellerApproved] = useState(false);
  const [sellerMode, setSellerMode] = useState(localStorage.getItem('sellerMode') === 'true');
  const [userProfile, setUserProfile] = useState(null);
  const [sellerInfo, setSellerInfo] = useState(seller || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sellerFetchError, setSellerFetchError] = useState(null);

  const location = useLocation();
  const currentPath = location.pathname;
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Ref to track polling interval
  const pollingIntervalRef = useRef(null);
  const lastFetchTimeRef = useRef(0);

  // Default avatar fallback
  const getAvatarSrc = (avatar) => {
    if (!avatar) {
      return "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?ga=GA1.1.710266921.1749747219&semt=ais_hybrid&w=740";
    }
    return avatar.startsWith("http") ? avatar : `http://localhost:3000/${avatar}`;
  };

  // ✅ Enhanced data extraction with debugging
  const extractUserData = (apiResponse) => {
    console.group('🔍 User Data Extraction Debug (Navbar)');
    console.log('Full API Response:', apiResponse);

    try {
      let userData = null;

      if (apiResponse?.data?.data) {
        console.log('✅ Found data at: apiResponse.data.data');
        userData = apiResponse.data.data;
      }
      else if (apiResponse?.data && (apiResponse.data.username || apiResponse.data.email)) {
        console.log('✅ Found data at: apiResponse.data');
        userData = apiResponse.data;
      }
      else if (apiResponse?.username || apiResponse?.email) {
        console.log('✅ Found data at: apiResponse (root)');
        userData = apiResponse;
      }

      console.log('Extracted userData:', userData);
      
      if (!userData) {
        console.error('❌ No user data found in any expected location');
        console.groupEnd();
        return null;
      }

      if (!userData.username && !userData.email) {
        console.error('❌ User data missing required fields (username/email)');
        console.groupEnd();
        return null;
      }

      console.log('✅ Successfully extracted user data:', {
        username: userData.username,
        email: userData.email,
        isSeller: userData.isSeller,
        sellerApplicationStatus: userData.sellerApplicationStatus,
        hasAvatar: !!userData.avatar
      });
      console.groupEnd();

      return userData;
    } catch (err) {
      console.error('❌ Error extracting user data:', err);
      console.groupEnd();
      return null;
    }
  };

  // ✅ Update sellerInfo when seller prop changes
  useEffect(() => {
    console.log('🔄 Seller prop changed:', seller);
    setSellerInfo(seller || null);
  }, [seller]);

  // ✅ AUTOMATIC TOGGLE BASED ON ROUTE
  useEffect(() => {
    if (!isLoggedIn || !isSellerApproved) return;

    const isSellerRoute = currentPath.startsWith('/seller/');
    const isUserRoute = !isSellerRoute;

    console.log('📍 Route changed:', currentPath);
    console.log('🔍 Is seller route?', isSellerRoute);
    console.log('🏪 Current seller mode:', sellerMode);

    // Auto-switch to seller mode if on seller route
    if (isSellerRoute && !sellerMode) {
      console.log('🔄 Auto-switching to SELLER mode (on seller route)');
      setSellerMode(true);
      localStorage.setItem('sellerMode', 'true');
    }
    // Auto-switch to user mode if on user route
    else if (isUserRoute && sellerMode && !currentPath.includes('/profile')) {
      console.log('🔄 Auto-switching to USER mode (on user route)');
      setSellerMode(false);
      localStorage.setItem('sellerMode', 'false');
    }
  }, [currentPath, isSellerApproved, isLoggedIn, sellerMode]);

  // ✅ FETCH USER DATA WITH REAL-TIME UPDATES
  const fetchUserData = useCallback(async (isPolling = false) => {
    // Prevent too frequent polling (minimum 2 seconds between requests)
    const now = Date.now();
    if (isPolling && now - lastFetchTimeRef.current < 2000) {
      return;
    }
    lastFetchTimeRef.current = now;

    if (!isPolling) {
      console.log('🚀 Starting fetchUserData (Navbar)...');
    }
    
    if (!isLoggedIn) {
      if (!isPolling) console.log('❌ User not logged in, skipping fetch');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    
    if (!isPolling) {
      console.log('Token exists:', !!token);
      console.log('User ID:', id);
    }

    if (!token || !id) {
      console.error('❌ Missing token or ID');
      setError('Authentication data missing. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setSellerFetchError(null);
      
      if (!isPolling) console.log('📡 Fetching user profile...');
      
      // Fetch user profile
      const userRes = await axios.get(`http://localhost:3000/api/v1/get-user-information`, {
        headers: { 
          authorization: `Bearer ${token}`,
          id: id 
        },
      });
      
      if (!isPolling) console.log('📥 User API Response received:', userRes.status);
      
      const userData = extractUserData(userRes.data);
      
      if (!userData) {
        throw new Error('Failed to extract user data from API response');
      }

      // ✅ Check if data actually changed before updating state
      const hasChanged = JSON.stringify(userProfile) !== JSON.stringify(userData);
      
      if (hasChanged || !userProfile) {
        setUserProfile(userData);
        if (!isPolling) console.log('✅ User profile updated');
      }

      // ✅ Use sellerApplicationStatus to determine seller approval
      const applicationStatus = userData.sellerApplicationStatus;
      const userIsSeller = userData.isSeller === true || userData.isSeller === 'true';
      
      if (!isPolling) {
        console.log('📋 Application Status:', applicationStatus);
        console.log('🏪 User isSeller flag:', userIsSeller);
      }

      // ✅ Check if seller is approved based on application status
      const newIsSellerApproved = applicationStatus === 'Accepted' && userIsSeller;
      
      if (newIsSellerApproved !== isSellerApproved) {
        console.log(`🔄 Seller approval status changed: ${isSellerApproved} → ${newIsSellerApproved}`);
        setIsSellerApproved(newIsSellerApproved);
        
        if (newIsSellerApproved) {
          const savedMode = localStorage.getItem('sellerMode') === 'true';
          setSellerMode(savedMode);
          console.log('🔄 Seller mode set to:', savedMode);
        } else {
          setSellerMode(false);
          localStorage.removeItem('sellerMode');
        }
      }

    } catch (err) {
      if (!isPolling) console.error('❌ Error in fetchUserData:', err);
      
      if (err.response) {
        const status = err.response.status;
        
        if (!isPolling) {
          console.error('HTTP Error Status:', status);
          console.error('Error Response:', err.response.data);
        }

        if (status === 401 || status === 403) {
          setError('Session expired. Please log in again.');
          setTimeout(() => handleLogout(), 2000);
        } else if (status === 404) {
          setError('User not found. Please log in again.');
          setTimeout(() => handleLogout(), 2000);
        } else if (status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(`Error: ${err.response.data?.message || 'Unable to load profile'}`);
        }
      } else if (err.request) {
        if (!isPolling) console.error('❌ No response from server');
        setError('Cannot connect to server. Please check your connection.');
      } else {
        if (!isPolling) console.error('❌ Error:', err.message);
        setError(err.message || 'Unable to load profile data');
      }
    } finally {
      if (!isPolling) {
        setLoading(false);
        console.log('✅ fetchUserData completed (Navbar)');
      }
    }
  }, [isLoggedIn, userProfile, isSellerApproved]);

  // ✅ INITIAL FETCH
  useEffect(() => {
    fetchUserData(false);
  }, [isLoggedIn]);

  // ✅ REAL-TIME POLLING FOR STATUS UPDATES
  useEffect(() => {
    if (!isLoggedIn) {
      // Clear polling if user logs out
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    // Start polling every 5 seconds for status updates
    pollingIntervalRef.current = setInterval(() => {
      fetchUserData(true);
    }, 5000);

    console.log('🔄 Started real-time polling for seller status updates');

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
        console.log('🛑 Stopped real-time polling');
      }
    };
  }, [isLoggedIn, fetchUserData]);

  // ✅ CUSTOM EVENT LISTENER FOR MANUAL STATUS REFRESH
  useEffect(() => {
    const handleSellerStatusUpdate = () => {
      console.log('🔔 Manual seller status update triggered');
      fetchUserData(false);
    };

    window.addEventListener('sellerStatusUpdated', handleSellerStatusUpdate);

    return () => {
      window.removeEventListener('sellerStatusUpdated', handleSellerStatusUpdate);
    };
  }, [fetchUserData]);

  // Debug: Log state changes
  useEffect(() => {
    console.log('👤 UserProfile state updated (Navbar):', userProfile);
  }, [userProfile]);

  useEffect(() => {
    console.log('🏪 SellerInfo state updated (Navbar):', sellerInfo);
  }, [sellerInfo]);

  useEffect(() => {
    if (error) {
      console.error('❌ Error state updated (Navbar):', error);
    }
  }, [error]);

  useEffect(() => {
    if (sellerFetchError) {
      console.error('⚠️ Seller fetch error (Navbar):', sellerFetchError);
    }
  }, [sellerFetchError]);

  const handleToggleMode = () => {
    if (!isSellerApproved) {
      console.warn('⚠️ Cannot toggle to seller mode - not approved');
      return;
    }
    
    const updated = !sellerMode;
    console.log('🔄 Toggling seller mode to:', updated);
    setSellerMode(updated);
    localStorage.setItem('sellerMode', updated.toString());
    navigate(updated ? '/seller/dashboard' : '/');
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
    setProfileDropdown(false);
  };

  const handleLogout = () => {
    console.log('👋 Logging out...');
    
    // Clear polling
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    
    // ✅ Clear all localStorage data
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    localStorage.removeItem('sellerMode');
    
    // ✅ CRITICAL: Dispatch logout event to notify Footer and other components
    const logoutEvent = new CustomEvent('userLoggedOut');
    window.dispatchEvent(logoutEvent);
    console.log('📢 Navbar: Dispatched userLoggedOut event to sync with Footer');
    
    // Clear component state
    setUserProfile(null);
    setSellerInfo(null);
    setIsSellerApproved(false);
    setSellerMode(false);
    setError(null);
    setSellerFetchError(null);
    setLoading(false);
    
    // Update Redux
    dispatch(authActions.logout());
    
    // Navigate to login
    navigate('/signin', { replace: true });
  };

  // ✅ UPDATED: Use sellerApplicationStatus from user profile
  const getSellerStatus = () => {
    console.group('🏪 Seller Status Detection Debug (Navbar)');
    console.log('userProfile:', userProfile);
    console.log('sellerInfo:', sellerInfo);
    console.log('sellerFetchError:', sellerFetchError);
    
    try {
      // ✅ PRIORITY 1: Check user's sellerApplicationStatus field
      const applicationStatus = userProfile?.sellerApplicationStatus;
      const isSeller = userProfile?.isSeller === true || userProfile?.isSeller === 'true';
      
      console.log('📋 Application Status:', applicationStatus);
      console.log('🏪 isSeller:', isSeller);

      // ✅ If user hasn't applied yet or status is Available
      if (!applicationStatus || applicationStatus === "Available") {
        console.log('🆕 User can apply to become a seller (Available)');
        console.groupEnd();
        return { 
          type: 'not_seller', 
          status: 'Not a Seller',
          applicationStatus: 'Available',
          hasData: false 
        };
      }

      // ✅ If user application is Accepted and is marked as seller
      if (applicationStatus === "Accepted") {
        if (isSeller) {
          console.log('✅ User is a verified seller (Accepted + isSeller)');
          console.groupEnd();
          return { 
            type: 'verified', 
            status: 'Approved',
            applicationStatus: 'Accepted',
            hasData: true 
          };
        } else {
          // Data inconsistency: Accepted but not marked as seller
          console.warn('⚠️ DATA INCONSISTENCY: Accepted but isSeller is false');
          console.groupEnd();
          return { 
            type: 'inconsistent', 
            status: 'Data Issue',
            applicationStatus: 'Accepted',
            errorMessage: 'Application accepted but account not configured as seller. Contact support.',
            hasData: false 
          };
        }
      }

      // ✅ If user application is Applied (waiting for review)
      if (applicationStatus === "Applied") {
        console.log('⏳ User application is under review (Applied)');
        console.groupEnd();
        return { 
          type: 'pending', 
          status: 'Pending',
          applicationStatus: 'Applied',
          hasData: !!sellerInfo 
        };
      }

      // ✅ If user application was Rejected
      if (applicationStatus === "Rejected") {
        console.log('❌ User application was rejected (can reapply)');
        console.groupEnd();
        return { 
          type: 'rejected', 
          status: 'Rejected',
          applicationStatus: 'Rejected',
          hasData: !!sellerInfo 
        };
      }

      // ✅ Fallback: Check seller record if application status is unclear
      let sellerStatus = null;
      if (sellerInfo?.data?.status) {
        sellerStatus = sellerInfo.data.status;
      } else if (sellerInfo?.status) {
        sellerStatus = sellerInfo.status;
      }

      if (sellerStatus) {
        console.log('📊 Using seller record status as fallback:', sellerStatus);
        
        if (sellerStatus === "Approved") {
          console.groupEnd();
          return { 
            type: 'verified', 
            status: 'Approved',
            applicationStatus: applicationStatus,
            hasData: true 
          };
        }
        
        if (sellerStatus === "Pending") {
          console.groupEnd();
          return { 
            type: 'pending', 
            status: 'Pending',
            applicationStatus: applicationStatus,
            hasData: true 
          };
        }
        
        if (sellerStatus === "Rejected") {
          console.groupEnd();
          return { 
            type: 'rejected', 
            status: 'Rejected',
            applicationStatus: applicationStatus,
            hasData: true 
          };
        }
      }

      // ✅ Check for data inconsistencies
      if (isSeller && !sellerInfo && applicationStatus !== "Accepted") {
        console.warn('⚠️ Data inconsistency: isSeller=true but no seller record or accepted status');
        console.groupEnd();
        return { 
          type: 'inconsistent', 
          status: 'Data Issue',
          applicationStatus: applicationStatus,
          errorMessage: sellerFetchError || 'Your seller data is inconsistent. Contact support.',
          hasData: false 
        };
      }
      
      // Default: User is not a seller
      console.log('ℹ️ User is not a seller (default)');
      console.groupEnd();
      return { 
        type: 'not_seller', 
        status: 'Not a Seller',
        applicationStatus: applicationStatus || 'Available',
        hasData: false 
      };
    } catch (error) {
      console.error('❌ Error in getSellerStatus:', error);
      console.groupEnd();
      return { 
        type: 'error', 
        status: 'Error',
        applicationStatus: 'Unknown',
        errorMessage: 'Failed to determine seller status',
        hasData: false, 
        error: true 
      };
    }
  };

  // Navigation links logic
  let links = [];
  if (isLoggedIn && sellerMode && isSellerApproved) {
    links = [
      { title: 'Dashboard', link: '/seller/dashboard', icon: <FaHome /> },
      { title: 'Add Product', link: '/seller/add-product', icon: <FaPlus /> },
      { title: 'My Products', link: '/seller/myproducts', icon: <FaBoxOpen /> },
      { title: 'Orders', link: '/seller/orders', icon: <FaShoppingCart /> },
      { title: 'Wallet', link: '/seller/mywallet', icon: <FaShoppingCart /> },
    ];
  } else {
    links = [
      { title: 'Home', link: '/', icon: <FaHome /> },
      { title: 'About Us', link: '/about-us', icon: <FaInfoCircle /> },
      { title: 'All Books', link: '/all-books', icon: <FaBoxOpen /> },
      { title: 'Services', link: '/services', icon: <FaBriefcase /> }
    ];
    if (isLoggedIn) {
      links.push({ title: 'Cart', link: '/cart', icon: <FaShoppingCart /> });
    }
  }

  const sellerUIStatus = getSellerStatus();

  return (
    <>
      <nav className="w-full bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 backdrop-blur-sm text-white px-4 sm:px-8 py-4 shadow-2xl border-b border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            to={sellerMode && isSellerApproved ? '/seller/dashboard' : '/'}
            className="flex items-center gap-3 group transition-all duration-300 hover:scale-105"
            onClick={handleLinkClick}
          >
            <div className="relative">
              <img 
                className="h-10 sm:h-12 w-10 sm:w-12 rounded-xl shadow-lg group-hover:shadow-yellow-400/20 transition-all duration-300" 
                src={logo} 
                alt="logo" 
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/0 to-yellow-400/0 group-hover:from-yellow-400/20 group-hover:to-orange-400/20 transition-all duration-300"></div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-white select-none group-hover:text-yellow-400 transition-colors duration-300">
                BookBalcony
              </h1>
              <div className="h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          </Link>

          {/* Center - Seller Toggle */}
          {isLoggedIn && isSellerApproved && (
            <div className="hidden md:block">
              <div className="relative">
                <div
                  className={`flex items-center cursor-pointer w-36 h-12 rounded-full p-1 transition-all duration-500 ease-in-out transform hover:scale-105 ${
                    sellerMode 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg shadow-yellow-400/30' 
                      : 'bg-gradient-to-r from-gray-700 to-gray-600 shadow-lg'
                  }`}
                  onClick={handleToggleMode}
                >
                  <div
                    className={`w-1/2 h-full flex items-center justify-center text-sm font-semibold rounded-full transition-all duration-500 transform ${
                      !sellerMode 
                        ? 'bg-white text-gray-800 shadow-lg translate-x-0 scale-105' 
                        : 'text-white/80 translate-x-0'
                    }`}
                  >
                    <FaUser className="mr-1 text-xs" />
                    User
                  </div>
                  <div
                    className={`w-1/2 h-full flex items-center justify-center text-sm font-semibold rounded-full transition-all duration-500 transform ${
                      sellerMode 
                        ? 'bg-white text-gray-800 shadow-lg translate-x-0 scale-105' 
                        : 'text-white/80 translate-x-0'
                    }`}
                  >
                    <FaStore className="mr-1 text-xs" />
                    Seller
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right Side - Navigation & Profile */}
          <div className="flex items-center gap-6">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
              {links.map((item, i) => {
                const isActive = currentPath === item.link;
                return (
                  <div className="group relative" key={i}>
                    <Link
                      to={item.link}
                      onClick={handleLinkClick}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                        isActive 
                          ? 'text-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20' 
                          : 'text-gray-300 hover:text-yellow-400 hover:bg-white/5'
                      }`}
                    >
                      <span className={`text-lg transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.title}</span>
                    </Link>
                    <div
                      className={`absolute left-1/2 -bottom-1 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-300 transform -translate-x-1/2 ${
                        isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-3/4 group-hover:opacity-100'
                      }`}
                    ></div>
                  </div>
                );
              })}
            </div>

            {/* Profile Section */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center gap-3 p-2 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:scale-105 group"
                  disabled={loading}
                >
                  <div className="relative">
                    {loading ? (
                      <div className="w-10 h-10 rounded-full bg-gray-600 animate-pulse flex items-center justify-center">
                        <FaUserCircle className="text-gray-400" />
                      </div>
                    ) : error ? (
                      <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center" title={error}>
                        <FaExclamationTriangle className="text-white text-sm" />
                      </div>
                    ) : (
                      <img
                        src={getAvatarSrc(userProfile?.avatar)}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-yellow-400/50 group-hover:border-yellow-400 transition-all duration-300 object-cover"
                        onError={(e) => {
                          console.error('❌ Avatar failed to load');
                          e.target.src = getAvatarSrc(null);
                        }}
                      />
                    )}
                    {!loading && !error && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg"></div>
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-white group-hover:text-yellow-400 transition-colors duration-300">
                      {loading ? 'Loading...' : error ? 'Profile Error' : (userProfile?.username || 'User')}
                    </p>
                    <p className="text-xs text-gray-400">
                      {sellerMode && isSellerApproved ? 'Seller Mode' : 'Customer'}
                    </p>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {profileDropdown && !loading && (
                  <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/20 py-2 transform transition-all duration-300 animate-in slide-in-from-top-2">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-200/20">
                      <div className="flex items-center gap-3">
                        <img
                          src={getAvatarSrc(userProfile?.avatar)}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = getAvatarSrc(null);
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {userProfile?.username || 'User'}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {userProfile?.email || 'No email available'}
                          </p>
                          {userProfile?.phone && (
                            <p className="text-xs text-gray-500 truncate">
                              {userProfile.phone}
                            </p>
                          )}
                          {sellerUIStatus.type === 'verified' && (
                            <div className="flex items-center gap-1 mt-1">
                              <FaStore className="text-xs text-yellow-600" />
                              <span className="text-xs text-yellow-600 font-medium">Verified Seller</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Error Display in Dropdown */}
                    {(error || sellerFetchError) && (
                      <div className="px-4 py-2 bg-red-50 border-l-4 border-red-400 m-2 rounded">
                        <p className="text-xs text-red-700">{error || sellerFetchError}</p>
                      </div>
                    )}

                    {/* Navigation Links */}
                    <div className="py-2">
                      <Link
                        to={sellerMode ? '/seller/profile' : '/profile'}
                        onClick={handleLinkClick}
                        className="flex items-center gap-3 px-4 py-2 text-gray-800 hover:bg-yellow-400/10 hover:text-yellow-600 transition-all duration-200"
                      >
                        <FaUser className="text-sm" />
                        <span className="text-sm">Profile</span>
                      </Link>
                      
                      {!sellerMode && (
                        <>
                          <Link
                            to="/profile"
                            onClick={handleLinkClick}
                            className="flex items-center gap-3 px-4 py-2 text-gray-800 hover:bg-yellow-400/10 hover:text-yellow-600 transition-all duration-200"
                          >
                            <FaHeart className="text-sm" />
                            <span className="text-sm">Favourites</span>
                          </Link>
                          <Link
                            to="/profile/orderHistory"
                            onClick={handleLinkClick}
                            className="flex items-center gap-3 px-4 py-2 text-gray-800 hover:bg-yellow-400/10 hover:text-yellow-600 transition-all duration-200"
                          >
                            <FaHistory className="text-sm" />
                            <span className="text-sm">Order History</span>
                          </Link>
                           <Link
                        to="/profile/settings"
                        onClick={handleLinkClick}
                        className="flex items-center gap-3 px-4 py-2 text-gray-800 hover:bg-yellow-400/10 hover:text-yellow-600 transition-all duration-200"
                      >
                        <FaCog className="text-sm" />
                        <span className="text-sm">Settings</span>
                      </Link>
                        </>
                      )}

                      {/* ✅ UPDATED: Show status based on sellerApplicationStatus */}
                      {sellerUIStatus.error || sellerUIStatus.type === 'error' ? (
                        <div className="px-4 py-2 text-red-700 bg-red-50">
                          <div className="flex items-center gap-2">
                            <FaExclamationTriangle className="text-sm" />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">Status Error</span>
                              <span className="text-xs opacity-70">{sellerUIStatus.errorMessage || 'Unable to load seller status'}</span>
                            </div>
                          </div>
                        </div>
                      ) : sellerUIStatus.type === 'verified' ? (
                        <Link
                          to="/profile/verified-seller-info"
                          onClick={handleLinkClick}
                          className="flex items-center gap-3 px-4 py-2 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 transition-all duration-200"
                        >
                          <FaStore className="text-sm" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">You're a Verified Seller</span>
                            
                          </div>
                        </Link>
                      ) : sellerUIStatus.type === 'pending' ? (
                        <Link
                          to="/profile/seller-application-submitted"
                          onClick={handleLinkClick}
                          className="flex items-center gap-3 px-4 py-2 text-orange-700 bg-orange-50 hover:bg-orange-100 transition-all duration-200"
                        >
                          <FaStore className="text-sm" />
                          <div className="flex flex-col">
                            <span className="text-sm">Application Under Review</span>
                            
                          </div>
                        </Link>
                      ) : sellerUIStatus.type === 'rejected' ? (
                        <Link
                          to="/profile/become-seller"
                          onClick={handleLinkClick}
                          className="flex items-center gap-3 px-4 py-2 text-red-700 bg-red-50 hover:bg-red-100 transition-all duration-200"
                        >
                          <FaExclamationTriangle className="text-sm" />
                          <div className="flex flex-col">
                            <span className="text-sm">Application Rejected - Re-apply</span>
                            
                          </div>
                        </Link>
                      ) : sellerUIStatus.type === 'inconsistent' ? (
                        <Link
                          to="/profile/become-seller"
                          onClick={handleLinkClick}
                          className="flex items-center gap-3 px-4 py-2 text-red-700 bg-red-50 hover:bg-red-100 transition-all duration-200"
                          title={sellerUIStatus.errorMessage}
                        >
                          <FaExclamationTriangle className="text-sm" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">Seller Data Issue</span>
                            <span className="text-xs opacity-70">{sellerUIStatus.errorMessage}</span>
                          </div>
                        </Link>
                      ) : sellerUIStatus.type === 'not_seller' ? (
                        <Link
                          to="/profile/become-seller"
                          onClick={handleLinkClick}
                          className="flex items-center gap-3 px-4 py-2 text-green-700 bg-green-50 hover:bg-green-100 transition-all duration-200"
                        >
                          <FaStore className="text-sm" />
                          <div className="flex flex-col">
                            <span className="text-sm">Become a Seller</span>
                            
                          </div>
                        </Link>
                      ) : null}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-200/20 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-all duration-200"
                      >
                        <FaSignOutAlt className="text-sm" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-3">
                <Link
                  to="/signin"
                  className="px-6 py-2 border-2 border-yellow-400/80 text-yellow-400 rounded-xl hover:bg-yellow-400 hover:text-black transition-all duration-300 font-medium transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/25"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black rounded-xl hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 font-medium transform hover:scale-105 shadow-lg hover:shadow-yellow-400/25"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-yellow-400 hover:text-white transition-colors duration-300 hover:bg-white/10 rounded-lg"
            >
              {menuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Seller Toggle */}
        {isLoggedIn && isSellerApproved && (
          <div className="md:hidden mt-4 flex justify-center">
            <div
              className={`flex items-center cursor-pointer w-36 h-10 rounded-full p-1 transition-all duration-500 ease-in-out ${
                sellerMode 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg shadow-yellow-400/30' 
                  : 'bg-gradient-to-r from-gray-700 to-gray-600 shadow-lg'
              }`}
              onClick={handleToggleMode}
            >
              <div
                className={`w-1/2 h-full flex items-center justify-center text-sm font-semibold rounded-full transition-all duration-500 ${
                  !sellerMode ? 'bg-white text-gray-800 shadow-lg' : 'text-white/80'
                }`}
              >
                <FaUser className="mr-1 text-xs" />
                User
              </div>
              <div
                className={`w-1/2 h-full flex items-center justify-center text-sm font-semibold rounded-full transition-all duration-500 ${
                  sellerMode ? 'bg-white text-gray-800 shadow-lg' : 'text-white/80'
                }`}
              >
                <FaStore className="mr-1 text-xs" />
                Seller
              </div>
            </div>
          </div>
        )}

        {/* Error Message Banner */}
        {(error || sellerFetchError) && (
          <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center animate-pulse">
            <div className="flex items-center justify-center gap-2">
              <FaExclamationTriangle />
              <span>{error || sellerFetchError}</span>
            </div>
            {(error?.includes('Session expired') || error?.includes('User not found')) && (
              <button 
                onClick={handleLogout}
                className="mt-2 text-xs underline hover:no-underline text-red-300"
              >
                Click here to log in again
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Mobile Navigation Overlay */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)}>
          <div 
            className="absolute top-0 right-0 w-80 max-w-[90vw] h-full bg-gradient-to-b from-slate-900 to-gray-900 shadow-2xl transform transition-transform duration-300 ease-out overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-white">Menu</h3>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Mobile Profile Section */}
              {isLoggedIn && (
                <div className="mb-6 p-4 bg-white/10 rounded-xl">
                  <div className="flex items-center gap-3">
                    {loading ? (
                      <div className="w-12 h-12 rounded-full bg-gray-600 animate-pulse" />
                    ) : error ? (
                      <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                        <FaExclamationTriangle className="text-white" />
                      </div>
                    ) : (
                      <img
                        src={getAvatarSrc(userProfile?.avatar)}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400"
                        onError={(e) => {
                          e.target.src = getAvatarSrc(null);
                        }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {loading ? 'Loading...' : error ? 'Error' : (userProfile?.username || 'User')}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {sellerMode && isSellerApproved ? 'Seller Mode' : 'Customer'}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        {userProfile?.email || 'No email'}
                      </p>
                    </div>
                  </div>
                  {(error || sellerFetchError) && (
                    <div className="mt-2 text-xs text-red-400 bg-red-500/10 p-2 rounded">
                      {error || sellerFetchError}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                {links.map((item, i) => (
                  <Link
                    key={i}
                    to={item.link}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                      currentPath === item.link 
                        ? 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/30' 
                        : 'text-white hover:text-yellow-400 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.title}</span>
                  </Link>
                ))}
              </div>

              {!isLoggedIn && (
                <div className="mt-8 space-y-3">
                  <Link
                    to="/signin"
                    onClick={handleLinkClick}
                    className="block w-full py-3 text-center border-2 border-yellow-400 text-yellow-400 rounded-xl hover:bg-yellow-400 hover:text-black transition-all duration-300 font-medium"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={handleLinkClick}
                    className="block w-full py-3 text-center bg-gradient-to-r from-yellow-400 to-orange-400 text-black rounded-xl hover:from-yellow-300 hover:to-orange-300 transition-all duration-300 font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="mt-8 w-full flex items-center justify-center gap-3 p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300"
                >
                  <FaSignOutAlt />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {profileDropdown && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setProfileDropdown(false)}
        ></div>
      )}
    </>
  );
}

export default Navbar;