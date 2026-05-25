import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookDetailPath } from '../../utils/bookSlug';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  MapPin,
  CreditCard,
  Calendar,
  Phone,
  Copy,
  Star,
  AlertTriangle,
  RefreshCw,
  X,
  Home,
  Clock,
  Mail,
  User,
  IndianRupee,
  FileText,
  MessageCircle,
  ShoppingBag,
  Download,
  MessageSquare,
  Eye,
  Info
} from 'lucide-react';
import Alert from '../Alert/Alert';
import { useAlert } from '../Alert/useAlert';
import { generateInvoicePDF, isInvoiceAvailable } from '../../utils/Invoicegenerator';
import Loader from '../Loader/Loader';

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;



const ErrorDisplay = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 rounded-3xl p-4 sm:p-8 text-white flex items-center justify-center">
    <div className="text-center max-w-md w-full bg-zinc-900/50 p-6 sm:p-8 rounded-2xl border border-zinc-700">
      <AlertTriangle className="text-red-400 mb-4 mx-auto" size={56} />
      <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-3 sm:mb-4">Unable to Load Order</h2>
      <p className="text-sm sm:text-base text-zinc-400 mb-6">{error}</p>
      <div className="space-y-3">
        <button 
          onClick={onRetry}
          className="w-full flex justify-center items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors mx-auto"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
        <button 
          onClick={() => window.history.back()} 
          className="w-full block text-zinc-400 hover:text-white mx-auto py-2 text-sm"
        >
          ← Back to Order History
        </button>
      </div>
    </div>
  </div>
);

// Tracking Details Modal Component
const TrackingDetailsModal = ({ order, onClose, formatDate }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 rounded-2xl border border-zinc-700 max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 sm:p-6 border-b border-zinc-700 flex items-center justify-between sticky top-0 bg-zinc-900 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-400/20 rounded-lg">
              <Clock className="text-yellow-400" size={24} />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Detailed Tracking History
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400">Complete timeline of your order</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors p-2 hover:bg-zinc-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {order.trackingHistory && order.trackingHistory.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {order.trackingHistory.slice().reverse().map((track, index) => (
                <div key={index} className="bg-zinc-800/50 p-4 sm:p-5 rounded-xl border border-zinc-700/50 hover:border-yellow-400/30 transition-all shadow-lg">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-green-500/20 text-green-400 ring-2 ring-green-500/50' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {index === 0 ? <CheckCircle size={20} className="sm:w-6 sm:h-6" /> : <MapPin size={20} className="sm:w-6 sm:h-6" />}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 sm:mb-3 gap-1.5 sm:gap-0">
                        <h3 className="font-bold text-white text-sm sm:text-base truncate">{track.status}</h3>
                        <span className="text-[10px] sm:text-xs text-zinc-500 bg-zinc-900/50 px-2 sm:px-3 py-1 rounded-full w-fit">
                          {formatDate(track.date)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300 mb-2 sm:mb-3 bg-zinc-900/30 p-2 sm:p-3 rounded-lg">
                        <MapPin size={14} className="text-yellow-400 flex-shrink-0" />
                        <span className="font-medium truncate">{track.location}</span>
                      </div>
                      
                      {track.notes && (
                        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-zinc-700/50">
                          <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-zinc-300 bg-blue-500/10 border border-blue-500/20 p-3 sm:p-4 rounded-lg">
                            <MessageSquare size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-[10px] sm:text-xs text-blue-400 font-semibold mb-0.5 sm:mb-1">Note from seller:</p>
                              <p className="italic leading-relaxed">{track.notes}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 sm:py-12 bg-zinc-800/30 rounded-xl">
              <Clock className="text-zinc-600 mb-3 mx-auto" size={48} />
              <p className="text-zinc-500 text-sm sm:text-lg">No tracking updates available yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Cancel Order Confirmation Modal
const CancelOrderModal = ({ order, onClose, onConfirm, isLoading }) => {
  const isCOD = order.paymentMethod === 'COD';
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 rounded-2xl border border-zinc-700 max-w-md w-full shadow-2xl flex flex-col">
        <div className="p-5 sm:p-6 border-b border-zinc-700 shrink-0">
          <div className="flex items-center gap-3 mb-1 sm:mb-2">
            <div className="p-2 bg-red-400/20 rounded-lg">
              <AlertTriangle className="text-red-400 sm:w-6 sm:h-6" size={20} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Cancel Order?
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">This action cannot be undone</p>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto">
          <p className="text-sm sm:text-base text-zinc-300 mb-4 sm:mb-5">
            Are you sure you want to cancel this order?
            {!isCOD && ' Your refund will be processed within 48 hours.'}
          </p>
          
          <div className="bg-zinc-800/50 p-3 sm:p-4 rounded-lg mb-4">
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <Package size={14} className="text-yellow-400 sm:w-4 sm:h-4" />
              <span className="font-semibold text-white text-xs sm:text-sm">Order ID:</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono break-all">{order._id}</p>
          </div>

          {!isCOD && (
            <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg mb-5 sm:mb-6">
              <div className="flex items-start gap-2">
                <Info className="text-blue-400 mt-0.5 flex-shrink-0 sm:w-4 sm:h-4" size={14} />
                <p className="text-[10px] sm:text-xs text-blue-300">
                  Refund will be credited to your original payment method within 48 hours of cancellation.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 text-sm"
            >
              Keep Order
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full sm:flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/50 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={14} className="animate-spin sm:w-4 sm:h-4" />
                  Cancelling...
                </>
              ) : (
                <>
                  <X size={14} className="sm:w-4 sm:h-4" />
                  Yes, Cancel Order
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { alert, showAlert, hideAlert, success, error: showError, warning, info } = useAlert();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      if (!id || !token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${API_URL}/get-order-details/${orderId}`,
        {
          headers: {
            id: id,
            authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch order details");
      }

      setOrder(result.data);
      
      const stepMap = {
        'Order Placed': 0,
        'Processing': 1,
        'Shipped': 2,
        'Out for Delivery': 3,
        'Delivered': 4,
        'Cancelled': -1
      };
      setActiveStep(stepMap[result.data.orderStatus] || 0);

    } catch (error) {
      console.error("Failed to fetch order details:", error);
      setError(error.message || "Failed to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const copyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      success('Order ID copied to clipboard!');
    } catch (err) {
      showError('Failed to copy Order ID');
    }
  };

  const handleRetry = () => {
    fetchOrderDetails();
  };

  // Check if order can be cancelled
  const canCancelOrder = () => {
    if (!order) return false;
    
    const nonCancellableStatuses = ['Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
    return !nonCancellableStatuses.includes(order.orderStatus);
  };

  // Handle cancel order
  const handleCancelOrder = async () => {
    try {
      setIsCancelling(true);

      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/cancel-order/${orderId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            id: id,
            authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to cancel order");
      }

      setShowCancelModal(false);
      
      // Show different success message based on payment method
      const isCOD = order.paymentMethod === 'COD';
      const successMessage = isCOD 
        ? 'Order cancelled successfully!' 
        : 'Order cancelled successfully! Refund will be processed within 48 hours.';
      
      success(successMessage, 'Order Cancelled');
      await fetchOrderDetails();

    } catch (err) {
      console.error("Cancel order error:", err);
      showError(err.message || 'Failed to cancel order. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  // Handle download invoice
  const handleDownloadInvoice = async () => {
    try {
      setIsDownloadingInvoice(true);
      
      if (!isInvoiceAvailable(order)) {
        warning('Invoice is not available yet. Please try again after payment is confirmed.');
        return;
      }
      
      const result = generateInvoicePDF(order);
      
      if (result.success) {
        success(`Invoice downloaded successfully: ${result.fileName}`, 'Download Complete');
      } else {
        throw new Error(result.error || 'Failed to generate invoice');
      }
      
    } catch (err) {
      console.error("Invoice download error:", err);
      showError(err.message || 'Failed to download invoice. Please try again.');
    } finally {
      setIsDownloadingInvoice(false);
    }
  };

  const baseTrackingSteps = [
    { title: 'Order Placed', description: 'Your order has been confirmed', icon: <Package size={20} />, location: 'Warehouse' },
    { title: 'Processing', description: 'Preparing your order', icon: <Clock size={20} />, location: 'Processing Center' },
    { title: 'Shipped', description: 'Package dispatched', icon: <Truck size={20} />, location: 'In Transit' },
    { title: 'Out for Delivery', description: 'Your order is on the way', icon: <Truck size={20} />, location: order?.currentLocation || 'Delivery Hub' },
    { title: 'Delivered', description: 'Package delivered successfully', icon: <CheckCircle size={20} />, location: 'Delivered' }
  ];

  const getCustomTrackingUpdates = () => {
    if (!order?.trackingHistory) return [];
    const baseStatuses = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
    return order.trackingHistory.filter(track => !baseStatuses.includes(track.status)).slice(-1);
  };

  const customUpdates = getCustomTrackingUpdates();

  const getTrackingSteps = () => {
    const steps = [...baseTrackingSteps];
    if (customUpdates.length > 0 && order?.orderStatus !== 'Delivered' && order?.orderStatus !== 'Cancelled') {
      const latestCustom = customUpdates[0];
      const insertIndex = Math.min(activeStep + 1, steps.length - 1);
      steps.splice(insertIndex, 0, {
        title: latestCustom.status,
        description: latestCustom.notes || 'Custom update from seller',
        icon: <MapPin size={20} />,
        location: latestCustom.location,
        isCustom: true
      });
    }
    return steps;
  };

  const trackingSteps = getTrackingSteps();

  const AnimatedCircle = ({ isActive, isCompleted, step, isCustom }) => (
    <div className="relative">
      <div className={`
        w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-sm sm:text-lg font-bold transition-all duration-500 shadow-lg
        ${isCustom ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white scale-110 ring-2 ring-blue-400/50' :
          isCompleted ? 'bg-gradient-to-br from-green-500 to-green-600 text-white scale-110' : 
          isActive ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-black scale-110 animate-pulse' : 
          'bg-zinc-700 text-zinc-400 scale-90'}
      `}>
        {React.cloneElement(trackingSteps[step].icon, { className: 'w-4 h-4 sm:w-5 sm:h-5' })}
      </div>
      
      {isActive && !isCustom && (
        <div className="absolute inset-0 w-10 h-10 sm:w-14 sm:h-14 bg-yellow-400 rounded-full animate-ping opacity-30"></div>
      )}
      
      {isCustom && (
        <div className="absolute inset-0 w-10 h-10 sm:w-14 sm:h-14 bg-blue-400 rounded-full animate-pulse opacity-30"></div>
      )}
      
      {isCompleted && !isCustom && (
        <div className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
          <CheckCircle size={10} className="sm:w-3 sm:h-3" />
        </div>
      )}
    </div>
  );

  if (loading) {
    return <Loader fullPage text="Loading order details..." />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={handleRetry} />;
  }

  if (!order) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 rounded-3xl p-4 sm:p-8 text-white flex items-center justify-center">
        <div className="text-center w-full max-w-md bg-zinc-900/50 p-6 sm:p-8 rounded-2xl border border-zinc-700">
          <Package className="text-zinc-600 mb-4 mx-auto" size={56} />
          <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-3 sm:mb-4">Order Not Found</h2>
          <p className="text-sm sm:text-base text-zinc-400 mb-6">The requested order could not be found.</p>
          <button 
            onClick={() => navigate('/profile/orderHistory')}
            className="text-yellow-300 hover:text-yellow-200 flex items-center justify-center gap-2 mx-auto text-sm sm:text-base"
          >
            <ArrowLeft size={16} />
            Back to Order History
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white px-1.5 py-3 sm:px-8 sm:py-6 flex justify-center">
      <div className="w-full max-w-6xl bg-zinc-900/50 rounded-2xl px-2.5 sm:px-10 py-3.5 sm:py-6 shadow-xl border border-zinc-700">
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

        {showTrackingModal && (
          <TrackingDetailsModal 
            order={order} 
            onClose={() => setShowTrackingModal(false)}
            formatDate={formatDate}
          />
        )}

        {showCancelModal && (
          <CancelOrderModal
            order={order}
            onClose={() => setShowCancelModal(false)}
            onConfirm={handleCancelOrder}
            isLoading={isCancelling}
          />
        )}

        {/* Back Button */}
        <div className="mb-3">
          <button 
            onClick={() => navigate('/profile/orderHistory')}
            className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-1 group transition-all text-xs sm:text-sm font-semibold"
          >
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={14} />
            <span>Back to Orders</span>
          </button>
        </div>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-700 pb-3 mb-4 sm:mb-6 gap-2">
          <div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <Package className="text-yellow-400 w-5 h-5 sm:w-6 sm:h-6" />
              Order Details
            </h1>
            <div className="flex items-center gap-2 text-[11px] sm:text-sm text-zinc-400 mt-1">
              <span className="font-mono text-zinc-400">Order ID: #{orderId.toUpperCase()}</span>
              <button 
                onClick={copyOrderId}
                className="text-yellow-400 hover:text-yellow-300 p-1 rounded hover:bg-zinc-800 transition-all"
                title="Copy Order ID"
              >
                <Copy size={12} />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3 mt-1 sm:mt-0">
            <span className="text-xs text-zinc-400 sm:inline">Status:</span>
            <span className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full font-bold text-xs sm:text-sm shadow-md border ${
              order.orderStatus === 'Delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
              order.orderStatus === 'Out for Delivery' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
              order.orderStatus === 'Shipped' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
              order.orderStatus === 'Cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
              'bg-blue-500/10 text-blue-400 border-blue-500/20'
            }`}>
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            
            {/* Order Tracking Section */}
            <div className="bg-zinc-800/40 rounded-xl border border-zinc-700 p-3 sm:p-6 shadow-xl">
              <div className="flex flex-row items-center justify-between mb-4 sm:mb-6 gap-2">
                <h2 className="text-sm sm:text-xl font-bold text-yellow-400 flex items-center gap-2">
                  <Truck className="text-yellow-400 w-4 h-4 sm:w-5 sm:h-5" />
                  Order Tracking
                </h2>
                
                <button
                  onClick={() => setShowTrackingModal(true)}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all border border-blue-500/20 font-semibold text-xs shadow active:scale-[0.98]"
                >
                  <Eye size={12} className="sm:w-3.5 sm:h-3.5" />
                  Full Logs
                </button>
              </div>
              
              {order.orderStatus === 'Cancelled' ? (
                <div className="text-center py-6 bg-zinc-900/50 rounded-xl border border-red-500/20">
                  <div className="text-red-400 text-4xl mb-2">✕</div>
                  <h3 className="text-sm font-bold text-red-400 mb-0.5">Order Cancelled</h3>
                  <p className="text-[11px] text-zinc-400">This order has been cancelled and cannot be delivered</p>
                </div>
              ) : (
                <>
                  {/* Super-Compact Mobile Vertical Timeline */}
                  <div className="sm:hidden space-y-3 relative pl-5 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-700">
                    {trackingSteps.map((step, index) => {
                      const isCompleted = index < activeStep;
                      const isActive = index === activeStep;
                      const isCustom = step.isCustom;
                      return (
                        <div key={index} className="relative flex items-center justify-between gap-2.5">
                          {/* Timeline Circle */}
                          <div className={`absolute -left-[18px] top-1.5 rounded-full w-3.5 h-3.5 flex items-center justify-center border z-10 ${
                            isCustom ? 'bg-blue-500 border-blue-400' :
                            isCompleted ? 'bg-green-500 border-green-400' :
                            isActive ? 'bg-yellow-400 border-yellow-300 animate-pulse' :
                            'bg-zinc-850 border-zinc-750 text-zinc-650'
                          }`}>
                            {isCompleted && <CheckCircle size={8} className="text-white" />}
                          </div>
                          
                          <div className="flex-1 flex items-center justify-between min-w-0">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <h4 className={`font-bold text-xs truncate ${
                                step.isCustom ? 'text-blue-300' :
                                index <= activeStep ? 'text-yellow-350' : 'text-zinc-500'
                              }`}>
                                {step.title}
                              </h4>
                              <span className="text-[8px] text-zinc-500 shrink-0 font-medium bg-zinc-900/40 px-1.5 py-0.5 rounded border border-zinc-800/35">
                                {step.location}
                              </span>
                            </div>
                            {index <= activeStep && order.trackingHistory?.[index] && (
                              <span className="text-[9px] text-zinc-400 font-mono shrink-0">
                                {formatDate(order.trackingHistory[index].date).split(',')[0]}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop Horizontal Timeline */}
                  <div className="hidden sm:block relative overflow-x-auto pb-4 hide-scrollbar">
                    <div className="min-w-[450px] p-2">
                      <div className="relative">
                        <div className="absolute top-7 left-7 right-7 h-1.5 bg-zinc-800 rounded-full">
                          <div 
                            className="h-full bg-gradient-to-r from-yellow-400 via-purple-400 to-green-500 rounded-full transition-all duration-1000 shadow"
                            style={{ width: `${(activeStep / (trackingSteps.length - 1)) * 100}%` }}
                          ></div>
                        </div>
                        
                        <div className="relative flex justify-between">
                          {trackingSteps.map((step, index) => (
                            <div key={index} className={`flex flex-col items-center text-center ${
                              step.isCustom ? 'max-w-[100px]' : 'max-w-[90px]'
                            }`}>
                              <AnimatedCircle 
                                isActive={index === activeStep} 
                                isCompleted={index < activeStep} 
                                step={index}
                                isCustom={step.isCustom}
                              />
                              
                              <div className="mt-5">
                                <h3 className={`font-bold text-xs mb-1 transition-colors ${
                                  step.isCustom ? 'text-blue-300' :
                                  index <= activeStep ? 'text-yellow-350' : 'text-zinc-500'
                                }`}>
                                  {step.title}
                                </h3>
                                <p className="text-[10px] text-zinc-500 mb-2 leading-tight line-clamp-2">{step.description}</p>
                                
                                <div className={`flex items-center justify-center gap-1 text-[10px] transition-all duration-500 ${
                                  step.isCustom ? 'text-blue-300 font-semibold' :
                                  index === activeStep ? 'text-yellow-300 font-semibold' : 
                                  index < activeStep ? 'text-green-400' : 'text-zinc-600'
                                }`}>
                                  <MapPin size={10} className="shrink-0" />
                                  <span className="break-words line-clamp-1">
                                    {step.location}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Delivered' && (
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-5 border-t border-zinc-700">
                  <div className="flex flex-row items-center justify-between bg-zinc-900/50 p-2.5 sm:p-4 rounded-xl gap-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 bg-blue-500/20 rounded-lg shrink-0">
                        <MapPin className="text-blue-400 w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </div>
                      <div>
                        <p className="text-[8px] sm:text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Current Location</p>
                        <p className="text-xs sm:text-sm font-bold text-white mt-0.5">{order.currentLocation || 'In Transit'}</p>
                      </div>
                    </div>
                    {order.trackingHistory && order.trackingHistory.length > 0 && (
                      <div className="text-right">
                        <p className="text-[8px] sm:text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Last Updated</p>
                        <p className="text-[10px] sm:text-xs text-white font-medium mt-0.5">
                          {formatDate(order.trackingHistory[order.trackingHistory.length - 1].date).split(',')[0]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Item Details Section */}
            <div className="bg-zinc-800/40 rounded-xl border border-zinc-700 p-3 sm:p-6 shadow-xl">
              <h2 className="text-sm sm:text-xl font-bold text-yellow-400 mb-4 sm:mb-6 flex items-center gap-2">
                <ShoppingBag size={16} className="sm:w-5 sm:h-5" />
                Item Details
              </h2>
              
              <div className="flex gap-3 sm:gap-6 bg-zinc-900/40 p-2.5 sm:p-4 rounded-xl border border-zinc-700/50">
                {order.book && (
                  <div className="relative group shrink-0 w-16 sm:w-32">
                    <img
                      src={order.book.url || "https://via.placeholder.com/150x200?text=Book"}
                      alt={order.book.title}
                      className="w-full h-22 sm:h-44 object-cover rounded-lg border border-zinc-700 shadow-md group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <h3 className="text-sm sm:text-xl font-bold text-yellow-355 leading-snug line-clamp-1 sm:line-clamp-2 mb-0.5 sm:mb-1.5">
                      {order.book?.title || "Book Information Unavailable"}
                    </h3>
                    
                    {order.book?.desc && (
                      <p className="hidden sm:block text-zinc-400 text-xs sm:text-sm mb-3 leading-relaxed line-clamp-3">
                        {order.book.desc}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] sm:text-xs text-zinc-400 mb-2">
                      <div className="flex items-center gap-1">
                        <User className="text-yellow-400 shrink-0" size={10} />
                        <span>by <strong className="text-white font-medium">{order.book?.author || "Unknown"}</strong></span>
                      </div>
                      <div className="flex items-center gap-1 border-l border-zinc-700 pl-2">
                        <span>Lang: <strong className="text-white font-medium">{order.book?.language || "English"}</strong></span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Total Paid & Payment Status combined into a compact bar */}
                  <div className="flex items-center justify-between sm:justify-start gap-3 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-1.5 sm:p-3">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1 bg-green-500/20 rounded shrink-0">
                        <IndianRupee className="text-green-400 w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                      <div>
                        <span className="text-[8px] sm:text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">Total Paid</span>
                        <span className="text-xs sm:text-xl font-black text-green-400 leading-none">
                          {formatCurrency(order.amountPayable)}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[9px] border px-1.5 py-0.5 rounded font-extrabold uppercase sm:ml-auto ${
                      order.paymentStatus === 'Success' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      order.paymentStatus === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address Section */}
            {order.shippingAddress && (
              <div className="bg-zinc-800/40 rounded-xl border border-zinc-700 p-3 sm:p-6 shadow-xl">
                <h2 className="text-sm sm:text-xl font-bold text-yellow-400 mb-3 flex items-center gap-2">
                  <MapPin size={16} className="sm:w-5 sm:h-5" />
                  Delivery Address
                </h2>
                
                <div className="bg-zinc-900/50 p-2.5 sm:p-4 rounded-xl border border-zinc-700/50">
                  <div className="flex items-start gap-2">
                    <Home className="text-yellow-400 mt-0.5 shrink-0 sm:w-[18px] sm:h-[18px]" size={14} />
                    <div className="text-xs sm:text-sm">
                      <div className="font-bold text-white mb-0.5">
                        {order.shippingAddress.fullName}
                      </div>
                      <p className="text-zinc-300 leading-normal">
                        {order.shippingAddress.addressLine1}
                        {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                      </p>
                      <p className="font-semibold text-white mt-0.5">
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5 pt-1.5 border-t border-zinc-800 text-[11px] sm:text-xs">
                        <Phone className="text-yellow-400 shrink-0" size={10} />
                        <span className="text-zinc-400">Phone:</span>
                        <span className="font-bold text-white">{order.shippingAddress.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Columns */}
          <div className="space-y-4 sm:space-y-6">
            
            {/* Order Summary */}
            <div className="bg-zinc-800/40 rounded-xl border border-zinc-700 p-3 sm:p-6 shadow-xl">
              <h2 className="text-sm sm:text-lg font-bold text-yellow-400 mb-4 sm:mb-6 flex items-center gap-2">
                <FileText size={16} className="sm:w-5 sm:h-5" />
                Order Summary
              </h2>
              
              <div className="grid grid-cols-3 sm:flex sm:flex-col gap-2 sm:gap-3.5">
                <div className="bg-zinc-900/50 p-2 sm:p-3 rounded-lg border border-zinc-800/40 text-center sm:text-left flex flex-col justify-between">
                  <div className="text-zinc-500 text-[8px] sm:text-[10px] uppercase font-bold tracking-wider">Date</div>
                  <div className="font-bold text-white text-[10px] sm:text-xs mt-0.5 truncate">
                    {formatDate(order.createdAt).split('at')[0]}
                  </div>
                </div>
                
                <div className="bg-zinc-900/50 p-2 sm:p-3 rounded-lg border border-zinc-800/40 text-center sm:text-left flex flex-col justify-between">
                  <div className="text-zinc-500 text-[8px] sm:text-[10px] uppercase font-bold tracking-wider">Delivery</div>
                  <div className="font-bold text-white text-[10px] sm:text-xs mt-0.5 truncate">
                    {formatDate(order.expectedDeliveryDate || order.deliveryDate).split('at')[0]}
                  </div>
                </div>
                
                <div className="bg-zinc-900/50 p-2 sm:p-3 rounded-lg border border-zinc-800/40 text-center sm:text-left flex flex-col justify-between">
                  <div className="text-zinc-500 text-[8px] sm:text-[10px] uppercase font-bold tracking-wider">Payment</div>
                  <div className="font-bold text-white text-[9px] sm:text-xs mt-0.5 truncate flex items-center justify-center sm:justify-start gap-1">
                    {order.paymentMethod}
                    {order.paymentMethod === 'RAZORPAY' && (
                      <span className="hidden sm:inline text-[8px] bg-purple-500/20 text-purple-300 border border-purple-500/35 px-1 py-0.5 rounded font-extrabold uppercase">Online</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="border-t border-zinc-700 pt-3 sm:pt-4 mt-3 sm:mt-5 space-y-2">
                <div className="flex justify-between items-center text-[11px] sm:text-sm">
                  <span className="text-zinc-400">Item Price</span>
                  <span className="font-semibold">{formatCurrency(order.book?.price || order.amountPayable)}</span>
                </div>
                
                {order.discount > 0 && (
                  <div className="flex justify-between items-center text-[11px] sm:text-sm">
                    <span className="text-zinc-400">Discount</span>
                    <span className="text-green-400 font-semibold">-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                
                {order.handlingFee > 0 && (
                  <div className="flex justify-between items-center text-[11px] sm:text-sm">
                    <span className="text-zinc-400">Handling Fee</span>
                    <span className="font-semibold">{formatCurrency(order.handlingFee)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-[11px] sm:text-sm">
                  <span className="text-zinc-400">Delivery Charges</span>
                  <span className="text-green-400 font-bold">FREE</span>
                </div>
                
                <div className="border-t border-zinc-700 pt-2 sm:pt-3 mt-2 sm:mt-3">
                  <div className="flex justify-between items-center text-sm sm:text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-green-400 text-base sm:text-2xl">{formatCurrency(order.amountPayable)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-zinc-800/40 rounded-xl border border-zinc-700 p-3 sm:p-6 shadow-xl">
              <h3 className="text-sm sm:text-lg font-bold text-yellow-400 mb-3 sm:mb-4">Quick Actions</h3>
              
              <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2">
                {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                  canCancelOrder() ? (
                    <button 
                      onClick={() => setShowCancelModal(true)}
                      className="col-span-2 sm:col-span-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 shadow flex items-center justify-center gap-1.5 text-xs active:scale-[0.98]"
                    >
                      <X size={14} />
                      Cancel Order
                    </button>
                  ) : (
                    <div className="col-span-2 bg-zinc-900/50 border border-zinc-800/80 rounded-lg p-2 flex items-start gap-2">
                      <Info className="text-blue-400 mt-0.5 flex-shrink-0" size={14} />
                      <p className="text-[10px] text-zinc-500 leading-normal">
                        Cannot cancel. Your package is currently in transit.
                      </p>
                    </div>
                  )
                )}
                
                {order.book && (
                  <button
                    onClick={() => navigate(getBookDetailPath(order.book.title, order.book._id))}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-semibold py-2 px-3 rounded-lg transition-all duration-300 shadow flex items-center justify-center gap-1.5 text-xs active:scale-[0.98]"
                  >
                    <Package size={14} />
                    View Book
                  </button>
                )}
                
                <button 
                  onClick={handleDownloadInvoice}
                  disabled={isDownloadingInvoice || !isInvoiceAvailable(order)}
                  className={`font-semibold py-2 px-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 text-xs active:scale-[0.98] ${
                    isInvoiceAvailable(order)
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow'
                      : 'bg-zinc-700/50 text-zinc-500 border border-zinc-800/80 cursor-not-allowed'
                  }`}
                >
                  {isDownloadingInvoice ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Invoice...
                    </>
                  ) : (
                    <>
                      <Download size={14} />
                      Invoice
                    </>
                  )}
                </button>
                
                {order.orderStatus === 'Delivered' && order.book && (
                  <button
                    onClick={() => info('Review feature coming soon!', 'Feature Coming Soon')}
                    className="col-span-2 sm:col-span-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 shadow flex items-center justify-center gap-1.5 text-xs active:scale-[0.98]"
                  >
                    <Star size={14} />
                    Rate & Review Book
                  </button>
                )}
              </div>
            </div>

            {/* Need Help Section */}
            <div className="bg-zinc-800/40 rounded-xl border border-zinc-700 p-3 sm:p-6 shadow-xl">
              <h3 className="text-sm sm:text-lg font-bold text-yellow-400 mb-3 sm:mb-4 flex items-center gap-2">
                <MessageCircle size={16} className="sm:w-5 sm:h-5" />
                Need Help?
              </h3>
              
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2">
                  <div className="flex items-center gap-2 text-zinc-300 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/40">
                    <Phone className="text-yellow-400 shrink-0" size={14} />
                    <div className="min-w-0">
                      <div className="text-zinc-500 text-[8px] uppercase font-bold tracking-wider">Call Support</div>
                      <div className="font-bold text-white text-[10px] mt-0.5 truncate">1800-XXX-XXXX</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-zinc-300 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/40">
                    <Mail className="text-yellow-400 shrink-0" size={14} />
                    <div className="min-w-0">
                      <div className="text-zinc-500 text-[8px] uppercase font-bold tracking-wider">Email</div>
                      <div className="font-bold text-white text-[10px] mt-0.5 truncate">support@book.com</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2 pt-1">
                  <button 
                    onClick={() => info('Chat support coming soon!', 'Feature Coming Soon')}
                    className="w-full bg-zinc-750 hover:bg-zinc-700 text-white font-semibold py-1.5 px-2.5 rounded-lg transition-all duration-300 text-[11px] flex items-center justify-center gap-1.5 active:scale-[0.98] border border-zinc-700"
                  >
                    <MessageCircle size={12} />
                    Live Chat
                  </button>
                  
                  <button 
                    onClick={() => info('Report issue feature coming soon!', 'Feature Coming Soon')}
                    className="w-full bg-zinc-750 hover:bg-zinc-700 text-white font-semibold py-1.5 px-2.5 rounded-lg transition-all duration-300 text-[11px] flex items-center justify-center gap-1.5 active:scale-[0.98] border border-zinc-700"
                  >
                    <AlertTriangle size={12} />
                    Report Issue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;