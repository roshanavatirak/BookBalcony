import React, { useEffect, useState } from 'react';
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
} from 'react-icons/fa';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [isSellerApproved, setIsSellerApproved] = useState(false);
  const [sellerMode, setSellerMode] = useState(localStorage.getItem('sellerMode') === 'true');
  const [userProfile, setUserProfile] = useState(null);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const currentPath = location.pathname;
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Default avatar fallback
  const getAvatarSrc = (avatar) => {
    if (!avatar) {
      return "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?ga=GA1.1.710266921.1749747219&semt=ais_hybrid&w=740";
    }
    return avatar.startsWith("http") ? avatar : `http://localhost:3000/${avatar}`;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const id = localStorage.getItem('id');
      
      if (!token || !id) {
        console.log('No token or id found in localStorage');
        setLoading(false);
        return;
      }

      try {
        setError(null);
        
        // Fetch user profile using the correct endpoint from your backend
        console.log('Fetching user data with ID:', id);
        const userRes = await axios.get(`http://localhost:3000/api/v1/get-user-information`, {
          headers: { 
            authorization: `Bearer ${token}`,
            id: id 
          },
        });
        
        console.log('User API Response:', userRes.data);
        const userData = userRes.data.success  && userRes.data.data  ? userRes.data.data : userRes.data;
        
        console.log('Extracted user data:', userData);
        // Your backend returns user data directly at root level (not nested)
        if (userData.data && (userData.username || userData.email)) {
          console.log('Setting user profile:', userData.data);
          setUserProfile(userData);

          // ✅ FIXED: Check if user.isSeller is true from user data
          const userIsSeller = userData.isSeller;
          console.log('User isSeller flag:', userIsSeller);

          if (userIsSeller) {
            // User has isSeller flag, now check seller status
            try {
              const sellerRes = await axios.get(`http://localhost:3000/api/v1/seller/check/${id}`, {
                headers: { authorization: `Bearer ${token}` },
              });

              console.log('Seller check response:', sellerRes.data);

              if (sellerRes.data?.isSeller && sellerRes.data?.status === 'Approved') {
                setIsSellerApproved(true);
                setSellerInfo({ status: 'Approved', ...sellerRes.data });
                const savedMode = localStorage.getItem('sellerMode') === 'true';
                setSellerMode(savedMode);
              } else {
                // User has isSeller flag but seller record shows different status
                setIsSellerApproved(false);
                setSellerInfo({ status: sellerRes.data?.status || 'Pending' });
                setSellerMode(false);
                localStorage.removeItem('sellerMode');
              }
            } catch (sellerCheckErr) {
              console.log('Seller check failed:', sellerCheckErr.response?.status);
              
              // ✅ FIXED: If user.isSeller is true but no seller record exists (404)
              // This means data inconsistency - user was marked as seller but no seller record
              if (sellerCheckErr.response?.status === 404) {
                console.warn('Data inconsistency: User has isSeller=true but no seller record found');
                // Set as pending application status for UI purposes
                setIsSellerApproved(false);
                setSellerInfo({ status: 'DataInconsistency' });
                setSellerMode(false);
                localStorage.removeItem('sellerMode');
              } else {
                setIsSellerApproved(false);
                setSellerMode(false);
                setSellerInfo(null);
              }
            }

            // Try to get detailed seller info if we think user is a seller
            if (isSellerApproved || sellerInfo?.status === 'Approved') {
              try {
                const sellerInfoRes = await axios.get(`http://localhost:3000/api/v1/seller/get-seller-info`, {
                  headers: { authorization: `Bearer ${token}` },
                });
                console.log('Seller info response:', sellerInfoRes.data);
                setSellerInfo(prev => ({ ...prev, ...sellerInfoRes.data.data }));
              } catch (sellerErr) {
                console.log('Seller info fetch failed:', sellerErr.response?.status);
              }
            }
          } else {
            // User doesn't have isSeller flag
            setIsSellerApproved(false);
            setSellerMode(false);
            setSellerInfo(null);
            localStorage.removeItem('sellerMode');
          }
        } else {
          console.warn('User data structure unexpected:', userData.data);
          setError('Unable to load user profile');
        }

      } catch (err) {
        console.error('Error fetching user data:', err);
        
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Session expired. Please log in again.');
          handleLogout();
        } else if (err.response?.status === 404) {
          setError('User not found. Please log in again.');
          handleLogout();
        } else if (err.response?.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError('Unable to load profile data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoggedIn]);

  // Debug: Log userProfile whenever it changes
  useEffect(() => {
    console.log('UserProfile updated:', userProfile);
  }, [userProfile]);

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
    // Clear all localStorage items
    localStorage.clear();
    
    // Reset all state
    setUserProfile(null);
    setSellerInfo(null);
    setIsSellerApproved(false);
    setSellerMode(false);
    setError(null);
    setLoading(false);
    
    // Update Redux state
    dispatch(authActions.logout());
    
    // Navigate to signin
    navigate('/signin');
  };

  // ✅ FIXED: Helper function to determine seller status for UI
 const getSellerUIStatus = () => {
  try {
    // Case 1: User is not a seller at all (isSeller is false or 'false')
    if (!userProfile?.isSeller || userProfile?.isSeller === 'false' || userProfile?.isSeller === false) {
      return { canBecomeSeller: true, status: 'Not a Seller' };
    }

    // Case 2: User has isSeller=true, now check seller info status
    if (!sellerInfo) {
      // User has isSeller flag but no seller data (inconsistency)
      return { hasDataIssue: true, status: 'Data Inconsistency' };
    }

    // Case 3: Seller status is Approved
    if (sellerInfo?.status === 'Approved') {
      return { isVerified: true, status: 'Approved' };
    }

    // Case 4: Seller status is Pending
    if (sellerInfo?.status === 'Pending') {
      return { isPending: true, status: 'Pending' };
    }

    // Case 5: Explicit Data Inconsistency status
    if (sellerInfo?.status === 'DataInconsistency') {
      return { hasDataIssue: true, status: 'Data Inconsistency' };
    }

    // Case 6: User has isSeller=true but status is unknown/undefined
    // This handles any edge cases where status exists but isn't one of the expected values
    return { hasDataIssue: true, status: 'Unknown Status' };

  } catch (error) {
    console.error('Error in getSellerUIStatus:', error);
    return { error: true, status: 'Error Loading Status' };
  }
};

  // Navigation links logic
  let links = [];
  if (isLoggedIn && sellerMode && isSellerApproved) {
    links = [
      { title: 'Dashboard', link: '/seller/dashboard', icon: <FaHome /> },
      { title: 'Add Product', link: '/seller/add-book', icon: <FaPlus /> },
      { title: 'My Products', link: '/seller/myproducts', icon: <FaBoxOpen /> },
      { title: 'Orders', link: '/seller/orders', icon: <FaShoppingCart /> },
    ];
  } else {
    links = [
      { title: 'Home', link: '/', icon: <FaHome /> },
      { title: 'About Us', link: '/about-us', icon: <FaInfoCircle /> },
      { title: 'All Books', link: '/all-books', icon: <FaBoxOpen /> },
    ];
    if (isLoggedIn) {
      links.push({ title: 'Cart', link: '/cart', icon: <FaShoppingCart /> });
    }
  }

  // Get seller UI status for dropdown
  const sellerUIStatus = getSellerUIStatus();

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
                      <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
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
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg"></div>
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
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {userProfile?.username || 'User'}
                          </p>
                          <p className="text-xs text-gray-600">
                            {userProfile?.email || 'No email available'}
                          </p>
                          {userProfile?.phone && (
                            <p className="text-xs text-gray-500">
                              {userProfile.phone}
                            </p>
                          )}
                          {/* ✅ FIXED: Show verified seller badge only when truly approved */}
                          {sellerUIStatus.isVerified && (
                            <div className="flex items-center gap-1 mt-1">
                              <FaStore className="text-xs text-yellow-600" />
                              <span className="text-xs text-yellow-600 font-medium">Verified Seller</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Error Display in Dropdown */}
                    {error && (
                      <div className="px-4 py-2 bg-red-50 border-l-4 border-red-400">
                        <p className="text-xs text-red-700">{error}</p>
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
                        </>
                      )}

                      <Link
                        to="/profile/settings"
                        onClick={handleLinkClick}
                        className="flex items-center gap-3 px-4 py-2 text-gray-800 hover:bg-yellow-400/10 hover:text-yellow-600 transition-all duration-200"
                      >
                        <FaCog className="text-sm" />
                        <span className="text-sm">Settings</span>
                      </Link>

                      {/* ✅ FIXED: Seller Status - Now shows correct status based on actual data */}
                      {sellerUIStatus.isVerified ? (
                        <Link
                          to="/profile/verified-seller-info"
                          onClick={handleLinkClick}
                          className="flex items-center gap-3 px-4 py-2 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 transition-all duration-200"
                        >
                          <FaStore className="text-sm" />
                          <span className="text-sm font-medium">You're a Verified Seller</span>
                        </Link>
                      ) : sellerUIStatus.isPending ? (
                        <Link
                          to="/profile/seller-application-submitted"
                          onClick={handleLinkClick}
                          className="flex items-center gap-3 px-4 py-2 text-orange-700 bg-orange-50 hover:bg-orange-100 transition-all duration-200"
                        >
                          <FaStore className="text-sm" />
                          <span className="text-sm">Seller Application Under Review</span>
                        </Link>
                      ) : sellerUIStatus.hasDataIssue ? (
                        <Link
                          to="/profile/seller-data-issue"
                          onClick={handleLinkClick}
                          className="flex items-center gap-3 px-4 py-2 text-red-700 bg-red-50 hover:bg-red-100 transition-all duration-200"
                        >
                          <FaExclamationTriangle className="text-sm" />
                          <span className="text-sm">Seller Data Issue</span>
                        </Link>
                      ) : sellerUIStatus.canBecomeSeller ? (
                        <Link
                          to="/profile/become-seller"
                          onClick={handleLinkClick}
                          className="flex items-center gap-3 px-4 py-2 text-green-700 bg-green-50 hover:bg-green-100 transition-all duration-200"
                        >
                          <FaStore className="text-sm" />
                          <span className="text-sm">Become a Seller</span>
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

        {/* Error Message */}
        {error && (
          <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
            <div className="flex items-center justify-center gap-2">
              <FaExclamationTriangle />
              <span>{error}</span>
            </div>
            {(error.includes('Session expired') || error.includes('User not found')) && (
              <button 
                onClick={handleLogout}
                className="mt-2 text-xs underline hover:no-underline"
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
            className="absolute top-0 right-0 w-80 max-w-[90vw] h-full bg-gradient-to-b from-slate-900 to-gray-900 shadow-2xl transform transition-transform duration-300 ease-out"
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
                    <img
                      src={getAvatarSrc(userProfile?.avatar)}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400"
                      onError={(e) => {
                        e.target.src = getAvatarSrc(null);
                      }}
                    />
                    <div>
                      <p className="text-white font-medium">
                        {loading ? 'Loading...' : (userProfile?.username || 'User')}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {sellerMode && isSellerApproved ? 'Seller Mode' : 'Customer'}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {userProfile?.email || 'No email'}
                      </p>
                    </div>
                  </div>
                  {error && (
                    <div className="mt-2 text-xs text-red-400 bg-red-500/10 p-2 rounded">
                      {error}
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