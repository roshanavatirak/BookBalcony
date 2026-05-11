// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import { Link } from "react-router-dom";
// // import { 
// //   Trash2, Edit, Eye, Package, TrendingUp, DollarSign, MoreVertical, 
// //   Search, Filter, Plus, Clock, AlertCircle, RefreshCw, CheckCircle2,
// //   ArrowUp, Boxes, ShoppingCart, Activity, Zap, ChevronDown, X, 
// //   ImagePlus, Calendar, Tag, Pencil, Check
// // } from "lucide-react";
// // import Alert from "../Alert/Alert";
// // import { useAlert } from "../Alert/useAlert";

// // const MyProducts = () => {
// //   const [books, setBooks] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [sortBy, setSortBy] = useState("newest");
// //   const [filterStatus, setFilterStatus] = useState("all");
// //   const [activeMenu, setActiveMenu] = useState(null);
// //   const [deleteConfirm, setDeleteConfirm] = useState(null);
// //   const [statusModal, setStatusModal] = useState(null);
// //   const [restockDate, setRestockDate] = useState("");
// //   const [stockInput, setStockInput] = useState(1);
// //   const [editingStock, setEditingStock] = useState(null);
// //   const [newStockValue, setNewStockValue] = useState("");
// //   const { alert, showAlert, hideAlert, success, error, warning, info } = useAlert();

// //   const headers = {
// //     id: localStorage.getItem("id"),
// //     authorization: `Bearer ${localStorage.getItem("token")}`,
// //   };

// //   useEffect(() => {
// //     fetchSellerBooks();
// //     const interval = setInterval(() => {
// //       fetchSellerBooks();
// //     }, 30000); // 30 seconds
// //     return () => clearInterval(interval);
// //   }, []);

// //   const fetchSellerBooks = async () => {
// //     try {
// //       const res = await axios.get("http://localhost:3000/api/v1/seller/myproducts", { headers });
// //       setBooks(res.data?.books || []);
// //     } catch (err) {
// //       console.error("❌ Failed to fetch seller books:", err);
// //       if (loading) {
// //         error("Failed to fetch products. Please try again.");
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleStockUpdate = async (bookId) => {
// //     try {
// //       const stockValue = parseInt(newStockValue);
      
// //       if (isNaN(stockValue) || stockValue < 0) {
// //         warning("Please enter a valid stock quantity (0 or more)");
// //         return;
// //       }

// //       const response = await axios.put(
// //         `http://localhost:3000/api/v1/seller/update-book-stock/${bookId}`,
// //         { stock: stockValue },
// //         { headers }
// //       );

// //       if (response.data) {
// //         // Update local state
// //         setBooks(books.map(book => 
// //           book._id === bookId ? { ...book, stock: stockValue } : book
// //         ));
        
// //         setEditingStock(null);
// //         setNewStockValue("");
// //         success(`Stock updated successfully to ${stockValue} units!`);
// //       }
// //     } catch (err) {
// //       console.error("❌ Failed to update stock:", err);
// //       error("Failed to update stock. Please try again.");
// //     }
// //   };

// //   const handleDelete = async (bookId) => {
// //     try {
// //       await axios.delete(`http://localhost:3000/api/v1/seller/delete-book/${bookId}`, { headers });
// //       setBooks(books.filter(book => book._id !== bookId));
// //       setDeleteConfirm(null);
// //       success("Product deleted successfully!");
// //     } catch (err) {
// //       console.error("❌ Failed to delete book:", err);
// //       error("Failed to delete product. Please try again.");
// //     }
// //   };

// //   const handleStatusUpdate = async (bookId, newStatus) => {
// //     try {
// //       const book = books.find(b => b._id === bookId);
      
// //       if (book.productStatus === "Sold Out" && newStatus === "Available" && stockInput <= 0) {
// //         warning("Please enter a valid stock quantity (minimum 1)");
// //         return;
// //       }
      
// //       const payload = {
// //         productStatus: newStatus,
// //         autoStatusUpdate: false
// //       };
      
// //       if (newStatus === "Arriving Soon" && restockDate) {
// //         payload.expectedRestockDate = restockDate;
// //       }
      
// //       if (book.productStatus === "Sold Out" && newStatus === "Available") {
// //         payload.stock = stockInput;
// //       }
      
// //       await axios.put(
// //         `http://localhost:3000/api/v1/seller/update-product-status/${bookId}`, 
// //         payload,
// //         { headers }
// //       );
      
// //       fetchSellerBooks();
// //       setStatusModal(null);
// //       setRestockDate("");
// //       setStockInput(1);
// //       success(`Product status updated to: ${newStatus}`);
// //     } catch (err) {
// //       console.error("❌ Failed to update status:", err);
// //       error("Failed to update product status. Please try again.");
// //     }
// //   };

// //   const formatDate = (date) => {
// //     if (!date) return "N/A";
    
// //     try {
// //       const d = new Date(date);
      
// //       if (isNaN(d.getTime())) {
// //         return "N/A";
// //       }
      
// //       const now = new Date();
// //       const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
// //       const compareDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      
// //       const diffTime = today.getTime() - compareDate.getTime();
// //       const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
// //       if (diffDays === 0) return "Today";
// //       if (diffDays === 1) return "Yesterday";
// //       if (diffDays === -1) return "Tomorrow";
// //       if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;
// //       if (diffDays > -7 && diffDays < -1) return `In ${Math.abs(diffDays)} days`;
// //       if (diffDays >= 7 && diffDays < 30) {
// //         const weeks = Math.floor(diffDays / 7);
// //         return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
// //       }
      
// //       return d.toLocaleDateString('en-US', { 
// //         month: 'short', 
// //         day: 'numeric', 
// //         year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
// //       });
// //     } catch (error) {
// //       console.error("Date formatting error:", error);
// //       return "N/A";
// //     }
// //   };

// //   const getStatusBadge = (book) => {
// //     const stock = book.stock < 0 ? 0 : book.stock;
// //     const isOutOfStock = stock === 0;
    
// //     const statusConfig = {
// //       "Available": { 
// //         bg: "bg-gradient-to-r from-green-500/20 to-emerald-500/20", 
// //         text: "text-green-300", 
// //         border: "border-green-500/50", 
// //         icon: CheckCircle2,
// //         glow: "shadow-green-500/20"
// //       },
// //       "Sold Out": { 
// //         bg: "bg-gradient-to-r from-red-500/20 to-rose-500/20", 
// //         text: "text-red-300", 
// //         border: "border-red-500/50", 
// //         icon: AlertCircle,
// //         glow: "shadow-red-500/20"
// //       },
// //       "Not Available": { 
// //         bg: "bg-gradient-to-r from-gray-500/20 to-slate-500/20", 
// //         text: "text-gray-300", 
// //         border: "border-gray-500/50", 
// //         icon: Package,
// //         glow: "shadow-gray-500/20"
// //       },
// //       "Arriving Soon": { 
// //         bg: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20", 
// //         text: "text-blue-300", 
// //         border: "border-blue-500/50", 
// //         icon: Clock,
// //         glow: "shadow-blue-500/20"
// //       },
// //       "Pending Approval": {
// //         bg: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20",
// //         text: "text-yellow-300",
// //         border: "border-yellow-500/50",
// //         icon: Clock,
// //         glow: "shadow-yellow-500/20"
// //       }
// //     };
    
// //     let displayStatus = book.productStatus || "Pending Approval";
// //     if (isOutOfStock && book.productStatus === "Available") {
// //       displayStatus = "Out of Stock";
// //     }
    
// //     const config = displayStatus === "Out of Stock" 
// //       ? statusConfig["Sold Out"] 
// //       : statusConfig[displayStatus] || statusConfig["Pending Approval"];
// //     const Icon = config.icon;
    
// //     return (
// //       <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm ${config.bg} ${config.text} border ${config.border} ${config.glow} shadow-lg flex items-center gap-1.5 animate-fadeIn`}>
// //         <Icon className="w-3.5 h-3.5 animate-pulse" />
// //         {displayStatus}
// //         {book.productStatus === "Available" && !isOutOfStock && ` (${stock})`}
// //         {isOutOfStock && book.productStatus === "Available" && " (0)"}
// //       </span>
// //     );
// //   };

// //   const getStockLevel = (stock) => {
// //     if (stock === 0) return { level: "Out of Stock", color: "text-red-400", bg: "bg-red-500/10", icon: AlertCircle };
// //     if (stock <= 5) return { level: "Low Stock", color: "text-yellow-400", bg: "bg-yellow-500/10", icon: AlertCircle };
// //     if (stock <= 20) return { level: "In Stock", color: "text-blue-400", bg: "bg-blue-500/10", icon: Boxes };
// //     return { level: "High Stock", color: "text-green-400", bg: "bg-green-500/10", icon: CheckCircle2 };
// //   };

// //   const getAvailableStatusOptions = (book) => {
// //     const isApproved = book.isApproved || book.adminApproval === "Approved";
    
// //     if (!isApproved) {
// //       return ["Arriving Soon", "Not Available"];
// //     }
    
// //     return ["Available", "Sold Out", "Not Available", "Arriving Soon"];
// //   };

// //   const filteredAndSortedBooks = books
// //     .filter(book => {
// //       const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //                            book.author.toLowerCase().includes(searchTerm.toLowerCase());
// //       const matchesStatus = filterStatus === "all" || book.productStatus === filterStatus;
// //       return matchesSearch && matchesStatus;
// //     })
// //     .sort((a, b) => {
// //       switch(sortBy) {
// //         case "newest": return new Date(b.postedAt) - new Date(a.postedAt);
// //         case "oldest": return new Date(a.postedAt) - new Date(b.postedAt);
// //         case "price-high": return b.price - a.price;
// //         case "price-low": return a.price - b.price;
// //         case "views": return (b.views || 0) - (a.views || 0);
// //         case "stock-high": return (b.stock || 0) - (a.stock || 0);
// //         case "stock-low": return (a.stock || 0) - (b.stock || 0);
// //         default: return 0;
// //       }
// //     });

// //   const totalRevenue = books.reduce((sum, book) => sum + (book.sold || 0) * book.price, 0);
// //   const totalViews = books.reduce((sum, book) => sum + (book.views || 0), 0);
// //   const totalSold = books.reduce((sum, book) => sum + (book.sold || 0), 0);
// //   const availableProducts = books.filter(b => b.productStatus === "Available" && (b.stock > 0)).length;
// //   const lowStockProducts = books.filter(b => b.stock > 0 && b.stock <= 5).length;
// //   const totalStock = books.reduce((sum, book) => sum + (book.stock || 0), 0);

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-zinc-900 to-black flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="relative w-24 h-24 mx-auto mb-6">
// //             <div className="absolute inset-0 border-4 border-yellow-400/30 rounded-full"></div>
// //             <div className="absolute inset-0 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
// //             <div className="absolute inset-3 border-4 border-yellow-500/50 border-b-transparent rounded-full animate-spin-slow"></div>
// //           </div>
// //           <p className="text-gray-300 text-lg font-medium animate-pulse">Loading your products...</p>
// //           <div className="flex gap-1 justify-center mt-4">
// //             <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
// //             <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
// //             <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-zinc-900 to-black text-white p-6">
// //       {alert && (
// //         <Alert
// //           type={alert.type}
// //           title={alert.title}
// //           message={alert.message}
// //           duration={alert.duration}
// //           position={alert.position}
// //           autoClose={alert.autoClose}
// //           onClose={hideAlert}
// //         />
// //       )}

// //       <div className="max-w-7xl mx-auto">
// //         {/* Header Section */}
// //         <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between animate-slideDown">
// //           <div>
// //             <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent animate-gradient">
// //               📚 Products Inventory
// //             </h1>
// //             <p className="text-gray-400 text-lg flex items-center gap-2">
// //               <Activity className="w-4 h-4 text-yellow-400 animate-pulse" />
// //               Manage your inventory and track sales performance
// //             </p>
// //           </div>
// //           <Link 
// //             to="/seller/add-book" 
// //             className="mt-4 md:mt-0 flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-gray-900 rounded-2xl hover:from-yellow-500 hover:via-yellow-600 hover:to-amber-600 transition-all duration-300 shadow-xl shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105 font-bold group"
// //           >
// //             <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
// //             Add New Product
// //             <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
// //           </Link>
// //         </div>

// //         {/* Enhanced Stats Cards */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// //           <div className="bg-gradient-to-br from-zinc-800/80 via-zinc-900/80 to-black/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-700/50 p-6 hover:border-yellow-400/50 transition-all duration-500 group hover:scale-105 hover:shadow-yellow-500/20 animate-fadeInUp" style={{ animationDelay: '0ms' }}>
// //             <div className="flex items-center justify-between mb-4">
// //               <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Products</span>
// //               <div className="p-3 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-yellow-500/20">
// //                 <Package className="w-6 h-6 text-yellow-400" />
// //               </div>
// //             </div>
// //             <p className="text-4xl font-black text-white mb-2">{books.length}</p>
// //             <div className="flex items-center gap-2 text-sm">
// //               <ArrowUp className="w-4 h-4 text-yellow-400" />
// //               <span className="text-yellow-400 font-semibold">{availableProducts} Available</span>
// //             </div>
// //           </div>
          
// //           <div className="bg-gradient-to-br from-zinc-800/80 via-zinc-900/80 to-black/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-700/50 p-6 hover:border-green-400/50 transition-all duration-500 group hover:scale-105 hover:shadow-green-500/20 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
// //             <div className="flex items-center justify-between mb-4">
// //               <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Revenue</span>
// //               <div className="p-3 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-green-500/20">
// //                 <DollarSign className="w-6 h-6 text-green-400" />
// //               </div>
// //             </div>
// //             <p className="text-4xl font-black text-white mb-2">₹{totalRevenue.toLocaleString()}</p>
// //             <div className="flex items-center gap-2 text-sm">
// //               <TrendingUp className="w-4 h-4 text-green-400" />
// //               <span className="text-green-400 font-semibold">From {totalSold} sales</span>
// //             </div>
// //           </div>
          
// //           <div className="bg-gradient-to-br from-zinc-800/80 via-zinc-900/80 to-black/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-700/50 p-6 hover:border-purple-400/50 transition-all duration-500 group hover:scale-105 hover:shadow-purple-500/20 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
// //             <div className="flex items-center justify-between mb-4">
// //               <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Views</span>
// //               <div className="p-3 bg-gradient-to-br from-purple-400/20 to-fuchsia-500/20 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-purple-500/20">
// //                 <Eye className="w-6 h-6 text-purple-400" />
// //               </div>
// //             </div>
// //             <p className="text-4xl font-black text-white mb-2">{totalViews.toLocaleString()}</p>
// //             <div className="flex items-center gap-2 text-sm">
// //               <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
// //               <span className="text-purple-400 font-semibold">Engagement</span>
// //             </div>
// //           </div>
          
// //           <div className="bg-gradient-to-br from-zinc-800/80 via-zinc-900/80 to-black/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-700/50 p-6 hover:border-blue-400/50 transition-all duration-500 group hover:scale-105 hover:shadow-blue-500/20 animate-fadeInUp" style={{ animationDelay: '300ms' }}>
// //             <div className="flex items-center justify-between mb-4">
// //               <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Stock</span>
// //               <div className="p-3 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-blue-500/20">
// //                 <Boxes className="w-6 h-6 text-blue-400" />
// //               </div>
// //             </div>
// //             <p className="text-4xl font-black text-white mb-2">{totalStock}</p>
// //             <div className="flex items-center gap-2 text-sm">
// //               {lowStockProducts > 0 ? (
// //                 <>
// //                   <AlertCircle className="w-4 h-4 text-yellow-400 animate-pulse" />
// //                   <span className="text-yellow-400 font-semibold">{lowStockProducts} Low Stock</span>
// //                 </>
// //               ) : (
// //                 <>
// //                   <CheckCircle2 className="w-4 h-4 text-blue-400" />
// //                   <span className="text-blue-400 font-semibold">All Healthy</span>
// //                 </>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Enhanced Filters */}
// //         <div className="bg-gradient-to-br from-zinc-800/60 via-zinc-900/60 to-black/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-700/50 p-6 mb-8 animate-fadeIn">
// //           <div className="flex flex-col md:flex-row gap-4">
// //             <div className="flex-1 relative group">
// //               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-yellow-400 transition-colors" />
// //               <input 
// //                 type="text" 
// //                 placeholder="Search by title or author..." 
// //                 value={searchTerm} 
// //                 onChange={(e) => setSearchTerm(e.target.value)} 
// //                 className="w-full pl-12 pr-4 py-4 bg-zinc-900/80 border border-zinc-700 rounded-2xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all text-white placeholder-gray-500 font-medium hover:border-zinc-600" 
// //               />
// //             </div>
            
// //             <div className="flex items-center gap-3 bg-zinc-900/80 px-5 rounded-2xl border border-zinc-700 hover:border-zinc-600 transition-all group">
// //               <Filter className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
// //               <select 
// //                 value={filterStatus} 
// //                 onChange={(e) => setFilterStatus(e.target.value)} 
// //                 className="bg-transparent py-4 pr-8 focus:outline-none text-white font-semibold cursor-pointer"
// //               >
// //                 <option value="all" className="bg-zinc-900">All Status</option>
// //                 <option value="Available" className="bg-zinc-900">✅ Available</option>
// //                 <option value="Sold Out" className="bg-zinc-900">❌ Sold Out</option>
// //                 <option value="Not Available" className="bg-zinc-900">⛔ Not Available</option>
// //                 <option value="Arriving Soon" className="bg-zinc-900">🕒 Arriving Soon</option>
// //               </select>
// //               <ChevronDown className="w-4 h-4 text-gray-400" />
// //             </div>
            
// //             <div className="flex items-center gap-3 bg-zinc-900/80 px-5 rounded-2xl border border-zinc-700 hover:border-zinc-600 transition-all group">
// //               <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
// //               <select 
// //                 value={sortBy} 
// //                 onChange={(e) => setSortBy(e.target.value)} 
// //                 className="bg-transparent py-4 pr-8 focus:outline-none text-white font-semibold cursor-pointer"
// //               >
// //                 <option value="newest" className="bg-zinc-900">🆕 Newest First</option>
// //                 <option value="oldest" className="bg-zinc-900">📅 Oldest First</option>
// //                 <option value="price-high" className="bg-zinc-900">💰 Price: High to Low</option>
// //                 <option value="price-low" className="bg-zinc-900">💵 Price: Low to High</option>
// //                 <option value="views" className="bg-zinc-900">👁️ Most Viewed</option>
// //                 <option value="stock-high" className="bg-zinc-900">📦 Stock: High to Low</option>
// //                 <option value="stock-low" className="bg-zinc-900">⚠️ Stock: Low to High</option>
// //               </select>
// //               <ChevronDown className="w-4 h-4 text-gray-400" />
// //             </div>
// //           </div>
// //         </div>

// //         {/* Products Grid */}
// //         {filteredAndSortedBooks.length === 0 ? (
// //           <div className="bg-gradient-to-br from-zinc-800/60 via-zinc-900/60 to-black/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-700/50 p-16 text-center animate-fadeIn">
// //             <div className="relative inline-block mb-6">
// //               <Package className="w-24 h-24 text-gray-600 mx-auto animate-float" />
// //               <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full animate-pulse"></div>
// //             </div>
// //             <h3 className="text-2xl font-bold text-white mb-3">No products found</h3>
// //             <p className="text-gray-400 mb-8 text-lg">
// //               {searchTerm || filterStatus !== "all" ? "Try adjusting your filters" : "Start adding books to your inventory"}
// //             </p>
// //             <Link 
// //               to="/seller/add-book" 
// //               className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-gray-900 rounded-2xl hover:from-yellow-500 hover:via-yellow-600 hover:to-amber-600 transition-all duration-300 font-bold shadow-xl shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105 group"
// //             >
// //               <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
// //               Add Your First Product
// //               <Zap className="w-4 h-4" />
// //             </Link>
// //           </div>
// //         ) : (
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //             {filteredAndSortedBooks.map((book, index) => {
// //               const stockInfo = getStockLevel(book.stock || 0);
// //               const isApproved = book.isApproved || book.adminApproval === "Approved";
              
// //               return (
// //                 <div 
// //                   key={book._id} 
// //                   className="bg-gradient-to-br from-zinc-800/60 via-zinc-900/60 to-black/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-700/50 overflow-hidden hover:border-yellow-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-400/20 hover:-translate-y-2 group animate-fadeInUp"
// //                   style={{ animationDelay: `${index * 50}ms` }}
// //                 >
// //                   <div className="relative h-72 bg-gradient-to-br from-zinc-900 to-black overflow-hidden">
// //                     <img 
// //                       src={book.url || book.images?.[0]?.url} 
// //                       alt={book.title} 
// //                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
// //                     />
// //                     <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>
                    
// //                     {/* Status Badge */}
// //                     <div className="absolute top-4 left-4 z-10">
// //                       {getStatusBadge(book)}
// //                     </div>

// //                     {/* Approval Status Badge (if not approved) */}
// //                     {!isApproved && (
// //                       <div className="absolute top-16 left-4 z-10">
// //                         <span className="px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 shadow-lg flex items-center gap-1.5">
// //                           <Clock className="w-3.5 h-3.5 animate-pulse" />
// //                           Pending Admin Approval
// //                         </span>
// //                       </div>
// //                     )}

// //                     {/* Stock Level Badge with Edit Option */}
// //                     <div className="absolute top-4 right-4 z-10">
// //                       {editingStock === book._id ? (
// //                         <div className="flex items-center gap-2 bg-black/90 backdrop-blur-sm rounded-xl p-2 border border-white/20 shadow-xl">
// //                           <input
// //                             type="number"
// //                             min="0"
// //                             value={newStockValue}
// //                             onChange={(e) => setNewStockValue(e.target.value)}
// //                             className="w-20 px-2 py-1 bg-zinc-800 border border-zinc-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
// //                             placeholder="Stock"
// //                             autoFocus
// //                           />
// //                           <button
// //                             onClick={() => handleStockUpdate(book._id)}
// //                             className="p-1.5 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
// //                           >
// //                             <Check className="w-4 h-4 text-green-400" />
// //                           </button>
// //                           <button
// //                             onClick={() => {
// //                               setEditingStock(null);
// //                               setNewStockValue("");
// //                             }}
// //                             className="p-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
// //                           >
// //                             <X className="w-4 h-4 text-red-400" />
// //                           </button>
// //                         </div>
// //                       ) : (
// //                         <div className={`flex items-center gap-2 ${stockInfo.bg} backdrop-blur-sm rounded-full border border-white/20 shadow-lg pl-3 pr-2 py-1.5 group/stock`}>
// //                           <stockInfo.icon className={`w-3.5 h-3.5 ${stockInfo.color}`} />
// //                           <span className={`text-xs font-bold ${stockInfo.color}`}>
// //                             {book.stock || 0}
// //                           </span>
// //                           {book.productStatus === "Available" && (
// //                             <button
// //                               onClick={() => {
// //                                 setEditingStock(book._id);
// //                                 setNewStockValue(book.stock?.toString() || "0");
// //                               }}
// //                               className="p-1 hover:bg-white/10 rounded-full transition-colors opacity-0 group-hover/stock:opacity-100"
// //                             >
// //                               <Pencil className="w-3 h-3 text-white" />
// //                             </button>
// //                           )}
// //                         </div>
// //                       )}
// //                     </div>

// //                     {/* Posted Date */}
// //                     <div className="absolute bottom-4 left-4 z-10">
// //                       <div className="flex items-center gap-2 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full border border-white/10 shadow-lg">
// //                         <Calendar className="w-3.5 h-3.5 text-yellow-400" />
// //                         <span className="text-xs font-semibold text-gray-200">
// //                           {formatDate(book.postedAt)}
// //                         </span>
// //                       </div>
// //                     </div>

// //                     {/* Last Sold */}
// //                     {book.lastSoldAt && (
// //                       <div className="absolute bottom-4 right-4 z-10">
// //                         <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/30 backdrop-blur-sm rounded-full border border-green-500/50 shadow-lg">
// //                           <ShoppingCart className="w-3.5 h-3.5 text-green-300" />
// //                           <span className="text-xs font-semibold text-green-200">
// //                             Sold {formatDate(book.lastSoldAt)}
// //                           </span>
// //                         </div>
// //                       </div>
// //                     )}

// //                     {/* Action Menu */}
// //                     <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
// //                       <button 
// //                         onClick={() => setActiveMenu(activeMenu === book._id ? null : book._id)} 
// //                         className="bg-black/70 backdrop-blur-sm p-2.5 rounded-full hover:bg-black/90 transition-all duration-300 shadow-xl border border-white/10 hover:scale-110"
// //                       >
// //                         <MoreVertical className="w-4 h-4 text-white" />
// //                       </button>
                      
// //                       {activeMenu === book._id && (
// //                         <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 w-60 bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-700 py-2 z-20 animate-slideDown">
// //                           <Link 
// //                             to={`/seller/edit-product/${book._id}`} 
// //                             className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800 transition-colors group/item"
// //                           >
// //                             <Edit className="w-4 h-4 text-yellow-400 group-hover/item:scale-110 transition-transform" />
// //                             <span className="text-sm text-gray-200 font-medium">Edit Product</span>
// //                           </Link>
// //                           <button 
// //                             onClick={() => { setStatusModal(book._id); setActiveMenu(null); }} 
// //                             className="w-full flex items-center gap-3 px-5 py-3 hover:bg-zinc-800 transition-colors group/item"
// //                           >
// //                             <RefreshCw className="w-4 h-4 text-blue-400 group-hover/item:rotate-180 transition-transform duration-500" />
// //                             <span className="text-sm text-gray-200 font-medium">Change Status</span>
// //                           </button>
// //                           <button 
// //                             onClick={() => { setDeleteConfirm(book._id); setActiveMenu(null); }} 
// //                             className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-500/10 transition-colors group/item"
// //                           >
// //                             <Trash2 className="w-4 h-4 text-red-400 group-hover/item:scale-110 transition-transform" />
// //                             <span className="text-sm text-gray-200 font-medium">Delete Product</span>
// //                           </button>
// //                         </div>
// //                       )}
// //                     </div>

// //                     {/* Image Count Badge */}
// //                     {book.images && book.images.length > 1 && (
// //                       <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
// //                         <div className="flex items-center gap-2 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full border border-white/10 shadow-lg">
// //                           <ImagePlus className="w-3.5 h-3.5 text-purple-400" />
// //                           <span className="text-xs font-semibold text-gray-200">
// //                             {book.images.length} photos
// //                           </span>
// //                         </div>
// //                       </div>
// //                     )}
// //                   </div>

// //                   <div className="p-6">
// //                     <h3 className="font-bold text-xl text-white mb-1 line-clamp-2 group-hover:text-yellow-400 transition-colors leading-tight">
// //                       {book.title}
// //                     </h3>
// //                     <p className="text-gray-400 text-sm mb-4 flex items-center gap-1">
// //                       <span className="text-gray-500">by</span> 
// //                       <span className="font-medium">{book.author}</span>
// //                     </p>

// //                     {/* Tags */}
// //                     <div className="flex items-center gap-2 mb-5 flex-wrap">
// //                       <span className="px-3 py-1.5 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-xl text-xs text-gray-300 border border-zinc-600 font-semibold flex items-center gap-1">
// //                         <Tag className="w-3 h-3" />
// //                         {book.category || "General"}
// //                       </span>
// //                       {book.editionOrPublishYear && book.editionOrPublishYear !== "N/A" && (
// //                         <span className="px-3 py-1.5 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-xl text-xs text-gray-300 border border-zinc-600 font-semibold">
// //                           {book.editionOrPublishYear}
// //                         </span>
// //                       )}
// //                       {book.language && (
// //                         <span className="px-3 py-1.5 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-xl text-xs text-gray-300 border border-zinc-600 font-semibold uppercase">
// //                           {book.language}
// //                         </span>
// //                       )}
// //                     </div>

// //                     {/* Stats */}
// //                     <div className="grid grid-cols-3 gap-3 mb-5">
// //                       <div className="bg-purple-500/10 rounded-xl p-3 border border-purple-500/20 hover:border-purple-500/40 transition-all">
// //                         <div className="flex items-center gap-1.5 mb-1">
// //                           <Eye className="w-3.5 h-3.5 text-purple-400" />
// //                           <span className="text-xs text-purple-400 font-semibold">Views</span>
// //                         </div>
// //                         <p className="text-lg font-bold text-white">{book.views || 0}</p>
// //                       </div>
                      
// //                       <div className="bg-green-500/10 rounded-xl p-3 border border-green-500/20 hover:border-green-500/40 transition-all">
// //                         <div className="flex items-center gap-1.5 mb-1">
// //                           <ShoppingCart className="w-3.5 h-3.5 text-green-400" />
// //                           <span className="text-xs text-green-400 font-semibold">Sold</span>
// //                         </div>
// //                         <p className="text-lg font-bold text-white">{book.sold || 0}</p>
// //                       </div>

// //                       <div className={`${stockInfo.bg} rounded-xl p-3 border ${stockInfo.color.replace('text-', 'border-')}/20 hover:border-opacity-40 transition-all`}>
// //                         <div className="flex items-center gap-1.5 mb-1">
// //                           <Boxes className={`w-3.5 h-3.5 ${stockInfo.color}`} />
// //                           <span className={`text-xs ${stockInfo.color} font-semibold`}>Stock</span>
// //                         </div>
// //                         <p className="text-lg font-bold text-white">{book.stock || 0}</p>
// //                       </div>
// //                     </div>

// //                     {/* Price */}
// //                     <div className="flex items-center justify-between mb-5 pb-5 border-b border-zinc-700/50">
// //                       <div>
// //                         <p className="text-xs text-gray-500 mb-1 font-medium">Price</p>
// //                         <p className="text-3xl font-black bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
// //                           ₹{book.price.toLocaleString()}
// //                         </p>
// //                       </div>
// //                       {book.sold > 0 && (
// //                         <div className="text-right">
// //                           <p className="text-xs text-gray-500 mb-1 font-medium">Revenue</p>
// //                           <p className="text-lg font-bold text-green-400">
// //                             ₹{((book.sold || 0) * book.price).toLocaleString()}
// //                           </p>
// //                         </div>
// //                       )}
// //                     </div>

// //                     {/* Action Buttons */}
// //                     <div className="flex gap-3">
// //                       <Link 
// //                         to={`/seller/edit-product/${book._id}`} 
// //                         className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-gray-900 rounded-xl hover:from-yellow-500 hover:via-yellow-600 hover:to-amber-600 transition-all duration-300 text-sm font-bold shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105 group/btn"
// //                       >
// //                         <Edit className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
// //                         Edit
// //                       </Link>
// //                       <button 
// //                         onClick={() => setStatusModal(book._id)} 
// //                         className="px-4 py-3 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-all duration-300 border border-blue-500/20 hover:border-blue-500/40 hover:scale-105 group/btn"
// //                       >
// //                         <RefreshCw className="w-4 h-4 group-hover/btn:rotate-180 transition-transform duration-500" />
// //                       </button>
// //                       <button 
// //                         onClick={() => setDeleteConfirm(book._id)} 
// //                         className="px-4 py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all duration-300 border border-red-500/20 hover:border-red-500/40 hover:scale-105 group/btn"
// //                       >
// //                         <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         )}

// //         {/* Status Update Modal */}
// //         {statusModal && (
// //           <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
// //             <div className="bg-gradient-to-br from-zinc-800 via-zinc-900 to-black rounded-3xl shadow-2xl border border-zinc-700 max-w-md w-full p-8 animate-slideUp">
// //               <div className="flex items-center gap-4 mb-6">
// //                 <div className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl shadow-lg shadow-blue-500/20">
// //                   <RefreshCw className="w-7 h-7 text-blue-400" />
// //                 </div>
// //                 <h3 className="text-2xl font-bold text-white">Update Product Status</h3>
// //               </div>
// //               <p className="text-gray-400 mb-6 text-base">
// //                 Change the status for "<span className="text-white font-semibold">{books.find(b => b._id === statusModal)?.title}</span>"
// //               </p>
              
// //               {books.find(b => b._id === statusModal)?.productStatus === "Sold Out" && (
// //                 <div className="mb-6 p-5 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl">
// //                   <p className="text-yellow-300 text-sm mb-4 flex items-center gap-2 font-medium">
// //                     <AlertCircle className="w-5 h-5 animate-pulse" />
// //                     To set product as "Available", you must add stock quantity
// //                   </p>
// //                   <label className="block text-sm text-gray-400 mb-2 font-semibold">Stock Quantity *</label>
// //                   <input 
// //                     type="number" 
// //                     min="1" 
// //                     value={stockInput} 
// //                     onChange={(e) => setStockInput(parseInt(e.target.value) || 1)} 
// //                     className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-xl text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none font-medium" 
// //                     placeholder="Enter stock quantity (minimum 1)" 
// //                   />
// //                 </div>
// //               )}
              
// //               {!(books.find(b => b._id === statusModal)?.isApproved || books.find(b => b._id === statusModal)?.adminApproval === "Approved") && (
// //                 <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
// //                   <p className="text-blue-300 text-sm flex items-center gap-2 font-medium">
// //                     <AlertCircle className="w-4 h-4" />
// //                     "Available" status will be enabled after admin approval
// //                   </p>
// //                 </div>
// //               )}
              
// //               <div className="space-y-3 mb-6">
// //                 {getAvailableStatusOptions(books.find(b => b._id === statusModal)).map((status) => (
// //                   <button 
// //                     key={status} 
// //                     onClick={() => { 
// //                       if (status === "Arriving Soon") { 
// //                         document.getElementById('restock-date-input').style.display = 'block'; 
// //                       } else { 
// //                         handleStatusUpdate(statusModal, status); 
// //                       } 
// //                     }} 
// //                     className="w-full flex items-center justify-between px-5 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all duration-300 border border-zinc-600 hover:border-zinc-500 group"
// //                   >
// //                     <span className="text-white font-semibold group-hover:text-yellow-400 transition-colors">{status}</span>
// //                     {books.find(b => b._id === statusModal)?.productStatus === status && (
// //                       <CheckCircle2 className="w-5 h-5 text-green-400 animate-pulse" />
// //                     )}
// //                   </button>
// //                 ))}
// //               </div>
              
// //               <div id="restock-date-input" style={{ display: 'none' }} className="mb-6">
// //                 <label className="block text-sm text-gray-400 mb-2 font-semibold">Expected Restock Date (Optional)</label>
// //                 <input 
// //                   type="date" 
// //                   value={restockDate} 
// //                   onChange={(e) => setRestockDate(e.target.value)} 
// //                   className="w-full px-4 py-3 bg-zinc-800 border border-zinc-600 rounded-xl text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none font-medium mb-4" 
// //                   min={new Date().toISOString().split('T')[0]} 
// //                 />
// //                 <button 
// //                   onClick={() => handleStatusUpdate(statusModal, "Arriving Soon")} 
// //                   className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-bold shadow-lg shadow-blue-500/30"
// //                 >
// //                   Set as Arriving Soon
// //                 </button>
// //               </div>
              
// //               <button 
// //                 onClick={() => { 
// //                   setStatusModal(null); 
// //                   setRestockDate(""); 
// //                   setStockInput(1); 
// //                   document.getElementById('restock-date-input').style.display = 'none'; 
// //                 }} 
// //                 className="w-full px-4 py-3 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-all duration-300 font-semibold border border-zinc-600 hover:border-zinc-500"
// //               >
// //                 Cancel
// //               </button>
// //             </div>
// //           </div>
// //         )}

// //         {/* Delete Confirmation Modal */}
// //         {deleteConfirm && (
// //           <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
// //             <div className="bg-gradient-to-br from-zinc-800 via-zinc-900 to-black rounded-3xl shadow-2xl border border-zinc-700 max-w-md w-full p-8 animate-slideUp">
// //               <div className="flex items-center gap-4 mb-6">
// //                 <div className="p-4 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-2xl shadow-lg shadow-red-500/20">
// //                   <Trash2 className="w-7 h-7 text-red-400" />
// //                 </div>
// //                 <h3 className="text-2xl font-bold text-white">Delete Product?</h3>
// //               </div>
// //               <p className="text-gray-400 mb-8 text-base">
// //                 Are you sure you want to delete "<span className="text-white font-semibold">{books.find(b => b._id === deleteConfirm)?.title}</span>"? This action cannot be undone.
// //               </p>
// //               <div className="flex gap-4">
// //                 <button 
// //                   onClick={() => setDeleteConfirm(null)} 
// //                   className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 transition-all duration-300 font-semibold border border-zinc-600 hover:border-zinc-500"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button 
// //                   onClick={() => handleDelete(deleteConfirm)} 
// //                   className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-300 font-bold shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
// //                 >
// //                   Delete
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       <style jsx>{`
// //         @keyframes gradient {
// //           0%, 100% { background-position: 0% 50%; }
// //           50% { background-position: 100% 50%; }
// //         }
        
// //         @keyframes float {
// //           0%, 100% { transform: translateY(0px); }
// //           50% { transform: translateY(-20px); }
// //         }
        
// //         @keyframes fadeIn {
// //           from { opacity: 0; }
// //           to { opacity: 1; }
// //         }
        
// //         @keyframes fadeInUp {
// //           from { 
// //             opacity: 0; 
// //             transform: translateY(30px); 
// //           }
// //           to { 
// //             opacity: 1; 
// //             transform: translateY(0); 
// //           }
// //         }
        
// //         @keyframes slideDown {
// //           from { 
// //             opacity: 0; 
// //             transform: translateY(-20px); 
// //           }
// //           to { 
// //             opacity: 1; 
// //             transform: translateY(0); 
// //           }
// //         }
        
// //         @keyframes slideUp {
// //           from { 
// //             opacity: 0; 
// //             transform: translateY(20px) scale(0.95); 
// //           }
// //           to { 
// //             opacity: 1; 
// //             transform: translateY(0) scale(1); 
// //           }
// //         }
        
// //         .animate-gradient { 
// //           background-size: 200% 200%;
// //           animation: gradient 3s ease infinite; 
// //         }
        
// //         .animate-float { animation: float 3s ease-in-out infinite; }
// //         .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
// //         .animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; }
// //         .animate-slideDown { animation: slideDown 0.3s ease-out; }
// //         .animate-slideUp { animation: slideUp 0.3s ease-out; }
// //         .animate-spin-slow { animation: spin 3s linear infinite; }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default MyProducts;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { 
//   Trash2, Edit, Eye, Package, TrendingUp, DollarSign, 
//   Search, Filter, Plus, Clock, AlertCircle, RefreshCw, CheckCircle2,
//   Boxes, Activity, ChevronDown, X, Pencil, Check
// } from "lucide-react";
// import Alert from "../Alert/Alert";
// import { useAlert } from "../Alert/useAlert";

// const MyProducts = () => {
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("newest");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [deleteConfirm, setDeleteConfirm] = useState(null);
//   const [statusModal, setStatusModal] = useState(null);
//   const [restockDate, setRestockDate] = useState("");
//   const [stockInput, setStockInput] = useState(1);
//   const [editingStock, setEditingStock] = useState(null);
//   const [newStockValue, setNewStockValue] = useState("");
//   const { alert, hideAlert, success, error, warning } = useAlert();

//   const headers = {
//     id: localStorage.getItem("id"),
//     authorization: `Bearer ${localStorage.getItem("token")}`,
//   };

//   useEffect(() => {
//     fetchSellerBooks();
//     const interval = setInterval(() => {
//       fetchSellerBooks();
//     }, 30000); // Auto-refresh every 30 seconds
//     return () => clearInterval(interval);
//   }, []);

//   const fetchSellerBooks = async () => {
//     try {
//       const res = await axios.get("http://localhost:3000/api/v1/seller/myproducts", { headers });
//       setBooks(res.data?.books || []);
//     } catch (err) {
//       console.error("❌ Failed to fetch seller books:", err);
//       if (loading) {
//         error("Failed to fetch products");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStockUpdate = async (bookId) => {
//     try {
//       const stockValue = parseInt(newStockValue);
      
//       if (isNaN(stockValue) || stockValue < 0) {
//         warning("Please enter a valid stock quantity");
//         return;
//       }

//       await axios.put(
//         `http://localhost:3000/api/v1/seller/update-book-stock/${bookId}`,
//         { stock: stockValue },
//         { headers }
//       );

//       setBooks(books.map(book => 
//         book._id === bookId ? { ...book, stock: stockValue } : book
//       ));
      
//       setEditingStock(null);
//       setNewStockValue("");
//       success(`Stock updated to ${stockValue} units`);
//     } catch (err) {
//       console.error("❌ Failed to update stock:", err);
//       error("Failed to update stock");
//     }
//   };

//   const handleDelete = async (bookId) => {
//     try {
//       await axios.delete(`http://localhost:3000/api/v1/seller/delete-book/${bookId}`, { headers });
//       setBooks(books.filter(book => book._id !== bookId));
//       setDeleteConfirm(null);
//       success("Product deleted successfully");
//     } catch (err) {
//       console.error("❌ Failed to delete book:", err);
//       error("Failed to delete product");
//     }
//   };

//   const handleStatusUpdate = async (bookId, newStatus) => {
//     try {
//       const book = books.find(b => b._id === bookId);
      
//       if (book.productStatus === "Sold Out" && newStatus === "Available" && stockInput <= 0) {
//         warning("Please enter a valid stock quantity (minimum 1)");
//         return;
//       }
      
//       const payload = {
//         productStatus: newStatus,
//         autoStatusUpdate: false
//       };
      
//       if (newStatus === "Arriving Soon" && restockDate) {
//         payload.expectedRestockDate = restockDate;
//       }
      
//       if (book.productStatus === "Sold Out" && newStatus === "Available") {
//         payload.stock = stockInput;
//       }
      
//       await axios.put(
//         `http://localhost:3000/api/v1/seller/update-product-status/${bookId}`, 
//         payload,
//         { headers }
//       );
      
//       fetchSellerBooks();
//       setStatusModal(null);
//       setRestockDate("");
//       setStockInput(1);
//       success(`Status updated to: ${newStatus}`);
//     } catch (err) {
//       console.error("❌ Failed to update status:", err);
//       error("Failed to update product status");
//     }
//   };

//   const formatDate = (date) => {
//     if (!date) return "N/A";
//     try {
//       const d = new Date(date);
//       if (isNaN(d.getTime())) return "N/A";
      
//       const now = new Date();
//       const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
      
//       if (diffDays === 0) return "Today";
//       if (diffDays === 1) return "Yesterday";
//       if (diffDays < 7) return `${diffDays}d ago`;
//       if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
      
//       return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//     } catch {
//       return "N/A";
//     }
//   };

//   const getStatusBadge = (book) => {
//     const stock = book.stock < 0 ? 0 : book.stock;
//     const isOutOfStock = stock === 0;
    
//     const statusConfig = {
//       "Available": { bg: "bg-green-500/20", text: "text-green-300", border: "border-green-500/50", icon: CheckCircle2 },
//       "Sold Out": { bg: "bg-red-500/20", text: "text-red-300", border: "border-red-500/50", icon: AlertCircle },
//       "Not Available": { bg: "bg-gray-500/20", text: "text-gray-300", border: "border-gray-500/50", icon: Package },
//       "Arriving Soon": { bg: "bg-blue-500/20", text: "text-blue-300", border: "border-blue-500/50", icon: Clock },
//       "Pending Approval": { bg: "bg-yellow-500/20", text: "text-yellow-300", border: "border-yellow-500/50", icon: Clock }
//     };
    
//     let displayStatus = book.productStatus || "Pending Approval";
//     if (isOutOfStock && book.productStatus === "Available") {
//       displayStatus = "Out of Stock";
//     }
    
//     const config = displayStatus === "Out of Stock" 
//       ? statusConfig["Sold Out"] 
//       : statusConfig[displayStatus] || statusConfig["Pending Approval"];
//     const Icon = config.icon;
    
//     return (
//       <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} border ${config.border} flex items-center gap-1`}>
//         <Icon className="w-3 h-3" />
//         {displayStatus}
//       </span>
//     );
//   };

//   const getStockLevel = (stock) => {
//     if (stock === 0) return { level: "Out", color: "text-red-400", bg: "bg-red-500/10" };
//     if (stock <= 5) return { level: "Low", color: "text-yellow-400", bg: "bg-yellow-500/10" };
//     return { level: "OK", color: "text-green-400", bg: "bg-green-500/10" };
//   };

//   const getAvailableStatusOptions = (book) => {
//     const isApproved = book.isApproved || book.adminApproval === "Approved";
//     if (!isApproved) return ["Arriving Soon", "Not Available"];
//     return ["Available", "Sold Out", "Not Available", "Arriving Soon"];
//   };

//   const filteredAndSortedBooks = books
//     .filter(book => {
//       const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                            book.author.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesStatus = filterStatus === "all" || book.productStatus === filterStatus;
//       return matchesSearch && matchesStatus;
//     })
//     .sort((a, b) => {
//       switch(sortBy) {
//         case "newest": return new Date(b.postedAt) - new Date(a.postedAt);
//         case "oldest": return new Date(a.postedAt) - new Date(b.postedAt);
//         case "price-high": return b.price - a.price;
//         case "price-low": return a.price - b.price;
//         case "stock-high": return (b.stock || 0) - (a.stock || 0);
//         case "stock-low": return (a.stock || 0) - (b.stock || 0);
//         default: return 0;
//       }
//     });

//   const totalRevenue = books.reduce((sum, book) => sum + (book.sold || 0) * book.price, 0);
//   const totalViews = books.reduce((sum, book) => sum + (book.views || 0), 0);
//   const totalStock = books.reduce((sum, book) => sum + (book.stock || 0), 0);
//   const availableProducts = books.filter(b => b.productStatus === "Available" && b.stock > 0).length;

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-300 text-lg">Loading products...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white px-4 sm:px-8 py-6 flex justify-center">
//       {alert && (
//         <Alert
//           type={alert.type}
//           title={alert.title}
//           message={alert.message}
//           duration={alert.duration}
//           position={alert.position}
//           autoClose={alert.autoClose}
//           onClose={hideAlert}
//         />
//       )}

//       <div className="w-full max-w-6xl bg-zinc-900/50 rounded-2xl px-6 sm:px-10 py-6 shadow-xl border border-zinc-700">
//         {/* Header */}
//         <div className="mb-6 text-center">
//           <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent mb-2">
//             My Products
//           </h1>
//           <p className="text-zinc-400 text-sm italic flex items-center justify-center gap-2">
//             <Activity className="w-4 h-4 text-yellow-400" />
//             Manage your inventory and track performance
//           </p>
//           <hr className="mt-4 border-zinc-700 rounded-full mx-auto w-1/2" />
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
//           <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-3 hover:border-yellow-400/50 transition-all">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-zinc-400 text-xs font-semibold">Products</span>
//               <Package className="w-4 h-4 text-yellow-400" />
//             </div>
//             <p className="text-xl font-bold text-white">{books.length}</p>
//             <p className="text-xs text-yellow-400">{availableProducts} Available</p>
//           </div>
          
//           <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-3 hover:border-green-400/50 transition-all">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-zinc-400 text-xs font-semibold">Revenue</span>
//               <DollarSign className="w-4 h-4 text-green-400" />
//             </div>
//             <p className="text-xl font-bold text-white">₹{totalRevenue.toLocaleString()}</p>
//           </div>
          
//           <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-3 hover:border-purple-400/50 transition-all">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-zinc-400 text-xs font-semibold">Views</span>
//               <Eye className="w-4 h-4 text-purple-400" />
//             </div>
//             <p className="text-xl font-bold text-white">{totalViews.toLocaleString()}</p>
//           </div>
          
//           <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-3 hover:border-blue-400/50 transition-all">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-zinc-400 text-xs font-semibold">Stock</span>
//               <Boxes className="w-4 h-4 text-blue-400" />
//             </div>
//             <p className="text-xl font-bold text-white">{totalStock}</p>
//           </div>
//         </div>

//         {/* Filters & Add Button */}
//         <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-4 mb-6">
//           <div className="flex flex-col lg:flex-row gap-3">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input 
//                 type="text" 
//                 placeholder="Search by title or author..." 
//                 value={searchTerm} 
//                 onChange={(e) => setSearchTerm(e.target.value)} 
//                 className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none text-white placeholder-gray-500 text-sm" 
//               />
//             </div>
            
//             <div className="flex items-center gap-2 bg-zinc-800 px-3 rounded-lg border border-zinc-700">
//               <Filter className="w-4 h-4 text-gray-400" />
//               <select 
//                 value={filterStatus} 
//                 onChange={(e) => setFilterStatus(e.target.value)} 
//                 className="bg-transparent py-2 pr-6 focus:outline-none text-white text-sm cursor-pointer"
//               >
//                 <option value="all" className="bg-zinc-900">All Status</option>
//                 <option value="Available" className="bg-zinc-900">Available</option>
//                 <option value="Sold Out" className="bg-zinc-900">Sold Out</option>
//                 <option value="Not Available" className="bg-zinc-900">Not Available</option>
//                 <option value="Arriving Soon" className="bg-zinc-900">Arriving Soon</option>
//               </select>
//               <ChevronDown className="w-3 h-3 text-gray-400" />
//             </div>
            
//             <div className="flex items-center gap-2 bg-zinc-800 px-3 rounded-lg border border-zinc-700">
//               <TrendingUp className="w-4 h-4 text-gray-400" />
//               <select 
//                 value={sortBy} 
//                 onChange={(e) => setSortBy(e.target.value)} 
//                 className="bg-transparent py-2 pr-6 focus:outline-none text-white text-sm cursor-pointer"
//               >
//                 <option value="newest" className="bg-zinc-900">Newest</option>
//                 <option value="oldest" className="bg-zinc-900">Oldest</option>
//                 <option value="price-high" className="bg-zinc-900">Price ↓</option>
//                 <option value="price-low" className="bg-zinc-900">Price ↑</option>
//                 <option value="stock-high" className="bg-zinc-900">Stock ↓</option>
//                 <option value="stock-low" className="bg-zinc-900">Stock ↑</option>
//               </select>
//               <ChevronDown className="w-3 h-3 text-gray-400" />
//             </div>

//             <Link 
//               to="/seller/add-book" 
//               className="flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all font-bold text-sm whitespace-nowrap"
//             >
//               <Plus className="w-4 h-4" />
//               Add Product
//             </Link>
//           </div>
//         </div>

//         {/* Products Grid */}
//         {filteredAndSortedBooks.length === 0 ? (
//           <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-12 text-center">
//             <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
//             <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
//             <p className="text-gray-400 mb-6 text-sm">
//               {searchTerm || filterStatus !== "all" ? "Try adjusting your filters" : "Start adding books to your inventory"}
//             </p>
//             <Link 
//               to="/seller/add-book" 
//               className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all font-bold text-sm"
//             >
//               <Plus className="w-4 h-4" />
//               Add Your First Product
//             </Link>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//             {filteredAndSortedBooks.map((book) => {
//               const stockInfo = getStockLevel(book.stock || 0);
//               const isApproved = book.isApproved || book.adminApproval === "Approved";
              
//               return (
//                 <div 
//                   key={book._id} 
//                   className="bg-zinc-800/40 rounded-lg border border-zinc-700 overflow-hidden hover:border-yellow-400/50 transition-all group"
//                 >
//                   <div className="relative h-40 bg-zinc-900 overflow-hidden">
//                     <img 
//                       src={book.url || book.images?.[0]?.url} 
//                       alt={book.title} 
//                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
//                     {/* Status */}
//                     <div className="absolute top-2 left-2">
//                       {getStatusBadge(book)}
//                     </div>

//                     {/* Stock with Edit */}
//                     <div className="absolute top-2 right-2">
//                       {editingStock === book._id ? (
//                         <div className="flex items-center gap-1 bg-black/90 rounded-lg p-1">
//                           <input
//                             type="number"
//                             min="0"
//                             value={newStockValue}
//                             onChange={(e) => setNewStockValue(e.target.value)}
//                             className="w-14 px-2 py-1 bg-zinc-800 border border-zinc-600 rounded text-white text-xs focus:ring-1 focus:ring-yellow-400 outline-none"
//                             autoFocus
//                           />
//                           <button
//                             onClick={() => handleStockUpdate(book._id)}
//                             className="p-1 bg-green-500/20 hover:bg-green-500/30 rounded"
//                           >
//                             <Check className="w-3 h-3 text-green-400" />
//                           </button>
//                           <button
//                             onClick={() => {
//                               setEditingStock(null);
//                               setNewStockValue("");
//                             }}
//                             className="p-1 bg-red-500/20 hover:bg-red-500/30 rounded"
//                           >
//                             <X className="w-3 h-3 text-red-400" />
//                           </button>
//                         </div>
//                       ) : (
//                         <div className={`flex items-center gap-1 ${stockInfo.bg} rounded-full px-2 py-1 group/stock`}>
//                           <span className={`text-xs font-bold ${stockInfo.color}`}>
//                             {book.stock || 0}
//                           </span>
//                           {book.productStatus === "Available" && (
//                             <button
//                               onClick={() => {
//                                 setEditingStock(book._id);
//                                 setNewStockValue(book.stock?.toString() || "0");
//                               }}
//                               className="p-0.5 hover:bg-white/10 rounded opacity-0 group-hover/stock:opacity-100"
//                             >
//                               <Pencil className="w-2.5 h-2.5 text-white" />
//                             </button>
//                           )}
//                         </div>
//                       )}
//                     </div>

//                     {/* Date */}
//                     <div className="absolute bottom-2 left-2">
//                       <span className="text-xs px-2 py-0.5 bg-black/70 rounded text-gray-200">
//                         {formatDate(book.postedAt)}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="p-3">
//                     <h3 className="font-bold text-sm text-white mb-1 line-clamp-2 group-hover:text-yellow-400 transition-colors">
//                       {book.title}
//                     </h3>
//                     <p className="text-gray-400 text-xs mb-2">by {book.author}</p>

//                     {/* Stats */}
//                     <div className="grid grid-cols-3 gap-2 mb-2 text-xs">
//                       <div className="bg-purple-500/10 rounded p-2 border border-purple-500/20">
//                         <p className="text-purple-400 mb-0.5">Views</p>
//                         <p className="font-bold text-white">{book.views || 0}</p>
//                       </div>
//                       <div className="bg-green-500/10 rounded p-2 border border-green-500/20">
//                         <p className="text-green-400 mb-0.5">Sold</p>
//                         <p className="font-bold text-white">{book.sold || 0}</p>
//                       </div>
//                       <div className={`${stockInfo.bg} rounded p-2 border border-${stockInfo.color.replace('text-', '')}/20`}>
//                         <p className={stockInfo.color + " mb-0.5"}>Stock</p>
//                         <p className="font-bold text-white">{book.stock || 0}</p>
//                       </div>
//                     </div>

//                     {/* Price */}
//                     <div className="flex items-center justify-between mb-2 pb-2 border-b border-zinc-700">
//                       <div>
//                         <p className="text-xs text-gray-500 mb-0.5">Price</p>
//                         <p className="text-lg font-bold text-yellow-400">₹{book.price.toLocaleString()}</p>
//                       </div>
//                       {book.sold > 0 && (
//                         <div className="text-right">
//                           <p className="text-xs text-gray-500 mb-0.5">Revenue</p>
//                           <p className="text-sm font-bold text-green-400">
//                             ₹{((book.sold || 0) * book.price).toLocaleString()}
//                           </p>
//                         </div>
//                       )}
//                     </div>

//                     {/* Actions */}
//                     <div className="flex gap-2">
//                       <Link 
//                         to={`/seller/edit-product/${book._id}`} 
//                         className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all text-xs font-bold"
//                       >
//                         <Edit className="w-3 h-3" />
//                         Edit
//                       </Link>
//                       <button 
//                         onClick={() => setStatusModal(book._id)} 
//                         className="px-3 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all border border-blue-500/20"
//                       >
//                         <RefreshCw className="w-3 h-3" />
//                       </button>
//                       <button 
//                         onClick={() => setDeleteConfirm(book._id)} 
//                         className="px-3 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all border border-red-500/20"
//                       >
//                         <Trash2 className="w-3 h-3" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Status Modal */}
//         {statusModal && (
//           <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <div className="bg-zinc-900 rounded-2xl border border-zinc-700 max-w-md w-full p-6">
//               <div className="flex items-center gap-3 mb-4">
//                 <RefreshCw className="w-6 h-6 text-blue-400" />
//                 <h3 className="text-xl font-bold text-white">Update Status</h3>
//               </div>
//               <p className="text-gray-400 mb-4 text-sm">
//                 Change status for "{books.find(b => b._id === statusModal)?.title}"
//               </p>
              
//               {books.find(b => b._id === statusModal)?.productStatus === "Sold Out" && (
//                 <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
//                   <p className="text-yellow-300 text-xs mb-2 flex items-center gap-1">
//                     <AlertCircle className="w-4 h-4" />
//                     Add stock to set as "Available"
//                   </p>
//                   <input 
//                     type="number" 
//                     min="1" 
//                     value={stockInput} 
//                     onChange={(e) => setStockInput(parseInt(e.target.value) || 1)} 
//                     className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-yellow-400 outline-none" 
//                     placeholder="Stock quantity (min 1)" 
//                   />
//                 </div>
//               )}
              
//               <div className="space-y-2 mb-4">
//                 {getAvailableStatusOptions(books.find(b => b._id === statusModal)).map((status) => (
//                   <button 
//                     key={status} 
//                     onClick={() => handleStatusUpdate(statusModal, status)} 
//                     className="w-full flex items-center justify-between px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all border border-zinc-700 text-sm"
//                   >
//                     <span className="text-white font-semibold">{status}</span>
//                     {books.find(b => b._id === statusModal)?.productStatus === status && (
//                       <CheckCircle2 className="w-4 h-4 text-green-400" />
//                     )}
//                   </button>
//                 ))}
//               </div>
              
//               <button 
//                 onClick={() => { 
//                   setStatusModal(null); 
//                   setRestockDate(""); 
//                   setStockInput(1); 
//                 }} 
//                 className="w-full px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all font-semibold text-sm"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Delete Modal */}
//         {deleteConfirm && (
//           <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <div className="bg-zinc-900 rounded-2xl border border-zinc-700 max-w-md w-full p-6">
//               <div className="flex items-center gap-3 mb-4">
//                 <Trash2 className="w-6 h-6 text-red-400" />
//                 <h3 className="text-xl font-bold text-white">Delete Product?</h3>
//               </div>
//               <p className="text-gray-400 mb-6 text-sm">
//                 Are you sure you want to delete "{books.find(b => b._id === deleteConfirm)?.title}"? This cannot be undone.
//               </p>
//               <div className="flex gap-3">
//                 <button 
//                   onClick={() => setDeleteConfirm(null)} 
//                   className="flex-1 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all font-semibold text-sm"
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   onClick={() => handleDelete(deleteConfirm)} 
//                   className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-bold text-sm"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyProducts;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { 
  Trash2, Edit, Eye, Package, TrendingUp, DollarSign, 
  Search, Filter, Plus, Clock, AlertCircle, RefreshCw, CheckCircle2,
  Boxes, Activity, ChevronDown, X, Pencil, Check
} from "lucide-react";
import Alert from "../Alert/Alert";
import { useAlert } from "../Alert/useAlert";

const MyProducts = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [statusModal, setStatusModal] = useState(null);
  const [restockDate, setRestockDate] = useState("");
  const [stockInput, setStockInput] = useState(1);
  const [editingStock, setEditingStock] = useState(null);
  const [newStockValue, setNewStockValue] = useState("");
  // ── NEW: wallet/revenue stats from dashboard-stats API ──
  const [revenueStats, setRevenueStats] = useState({
    totalRevenue: 0,
    walletBalance: 0,
    pendingRevenue: 0,
    totalWithdrawn: 0,
  });
  const { alert, hideAlert, success, error, warning } = useAlert();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    fetchSellerBooks();
    fetchRevenueStats();
    const interval = setInterval(() => {
      fetchSellerBooks();
      fetchRevenueStats();
    }, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSellerBooks = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/seller/myproducts", { headers });
      setBooks(res.data?.books || []);
    } catch (err) {
      console.error("❌ Failed to fetch seller books:", err);
      if (loading) {
        error("Failed to fetch products");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── NEW: fetch real revenue from wallet ──────────────────
  const fetchRevenueStats = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/seller/dashboard-stats", { headers });
      const overview = res.data?.data?.overview;
      if (overview) {
        setRevenueStats({
          totalRevenue:   overview.totalRevenue   || 0,
          walletBalance:  overview.walletBalance  || 0,
          pendingRevenue: overview.pendingRevenue || 0,
          totalWithdrawn: overview.totalWithdrawn || 0,
        });
      }
    } catch (err) {
      console.error("❌ Failed to fetch revenue stats:", err);
    }
  };
  // ─────────────────────────────────────────────────────────

  const handleStockUpdate = async (bookId) => {
    try {
      const stockValue = parseInt(newStockValue);
      
      if (isNaN(stockValue) || stockValue < 0) {
        warning("Please enter a valid stock quantity");
        return;
      }

      await axios.put(
        `http://localhost:3000/api/v1/seller/update-book-stock/${bookId}`,
        { stock: stockValue },
        { headers }
      );

      setBooks(books.map(book => 
        book._id === bookId ? { ...book, stock: stockValue } : book
      ));
      
      setEditingStock(null);
      setNewStockValue("");
      success(`Stock updated to ${stockValue} units`);
    } catch (err) {
      console.error("❌ Failed to update stock:", err);
      error("Failed to update stock");
    }
  };

  const handleDelete = async (bookId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/seller/delete-book/${bookId}`, { headers });
      setBooks(books.filter(book => book._id !== bookId));
      setDeleteConfirm(null);
      success("Product deleted successfully");
    } catch (err) {
      console.error("❌ Failed to delete book:", err);
      error("Failed to delete product");
    }
  };

  const handleStatusUpdate = async (bookId, newStatus) => {
    try {
      const book = books.find(b => b._id === bookId);
      
      if (book.productStatus === "Sold Out" && newStatus === "Available" && stockInput <= 0) {
        warning("Please enter a valid stock quantity (minimum 1)");
        return;
      }
      
      const payload = {
        productStatus: newStatus,
        autoStatusUpdate: false
      };
      
      if (newStatus === "Arriving Soon" && restockDate) {
        payload.expectedRestockDate = restockDate;
      }
      
      if (book.productStatus === "Sold Out" && newStatus === "Available") {
        payload.stock = stockInput;
      }
      
      await axios.put(
        `http://localhost:3000/api/v1/seller/update-product-status/${bookId}`, 
        payload,
        { headers }
      );
      
      fetchSellerBooks();
      setStatusModal(null);
      setRestockDate("");
      setStockInput(1);
      success(`Status updated to: ${newStatus}`);
    } catch (err) {
      console.error("❌ Failed to update status:", err);
      error("Failed to update product status");
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "N/A";
      
      const now = new Date();
      const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays}d ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
      
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return "N/A";
    }
  };

  const getStatusBadge = (book) => {
    const stock = book.stock < 0 ? 0 : book.stock;
    const isOutOfStock = stock === 0;
    
    const statusConfig = {
      "Available": { bg: "bg-green-500/20", text: "text-green-300", border: "border-green-500/50", icon: CheckCircle2 },
      "Sold Out": { bg: "bg-red-500/20", text: "text-red-300", border: "border-red-500/50", icon: AlertCircle },
      "Not Available": { bg: "bg-gray-500/20", text: "text-gray-300", border: "border-gray-500/50", icon: Package },
      "Arriving Soon": { bg: "bg-blue-500/20", text: "text-blue-300", border: "border-blue-500/50", icon: Clock },
      "Pending Approval": { bg: "bg-yellow-500/20", text: "text-yellow-300", border: "border-yellow-500/50", icon: Clock }
    };
    
    let displayStatus = book.productStatus || "Pending Approval";
    if (isOutOfStock && book.productStatus === "Available") {
      displayStatus = "Out of Stock";
    }
    
    const config = displayStatus === "Out of Stock" 
      ? statusConfig["Sold Out"] 
      : statusConfig[displayStatus] || statusConfig["Pending Approval"];
    const Icon = config.icon;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} border ${config.border} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {displayStatus}
      </span>
    );
  };

  const getStockLevel = (stock) => {
    if (stock === 0) return { level: "Out", color: "text-red-400", bg: "bg-red-500/10" };
    if (stock <= 5) return { level: "Low", color: "text-yellow-400", bg: "bg-yellow-500/10" };
    return { level: "OK", color: "text-green-400", bg: "bg-green-500/10" };
  };

  const getAvailableStatusOptions = (book) => {
    const isApproved = book.isApproved || book.adminApproval === "Approved";
    if (!isApproved) return ["Arriving Soon", "Not Available"];
    return ["Available", "Sold Out", "Not Available", "Arriving Soon"];
  };

  const filteredAndSortedBooks = books
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || book.productStatus === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case "newest": return new Date(b.postedAt) - new Date(a.postedAt);
        case "oldest": return new Date(a.postedAt) - new Date(b.postedAt);
        case "price-high": return b.price - a.price;
        case "price-low": return a.price - b.price;
        case "stock-high": return (b.stock || 0) - (a.stock || 0);
        case "stock-low": return (a.stock || 0) - (b.stock || 0);
        default: return 0;
      }
    });

  // These stay local (calculated from books array — no change needed)
  const totalViews = books.reduce((sum, book) => sum + (book.views || 0), 0);
  const totalStock = books.reduce((sum, book) => sum + (book.stock || 0), 0);
  const availableProducts = books.filter(b => b.productStatus === "Available" && b.stock > 0).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading products...</p>
        </div>
      </div>
    );
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

      <div className="w-full max-w-6xl bg-zinc-900/50 rounded-2xl px-6 sm:px-10 py-6 shadow-xl border border-zinc-700">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent mb-2">
            My Products
          </h1>
          <p className="text-zinc-400 text-sm italic flex items-center justify-center gap-2">
            <Activity className="w-4 h-4 text-yellow-400" />
            Manage your inventory and track performance
          </p>
          <hr className="mt-4 border-zinc-700 rounded-full mx-auto w-1/2" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-3 hover:border-yellow-400/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-400 text-xs font-semibold">Products</span>
              <Package className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="text-xl font-bold text-white">{books.length}</p>
            <p className="text-xs text-yellow-400">{availableProducts} Available</p>
          </div>
          
          {/* ── UPDATED: Revenue now from wallet (totalEarned from delivered orders) */}
          <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-3 hover:border-green-400/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-400 text-xs font-semibold">Total Revenue</span>
              <DollarSign className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-xl font-bold text-white">
              ₹{revenueStats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-green-400">From delivered orders</p>
          </div>
          
          <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-3 hover:border-purple-400/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-400 text-xs font-semibold">Views</span>
              <Eye className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-xl font-bold text-white">{totalViews.toLocaleString()}</p>
          </div>
          
          <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-3 hover:border-blue-400/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-400 text-xs font-semibold">Stock</span>
              <Boxes className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-xl font-bold text-white">{totalStock}</p>
          </div>
        </div>

        {/* Filters & Add Button */}
        <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by title or author..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none text-white placeholder-gray-500 text-sm" 
              />
            </div>
            
            <div className="flex items-center gap-2 bg-zinc-800 px-3 rounded-lg border border-zinc-700">
              <Filter className="w-4 h-4 text-gray-400" />
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)} 
                className="bg-transparent py-2 pr-6 focus:outline-none text-white text-sm cursor-pointer"
              >
                <option value="all" className="bg-zinc-900">All Status</option>
                <option value="Available" className="bg-zinc-900">Available</option>
                <option value="Sold Out" className="bg-zinc-900">Sold Out</option>
                <option value="Not Available" className="bg-zinc-900">Not Available</option>
                <option value="Arriving Soon" className="bg-zinc-900">Arriving Soon</option>
              </select>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </div>
            
            <div className="flex items-center gap-2 bg-zinc-800 px-3 rounded-lg border border-zinc-700">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                className="bg-transparent py-2 pr-6 focus:outline-none text-white text-sm cursor-pointer"
              >
                <option value="newest" className="bg-zinc-900">Newest</option>
                <option value="oldest" className="bg-zinc-900">Oldest</option>
                <option value="price-high" className="bg-zinc-900">Price ↓</option>
                <option value="price-low" className="bg-zinc-900">Price ↑</option>
                <option value="stock-high" className="bg-zinc-900">Stock ↓</option>
                <option value="stock-low" className="bg-zinc-900">Stock ↑</option>
              </select>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </div>

            <Link 
              to="/seller/add-book" 
              className="flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all font-bold text-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        {filteredAndSortedBooks.length === 0 ? (
          <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-12 text-center">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
            <p className="text-gray-400 mb-6 text-sm">
              {searchTerm || filterStatus !== "all" ? "Try adjusting your filters" : "Start adding books to your inventory"}
            </p>
            <Link 
              to="/seller/add-book" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all font-bold text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAndSortedBooks.map((book) => {
              const stockInfo = getStockLevel(book.stock || 0);
              const isApproved = book.isApproved || book.adminApproval === "Approved";
              
              return (
                <div 
                  key={book._id} 
                  className="bg-zinc-800/40 rounded-lg border border-zinc-700 overflow-hidden hover:border-yellow-400/50 transition-all group"
                >
                  <div className="relative h-40 bg-zinc-900 overflow-hidden">
                    <img 
                      src={book.url || book.images?.[0]?.url} 
                      alt={book.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    {/* Status */}
                    <div className="absolute top-2 left-2">
                      {getStatusBadge(book)}
                    </div>

                    {/* Stock with Edit */}
                    <div className="absolute top-2 right-2">
                      {editingStock === book._id ? (
                        <div className="flex items-center gap-1 bg-black/90 rounded-lg p-1">
                          <input
                            type="number"
                            min="0"
                            value={newStockValue}
                            onChange={(e) => setNewStockValue(e.target.value)}
                            className="w-14 px-2 py-1 bg-zinc-800 border border-zinc-600 rounded text-white text-xs focus:ring-1 focus:ring-yellow-400 outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleStockUpdate(book._id)}
                            className="p-1 bg-green-500/20 hover:bg-green-500/30 rounded"
                          >
                            <Check className="w-3 h-3 text-green-400" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingStock(null);
                              setNewStockValue("");
                            }}
                            className="p-1 bg-red-500/20 hover:bg-red-500/30 rounded"
                          >
                            <X className="w-3 h-3 text-red-400" />
                          </button>
                        </div>
                      ) : (
                        <div className={`flex items-center gap-1 ${stockInfo.bg} rounded-full px-2 py-1 group/stock`}>
                          <span className={`text-xs font-bold ${stockInfo.color}`}>
                            {book.stock || 0}
                          </span>
                          {book.productStatus === "Available" && (
                            <button
                              onClick={() => {
                                setEditingStock(book._id);
                                setNewStockValue(book.stock?.toString() || "0");
                              }}
                              className="p-0.5 hover:bg-white/10 rounded opacity-0 group-hover/stock:opacity-100"
                            >
                              <Pencil className="w-2.5 h-2.5 text-white" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Date */}
                    <div className="absolute bottom-2 left-2">
                      <span className="text-xs px-2 py-0.5 bg-black/70 rounded text-gray-200">
                        {formatDate(book.postedAt)}
                      </span>
                    </div>
                  </div>

                  <div className="p-3">
                    <h3 className="font-bold text-sm text-white mb-1 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-gray-400 text-xs mb-2">by {book.author}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-2 text-xs">
                      <div className="bg-purple-500/10 rounded p-2 border border-purple-500/20">
                        <p className="text-purple-400 mb-0.5">Views</p>
                        <p className="font-bold text-white">{book.views || 0}</p>
                      </div>
                      <div className="bg-green-500/10 rounded p-2 border border-green-500/20">
                        <p className="text-green-400 mb-0.5">Sold</p>
                        <p className="font-bold text-white">{book.sold || 0}</p>
                      </div>
                      <div className={`${stockInfo.bg} rounded p-2 border border-${stockInfo.color.replace('text-', '')}/20`}>
                        <p className={stockInfo.color + " mb-0.5"}>Stock</p>
                        <p className="font-bold text-white">{book.stock || 0}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-zinc-700">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Price</p>
                        <p className="text-lg font-bold text-yellow-400">₹{book.price.toLocaleString()}</p>
                      </div>
                      {book.sold > 0 && (
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-0.5">Est. Earned</p>
                          <p className="text-sm font-bold text-green-400">
                            ₹{((book.sold || 0) * book.price).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link 
                        to={`/seller/edit-product/${book._id}`} 
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all text-xs font-bold"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Link>
                      <button 
                        onClick={() => setStatusModal(book._id)} 
                        className="px-3 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all border border-blue-500/20"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm(book._id)} 
                        className="px-3 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all border border-red-500/20"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Status Modal */}
        {statusModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-700 max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <RefreshCw className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Update Status</h3>
              </div>
              <p className="text-gray-400 mb-4 text-sm">
                Change status for "{books.find(b => b._id === statusModal)?.title}"
              </p>
              
              {books.find(b => b._id === statusModal)?.productStatus === "Sold Out" && (
                <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-300 text-xs mb-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Add stock to set as "Available"
                  </p>
                  <input 
                    type="number" 
                    min="1" 
                    value={stockInput} 
                    onChange={(e) => setStockInput(parseInt(e.target.value) || 1)} 
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-yellow-400 outline-none" 
                    placeholder="Stock quantity (min 1)" 
                  />
                </div>
              )}
              
              <div className="space-y-2 mb-4">
                {getAvailableStatusOptions(books.find(b => b._id === statusModal)).map((status) => (
                  <button 
                    key={status} 
                    onClick={() => handleStatusUpdate(statusModal, status)} 
                    className="w-full flex items-center justify-between px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all border border-zinc-700 text-sm"
                  >
                    <span className="text-white font-semibold">{status}</span>
                    {books.find(b => b._id === statusModal)?.productStatus === status && (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    )}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => { 
                  setStatusModal(null); 
                  setRestockDate(""); 
                  setStockInput(1); 
                }} 
                className="w-full px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all font-semibold text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-700 max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trash2 className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-bold text-white">Delete Product?</h3>
              </div>
              <p className="text-gray-400 mb-6 text-sm">
                Are you sure you want to delete "{books.find(b => b._id === deleteConfirm)?.title}"? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteConfirm(null)} 
                  className="flex-1 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all font-semibold text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDelete(deleteConfirm)} 
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-bold text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProducts;