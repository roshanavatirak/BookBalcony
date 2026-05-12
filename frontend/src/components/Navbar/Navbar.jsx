import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../../store/auth';
import axios from 'axios';
import MobileBottomNav from './MobileBottomNav';
import SellerMobileBottomNav from './SellerMobileBottomNav';


const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

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
  FaBook,
  FaCompass,
  FaStar,
  FaBell,
  FaArrowRight,
} from 'react-icons/fa';

import {
  FiHome,
  FiBookOpen,
  FiInfo,
  FiBriefcase,
  FiShoppingCart,
  FiSearch,
} from 'react-icons/fi';

import { FaSearch } from 'react-icons/fa';

// âœ… NOW ACCEPTS SELLER AS PROP - SAME AS SIDEBAR
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
  const [activeTab, setActiveTab] = useState('/');
  const [ripple, setRipple] = useState({ key: null, x: 0, y: 0 });

  const location = useLocation();
  const currentPath = location.pathname;
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // âœ… Ref to track polling interval
  const pollingIntervalRef = useRef(null);
  const lastFetchTimeRef = useRef(0);

  // Default avatar fallback
  const getAvatarSrc = (avatar) => {
    if (!avatar) {
      return "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?ga=GA1.1.710266921.1749747219&semt=ais_hybrid&w=740";
    }
    return avatar.startsWith("http") ? avatar : `${BASE_URL}/${avatar}`;
  };

  // âœ… Enhanced data extraction with debugging
  const extractUserData = (apiResponse) => {
    console.group('ðŸ” User Data Extraction Debug (Navbar)');
    console.log('Full API Response:', apiResponse);

    try {
      let userData = null;

      if (apiResponse?.data?.data) {
        console.log('âœ… Found data at: apiResponse.data.data');
        userData = apiResponse.data.data;
      }
      else if (apiResponse?.data && (apiResponse.data.username || apiResponse.data.email)) {
        console.log('âœ… Found data at: apiResponse.data');
        userData = apiResponse.data;
      }
      else if (apiResponse?.username || apiResponse?.email) {
        console.log('âœ… Found data at: apiResponse (root)');
        userData = apiResponse;
      }

      console.log('Extracted userData:', userData);

      if (!userData) {
        console.error('âŒ No user data found in any expected location');
        console.groupEnd();
        return null;
      }

      if (!userData.username && !userData.email) {
        console.error('âŒ User data missing required fields (username/email)');
        console.groupEnd();
        return null;
      }

      console.log('âœ… Successfully extracted user data:', {
        username: userData.username,
        email: userData.email,
        isSeller: userData.isSeller,
        sellerApplicationStatus: userData.sellerApplicationStatus,
        hasAvatar: !!userData.avatar
      });
      console.groupEnd();

      return userData;
    } catch (err) {
      console.error('âŒ Error extracting user data:', err);
      console.groupEnd();
      return null;
    }
  };

  // âœ… Update sellerInfo when seller prop changes
  useEffect(() => {
    console.log('ðŸ”„ Seller prop changed:', seller);
    setSellerInfo(seller || null);
  }, [seller]);

  // âœ… Sync active tab with route
  useEffect(() => {
    setActiveTab(currentPath);
  }, [currentPath]);

  // âœ… AUTOMATIC TOGGLE BASED ON ROUTE
  useEffect(() => {
    if (!isLoggedIn || !isSellerApproved) return;

    const isSellerRoute = currentPath.startsWith('/seller/');
    const isUserRoute = !isSellerRoute;

    console.log('ðŸ“ Route changed:', currentPath);
    console.log('ðŸ” Is seller route?', isSellerRoute);
    console.log('ðŸª Current seller mode:', sellerMode);

    if (isSellerRoute && !sellerMode) {
      console.log('ðŸ”„ Auto-switching to SELLER mode (on seller route)');
      setSellerMode(true);
      localStorage.setItem('sellerMode', 'true');
    }
    else if (isUserRoute && sellerMode && !currentPath.includes('/profile')) {
      console.log('ðŸ”„ Auto-switching to USER mode (on user route)');
      setSellerMode(false);
      localStorage.setItem('sellerMode', 'false');
    }
  }, [currentPath, isSellerApproved, isLoggedIn, sellerMode]);

  // âœ… FETCH USER DATA WITH REAL-TIME UPDATES
  const fetchUserData = useCallback(async (isPolling = false) => {
    const now = Date.now();
    if (isPolling && now - lastFetchTimeRef.current < 2000) {
      return;
    }
    lastFetchTimeRef.current = now;

    if (!isPolling) {
      console.log('ðŸš€ Starting fetchUserData (Navbar)...');
    }

    if (!isLoggedIn) {
      if (!isPolling) console.log('âŒ User not logged in, skipping fetch');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');

    if (!token || !id) {
      console.error('âŒ Missing token or ID');
      setError('Authentication data missing. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setSellerFetchError(null);

      const userRes = await axios.get(`${API_URL}/get-user-information`, {
        headers: {
          authorization: `Bearer ${token}`,
          id: id
        },
      });

      const userData = extractUserData(userRes.data);

      if (!userData) {
        throw new Error('Failed to extract user data from API response');
      }

      const hasChanged = JSON.stringify(userProfile) !== JSON.stringify(userData);

      if (hasChanged || !userProfile) {
        setUserProfile(userData);
      }

      const applicationStatus = userData.sellerApplicationStatus;
      const userIsSeller = userData.isSeller === true || userData.isSeller === 'true';

      const newIsSellerApproved = applicationStatus === 'Accepted' && userIsSeller;

      if (newIsSellerApproved !== isSellerApproved) {
        setIsSellerApproved(newIsSellerApproved);

        if (newIsSellerApproved) {
          const savedMode = localStorage.getItem('sellerMode') === 'true';
          setSellerMode(savedMode);
        } else {
          setSellerMode(false);
          localStorage.removeItem('sellerMode');
        }
      }

    } catch (err) {
      if (err.response) {
        const status = err.response.status;

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
        setError('Cannot connect to server. Please check your connection.');
      } else {
        setError(err.message || 'Unable to load profile data');
      }
    } finally {
      if (!isPolling) {
        setLoading(false);
      }
    }
  }, [isLoggedIn, userProfile, isSellerApproved]);

  // âœ… INITIAL FETCH
  useEffect(() => {
    fetchUserData(false);
  }, [isLoggedIn]);

  // âœ… REAL-TIME POLLING FOR STATUS UPDATES
  useEffect(() => {
    if (!isLoggedIn) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    pollingIntervalRef.current = setInterval(() => {
      fetchUserData(true);
    }, 5000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [isLoggedIn, fetchUserData]);

  // âœ… CUSTOM EVENT LISTENER FOR MANUAL STATUS REFRESH
  useEffect(() => {
    const handleSellerStatusUpdate = () => {
      fetchUserData(false);
    };

    window.addEventListener('sellerStatusUpdated', handleSellerStatusUpdate);

    return () => {
      window.removeEventListener('sellerStatusUpdated', handleSellerStatusUpdate);
    };
  }, [fetchUserData]);

  const handleToggleMode = () => {
    if (!isSellerApproved) return;
    const updated = !sellerMode;
    setSellerMode(updated);
    localStorage.setItem('sellerMode', updated.toString());
    navigate(updated ? '/seller/dashboard' : '/');
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
    setProfileDropdown(false);
  };

  const handleLogout = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    localStorage.removeItem('sellerMode');

    const logoutEvent = new CustomEvent('userLoggedOut');
    window.dispatchEvent(logoutEvent);

    setUserProfile(null);
    setSellerInfo(null);
    setIsSellerApproved(false);
    setSellerMode(false);
    setError(null);
    setSellerFetchError(null);
    setLoading(false);

    dispatch(authActions.logout());
    navigate('/signin', { replace: true });
  };

  // âœ… UPDATED: Use sellerApplicationStatus from user profile
  const getSellerStatus = () => {
    try {
      const applicationStatus = userProfile?.sellerApplicationStatus;
      const isSeller = userProfile?.isSeller === true || userProfile?.isSeller === 'true';

      if (!applicationStatus || applicationStatus === "Available") {
        return { type: 'not_seller', status: 'Not a Seller', applicationStatus: 'Available', hasData: false };
      }

      if (applicationStatus === "Accepted") {
        if (isSeller) {
          return { type: 'verified', status: 'Approved', applicationStatus: 'Accepted', hasData: true };
        } else {
          return { type: 'inconsistent', status: 'Data Issue', applicationStatus: 'Accepted', errorMessage: 'Application accepted but account not configured as seller. Contact support.', hasData: false };
        }
      }

      if (applicationStatus === "Applied") {
        return { type: 'pending', status: 'Pending', applicationStatus: 'Applied', hasData: !!sellerInfo };
      }

      if (applicationStatus === "Rejected") {
        return { type: 'rejected', status: 'Rejected', applicationStatus: 'Rejected', hasData: !!sellerInfo };
      }

      let sellerStatus = null;
      if (sellerInfo?.data?.status) {
        sellerStatus = sellerInfo.data.status;
      } else if (sellerInfo?.status) {
        sellerStatus = sellerInfo.status;
      }

      if (sellerStatus) {
        if (sellerStatus === "Approved") return { type: 'verified', status: 'Approved', applicationStatus, hasData: true };
        if (sellerStatus === "Pending") return { type: 'pending', status: 'Pending', applicationStatus, hasData: true };
        if (sellerStatus === "Rejected") return { type: 'rejected', status: 'Rejected', applicationStatus, hasData: true };
      }

      if (isSeller && !sellerInfo && applicationStatus !== "Accepted") {
        return { type: 'inconsistent', status: 'Data Issue', applicationStatus, errorMessage: sellerFetchError || 'Your seller data is inconsistent. Contact support.', hasData: false };
      }

      return { type: 'not_seller', status: 'Not a Seller', applicationStatus: applicationStatus || 'Available', hasData: false };
    } catch (error) {
      return { type: 'error', status: 'Error', applicationStatus: 'Unknown', errorMessage: 'Failed to determine seller status', hasData: false, error: true };
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

  const handleRipple = (e, key) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ key, x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setRipple({ key: null, x: 0, y: 0 }), 600);
  };

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
                  className={`flex items-center cursor-pointer w-36 h-12 rounded-full p-1 transition-all duration-500 ease-in-out transform hover:scale-105 ${sellerMode
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg shadow-yellow-400/30'
                    : 'bg-gradient-to-r from-gray-700 to-gray-600 shadow-lg'
                    }`}
                  onClick={handleToggleMode}
                >
                  <div
                    className={`w-1/2 h-full flex items-center justify-center text-sm font-semibold rounded-full transition-all duration-500 transform ${!sellerMode
                      ? 'bg-white text-gray-800 shadow-lg translate-x-0 scale-105'
                      : 'text-white/80 translate-x-0'
                      }`}
                  >
                    <FaUser className="mr-1 text-xs" />
                    User
                  </div>
                  <div
                    className={`w-1/2 h-full flex items-center justify-center text-sm font-semibold rounded-full transition-all duration-500 transform ${sellerMode
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
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${isActive
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
                      className={`absolute left-1/2 -bottom-1 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-300 transform -translate-x-1/2 ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-3/4 group-hover:opacity-100'
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



            {/* Show hamburger for non-logged-in on mobile (sign in / sign up) */}
            {!isLoggedIn && (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 text-yellow-400 hover:text-white transition-colors duration-300 hover:bg-white/10 rounded-lg"
              >
                {menuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Seller Toggle */}
        {isLoggedIn && isSellerApproved && (
          <div className="md:hidden mt-4 flex justify-center">
            <div
              className={`flex items-center cursor-pointer w-36 h-10 rounded-full p-1 transition-all duration-500 ease-in-out ${sellerMode
                ? 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg shadow-yellow-400/30'
                : 'bg-gradient-to-r from-gray-700 to-gray-600 shadow-lg'
                }`}
              onClick={handleToggleMode}
            >
              <div
                className={`w-1/2 h-full flex items-center justify-center text-sm font-semibold rounded-full transition-all duration-500 ${!sellerMode ? 'bg-white text-gray-800 shadow-lg' : 'text-white/80'
                  }`}
              >
                <FaUser className="mr-1 text-xs" />
                User
              </div>
              <div
                className={`w-1/2 h-full flex items-center justify-center text-sm font-semibold rounded-full transition-all duration-500 ${sellerMode ? 'bg-white text-gray-800 shadow-lg' : 'text-white/80'
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

      {/* Mobile Bottom Nav + Search (extracted component) */}
      {!(isLoggedIn && sellerMode && isSellerApproved) && (
        <MobileBottomNav />
      )}
      {isLoggedIn && sellerMode && isSellerApproved && (
        <SellerMobileBottomNav />
      )}


      {/* Mobile Navigation Overlay (Seller mode overflow / non-logged-in auth) */}
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
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${currentPath === item.link
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
