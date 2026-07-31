import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { 
  Package, TrendingUp, DollarSign, Eye, ShoppingCart, Activity, 
  AlertCircle, Clock, CheckCircle2, Boxes, Users, Star,
  ArrowUp, ArrowDown, Plus, Bell, Calendar, MapPin,
  RefreshCw, XCircle, Zap, TrendingDown, BarChart3, Wallet, ChevronDown
} from "lucide-react";
import { FiChevronRight } from "react-icons/fi";
import Alert from "../Alert/Alert";
import { useAlert } from "../Alert/useAlert";
import Loader from "../Loader/Loader";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

// ==================== INLINE CUSTOM CSS EFFECTS ====================
const CustomStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 10px rgba(250, 204, 21, 0.08); }
      50% { box-shadow: 0 0 20px rgba(250, 204, 21, 0.2); }
    }
    @keyframes cardEntrance {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes modalEntrance {
      from { opacity: 0; transform: scale(0.98) translateY(6px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes dotPulse {
      0%, 100% { opacity: 0.6; transform: scale(0.95); }
      50% { opacity: 1; transform: scale(1.15); }
    }
    .premium-gold-glow:hover {
      animation: pulseGlow 2.5s infinite ease-in-out;
    }
    .animate-card-entrance {
      animation: cardEntrance 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .animate-modal-entrance {
      animation: modalEntrance 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .pulse-dot-active {
      animation: dotPulse 1.8s infinite ease-in-out;
    }
    .premium-scrollbar::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    .premium-scrollbar::-webkit-scrollbar-track {
      background: rgba(24, 24, 27, 0.2);
    }
    .premium-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(250, 204, 21, 0.12);
      border-radius: 9999px;
    }
    .premium-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(250, 204, 21, 0.3);
    }
    .border-zinc-850 {
      border-color: rgba(39, 39, 42, 0.55);
    }
  `}} />
);

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMerchantSwitcher, setShowMerchantSwitcher] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { alert, hideAlert, success, error } = useAlert();

  // Admin Mode States
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminSellerId, setAdminSellerId] = useState(null);
  const [adminSellerName, setAdminSellerName] = useState("");
  const [approvedSellers, setApprovedSellers] = useState([]);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Fetch approved sellers list for admin view switcher
  const fetchApprovedSellers = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/sellers`, {
        headers: {
          id: localStorage.getItem("id"),
          authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      const data = await response.json();
      if (data.success) {
        const approved = data.data.filter(s => s.status === "Approved");
        setApprovedSellers(approved);
        
        // If query parameters don't contain a sellerId, select the first one
        const params = new URLSearchParams(window.location.search);
        const qSellerId = params.get("sellerId");
        if (!qSellerId && approved.length > 0) {
          const firstSeller = approved[0];
          setAdminSellerId(firstSeller.user?._id || firstSeller.user);
          setAdminSellerName(firstSeller.fullName);
        }
      }
    } catch (err) {
      console.error("Failed to fetch approved sellers:", err);
    }
  };

  // Check admin role and extract URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qSellerId = params.get("sellerId");
    const qSellerName = params.get("sellerName");
    const storedRole = localStorage.getItem("role");

    if (storedRole === "admin") {
      setIsAdminMode(true);
      if (qSellerId) {
        setAdminSellerId(qSellerId);
        setAdminSellerName(qSellerName || "Seller");
      }
      fetchApprovedSellers();
    }
  }, []);

  // Fetch data on mount and when filters or seller context change
  useEffect(() => {
    const isUserAdmin = localStorage.getItem("role") === "admin";
    if (!isUserAdmin || adminSellerId) {
      fetchDashboardData();
    }
  }, [adminSellerId]);

  const fetchDashboardData = async (isAutoRefresh = false) => {
    const isUserAdmin = localStorage.getItem("role") === "admin";
    if (isUserAdmin && !adminSellerId) {
      setLoading(false);
      return;
    }

    if (!isAutoRefresh) setLoading(true);
    else setRefreshing(true);

    try {
      const requestHeaders = { ...headers };
      if (isUserAdmin && adminSellerId) {
        requestHeaders.sellerid = adminSellerId;
      }
      
      const queryParams = new URLSearchParams();
      if (isUserAdmin && adminSellerId) {
        queryParams.append("sellerId", adminSellerId);
      }

      const [statsRes, ordersRes, productsRes, notificationsRes] = await Promise.all([
        axios.get(`${API_URL}/seller/dashboard-stats?${queryParams}`, { headers: requestHeaders }),
        axios.get(`${API_URL}/seller/orders?page=1&limit=5&${queryParams}`, { headers: requestHeaders }),
        isUserAdmin 
          ? axios.get(`${API_URL}/admin/all-books`, { headers: requestHeaders })
          : axios.get(`${API_URL}/seller/myproducts?${queryParams}`, { headers: requestHeaders }),
        axios.get(`${API_URL}/seller/new-order-notifications?${queryParams}`, { headers: requestHeaders })
      ]);

      setStats(statsRes.data?.data);
      setRecentOrders(ordersRes.data?.data?.orders || []);

      let allProducts = [];
      if (isUserAdmin) {
        const rawBooks = productsRes.data?.data || [];
        
        // Find active seller document in approvedSellers to extract their Seller Document ID
        const activeSeller = approvedSellers.find(s => 
          (s.user?._id || s.user) === adminSellerId || 
          s._id === adminSellerId
        );
        const sellerDocId = activeSeller ? activeSeller._id : null;

        allProducts = rawBooks.filter(book => {
          const bookSellerId = book.seller?._id || book.seller;
          const bookCreatedById = book.createdBy?._id || book.createdBy;
          
          return (
            (sellerDocId && bookSellerId === sellerDocId) ||
            (adminSellerId && bookSellerId === adminSellerId) ||
            (adminSellerId && bookCreatedById === adminSellerId)
          );
        });
      } else {
        allProducts = productsRes.data?.books || [];
      }

      const sortedByViews = [...allProducts].sort((a, b) => (b.views || 0) - (a.views || 0));
      setTopProducts(sortedByViews.slice(0, 5));
      setAllProducts(allProducts);

      const lowStock = allProducts.filter(p => p.stock > 0 && p.stock <= 5);
      setLowStockProducts(lowStock);

      setNotifications(notificationsRes.data?.data?.notifications || []);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      const errMsg = err.response?.data?.message || err.message || "Unknown error";
      const errUrl = err.config?.url || "unknown URL";
      const errStatus = err.response?.status ? `[Status ${err.response.status}]` : "";
      if (!isAutoRefresh) error(`Failed to load dashboard data: ${errMsg} ${errStatus} on ${errUrl.split('/api/v1')[1] || errUrl}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(false);
    success("Dashboard refreshed successfully");
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status) => {
    const colors = {
      "Order Placed": "bg-blue-500/10 text-blue-300 border-blue-500/30",
      "Processing": "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
      "Shipped": "bg-purple-500/10 text-purple-300 border-purple-500/30",
      "Out for Delivery": "bg-orange-500/10 text-orange-300 border-orange-500/30",
      "Delivered": "bg-green-500/10 text-green-300 border-green-500/30",
      "Cancelled": "bg-red-500/10 text-red-300 border-red-500/30",
    };
    return colors[status] || "bg-zinc-500/10 text-zinc-300 border-zinc-500/30";
  };

  // Dynamic Navigation Links
  const ordersLink = isAdminMode 
    ? `/Admin/Seller-Orders?sellerId=${adminSellerId}&sellerName=${encodeURIComponent(adminSellerName)}` 
    : "/seller/orders";
    
  const productsLink = isAdminMode 
    ? `/Admin/Seller-Products?sellerId=${adminSellerId}&sellerName=${encodeURIComponent(adminSellerName)}` 
    : "/seller/myproducts";
    
  const addProductLink = isAdminMode 
    ? "/Admin/Seller-AddProduct" 
    : "/seller/add-product";
    
  const profileLink = isAdminMode 
    ? "/Admin/profile" 
    : "/seller/profile";

  if (loading) {
    return <Loader fullPage text="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white px-2 sm:px-4 py-6 flex justify-center relative overflow-hidden">
      <CustomStyles />
      
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-zinc-500/5 rounded-full blur-[120px] pointer-events-none" />

      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          duration={alert.duration}
          position={alert.position}
          autoClose={alert.autoClose}
          onClose={hideAlert}
        />
      )}

      <div className="w-full max-w-7xl bg-zinc-900/25 backdrop-blur-xl border border-zinc-850 p-4 sm:p-5 shadow-2xl rounded-2xl relative animate-card-entrance">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 text-left sm:text-center">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent mb-1.5">
                {isAdminMode ? `Merchant Portal: ${adminSellerName}` : "Seller Dashboard"}
              </h1>
              <p className="text-zinc-400 text-xs flex items-center sm:justify-center gap-2 font-medium">
                <span className="w-2 h-2 bg-yellow-400 rounded-full pulse-dot-active" />
                {isAdminMode ? `Auditing store performance & live parameters` : "Overview of your bookstore performance & inventory analytics"}
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-3.5 py-1.5 bg-zinc-900/60 hover:bg-zinc-900 text-white rounded-lg transition-all flex items-center gap-2 border border-zinc-850 hover:border-yellow-400/30 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold shadow-md active:scale-[0.98]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
          <div className="h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent w-full" />
        </div>

        {/* Admin Header Controls */}
        {isAdminMode && (
          <div className={`mb-6 p-2 bg-zinc-900/40 backdrop-blur-md border border-zinc-850 rounded-xl flex flex-row items-center justify-between gap-2.5 animate-card-entrance relative ${showMerchantSwitcher ? 'z-[100]' : 'z-10'}`}>
            <Link
              to="/Admin/Sellers-List"
              className="flex-shrink-0 flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-black text-yellow-400 hover:text-yellow-300 transition-all bg-zinc-950/60 hover:bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-850 hover:border-yellow-400/50 active:scale-[0.98] shadow-md"
            >
              <span>← Sellers</span>
            </Link>
            
            {approvedSellers.length > 0 && (
              <div className="relative flex-1 sm:flex-initial">
                <button
                  onClick={() => setShowMerchantSwitcher(!showMerchantSwitcher)}
                  className="w-full sm:w-auto flex items-center justify-between gap-3 bg-zinc-950/60 pl-2.5 pr-4 py-1.5 rounded-lg border border-zinc-850 hover:border-yellow-400/40 transition-all duration-300 active:scale-[0.98]"
                >
                  <div className="flex items-center gap-2 text-left">
                    <div className="w-6.5 h-6.5 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-[10px] font-black text-yellow-400 uppercase tracking-tighter">
                      {adminSellerName.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Active Merchant</p>
                      <p className="text-xs font-black text-yellow-400 truncate max-w-[110px] sm:max-w-[180px]">
                        {adminSellerName}
                      </p>
                    </div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-yellow-400 transition-transform duration-300 ${showMerchantSwitcher ? 'rotate-180' : ''}`} />
                </button>

                {showMerchantSwitcher && (
                  <>
                    <div className="fixed inset-0 z-[9998]" onClick={() => setShowMerchantSwitcher(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-zinc-950/95 backdrop-blur-xl border border-zinc-850 rounded-xl shadow-2xl p-1.5 z-[9999] animate-modal-entrance overflow-hidden">
                      <div className="px-2.5 py-1.5 border-b border-zinc-850/60 mb-1">
                        <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Select Merchant</span>
                      </div>
                      <div className="max-h-60 overflow-y-auto premium-scrollbar space-y-1">
                        {approvedSellers.map((seller) => {
                          const sId = seller.user?._id || seller.user;
                          const isActive = adminSellerId === sId || adminSellerId === seller._id;
                          return (
                            <button
                              key={seller._id}
                              onClick={() => {
                                setAdminSellerId(sId);
                                setAdminSellerName(seller.fullName);
                                setShowMerchantSwitcher(false);
                              }}
                              className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition-all duration-200 ${isActive ? 'bg-yellow-400/10 border border-yellow-400/20' : 'hover:bg-zinc-900/60 border border-transparent'}`}
                            >
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black uppercase tracking-tighter ${isActive ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                                {seller.fullName.slice(0, 2)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-bold truncate ${isActive ? 'text-yellow-400' : 'text-white'}`}>
                                  {seller.fullName}
                                </p>
                                <p className="text-[10px] text-zinc-500 truncate">
                                  {seller.businessName || "No Business Name"}
                                </p>
                              </div>
                              {isActive && (
                                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full pulse-dot-active" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Notifications Banner */}
        {notifications.length > 0 && (
          <div className="mb-6 bg-blue-500/5 backdrop-blur-sm border border-blue-500/20 rounded-xl p-3.5 animate-card-entrance">
            <div className="flex items-start gap-3">
              <div className="relative mt-0.5">
                <Bell className="w-4.5 h-4.5 text-blue-400 flex-shrink-0 animate-bounce" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full pulse-dot-active" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-blue-300 text-sm mb-1.5 flex items-center gap-1.5">
                  New Orders Received <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-[10px] text-blue-300 font-extrabold">{notifications.length} New</span>
                </h3>
                <div className="space-y-1.5">
                  {notifications.slice(0, 3).map((notif) => (
                    <div key={notif._id} className="text-xs text-zinc-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-400/50 rounded-full animate-pulse" />
                      <span className="font-medium text-white truncate max-w-[150px] sm:max-w-xs">{notif.book?.title}</span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-zinc-400 font-medium">₹{notif.amount}</span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-zinc-500">{formatDate(notif.createdAt)}</span>
                    </div>
                  ))}
                  {notifications.length > 3 && (
                    <Link to={ordersLink} className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-block mt-0.5">
                      +{notifications.length - 3} more orders...
                    </Link>
                  )}
                </div>
              </div>
              <Link
                to={ordersLink}
                className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 rounded-lg text-xs font-semibold transition-all border border-blue-500/20 hover:border-blue-500/40 active:scale-[0.98]"
              >
                View All
              </Link>
            </div>
          </div>
        )}

        {/* Main Stats Grid — 4 cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">

            {/* Total Revenue */}
            <div className="relative overflow-hidden bg-zinc-900/40 backdrop-blur-md rounded-xl border border-zinc-850 p-4 hover:border-green-500/40 transition-all duration-300 group hover:-translate-y-0.5 premium-gold-glow animate-card-entrance" style={{ animationDelay: '0.05s' }}>
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-green-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Total Revenue</span>
                <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-all duration-300 group-hover:scale-105">
                  <DollarSign className="w-4 h-4 text-green-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1 tracking-tight">
                ₹{(stats.overview.totalRevenue || 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Delivered bookings</span>
              </div>
            </div>

            {/* Wallet Balance */}
            <div className="relative overflow-hidden bg-zinc-900/40 backdrop-blur-md rounded-xl border border-zinc-850 p-4 hover:border-yellow-400/40 transition-all duration-300 group hover:-translate-y-0.5 premium-gold-glow animate-card-entrance" style={{ animationDelay: '0.1s' }}>
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Wallet Balance</span>
                <div className="p-2 bg-yellow-400/10 rounded-lg group-hover:bg-yellow-400/20 transition-all duration-300 group-hover:scale-105">
                  <Wallet className="w-4 h-4 text-yellow-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1 tracking-tight">
                ₹{(stats.overview.walletBalance || 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-yellow-400 font-medium">
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full pulse-dot-active" />
                <span>Available to withdraw</span>
              </div>
            </div>

            {/* Pending Revenue */}
            <div className="relative overflow-hidden bg-zinc-900/40 backdrop-blur-md rounded-xl border border-zinc-850 p-4 hover:border-orange-400/40 transition-all duration-300 group hover:-translate-y-0.5 premium-gold-glow animate-card-entrance" style={{ animationDelay: '0.15s' }}>
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-orange-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Pending</span>
                <div className="p-2 bg-orange-400/10 rounded-lg group-hover:bg-orange-400/20 transition-all duration-300 group-hover:scale-105">
                  <Clock className="w-4 h-4 text-orange-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1 tracking-tight">
                ₹{(stats.overview.pendingRevenue || 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-orange-400 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>Awaiting delivery</span>
              </div>
            </div>

            {/* Total Orders */}
            <div className="relative overflow-hidden bg-zinc-900/40 backdrop-blur-md rounded-xl border border-zinc-850 p-4 hover:border-blue-500/40 transition-all duration-300 group hover:-translate-y-0.5 premium-gold-glow animate-card-entrance" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Total Orders</span>
                <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-all duration-300 group-hover:scale-105">
                  <ShoppingCart className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1 tracking-tight">
                {stats.overview.totalOrders}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-blue-400 font-medium">
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>All time orders</span>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-zinc-900/30 backdrop-blur-sm rounded-xl border border-zinc-850 p-3 hover:border-cyan-500/30 transition-all duration-300 group relative">
              <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center gap-2 mb-1">
                <Eye className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-105 transition-transform" />
                <span className="text-zinc-400 text-[9px] font-extrabold uppercase tracking-wider">Total Views</span>
              </div>
              <p className="text-xl font-bold text-white tracking-tight">
                {allProducts.reduce((sum, p) => sum + (p.views || 0), 0).toLocaleString()}
              </p>
            </div>

            <div className="bg-zinc-900/30 backdrop-blur-sm rounded-xl border border-zinc-850 p-3 hover:border-orange-400/30 transition-all duration-300 group relative">
              <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-orange-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center gap-2 mb-1">
                <Boxes className="w-3.5 h-3.5 text-orange-400 group-hover:scale-105 transition-transform" />
                <span className="text-zinc-400 text-[9px] font-extrabold uppercase tracking-wider">Total Stock</span>
              </div>
              <p className="text-xl font-bold text-white tracking-tight">
                {allProducts.reduce((sum, p) => sum + (p.stock || 0), 0).toLocaleString()}
              </p>
            </div>

            <div className="bg-zinc-900/30 backdrop-blur-sm rounded-xl border border-zinc-850 p-3 hover:border-purple-400/30 transition-all duration-300 group relative">
              <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center gap-2 mb-1">
                <ArrowDown className="w-3.5 h-3.5 text-purple-400 group-hover:scale-105 transition-transform" />
                <span className="text-zinc-400 text-[9px] font-extrabold uppercase tracking-wider">Withdrawn</span>
              </div>
              <p className="text-xl font-bold text-white tracking-tight">
                ₹{(stats.overview.totalWithdrawn || 0).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Link
            to={addProductLink}
            className="p-3 bg-zinc-900/20 backdrop-blur-sm border border-yellow-400/10 rounded-xl hover:border-yellow-400/30 transition-all duration-300 group hover:-translate-y-0.5 flex items-center justify-between shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-400/10 rounded-lg group-hover:bg-yellow-400/20 transition-all duration-300 group-hover:scale-105">
                <Plus className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-yellow-400 transition-colors">Add Product</p>
                <p className="text-[10px] text-zinc-400 font-medium">List new item</p>
              </div>
            </div>
            <FiChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-yellow-400 group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            to={productsLink}
            className="p-3 bg-zinc-900/20 backdrop-blur-sm border border-blue-400/10 rounded-xl hover:border-blue-400/30 transition-all duration-300 group hover:-translate-y-0.5 flex items-center justify-between shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-400/10 rounded-lg group-hover:bg-blue-400/20 transition-all duration-300 group-hover:scale-105">
                <Package className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">My Products</p>
                <p className="text-[10px] text-zinc-400 font-medium">View inventory</p>
              </div>
            </div>
            <FiChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            to={ordersLink}
            className="p-3 bg-zinc-900/20 backdrop-blur-sm border border-green-400/10 rounded-xl hover:border-green-400/30 transition-all duration-300 group hover:-translate-y-0.5 flex items-center justify-between shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-400/10 rounded-lg group-hover:bg-green-400/20 transition-all duration-300 group-hover:scale-105">
                <ShoppingCart className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-green-400 transition-colors">Orders</p>
                <p className="text-[10px] text-zinc-400 font-medium">Manage orders</p>
              </div>
            </div>
            <FiChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-green-400 group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            to={profileLink}
            className="p-3 bg-zinc-900/20 backdrop-blur-sm border border-purple-400/10 rounded-xl hover:border-purple-400/30 transition-all duration-300 group hover:-translate-y-0.5 flex items-center justify-between shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-400/10 rounded-lg group-hover:bg-purple-400/20 transition-all duration-300 group-hover:scale-105">
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">Profile</p>
                <p className="text-[10px] text-zinc-400 font-medium">Edit details</p>
              </div>
            </div>
            <FiChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Recent Orders */}
          <div className="bg-zinc-900/25 backdrop-blur-md rounded-xl border border-zinc-850 p-4">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-850">
              <h2 className="text-xs font-extrabold text-white flex items-center gap-2 uppercase tracking-wider">
                <ShoppingCart className="w-4 h-4 text-green-400" />
                Recent Orders
              </h2>
              <Link to={ordersLink} className="text-xs text-yellow-400 hover:text-yellow-300 font-bold transition-colors">
                View All →
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-10 h-10 text-zinc-700 mx-auto mb-2" />
                <p className="text-xs text-zinc-500">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentOrders.map((order) => (
                  <div key={order._id} className="p-2.5 bg-zinc-900/30 rounded-lg border border-zinc-850 hover:border-zinc-800 transition-all duration-300 hover:bg-zinc-900/50 group">
                    <div className="flex gap-3">
                      <img
                        src={order.book?.url}
                        alt={order.book?.title}
                        className="w-10 h-14 object-cover rounded border border-zinc-800 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate group-hover:text-yellow-400 transition-colors">
                          {order.book?.title}
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-0.5 font-mono uppercase">
                          #{order._id.slice(-6)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase border tracking-wider ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-medium">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 flex flex-col justify-between">
                        <p className="text-xs font-extrabold text-yellow-400 tracking-tight">
                          ₹{order.amountPayable.toLocaleString()}
                        </p>
                        {order.orderStatus === "Delivered" && (
                          <span className="text-[9px] text-green-400 flex items-center gap-0.5 justify-end font-semibold uppercase tracking-wider">
                            <Wallet className="w-2.5 h-2.5" /> Credited
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Products */}
          <div className="bg-zinc-900/25 backdrop-blur-md rounded-xl border border-zinc-850 p-4">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-850">
              <h2 className="text-xs font-extrabold text-white flex items-center gap-2 uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                Top Products
              </h2>
              <Link to={productsLink} className="text-xs text-yellow-400 hover:text-yellow-300 font-bold transition-colors">
                View All →
              </Link>
            </div>

            {topProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-10 h-10 text-zinc-700 mx-auto mb-2" />
                <p className="text-xs text-zinc-500">No products yet</p>
                <Link
                  to={addProductLink}
                  className="inline-block mt-3 px-3 py-1.5 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 hover:border-yellow-400/40 rounded-lg text-xs font-bold transition-all hover:bg-yellow-400/20 active:scale-[0.98]"
                >
                  Add Your First Product
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {topProducts.slice(0, 5).map((product, index) => (
                  <div key={product._id} className="p-2.5 bg-zinc-900/30 rounded-lg border border-zinc-850 hover:border-zinc-800 transition-all duration-300 hover:bg-zinc-900/50 group">
                    <div className="flex gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={product.url || product.images?.[0]?.url}
                          alt={product.title}
                          className="w-10 h-14 object-cover rounded border border-zinc-800"
                        />
                        <div className="absolute -top-1 -left-1 w-4.5 h-4.5 bg-zinc-950 text-yellow-400 border border-yellow-400/50 rounded-full flex items-center justify-center text-[9px] font-black shadow-lg">
                          #{index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate group-hover:text-yellow-400 transition-colors">
                          {product.title}
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-0.5 truncate font-medium">
                          {product.author}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-[10px] font-semibold text-zinc-400">
                          <div className="flex items-center gap-1 group-hover:text-purple-400 transition-colors">
                            <Eye className="w-3.5 h-3.5 text-purple-400" />
                            <span>{product.views || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 group-hover:text-blue-400 transition-colors">
                            <Boxes className="w-3.5 h-3.5 text-blue-400" />
                            <span>{product.stock || 0}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 flex flex-col justify-center">
                        <p className="text-xs font-extrabold text-yellow-400 tracking-tight">
                          ₹{product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="bg-red-500/5 backdrop-blur-sm border border-red-500/20 rounded-xl p-4 animate-card-entrance">
            <div className="flex items-start gap-3">
              <div className="relative mt-0.5">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full pulse-dot-active" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-300 text-sm mb-3">
                  Low Stock Alert — {lowStockProducts.length} Product{lowStockProducts.length > 1 ? 's' : ''} Require Attention
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {lowStockProducts.slice(0, 4).map((product) => (
                    <div key={product._id} className="flex items-center gap-3 p-2 bg-zinc-900/40 rounded-lg border border-zinc-850 hover:border-red-500/20 transition-all duration-300">
                      <img
                        src={product.url || product.images?.[0]?.url}
                        alt={product.title}
                        className="w-10 h-14 object-cover rounded border border-zinc-800"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{product.title}</p>
                        <p className="text-[10px] text-zinc-400 truncate mt-0.5">{product.author}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full pulse-dot-active" />
                          <span className="text-[9px] text-red-400 font-extrabold uppercase tracking-wide">Only {product.stock} Left</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {lowStockProducts.length > 4 && (
                  <Link
                    to={productsLink}
                    className="text-xs text-red-400 hover:text-red-300 mt-3 inline-block font-semibold transition-colors"
                  >
                    +{lowStockProducts.length - 4} more products need restocking →
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;