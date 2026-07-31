import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStore } from 'react-icons/fa';
import { 
  FiCheckCircle, 
  FiClock, 
  FiXCircle, 
  FiSlash,
  FiMail,
  FiPhone,
  FiMapPin,
  FiUser,
  FiSearch,
  FiRotateCw,
  FiEye,
  FiX,
  FiCreditCard,
  FiShield,
  FiTrash2,
  FiActivity,
  FiChevronRight
} from 'react-icons/fi';
import Loader from '../../Loader/Loader';
import Alert from '../../Alert/Alert';
import { useAlert } from '../../Alert/useAlert';

const BASE_URL = import.meta.env.VITE_API_URL;
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
const API_BASE = `${BASE_URL}/api/v1`;

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
    .glass-banking-card {
      background: linear-gradient(135deg, rgba(39, 39, 42, 0.94) 0%, rgba(9, 9, 11, 0.98) 100%);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06);
    }
    .border-zinc-850 {
      border-color: rgba(39, 39, 42, 0.55);
    }
  `}} />
);

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
      bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      dot: "bg-emerald-400",
      icon: <FiCheckCircle className="text-[9px]" />
    },
    Rejected: {
      bg: "bg-rose-500/10 border-rose-500/20 text-rose-400",
      dot: "bg-rose-400",
      icon: <FiXCircle className="text-[9px]" />
    },
    Pending: {
      bg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
      dot: "bg-amber-400 pulse-dot-active",
      icon: <FiClock className="text-[9px]" />
    },
    Banned: {
      bg: "bg-zinc-800 border-zinc-700 text-zinc-400",
      dot: "bg-zinc-500",
      icon: <FiSlash className="text-[9px]" />
    },
  };

  const config = statusConfig[status] || statusConfig.Pending;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${config.bg} backdrop-blur-md`}>
      <span className={`w-1 h-1 rounded-full ${config.dot}`}></span>
      {config.icon}
      {status}
    </span>
  );
};

// ==================== SELLER CARD (ULTRA-COMPACT) ====================
const SellerCard = ({ seller, onView, onAction }) => {
  const user = seller.user || {};
  
  return (
    <div
      onClick={() => onView(seller)}
      className="animate-card-entrance group relative flex flex-col justify-between bg-zinc-900/15 backdrop-blur-md rounded-xl border border-zinc-850 hover:border-yellow-400/30 p-3.5 transition-all duration-300 cursor-pointer shadow-md hover:shadow-[0_6px_18px_rgba(250,204,21,0.03)] overflow-hidden transform hover:-translate-y-0.5"
    >
      {/* Golden Highlight Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[1.2px] bg-gradient-to-r from-yellow-500/0 via-yellow-400/30 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="space-y-3">
        {/* Top Header Row: Avatar, Name, Business and Status */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={user.avatar || DEFAULT_AVATAR}
                onError={(e) => (e.target.src = DEFAULT_AVATAR)}
                alt={seller.fullName}
                className="w-9 h-9 rounded-full object-cover border border-zinc-800 bg-zinc-900 shadow-md"
              />
              <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-zinc-950 ${
                seller.status === "Approved" ? "bg-emerald-500" :
                seller.status === "Rejected" ? "bg-rose-500" :
                seller.status === "Pending" ? "bg-amber-500 animate-pulse" :
                "bg-zinc-650"
              }`}></span>
            </div>
            
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-extrabold text-zinc-100 truncate group-hover:text-yellow-400 transition-colors duration-300">
                {seller.fullName || "No Name"}
              </h3>
              {seller.businessName ? (
                <p className="text-[10px] text-yellow-400/90 flex items-center gap-1 font-semibold truncate max-w-[120px]">
                  <FaStore className="text-[8px] shrink-0" />
                  {seller.businessName}
                </p>
              ) : (
                <p className="text-[9px] text-zinc-550 italic">No business</p>
              )}
            </div>
          </div>

          <div className="scale-75 origin-top-right shrink-0">
            <StatusBadge status={seller.status} />
          </div>
        </div>

        {/* Middle Row: Compact Micro Info Chips */}
        <div className="grid grid-cols-1 gap-1 text-[10px]">
          <div className="flex items-center gap-2 text-zinc-400 bg-zinc-950/20 px-2 py-1 rounded border border-zinc-900/60 min-w-0">
            <FiMail size={10} className="text-yellow-400/80 shrink-0" />
            <span className="truncate">{user.email || seller.email}</span>
          </div>
          
          <div className="flex items-center gap-2 text-zinc-400 bg-zinc-950/20 px-2 py-1 rounded border border-zinc-900/60">
            <FiPhone size={10} className="text-yellow-400/80 shrink-0" />
            <span className="font-mono">{user.phone || seller.phone || "N/A"}</span>
          </div>

          {seller.pickupAddress && (
            <div className="flex items-center gap-2 text-zinc-400 bg-zinc-950/20 px-2 py-1 rounded border border-zinc-900/60 min-w-0">
              <FiMapPin size={10} className="text-yellow-400/80 shrink-0" />
              <span className="truncate">{seller.pickupAddress.city}, {seller.pickupAddress.state}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Action Actions Tray */}
      <div className="mt-3 pt-2.5 border-t border-zinc-900/80 flex items-center justify-between gap-2">
        <span className="text-[8px] text-zinc-550 font-bold uppercase tracking-wider">
          Joined: {formatDate(seller.createdAt)}
        </span>
        
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          {seller.status === "Pending" && (
            <>
              <button
                onClick={() => onAction(seller, "approve")}
                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-zinc-950 font-extrabold px-2 py-1 rounded text-[9px] transition-all duration-300 flex items-center gap-0.5"
              >
                Approve
              </button>
              <button
                onClick={() => onAction(seller, "reject")}
                className="bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-bold px-2 py-1 rounded text-[9px] transition-all duration-300 flex items-center gap-0.5"
              >
                Reject
              </button>
            </>
          )}
          
          {seller.status === "Approved" && (
            <button
              onClick={() => onAction(seller, "ban")}
              className="bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white border border-zinc-805 font-bold px-2 py-1 rounded text-[9px] transition-all duration-300"
            >
              Suspend
            </button>
          )}
          
          {seller.status === "Banned" && (
            <button
              onClick={() => onAction(seller, "unban")}
              className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-zinc-950 font-extrabold px-2 py-1 rounded text-[9px] transition-all duration-300"
            >
              Authorize
            </button>
          )}
          
          {seller.status === "Rejected" && (
            <button
              onClick={() => onAction(seller, "moveToPending")}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-bold px-2 py-1 rounded text-[9px] transition-all duration-300"
            >
              Re-Review
            </button>
          )}
          
          <button
            onClick={() => onView(seller)}
            className="bg-zinc-900 hover:bg-yellow-400 border border-zinc-800 text-zinc-400 hover:text-zinc-950 p-1.5 rounded transition-all duration-300 flex items-center justify-center shrink-0"
            title="Open Folder"
          >
            <FiEye size={10} />
          </button>
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
      message: `Authorize ${seller?.fullName} to sell on BookBalcony? They will be notified via email.`,
      themeColor: "emerald",
      accentBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      buttonStyle: "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-zinc-950 shadow-emerald-500/20",
      requireReason: false,
      buttonText: "Approve Merchant"
    },
    reject: {
      title: "Reject Seller Application",
      message: `Specify the validation mismatch or reason for rejecting ${seller?.fullName}'s application. Included in email notice.`,
      themeColor: "rose",
      accentBg: "bg-rose-500/10 border-rose-500/20 text-rose-400",
      buttonStyle: "bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white shadow-rose-500/20",
      requireReason: true,
      buttonText: "Decline Credentials"
    },
    ban: {
      title: "Suspend Merchant Access",
      message: `Provide explanation detailing terms violation or reason for suspending ${seller?.fullName}'s business account.`,
      themeColor: "zinc",
      accentBg: "bg-zinc-800 border-zinc-700 text-zinc-300",
      buttonStyle: "bg-zinc-200 hover:bg-white text-zinc-950 shadow-zinc-500/10",
      requireReason: true,
      buttonText: "Enforce Suspension"
    },
    delete: {
      title: "Permanent Registry Deletion",
      message: `⚠️ WARNING: Remove seller profile of ${seller?.fullName} from central registry. State deletion citation:`,
      themeColor: "red",
      accentBg: "bg-red-500/10 border-red-500/20 text-red-400",
      buttonStyle: "bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-red-500/25",
      requireReason: true,
      buttonText: "Delete Permanently"
    },
    unban: {
      title: "Restore Suspended Access",
      message: `Reinstate merchant authorization for ${seller?.fullName}? This re-enables their product display.`,
      themeColor: "emerald",
      accentBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      buttonStyle: "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-zinc-950 shadow-emerald-500/20",
      requireReason: false,
      buttonText: "Re-Authorize Merchant"
    },
    moveToPending: {
      title: "Revert to Evaluation Stage",
      message: `Move ${seller?.fullName}'s portfolio back to the pending queue for re-evaluation?`,
      themeColor: "amber",
      accentBg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
      buttonStyle: "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 shadow-amber-500/25",
      requireReason: false,
      buttonText: "Queue for Review"
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
      className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="animate-modal-entrance bg-zinc-950 rounded-2xl max-w-sm w-full border border-zinc-800 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-[2px] bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500"></div>

        {/* Action Header */}
        <div className="p-3.5 border-b border-zinc-900 bg-zinc-900/20 flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-zinc-100 flex items-center gap-2">
            <FiActivity className="text-yellow-400 shrink-0" size={13} />
            {config.title}
          </h3>
          <button 
            onClick={onClose} 
            className="text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 p-1 rounded-lg transition-colors"
          >
            <FiX className="text-sm" />
          </button>
        </div>

        {/* Action Body */}
        <div className="p-4.5 space-y-3.5">
          <div className={`p-2.5 rounded-xl text-[10px] leading-relaxed border ${config.accentBg}`}>
            {config.message}
          </div>

          {config.requireReason && (
            <div className="space-y-1.5">
              <label className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">Administrative Citation</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Detail official review decision details..."
                className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-2.5 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-yellow-400/30 transition-colors duration-300 min-h-[80px] resize-none"
                required
              />
            </div>
          )}

          {/* Action Footer Controls */}
          <div className="flex gap-2 pt-0.5">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 px-3 py-2 rounded-xl font-bold text-[10px] transition-all duration-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || (config.requireReason && !reason.trim())}
              className={`flex-1 ${config.buttonStyle} px-3 py-2 rounded-xl font-bold text-[10px] transition-all duration-300 shadow-lg disabled:opacity-30 disabled:scale-100 transform active:scale-95`}
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
  const navigate = useNavigate();
  if (!seller) return null;
  
  const user = seller.user || {};

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="animate-modal-entrance bg-zinc-950 rounded-2xl max-w-2xl w-full border border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover Header Banner */}
        <div className="relative bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 p-4 border-b border-zinc-900 flex justify-between items-start gap-4">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.02),transparent)] pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 relative z-10 text-center sm:text-left">
            <div className="relative">
              <img
                src={user.avatar || DEFAULT_AVATAR}
                onError={(e) => (e.target.src = DEFAULT_AVATAR)}
                alt={seller.fullName}
                className="w-14 h-14 rounded-full object-cover border-2 border-zinc-805 shadow-lg bg-zinc-900"
              />
              <div className="absolute -bottom-0.5 -right-0.5 bg-zinc-955 p-0.5 rounded-full border border-zinc-850">
                <span className={`w-2 h-2 rounded-full block ${
                  seller.status === "Approved" ? "bg-emerald-500" :
                  seller.status === "Rejected" ? "bg-rose-500" :
                  seller.status === "Pending" ? "bg-amber-500 animate-pulse" :
                  "bg-zinc-650"
                }`}></span>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-black text-zinc-100 flex items-center flex-wrap justify-center sm:justify-start gap-1.5">
                {seller.fullName}
                <span className="text-[8px] bg-yellow-500/10 border border-yellow-500/25 px-2 py-0.5 rounded-full text-yellow-400 font-extrabold uppercase tracking-wider">
                  {seller.sellerType}
                </span>
              </h2>
              {seller.businessName && (
                <p className="text-zinc-450 font-bold text-[11px] flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                  <FaStore className="text-yellow-400 text-[9px] shrink-0" />
                  {seller.businessName}
                </p>
              )}
              <div className="mt-1.5 flex justify-center sm:justify-start">
                <StatusBadge status={seller.status} />
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 p-1.5 rounded-xl transition-all duration-300 relative z-10 shrink-0 border border-transparent hover:border-zinc-800"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Modal Info Sections Scroll Container */}
        <div className="p-4 sm:p-5 space-y-5 max-h-[50vh] overflow-y-auto premium-scrollbar bg-zinc-950/20">
          
          {/* Section: Identity & Personal Details */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <FiUser className="text-yellow-400/80" size={11} /> Personal Dossier
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="bg-zinc-900/30 border border-zinc-850 rounded-lg p-2.5 flex items-center gap-2.5 hover:border-zinc-800 transition-all duration-300">
                <div className="p-1.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 shrink-0">
                  <FiMail size={12} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[8px] text-zinc-550 font-bold uppercase tracking-wider">Email Address</p>
                  <p className="text-xs font-semibold text-zinc-200 truncate">{user.email || seller.email}</p>
                </div>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-850 rounded-lg p-2.5 flex items-center gap-2.5 hover:border-zinc-800 transition-all duration-300">
                <div className="p-1.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 shrink-0">
                  <FiPhone size={12} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[8px] text-zinc-550 font-bold uppercase tracking-wider">Mobile Number</p>
                  <p className="text-xs font-mono font-semibold text-zinc-200">{user.phone || seller.phone || "N/A"}</p>
                </div>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-850 rounded-lg p-2.5 flex items-center gap-2.5 hover:border-zinc-800 transition-all duration-300">
                <div className="p-1.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 shrink-0">
                  <FiClock size={12} />
                </div>
                <div>
                  <p className="text-[8px] text-zinc-550 font-bold uppercase tracking-wider">Registry Date</p>
                  <p className="text-xs font-semibold text-zinc-200">{formatDate(seller.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Business Info */}
          {seller.businessName && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <FaStore className="text-yellow-400/80 text-[9px]" /> Business Registration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="bg-zinc-900/30 border border-zinc-850 rounded-lg p-2.5 flex items-center gap-2.5 hover:border-zinc-800 transition-all duration-300">
                  <div className="p-1.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 shrink-0">
                    <FaStore size={12} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[8px] text-zinc-550 font-bold uppercase tracking-wider">Corporate Name</p>
                    <p className="text-xs font-semibold text-zinc-200 truncate">{seller.businessName}</p>
                  </div>
                </div>

                <div className="bg-zinc-900/30 border border-zinc-850 rounded-lg p-2.5 flex items-center gap-2.5 hover:border-zinc-800 transition-all duration-300">
                  <div className="p-1.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 shrink-0">
                    <FiShield size={12} />
                  </div>
                  <div>
                    <p className="text-[8px] text-zinc-550 font-bold uppercase tracking-wider">GST IN / Tax ID</p>
                    <p className="text-xs font-mono font-semibold text-zinc-200 tracking-wide">{seller.gstNumber || "Not Provided"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Dynamic Bank Settlement Account Graphic Card */}
          {seller.bankHolderName && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <FiCreditCard className="text-yellow-400/80" size={11} /> Settlement Account Info
              </h3>
              
              <div className="relative glass-banking-card w-full max-w-xs rounded-xl p-3.5 border border-zinc-850 overflow-hidden text-white flex flex-col justify-between h-32 premium-gold-glow transition-all duration-300">
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="flex justify-between items-start z-10">
                  <div>
                    <p className="text-[6px] font-bold text-zinc-550 uppercase tracking-widest">Merchant Settlement</p>
                    <h5 className="text-[9px] font-bold text-yellow-400/85 tracking-wide mt-0.5">BookBalcony Vault</h5>
                  </div>
                  <div className="w-8 h-5.5 bg-zinc-900/80 rounded border border-zinc-800/80 flex items-center justify-center font-mono font-bold text-[7px] text-zinc-400 tracking-wider">
                    IFSC
                  </div>
                </div>
                
                <div className="flex items-center gap-2 my-0.5 z-10">
                  <div className="w-6.5 h-4 rounded bg-gradient-to-r from-yellow-600 via-yellow-400 to-amber-500 border border-yellow-300/20 shadow-inner relative">
                    <div className="absolute inset-0.5 border border-yellow-900/10 rounded-sm grid grid-cols-3 gap-0.5">
                      <span className="border-r border-b border-yellow-950/20"></span>
                      <span className="border-r border-b border-yellow-950/20"></span>
                      <span className="border-b border-yellow-950/20"></span>
                      <span className="border-r border-yellow-950/20"></span>
                      <span className="border-r border-yellow-950/20"></span>
                      <span></span>
                    </div>
                  </div>
                  
                  <svg className="w-3 h-3 text-zinc-650" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                </div>
                
                <div className="z-10">
                  <p className="text-xs sm:text-sm font-mono tracking-widest text-zinc-100">
                    ••••  ••••  ••••  {seller.bankAccountNumber?.slice(-4) || "0000"}
                  </p>
                </div>
                
                <div className="flex justify-between items-end z-10">
                  <div>
                    <p className="text-[5px] text-zinc-550 uppercase tracking-widest">Cardholder</p>
                    <p className="text-[9px] font-semibold text-zinc-350 tracking-wide truncate max-w-[140px]">{seller.bankHolderName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[5px] text-zinc-550 uppercase tracking-widest font-mono">IFSC Code</p>
                    <p className="text-[9px] font-mono font-semibold text-zinc-350 tracking-wide">{seller.bankIFSC}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Logistics Dispatch Center */}
          {seller.pickupAddress && (
            <div className="space-y-2">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <FiMapPin className="text-yellow-400/80" size={11} /> Logistics Hub
              </h3>
              <div className="bg-zinc-900/30 border border-zinc-850 rounded-lg p-3 hover:border-zinc-800 transition-all duration-300 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 shrink-0">
                  <FiMapPin size={14} />
                </div>
                <div>
                  <p className="text-[8px] text-zinc-550 font-bold uppercase tracking-wider mb-0.5">Official Pickup / Dispatch Address</p>
                  <p className="text-xs font-semibold text-zinc-200 leading-relaxed">
                    {seller.pickupAddress.street}
                    {seller.pickupAddress.village && `, ${seller.pickupAddress.village}`}
                  </p>
                  <p className="text-xs font-medium text-zinc-450 mt-0.5">
                    {seller.pickupAddress.city}, {seller.pickupAddress.state} - <span className="text-yellow-400/90 font-mono font-semibold">{seller.pickupAddress.pincode}</span>
                  </p>
                  <p className="text-[8px] text-zinc-550 mt-0.5 font-bold tracking-wider uppercase">{seller.pickupAddress.country}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Controls Panel */}
        <div className="p-3 border-t border-zinc-900 bg-zinc-900/10 flex flex-wrap gap-2 justify-end items-center">
          {seller.status === "Approved" && (
            <>
              <button
                onClick={() => {
                  const sellerUserId = seller.user?._id || seller.user;
                  navigate(`/Admin/Seller-Orders?sellerId=${sellerUserId}&sellerName=${encodeURIComponent(seller.fullName)}`);
                }}
                className="flex-1 sm:flex-none bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-zinc-950 px-3 py-2 rounded-lg font-bold text-[10px] transition-all duration-300 shadow-md flex items-center justify-center gap-1 transform hover:scale-[1.02]"
              >
                Orders
                <FiChevronRight size={11} />
              </button>
              <button
                onClick={() => {
                  navigate(`/Admin/Seller-Products?sellerId=${seller._id}&sellerName=${encodeURIComponent(seller.fullName)}`);
                }}
                className="flex-1 sm:flex-none bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 px-3 py-2 rounded-lg font-bold text-[10px] transition-all duration-300 flex items-center justify-center gap-1 transform hover:scale-[1.02]"
              >
                Products
                <FiChevronRight size={11} />
              </button>
            </>
          )}

          {seller.status === "Pending" && (
            <>
              <button
                onClick={() => onAction(seller, "approve")}
                className="flex-grow sm:flex-grow-0 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-zinc-950 font-bold px-3.5 py-1.5 rounded-lg text-[10px] transition-all duration-300 shadow-lg"
              >
                Approve
              </button>
              <button
                onClick={() => onAction(seller, "reject")}
                className="flex-grow sm:flex-grow-0 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-bold px-3.5 py-1.5 rounded-lg text-[10px] transition-all duration-300 shadow-lg"
              >
                Decline
              </button>
            </>
          )}
          
          {seller.status === "Approved" && (
            <button
              onClick={() => onAction(seller, "ban")}
              className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-rose-400/90 hover:text-rose-400 px-3.5 py-1.5 rounded-lg font-bold text-[10px] transition-all duration-300"
            >
              Suspend
            </button>
          )}
          
          {seller.status === "Banned" && (
            <button
              onClick={() => onAction(seller, "unban")}
              className="flex-grow sm:flex-grow-0 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-zinc-950 font-bold px-3.5 py-1.5 rounded-lg text-[10px] transition-all duration-300"
            >
              Authorize
            </button>
          )}
          
          {seller.status === "Rejected" && (
            <button
              onClick={() => onAction(seller, "moveToPending")}
              className="flex-grow sm:flex-grow-0 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-bold px-3.5 py-1.5 rounded-lg text-[10px] transition-all duration-300"
            >
              Re-Review
            </button>
          )}
          
          <button
            onClick={() => onAction(seller, "delete")}
            className="bg-rose-555/10 hover:bg-rose-600 border border-rose-500/20 hover:border-rose-500 text-rose-400 hover:text-white p-2 rounded-lg transition-all duration-300 shadow-md flex items-center justify-center shrink-0"
            title="Purge Profile"
          >
            <FiTrash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN ADMIN SELLERS CONTAINER ====================
const AllSellers = () => {
  const [sellers, setSellers] = useState(null);
  const [filteredSellers, setFilteredSellers] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { alert, hideAlert, success, error } = useAlert();

  // Fetch sellers database
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
      error("Failed to refresh merchant database registry. Please try again.", "Database Sync Fail");
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

  // Apply search filtering
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

  // Handle Action Trigger
  const handleAction = (seller, action) => {
    setShowDetailModal(false);
    setSelectedSeller(seller);
    setSelectedAction(action);
  };

  // Confirm Status Action Update
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
          `${selectedSeller.fullName} permanently removed. Email notification dispatched.`,
          "Merchant Purged"
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
          ban: "suspended",
          unban: "re-authorized",
          moveToPending: "queued for evaluation"
        };
        
        success(
          `${selectedSeller.fullName} successfully ${actionMessages[selectedAction]}. Notification email dispatched.`,
          "Registry Updated"
        );
      }
      
      setSelectedSeller(null);
      setSelectedAction(null);
      
      // Refresh database
      await fetchSellers();
      
    } catch (err) {
      console.error("Error updating status:", err);
      error(
        err.response?.data?.message || "Merchant database authorization update failed. Verify network connectivity.",
        "Operation Failed"
      );
    }
  };

  // Compute Statistics
  const stats = sellers ? {
    total: sellers.length,
    pending: sellers.filter(s => s.status === "Pending").length,
    approved: sellers.filter(s => s.status === "Approved").length,
    rejected: sellers.filter(s => s.status === "Rejected").length,
    banned: sellers.filter(s => s.status === "Banned").length,
  } : null;

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
          onClose={hideAlert}
          autoClose={alert.autoClose}
          duration={alert.duration}
          position={alert.position}
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
                Registry Control Room
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent mb-1.5">
                Seller Management
              </h1>
              <p className="text-zinc-400 text-xs flex items-center sm:justify-center gap-2 font-medium">
                <span className="w-2 h-2 bg-yellow-400 rounded-full pulse-dot-active" />
                Review credentials, monitor bank accounts, and manage merchant registry permissions.
              </p>
            </div>
            <button
              onClick={fetchSellers}
              className="px-3.5 py-1.5 bg-zinc-900/60 hover:bg-zinc-900 text-white rounded-lg transition-all flex items-center gap-2 border border-zinc-850 hover:border-yellow-400/30 text-xs font-semibold shadow-md active:scale-[0.98] group"
            >
              <FiRotateCw className="w-3.5 h-3.5 text-yellow-400 group-hover:rotate-180 transition-transform duration-700" />
              <span>Sync Database</span>
            </button>
          </div>
          <div className="h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent w-full" />
        </div>

        {/* Statistics Widgets & Interactive Filter Deck */}
        {stats && (
          <div className="mb-4 space-y-3 relative z-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              
              <button
                onClick={() => setFilter("all")}
                className={`relative overflow-hidden p-3 rounded-xl border transition-all duration-300 text-left flex flex-col justify-between group ${
                  filter === "all" 
                    ? "border-yellow-500/50 bg-zinc-900/60 shadow-[0_0_15px_rgba(250,204,21,0.08)]" 
                    : "border-zinc-850 bg-zinc-900/10 hover:border-zinc-800 hover:bg-zinc-900/20"
                }`}
              >
                <div className="absolute top-0 right-0 w-10 h-10 bg-yellow-500/5 rounded-bl-full group-hover:bg-yellow-500/10 transition-colors duration-300"></div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                    <FaStore size={13} />
                  </div>
                  <span className={`w-1 h-1 rounded-full bg-yellow-400 ${filter === "all" ? "animate-pulse" : ""}`}></span>
                </div>
                <div>
                  <div className="text-xl font-black text-white tracking-tight">{stats.total}</div>
                  <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Total Sellers</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-yellow-400 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></div>
              </button>
              
              <button
                onClick={() => setFilter("Pending")}
                className={`relative overflow-hidden p-3 rounded-xl border transition-all duration-300 text-left flex flex-col justify-between group ${
                  filter === "Pending" 
                    ? "border-amber-500/50 bg-zinc-900/60 shadow-[0_0_15px_rgba(245,158,11,0.12)]" 
                    : "border-zinc-850 bg-zinc-900/10 hover:border-zinc-800 hover:bg-zinc-900/20"
                }`}
              >
                <div className="absolute top-0 right-0 w-10 h-10 bg-amber-500/5 rounded-bl-full group-hover:bg-amber-500/10 transition-colors duration-300"></div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <FiClock size={13} />
                  </div>
                  <span className={`w-1 h-1 rounded-full bg-amber-450 ${filter === "Pending" ? "animate-pulse" : ""}`}></span>
                </div>
                <div>
                  <div className="text-xl font-black text-white tracking-tight">{stats.pending}</div>
                  <div className="text-[8px] font-bold text-zinc-555 uppercase tracking-widest mt-0.5">Pending</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-amber-400 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></div>
              </button>
              
              <button
                onClick={() => setFilter("Approved")}
                className={`relative overflow-hidden p-3 rounded-xl border transition-all duration-300 text-left flex flex-col justify-between group ${
                  filter === "Approved" 
                    ? "border-emerald-500/50 bg-zinc-900/60 shadow-[0_0_15px_rgba(16,185,129,0.12)]" 
                    : "border-zinc-850 bg-zinc-900/10 hover:border-zinc-800 hover:bg-zinc-900/20"
                }`}
              >
                <div className="absolute top-0 right-0 w-10 h-10 bg-emerald-500/5 rounded-bl-full group-hover:bg-emerald-500/10 transition-colors duration-300"></div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <FiCheckCircle size={13} />
                  </div>
                  <span className={`w-1 h-1 rounded-full bg-emerald-400 ${filter === "Approved" ? "animate-pulse" : ""}`}></span>
                </div>
                <div>
                  <div className="text-xl font-black text-white tracking-tight">{stats.approved}</div>
                  <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Authorized</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-emerald-400 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></div>
              </button>
              
              <button
                onClick={() => setFilter("Rejected")}
                className={`relative overflow-hidden p-3 rounded-xl border transition-all duration-300 text-left flex flex-col justify-between group ${
                  filter === "Rejected" 
                    ? "border-rose-500/50 bg-zinc-900/60 shadow-[0_0_15px_rgba(239,68,68,0.12)]" 
                    : "border-zinc-850 bg-zinc-900/10 hover:border-zinc-800 hover:bg-zinc-900/20"
                }`}
              >
                <div className="absolute top-0 right-0 w-10 h-10 bg-rose-500/5 rounded-bl-full group-hover:bg-rose-500/10 transition-colors duration-300"></div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                    <FiXCircle size={13} />
                  </div>
                  <span className={`w-1 h-1 rounded-full bg-rose-400 ${filter === "Rejected" ? "animate-pulse" : ""}`}></span>
                </div>
                <div>
                  <div className="text-xl font-black text-white tracking-tight">{stats.rejected}</div>
                  <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Declined</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-rose-400 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></div>
              </button>
              
              <button
                onClick={() => setFilter("Banned")}
                className={`relative overflow-hidden p-3 rounded-xl border transition-all duration-300 text-left flex flex-col justify-between group ${
                  filter === "Banned" 
                    ? "border-zinc-500/50 bg-zinc-900/60 shadow-[0_0_15px_rgba(113,113,122,0.12)]" 
                    : "border-zinc-850 bg-zinc-900/10 hover:border-zinc-800 hover:bg-zinc-900/20"
                }`}
              >
                <div className="absolute top-0 right-0 w-10 h-10 bg-zinc-500/5 rounded-bl-full group-hover:bg-zinc-500/10 transition-colors duration-300"></div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400">
                    <FiSlash size={13} />
                  </div>
                  <span className={`w-1 h-1 rounded-full bg-zinc-500 ${filter === "Banned" ? "animate-pulse" : ""}`}></span>
                </div>
                <div>
                  <div className="text-xl font-black text-white tracking-tight">{stats.banned}</div>
                  <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Suspended</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-zinc-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></div>
              </button>
            </div>

            {/* Smart Search Controller Panel */}
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={13} />
              <input
                type="text"
                placeholder="Search registry files by corporate name, legal email, phone number, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-950/40 border border-zinc-850 hover:border-zinc-800 focus:border-yellow-400/40 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-zinc-650 focus:outline-none transition-all duration-300 shadow-inner"
              />
            </div>
          </div>
        )}

        {/* Central Sellers Grid - Ultra Compact */}
        <div className="relative z-10">
          {!filteredSellers ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <Loader />
            </div>
          ) : filteredSellers.length === 0 ? (
            <div className="text-center py-16 bg-zinc-950/10 border border-zinc-900/60 rounded-xl">
              <FaStore className="text-3xl text-zinc-700 mx-auto mb-2" />
              <p className="text-xs font-bold text-zinc-450">No Merchant Profile Found</p>
              <p className="text-[10px] text-zinc-600 mt-0.5 max-w-xs mx-auto">Verify search spelling or adjust evaluation stage filter tabs above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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
        </div>

        {/* Detail Modal Layer */}
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

        {/* Action Modal Layer */}
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