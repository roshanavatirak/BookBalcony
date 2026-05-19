
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { 
  Package, TrendingUp, DollarSign, Eye, ShoppingCart, Activity, 
  AlertCircle, Clock, CheckCircle2, Boxes, Users, Star,
  ArrowUp, ArrowDown, Plus, Bell, Calendar, MapPin,
  RefreshCw, XCircle, Zap, TrendingDown, BarChart3, Wallet
} from "lucide-react";
import Alert from "../Alert/Alert";
import { useAlert } from "../Alert/useAlert";
import Loader from "../Loader/Loader";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

const SellerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { alert, hideAlert, success, error } = useAlert();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async (isAutoRefresh = false) => {
    if (!isAutoRefresh) setLoading(true);
    else setRefreshing(true);

    try {
      const [statsRes, ordersRes, productsRes, notificationsRes] = await Promise.all([
        axios.get(`${API_URL}/seller/dashboard-stats`, { headers }),
        axios.get(`${API_URL}/seller/orders?page=1&limit=5`, { headers }),
        axios.get(`${API_URL}/seller/myproducts`, { headers }),
        axios.get(`${API_URL}/seller/new-order-notifications`, { headers })
      ]);

      setStats(statsRes.data?.data);
      setRecentOrders(ordersRes.data?.data?.orders || []);

      const allProducts = productsRes.data?.books || [];
      const sortedByViews = [...allProducts].sort((a, b) => (b.views || 0) - (a.views || 0));
      setTopProducts(sortedByViews.slice(0, 5));

      const lowStock = allProducts.filter(p => p.stock > 0 && p.stock <= 5);
      setLowStockProducts(lowStock);

      setNotifications(notificationsRes.data?.data?.notifications || []);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      if (!isAutoRefresh) error("Failed to load dashboard data");
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
      "Order Placed": "bg-blue-500/20 text-blue-300 border-blue-500/50",
      "Processing": "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
      "Shipped": "bg-purple-500/20 text-purple-300 border-purple-500/50",
      "Out for Delivery": "bg-orange-500/20 text-orange-300 border-orange-500/50",
      "Delivered": "bg-green-500/20 text-green-300 border-green-500/50",
      "Cancelled": "bg-red-500/20 text-red-300 border-red-500/50",
    };
    return colors[status] || "bg-gray-500/20 text-gray-300 border-gray-500/50";
  };

  if (loading) {
    return <Loader fullPage text="Loading dashboard..." />;
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
                Seller Dashboard
              </h1>
              <p className="text-zinc-400 text-sm italic flex items-center justify-center gap-2">
                <Activity className="w-4 h-4 text-yellow-400 animate-pulse" />
                Overview of your store performance
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all flex items-center gap-2 border border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
          <hr className="border-zinc-700 rounded-full mx-auto w-1/2" />
        </div>

        {/* Notifications Banner */}
        {notifications.length > 0 && (
          <div className="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5 animate-pulse" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-300 text-sm mb-2">
                  {notifications.length} New Order{notifications.length > 1 ? 's' : ''}! 🎉
                </h3>
                <div className="space-y-2">
                  {notifications.slice(0, 3).map((notif) => (
                    <div key={notif._id} className="text-xs text-gray-300">
                      <span className="font-medium">{notif.book?.title}</span>
                      <span className="text-gray-500"> • ₹{notif.amount} • {formatDate(notif.createdAt)}</span>
                    </div>
                  ))}
                  {notifications.length > 3 && (
                    <Link to="/seller/orders" className="text-xs text-blue-400 hover:text-blue-300">
                      +{notifications.length - 3} more orders
                    </Link>
                  )}
                </div>
              </div>
              <Link
                to="/seller/orders"
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-all"
              >
                View All
              </Link>
            </div>
          </div>
        )}

        {/* Main Stats Grid — 4 cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">

            {/* ✅ Total Revenue (totalEarned — all delivered orders, ever) */}
            <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-4 hover:border-green-400/50 transition-all group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-xs font-semibold">Total Revenue</span>
                <div className="p-2 bg-green-400/10 rounded-lg group-hover:bg-green-400/20 transition-colors">
                  <DollarSign className="w-4 h-4 text-green-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                ₹{(stats.overview.totalRevenue || 0).toLocaleString()}
              </p>
              <div className="flex items-center gap-1 text-xs">
                <CheckCircle2 className="w-3 h-3 text-green-400" />
                <span className="text-green-400 font-medium">From delivered orders</span>
              </div>
            </div>

            {/* 💰 Wallet Balance (available to withdraw) */}
            <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-4 hover:border-yellow-400/50 transition-all group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-xs font-semibold">Wallet Balance</span>
                <div className="p-2 bg-yellow-400/10 rounded-lg group-hover:bg-yellow-400/20 transition-colors">
                  <Wallet className="w-4 h-4 text-yellow-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                ₹{(stats.overview.walletBalance || 0).toLocaleString()}
              </p>
              <p className="text-xs text-yellow-400 font-medium">Available to withdraw</p>
            </div>

            {/* ⏳ Pending Revenue (in-transit, not yet paid out) */}
            <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-4 hover:border-orange-400/50 transition-all group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-xs font-semibold">Pending</span>
                <div className="p-2 bg-orange-400/10 rounded-lg group-hover:bg-orange-400/20 transition-colors">
                  <Clock className="w-4 h-4 text-orange-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                ₹{(stats.overview.pendingRevenue || 0).toLocaleString()}
              </p>
              <p className="text-xs text-orange-400 font-medium">Awaiting delivery</p>
            </div>

            {/* 📦 Total Orders */}
            <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-4 hover:border-blue-400/50 transition-all group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-xs font-semibold">Total Orders</span>
                <div className="p-2 bg-blue-400/10 rounded-lg group-hover:bg-blue-400/20 transition-colors">
                  <ShoppingCart className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                {stats.overview.totalOrders}
              </p>
              <p className="text-xs text-blue-400 font-medium">All time</p>
            </div>
          </div>
        )}

        {/* Secondary Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-3">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="w-3 h-3 text-cyan-400" />
                <span className="text-zinc-400 text-xs font-semibold">Total Views</span>
              </div>
              <p className="text-xl font-bold text-white">
                {topProducts.reduce((sum, p) => sum + (p.views || 0), 0).toLocaleString()}
              </p>
            </div>

            <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-3">
              <div className="flex items-center gap-2 mb-1">
                <Boxes className="w-3 h-3 text-orange-400" />
                <span className="text-zinc-400 text-xs font-semibold">Total Stock</span>
              </div>
              <p className="text-xl font-bold text-white">
                {topProducts.reduce((sum, p) => sum + (p.stock || 0), 0)}
              </p>
            </div>

            {/* Total Withdrawn */}
            <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-3">
              <div className="flex items-center gap-2 mb-1">
                <ArrowDown className="w-3 h-3 text-purple-400" />
                <span className="text-zinc-400 text-xs font-semibold">Withdrawn</span>
              </div>
              <p className="text-xl font-bold text-white">
                ₹{(stats.overview.totalWithdrawn || 0).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Link
            to="/seller/add-book"
            className="p-4 bg-gradient-to-br from-yellow-400/10 to-yellow-500/10 border border-yellow-400/30 rounded-lg hover:border-yellow-400/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-400/20 rounded-lg group-hover:bg-yellow-400/30 transition-colors">
                <Plus className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Add Product</p>
                <p className="text-xs text-zinc-400">List new item</p>
              </div>
            </div>
          </Link>

          <Link
            to="/seller/myproducts"
            className="p-4 bg-gradient-to-br from-blue-400/10 to-blue-500/10 border border-blue-400/30 rounded-lg hover:border-blue-400/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-400/20 rounded-lg group-hover:bg-blue-400/30 transition-colors">
                <Package className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">My Products</p>
                <p className="text-xs text-zinc-400">View inventory</p>
              </div>
            </div>
          </Link>

          <Link
            to="/seller/orders"
            className="p-4 bg-gradient-to-br from-green-400/10 to-green-500/10 border border-green-400/30 rounded-lg hover:border-green-400/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-400/20 rounded-lg group-hover:bg-green-400/30 transition-colors">
                <ShoppingCart className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Orders</p>
                <p className="text-xs text-zinc-400">Manage orders</p>
              </div>
            </div>
          </Link>

          <Link
            to="/seller/profile"
            className="p-4 bg-gradient-to-br from-purple-400/10 to-purple-500/10 border border-purple-400/30 rounded-lg hover:border-purple-400/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-400/20 rounded-lg group-hover:bg-purple-400/30 transition-colors">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Profile</p>
                <p className="text-xs text-zinc-400">Edit details</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Recent Orders */}
          <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-green-400" />
                Recent Orders
              </h2>
              <Link to="/seller/orders" className="text-xs text-yellow-400 hover:text-yellow-300">
                View All →
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order._id} className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-all">
                    <div className="flex gap-3">
                      <img
                        src={order.book?.url}
                        alt={order.book?.title}
                        className="w-12 h-16 object-cover rounded border border-zinc-700"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {order.book?.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Order #{order._id.slice(-6)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-yellow-400">
                          ₹{order.amountPayable.toLocaleString()}
                        </p>
                        {/* Show wallet-credited badge for delivered orders */}
                        {order.orderStatus === "Delivered" && (
                          <span className="text-xs text-green-400 flex items-center gap-0.5 justify-end mt-1">
                            <Wallet className="w-3 h-3" /> Credited
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
          <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                Top Products
              </h2>
              <Link to="/seller/myproducts" className="text-xs text-yellow-400 hover:text-yellow-300">
                View All →
              </Link>
            </div>

            {topProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No products yet</p>
                <Link
                  to="/seller/add-book"
                  className="inline-block mt-3 px-4 py-2 bg-yellow-400/20 text-yellow-400 rounded-lg text-xs hover:bg-yellow-400/30 transition-all"
                >
                  Add Your First Product
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {topProducts.slice(0, 5).map((product, index) => (
                  <div key={product._id} className="p-3 bg-zinc-900/50 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-all">
                    <div className="flex gap-3">
                      <div className="relative">
                        <img
                          src={product.url || product.images?.[0]?.url}
                          alt={product.title}
                          className="w-12 h-16 object-cover rounded border border-zinc-700"
                        />
                        <div className="absolute -top-1 -left-1 w-5 h-5 bg-yellow-400 text-black rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {product.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {product.author}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3 text-purple-400" />
                            <span className="text-gray-400">{product.views || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Boxes className="w-3 h-3 text-blue-400" />
                            <span className="text-gray-400">{product.stock || 0}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-yellow-400">
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
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-300 text-sm mb-3">
                  Low Stock Alert — {lowStockProducts.length} Product{lowStockProducts.length > 1 ? 's' : ''}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {lowStockProducts.slice(0, 4).map((product) => (
                    <div key={product._id} className="flex items-center gap-3 p-2 bg-red-500/5 rounded border border-red-500/20">
                      <img
                        src={product.url || product.images?.[0]?.url}
                        alt={product.title}
                        className="w-10 h-14 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{product.title}</p>
                        <p className="text-xs text-red-400 font-semibold">Only {product.stock} left!</p>
                      </div>
                    </div>
                  ))}
                </div>
                {lowStockProducts.length > 4 && (
                  <Link
                    to="/seller/myproducts"
                    className="text-xs text-red-400 hover:text-red-300 mt-3 inline-block"
                  >
                    +{lowStockProducts.length - 4} more products need restocking
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