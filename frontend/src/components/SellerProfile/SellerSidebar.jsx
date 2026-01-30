import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBox, FaCog, FaSignOutAlt, FaRupeeSign, FaUser, FaPlus, FaSyncAlt, FaCrown, FaStar, FaBolt, FaShieldAlt, FaChartLine, FaStore } from 'react-icons/fa';
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
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isActive = (path) => location.pathname === path;

  const getHeaders = () => {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    return {
      id: id,
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const headers = getHeaders();
      const response = await axios.get('http://localhost:3000/api/v1/seller/get-seller-info', { headers });
      
      if (response.data?.success) {
        setData(response.data.data);
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

  useEffect(() => {
    if (!initialData && !loading) {
      fetchSellerData();
    } else if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const getDisplayName = () => {
    if (!data && !userProfile) return "Loading...";
    const sellerData = data || {};
    const userData = userProfile || {};
    
    if (sellerData.sellerType === "Individual") {
      if (sellerData.fullName) {
        const nameParts = sellerData.fullName.split(" ");
        if (nameParts.length === 1) return nameParts[0];
        return `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;
      }
      if (userData.username) return userData.username;
    }
    
    if (sellerData.sellerType === "Business" || sellerData.sellerType === "Small Business") {
      if (sellerData.businessName) return sellerData.businessName;
    }
    
    return sellerData.businessName || sellerData.fullName || userData?.username || "Seller";
  };

  const getDisplayEmail = () => {
    return data?.email || userProfile?.email || "Email not available";
  };

  const getAvatarSrc = () => {
    const sellerData = data || {};
    const userData = userProfile || {};
    
    if (sellerData?.avatar) {
      return sellerData.avatar.startsWith("http") ? sellerData.avatar : `http://localhost:3000/${sellerData.avatar}`;
    }
    if (sellerData?.user?.avatar) {
      return sellerData.user.avatar.startsWith("http") ? sellerData.user.avatar : `http://localhost:3000/${sellerData.user.avatar}`;
    }
    if (userData?.avatar) {
      return userData.avatar.startsWith("http") ? userData.avatar : `http://localhost:3000/${userData.avatar}`;
    }
    
    return "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg";
  };

  const handleLogout = () => {
    localStorage.clear();
    dispatch(authActions.logout());
    navigate("/signin");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSellerData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const navigationItems = [
    { to: "/seller/profile", icon: <FaUser />, label: "Account Info", color: "from-blue-400 to-cyan-400", glow: "shadow-blue-500/20" },
    { to: "/seller/profile/bank-info", icon: <FaRupeeSign />, label: "Bank Info", color: "from-green-400 to-emerald-400", glow: "shadow-green-500/20" },
    { to: "/seller/profile/add-book", icon: <FaPlus />, label: "Add Book", color: "from-purple-400 to-pink-400", glow: "shadow-purple-500/20" },
    { to: "/seller/profile/my-products", icon: <FaBox />, label: "My Products", color: "from-orange-400 to-amber-400", glow: "shadow-orange-500/20" },
  ];

  if (loading || (!data && !error)) {
    return (
      <div className="relative bg-gradient-to-br from-zinc-950 via-zinc-900 to-black rounded-3xl text-white 
        w-full sm:w-80 md:w-72 lg:w-80 xl:w-80 
        min-h-screen p-6 
        flex flex-col items-center 
        shadow-2xl border border-zinc-800/50 backdrop-blur-xl overflow-hidden">
        
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 animate-pulse flex flex-col items-center mt-8">
          <div className="w-24 h-24 bg-gradient-to-br from-zinc-800 to-zinc-700 rounded-full mb-4"></div>
          <div className="h-6 bg-zinc-800 rounded-full w-40 mb-3"></div>
          <div className="h-4 bg-zinc-800 rounded-full w-32"></div>
        </div>
        <p className="relative z-10 text-zinc-400 text-sm mt-8 animate-pulse">Loading seller data...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="relative bg-gradient-to-br from-zinc-950 via-zinc-900 to-black rounded-3xl text-white 
        w-full sm:w-80 md:w-72 lg:w-80 xl:w-80 
        min-h-screen p-6 
        flex flex-col justify-center items-center 
        shadow-2xl border border-red-500/30">
        <div className="text-center relative z-10">
          <div className="text-red-400 text-5xl mb-4 animate-bounce">⚠️</div>
          <h3 className="text-red-300 font-bold mb-2 text-lg">Error Loading Data</h3>
          <p className="text-red-200 text-sm mb-6 px-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-red-500/30"
          >
            <FaSyncAlt className={isRefreshing ? "animate-spin" : ""} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-zinc-950 via-zinc-900 to-black rounded-3xl text-white 
      w-full sm:w-80 md:w-72 lg:w-80 xl:w-70 
      min-h-screen p-6 
      flex flex-col 
      shadow-2xl border border-zinc-800/50 backdrop-blur-xl overflow-hidden">
      
      {/* Animated background gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-yellow-500/10 via-orange-500/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 via-pink-500/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Decorative border glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-500/20 via-transparent to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        
        {/* Header with refresh */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FaStore className="text-yellow-400 text-xl" />
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Seller Panel</h3>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-zinc-400 hover:text-yellow-400 transition-all duration-300 hover:rotate-180 transform"
            title="Refresh data"
          >
            <FaSyncAlt className={`text-sm ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center mb-8">
          {/* Avatar with premium effects */}
          <div className="relative group mb-4">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-orange-400 to-yellow-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-all duration-500 animate-pulse"></div>
            
            {/* Rotating border - using animation */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 opacity-75" style={{ animation: 'spin 3s linear infinite' }}></div>
            
            {/* Avatar container */}
            <div className="relative rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-orange-400 to-yellow-500 group-hover:scale-110 transition-transform duration-500">
              <div className="relative rounded-full p-[2px] bg-zinc-900">
                <img
                  src={getAvatarSrc()}
                  alt="Seller Avatar"
                  className="w-24 h-24 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg";
                  }}
                />
              </div>
            </div>
            
            {/* Status badge */}
            {data?.status === 'Approved' && (
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-green-400 to-emerald-500 w-8 h-8 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50 animate-bounce border-2 border-zinc-900">
                <FaShieldAlt className="text-white text-xs" />
              </div>
            )}
            
            {/* Premium crown badge */}
            <div className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-orange-500 w-8 h-8 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50 border-2 border-zinc-900 group-hover:scale-125 transition-transform duration-300">
              <FaCrown className="text-white text-xs" />
            </div>
          </div>
          
          {/* Name with gradient text */}
          <h2 className="text-xl font-bold bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent text-center px-4 mb-1 drop-shadow-lg">
            {getDisplayName()}
          </h2>
          
          {/* Email */}
          <p className="text-sm text-zinc-400 text-center px-4 mb-3 truncate w-full">
            {getDisplayEmail()}
          </p>
          
          {/* Badges */}
          <div className="flex flex-wrap gap-2 justify-center">
            {data?.sellerType && (
              <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-300 rounded-full border border-yellow-400/30 backdrop-blur-sm flex items-center gap-1.5 shadow-lg">
                <FaBolt className="text-yellow-400" />
                {data.sellerType}
              </span>
            )}
            {data?.status && (
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-sm flex items-center gap-1.5 shadow-lg ${
                data.status === 'Approved' 
                  ? 'bg-gradient-to-r from-green-400/20 to-emerald-400/20 text-green-300 border-green-400/30' 
                  : data.status === 'Pending'
                  ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-300 border-yellow-400/30'
                  : 'bg-gradient-to-r from-red-400/20 to-pink-400/20 text-red-300 border-red-400/30'
              }`}>
                <FaStar className={data.status === 'Approved' ? 'text-green-400' : 'text-yellow-400'} />
                {data.status}
              </span>
            )}
          </div>
        </div>

        {/* Navigation with premium effects */}
        <nav className="flex-1 flex flex-col gap-2 mb-6">
          {navigationItems.map((item, index) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group relative"
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-all duration-500 blur-sm`}></div>
                
                {/* Active indicator glow */}
                {active && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-20 rounded-2xl ${item.glow} shadow-xl animate-pulse`}></div>
                )}
                
                {/* Main button */}
                <div className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 transform
                  ${active 
                    ? 'bg-gradient-to-r from-zinc-800/80 to-zinc-800/60 border-l-4 border-yellow-400 shadow-lg translate-x-1' 
                    : 'bg-zinc-800/40 hover:bg-zinc-800/60 hover:translate-x-1'
                  }
                  backdrop-blur-sm border border-zinc-700/50 group-hover:border-zinc-600/50 group-hover:shadow-lg`}
                >
                  {/* Icon with gradient */}
                  <div className={`relative text-xl transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12
                    ${active 
                      ? `bg-gradient-to-br ${item.color} bg-clip-text text-transparent` 
                      : 'text-zinc-400 group-hover:text-yellow-400'
                    }`}
                    style={active ? { filter: 'drop-shadow(0 0 10px rgba(250,204,21,0.5))' } : {}}
                  >
                    {item.icon}
                  </div>
                  
                  {/* Label */}
                  <span className={`text-sm font-semibold transition-all duration-500
                    ${active 
                      ? 'text-white' 
                      : 'text-zinc-300 group-hover:text-white'
                    }`}
                  >
                    {item.label}
                  </span>
                  
                  {/* Arrow indicator */}
                  <div className={`ml-auto transform transition-all duration-500 ${active ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}>
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg shadow-yellow-400/50"></div>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats for Approved Sellers */}
        {data?.status === 'Approved' && (
          <div className="mb-6 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/30 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <FaShieldAlt className="text-green-400 text-sm" />
                <h3 className="text-xs font-bold text-green-400 uppercase tracking-wider">Verified Seller</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Status</span>
                  <span className="text-green-300 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Active
                  </span>
                </div>
                {data.applicationSubmittedAt && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Member Since</span>
                    <span className="text-zinc-300 font-medium">
                      {new Date(data.applicationSubmittedAt).toLocaleDateString('en-GB', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <FaBolt className="text-yellow-400" />
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Link 
              to="/seller/profile/add-book" 
              className="group flex items-center gap-3 px-4 py-3 bg-zinc-800/40 hover:bg-zinc-800/60 rounded-xl transition-all duration-300 transform hover:translate-x-1 border border-zinc-700/50 hover:border-purple-500/30"
            >
              <FaPlus className="text-purple-400 group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Quick Add Product</span>
            </Link>
            <Link 
              to="/profile" 
              className="group flex items-center gap-3 px-4 py-3 bg-zinc-800/40 hover:bg-zinc-800/60 rounded-xl transition-all duration-300 transform hover:translate-x-1 border border-zinc-700/50 hover:border-blue-500/30"
            >
              <FaUser className="text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">User Profile</span>
            </Link>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="relative group mt-auto overflow-hidden rounded-2xl"
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600 opacity-100 group-hover:opacity-0 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Button content */}
          <div className="relative flex items-center justify-center gap-3 px-6 py-4 text-white transition-all duration-300 transform group-hover:scale-[1.02] shadow-lg group-hover:shadow-red-500/50">
            <FaSignOutAlt className="text-lg group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-sm font-bold">Log Out</span>
          </div>
          
          {/* Bottom glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-red-400 to-transparent blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent"></div>
    </div>
  );
};

export default SellerSidebar;