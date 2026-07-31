import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaStore, FaBook, FaWarehouse, FaDollarSign, FaShoppingCart,
  FaPencilAlt, FaTrash, FaEye, FaCalendar, FaTag, FaImage,
  FaClock, FaCheckCircle, FaTimesCircle, FaEyeSlash, FaTimes, FaCheck, FaSort
} from 'react-icons/fa';
import {
  TrendingUp, Package, Activity, Zap, RefreshCw, AlertCircle,
  ChevronDown, X, Check as LucideCheck, Pencil, ArrowUp, ArrowDown, Settings
} from 'lucide-react';
import {
  FiSearch, FiRotateCw, FiEye, FiX, FiActivity, FiChevronRight, FiEdit2, FiTrash2, FiClock
} from 'react-icons/fi';
import Alert from '../../Alert/Alert';
import { useAlert } from '../../Alert/useAlert';
import Loader from '../../Loader/Loader';

// ==================== INLINE CUSTOM CSS EFFECTS ====================
const CustomStyles = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
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
      animation: cardEntrance 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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


const SellerProduct = () => {
  const navigate = useNavigate();
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

  // Admin seller view filter states
  const [adminSellerId, setAdminSellerId] = useState(null);
  const [adminSellerName, setAdminSellerName] = useState("");

  const { alert, showAlert, hideAlert, success, error, warning, info } = useAlert();
  const BASE_URL = import.meta.env.VITE_API_URL
  const API_URL = `${BASE_URL}/api/v1`;

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qSellerId = params.get("sellerId");
    const qSellerName = params.get("sellerName");
    if (qSellerId) {
      setAdminSellerId(qSellerId);
      setAdminSellerName(qSellerName || "Seller");
    }
    fetchBooks();
    fetchAutoStatusSetting();
  }, []);

  useEffect(() => {
    filterAndSortBooks();
  }, [filter, books, searchTerm, sortBy, adminSellerId]);

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

    // Apply seller filter if viewing a specific seller's catalog
    if (adminSellerId) {
      filtered = filtered.filter(book =>
        book.seller?._id === adminSellerId ||
        book.seller === adminSellerId ||
        book.createdBy === adminSellerId ||
        book.createdBy?._id === adminSellerId
      );
    }

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
      switch (sortBy) {
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
    return <Loader fullPage text="Loading registry catalog..." />;
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

      {/* Central Centered Container Card Wrapper - High-Density Glass Panel */}
      <div className="w-full max-w-7xl bg-zinc-900/25 backdrop-blur-xl border border-zinc-850 p-4 sm:p-5 shadow-2xl rounded-2xl relative animate-card-entrance">

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 text-left sm:text-center">
              <div className="inline-flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
                Catalog Control Room
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent mb-1.5">
                {adminSellerId ? `Catalog: ${adminSellerName}` : "Admin Book Management"}
              </h1>
              <p className="text-zinc-400 text-xs flex items-center sm:justify-center gap-2 font-medium">
                <span className="w-2 h-2 bg-yellow-400 rounded-full pulse-dot-active" />
                {adminSellerId ? `Managing catalog items for ${adminSellerName}` : "Manage all seller products and inventory catalog."}
              </p>
            </div>
            <div className="flex gap-2">
              {adminSellerId && (
                <button
                  onClick={() => navigate('/Admin/Sellers-List')}
                  className="px-3.5 py-1.5 bg-zinc-900/60 hover:bg-zinc-900 text-yellow-400 rounded-lg transition-all flex items-center gap-1 border border-zinc-850 hover:border-yellow-400/30 text-xs font-semibold shadow-md active:scale-[0.98]"
                >
                  ← Back to Sellers List
                </button>
              )}
              <button
                onClick={fetchBooks}
                className="px-3.5 py-1.5 bg-zinc-900/60 hover:bg-zinc-900 text-white rounded-lg transition-all flex items-center gap-2 border border-zinc-850 hover:border-yellow-400/30 text-xs font-semibold shadow-md active:scale-[0.98] group"
              >
                <FiRotateCw className="w-3.5 h-3.5 text-yellow-400 group-hover:rotate-180 transition-transform duration-700" />
                <span>Sync Catalog</span>
              </button>
            </div>
          </div>
          <div className="h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent w-full" />
        </div>

        {/* Compact Statistics Deck */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4 relative z-10">
          {/* Total Books */}
          <div className="relative overflow-hidden p-3 rounded-xl border border-zinc-850 bg-zinc-900/10 hover:border-zinc-800 transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-8 h-8 bg-purple-500/5 rounded-bl-full pointer-events-none"></div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <FaBook size={12} />
              </div>
            </div>
            <div>
              <div className="text-lg font-black text-white tracking-tight">{totalBooks}</div>
              <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{availableBooks} Available</div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="relative overflow-hidden p-3 rounded-xl border border-zinc-850 bg-zinc-900/10 hover:border-zinc-800 transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-8 h-8 bg-green-500/5 rounded-bl-full pointer-events-none"></div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
                <FaDollarSign size={12} />
              </div>
            </div>
            <div>
              <div className="text-lg font-black text-white tracking-tight">₹{totalRevenue.toLocaleString()}</div>
              <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{totalSold} Books Sold</div>
            </div>
          </div>

          {/* Total Views */}
          <div className="relative overflow-hidden p-3 rounded-xl border border-zinc-850 bg-zinc-900/10 hover:border-zinc-800 transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-8 h-8 bg-blue-500/5 rounded-bl-full pointer-events-none"></div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <FaEye size={12} />
              </div>
            </div>
            <div>
              <div className="text-lg font-black text-white tracking-tight">{totalViews.toLocaleString()}</div>
              <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Total Views</div>
            </div>
          </div>

          {/* Total Stock */}
          <div className="relative overflow-hidden p-3 rounded-xl border border-zinc-850 bg-zinc-900/10 hover:border-zinc-800 transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-8 h-8 bg-amber-500/5 rounded-bl-full pointer-events-none"></div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <FaWarehouse size={12} />
              </div>
            </div>
            <div>
              <div className="text-lg font-black text-white tracking-tight">{totalStock}</div>
              <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{lowStockBooks} Low Stock</div>
            </div>
          </div>
        </div>

        {/* Auto Status Control Panel */}
        <div className="bg-zinc-900/20 border border-zinc-850 rounded-xl p-3.5 mb-4 relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="space-y-0.5">
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <Settings className="text-yellow-400/85 animate-spin-slow" size={12} /> Auto Status Pipeline
            </h4>
            <p className="text-[11px] text-zinc-400">
              {autoStatusMode
                ? '✅ Auto Mode: New seller products are automatically authorized as "Available".'
                : '⚠️ Manual Mode: New seller products require admin validation and manual approval.'}
            </p>
          </div>
          <button
            onClick={toggleAutoStatusMode}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-300 border shadow-md ${autoStatusMode
                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20 shadow-emerald-500/5'
                : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-750'
              }`}
          >
            {autoStatusMode ? 'Auto Mode: ON' : 'Auto Mode: OFF'}
          </button>
        </div>

        {/* Search & Filter Deck */}
        <div className="bg-zinc-900/15 border border-zinc-850 rounded-xl p-3 mb-4 space-y-3 relative z-10">
          <div className="flex flex-col md:flex-row gap-2">
            {/* Search Bar */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={13} />
              <input
                type="text"
                placeholder="Search books by title, author, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-950/40 border border-zinc-850 hover:border-zinc-800 focus:border-yellow-400/40 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-650 focus:outline-none transition-all duration-300 shadow-inner"
              />
            </div>

            {/* Sort option */}
            <div className="flex items-center gap-2 bg-zinc-950/30 px-3 py-1 rounded-lg border border-zinc-850 hover:border-zinc-800 min-w-[160px] self-start md:self-auto">
              <FaSort className="text-zinc-500" size={11} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none text-[11px] font-semibold cursor-pointer outline-none border-none text-zinc-300 w-full"
              >
                <option value="newest" className="bg-zinc-900 text-white font-medium">Newest First</option>
                <option value="oldest" className="bg-zinc-900 text-white font-medium">Oldest First</option>
                <option value="price-high" className="bg-zinc-900 text-white font-medium">Price: High to Low</option>
                <option value="price-low" className="bg-zinc-900 text-white font-medium">Price: Low to High</option>
                <option value="stock-high" className="bg-zinc-900 text-white font-medium">Stock: High to Low</option>
                <option value="stock-low" className="bg-zinc-900 text-white font-medium">Stock: Low to High</option>
                <option value="views" className="bg-zinc-900 text-white font-medium">Most Viewed</option>
                <option value="sales" className="bg-zinc-900 text-white font-medium">Most Sold</option>
              </select>
            </div>
          </div>

          {/* Filter categories tabs */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              { id: 'all', label: `All Books (${totalBooks})`, bg: 'bg-zinc-900/40 border-zinc-850 text-zinc-450 hover:bg-zinc-850/60 hover:text-white', activeBg: 'border-yellow-500/35 bg-yellow-500/10 text-yellow-400' },
              { id: 'new', label: 'New Additions', bg: 'bg-zinc-900/40 border-zinc-850 text-zinc-450 hover:bg-zinc-850/60 hover:text-white', activeBg: 'border-blue-500/35 bg-blue-500/10 text-blue-400' },
              { id: 'Arriving Soon', label: 'Arriving Soon', bg: 'bg-zinc-900/40 border-zinc-850 text-zinc-450 hover:bg-zinc-850/60 hover:text-white', activeBg: 'border-amber-500/35 bg-amber-500/10 text-amber-400' },
              { id: 'Available', label: 'Available', bg: 'bg-zinc-900/40 border-zinc-850 text-zinc-450 hover:bg-zinc-850/60 hover:text-white', activeBg: 'border-emerald-500/35 bg-emerald-500/10 text-emerald-400' },
              { id: 'Sold Out', label: 'Sold Out', bg: 'bg-zinc-900/40 border-zinc-850 text-zinc-450 hover:bg-zinc-850/60 hover:text-white', activeBg: 'border-rose-500/35 bg-rose-500/10 text-rose-400' },
              { id: 'Not Available', label: 'Not Available', bg: 'bg-zinc-900/40 border-zinc-850 text-zinc-450 hover:bg-zinc-850/60 hover:text-white', activeBg: 'border-zinc-700 bg-zinc-800/40 text-zinc-400' }
            ].map((tab) => {
              const isActive = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all duration-300 ${isActive ? tab.activeBg : tab.bg
                    }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Central Books Grid - Ultra Compact */}
        <div className="relative z-10">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-16 bg-zinc-950/10 border border-zinc-900/60 rounded-xl">
              <FaBook className="text-3xl text-zinc-700 mx-auto mb-2" />
              <p className="text-xs font-bold text-zinc-450">No catalog books found</p>
              <p className="text-[10px] text-zinc-655 mt-0.5 max-w-xs mx-auto">Verify your search spelling or adjust active category filter tabs above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredBooks.map((book, index) => {
                const statusBadge = getStatusBadge(book.productStatus);
                const stockInfo = getStockLevel(book.stock || 0);
                const isApproved = book.isApproved || book.adminApproval === "Approved";
                const isRejected = book.adminApproval === "Rejected";

                return (
                  <div
                    key={book._id}
                    className="animate-card-entrance group relative flex flex-col justify-between bg-zinc-900/15 backdrop-blur-md rounded-xl border border-zinc-850 hover:border-yellow-400/30 p-3.5 transition-all duration-300 cursor-pointer shadow-md hover:shadow-[0_6px_18px_rgba(250,204,21,0.03)] overflow-hidden transform hover:-translate-y-0.5"
                    style={{ animationDelay: `${index * 30}ms` }}
                    onClick={() => {
                      setSelectedBook(book);
                      setShowModal(true);
                    }}
                  >
                    {/* Accent glowing gradient line */}
                    <div className="absolute top-0 left-0 right-0 h-[1.2px] bg-gradient-to-r from-yellow-500/0 via-yellow-400/30 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="space-y-2.5">
                      {/* Book Cover Cover art */}
                      <div className="relative h-36 bg-zinc-955/80 rounded-lg overflow-hidden border border-zinc-900 shadow-inner">
                        {book.images && book.images[0] && (
                          <img
                            src={book.images[0].url}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>

                        {/* Top Badge Overlay */}
                        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5 origin-top-left scale-90">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border} flex items-center gap-1 shadow-md`}>
                            <statusBadge.Icon size={8} />
                            {book.productStatus}
                          </span>

                          {!isApproved && !isRejected && (
                            <span className="px-2 py-0.5 rounded text-[8px] font-extrabold border bg-yellow-500/10 border-yellow-500/20 text-yellow-400 flex items-center gap-1 shadow-md">
                              <FiClock className="animate-pulse" size={8} />
                              Pending
                            </span>
                          )}

                          {isRejected && (
                            <span className="px-2 py-0.5 rounded text-[8px] font-extrabold border bg-rose-500/10 border-rose-500/20 text-rose-400 flex items-center gap-1 shadow-md">
                              <FiX size={8} />
                              Rejected
                            </span>
                          )}
                        </div>

                        {/* Image count and Date */}
                        <div className="absolute bottom-1.5 left-2 flex items-center gap-1.5 scale-90 origin-bottom-left">
                          <span className="px-1.5 py-0.5 rounded bg-zinc-950/65 text-[7px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1">
                            <FaCalendar size={6} />
                            {formatDate(book.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Title & Author Info */}
                      <div>
                        <h3 className="text-xs sm:text-sm font-extrabold text-zinc-100 truncate line-clamp-1 group-hover:text-yellow-400 transition-colors duration-300">
                          {book.title || "No Title"}
                        </h3>
                        <p className="text-[10px] text-zinc-450 italic mt-0.5 truncate">
                          by {book.author || "Unknown"}
                        </p>
                      </div>

                      {/* Middle metadata chips */}
                      <div className="grid grid-cols-3 gap-1 text-[9px] font-mono">
                        <div className="flex flex-col items-center justify-center bg-zinc-950/20 py-1 rounded border border-zinc-900">
                          <FiEye className="text-zinc-550 mb-0.5" size={9} />
                          <span className="text-zinc-300 font-bold">{book.views || 0}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center bg-zinc-950/20 py-1 rounded border border-zinc-900">
                          <FaShoppingCart className="text-zinc-550 mb-0.5" size={9} />
                          <span className="text-zinc-300 font-bold">{book.sold || 0}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center bg-zinc-950/20 py-1 rounded border border-zinc-900">
                          <FaWarehouse className="text-zinc-550 mb-0.5" size={9} />
                          <span className={`${stockInfo.color} font-bold`}>{book.stock || 0}</span>
                        </div>
                      </div>

                      {/* Category Tag */}
                      {book.category && (
                        <div className="flex items-center gap-1 text-[9px] text-zinc-450 bg-zinc-950/15 px-2 py-0.5 rounded border border-zinc-900/60 w-fit">
                          <FaTag className="text-yellow-400/80" size={8} />
                          <span className="truncate max-w-[100px]">{book.category}</span>
                        </div>
                      )}
                    </div>

                    {/* Stock & Price Inline Editors - Tightly Integrated */}
                    <div className="mt-3 pt-2.5 border-t border-zinc-900/80 space-y-2.5" onClick={(e) => e.stopPropagation()}>
                      {/* Price Section */}
                      <div className="flex items-center justify-between gap-1.5 h-6">
                        {editingPrice === book._id ? (
                          <div className="flex items-center gap-1 w-full bg-zinc-950 rounded-lg p-0.5 border border-zinc-800">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={newPriceValue}
                              onChange={(e) => setNewPriceValue(e.target.value)}
                              className="flex-1 bg-transparent px-1.5 py-0.5 text-[10px] text-white focus:outline-none font-mono"
                              placeholder="Price"
                              autoFocus
                            />
                            <button
                              onClick={() => updateBookPrice(book._id)}
                              className="p-1 hover:bg-zinc-900 text-green-400 rounded transition-colors"
                            >
                              <FaCheck size={8} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingPrice(null);
                                setNewPriceValue("");
                              }}
                              className="p-1 hover:bg-zinc-900 text-rose-400 rounded transition-colors"
                            >
                              <FaTimes size={8} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center w-full group/price">
                            <span className="text-sm font-black text-yellow-400/90 font-mono">
                              ₹{book.price?.toLocaleString()}
                            </span>
                            <button
                              onClick={() => {
                                setEditingPrice(book._id);
                                setNewPriceValue(book.price?.toString() || "0");
                              }}
                              className="opacity-0 group-hover/price:opacity-100 p-1 bg-zinc-950/45 hover:bg-yellow-400 text-zinc-450 hover:text-zinc-950 rounded transition-all duration-300"
                              title="Edit Price"
                            >
                              <FiEdit2 size={9} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Stock Section */}
                      <div className="flex items-center justify-between gap-1.5 h-6">
                        {editingStock === book._id ? (
                          <div className="flex items-center gap-1 w-full bg-zinc-950 rounded-lg p-0.5 border border-zinc-800">
                            <input
                              type="number"
                              min="0"
                              value={newStockValue}
                              onChange={(e) => setNewStockValue(e.target.value)}
                              className="flex-1 bg-transparent px-1.5 py-0.5 text-[10px] text-white focus:outline-none font-mono"
                              placeholder="Stock"
                              autoFocus
                            />
                            <button
                              onClick={() => updateBookStock(book._id)}
                              className="p-1 hover:bg-zinc-900 text-green-400 rounded transition-colors"
                            >
                              <FaCheck size={8} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingStock(null);
                                setNewStockValue("");
                              }}
                              className="p-1 hover:bg-zinc-900 text-rose-400 rounded transition-colors"
                            >
                              <FaTimes size={8} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center w-full group/stock">
                            <span className="text-[10px] text-zinc-555 font-bold uppercase tracking-wider flex items-center gap-1">
                              Stock: <span className={`${stockInfo.color} font-mono font-extrabold`}>{book.stock || 0}</span>
                            </span>
                            <button
                              onClick={() => {
                                setEditingStock(book._id);
                                setNewStockValue(book.stock?.toString() || "0");
                              }}
                              className="opacity-0 group-hover/stock:opacity-100 p-1 bg-zinc-955/45 hover:bg-yellow-400 text-zinc-450 hover:text-zinc-950 rounded transition-all duration-300"
                              title="Edit Stock"
                            >
                              <FaPencilAlt size={8} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Actions Deck */}
                      <div className="flex gap-1.5 pt-1">
                        <button
                          onClick={() => {
                            setSelectedBook(book);
                            setShowModal(true);
                          }}
                          className="flex-1 bg-zinc-900/80 hover:bg-yellow-400 text-zinc-400 hover:text-zinc-955 border border-zinc-800/85 hover:border-yellow-400/20 font-bold py-1 rounded text-[9px] transition-all duration-300 flex items-center justify-center gap-1"
                        >
                          <FiEye size={10} />
                          <span>View dossier</span>
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(book._id)}
                          className="bg-zinc-900 hover:bg-rose-600/10 text-zinc-450 hover:text-rose-400 border border-zinc-800 hover:border-rose-500/25 p-1 rounded transition-all duration-300"
                          title="Purge book"
                        >
                          <FiTrash2 size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Dynamic Detail Modal Layer */}
        {showModal && selectedBook && (
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => {
              setShowModal(false);
              setSelectedBook(null);
            }}
          >
            <div
              className="animate-modal-entrance bg-zinc-955 rounded-2xl max-w-xl w-full border border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] my-8 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cover Header Banner */}
              <div className="relative bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 p-4 border-b border-zinc-900 flex justify-between items-start gap-4">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.02),transparent)] pointer-events-none"></div>

                <div className="flex gap-3 relative z-10 text-left min-w-0">
                  <div className="relative shrink-0">
                    {selectedBook.images && selectedBook.images[0] && (
                      <img
                        src={selectedBook.images[0].url}
                        alt={selectedBook.title}
                        className="w-11 h-15 object-cover rounded-lg border border-zinc-800 shadow-md bg-zinc-900"
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-sm font-black text-zinc-100 truncate pr-4">
                      {selectedBook.title}
                    </h2>
                    <p className="text-zinc-450 font-bold text-[10px] mt-0.5 truncate">
                      by {selectedBook.author}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold border ${getStatusBadge(selectedBook.productStatus).bg} ${getStatusBadge(selectedBook.productStatus).text} ${getStatusBadge(selectedBook.productStatus).border}`}>
                        {selectedBook.productStatus}
                      </span>
                      {selectedBook.category && (
                        <span className="px-2 py-0.5 rounded text-[8px] bg-yellow-500/10 border border-yellow-500/25 text-yellow-400 font-extrabold uppercase tracking-wider">
                          {selectedBook.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedBook(null);
                  }}
                  className="text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 p-1.5 rounded-xl transition-all duration-300 relative z-10 shrink-0 border border-transparent hover:border-zinc-800"
                >
                  <FiX size={15} />
                </button>
              </div>

              {/* Modal Body Info Sections scrollcontainer */}
              <div className="p-4 sm:p-5 space-y-4 max-h-[50vh] overflow-y-auto premium-scrollbar bg-zinc-955/20">
                {/* Dossier details card grid */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                    <FiActivity className="text-yellow-400/80" size={11} /> Identity Dossier
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="bg-zinc-900/30 border border-zinc-850 rounded-lg p-2.5 hover:border-zinc-800 transition-all duration-300">
                      <p className="text-[8px] text-zinc-550 font-bold uppercase tracking-wider">Edition / Publication</p>
                      <p className="font-semibold text-zinc-200 mt-0.5 truncate">{selectedBook.editionOrPublishYear || "N/A"}</p>
                    </div>

                    <div className="bg-zinc-900/30 border border-zinc-850 rounded-lg p-2.5 hover:border-zinc-800 transition-all duration-300">
                      <p className="text-[8px] text-zinc-550 font-bold uppercase tracking-wider">System Language</p>
                      <p className="font-semibold text-zinc-200 mt-0.5 truncate">{selectedBook.language || "English"}</p>
                    </div>
                  </div>
                </div>

                {/* Logistics / Inventory Info */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                    <FaWarehouse className="text-yellow-400/80" size={11} /> Stock & Ledger
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="bg-zinc-900/30 border border-zinc-850 rounded-lg p-2.5 flex flex-col justify-between hover:border-zinc-800 transition-all duration-300">
                      <p className="text-[8px] text-zinc-550 font-bold uppercase tracking-wider">Vault Price</p>
                      <p className="font-black text-yellow-400/90 text-sm mt-0.5 font-mono">₹{selectedBook.price}</p>
                    </div>

                    <div className="bg-zinc-900/30 border border-zinc-850 rounded-lg p-2.5 flex flex-col justify-between hover:border-zinc-800 transition-all duration-300">
                      <p className="text-[8px] text-zinc-550 font-bold uppercase tracking-wider">Physical Inventory</p>
                      <p className="font-bold text-zinc-200 text-sm mt-0.5 font-mono">{selectedBook.stock} units</p>
                    </div>

                    <div className="bg-zinc-900/30 border border-zinc-850 rounded-lg p-2.5 flex flex-col justify-between hover:border-zinc-800 transition-all duration-300">
                      <p className="text-[8px] text-zinc-550 font-bold uppercase tracking-wider">Registry Date</p>
                      <p className="font-semibold text-zinc-200 text-xs mt-0.5">{new Date(selectedBook.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedBook.desc && (
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                      <FaBook className="text-yellow-400/80" size={10} /> Product Dossier Description
                    </h3>
                    <div className="bg-zinc-900/30 border border-zinc-850 rounded-lg p-3 hover:border-zinc-800 transition-all duration-300">
                      <p className="text-[11px] leading-relaxed text-zinc-350 select-text whitespace-pre-line">{selectedBook.desc}</p>
                    </div>
                  </div>
                )}

                {/* Admin Approval Control Panel */}
                {(!selectedBook.isApproved && selectedBook.adminApproval !== "Approved") && (
                  <div className="p-3 rounded-lg border bg-yellow-500/10 border-yellow-500/25 text-yellow-400 space-y-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <FiClock className="animate-pulse" size={11} /> Admin Credentials Authorization Required
                    </h4>
                    <p className="text-[10px] text-zinc-300 leading-relaxed">
                      This product catalog submission is currently pending verification. Authorize display or reject query listing:
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => approveBook(selectedBook._id)}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-zinc-955 font-bold py-1 rounded text-[9px] transition-all duration-300 shadow-md shadow-emerald-500/5 active:scale-95"
                      >
                        Approve listing
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt("Enter administrative rejection citation:");
                          if (reason) {
                            rejectBook(selectedBook._id, reason);
                          }
                        }}
                        className="flex-1 bg-gradient-to-r from-rose-500 to-red-650 hover:from-rose-400 hover:to-red-550 text-white font-bold py-1 rounded text-[9px] transition-all duration-300 shadow-md shadow-rose-555/5 active:scale-95"
                      >
                        Decline listing
                      </button>
                    </div>
                  </div>
                )}

                {selectedBook.adminApproval === "Rejected" && (
                  <div className="p-3 rounded-lg border bg-rose-500/10 border-rose-500/25 text-rose-400 space-y-1">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <FiX size={11} /> Credential Listing Declined
                    </h4>
                    <p className="text-[10px] text-zinc-300 leading-relaxed">
                      <strong>Reason:</strong> {selectedBook.rejectionReason || "Validation mismatch"}
                    </p>
                    <button
                      onClick={() => approveBook(selectedBook._id)}
                      className="mt-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-zinc-955 font-bold px-3 py-1 rounded text-[9px] transition-all duration-300"
                    >
                      Authorize Overrule
                    </button>
                  </div>
                )}

                {(selectedBook.isApproved || selectedBook.adminApproval === "Approved") && (
                  <div className="p-2.5 rounded-lg border bg-emerald-500/10 border-emerald-500/25 text-emerald-400 flex items-center justify-between text-[10px] font-bold">
                    <span className="flex items-center gap-1"><FiCheckCircle size={11} /> Credential catalog approved</span>
                    {selectedBook.approvedAt && (
                      <span className="text-zinc-550 uppercase text-[9px]">Verified: {new Date(selectedBook.approvedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Control Footer Panel */}
              <div className="p-3 border-t border-zinc-900 bg-zinc-900/10 space-y-3">
                <div className="space-y-1 text-left px-1">
                  <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Update System Status</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {['Available', 'Sold Out', 'Not Available', 'Arriving Soon'].map((status) => {
                      const isActive = selectedBook.productStatus === status;
                      return (
                        <button
                          key={status}
                          onClick={() => updateBookStatus(selectedBook._id, status)}
                          className={`py-1.5 rounded-lg font-bold text-[9px] uppercase tracking-wide transition-all duration-200 ${isActive
                              ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-zinc-955 border border-transparent shadow-md"
                              : "bg-zinc-900 hover:bg-zinc-850 text-zinc-400 border border-zinc-800"
                            }`}
                        >
                          {status}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2 pt-0.5 justify-end">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedBook(null);
                    }}
                    className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-450 hover:text-white px-3.5 py-1.5 rounded-lg font-bold text-[9px] transition-all duration-300"
                  >
                    Close Dossier
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal Overlay */}
        {showDeleteConfirm && (
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <div
              className="animate-modal-entrance bg-zinc-955 rounded-2xl max-w-sm w-full border border-zinc-800 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-[2px] bg-gradient-to-r from-red-500 via-rose-400 to-red-555"></div>

              <div className="p-4.5 space-y-4 text-center">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-lg">
                  <FiTrash2 />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs sm:text-sm font-black text-zinc-150 uppercase tracking-wider">Purge book registry file?</h3>
                  <p className="text-[10px] leading-relaxed text-zinc-450 max-w-[260px] mx-auto">
                    Are you absolutely sure you want to permanently remove "<span className="text-zinc-250 font-bold">{books.find(b => b._id === showDeleteConfirm)?.title}</span>"? This cannot be undone.
                  </p>
                </div>

                <div className="flex gap-2 pt-0.5">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-350 px-3 py-2 rounded-xl font-bold text-[10px] transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteBook(showDeleteConfirm)}
                    className="flex-1 bg-gradient-to-r from-red-655 to-rose-700 hover:from-red-550 hover:to-rose-600 text-white px-3 py-2 rounded-xl font-bold text-[10px] transition-all duration-300 shadow-md shadow-red-500/10"
                  >
                    Purge
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProduct;