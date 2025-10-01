import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBox, FaClipboardList, FaCog, FaSignOutAlt, FaChartLine, FaRupeeSign, FaUser, FaPlus, FaSyncAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/auth';
import axios from 'axios';

const SellerSidebar = ({ initialData = null, userProfile = null }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isActive = (path) => location.pathname === path;

  // Get auth headers
  const getHeaders = () => {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    return {
      id: id,
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch seller data
  const fetchSellerData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const headers = getHeaders();
      console.log('Fetching seller data with headers:', headers);
      
      const response = await axios.get('http://localhost:3000/api/v1/seller/get-seller-info', { headers });
      console.log('Seller API Response:', response.data);
      
      if (response.data?.success) {
        const sellerData = response.data.data;
        console.log('Setting seller data:', sellerData);
        setData(sellerData);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch seller data');
      }
      
    } catch (err) {
      console.error('Error fetching seller data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch seller data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data if needed
  const fetchUserData = async () => {
    try {
      const headers = getHeaders();
      const response = await axios.get('http://localhost:3000/api/v1/get-user-information', { headers });
      console.log('User API Response:', response.data);
      
      return response.data?.data || response.data;
    } catch (err) {
      console.error('Error fetching user data:', err);
      return null;
    }
  };

  // Initialize data on mount
  useEffect(() => {
    if (!initialData && !loading) {
      fetchSellerData();
    } else if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  // Get display name with proper fallbacks
  const getDisplayName = () => {
    console.log('Getting display name for data:', data);
    console.log('User profile:', userProfile);
    
    if (!data && !userProfile) return "Loading...";
    
    const sellerData = data || {};
    const userData = userProfile || {};
    
    // For Individual sellers, show fullName
    if (sellerData.sellerType === "Individual") {
      if (sellerData.fullName) {
        const nameParts = sellerData.fullName.split(" ");
        if (nameParts.length === 1) return nameParts[0];
        return `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;
      }
      // Fallback to user data
      if (userData.username) return userData.username;
      if (userData.fullName) return userData.fullName;
    }
    
    // For Business/Small Business sellers, show businessName
    if (sellerData.sellerType === "Business" || sellerData.sellerType === "Small Business") {
      if (sellerData.businessName) return sellerData.businessName;
      if (sellerData.fullName) return sellerData.fullName;
    }
    
    // Fallbacks
    return sellerData.businessName || 
           sellerData.fullName || 
           sellerData.storeName || 
           userData?.username || 
           userData?.fullName ||
           "Seller";
  };

  // Get email with fallbacks
  const getDisplayEmail = () => {
    const sellerData = data || {};
    const userData = userProfile || {};
    
    return sellerData.email || 
           userData?.email || 
           "Email not available";
  };

  // Get avatar source with fallbacks
  const getAvatarSrc = () => {
    const sellerData = data || {};
    const userData = userProfile || {};
    
    // Check seller avatar
    if (sellerData?.avatar) {
      return sellerData.avatar.startsWith("http") 
        ? sellerData.avatar 
        : `http://localhost:3000/${sellerData.avatar}`;
    }
    
    // Check user avatar from seller.user
    if (sellerData?.user?.avatar) {
      return sellerData.user.avatar.startsWith("http")
        ? sellerData.user.avatar
        : `http://localhost:3000/${sellerData.user.avatar}`;
    }
    
    // Check user profile avatar
    if (userData?.avatar) {
      return userData.avatar.startsWith("http")
        ? userData.avatar
        : `http://localhost:3000/${userData.avatar}`;
    }
    
    // Default avatar
    return "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg";
  };

  const avatarSrc = getAvatarSrc();
  const displayName = getDisplayName();
  const displayEmail = getDisplayEmail();

  console.log('Final display values:', { displayName, displayEmail, avatarSrc });

  const handleLogout = () => {
    localStorage.clear();
    dispatch(authActions.logout());
    navigate("/signin");
  };

  const handleRefresh = () => {
    fetchSellerData();
  };

  // Show loading state
  if (loading || (!data && !error)) {
    return (
      <div className="bg-zinc-900/50 rounded-3xl text-white 
        w-full sm:w-80 md:w-72 lg:w-64 xl:w-60 
        h-auto sm:min-h-screen p-4 sm:p-6 
        flex flex-col justify-center items-center 
        shadow-xl border border-zinc-700">
        <div className="animate-pulse">
          <div className="w-20 h-20 bg-zinc-700 rounded-full mb-4"></div>
          <div className="h-4 bg-zinc-700 rounded w-32 mb-2"></div>
          <div className="h-3 bg-zinc-700 rounded w-24"></div>
        </div>
        <p className="text-zinc-400 text-sm mt-4">Loading seller data...</p>
      </div>
    );
  }

  // Show error state
  if (error && !data) {
    return (
      <div className="bg-zinc-900/50 rounded-3xl text-white 
        w-full sm:w-80 md:w-72 lg:w-64 xl:w-60 
        h-auto sm:min-h-screen p-4 sm:p-6 
        flex flex-col justify-center items-center 
        shadow-xl border border-zinc-700">
        <div className="text-center">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <h3 className="text-red-300 font-semibold mb-2">Error Loading Data</h3>
          <p className="text-red-200 text-sm mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            <FaSyncAlt />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/50 rounded-3xl text-white 
      w-full sm:w-80 md:w-72 lg:w-64 xl:w-60 
      h-auto sm:min-h-screen p-4 sm:p-6 
      flex flex-col justify-start items-center 
      shadow-xl border border-zinc-700">

      {/* Mobile Profile */}
      <div className="w-full sm:hidden mb-6 bg-zinc-800 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
        <div className="rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500">
          <img
            src={avatarSrc}
            alt="Seller Avatar"
            className="w-16 h-16 rounded-full object-cover border-2 border-zinc-800"
            onError={(e) => {
              e.target.src = "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg";
            }}
          />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <h2 className="text-base font-semibold truncate">{displayName}</h2>
          <p className="text-xs text-zinc-400 truncate">{displayEmail}</p>
          {data?.sellerType && (
            <span className="text-xs text-yellow-400 bg-yellow-400/20 px-2 py-1 rounded-full mt-1 w-fit">
              {data.sellerType}
            </span>
          )}
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 text-zinc-400 hover:text-white transition-colors"
          title="Refresh data"
        >
          <FaSyncAlt className="text-sm" />
        </button>
      </div>

      {/* Desktop Avatar */}
      <div className="hidden sm:flex flex-col items-center mt-4">
        <div className="rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500">
          <img
            src={avatarSrc}
            alt="Seller Avatar"
            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-zinc-800"
            onError={(e) => {
              e.target.src = "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg";
            }}
          />
        </div>
        <div className="flex items-center gap-2 mt-3">
          <h2 className="text-lg md:text-xl font-semibold text-center px-2 truncate">
            {displayName}
          </h2>
          <button
            onClick={handleRefresh}
            className="p-1 text-zinc-400 hover:text-white transition-colors"
            title="Refresh data"
          >
            <FaSyncAlt className="text-sm" />
          </button>
        </div>
        <p className="text-sm text-zinc-400 truncate w-full text-center px-2">{displayEmail}</p>
        {data?.sellerType && (
          <span className="text-xs text-yellow-400 bg-yellow-400/20 px-3 py-1 rounded-full mt-2">
            {data.sellerType}
          </span>
        )}
        {data?.status && (
          <span className={`text-xs px-3 py-1 rounded-full mt-1 ${
            data.status === 'Approved' ? 'text-green-400 bg-green-400/20' :
            data.status === 'Pending' ? 'text-yellow-400 bg-yellow-400/20' :
            'text-red-400 bg-red-400/20'
          }`}>
            {data.status}
          </span>
        )}
      </div>

      {/* Debug Info (Remove in production) */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 w-full">
          <details className="bg-zinc-800/50 rounded-lg p-2 text-xs">
            <summary className="cursor-pointer text-zinc-400">Debug Info</summary>
            <div className="mt-2 space-y-1">
              <div>Seller Type: {data?.sellerType || 'N/A'}</div>
              <div>Full Name: {data?.fullName || 'N/A'}</div>
              <div>Business Name: {data?.businessName || 'N/A'}</div>
              <div>Email: {data?.email || 'N/A'}</div>
              <div>User Email: {userProfile?.email || 'N/A'}</div>
              <div>Status: {data?.status || 'N/A'}</div>
            </div>
          </details>
        </div>
      )} */}

      {/* Navigation */}
      <nav className="mt-6 sm:mt-10 w-full flex flex-col gap-2 px-1">
        {[
          { to: "/seller/profile", icon: <FaUser />, label: "Account Info" },
          { to: "/seller/profile/bank-info", icon: <FaRupeeSign />, label: "Bank Info" },
          { to: "/seller/profile/add-book", icon: <FaPlus />, label: "Add Book" },
          { to: "/seller/profile/my-products", icon: <FaBox />, label: "My Products" },
        ].map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`relative group flex items-center gap-3 pl-5 pr-4 py-3 rounded-xl transition-all duration-300 
              ${active
                  ? "bg-zinc-700 border-l-[5px] border-yellow-400 shadow-md"
                  : "hover:bg-zinc-800"
                }`}
            >
              <div className={`text-lg ${active ? "text-yellow-400" : "text-zinc-400 group-hover:text-yellow-300"}`}>
                {item.icon}
              </div>
              <span className={`text-sm font-medium ${active ? "text-white" : "text-zinc-300 group-hover:text-yellow-100"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="mt-6 w-full">
        <div className="bg-zinc-800 rounded-xl p-3 mb-4">
          <h3 className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Quick Actions</h3>
          <div className="space-y-2">
            <Link 
              to="/seller/profile/add-book" 
              className="flex items-center gap-2 text-xs text-zinc-300 hover:text-yellow-300 transition-colors"
            >
              <FaPlus className="text-xs" />
              Quick Add Product
            </Link>
            <Link 
              to="/profile" 
              className="flex items-center gap-2 text-xs text-zinc-300 hover:text-yellow-300 transition-colors"
            >
              <FaUser className="text-xs" />
              User Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Seller Stats (if approved) */}
      {data?.status === 'Approved' && (
        <div className="mt-2 w-full">
          <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-3 mb-4">
            <h3 className="text-xs font-semibold text-green-400 mb-2 uppercase tracking-wider">Seller Status</h3>
            <div className="text-xs text-green-300">
              ✓ Verified Seller
            </div>
            {data.applicationSubmittedAt && (
              <div className="text-xs text-zinc-400 mt-1">
                Since: {new Date(data.applicationSubmittedAt).toLocaleDateString('en-GB', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-auto mb-4 flex items-center gap-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300 w-full justify-center"
      >
        <FaSignOutAlt />
        <span className="text-sm font-medium">Log Out</span>
      </button>
    </div>
  );
};

export default SellerSidebar;