// import { useState, useEffect } from "react";
// import { Package, TrendingUp, Clock, CheckCircle, XCircle, Bell, AlertCircle, RefreshCw, Trash2, Eye, MapPin, User, Phone, Mail, Calendar, DollarSign, CreditCard, Truck, Box } from "lucide-react";

// export default function SellerOrdersDashboard() {
//   const [orders, setOrders] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [notifications, setNotifications] = useState([]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [failedOrders, setFailedOrders] = useState([]);
//   const [showFailedModal, setShowFailedModal] = useState(false);
//   const [trackingUpdate, setTrackingUpdate] = useState({ orderId: null, status: "", location: "" });

//   const headers = {
//     id: localStorage.getItem("id"),
//     authorization: `Bearer ${localStorage.getItem("token")}`,
//   };

//   // Poll for new orders every 5 seconds
//   useEffect(() => {
//     fetchOrders();
//     fetchStats();
//     fetchNotifications();
//     fetchFailedOrders();

//     const interval = setInterval(() => {
//       fetchNotifications();
//       fetchFailedOrders();
//       fetchOrders(); // Refresh orders to sync with product page
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [filterStatus, currentPage]);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const queryParams = new URLSearchParams({
//         page: currentPage,
//         limit: 10
//       });
      
//       if (filterStatus !== "all") {
//         queryParams.append("status", filterStatus);
//       }

//       const response = await fetch(
//         `http://localhost:3000/api/v1/seller/orders?${queryParams}`,
//         { headers }
//       );

//       const data = await response.json();
//       setOrders(data.data.orders);
//     } catch (error) {
//       console.error("Failed to fetch orders:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       const response = await fetch(
//         "http://localhost:3000/api/v1/seller/dashboard-stats",
//         { headers }
//       );

//       const data = await response.json();
//       setStats(data.data);
//     } catch (error) {
//       console.error("Failed to fetch stats:", error);
//     }
//   };

//   const fetchNotifications = async () => {
//     try {
//       const response = await fetch(
//         "http://localhost:3000/api/v1/seller/new-order-notifications",
//         { headers }
//       );

//       const data = await response.json();
//       if (data.status === "Success") {
//         setNotifications(data.data.notifications);
//       }
//     } catch (error) {
//       console.error("Failed to fetch notifications:", error);
//     }
//   };

//   const fetchFailedOrders = async () => {
//     try {
//       const response = await fetch(
//         "http://localhost:3000/api/v1/seller/failed-payment-orders",
//         { headers }
//       );

//       const data = await response.json();
//       if (data.status === "Success") {
//         setFailedOrders(data.data.orders);
//       }
//     } catch (error) {
//       console.error("Failed to fetch failed orders:", error);
//     }
//   };

//   const markNotificationAsRead = async (notificationId) => {
//     try {
//       await fetch(
//         `http://localhost:3000/api/v1/seller/notification/${notificationId}/read`,
//         {
//           method: "PUT",
//           headers,
//         }
//       );

//       setNotifications(notifications.filter(n => n._id !== notificationId));
//     } catch (error) {
//       console.error("Failed to mark notification as read:", error);
//     }
//   };

//   const updateOrderStatus = async (orderId, newStatus) => {
//     try {
//       const response = await fetch(
//         `http://localhost:3000/api/v1/seller/order/${orderId}/status`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             ...headers,
//           },
//           body: JSON.stringify({ orderStatus: newStatus }),
//         }
//       );

//       const data = await response.json();
//       if (data.status === "Success") {
//         alert(`✅ Order status updated to: ${newStatus}`);
//         fetchOrders();
//         setSelectedOrder(null);
//       }
//     } catch (error) {
//       console.error("Failed to update order:", error);
//       alert("Failed to update order status");
//     }
//   };

//   const addTrackingUpdate = async () => {
//     if (!trackingUpdate.status || !trackingUpdate.location) {
//       alert("Please fill in both status and location");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `http://localhost:3000/api/v1/seller/order/${trackingUpdate.orderId}/tracking`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             ...headers,
//           },
//           body: JSON.stringify({
//             status: trackingUpdate.status,
//             location: trackingUpdate.location
//           }),
//         }
//       );

//       const data = await response.json();
//       if (data.status === "Success") {
//         alert("✅ Tracking history updated!");
//         fetchOrders();
//         setTrackingUpdate({ orderId: null, status: "", location: "" });
        
//         // Refresh selected order details
//         const updatedOrder = orders.find(o => o._id === trackingUpdate.orderId);
//         if (updatedOrder) {
//           setSelectedOrder(data.data.order);
//         }
//       }
//     } catch (error) {
//       console.error("Failed to add tracking update:", error);
//       alert("Failed to update tracking history");
//     }
//   };

//   const handleFailedOrder = async (orderId, action) => {
//     try {
//       const response = await fetch(
//         `http://localhost:3000/api/v1/seller/handle-failed-order/${orderId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             ...headers,
//           },
//           body: JSON.stringify({ action }),
//         }
//       );

//       const data = await response.json();
//       if (data.status === "Success") {
//         alert(data.message);
//         fetchFailedOrders();
//         fetchOrders();
//       }
//     } catch (error) {
//       console.error("Failed to handle failed order:", error);
//       alert("Failed to process the action");
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       "Order Placed": "bg-blue-500/20 text-blue-300 border-blue-500/50",
//       "Processing": "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
//       "Shipped": "bg-purple-500/20 text-purple-300 border-purple-500/50",
//       "Out for Delivery": "bg-orange-500/20 text-orange-300 border-orange-500/50",
//       "Delivered": "bg-green-500/20 text-green-300 border-green-500/50",
//       "Cancelled": "bg-red-500/20 text-red-300 border-red-500/50",
//     };
//     return colors[status] || "bg-gray-500/20 text-gray-300 border-gray-500/50";
//   };

//   const getPaymentStatusColor = (status) => {
//     return status === "Success" 
//       ? "text-green-400" 
//       : status === "Pending" 
//       ? "text-yellow-400" 
//       : "text-red-400";
//   };

//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('en-US', { 
//       month: 'short', 
//       day: 'numeric', 
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (loading && !stats) {
//     return (
//       <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-300 text-lg">Loading orders...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header with Notifications */}
//         <div className="mb-8 flex justify-between items-center">
//           <div>
//             <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
//               📦 Orders Dashboard
//             </h1>
//             <p className="text-gray-400">Manage orders and track deliveries</p>
//           </div>
          
//           <div className="flex gap-4">
//             {/* Failed Orders Alert */}
//             {failedOrders.length > 0 && (
//               <button
//                 onClick={() => setShowFailedModal(true)}
//                 className="relative p-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition border border-red-500/50"
//               >
//                 <AlertCircle className="w-6 h-6" />
//                 <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
//                   {failedOrders.length}
//                 </span>
//               </button>
//             )}

//             {/* Notification Bell */}
//             <button
//               onClick={() => setShowNotifications(!showNotifications)}
//               className="relative p-3 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition border border-blue-500/50"
//             >
//               <Bell className="w-6 h-6" />
//               {notifications.length > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
//                   {notifications.length}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Notifications Dropdown */}
//         {showNotifications && notifications.length > 0 && (
//           <div className="mb-6 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl shadow-xl p-4 border border-blue-500/50">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="font-bold text-lg text-blue-400">🎉 New Order Notifications</h3>
//               <button
//                 onClick={() => setShowNotifications(false)}
//                 className="text-gray-400 hover:text-gray-200"
//               >
//                 <XCircle className="w-5 h-5" />
//               </button>
//             </div>
            
//             <div className="space-y-3 max-h-96 overflow-y-auto">
//               {notifications.map((notification) => (
//                 <div
//                   key={notification._id}
//                   className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/30 hover:bg-blue-500/20 transition"
//                 >
//                   <div className="flex justify-between items-start">
//                     <div className="flex-1">
//                       <p className="font-semibold text-blue-300">📚 New Order Received!</p>
//                       <p className="text-sm text-gray-300 mt-1">
//                         <strong>{notification.book?.title}</strong>
//                       </p>
//                       <p className="text-xs text-gray-400 mt-1">
//                         Order #{notification.orderId?.slice(-8)} • ₹{notification.amount}
//                       </p>
//                       <p className="text-xs text-gray-500 mt-1">
//                         {formatDate(notification.createdAt)}
//                       </p>
//                       <p className="text-xs text-blue-400 mt-2 font-medium">
//                         📦 Book status updated automatically
//                       </p>
//                     </div>
//                     <button
//                       onClick={() => markNotificationAsRead(notification._id)}
//                       className="ml-4 px-3 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
//                     >
//                       Mark Read
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Failed Orders Modal */}
//         {showFailedModal && failedOrders.length > 0 && (
//           <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl border border-zinc-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <h2 className="text-2xl font-bold text-red-400">⚠️ Failed Payment Orders</h2>
//                     <p className="text-sm text-gray-400 mt-1">
//                       These orders had payment failures. Choose to remove or re-upload the books.
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => setShowFailedModal(false)}
//                     className="text-gray-400 hover:text-gray-200"
//                   >
//                     <XCircle className="w-6 h-6" />
//                   </button>
//                 </div>

//                 <div className="space-y-4">
//                   {failedOrders.map((order) => (
//                     <div key={order._id} className="p-4 bg-red-500/10 rounded-xl border border-red-500/30">
//                       <div className="flex gap-4">
//                         <img
//                           src={order.book?.url || "/placeholder.jpg"}
//                           alt={order.book?.title}
//                           className="w-20 h-28 object-cover rounded-lg"
//                         />
//                         <div className="flex-1">
//                           <h3 className="font-semibold text-white">{order.book?.title}</h3>
//                           <p className="text-sm text-gray-400 mt-1">
//                             Order #{order._id.slice(-8)} • ₹{order.amountPayable}
//                           </p>
//                           <p className="text-xs text-red-400 font-medium mt-1">
//                             Payment Failed on {formatDate(order.createdAt)}
//                           </p>
//                           <p className="text-xs text-gray-400 mt-1">
//                             Customer: {order.shippingAddress?.fullName}
//                           </p>
//                         </div>
//                         <div className="flex flex-col gap-2">
//                           <button
//                             onClick={() => handleFailedOrder(order._id, 'reupload')}
//                             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2"
//                           >
//                             <RefreshCw className="w-4 h-4" />
//                             Re-upload Book
//                           </button>
//                           <button
//                             onClick={() => handleFailedOrder(order._id, 'remove')}
//                             className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm flex items-center gap-2"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                             Remove Book
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Statistics Cards */}
//         {stats && (
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//             <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl shadow-xl border border-zinc-700 p-6 hover:border-green-400/50 transition-all group">
//               <div className="flex items-center justify-between mb-3">
//                 <span className="text-gray-400 text-sm font-medium">Total Revenue</span>
//                 <div className="p-3 bg-green-400/10 rounded-xl group-hover:bg-green-400/20 transition-colors">
//                   <TrendingUp className="w-5 h-5 text-green-400" />
//                 </div>
//               </div>
//               <p className="text-3xl font-bold text-white">
//                 ₹{stats.overview.totalRevenue.toLocaleString()}
//               </p>
//               <p className="text-sm text-green-400 mt-2">↑ Completed payments</p>
//             </div>

//             <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl shadow-xl border border-zinc-700 p-6 hover:border-yellow-400/50 transition-all group">
//               <div className="flex items-center justify-between mb-3">
//                 <span className="text-gray-400 text-sm font-medium">Pending Payments</span>
//                 <div className="p-3 bg-yellow-400/10 rounded-xl group-hover:bg-yellow-400/20 transition-colors">
//                   <Clock className="w-5 h-5 text-yellow-400" />
//                 </div>
//               </div>
//               <p className="text-3xl font-bold text-white">
//                 ₹{stats.overview.pendingRevenue.toLocaleString()}
//               </p>
//               <p className="text-sm text-yellow-400 mt-2">⏳ Awaiting confirmation</p>
//             </div>

//             <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl shadow-xl border border-zinc-700 p-6 hover:border-blue-400/50 transition-all group">
//               <div className="flex items-center justify-between mb-3">
//                 <span className="text-gray-400 text-sm font-medium">Total Orders</span>
//                 <div className="p-3 bg-blue-400/10 rounded-xl group-hover:bg-blue-400/20 transition-colors">
//                   <Package className="w-5 h-5 text-blue-400" />
//                 </div>
//               </div>
//               <p className="text-3xl font-bold text-white">
//                 {stats.overview.totalOrders}
//               </p>
//               <p className="text-sm text-blue-400 mt-2">📦 All time</p>
//             </div>

//             <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl shadow-xl border border-zinc-700 p-6 hover:border-purple-400/50 transition-all group">
//               <div className="flex items-center justify-between mb-3">
//                 <span className="text-gray-400 text-sm font-medium">COD Orders</span>
//                 <div className="p-3 bg-purple-400/10 rounded-xl group-hover:bg-purple-400/20 transition-colors">
//                   <CheckCircle className="w-5 h-5 text-purple-400" />
//                 </div>
//               </div>
//               <p className="text-3xl font-bold text-white">
//                 {stats.overview.codOrders}
//               </p>
//               <p className="text-sm text-purple-400 mt-2">💵 Cash on delivery</p>
//             </div>
//           </div>
//         )}

//         {/* Filter Tabs */}
//         <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl shadow-xl border border-zinc-700 mb-6 overflow-hidden">
//           <div className="flex border-b border-zinc-700 overflow-x-auto">
//             {["all", "Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"].map((status) => (
//               <button
//                 key={status}
//                 onClick={() => {
//                   setFilterStatus(status);
//                   setCurrentPage(1);
//                 }}
//                 className={`px-6 py-4 font-medium whitespace-nowrap transition-all ${
//                   filterStatus === status
//                     ? "border-b-2 border-yellow-400 text-yellow-400 bg-yellow-400/10"
//                     : "text-gray-400 hover:text-gray-200 hover:bg-zinc-800/50"
//                 }`}
//               >
//                 {status === "all" ? "All Orders" : status}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Orders Grid */}
//         {loading ? (
//           <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl shadow-xl border border-zinc-700 p-12 text-center">
//             <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//             <p className="text-gray-400">Loading orders...</p>
//           </div>
//         ) : orders.length === 0 ? (
//           <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl shadow-xl border border-zinc-700 p-12 text-center">
//             <Package className="w-20 h-20 text-gray-600 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-white mb-2">No orders found</h3>
//             <p className="text-gray-400">
//               {filterStatus !== "all" ? `No orders with status: ${filterStatus}` : "Orders will appear here when customers make purchases"}
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {orders.map((order) => (
//               <div key={order._id} className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl shadow-xl border border-zinc-700 overflow-hidden hover:border-yellow-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10 group">
//                 <div className="p-6">
//                   {/* Order Header */}
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="flex gap-4">
//                       <img
//                         src={order.book?.url || "/placeholder.jpg"}
//                         alt={order.book?.title}
//                         className="w-16 h-20 object-cover rounded-lg border-2 border-zinc-700 group-hover:border-yellow-400/50 transition-colors"
//                       />
//                       <div>
//                         <h3 className="font-semibold text-white group-hover:text-yellow-400 transition-colors">
//                           {order.book?.title}
//                         </h3>
//                         <p className="text-sm text-gray-400 mt-1">
//                           Order #{order._id.slice(-8)}
//                         </p>
//                         <div className="flex items-center gap-2 mt-2">
//                           <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(order.orderStatus)}`}>
//                             {order.orderStatus}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
//                         ₹{order.amountPayable.toLocaleString()}
//                       </p>
//                       <p className={`text-xs font-medium mt-1 ${getPaymentStatusColor(order.paymentStatus)}`}>
//                         {order.paymentMethod} - {order.paymentStatus}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Order Details Grid */}
//                   <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-zinc-900/50 rounded-xl border border-zinc-700">
//                     <div className="flex items-center gap-2">
//                       <Calendar className="w-4 h-4 text-blue-400" />
//                       <div>
//                         <p className="text-xs text-gray-500">Order Date</p>
//                         <p className="text-sm text-gray-300 font-medium">{formatDate(order.createdAt)}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Clock className="w-4 h-4 text-orange-400" />
//                       <div>
//                         <p className="text-xs text-gray-500">Expected Delivery</p>
//                         <p className="text-sm text-gray-300 font-medium">
//                           {order.expectedDeliveryDate ? formatDate(order.expectedDeliveryDate) : formatDate(order.deliveryDate)}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <User className="w-4 h-4 text-purple-400" />
//                       <div>
//                         <p className="text-xs text-gray-500">Customer</p>
//                         <p className="text-sm text-gray-300 font-medium">{order.shippingAddress?.fullName}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <MapPin className="w-4 h-4 text-green-400" />
//                       <div>
//                         <p className="text-xs text-gray-500">Location</p>
//                         <p className="text-sm text-gray-300 font-medium">{order.currentLocation || "Warehouse"}</p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* View Details Button */}
//                   <button
//                     onClick={() => setSelectedOrder(order)}
//                     className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 text-sm font-semibold shadow-lg shadow-yellow-500/20"
//                   >
//                     <Eye className="w-4 h-4" />
//                     View Full Details & Update Status
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Order Details Modal */}
//         {selectedOrder && (
//           <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
//             <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl border border-zinc-700 max-w-4xl w-full my-8">
//               <div className="p-6">
//                 {/* Modal Header */}
//                 <div className="flex justify-between items-start mb-6">
//                   <div>
//                     <h2 className="text-2xl font-bold text-white mb-1">Order Details</h2>
//                     <p className="text-sm text-gray-400">Order ID: {selectedOrder._id}</p>
//                   </div>
//                   <button
//                     onClick={() => setSelectedOrder(null)}
//                     className="text-gray-400 hover:text-gray-200 transition-colors"
//                   >
//                     <XCircle className="w-6 h-6" />
//                   </button>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   {/* Left Column */}
//                   <div className="space-y-6">
//                     {/* Book Information */}
//                     <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-700">
//                       <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
//                         <Box className="w-5 h-5 text-yellow-400" />
//                         Book Information
//                       </h3>
//                       <div className="flex gap-4">
//                         <img
//                           src={selectedOrder.book?.url}
//                           alt={selectedOrder.book?.title}
//                           className="w-20 h-28 object-cover rounded-lg border-2 border-zinc-700"
//                         />
//                         <div className="flex-1">
//                           <p className="font-medium text-white">{selectedOrder.book?.title}</p>
//                           <p className="text-sm text-gray-400 mt-1">{selectedOrder.book?.author}</p>
//                           <p className="text-sm text-gray-400 mt-1">Language: {selectedOrder.book?.language}</p>
//                           <p className="text-sm text-gray-400 mt-1">Category: {selectedOrder.book?.category}</p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Payment Information */}
//                     <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-700">
//                       <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
//                         <CreditCard className="w-5 h-5 text-green-400" />
//                         Payment Information
//                       </h3>
//                       <div className="grid grid-cols-2 gap-3 text-sm">
//                         <div>
//                           <p className="text-gray-500">Amount</p>
//                           <p className="font-medium text-white text-lg">₹{selectedOrder.amountPayable.toLocaleString()}</p>
//                         </div>
//                         <div>
//                           <p className="text-gray-500">Method</p>
//                           <p className="font-medium text-white">{selectedOrder.paymentMethod}</p>
//                         </div>
//                         <div>
//                           <p className="text-gray-500">Status</p>
//                           <p className={`font-medium ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
//                             {selectedOrder.paymentStatus}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-gray-500">Order Date</p>
//                           <p className="font-medium text-white text-sm">
//                             {formatDate(selectedOrder.createdAt)}
//                           </p>
//                         </div>
//                         {selectedOrder.discount > 0 && (
//                           <div>
//                             <p className="text-gray-500">Discount</p>
//                             <p className="font-medium text-green-400">-₹{selectedOrder.discount}</p>
//                           </div>
//                         )}
//                         {selectedOrder.handlingFee > 0 && (
//                           <div>
//                             <p className="text-gray-500">Handling Fee</p>
//                             <p className="font-medium text-yellow-400">+₹{selectedOrder.handlingFee}</p>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Customer Information */}
//                     <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-700">
//                       <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
//                         <User className="w-5 h-5 text-purple-400" />
//                         Customer Information
//                       </h3>
//                       <div className="space-y-2 text-sm">
//                         <div className="flex items-center gap-2">
//                           <User className="w-4 h-4 text-gray-500" />
//                           <span className="text-gray-500">Name:</span>
//                           <span className="font-medium text-white">{selectedOrder.shippingAddress.fullName}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Phone className="w-4 h-4 text-gray-500" />
//                           <span className="text-gray-500">Phone:</span>
//                           <span className="font-medium text-white">{selectedOrder.shippingAddress.phone}</span>
//                         </div>
//                         {selectedOrder.user?.email && (
//                           <div className="flex items-center gap-2">
//                             <Mail className="w-4 h-4 text-gray-500" />
//                             <span className="text-gray-500">Email:</span>
//                             <span className="font-medium text-white">{selectedOrder.user.email}</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Delivery Address */}
//                     <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-700">
//                       <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
//                         <MapPin className="w-5 h-5 text-orange-400" />
//                         Delivery Address
//                       </h3>
//                       <p className="text-sm text-gray-300 leading-relaxed">
//                         {selectedOrder.shippingAddress.addressLine1}
//                         {selectedOrder.shippingAddress.addressLine2 && `, ${selectedOrder.shippingAddress.addressLine2}`}
//                         <br />
//                         {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.postalCode}
//                         <br />
//                         {selectedOrder.shippingAddress.country}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Right Column */}
//                   <div className="space-y-6">
//                     {/* Update Order Status */}
//                     <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-700">
//                       <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
//                         <Truck className="w-5 h-5 text-blue-400" />
//                         Update Order Status
//                       </h3>
//                       <div className="grid grid-cols-2 gap-2">
//                         {["Processing", "Shipped", "Out for Delivery", "Delivered"].map((status) => (
//                           <button
//                             key={status}
//                             onClick={() => updateOrderStatus(selectedOrder._id, status)}
//                             disabled={selectedOrder.orderStatus === status}
//                             className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
//                               selectedOrder.orderStatus === status
//                                 ? "bg-zinc-700 text-gray-500 cursor-not-allowed"
//                                 : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg"
//                             }`}
//                           >
//                             {selectedOrder.orderStatus === status && <CheckCircle className="w-4 h-4 inline mr-1" />}
//                             {status}
//                           </button>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Add Tracking Update */}
//                     <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-700">
//                       <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
//                         <MapPin className="w-5 h-5 text-green-400" />
//                         Add Tracking Update
//                       </h3>
//                       <div className="space-y-3">
//                         <div>
//                           <label className="block text-xs text-gray-400 mb-1.5">Status Update</label>
//                           <input
//                             type="text"
//                             placeholder="e.g., Package picked up from warehouse"
//                             value={trackingUpdate.orderId === selectedOrder._id ? trackingUpdate.status : ""}
//                             onChange={(e) => setTrackingUpdate({ 
//                               orderId: selectedOrder._id, 
//                               status: e.target.value, 
//                               location: trackingUpdate.location 
//                             })}
//                             className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-xs text-gray-400 mb-1.5">Current Location</label>
//                           <input
//                             type="text"
//                             placeholder="e.g., Mumbai Distribution Center"
//                             value={trackingUpdate.orderId === selectedOrder._id ? trackingUpdate.location : ""}
//                             onChange={(e) => setTrackingUpdate({ 
//                               orderId: selectedOrder._id, 
//                               status: trackingUpdate.status, 
//                               location: e.target.value 
//                             })}
//                             className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none"
//                           />
//                         </div>
//                         <button
//                           onClick={addTrackingUpdate}
//                           className="w-full px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 text-sm font-medium shadow-lg flex items-center justify-center gap-2"
//                         >
//                           <RefreshCw className="w-4 h-4" />
//                           Add Tracking Update
//                         </button>
//                       </div>
//                     </div>

//                     {/* Tracking History */}
//                     <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-700">
//                       <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
//                         <Clock className="w-5 h-5 text-yellow-400" />
//                         Tracking History
//                       </h3>
//                       {selectedOrder.trackingHistory && selectedOrder.trackingHistory.length > 0 ? (
//                         <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
//                           {selectedOrder.trackingHistory.map((track, index) => (
//                             <div key={index} className="flex gap-3">
//                               <div className="flex flex-col items-center">
//                                 <div className={`w-3 h-3 rounded-full ${
//                                   index === 0 ? 'bg-green-400' : 'bg-blue-400'
//                                 }`}></div>
//                                 {index !== selectedOrder.trackingHistory.length - 1 && (
//                                   <div className="w-0.5 h-full bg-zinc-700 mt-1"></div>
//                                 )}
//                               </div>
//                               <div className="flex-1 pb-4">
//                                 <p className="font-medium text-sm text-white">{track.status}</p>
//                                 <p className="text-xs text-gray-400 mt-0.5">{track.location}</p>
//                                 <p className="text-xs text-gray-500 mt-1">
//                                   {formatDate(track.date)}
//                                 </p>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         <p className="text-sm text-gray-500 text-center py-4">
//                           No tracking updates yet. Add the first update above.
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { Package, TrendingUp, Clock, CheckCircle, XCircle, Bell, AlertCircle, RefreshCw, Trash2, Eye, MapPin, User, Phone, Mail, Calendar, DollarSign, CreditCard, Truck, Box, Activity } from "lucide-react";
import Alert from "../Alert/Alert";
import { useAlert } from "../Alert/useAlert";

export default function SellerOrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [failedOrders, setFailedOrders] = useState([]);
  const [showFailedModal, setShowFailedModal] = useState(false);
  const [trackingUpdate, setTrackingUpdate] = useState({ orderId: null, status: "", location: "" });
  
  const { alert, hideAlert, success, error, warning } = useAlert();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Fetch data on mount and when filters change
  useEffect(() => {
    fetchOrders();
    fetchStats();
    fetchNotifications();
    fetchFailedOrders();
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
        `http://localhost:3000/api/v1/seller/orders?${queryParams}`,
        { headers }
      );

      const data = await response.json();
      setOrders(data.data.orders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      if (loading) {
        error("Failed to fetch orders");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/seller/dashboard-stats",
        { headers }
      );

      const data = await response.json();
      setStats(data.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/seller/new-order-notifications",
        { headers }
      );

      const data = await response.json();
      if (data.status === "Success") {
        setNotifications(data.data.notifications);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const fetchFailedOrders = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/seller/failed-payment-orders",
        { headers }
      );

      const data = await response.json();
      if (data.status === "Success") {
        setFailedOrders(data.data.orders);
      }
    } catch (err) {
      console.error("Failed to fetch failed orders:", err);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await fetch(
        `http://localhost:3000/api/v1/seller/notification/${notificationId}/read`,
        {
          method: "PUT",
          headers,
        }
      );

      setNotifications(notifications.filter(n => n._id !== notificationId));
      success("Notification marked as read");
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      error("Failed to mark notification as read");
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/seller/order/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: JSON.stringify({ orderStatus: newStatus }),
        }
      );

      const data = await response.json();
      if (data.status === "Success") {
        success(`Order status updated to: ${newStatus}`);
        fetchOrders();
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error("Failed to update order:", err);
      error("Failed to update order status");
    }
  };

  const addTrackingUpdate = async () => {
    if (!trackingUpdate.status || !trackingUpdate.location) {
      warning("Please fill in both status and location");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/seller/order/${trackingUpdate.orderId}/tracking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: JSON.stringify({
            status: trackingUpdate.status,
            location: trackingUpdate.location
          }),
        }
      );

      const data = await response.json();
      if (data.status === "Success") {
        success("Tracking history updated successfully");
        fetchOrders();
        setTrackingUpdate({ orderId: null, status: "", location: "" });
        
        // Refresh selected order details
        const updatedOrder = orders.find(o => o._id === trackingUpdate.orderId);
        if (updatedOrder) {
          setSelectedOrder(data.data.order);
        }
      }
    } catch (err) {
      console.error("Failed to add tracking update:", err);
      error("Failed to update tracking history");
    }
  };

  const handleFailedOrder = async (orderId, action) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/seller/handle-failed-order/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: JSON.stringify({ action }),
        }
      );

      const data = await response.json();
      if (data.status === "Success") {
        success(data.message);
        fetchFailedOrders();
        fetchOrders();
      }
    } catch (err) {
      console.error("Failed to handle failed order:", err);
      error("Failed to process the action");
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
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading orders...</p>
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

      <div className="w-full max-w-7xl bg-zinc-900/50 rounded-2xl px-6 sm:px-10 py-6 shadow-xl border border-zinc-700">
        {/* Header with Notifications */}
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
            
            <div className="flex gap-3">
              {/* Failed Orders Alert */}
              {failedOrders.length > 0 && (
                <button
                  onClick={() => setShowFailedModal(true)}
                  className="relative p-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition border border-red-500/50"
                >
                  <AlertCircle className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
                    {failedOrders.length}
                  </span>
                </button>
              )}

              {/* Notification Bell */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition border border-blue-500/50"
              >
                <Bell className="w-6 h-6" />
                {notifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>
          </div>
          <hr className="border-zinc-700 rounded-full mx-auto w-1/2" />
        </div>

        {/* Notifications Dropdown */}
        {showNotifications && notifications.length > 0 && (
          <div className="mb-6 bg-zinc-800/40 rounded-lg border border-blue-500/50 p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-blue-400">🎉 New Order Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/30 hover:bg-blue-500/20 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-blue-300">📚 New Order Received!</p>
                      <p className="text-sm text-gray-300 mt-1">
                        <strong>{notification.book?.title}</strong>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Order #{notification.orderId?.slice(-8)} • ₹{notification.amount}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(notification.createdAt)}
                      </p>
                      <p className="text-xs text-blue-400 mt-2 font-medium">
                        📦 Book status updated automatically
                      </p>
                    </div>
                    <button
                      onClick={() => markNotificationAsRead(notification._id)}
                      className="ml-4 px-3 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700"
                    >
                      Mark Read
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Failed Orders Modal */}
        {showFailedModal && failedOrders.length > 0 && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-red-400">⚠️ Failed Payment Orders</h2>
                    <p className="text-sm text-gray-400 mt-1">
                      These orders had payment failures. Choose to remove or re-upload the books.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowFailedModal(false)}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {failedOrders.map((order) => (
                    <div key={order._id} className="p-4 bg-red-500/10 rounded-xl border border-red-500/30">
                      <div className="flex gap-4">
                        <img
                          src={order.book?.url || "/placeholder.jpg"}
                          alt={order.book?.title}
                          className="w-20 h-28 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{order.book?.title}</h3>
                          <p className="text-sm text-gray-400 mt-1">
                            Order #{order._id.slice(-8)} • ₹{order.amountPayable}
                          </p>
                          <p className="text-xs text-red-400 font-medium mt-1">
                            Payment Failed on {formatDate(order.createdAt)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Customer: {order.shippingAddress?.fullName}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleFailedOrder(order._id, 'reupload')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Re-upload Book
                          </button>
                          <button
                            onClick={() => handleFailedOrder(order._id, 'remove')}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove Book
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-3 hover:border-green-400/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-xs font-semibold">Total Revenue</span>
                <div className="p-2 bg-green-400/10 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                ₹{stats.overview.totalRevenue.toLocaleString()}
              </p>
              <p className="text-xs text-green-400 mt-1">↑ Completed payments</p>
            </div>

            <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-3 hover:border-yellow-400/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-xs font-semibold">Pending Payments</span>
                <div className="p-2 bg-yellow-400/10 rounded-lg">
                  <Clock className="w-4 h-4 text-yellow-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                ₹{stats.overview.pendingRevenue.toLocaleString()}
              </p>
              <p className="text-xs text-yellow-400 mt-1">⏳ Awaiting confirmation</p>
            </div>

            <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-3 hover:border-blue-400/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-xs font-semibold">Total Orders</span>
                <div className="p-2 bg-blue-400/10 rounded-lg">
                  <Package className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                {stats.overview.totalOrders}
              </p>
              <p className="text-xs text-blue-400 mt-1">📦 All time</p>
            </div>

            <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-3 hover:border-purple-400/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-xs font-semibold">COD Orders</span>
                <div className="p-2 bg-purple-400/10 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-purple-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                {stats.overview.codOrders}
              </p>
              <p className="text-xs text-purple-400 mt-1">💵 Cash on delivery</p>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 mb-6 overflow-hidden">
          <div className="flex border-b border-zinc-700 overflow-x-auto">
            {["all", "Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilterStatus(status);
                  setCurrentPage(1);
                }}
                className={`px-6 py-3 font-medium whitespace-nowrap transition-all text-sm ${
                  filterStatus === status
                    ? "border-b-2 border-yellow-400 text-yellow-400 bg-yellow-400/10"
                    : "text-gray-400 hover:text-gray-200 hover:bg-zinc-800/50"
                }`}
              >
                {status === "all" ? "All Orders" : status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Grid */}
        {loading ? (
          <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-12 text-center">
            <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-zinc-800/40 rounded-lg border border-zinc-700 p-12 text-center">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No orders found</h3>
            <p className="text-gray-400 text-sm">
              {filterStatus !== "all" ? `No orders with status: ${filterStatus}` : "Orders will appear here when customers make purchases"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {orders.map((order) => (
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
                          {order.book?.title}
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
                        ₹{order.amountPayable.toLocaleString()}
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
                          {order.expectedDeliveryDate ? formatDate(order.expectedDeliveryDate) : formatDate(order.deliveryDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3 text-purple-400" />
                      <div>
                        <p className="text-xs text-gray-500">Customer</p>
                        <p className="text-xs text-gray-300 font-medium">{order.shippingAddress?.fullName}</p>
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
                    onClick={() => setSelectedOrder(null)}
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
                          <p className="text-xs text-gray-400 mt-1">{selectedOrder.book?.author}</p>
                          <p className="text-xs text-gray-400 mt-1">Language: {selectedOrder.book?.language}</p>
                          <p className="text-xs text-gray-400 mt-1">Category: {selectedOrder.book?.category}</p>
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
                          <p className="font-medium text-white text-lg">₹{selectedOrder.amountPayable.toLocaleString()}</p>
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
                          <span className="font-medium text-white text-xs">{selectedOrder.shippingAddress.fullName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-500 text-xs">Phone:</span>
                          <span className="font-medium text-white text-xs">{selectedOrder.shippingAddress.phone}</span>
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
                        {selectedOrder.shippingAddress.addressLine1}
                        {selectedOrder.shippingAddress.addressLine2 && `, ${selectedOrder.shippingAddress.addressLine2}`}
                        <br />
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.postalCode}
                        <br />
                        {selectedOrder.shippingAddress.country}
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

                    {/* Add Tracking Update */}
                    <div className="p-4 bg-zinc-800/40 rounded-lg border border-zinc-700">
                      <h3 className="font-semibold text-white mb-3 flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-green-400" />
                        Add Tracking Update
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Status Update</label>
                          <input
                            type="text"
                            placeholder="e.g., Package picked up from warehouse"
                            value={trackingUpdate.orderId === selectedOrder._id ? trackingUpdate.status : ""}
                            onChange={(e) => setTrackingUpdate({ 
                              orderId: selectedOrder._id, 
                              status: e.target.value, 
                              location: trackingUpdate.location 
                            })}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Current Location</label>
                          <input
                            type="text"
                            placeholder="e.g., Mumbai Distribution Center"
                            value={trackingUpdate.orderId === selectedOrder._id ? trackingUpdate.location : ""}
                            onChange={(e) => setTrackingUpdate({ 
                              orderId: selectedOrder._id, 
                              status: trackingUpdate.status, 
                              location: e.target.value 
                            })}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none"
                          />
                        </div>
                        <button
                          onClick={addTrackingUpdate}
                          className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 text-xs font-medium flex items-center justify-center gap-2"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Add Tracking Update
                        </button>
                      </div>
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
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDate(track.date)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 text-center py-4">
                          No tracking updates yet. Add the first update above.
                        </p>
                      )}
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