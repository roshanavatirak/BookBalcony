import { useState, useEffect } from "react";
import { Package, TrendingUp, Clock, CheckCircle, XCircle, Bell, AlertCircle, RefreshCw, Trash2, Eye, MapPin, User, Phone, Mail, Calendar, DollarSign, CreditCard, Truck, Box, Activity, ChevronDown, Filter, Search, Plus, Send } from "lucide-react";
import Alert from "../Alert/Alert";
import { useAlert } from "../Alert/useAlert";
import Loader from "../Loader/Loader";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

export default function SellerOrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
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

  // Fetch data on mount and when filters change
  useEffect(() => {
    fetchOrders();
  }, [filterStatus, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10
      });
      
      if (filterStatus !== "all") {
        queryParams.append("status", filterStatus);
      }

      const response = await fetch(
        `${API_URL}/seller/orders?${queryParams}`,
        { headers }
      );

      const data = await response.json();
      
      console.log('📦 API Response:', data);

      if (data.success) {
        setOrders(data.data.orders || []);
        setStats(data.data.stats || null);
        setPagination(data.data.pagination || null);
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
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white px-4 sm:px-8 py-6 flex justify-center">
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

      <div className="w-full max-w-7xl bg-zinc-900/50 rounded-2xl px-6 sm:px-10 py-6 shadow-xl border border-zinc-700">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent mb-2">
                Orders Dashboard
              </h1>
              <p className="text-zinc-400 text-sm italic flex items-center justify-center gap-2">
                <Activity className="w-4 h-4 text-yellow-400" />
                Manage orders and track deliveries
              </p>
            </div>
          </div>
          <hr className="border-zinc-700 rounded-full mx-auto w-1/2" />
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-3 hover:border-blue-400/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-xs font-semibold">Total Orders</span>
                <div className="p-2 bg-blue-400/10 rounded-lg">
                  <Package className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                {stats.total || 0}
              </p>
              <p className="text-xs text-blue-400 mt-1">📦 All time</p>
            </div>

            <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-3 hover:border-yellow-400/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-xs font-semibold">Pending Orders</span>
                <div className="p-2 bg-yellow-400/10 rounded-lg">
                  <Clock className="w-4 h-4 text-yellow-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                {stats.pending || 0}
              </p>
              <p className="text-xs text-yellow-400 mt-1">⏳ To be processed</p>
            </div>

            <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-3 hover:border-purple-400/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-xs font-semibold">Shipped</span>
                <div className="p-2 bg-purple-400/10 rounded-lg">
                  <Truck className="w-4 h-4 text-purple-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                {stats.shipped || 0}
              </p>
              <p className="text-xs text-purple-400 mt-1">🚚 In transit</p>
            </div>

            <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-3 hover:border-green-400/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-xs font-semibold">Delivered</span>
                <div className="p-2 bg-green-400/10 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                {stats.delivered || 0}
              </p>
              <p className="text-xs text-green-400 mt-1">✅ Completed</p>
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
              </select>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        {loading ? (
          <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-12 text-center">
            <Loader size="md" />
            <p className="text-gray-400 mt-4">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-12 text-center">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No orders found</h3>
            <p className="text-gray-400 text-sm">
              {searchTerm ? "Try adjusting your search" : filterStatus !== "all" ? `No orders with status: ${filterStatus}` : "Orders will appear here when customers make purchases"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {filteredOrders.map((order) => (
                <div key={order._id} className="bg-zinc-800/40 rounded-lg border border-zinc-700 overflow-hidden hover:border-yellow-400/50 transition-all group">
                  <div className="p-4">
                    {/* Order Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-3">
                        <img
                          src={order.book?.url || "/placeholder.jpg"}
                          alt={order.book?.title}
                          className="w-14 h-18 object-cover rounded-lg border-2 border-zinc-700 group-hover:border-yellow-400/50 transition-colors"
                        />
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-yellow-400 transition-colors text-sm">
                            {order.book?.title || 'Unknown Book'}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">
                            Order #{order._id.slice(-8)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(order.orderStatus)}`}>
                              {order.orderStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                          ₹{order.amountPayable?.toLocaleString() || 0}
                        </p>
                        <p className={`text-xs font-medium mt-1 ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentMethod} - {order.paymentStatus}
                        </p>
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-blue-400" />
                        <div>
                          <p className="text-xs text-gray-500">Order Date</p>
                          <p className="text-xs text-gray-300 font-medium">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-orange-400" />
                        <div>
                          <p className="text-xs text-gray-500">Expected Delivery</p>
                          <p className="text-xs text-gray-300 font-medium">
                            {formatDate(order.expectedDeliveryDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-purple-400" />
                        <div>
                          <p className="text-xs text-gray-500">Customer</p>
                          <p className="text-xs text-gray-300 font-medium">{order.shippingAddress?.fullName || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-green-400" />
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="text-xs text-gray-300 font-medium">{order.currentLocation || "Warehouse"}</p>
                        </div>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all text-sm font-semibold shadow-lg"
                    >
                      <Eye className="w-4 h-4" />
                      View Full Details & Update Status
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
                  className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700 transition"
                >
                  Previous
                </button>
                <span className="text-gray-400 text-sm">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-700 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-700 max-w-4xl w-full my-8">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Order Details</h2>
                    <p className="text-sm text-gray-400">Order ID: {selectedOrder._id}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedOrder(null);
                      setShowCustomTracking(false);
                      setCustomTracking({ status: "", location: "", notes: "" });
                    }}
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Book Information */}
                    <div className="p-4 bg-zinc-800/40 rounded-lg border border-zinc-700">
                      <h3 className="font-semibold text-white mb-3 flex items-center gap-2 text-sm">
                        <Box className="w-4 h-4 text-yellow-400" />
                        Book Information
                      </h3>
                      <div className="flex gap-3">
                        <img
                          src={selectedOrder.book?.url}
                          alt={selectedOrder.book?.title}
                          className="w-16 h-24 object-cover rounded-lg border-2 border-zinc-700"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-white text-sm">{selectedOrder.book?.title}</p>
                          <p className="text-xs text-gray-400 mt-1">Language: {selectedOrder.book?.language}</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div className="p-4 bg-zinc-800/40 rounded-lg border border-zinc-700">
                      <h3 className="font-semibold text-white mb-3 flex items-center gap-2 text-sm">
                        <CreditCard className="w-4 h-4 text-green-400" />
                        Payment Information
                      </h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Amount</p>
                          <p className="font-medium text-white text-lg">₹{selectedOrder.amountPayable?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Method</p>
                          <p className="font-medium text-white text-sm">{selectedOrder.paymentMethod}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Status</p>
                          <p className={`font-medium text-sm ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                            {selectedOrder.paymentStatus}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Order Date</p>
                          <p className="font-medium text-white text-xs">
                            {formatDate(selectedOrder.createdAt)}
                          </p>
                        </div>
                        {selectedOrder.discount > 0 && (
                          <div>
                            <p className="text-gray-500 text-xs">Discount</p>
                            <p className="font-medium text-green-400 text-sm">-₹{selectedOrder.discount}</p>
                          </div>
                        )}
                        {selectedOrder.handlingFee > 0 && (
                          <div>
                            <p className="text-gray-500 text-xs">Handling Fee</p>
                            <p className="font-medium text-yellow-400 text-sm">+₹{selectedOrder.handlingFee}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Customer Information */}
                    <div className="p-4 bg-zinc-800/40 rounded-lg border border-zinc-700">
                      <h3 className="font-semibold text-white mb-3 flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-purple-400" />
                        Customer Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-500 text-xs">Name:</span>
                          <span className="font-medium text-white text-xs">{selectedOrder.shippingAddress?.fullName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-500 text-xs">Phone:</span>
                          <span className="font-medium text-white text-xs">{selectedOrder.shippingAddress?.phone}</span>
                        </div>
                        {selectedOrder.user?.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-500 text-xs">Email:</span>
                            <span className="font-medium text-white text-xs">{selectedOrder.user.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="p-4 bg-zinc-800/40 rounded-lg border border-zinc-700">
                      <h3 className="font-semibold text-white mb-3 flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-orange-400" />
                        Delivery Address
                      </h3>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {selectedOrder.shippingAddress?.addressLine1}
                        {selectedOrder.shippingAddress?.addressLine2 && `, ${selectedOrder.shippingAddress.addressLine2}`}
                        <br />
                        {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.postalCode}
                        <br />
                        {selectedOrder.shippingAddress?.country || 'India'}
                      </p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Update Order Status */}
                    <div className="p-4 bg-zinc-800/40 rounded-lg border border-zinc-700">
                      <h3 className="font-semibold text-white mb-3 flex items-center gap-2 text-sm">
                        <Truck className="w-4 h-4 text-blue-400" />
                        Update Order Status
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {["Processing", "Shipped", "Out for Delivery", "Delivered"].map((status) => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(selectedOrder._id, status)}
                            disabled={selectedOrder.orderStatus === status}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                              selectedOrder.orderStatus === status
                                ? "bg-zinc-700 text-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                            }`}
                          >
                            {selectedOrder.orderStatus === status && <CheckCircle className="w-3 h-3 inline mr-1" />}
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Tracking Update */}
                    <div className="p-4 bg-zinc-800/40 rounded-lg border border-zinc-700">
                      <h3 className="font-semibold text-white mb-3 flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-green-400" />
                        Add Custom Tracking Update
                      </h3>
                      
                      {!showCustomTracking ? (
                        <button
                          onClick={() => setShowCustomTracking(true)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all text-sm font-semibold"
                        >
                          <Plus className="w-4 h-4" />
                          Add Custom Update
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Status Message</label>
                            <input
                              type="text"
                              placeholder="e.g., Arrived at sorting facility"
                              value={customTracking.status}
                              onChange={(e) => setCustomTracking({...customTracking, status: e.target.value})}
                              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none"
                            />
                          </div>
                          
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Current Location</label>
                            <input
                              type="text"
                              placeholder="e.g., Mumbai Distribution Center"
                              value={customTracking.location}
                              onChange={(e) => setCustomTracking({...customTracking, location: e.target.value})}
                              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none"
                            />
                          </div>
                          
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Notes (Optional)</label>
                            <textarea
                              placeholder="Additional details..."
                              value={customTracking.notes}
                              onChange={(e) => setCustomTracking({...customTracking, notes: e.target.value})}
                              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none resize-none"
                              rows="2"
                            />
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={addCustomTrackingUpdate}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all text-sm font-semibold"
                            >
                              <Send className="w-4 h-4" />
                              Add Update
                            </button>
                            <button
                              onClick={() => {
                                setShowCustomTracking(false);
                                setCustomTracking({ status: "", location: "", notes: "" });
                              }}
                              className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-all text-sm font-semibold"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Tracking History */}
                    <div className="p-4 bg-zinc-800/40 rounded-lg border border-zinc-700">
                      <h3 className="font-semibold text-white mb-3 flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-yellow-400" />
                        Tracking History
                      </h3>
                      {selectedOrder.trackingHistory && selectedOrder.trackingHistory.length > 0 ? (
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                          {selectedOrder.trackingHistory.map((track, index) => (
                            <div key={index} className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <div className={`w-2.5 h-2.5 rounded-full ${
                                  index === 0 ? 'bg-green-400' : 'bg-blue-400'
                                }`}></div>
                                {index !== selectedOrder.trackingHistory.length - 1 && (
                                  <div className="w-0.5 h-full bg-zinc-700 mt-1"></div>
                                )}
                              </div>
                              <div className="flex-1 pb-3">
                                <p className="font-medium text-xs text-white">{track.status}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{track.location}</p>
                                {track.notes && (
                                  <p className="text-xs text-gray-500 mt-1 italic">{track.notes}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDate(track.date)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 text-center py-4">
                          No tracking updates yet.
                        </p>
                      )}
                    </div>

                    {/* Current Status Info */}
                    <div className="p-4 bg-zinc-800/40 rounded-lg border border-zinc-700">
                      <h3 className="font-semibold text-white mb-3 flex items-center gap-2 text-sm">
                        <Activity className="w-4 h-4 text-green-400" />
                        Current Status
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">Order Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getStatusColor(selectedOrder.orderStatus)}`}>
                            {selectedOrder.orderStatus}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">Current Location:</span>
                          <span className="text-xs text-white font-medium">{selectedOrder.currentLocation || 'Warehouse'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">Expected Delivery:</span>
                          <span className="text-xs text-white font-medium">{formatDate(selectedOrder.expectedDeliveryDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}