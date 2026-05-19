import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaEdit, FaTrash, FaEye, FaClock, FaCheckCircle, FaTimesCircle,
  FaFilter, FaSearch, FaSort, FaChartBar, FaBox, FaDollarSign,
  FaEyeSlash, FaShoppingCart, FaTimes, FaCheck, FaPencilAlt,
  FaImage, FaCalendar, FaTag, FaBook, FaUserCircle, FaWarehouse
} from 'react-icons/fa';
import { 
  TrendingUp, Package, Activity, Zap, RefreshCw, AlertCircle,
  ChevronDown, X, Check, Pencil, ArrowUp, ArrowDown, Settings
} from 'lucide-react';
import Alert from '../../Alert/Alert';
import { useAlert } from '../../Alert/useAlert';
import Loader from '../../Loader/Loader';

const SellerProduct = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [autoStatusMode, setAutoStatusMode] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [editingPrice, setEditingPrice] = useState(null);
  const [newStockValue, setNewStockValue] = useState('');
  const [newPriceValue, setNewPriceValue] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const { alert, showAlert, hideAlert, success, error, warning, info } = useAlert();
const BASE_URL = import.meta.env.VITE_API_URL
  const API_URL = `${BASE_URL}/api/v1`;

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    fetchBooks();
    fetchAutoStatusSetting();
  }, []);

  useEffect(() => {
    filterAndSortBooks();
  }, [filter, books, searchTerm, sortBy]);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/all-books`, { headers });
      setBooks(res.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching books:", err);
      error("Failed to fetch books. Please try again.");
      setLoading(false);
    }
  };

  const fetchAutoStatusSetting = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/auto-status-setting`, { headers });
      setAutoStatusMode(res.data.autoMode);
    } catch (err) {
      console.error("Error fetching auto status setting:", err);
    }
  };

  const filterAndSortBooks = () => {
    let filtered = [...books];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filter === 'new') {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      filtered = filtered.filter(book => new Date(book.createdAt) > threeDaysAgo);
    } else if (filter !== 'all') {
      filtered = filtered.filter(book => book.productStatus === filter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'stock-high':
          return (b.stock || 0) - (a.stock || 0);
        case 'stock-low':
          return (a.stock || 0) - (b.stock || 0);
        case 'views':
          return (b.views || 0) - (a.views || 0);
        case 'sales':
          return (b.sold || 0) - (a.sold || 0);
        default:
          return 0;
      }
    });

    setFilteredBooks(filtered);
  };

  const updateBookStatus = async (bookId, newStatus) => {
    try {
      await axios.put(
        `${API_URL}/admin/book-status/${bookId}`,
        { status: newStatus },
        { headers }
      );
      fetchBooks();
      success(`Book status updated to: ${newStatus}`);
      setShowModal(false);
    } catch (err) {
      console.error("Error updating book status:", err);
      error('Failed to update book status');
    }
  };

  const updateBookStock = async (bookId) => {
    try {
      const stockValue = parseInt(newStockValue);
      if (isNaN(stockValue) || stockValue < 0) {
        warning("Please enter a valid stock quantity (0 or more)");
        return;
      }

      await axios.put(
        `${API_URL}/admin/update-book-stock/${bookId}`,
        { stock: stockValue },
        { headers }
      );
      
      setBooks(books.map(book => 
        book._id === bookId ? { ...book, stock: stockValue } : book
      ));
      setEditingStock(null);
      setNewStockValue('');
      success(`Stock updated to ${stockValue} units`);
    } catch (err) {
      console.error("Error updating stock:", err);
      error('Failed to update stock');
    }
  };

  const updateBookPrice = async (bookId) => {
    try {
      const priceValue = parseFloat(newPriceValue);
      if (isNaN(priceValue) || priceValue <= 0) {
        warning("Please enter a valid price (greater than 0)");
        return;
      }

      await axios.put(
        `${API_URL}/admin/update-book-price/${bookId}`,
        { price: priceValue },
        { headers }
      );
      
      setBooks(books.map(book => 
        book._id === bookId ? { ...book, price: priceValue } : book
      ));
      setEditingPrice(null);
      setNewPriceValue('');
      success(`Price updated to ₹${priceValue}`);
    } catch (err) {
      console.error("Error updating price:", err);
      error('Failed to update price');
    }
  };

  const toggleAutoStatusMode = async () => {
    try {
      const newMode = !autoStatusMode;
      await axios.put(
        `${API_URL}/admin/auto-status-setting`,
        { autoMode: newMode },
        { headers }
      );
      setAutoStatusMode(newMode);
      success(`Auto status mode ${newMode ? 'enabled' : 'disabled'}`);
    } catch (err) {
      console.error("Error toggling auto status:", err);
      error('Failed to update auto status setting');
    }
  };

  const deleteBook = async (bookId) => {
    try {
      await axios.delete(`${API_URL}/seller/delete-book/${bookId}`, { headers });
      setBooks(books.filter(book => book._id !== bookId));
      setShowDeleteConfirm(null);
      success('Book deleted successfully!');
    } catch (err) {
      console.error("Error deleting book:", err);
      error('Failed to delete book');
    }
  };

  const approveBook = async (bookId) => {
    try {
      await axios.put(`${API_URL}/admin/approve-book/${bookId}`, {}, { headers });
      fetchBooks();
      success('Book approved successfully!');
      setShowModal(false);
    } catch (err) {
      console.error("Error approving book:", err);
      error('Failed to approve book');
    }
  };

  const rejectBook = async (bookId, reason) => {
    try {
      await axios.put(`${API_URL}/admin/reject-book/${bookId}`, { reason }, { headers });
      fetchBooks();
      warning(`Book rejected: ${reason}`);
      setShowModal(false);
    } catch (err) {
      console.error("Error rejecting book:", err);
      error('Failed to reject book');
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "N/A";
      
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const compareDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const diffTime = today.getTime() - compareDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;
      if (diffDays >= 7 && diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
      }
      
      return d.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
      });
    } catch (error) {
      return "N/A";
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Available': { 
        bg: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20',
        text: 'text-green-300',
        border: 'border-green-500/50',
        icon: FaCheckCircle
      },
      'Sold Out': { 
        bg: 'bg-gradient-to-r from-red-500/20 to-rose-500/20',
        text: 'text-red-300',
        border: 'border-red-500/50',
        icon: FaTimesCircle
      },
      'Not Available': { 
        bg: 'bg-gradient-to-r from-gray-500/20 to-slate-500/20',
        text: 'text-gray-300',
        border: 'border-gray-500/50',
        icon: FaEyeSlash
      },
      'Arriving Soon': { 
        bg: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20',
        text: 'text-blue-300',
        border: 'border-blue-500/50',
        icon: FaClock
      }
    };
    
    const config = statusConfig[status] || statusConfig['Not Available'];
    const Icon = config.icon;
    
    return { ...config, Icon };
  };

  const getStockLevel = (stock) => {
    if (stock === 0) return { level: "Out of Stock", color: "text-red-400", bg: "bg-red-500/10" };
    if (stock <= 5) return { level: "Low Stock", color: "text-yellow-400", bg: "bg-yellow-500/10" };
    if (stock <= 20) return { level: "In Stock", color: "text-blue-400", bg: "bg-blue-500/10" };
    return { level: "High Stock", color: "text-green-400", bg: "bg-green-500/10" };
  };

  // Calculate statistics
  const totalBooks = books.length;
  const totalRevenue = books.reduce((sum, book) => sum + (book.sold || 0) * book.price, 0);
  const totalViews = books.reduce((sum, book) => sum + (book.views || 0), 0);
  const totalSold = books.reduce((sum, book) => sum + (book.sold || 0), 0);
  const availableBooks = books.filter(b => b.productStatus === "Available" && b.stock > 0).length;
  const lowStockBooks = books.filter(b => b.stock > 0 && b.stock <= 5).length;
  const totalStock = books.reduce((sum, book) => sum + (book.stock || 0), 0);

  if (loading) {
    return <Loader fullPage text="Loading books..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-zinc-900 to-black text-white p-6">
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

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between animate-slideDown">
          <div>
            <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-purple-400 via-fuchsia-300 to-pink-500 bg-clip-text text-transparent animate-gradient">
              📚 Admin Book Management
            </h1>
            <p className="text-gray-400 text-lg flex items-center gap-2">
              <Settings className="w-4 h-4 text-purple-400 animate-pulse" />
              Manage all seller products and inventory
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-zinc-800/80 via-zinc-900/80 to-black/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-700/50 p-6 hover:border-purple-400/50 transition-all duration-500 group hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Books</span>
              <div className="p-3 bg-gradient-to-br from-purple-400/20 to-fuchsia-500/20 rounded-2xl group-hover:scale-110 transition-all">
                <FaBook className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <p className="text-4xl font-black text-white mb-2">{totalBooks}</p>
            <div className="flex items-center gap-2 text-sm">
              <ArrowUp className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 font-semibold">{availableBooks} Available</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-zinc-800/80 via-zinc-900/80 to-black/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-700/50 p-6 hover:border-green-400/50 transition-all duration-500 group hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Revenue</span>
              <div className="p-3 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-2xl group-hover:scale-110 transition-all">
                <FaDollarSign className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <p className="text-4xl font-black text-white mb-2">₹{totalRevenue.toLocaleString()}</p>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-semibold">From {totalSold} sales</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-zinc-800/80 via-zinc-900/80 to-black/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-700/50 p-6 hover:border-blue-400/50 transition-all duration-500 group hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Views</span>
              <div className="p-3 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-2xl group-hover:scale-110 transition-all">
                <FaEye className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <p className="text-4xl font-black text-white mb-2">{totalViews.toLocaleString()}</p>
            <div className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
              <span className="text-blue-400 font-semibold">Total Engagement</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-zinc-800/80 via-zinc-900/80 to-black/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-700/50 p-6 hover:border-orange-400/50 transition-all duration-500 group hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Stock</span>
              <div className="p-3 bg-gradient-to-br from-orange-400/20 to-amber-500/20 rounded-2xl group-hover:scale-110 transition-all">
                <FaWarehouse className="w-6 h-6 text-orange-400" />
              </div>
            </div>
            <p className="text-4xl font-black text-white mb-2">{totalStock}</p>
            <div className="flex items-center gap-2 text-sm">
              {lowStockBooks > 0 ? (
                <>
                  <AlertCircle className="w-4 h-4 text-yellow-400 animate-pulse" />
                  <span className="text-yellow-400 font-semibold">{lowStockBooks} Low Stock</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-orange-400" />
                  <span className="text-orange-400 font-semibold">All Healthy</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Auto Status Control */}
        <div className="bg-gradient-to-br from-zinc-800/60 via-zinc-900/60 to-black/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-700/50 p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Settings className="w-6 h-6 text-purple-400" />
                Auto Status Mode
              </h2>
              <p className="text-gray-400">
                {autoStatusMode 
                  ? '✅ New books automatically change from "Arriving Soon" to "Available"' 
                  : '⚠️ New books require manual status approval'}
              </p>
            </div>
            <button
              onClick={toggleAutoStatusMode}
              className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg flex items-center gap-2 ${
                autoStatusMode
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-green-500/30'
                  : 'bg-gradient-to-r from-gray-600 to-slate-700 hover:from-gray-700 hover:to-slate-800 text-white shadow-gray-500/30'
              }`}
            >
              <RefreshCw className="w-5 h-5" />
              {autoStatusMode ? 'Auto Mode: ON' : 'Manual Mode: ON'}
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gradient-to-br from-zinc-800/60 via-zinc-900/60 to-black/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-700/50 p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative group">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search by title, author, or category..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-12 pr-4 py-4 bg-zinc-900/80 border border-zinc-700 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all text-white placeholder-gray-500 font-medium hover:border-zinc-600" 
              />
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                filter === 'all' 
                  ? 'bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white shadow-lg shadow-purple-500/30' 
                  : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
              }`}
            >
              All Books ({totalBooks})
            </button>
            <button
              onClick={() => setFilter('new')}
              className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                filter === 'new' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
              }`}
            >
              🆕 New Additions
            </button>
            <button
              onClick={() => setFilter('Arriving Soon')}
              className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                filter === 'Arriving Soon' 
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg shadow-yellow-500/30' 
                  : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
              }`}
            >
              🕒 Arriving Soon
            </button>
            <button
              onClick={() => setFilter('Available')}
              className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                filter === 'Available' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30' 
                  : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
              }`}
            >
              ✅ Available
            </button>
            <button
              onClick={() => setFilter('Sold Out')}
              className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                filter === 'Sold Out' 
                  ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30' 
                  : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
              }`}
            >
              ❌ Sold Out
            </button>
            <button
              onClick={() => setFilter('Not Available')}
              className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
                filter === 'Not Available' 
                  ? 'bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg shadow-gray-500/30' 
                  : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
              }`}
            >
              ⛔ Not Available
            </button>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-3 bg-zinc-900/80 px-5 rounded-2xl border border-zinc-700 hover:border-zinc-600 transition-all group w-fit">
            <FaSort className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              className="bg-transparent py-4 pr-8 focus:outline-none text-white font-semibold cursor-pointer"
            >
              <option value="newest" className="bg-zinc-900">🆕 Newest First</option>
              <option value="oldest" className="bg-zinc-900">📅 Oldest First</option>
              <option value="price-high" className="bg-zinc-900">💰 Price: High to Low</option>
              <option value="price-low" className="bg-zinc-900">💵 Price: Low to High</option>
              <option value="stock-high" className="bg-zinc-900">📦 Stock: High to Low</option>
              <option value="stock-low" className="bg-zinc-900">⚠️ Stock: Low to High</option>
              <option value="views" className="bg-zinc-900">👁️ Most Viewed</option>
              <option value="sales" className="bg-zinc-900">🛒 Most Sold</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="bg-gradient-to-br from-zinc-800/60 via-zinc-900/60 to-black/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-700/50 p-16 text-center">
            <FaBox className="w-24 h-24 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-3">No books found</h3>
            <p className="text-gray-400 text-lg">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book, index) => {
              const statusBadge = getStatusBadge(book.productStatus);
              const stockInfo = getStockLevel(book.stock || 0);
              
              return (
                <div 
                  key={book._id} 
                  className="bg-gradient-to-br from-zinc-800/60 via-zinc-900/60 to-black/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-700/50 overflow-hidden hover:border-purple-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-400/20 hover:-translate-y-2 group animate-fadeInUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative h-64 bg-gradient-to-br from-zinc-900 to-black overflow-hidden">
                    {book.images && book.images[0] && (
                      <img 
                        src={book.images[0].url} 
                        alt={book.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm ${statusBadge.bg} ${statusBadge.text} border ${statusBadge.border} shadow-lg flex items-center gap-1.5`}>
                        <statusBadge.Icon className="w-3.5 h-3.5" />
                        {book.productStatus}
                      </span>
                      
                      {/* Approval Status Badge */}
                      {!book.isApproved && book.adminApproval !== "Approved" && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 shadow-lg flex items-center gap-1.5">
                          <FaClock className="w-3.5 h-3.5 animate-pulse" />
                          Pending Approval
                        </span>
                      )}
                      
                      {book.adminApproval === "Rejected" && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm bg-red-500/20 text-red-300 border border-red-500/50 shadow-lg flex items-center gap-1.5">
                          <FaTimesCircle className="w-3.5 h-3.5" />
                          Rejected
                        </span>
                      )}
                    </div>

                    {/* Stock Badge with Edit */}
                    <div className="absolute top-4 right-4 z-10">
                      {editingStock === book._id ? (
                        <div className="flex items-center gap-2 bg-black/90 backdrop-blur-sm rounded-xl p-2 border border-white/20 shadow-xl">
                          <input
                            type="number"
                            min="0"
                            value={newStockValue}
                            onChange={(e) => setNewStockValue(e.target.value)}
                            className="w-20 px-2 py-1 bg-zinc-800 border border-zinc-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                            placeholder="Stock"
                            autoFocus
                          />
                          <button
                            onClick={() => updateBookStock(book._id)}
                            className="p-1.5 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
                          >
                            <Check className="w-4 h-4 text-green-400" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingStock(null);
                              setNewStockValue("");
                            }}
                            className="p-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      ) : (
                        <div className={`flex items-center gap-2 ${stockInfo.bg} backdrop-blur-sm rounded-full border border-white/20 shadow-lg pl-3 pr-2 py-1.5 group/stock`}>
                          <span className={`text-xs font-bold ${stockInfo.color}`}>
                            {book.stock || 0}
                          </span>
                          <button
                            onClick={() => {
                              setEditingStock(book._id);
                              setNewStockValue(book.stock?.toString() || "0");
                            }}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors opacity-0 group-hover/stock:opacity-100"
                          >
                            <Pencil className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Posted Date */}
                    <div className="absolute bottom-4 left-4 z-10">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full border border-white/10 shadow-lg">
                        <FaCalendar className="w-3 h-3 text-purple-400" />
                        <span className="text-xs font-semibold text-gray-200">
                          {formatDate(book.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Image Count */}
                    {book.images && book.images.length > 1 && (
                      <div className="absolute bottom-4 right-4 z-10">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full border border-white/10 shadow-lg">
                          <FaImage className="w-3 h-3 text-blue-400" />
                          <span className="text-xs font-semibold text-gray-200">
                            {book.images.length}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-lg text-white mb-1 line-clamp-2 group-hover:text-purple-400 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 flex items-center gap-1">
                      <FaUserCircle className="w-3 h-3" />
                      {book.author}
                    </p>

                    {/* Category Tag */}
                    {book.category && (
                      <div className="mb-4">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-xl text-xs text-gray-300 border border-zinc-600 font-semibold flex items-center gap-1 w-fit">
                          <FaTag className="w-3 h-3" />
                          {book.category}
                        </span>
                      </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-blue-500/10 rounded-lg p-2 border border-blue-500/20 text-center">
                        <FaEye className="w-3 h-3 text-blue-400 mx-auto mb-1" />
                        <p className="text-xs font-bold text-white">{book.views || 0}</p>
                      </div>
                      <div className="bg-green-500/10 rounded-lg p-2 border border-green-500/20 text-center">
                        <FaShoppingCart className="w-3 h-3 text-green-400 mx-auto mb-1" />
                        <p className="text-xs font-bold text-white">{book.sold || 0}</p>
                      </div>
                      <div className={`${stockInfo.bg} rounded-lg p-2 border ${stockInfo.color.replace('text-', 'border-')}/20 text-center`}>
                        <FaBox className={`w-3 h-3 ${stockInfo.color} mx-auto mb-1`} />
                        <p className="text-xs font-bold text-white">{book.stock || 0}</p>
                      </div>
                    </div>

                    {/* Price with Edit */}
                    <div className="mb-4 pb-4 border-b border-zinc-700/50">
                      {editingPrice === book._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={newPriceValue}
                            onChange={(e) => setNewPriceValue(e.target.value)}
                            className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-purple-400 outline-none"
                            placeholder="Price"
                            autoFocus
                          />
                          <button
                            onClick={() => updateBookPrice(book._id)}
                            className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
                          >
                            <Check className="w-4 h-4 text-green-400" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingPrice(null);
                              setNewPriceValue("");
                            }}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between group/price">
                          <span className="text-2xl font-black bg-gradient-to-r from-purple-400 via-fuchsia-300 to-pink-500 bg-clip-text text-transparent">
                            ₹{book.price.toLocaleString()}
                          </span>
                          <button
                            onClick={() => {
                              setEditingPrice(book._id);
                              setNewPriceValue(book.price?.toString() || "0");
                            }}
                            className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors opacity-0 group-hover/price:opacity-100"
                          >
                            <Pencil className="w-4 h-4 text-purple-400" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedBook(book);
                          setShowModal(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white rounded-xl hover:from-purple-600 hover:to-fuchsia-700 transition-all duration-300 text-sm font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                      >
                        <FaEye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(book._id)}
                        className="px-3 py-2.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all duration-300 border border-red-500/20 hover:border-red-500/40"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Book Detail Modal */}
        {showModal && selectedBook && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-gradient-to-br from-zinc-800 via-zinc-900 to-black rounded-3xl shadow-2xl border border-zinc-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
              <div className="p-8">
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-3xl font-bold text-white">{selectedBook.title}</h2>
                  <button 
                    onClick={() => setShowModal(false)} 
                    className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-xl"
                  >
                    <FaTimes className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Image */}
                  <div>
                    {selectedBook.images && selectedBook.images[0] && (
                      <img 
                        src={selectedBook.images[0].url} 
                        alt={selectedBook.title} 
                        className="w-full rounded-2xl shadow-2xl border border-zinc-700"
                      />
                    )}
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-5">
                    <div>
                      <h3 className="font-semibold text-gray-400 text-sm mb-1">Author</h3>
                      <p className="text-white text-lg">{selectedBook.author}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-400 text-sm mb-2">Price</h3>
                      <p className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        ₹{selectedBook.price.toLocaleString()}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-400 text-sm mb-2">Current Status</h3>
                      {(() => {
                        const statusBadge = getStatusBadge(selectedBook.productStatus);
                        const StatusIcon = statusBadge.Icon;
                        return (
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${statusBadge.bg} ${statusBadge.text} border ${statusBadge.border}`}>
                            <StatusIcon className="w-4 h-4" />
                            {selectedBook.productStatus}
                          </span>
                        );
                      })()}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-400 text-sm mb-1">Stock</h3>
                        <p className="text-white text-lg font-bold">{selectedBook.stock} units</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-400 text-sm mb-1">Category</h3>
                        <p className="text-white text-lg">{selectedBook.category}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-400 text-sm mb-1">Language</h3>
                        <p className="text-white text-lg">{selectedBook.language}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-400 text-sm mb-1">Edition/Year</h3>
                        <p className="text-white text-lg">{selectedBook.editionOrPublishYear}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-400 text-sm mb-1">Views</h3>
                        <p className="text-white text-lg font-bold">{selectedBook.views || 0}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-400 text-sm mb-1">Sold</h3>
                        <p className="text-white text-lg font-bold">{selectedBook.sold || 0}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-400 text-sm mb-1">Added On</h3>
                      <p className="text-white">{new Date(selectedBook.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <div className="mt-8">
                  <h3 className="font-semibold text-gray-400 text-sm mb-3">Description</h3>
                  <p className="text-gray-300 leading-relaxed">{selectedBook.desc}</p>
                </div>

                {/* Admin Approval Section */}
                {(!selectedBook.isApproved && selectedBook.adminApproval !== "Approved") && (
                  <div className="mt-8 p-6 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-2xl">
                    <h3 className="font-semibold text-yellow-300 text-lg mb-3 flex items-center gap-2">
                      <FaClock className="w-5 h-5 animate-pulse" />
                      Admin Approval Required
                    </h3>
                    <p className="text-gray-300 mb-4">
                      This book is pending admin approval. Once approved, sellers will be able to set it as "Available".
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => approveBook(selectedBook._id)}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-bold shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
                      >
                        <FaCheckCircle className="w-5 h-5" />
                        Approve Book
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt("Enter rejection reason:");
                          if (reason) {
                            rejectBook(selectedBook._id, reason);
                          }
                        }}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-300 font-bold shadow-lg shadow-red-500/30 flex items-center justify-center gap-2"
                      >
                        <FaTimesCircle className="w-5 h-5" />
                        Reject Book
                      </button>
                    </div>
                  </div>
                )}

                {selectedBook.adminApproval === "Rejected" && (
                  <div className="mt-8 p-6 bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/30 rounded-2xl">
                    <h3 className="font-semibold text-red-300 text-lg mb-3 flex items-center gap-2">
                      <FaTimesCircle className="w-5 h-5" />
                      Book Rejected
                    </h3>
                    <p className="text-gray-300 mb-2">
                      <span className="font-semibold">Reason:</span> {selectedBook.rejectionReason || "Not specified"}
                    </p>
                    <button
                      onClick={() => approveBook(selectedBook._id)}
                      className="mt-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-bold shadow-lg shadow-green-500/30 flex items-center gap-2"
                    >
                      <FaCheckCircle className="w-5 h-5" />
                      Re-Approve Book
                    </button>
                  </div>
                )}

                {(selectedBook.isApproved || selectedBook.adminApproval === "Approved") && (
                  <div className="mt-8 p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl">
                    <div className="flex items-center gap-2 text-green-300">
                      <FaCheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Book Approved</span>
                      {selectedBook.approvedAt && (
                        <span className="text-sm text-gray-400 ml-auto">
                          on {new Date(selectedBook.approvedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Status Update Buttons */}
                <div className="mt-8">
                  <h3 className="font-semibold text-gray-400 text-sm mb-4">Update Status</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Available', 'Sold Out', 'Not Available', 'Arriving Soon'].map(status => (
                      <button
                        key={status}
                        onClick={() => updateBookStatus(selectedBook._id, status)}
                        className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                          selectedBook.productStatus === status
                            ? 'bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white shadow-lg shadow-purple-500/30'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-gray-300 border border-zinc-700'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-gradient-to-br from-zinc-800 via-zinc-900 to-black rounded-3xl shadow-2xl border border-zinc-700 max-w-md w-full p-8 animate-slideUp">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-2xl shadow-lg shadow-red-500/20">
                  <FaTrash className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Delete Book?</h3>
              </div>
              <p className="text-gray-400 mb-8 text-base">
                Are you sure you want to delete "<span className="text-white font-semibold">{books.find(b => b._id === showDeleteConfirm)?.title}</span>"? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowDeleteConfirm(null)} 
                  className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-all duration-300 font-semibold border border-zinc-600 hover:border-zinc-500"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => deleteBook(showDeleteConfirm)} 
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-300 font-bold shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slideDown {
          from { 
            opacity: 0; 
            transform: translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradient 3s ease infinite; 
        }
      `}</style>
    </div>
  );
};

export default SellerProduct;