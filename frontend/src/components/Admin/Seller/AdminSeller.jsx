// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { 
//   FaStore, 
//   FaCheckCircle, 
//   FaClock, 
//   FaTimesCircle, 
//   FaBan,
//   FaEnvelope,
//   FaPhone,
//   FaMapMarkerAlt,
//   FaUserTie,
//   FaSearch,
//   FaSync,
//   FaEye,
//   FaTimes,
//   FaUniversity,
//   FaIdCard,
//   FaTrash
// } from 'react-icons/fa';
// import Loader from '../../Loader/Loader';

// const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
// const API_BASE = "http://localhost:3000/api/v1";

// // ==================== UTILITY FUNCTIONS ====================
// const getAuthHeaders = () => ({
//   id: localStorage.getItem("id"),
//   authorization: `Bearer ${localStorage.getItem("token")}`,
// });

// const formatDate = (date) => {
//   return new Date(date).toLocaleDateString("en-IN", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// };

// // ==================== STATUS BADGE ====================
// const StatusBadge = ({ status }) => {
//   const statusConfig = {
//     Approved: {
//       bg: "bg-gradient-to-r from-emerald-500 to-green-500",
//       text: "text-white",
//       icon: <FaCheckCircle className="inline mr-1" />
//     },
//     Rejected: {
//       bg: "bg-gradient-to-r from-red-500 to-rose-500",
//       text: "text-white",
//       icon: <FaTimesCircle className="inline mr-1" />
//     },
//     Pending: {
//       bg: "bg-gradient-to-r from-amber-400 to-yellow-500",
//       text: "text-white",
//       icon: <FaClock className="inline mr-1" />
//     },
//     Banned: {
//       bg: "bg-gradient-to-r from-slate-600 to-gray-700",
//       text: "text-white",
//       icon: <FaBan className="inline mr-1" />
//     },
//   };

//   const config = statusConfig[status] || statusConfig.Pending;

//   return (
//     <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${config.bg} ${config.text} shadow-md`}>
//       {config.icon}
//       {status}
//     </span>
//   );
// };

// // ==================== SELLER CARD ====================
// const SellerCard = ({ seller, onView, onAction }) => {
//   const user = seller.user || {};
  
//   return (
//     <div
//       onClick={() => onView(seller)}
//       className="bg-zinc-900/70 rounded-2xl border border-zinc-700 hover:border-yellow-400 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-yellow-400/20 overflow-hidden transform hover:scale-[1.02]"
//     >
//       {/* Card Header with Image */}
//       <div className="relative h-32 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
//         <img
//           src={user.avatar || DEFAULT_AVATAR}
//           onError={(e) => (e.target.src = DEFAULT_AVATAR)}
//           alt={seller.fullName}
//           className="w-20 h-20 rounded-full object-cover border-4 border-zinc-900 shadow-xl group-hover:scale-110 transition-transform duration-300"
//         />
//         <div className="absolute top-3 right-3">
//           <StatusBadge status={seller.status} />
//         </div>
//         <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//       </div>

//       {/* Card Body */}
//       <div className="p-5">
//         {/* Name & Business */}
//         <div className="mb-4 text-center">
//           <h3 className="text-xl font-bold text-white mb-1 truncate group-hover:text-yellow-400 transition-colors">
//             {seller.fullName || "No Name"}
//           </h3>
//           {seller.businessName && (
//             <p className="text-sm text-yellow-400 flex items-center justify-center gap-1 font-medium">
//               <FaStore className="text-xs" />
//               {seller.businessName}
//             </p>
//           )}
//           <span className="inline-block mt-2 text-xs bg-zinc-800 px-3 py-1 rounded-full text-zinc-400 border border-zinc-700">
//             {seller.sellerType}
//           </span>
//         </div>

//         {/* Contact Info */}
//         <div className="space-y-2 mb-4 text-sm">
//           <div className="flex items-center gap-2 text-zinc-300 truncate bg-zinc-800/50 px-3 py-2 rounded-lg">
//             <FaEnvelope className="text-yellow-400 flex-shrink-0" />
//             <span className="truncate">{user.email || seller.email}</span>
//           </div>
//           <div className="flex items-center gap-2 text-zinc-300 bg-zinc-800/50 px-3 py-2 rounded-lg">
//             <FaPhone className="text-yellow-400 flex-shrink-0" />
//             <span>{user.phone || seller.phone || "N/A"}</span>
//           </div>
//           {seller.pickupAddress && (
//             <div className="flex items-center gap-2 text-zinc-300 truncate bg-zinc-800/50 px-3 py-2 rounded-lg">
//               <FaMapMarkerAlt className="text-yellow-400 flex-shrink-0" />
//               <span className="truncate">{seller.pickupAddress.city}, {seller.pickupAddress.state}</span>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="pt-4 border-t border-zinc-700">
//           <p className="text-xs text-zinc-500 text-center mb-3">
//             Joined: {formatDate(seller.createdAt)}
//           </p>
          
//           {/* Action Buttons */}
//           <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
//             {seller.status === "Pending" && (
//               <>
//                 <button
//                   onClick={() => onAction(seller, "approve")}
//                   className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg transform hover:scale-105"
//                 >
//                   <FaCheckCircle className="inline mr-1" />
//                   Approve
//                 </button>
//                 <button
//                   onClick={() => onAction(seller, "reject")}
//                   className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg transform hover:scale-105"
//                 >
//                   <FaTimesCircle className="inline mr-1" />
//                   Reject
//                 </button>
//               </>
//             )}
            
//             {seller.status === "Approved" && (
//               <button
//                 onClick={() => onAction(seller, "ban")}
//                 className="flex-1 bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg transform hover:scale-105"
//               >
//                 <FaBan className="inline mr-1" />
//                 Ban
//               </button>
//             )}
            
//             {seller.status === "Banned" && (
//               <button
//                 onClick={() => onAction(seller, "unban")}
//                 className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg transform hover:scale-105"
//               >
//                 <FaCheckCircle className="inline mr-1" />
//                 Unban
//               </button>
//             )}
            
//             {seller.status === "Rejected" && (
//               <button
//                 onClick={() => onAction(seller, "moveToPending")}
//                 className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg transform hover:scale-105"
//               >
//                 <FaClock className="inline mr-1" />
//                 Review
//               </button>
//             )}
            
//             <button
//               onClick={() => onView(seller)}
//               className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg transform hover:scale-105"
//             >
//               <FaEye className="inline" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ==================== ACTION MODAL ====================
// const ActionModal = ({ seller, action, onClose, onConfirm }) => {
//   const [reason, setReason] = useState("");
//   const [loading, setLoading] = useState(false);

//   const actionConfig = {
//     approve: {
//       title: "Approve Seller Application",
//       message: `Approve ${seller?.fullName}'s application?`,
//       color: "emerald",
//       requireReason: false,
//       buttonText: "Approve Seller"
//     },
//     reject: {
//       title: "Reject Seller Application",
//       message: `Provide a reason for rejecting ${seller?.fullName}'s application:`,
//       color: "red",
//       requireReason: true,
//       buttonText: "Reject Application"
//     },
//     ban: {
//       title: "Ban Seller Account",
//       message: `Provide a reason for banning ${seller?.fullName}:`,
//       color: "slate",
//       requireReason: true,
//       buttonText: "Ban Seller"
//     },
//     delete: {
//       title: "Delete Seller",
//       message: `⚠️ Permanently delete ${seller?.fullName}? Provide a reason:`,
//       color: "red",
//       requireReason: true,
//       buttonText: "Delete Permanently"
//     },
//     unban: {
//       title: "Unban Seller",
//       message: `Unban ${seller?.fullName}?`,
//       color: "emerald",
//       requireReason: false,
//       buttonText: "Unban Seller"
//     },
//     moveToPending: {
//       title: "Move to Pending Review",
//       message: `Move ${seller?.fullName}'s application to pending?`,
//       color: "amber",
//       requireReason: false,
//       buttonText: "Move to Pending"
//     }
//   };

//   const config = actionConfig[action] || actionConfig.approve;

//   const handleSubmit = async () => {
//     if (config.requireReason && !reason.trim()) {
//       alert("Please provide a reason");
//       return;
//     }
//     setLoading(true);
//     await onConfirm(reason);
//     setLoading(false);
//   };

//   if (!seller) return null;

//   return (
//     <div 
//       className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
//       onClick={onClose}
//     >
//       <div
//         className="bg-zinc-900 rounded-2xl max-w-md w-full border border-zinc-700 shadow-2xl transform animate-in zoom-in-95 duration-200"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className={`bg-gradient-to-r from-${config.color}-500 to-${config.color}-600 p-6 rounded-t-2xl`}>
//           <div className="flex items-center justify-between">
//             <h3 className="text-2xl font-bold text-white">{config.title}</h3>
//             <button onClick={onClose} className="text-white/80 hover:text-white">
//               <FaTimes className="text-xl" />
//             </button>
//           </div>
//         </div>

//         {/* Body */}
//         <div className="p-6">
//           <p className="text-zinc-300 mb-4">{config.message}</p>

//           {config.requireReason && (
//             <textarea
//               value={reason}
//               onChange={(e) => setReason(e.target.value)}
//               placeholder="Enter your reason here..."
//               className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition-colors min-h-[120px] resize-none"
//               required
//             />
//           )}

//           {/* Action Buttons */}
//           <div className="flex gap-3 mt-6">
//             <button
//               onClick={onClose}
//               disabled={loading}
//               className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className={`flex-1 bg-gradient-to-r from-${config.color}-500 to-${config.color}-600 hover:from-${config.color}-600 hover:to-${config.color}-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg disabled:opacity-50`}
//             >
//               {loading ? "Processing..." : config.buttonText}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ==================== DETAIL MODAL ====================
// const DetailModal = ({ seller, onClose, onAction }) => {
//   if (!seller) return null;
  
//   const user = seller.user || {};

//   return (
//     <div 
//       className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
//       onClick={onClose}
//     >
//       <div
//         className="bg-zinc-900 rounded-2xl max-w-4xl w-full border border-zinc-700 shadow-2xl my-8"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 p-6 rounded-t-2xl">
//           <div className="flex justify-between items-start">
//             <div className="flex items-center gap-4">
//               <img
//                 src={user.avatar || DEFAULT_AVATAR}
//                 onError={(e) => (e.target.src = DEFAULT_AVATAR)}
//                 alt={seller.fullName}
//                 className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-xl"
//               />
//               <div>
//                 <h2 className="text-2xl font-bold text-black mb-1">
//                   {seller.fullName}
//                 </h2>
//                 {seller.businessName && (
//                   <p className="text-black/80 font-medium flex items-center gap-2">
//                     <FaStore />
//                     {seller.businessName}
//                   </p>
//                 )}
//                 <div className="mt-2">
//                   <StatusBadge status={seller.status} />
//                 </div>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               className="text-black/80 hover:text-black p-2 hover:bg-black/10 rounded-lg transition-colors"
//             >
//               <FaTimes className="text-xl" />
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
//           {/* Personal Information */}
//           <div>
//             <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//               <FaUserTie className="text-yellow-400" />
//               Personal Information
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
//                 <p className="text-zinc-400 text-xs mb-1">Email</p>
//                 <p className="text-white font-medium flex items-center gap-2">
//                   <FaEnvelope className="text-yellow-400" />
//                   {user.email || seller.email}
//                 </p>
//               </div>
//               <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
//                 <p className="text-zinc-400 text-xs mb-1">Phone</p>
//                 <p className="text-white font-medium flex items-center gap-2">
//                   <FaPhone className="text-yellow-400" />
//                   {user.phone || seller.phone || "N/A"}
//                 </p>
//               </div>
//               <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
//                 <p className="text-zinc-400 text-xs mb-1">Seller Type</p>
//                 <p className="text-white font-medium">{seller.sellerType}</p>
//               </div>
//               <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
//                 <p className="text-zinc-400 text-xs mb-1">Joined Date</p>
//                 <p className="text-white font-medium">{formatDate(seller.createdAt)}</p>
//               </div>
//             </div>
//           </div>

//           {/* Business Information */}
//           {seller.businessName && (
//             <div>
//               <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                 <FaStore className="text-yellow-400" />
//                 Business Information
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
//                   <p className="text-zinc-400 text-xs mb-1">Business Name</p>
//                   <p className="text-white font-medium">{seller.businessName}</p>
//                 </div>
//                 <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
//                   <p className="text-zinc-400 text-xs mb-1">GST Number</p>
//                   <p className="text-white font-medium flex items-center gap-2">
//                     <FaIdCard className="text-yellow-400" />
//                     {seller.gstNumber || "Not Provided"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Bank Details */}
//           {seller.bankHolderName && (
//             <div>
//               <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                 <FaUniversity className="text-yellow-400" />
//                 Bank Details
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
//                   <p className="text-zinc-400 text-xs mb-1">Account Holder</p>
//                   <p className="text-white font-medium">{seller.bankHolderName}</p>
//                 </div>
//                 <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
//                   <p className="text-zinc-400 text-xs mb-1">Account Number</p>
//                   <p className="text-white font-medium">••••{seller.bankAccountNumber?.slice(-4)}</p>
//                 </div>
//                 <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
//                   <p className="text-zinc-400 text-xs mb-1">IFSC Code</p>
//                   <p className="text-white font-medium">{seller.bankIFSC}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Address */}
//           {seller.pickupAddress && (
//             <div>
//               <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//                 <FaMapMarkerAlt className="text-yellow-400" />
//                 Pickup Address
//               </h3>
//               <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
//                 <p className="text-white leading-relaxed">
//                   {seller.pickupAddress.street}
//                   {seller.pickupAddress.village && `, ${seller.pickupAddress.village}`}
//                   <br />
//                   {seller.pickupAddress.city}, {seller.pickupAddress.state} - {seller.pickupAddress.pincode}
//                   <br />
//                   {seller.pickupAddress.country}
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex flex-wrap gap-3 pt-4 border-t border-zinc-700">
//             {seller.status === "Pending" && (
//               <>
//                 <button
//                   onClick={() => onAction(seller, "approve")}
//                   className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
//                 >
//                   <FaCheckCircle className="inline mr-2" />
//                   Approve
//                 </button>
//                 <button
//                   onClick={() => onAction(seller, "reject")}
//                   className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
//                 >
//                   <FaTimesCircle className="inline mr-2" />
//                   Reject
//                 </button>
//               </>
//             )}
            
//             {seller.status === "Approved" && (
//               <button
//                 onClick={() => onAction(seller, "ban")}
//                 className="flex-1 bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
//               >
//                 <FaBan className="inline mr-2" />
//                 Ban Seller
//               </button>
//             )}
            
//             {seller.status === "Banned" && (
//               <button
//                 onClick={() => onAction(seller, "unban")}
//                 className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
//               >
//                 <FaCheckCircle className="inline mr-2" />
//                 Unban
//               </button>
//             )}
            
//             {seller.status === "Rejected" && (
//               <button
//                 onClick={() => onAction(seller, "moveToPending")}
//                 className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
//               >
//                 <FaClock className="inline mr-2" />
//                 Move to Pending
//               </button>
//             )}
            
//             <button
//               onClick={() => onAction(seller, "delete")}
//               className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
//             >
//               <FaTrash className="inline mr-2" />
//               Delete
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ==================== MAIN COMPONENT ====================
// const AllSellers = () => {
//   const [sellers, setSellers] = useState(null);
//   const [filteredSellers, setFilteredSellers] = useState(null);
//   const [filter, setFilter] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedSeller, setSelectedSeller] = useState(null);
//   const [selectedAction, setSelectedAction] = useState(null);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [refreshKey, setRefreshKey] = useState(0);

//   // Fetch sellers
//   useEffect(() => {
//     const fetchSellers = async () => {
//       try {
//         const res = await axios.get(`${API_BASE}/admin/sellers`, {
//           headers: getAuthHeaders(),
//         });
        
//         const sorted = [...res.data.data].sort((a, b) => 
//           new Date(b.createdAt) - new Date(a.createdAt)
//         );
        
//         setSellers(sorted);
//         applyFilters(sorted, filter, searchTerm);
//       } catch (err) {
//         console.error("Error fetching sellers:", err);
//         setSellers([]);
//       }
//     };

//     fetchSellers();
//   }, [refreshKey]);

//   // Apply filters
//   const applyFilters = (data, statusFilter, search) => {
//     let filtered = data;
    
//     if (statusFilter !== "all") {
//       filtered = filtered.filter(s => s.status === statusFilter);
//     }
    
//     if (search) {
//       filtered = filtered.filter(s => 
//         s.fullName?.toLowerCase().includes(search.toLowerCase()) ||
//         (s.user?.email || s.email)?.toLowerCase().includes(search.toLowerCase()) ||
//         s.businessName?.toLowerCase().includes(search.toLowerCase()) ||
//         (s.user?.phone || s.phone)?.includes(search)
//       );
//     }
    
//     setFilteredSellers(filtered);
//   };

//   useEffect(() => {
//     if (sellers) {
//       applyFilters(sellers, filter, searchTerm);
//     }
//   }, [filter, searchTerm, sellers]);

//   // Handle action
//   const handleAction = (seller, action) => {
//     setShowDetailModal(false);
//     setSelectedSeller(seller);
//     setSelectedAction(action);
//   };

//   // Confirm action
//   const confirmAction = async (reason) => {
//     try {
//       const actionMap = {
//         approve: "Approved",
//         reject: "Rejected",
//         ban: "Banned",
//         unban: "Approved",
//         moveToPending: "Pending",
//         delete: "DELETE"
//       };

//       const status = actionMap[selectedAction];
      
//       if (selectedAction === "delete") {
//         await axios.delete(
//           `${API_BASE}/admin/sellers/${selectedSeller._id}`,
//           { 
//             headers: getAuthHeaders(),
//             data: { reason }
//           }
//         );
//       } else {
//         await axios.put(
//           `${API_BASE}/admin/sellers/${selectedSeller._id}/status`,
//           { status, reason },
//           { headers: getAuthHeaders() }
//         );
//       }
      
//       setSelectedSeller(null);
//       setSelectedAction(null);
//       setRefreshKey(prev => prev + 1);
      
//       alert(`Seller ${selectedAction}ed successfully! Email notification sent.`);
//     } catch (err) {
//       console.error("Error updating status:", err);
//       alert(err.response?.data?.message || "Failed to update seller status");
//     }
//   };

//   // Stats
//   const stats = sellers ? {
//     total: sellers.length,
//     pending: sellers.filter(s => s.status === "Pending").length,
//     approved: sellers.filter(s => s.status === "Approved").length,
//     rejected: sellers.filter(s => s.status === "Rejected").length,
//     banned: sellers.filter(s => s.status === "Banned").length,
//   } : null;

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white px-4 sm:px-8 py-10 flex justify-center">
//       <div className="w-full max-w-7xl bg-zinc-900/50 rounded-3xl px-6 sm:px-12 py-10 shadow-xl border border-zinc-700">
        
//         {/* Heading */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-md">
//             Seller Management
//           </h1>
//           <p className="text-zinc-400 mt-2 text-sm sm:text-base italic">
//             Manage seller applications and monitor seller activities
//           </p>
//           <hr className="mt-6 border-zinc-700 w-3/4 mx-auto rounded-full" />
//         </div>

//         {/* Stats & Filters */}
//         {stats && (
//           <div className="mb-8">
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
//               <button
//                 onClick={() => setFilter("all")}
//                 className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
//                   filter === "all" 
//                     ? "border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20" 
//                     : "border-zinc-700 hover:border-zinc-600"
//                 }`}
//               >
//                 <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">{stats.total}</div>
//                 <div className="text-sm text-zinc-400 mt-1">All Sellers</div>
//               </button>
              
//               <button
//                 onClick={() => setFilter("Pending")}
//                 className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
//                   filter === "Pending" 
//                     ? "border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/20" 
//                     : "border-zinc-700 hover:border-zinc-600"
//                 }`}
//               >
//                 <div className="text-3xl font-bold text-amber-400">{stats.pending}</div>
//                 <div className="text-sm text-zinc-400 mt-1">Pending</div>
//               </button>
              
//               <button
//                 onClick={() => setFilter("Approved")}
//                 className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
//                   filter === "Approved" 
//                     ? "border-emerald-400 bg-emerald-400/10 shadow-lg shadow-emerald-400/20" 
//                     : "border-zinc-700 hover:border-zinc-600"
//                 }`}
//               >
//                 <div className="text-3xl font-bold text-emerald-400">{stats.approved}</div>
//                 <div className="text-sm text-zinc-400 mt-1">Approved</div>
//               </button>
              
//               <button
//                 onClick={() => setFilter("Rejected")}
//                 className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
//                   filter === "Rejected" 
//                     ? "border-red-400 bg-red-400/10 shadow-lg shadow-red-400/20" 
//                     : "border-zinc-700 hover:border-zinc-600"
//                 }`}
//               >
//                 <div className="text-3xl font-bold text-red-400">{stats.rejected}</div>
//                 <div className="text-sm text-zinc-400 mt-1">Rejected</div>
//               </button>
              
//               <button
//                 onClick={() => setFilter("Banned")}
//                 className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
//                   filter === "Banned" 
//                     ? "border-slate-400 bg-slate-400/10 shadow-lg shadow-slate-400/20" 
//                     : "border-zinc-700 hover:border-zinc-600"
//                 }`}
//               >
//                 <div className="text-3xl font-bold text-slate-400">{stats.banned}</div>
//                 <div className="text-sm text-zinc-400 mt-1">Banned</div>
//               </button>
//             </div>

//             {/* Search Bar */}
//             <div className="flex gap-4">
//               <div className="flex-1 relative">
//                 <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
//                 <input
//                   type="text"
//                   placeholder="Search by name, email, business, or phone..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition-colors"
//                 />
//               </div>
              
//               <button
//                 onClick={() => setRefreshKey(prev => prev + 1)}
//                 className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-yellow-400 px-6 py-3 rounded-xl transition-all flex items-center gap-2 group"
//               >
//                 <FaSync className={`text-yellow-400 ${refreshKey % 2 ? "animate-spin" : ""} group-hover:rotate-180 transition-transform duration-500`} />
//                 <span className="hidden sm:inline">Refresh</span>
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Sellers Grid */}
//         {!filteredSellers ? (
//           <div className="flex items-center justify-center my-12">
//             <Loader />
//           </div>
//         ) : filteredSellers.length === 0 ? (
//           <div className="text-center py-20">
//             <FaStore className="text-6xl text-zinc-700 mx-auto mb-4" />
//             <p className="text-xl text-zinc-400">No sellers found</p>
//             <p className="text-sm text-zinc-500 mt-2">Try adjusting your filters</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {filteredSellers.map((seller) => (
//               <SellerCard
//                 key={seller._id}
//                 seller={seller}
//                 onView={(s) => {
//                   setSelectedSeller(s);
//                   setShowDetailModal(true);
//                 }}
//                 onAction={handleAction}
//               />
//             ))}
//           </div>
//         )}

//         {/* Detail Modal */}
//         {showDetailModal && selectedSeller && (
//           <DetailModal
//             seller={selectedSeller}
//             onClose={() => {
//               setShowDetailModal(false);
//               setSelectedSeller(null);
//             }}
//             onAction={handleAction}
//           />
//         )}

//         {/* Action Modal */}
//         {selectedSeller && selectedAction && (
//           <ActionModal
//             seller={selectedSeller}
//             action={selectedAction}
//             onClose={() => {
//               setSelectedSeller(null);
//               setSelectedAction(null);
//             }}
//             onConfirm={confirmAction}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllSellers;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FaStore, 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle, 
  FaBan,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUserTie,
  FaSearch,
  FaSync,
  FaEye,
  FaTimes,
  FaUniversity,
  FaIdCard,
  FaTrash
} from 'react-icons/fa';
import Loader from '../../Loader/Loader';
import Alert from '../../Alert/Alert';
import { useAlert } from '../../Alert/useAlert';
const BASE_URL = import.meta.env.VITE_API_URL;

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
const API_BASE = `${BASE_URL}/api/v1`;

// ==================== UTILITY FUNCTIONS ====================
const getAuthHeaders = () => ({
  id: localStorage.getItem("id"),
  authorization: `Bearer ${localStorage.getItem("token")}`,
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ==================== STATUS BADGE ====================
const StatusBadge = ({ status }) => {
  const statusConfig = {
    Approved: {
      bg: "bg-gradient-to-r from-emerald-500 to-green-500",
      text: "text-white",
      icon: <FaCheckCircle className="inline mr-1" />
    },
    Rejected: {
      bg: "bg-gradient-to-r from-red-500 to-rose-500",
      text: "text-white",
      icon: <FaTimesCircle className="inline mr-1" />
    },
    Pending: {
      bg: "bg-gradient-to-r from-amber-400 to-yellow-500",
      text: "text-white",
      icon: <FaClock className="inline mr-1" />
    },
    Banned: {
      bg: "bg-gradient-to-r from-slate-600 to-gray-700",
      text: "text-white",
      icon: <FaBan className="inline mr-1" />
    },
  };

  const config = statusConfig[status] || statusConfig.Pending;

  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${config.bg} ${config.text} shadow-md`}>
      {config.icon}
      {status}
    </span>
  );
};

// ==================== SELLER CARD ====================
const SellerCard = ({ seller, onView, onAction }) => {
  const user = seller.user || {};
  
  return (
    <div
      onClick={() => onView(seller)}
      className="bg-zinc-900/70 rounded-2xl border border-zinc-700 hover:border-yellow-400 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-yellow-400/20 overflow-hidden transform hover:scale-[1.02]"
    >
      {/* Card Header with Image */}
      <div className="relative h-32 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
        <img
          src={user.avatar || DEFAULT_AVATAR}
          onError={(e) => (e.target.src = DEFAULT_AVATAR)}
          alt={seller.fullName}
          className="w-20 h-20 rounded-full object-cover border-4 border-zinc-900 shadow-xl group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <StatusBadge status={seller.status} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        {/* Name & Business */}
        <div className="mb-4 text-center">
          <h3 className="text-xl font-bold text-white mb-1 truncate group-hover:text-yellow-400 transition-colors">
            {seller.fullName || "No Name"}
          </h3>
          {seller.businessName && (
            <p className="text-sm text-yellow-400 flex items-center justify-center gap-1 font-medium">
              <FaStore className="text-xs" />
              {seller.businessName}
            </p>
          )}
          <span className="inline-block mt-2 text-xs bg-zinc-800 px-3 py-1 rounded-full text-zinc-400 border border-zinc-700">
            {seller.sellerType}
          </span>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center gap-2 text-zinc-300 truncate bg-zinc-800/50 px-3 py-2 rounded-lg">
            <FaEnvelope className="text-yellow-400 flex-shrink-0" />
            <span className="truncate">{user.email || seller.email}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-300 bg-zinc-800/50 px-3 py-2 rounded-lg">
            <FaPhone className="text-yellow-400 flex-shrink-0" />
            <span>{user.phone || seller.phone || "N/A"}</span>
          </div>
          {seller.pickupAddress && (
            <div className="flex items-center gap-2 text-zinc-300 truncate bg-zinc-800/50 px-3 py-2 rounded-lg">
              <FaMapMarkerAlt className="text-yellow-400 flex-shrink-0" />
              <span className="truncate">{seller.pickupAddress.city}, {seller.pickupAddress.state}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-zinc-700">
          <p className="text-xs text-zinc-500 text-center mb-3">
            Joined: {formatDate(seller.createdAt)}
          </p>
          
          {/* Action Buttons */}
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            {seller.status === "Pending" && (
              <>
                <button
                  onClick={() => onAction(seller, "approve")}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <FaCheckCircle className="inline mr-1" />
                  Approve
                </button>
                <button
                  onClick={() => onAction(seller, "reject")}
                  className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <FaTimesCircle className="inline mr-1" />
                  Reject
                </button>
              </>
            )}
            
            {seller.status === "Approved" && (
              <button
                onClick={() => onAction(seller, "ban")}
                className="flex-1 bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <FaBan className="inline mr-1" />
                Ban
              </button>
            )}
            
            {seller.status === "Banned" && (
              <button
                onClick={() => onAction(seller, "unban")}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <FaCheckCircle className="inline mr-1" />
                Unban
              </button>
            )}
            
            {seller.status === "Rejected" && (
              <button
                onClick={() => onAction(seller, "moveToPending")}
                className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <FaClock className="inline mr-1" />
                Review
              </button>
            )}
            
            <button
              onClick={() => onView(seller)}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <FaEye className="inline" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== ACTION MODAL ====================
const ActionModal = ({ seller, action, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const actionConfig = {
    approve: {
      title: "Approve Seller Application",
      message: `Approve ${seller?.fullName}'s application?`,
      color: "emerald",
      requireReason: false,
      buttonText: "Approve Seller"
    },
    reject: {
      title: "Reject Seller Application",
      message: `Provide a reason for rejecting ${seller?.fullName}'s application:`,
      color: "red",
      requireReason: true,
      buttonText: "Reject Application"
    },
    ban: {
      title: "Ban Seller Account",
      message: `Provide a reason for banning ${seller?.fullName}:`,
      color: "slate",
      requireReason: true,
      buttonText: "Ban Seller"
    },
    delete: {
      title: "Delete Seller",
      message: `⚠️ Permanently delete ${seller?.fullName}? Provide a reason:`,
      color: "red",
      requireReason: true,
      buttonText: "Delete Permanently"
    },
    unban: {
      title: "Unban Seller",
      message: `Unban ${seller?.fullName}?`,
      color: "emerald",
      requireReason: false,
      buttonText: "Unban Seller"
    },
    moveToPending: {
      title: "Move to Pending Review",
      message: `Move ${seller?.fullName}'s application to pending?`,
      color: "amber",
      requireReason: false,
      buttonText: "Move to Pending"
    }
  };

  const config = actionConfig[action] || actionConfig.approve;

  const handleSubmit = async () => {
    if (config.requireReason && !reason.trim()) {
      return;
    }
    setLoading(true);
    await onConfirm(reason);
    setLoading(false);
  };

  if (!seller) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 rounded-2xl max-w-md w-full border border-zinc-700 shadow-2xl transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r from-${config.color}-500 to-${config.color}-600 p-6 rounded-t-2xl`}>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">{config.title}</h3>
            <button onClick={onClose} className="text-white/80 hover:text-white">
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-zinc-300 mb-4">{config.message}</p>

          {config.requireReason && (
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter your reason here..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition-colors min-h-[120px] resize-none"
              required
            />
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex-1 bg-gradient-to-r from-${config.color}-500 to-${config.color}-600 hover:from-${config.color}-600 hover:to-${config.color}-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg disabled:opacity-50`}
            >
              {loading ? "Processing..." : config.buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== DETAIL MODAL ====================
const DetailModal = ({ seller, onClose, onAction }) => {
  if (!seller) return null;
  
  const user = seller.user || {};

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 rounded-2xl max-w-4xl w-full border border-zinc-700 shadow-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar || DEFAULT_AVATAR}
                onError={(e) => (e.target.src = DEFAULT_AVATAR)}
                alt={seller.fullName}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-xl"
              />
              <div>
                <h2 className="text-2xl font-bold text-black mb-1">
                  {seller.fullName}
                </h2>
                {seller.businessName && (
                  <p className="text-black/80 font-medium flex items-center gap-2">
                    <FaStore />
                    {seller.businessName}
                  </p>
                )}
                <div className="mt-2">
                  <StatusBadge status={seller.status} />
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-black/80 hover:text-black p-2 hover:bg-black/10 rounded-lg transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaUserTie className="text-yellow-400" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <p className="text-zinc-400 text-xs mb-1">Email</p>
                <p className="text-white font-medium flex items-center gap-2">
                  <FaEnvelope className="text-yellow-400" />
                  {user.email || seller.email}
                </p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <p className="text-zinc-400 text-xs mb-1">Phone</p>
                <p className="text-white font-medium flex items-center gap-2">
                  <FaPhone className="text-yellow-400" />
                  {user.phone || seller.phone || "N/A"}
                </p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <p className="text-zinc-400 text-xs mb-1">Seller Type</p>
                <p className="text-white font-medium">{seller.sellerType}</p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <p className="text-zinc-400 text-xs mb-1">Joined Date</p>
                <p className="text-white font-medium">{formatDate(seller.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Business Information */}
          {seller.businessName && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaStore className="text-yellow-400" />
                Business Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                  <p className="text-zinc-400 text-xs mb-1">Business Name</p>
                  <p className="text-white font-medium">{seller.businessName}</p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                  <p className="text-zinc-400 text-xs mb-1">GST Number</p>
                  <p className="text-white font-medium flex items-center gap-2">
                    <FaIdCard className="text-yellow-400" />
                    {seller.gstNumber || "Not Provided"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bank Details */}
          {seller.bankHolderName && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaUniversity className="text-yellow-400" />
                Bank Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                  <p className="text-zinc-400 text-xs mb-1">Account Holder</p>
                  <p className="text-white font-medium">{seller.bankHolderName}</p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                  <p className="text-zinc-400 text-xs mb-1">Account Number</p>
                  <p className="text-white font-medium">••••{seller.bankAccountNumber?.slice(-4)}</p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                  <p className="text-zinc-400 text-xs mb-1">IFSC Code</p>
                  <p className="text-white font-medium">{seller.bankIFSC}</p>
                </div>
              </div>
            </div>
          )}

          {/* Address */}
          {seller.pickupAddress && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-yellow-400" />
                Pickup Address
              </h3>
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <p className="text-white leading-relaxed">
                  {seller.pickupAddress.street}
                  {seller.pickupAddress.village && `, ${seller.pickupAddress.village}`}
                  <br />
                  {seller.pickupAddress.city}, {seller.pickupAddress.state} - {seller.pickupAddress.pincode}
                  <br />
                  {seller.pickupAddress.country}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-zinc-700">
            {seller.status === "Pending" && (
              <>
                <button
                  onClick={() => onAction(seller, "approve")}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
                >
                  <FaCheckCircle className="inline mr-2" />
                  Approve
                </button>
                <button
                  onClick={() => onAction(seller, "reject")}
                  className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
                >
                  <FaTimesCircle className="inline mr-2" />
                  Reject
                </button>
              </>
            )}
            
            {seller.status === "Approved" && (
              <button
                onClick={() => onAction(seller, "ban")}
                className="flex-1 bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
              >
                <FaBan className="inline mr-2" />
                Ban Seller
              </button>
            )}
            
            {seller.status === "Banned" && (
              <button
                onClick={() => onAction(seller, "unban")}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
              >
                <FaCheckCircle className="inline mr-2" />
                Unban
              </button>
            )}
            
            {seller.status === "Rejected" && (
              <button
                onClick={() => onAction(seller, "moveToPending")}
                className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
              >
                <FaClock className="inline mr-2" />
                Move to Pending
              </button>
            )}
            
            <button
              onClick={() => onAction(seller, "delete")}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
            >
              <FaTrash className="inline mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const AllSellers = () => {
  const [sellers, setSellers] = useState(null);
  const [filteredSellers, setFilteredSellers] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { alert, hideAlert, success, error, warning } = useAlert();

  // Fetch sellers
  const fetchSellers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/sellers`, {
        headers: getAuthHeaders(),
      });
      
      const sorted = [...res.data.data].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setSellers(sorted);
      applyFilters(sorted, filter, searchTerm);
    } catch (err) {
      console.error("Error fetching sellers:", err);
      error("Failed to fetch sellers. Please try again.", "Error");
      setSellers([]);
    }
  };

  useEffect(() => {
    fetchSellers();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchSellers();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Apply filters
  const applyFilters = (data, statusFilter, search) => {
    let filtered = data;
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(s => s.status === statusFilter);
    }
    
    if (search) {
      filtered = filtered.filter(s => 
        s.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        (s.user?.email || s.email)?.toLowerCase().includes(search.toLowerCase()) ||
        s.businessName?.toLowerCase().includes(search.toLowerCase()) ||
        (s.user?.phone || s.phone)?.includes(search)
      );
    }
    
    setFilteredSellers(filtered);
  };

  useEffect(() => {
    if (sellers) {
      applyFilters(sellers, filter, searchTerm);
    }
  }, [filter, searchTerm, sellers]);

  // Handle action
  const handleAction = (seller, action) => {
    setShowDetailModal(false);
    setSelectedSeller(seller);
    setSelectedAction(action);
  };

  // Confirm action
  const confirmAction = async (reason) => {
    try {
      const actionMap = {
        approve: "Approved",
        reject: "Rejected",
        ban: "Banned",
        unban: "Approved",
        moveToPending: "Pending",
        delete: "DELETE"
      };

      const status = actionMap[selectedAction];
      
      if (selectedAction === "delete") {
        await axios.delete(
          `${API_BASE}/admin/sellers/${selectedSeller._id}`,
          { 
            headers: getAuthHeaders(),
            data: { reason }
          }
        );
        success(
          `${selectedSeller.fullName} has been permanently deleted. Email notification sent.`,
          "Seller Deleted"
        );
      } else {
        await axios.put(
          `${API_BASE}/admin/sellers/${selectedSeller._id}/status`,
          { status, reason },
          { headers: getAuthHeaders() }
        );
        
        const actionMessages = {
          approve: "approved",
          reject: "rejected",
          ban: "banned",
          unban: "unbanned",
          moveToPending: "moved to pending review"
        };
        
        success(
          `${selectedSeller.fullName} has been ${actionMessages[selectedAction]}. Email notification sent.`,
          "Action Completed"
        );
      }
      
      setSelectedSeller(null);
      setSelectedAction(null);
      
      // Refresh sellers list immediately
      await fetchSellers();
      
    } catch (err) {
      console.error("Error updating status:", err);
      error(
        err.response?.data?.message || "Failed to update seller status. Please try again.",
        "Action Failed"
      );
    }
  };

  // Stats
  const stats = sellers ? {
    total: sellers.length,
    pending: sellers.filter(s => s.status === "Pending").length,
    approved: sellers.filter(s => s.status === "Approved").length,
    rejected: sellers.filter(s => s.status === "Rejected").length,
    banned: sellers.filter(s => s.status === "Banned").length,
  } : null;

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white px-4 sm:px-8 py-10 flex justify-center">
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={hideAlert}
          autoClose={alert.autoClose}
          duration={alert.duration}
          position={alert.position}
        />
      )}
      
      <div className="w-full max-w-7xl bg-zinc-900/50 rounded-3xl px-6 sm:px-12 py-10 shadow-xl border border-zinc-700">
        
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-md">
            Seller Management
          </h1>
          <p className="text-zinc-400 mt-2 text-sm sm:text-base italic">
            Manage seller applications and monitor seller activities
          </p>
          <hr className="mt-6 border-zinc-700 w-3/4 mx-auto rounded-full" />
        </div>

        {/* Stats & Filters */}
        {stats && (
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              <button
                onClick={() => setFilter("all")}
                className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  filter === "all" 
                    ? "border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20" 
                    : "border-zinc-700 hover:border-zinc-600"
                }`}
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">{stats.total}</div>
                <div className="text-sm text-zinc-400 mt-1">All Sellers</div>
              </button>
              
              <button
                onClick={() => setFilter("Pending")}
                className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  filter === "Pending" 
                    ? "border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/20" 
                    : "border-zinc-700 hover:border-zinc-600"
                }`}
              >
                <div className="text-3xl font-bold text-amber-400">{stats.pending}</div>
                <div className="text-sm text-zinc-400 mt-1">Pending</div>
              </button>
              
              <button
                onClick={() => setFilter("Approved")}
                className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  filter === "Approved" 
                    ? "border-emerald-400 bg-emerald-400/10 shadow-lg shadow-emerald-400/20" 
                    : "border-zinc-700 hover:border-zinc-600"
                }`}
              >
                <div className="text-3xl font-bold text-emerald-400">{stats.approved}</div>
                <div className="text-sm text-zinc-400 mt-1">Approved</div>
              </button>
              
              <button
                onClick={() => setFilter("Rejected")}
                className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  filter === "Rejected" 
                    ? "border-red-400 bg-red-400/10 shadow-lg shadow-red-400/20" 
                    : "border-zinc-700 hover:border-zinc-600"
                }`}
              >
                <div className="text-3xl font-bold text-red-400">{stats.rejected}</div>
                <div className="text-sm text-zinc-400 mt-1">Rejected</div>
              </button>
              
              <button
                onClick={() => setFilter("Banned")}
                className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  filter === "Banned" 
                    ? "border-slate-400 bg-slate-400/10 shadow-lg shadow-slate-400/20" 
                    : "border-zinc-700 hover:border-zinc-600"
                }`}
              >
                <div className="text-3xl font-bold text-slate-400">{stats.banned}</div>
                <div className="text-sm text-zinc-400 mt-1">Banned</div>
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search by name, email, business, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400 transition-colors"
                />
              </div>
              
              <button
                onClick={fetchSellers}
                className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-yellow-400 px-6 py-3 rounded-xl transition-all flex items-center gap-2 group"
              >
                <FaSync className="text-yellow-400 group-hover:rotate-180 transition-transform duration-500" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        )}

        {/* Sellers Grid */}
        {!filteredSellers ? (
          <div className="flex items-center justify-center my-12">
            <Loader />
          </div>
        ) : filteredSellers.length === 0 ? (
          <div className="text-center py-20">
            <FaStore className="text-6xl text-zinc-700 mx-auto mb-4" />
            <p className="text-xl text-zinc-400">No sellers found</p>
            <p className="text-sm text-zinc-500 mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSellers.map((seller) => (
              <SellerCard
                key={seller._id}
                seller={seller}
                onView={(s) => {
                  setSelectedSeller(s);
                  setShowDetailModal(true);
                }}
                onAction={handleAction}
              />
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedSeller && (
          <DetailModal
            seller={selectedSeller}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedSeller(null);
            }}
            onAction={handleAction}
          />
        )}

        {/* Action Modal */}
        {selectedSeller && selectedAction && (
          <ActionModal
            seller={selectedSeller}
            action={selectedAction}
            onClose={() => {
              setSelectedSeller(null);
              setSelectedAction(null);
            }}
            onConfirm={confirmAction}
          />
        )}
      </div>
    </div>
  );
};

export default AllSellers;