import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, TrendingUp, Clock, CheckCircle, XCircle, X, Bell, AlertCircle, RefreshCw, Trash2, Eye, MapPin, User, Phone, Mail, Calendar, DollarSign, CreditCard, Truck, Box, Activity, ChevronDown, Filter, Search, Plus, Send } from "lucide-react";
import Alert from "../Alert/Alert";
import { useAlert } from "../Alert/useAlert";
import Loader from "../Loader/Loader";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

export default function SellerOrdersDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Admin Mode States
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminSellerId, setAdminSellerId] = useState(null);
  const [adminSellerName, setAdminSellerName] = useState("");
  const [approvedSellers, setApprovedSellers] = useState([]);

  // Custom tracking update state
  const [showCustomTracking, setShowCustomTracking] = useState(false);
  const [customTracking, setCustomTracking] = useState({
    status: "",
    location: "",
    notes: ""
  });
  
  const { alert, hideAlert, success, error, warning } = useAlert();

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
    fetchOrders();
  }, [filterStatus, currentPage, adminSellerId, isAdminMode]);

  // Lock background body scroll when order details modal is open
  useEffect(() => {
    if (selectedOrder) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedOrder]);

  const fetchOrders = async () => {
    const isUserAdmin = localStorage.getItem("role") === "admin";
    if (isUserAdmin && !adminSellerId) {
      setOrders([]);
      setStats(null);
      setPagination(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10
      });
      
      if (filterStatus !== "all") {
        queryParams.append("status", filterStatus);
      }

      if (isUserAdmin && adminSellerId) {
        queryParams.append("sellerId", adminSellerId);
      }

      const fetchHeaders = {
        ...headers
      };
      if (isUserAdmin && adminSellerId) {
        fetchHeaders.sellerid = adminSellerId;
      }

      const response = await fetch(
        `${API_URL}/seller/orders?${queryParams}`,
        { headers: fetchHeaders }
      );

      const data = await response.json();
      
      console.log('📦 API Response:', data);

      if (data.status === "Success" || data.success) {
        const responseData = data.data || data;
        setOrders(responseData.orders || []);
        setStats(responseData.stats || null);
        setPagination(responseData.pagination || null);
      } else {
        error(data.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      error("Failed to fetch orders. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log('🔄 Updating order status:', { orderId, newStatus });

      const response = await fetch(
        `${API_URL}/seller/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();
      
      console.log('📦 Update response:', data);

      if (data.success) {
        success(`Order status updated to: ${newStatus}`);
        
        // Refresh orders list
        await fetchOrders();
        
        // Update selected order if modal is open
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(data.order);
        }
      } else {
        error(data.message || "Failed to update order status");
      }
    } catch (err) {
      console.error("Failed to update order:", err);
      error("Failed to update order status");
    }
  };

  const addCustomTrackingUpdate = async () => {
    if (!customTracking.status || !customTracking.location) {
      warning("Please fill in both status and location");
      return;
    }

    try {
      console.log('📍 Adding custom tracking update:', customTracking);

      const response = await fetch(
        `${API_URL}/seller/orders/${selectedOrder._id}/tracking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: JSON.stringify(customTracking),
        }
      );

      const data = await response.json();
      
      console.log('📍 Tracking update response:', data);

      if (data.success) {
        success("Custom tracking update added successfully");
        
        // Update selected order with new data
        setSelectedOrder(data.order);
        
        // Reset custom tracking form
        setCustomTracking({ status: "", location: "", notes: "" });
        setShowCustomTracking(false);
        
        // Refresh orders list
        await fetchOrders();
      } else {
        error(data.message || "Failed to add tracking update");
      }
    } catch (err) {
      console.error("Failed to add tracking update:", err);
      error("Failed to update tracking history");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      "Order Placed": "bg-blue-500/20 text-blue-300 border-blue-500/50",
      "Processing": "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
      "Shipped": "bg-purple-500/20 text-purple-300 border-purple-500/50",
      "Out for Delivery": "bg-orange-500/20 text-orange-300 border-orange-500/50",
      "Delivered": "bg-green-500/20 text-green-300 border-green-500/50",
      "Cancelled": "bg-red-500/20 text-red-300 border-red-500/50",
    };
    return colors[status] || "bg-gray-500/20 text-gray-300 border-gray-500/50";
  };

  const getPaymentStatusColor = (status) => {
    return status === "Success" 
      ? "text-green-400" 
      : status === "Pending" 
      ? "text-yellow-400" 
      : "text-red-400";
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter orders by search term
  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      order.book?.title?.toLowerCase().includes(searchLower) ||
      order.shippingAddress?.fullName?.toLowerCase().includes(searchLower) ||
      order._id?.toLowerCase().includes(searchLower)
    );
  });

  if (loading && !stats) {
    return <Loader fullPage text="Loading orders..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white px-4 sm:px-8 py-6 flex justify-center relative">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(24, 24, 27, 0.4);
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(250, 204, 21, 0.25);
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(250, 204, 21, 0.5);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(250, 204, 21, 0.25) rgba(24, 24, 27, 0.4);
        }
      `}</style>

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

      <div className="w-full max-w-6xl bg-zinc-900/50 rounded-2xl px-6 sm:px-10 py-6 shadow-xl border border-zinc-700 animate-in fade-in duration-300">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent mb-2">
            {isAdminMode ? `Orders: ${adminSellerName}` : "Orders Dashboard"}
          </h1>
          <p className="text-zinc-400 text-sm italic flex items-center justify-center gap-2">
            <Activity className="w-4 h-4 text-yellow-400" />
            {isAdminMode ? `Auditing order catalog for ${adminSellerName}` : "Manage orders and track live deliveries"}
          </p>
          <hr className="mt-4 border-zinc-700 rounded-full mx-auto w-1/2" />
        </div>

        {/* Admin Header Controls */}
        {isAdminMode && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 p-4 bg-zinc-800/40 border border-zinc-700 rounded-xl animate-in slide-in-from-top-4 duration-300">
            <button
              onClick={() => navigate('/Admin/Sellers-List')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-bold text-yellow-400 hover:text-yellow-300 transition-all bg-zinc-900 hover:bg-zinc-950 px-4 py-2.5 rounded-lg border border-zinc-700 hover:border-yellow-400 active:scale-[0.98] shadow-md"
            >
              ← Back to Sellers List
            </button>
            
            {approvedSellers.length > 0 && (
              <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 bg-zinc-900 px-3.5 py-1.5 rounded-lg border border-zinc-750 shadow-inner">
                <span className="text-zinc-400 text-xs font-bold whitespace-nowrap">Viewing orders for:</span>
                <select
                  value={adminSellerId || ""}
                  onChange={(e) => {
                    const selId = e.target.value;
                    const sel = approvedSellers.find(s => (s.user?._id || s.user) === selId);
                    setAdminSellerId(selId);
                    if (sel) {
                      setAdminSellerName(sel.fullName);
                    }
                  }}
                  className="bg-transparent py-1.5 focus:outline-none text-yellow-400 font-extrabold text-xs sm:text-sm cursor-pointer outline-none border-none"
                >
                  {approvedSellers.map((seller) => {
                    const sId = seller.user?._id || seller.user;
                    return (
                      <option key={seller._id} value={sId} className="bg-zinc-900 text-white font-medium">
                        {seller.fullName} ({seller.businessName || "No Business Name"})
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-3 hover:border-blue-400/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-xs font-semibold">Total Orders</span>
                <Package className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-xl font-bold text-white">{stats.total || 0}</p>
              <p className="text-xs text-blue-400">All time orders</p>
            </div>

            <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-3 hover:border-yellow-400/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-xs font-semibold">Pending Orders</span>
                <Clock className="w-4 h-4 text-yellow-400" />
              </div>
              <p className="text-xl font-bold text-white">{stats.pending || 0}</p>
              <p className="text-xs text-yellow-400">To be processed</p>
            </div>

            <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-3 hover:border-purple-400/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-xs font-semibold">Shipped</span>
                <Truck className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-xl font-bold text-white">{stats.shipped || 0}</p>
              <p className="text-xs text-purple-400">In transit</p>
            </div>

            <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-3 hover:border-green-400/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-xs font-semibold">Delivered</span>
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-xl font-bold text-white">{stats.delivered || 0}</p>
              <p className="text-xs text-green-400">Completed deliveries</p>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by order ID, book, or customer..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none text-white placeholder-gray-500 text-sm" 
              />
            </div>
            
            <div className="flex items-center gap-2 bg-zinc-800 px-3 rounded-lg border border-zinc-700">
              <Filter className="w-4 h-4 text-gray-400" />
              <select 
                value={filterStatus} 
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent py-2 pr-6 focus:outline-none text-white text-sm cursor-pointer"
              >
                <option value="all" className="bg-zinc-900">All Status</option>
                <option value="Order Placed" className="bg-zinc-900">Order Placed</option>
                <option value="Processing" className="bg-zinc-900">Processing</option>
                <option value="Shipped" className="bg-zinc-900">Shipped</option>
                <option value="Out for Delivery" className="bg-zinc-900">Out for Delivery</option>
                <option value="Delivered" className="bg-zinc-900">Delivered</option>
                <option value="Cancelled" className="bg-zinc-900">Cancelled</option>
              </select>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </div>

            <button 
              onClick={fetchOrders}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all font-bold text-sm whitespace-nowrap"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Orders
            </button>
          </div>
        </div>

        {/* Orders Grid */}
        {loading ? (
          <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-12 text-center">
            <Loader size="md" />
            <p className="text-zinc-400 mt-3 text-sm">Loading your orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-12 text-center">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No orders found</h3>
            <p className="text-gray-400 mb-6 text-sm max-w-md mx-auto">
              {searchTerm 
                ? "Try adjusting your search criteria" 
                : filterStatus !== "all" 
                ? `No orders matching status: ${filterStatus}` 
                : "Your orders will appear here once customers make purchases."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {filteredOrders.map((order) => (
                <div key={order._id} className="bg-zinc-800/40 rounded-lg border border-zinc-700 overflow-hidden hover:border-yellow-400/50 transition-all group flex flex-col justify-between shadow-xl">
                  <div className="p-4">
                    {/* Order Header */}
                    <div className="flex gap-3 items-start justify-between mb-3">
                      <div className="flex gap-2.5 min-w-0">
                        <img
                          src={order.book?.url || "/placeholder.jpg"}
                          alt={order.book?.title}
                          className="w-11 h-15 object-cover rounded-lg border border-zinc-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="font-bold text-white group-hover:text-yellow-400 transition-colors text-xs sm:text-sm truncate">
                            {order.book?.title || 'Unknown Book'}
                          </h3>
                          <p className="text-[10px] text-zinc-400 mt-0.5">
                            ID: #{order._id.slice(-8).toUpperCase()}
                          </p>
                          <div className="mt-1.5">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border uppercase tracking-wider ${getStatusColor(order.orderStatus)}`}>
                              {order.orderStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-base sm:text-lg font-black bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                          ₹{order.amountPayable?.toLocaleString() || 0}
                        </p>
                        <p className={`text-[10px] font-semibold mt-0.5 ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentMethod} • {order.paymentStatus}
                        </p>
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-zinc-900/40 rounded-lg border border-zinc-700 text-[11px] mb-3">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[9px] text-zinc-400 uppercase font-semibold">Ordered</p>
                          <p className="text-zinc-200 truncate">{formatDate(order.createdAt).split(',')[0]}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Clock className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[9px] text-zinc-400 uppercase font-semibold">ETA Delivery</p>
                          <p className="text-zinc-200 truncate">{formatDate(order.expectedDeliveryDate).split(',')[0]}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <User className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[9px] text-zinc-400 uppercase font-semibold">Customer</p>
                          <p className="text-zinc-200 truncate">{order.shippingAddress?.fullName || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <MapPin className="w-3.5 h-3.5 text-green-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-[9px] text-zinc-400 uppercase font-semibold">Location</p>
                          <p className="text-zinc-200 truncate">{order.currentLocation || "Warehouse"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all text-xs font-bold shadow-md active:scale-[0.98]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Details & Update
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-700 hover:text-white transition"
                >
                  Previous
                </button>
                <span className="text-zinc-400 text-xs">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-700 hover:text-white transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* View Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-3 pt-6 pb-24 sm:p-6 md:p-8 animate-fadeIn">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-700 max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            
            {/* Sticky Modal Header */}
            <div className="sticky top-0 z-10 bg-zinc-900 border-b border-zinc-800 px-4 sm:px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-yellow-400" />
                  Order Details
                </h2>
                <p className="text-[10px] text-zinc-400 mt-0.5">Order ID: {selectedOrder._id}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setShowCustomTracking(false);
                  setCustomTracking({ status: "", location: "", notes: "" });
                }}
                className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all duration-200 border border-zinc-700 hover:border-zinc-600 shadow"
                title="Close Dialog"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 pb-8 sm:pb-12 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left Column (Details) */}
                <div className="space-y-3.5">
                  {/* Book Information */}
                  <div className="p-3.5 bg-zinc-800/40 rounded-lg border border-zinc-700">
                    <h3 className="font-bold text-white mb-2.5 flex items-center gap-2 text-xs sm:text-sm">
                      <Box className="w-3.5 h-3.5 text-yellow-400" />
                      Book Details
                    </h3>
                    <div className="flex gap-3">
                      <img
                        src={selectedOrder.book?.url || "/placeholder.jpg"}
                        alt={selectedOrder.book?.title}
                        className="w-12 h-16 object-cover rounded-lg border border-zinc-700 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-xs sm:text-sm truncate">{selectedOrder.book?.title}</p>
                        <p className="text-[10px] text-zinc-400 mt-1">Language: {selectedOrder.book?.language || 'English'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="p-3.5 bg-zinc-800/40 rounded-lg border border-zinc-700">
                    <h3 className="font-bold text-white mb-2.5 flex items-center gap-2 text-xs sm:text-sm">
                      <CreditCard className="w-3.5 h-3.5 text-green-400" />
                      Payment Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                      <div>
                        <p className="text-zinc-400 text-[10px] uppercase font-semibold">Amount Payable</p>
                        <p className="font-black text-white text-base sm:text-lg">₹{selectedOrder.amountPayable?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-zinc-400 text-[10px] uppercase font-semibold">Method / Status</p>
                        <p className="font-semibold text-white mt-0.5">
                          {selectedOrder.paymentMethod} - <span className={getPaymentStatusColor(selectedOrder.paymentStatus)}>{selectedOrder.paymentStatus}</span>
                        </p>
                      </div>
                      <div className="col-span-2 border-t border-zinc-700 my-1"></div>
                      <div>
                        <p className="text-zinc-400 text-[10px] uppercase font-semibold">Discount</p>
                        <p className="font-semibold text-green-400">₹{selectedOrder.discount || 0}</p>
                      </div>
                      <div>
                        <p className="text-zinc-400 text-[10px] uppercase font-semibold">Handling Fee</p>
                        <p className="font-semibold text-yellow-400">₹{selectedOrder.handlingFee || 0}</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer & Address details */}
                  <div className="p-3.5 bg-zinc-800/40 rounded-lg border border-zinc-700">
                    <h3 className="font-bold text-white mb-2.5 flex items-center gap-2 text-xs sm:text-sm">
                      <User className="w-3.5 h-3.5 text-purple-400" />
                      Customer & Delivery Details
                    </h3>
                    <div className="space-y-2.5 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-zinc-400 text-[10px] block uppercase font-semibold">Name</span>
                          <span className="font-medium text-white">{selectedOrder.shippingAddress?.fullName || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400 text-[10px] block uppercase font-semibold">Phone</span>
                          <span className="font-medium text-white">{selectedOrder.shippingAddress?.phone || 'N/A'}</span>
                        </div>
                      </div>
                      {selectedOrder.user?.email && (
                        <div>
                          <span className="text-zinc-400 text-[10px] block uppercase font-semibold">Email</span>
                          <span className="font-medium text-white truncate block">{selectedOrder.user.email}</span>
                        </div>
                      )}
                      <div className="border-t border-zinc-700 my-1"></div>
                      <div>
                        <span className="text-zinc-400 text-[10px] block uppercase flex items-center gap-1 font-semibold">
                          <MapPin className="w-3 h-3 text-yellow-400" />
                          Shipping Address
                        </span>
                        <p className="text-zinc-300 leading-relaxed text-[11px] mt-1 bg-zinc-900/40 p-2 rounded-lg border border-zinc-700">
                          {selectedOrder.shippingAddress?.addressLine1}
                          {selectedOrder.shippingAddress?.addressLine2 && `, ${selectedOrder.shippingAddress.addressLine2}`}
                          <br />
                          {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.postalCode}
                          <br />
                          {selectedOrder.shippingAddress?.country || 'India'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column (Actions / Tracking) */}
                <div className="space-y-3.5">
                  {/* Update Order Status */}
                  <div className="p-3.5 bg-zinc-800/40 rounded-lg border border-zinc-700">
                    <h3 className="font-bold text-white mb-2.5 flex items-center gap-2 text-xs sm:text-sm">
                      <Truck className="w-3.5 h-3.5 text-blue-400" />
                      Update Order Status
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {["Processing", "Shipped", "Out for Delivery", "Delivered"].map((status) => {
                        const isCurrent = selectedOrder.orderStatus === status;
                        const isLocked = selectedOrder.orderStatus === "Delivered" || selectedOrder.orderStatus === "Cancelled";
                        return (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(selectedOrder._id, status)}
                            disabled={isCurrent || isLocked}
                            className={`px-2.5 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-all duration-200 flex items-center justify-center gap-1 ${
                              isCurrent
                                ? "bg-zinc-900 text-yellow-400 border border-zinc-700 cursor-not-allowed"
                                : isLocked
                                ? "bg-zinc-950 text-zinc-600 border border-zinc-850 cursor-not-allowed opacity-30"
                                : "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-500 hover:to-yellow-600 hover:shadow-md active:scale-95"
                            }`}
                          >
                            {isCurrent && <CheckCircle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />}
                            {status}
                          </button>
                        );
                      })}
                      {(selectedOrder.orderStatus === "Delivered" || selectedOrder.orderStatus === "Cancelled") && (
                        <div className="col-span-2 text-center text-zinc-400 text-xs mt-1 border border-zinc-700 bg-zinc-900/40 p-2.5 rounded-lg flex items-center justify-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                          <span>This order is <strong>{selectedOrder.orderStatus}</strong> and cannot be modified further.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Custom Tracking Update */}
                  <div className="p-3.5 bg-zinc-800/40 rounded-lg border border-zinc-700">
                    <h3 className="font-bold text-white mb-2.5 flex items-center gap-2 text-xs sm:text-sm">
                      <MapPin className="w-3.5 h-3.5 text-green-400" />
                      Add Custom Tracking Update
                    </h3>
                    
                    {selectedOrder.orderStatus === "Delivered" || selectedOrder.orderStatus === "Cancelled" ? (
                      <div className="text-center p-3.5 bg-zinc-900/40 rounded-lg border border-zinc-700 text-zinc-500 text-xs flex items-center justify-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-zinc-500" />
                        Tracking history is locked for {selectedOrder.orderStatus.toLowerCase()} orders.
                      </div>
                    ) : !showCustomTracking ? (
                      <button
                        onClick={() => setShowCustomTracking(true)}
                        className="w-full flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all text-xs font-bold uppercase tracking-wider shadow-md active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                        Add Custom Update
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div>
                          <label className="text-[10px] text-zinc-400 uppercase mb-0.5 block font-semibold">Status Message</label>
                          <input
                            type="text"
                            placeholder="e.g., Arrived at sorting facility"
                            value={customTracking.status}
                            onChange={(e) => setCustomTracking({...customTracking, status: e.target.value})}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:ring-2 focus:ring-yellow-400 outline-none"
                          />
                        </div>
                        
                        <div>
                          <label className="text-[10px] text-zinc-400 uppercase mb-0.5 block font-semibold">Current Location</label>
                          <input
                            type="text"
                            placeholder="e.g., Mumbai sorting office"
                            value={customTracking.location}
                            onChange={(e) => setCustomTracking({...customTracking, location: e.target.value})}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:ring-2 focus:ring-yellow-400 outline-none"
                          />
                        </div>
                        
                        <div>
                          <label className="text-[10px] text-zinc-400 uppercase mb-0.5 block font-semibold">Notes (Optional)</label>
                          <textarea
                            placeholder="Additional tracking details..."
                            value={customTracking.notes}
                            onChange={(e) => setCustomTracking({...customTracking, notes: e.target.value})}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:ring-2 focus:ring-yellow-400 outline-none resize-none"
                            rows="2"
                          />
                        </div>
                        
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={addCustomTrackingUpdate}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all text-xs font-bold uppercase shadow active:scale-95"
                          >
                            <Send className="w-3 h-3" />
                            Add Update
                          </button>
                          <button
                            onClick={() => {
                              setShowCustomTracking(false);
                              setCustomTracking({ status: "", location: "", notes: "" });
                            }}
                            className="px-3 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 hover:text-white border border-zinc-700 transition-all text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tracking History */}
                  <div className="p-3.5 bg-zinc-800/40 rounded-lg border border-zinc-700">
                    <h3 className="font-bold text-white mb-2.5 flex items-center gap-2 text-xs sm:text-sm">
                      <Clock className="w-3.5 h-3.5 text-yellow-400" />
                      Tracking History
                    </h3>
                    {selectedOrder.trackingHistory && selectedOrder.trackingHistory.length > 0 ? (
                      <div className="space-y-2.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                        {selectedOrder.trackingHistory.slice().reverse().map((track, index) => (
                          <div key={index} className="flex gap-2.5 text-xs">
                            <div className="flex flex-col items-center pt-1 shrink-0">
                              <div className={`w-2 h-2 rounded-full ${
                                index === 0 ? 'bg-green-400 ring-2 ring-green-950 animate-pulse' : 'bg-zinc-600'
                              }`}></div>
                              {index !== selectedOrder.trackingHistory.length - 1 && (
                                <div className="w-0.5 flex-1 bg-zinc-850 mt-1"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 pb-1.5 border-b border-zinc-850">
                              <div className="flex justify-between items-baseline gap-1">
                                <p className="font-bold text-white text-[11px] truncate">{track.status}</p>
                                <p className="text-[9px] text-zinc-500 shrink-0">{formatDate(track.date).split(',')[0]}</p>
                              </div>
                              <p className="text-[10px] text-zinc-400 mt-0.5">{track.location}</p>
                              {track.notes && (
                                <p className="text-[10px] text-zinc-500 mt-0.5 italic">{track.notes}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-500 text-center py-4">
                        No tracking updates yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Modal Footer */}
            <div className="sticky bottom-0 z-10 bg-zinc-900 border-t border-zinc-800 px-4 sm:px-6 py-3.5 flex justify-end">
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setShowCustomTracking(false);
                  setCustomTracking({ status: "", location: "", notes: "" });
                }}
                className="w-full sm:w-auto px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wider transition border border-zinc-700 active:scale-95"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}