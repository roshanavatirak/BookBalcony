import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

const Loader = () => (
  <div className="flex items-center justify-center p-8">
    <div className="relative">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-400"></div>
      <Package className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-400" size={24} />
    </div>
  </div>
);

const ErrorDisplay = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 rounded-3xl p-8 text-white flex items-center justify-center">
    <div className="text-center max-w-md bg-zinc-900/50 p-8 rounded-2xl border border-zinc-700">
      <AlertTriangle className="text-red-400 mb-4 mx-auto" size={64} />
      <h2 className="text-2xl font-bold text-red-400 mb-4">Unable to Load Order</h2>
      <p className="text-zinc-400 mb-6">{error}</p>
      <div className="space-y-3">
        <button 
          onClick={onRetry}
          className="flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors mx-auto"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
        <button 
          onClick={() => window.history.back()} 
          className="block text-zinc-400 hover:text-white mx-auto"
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
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 rounded-2xl border border-zinc-700 max-w-3xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-700 flex items-center justify-between sticky top-0 bg-zinc-900 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-400/20 rounded-lg">
              <Clock className="text-yellow-400" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Detailed Tracking History
              </h2>
              <p className="text-sm text-zinc-400">Complete timeline of your order</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors p-2 hover:bg-zinc-800 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
          {order.trackingHistory && order.trackingHistory.length > 0 ? (
            <div className="space-y-4">
              {order.trackingHistory.slice().reverse().map((track, index) => (
                <div key={index} className="bg-zinc-800/50 p-5 rounded-xl border border-zinc-700/50 hover:border-yellow-400/30 transition-all shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-green-500/20 text-green-400 ring-2 ring-green-500/50' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {index === 0 ? <CheckCircle size={24} /> : <MapPin size={24} />}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-white text-base">{track.status}</h3>
                        <span className="text-xs text-zinc-500 bg-zinc-900/50 px-3 py-1 rounded-full">
                          {formatDate(track.date)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-zinc-300 mb-3 bg-zinc-900/30 p-3 rounded-lg">
                        <MapPin size={16} className="text-yellow-400 flex-shrink-0" />
                        <span className="font-medium">{track.location}</span>
                      </div>
                      
                      {track.notes && (
                        <div className="mt-3 pt-3 border-t border-zinc-700/50">
                          <div className="flex items-start gap-3 text-sm text-zinc-300 bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                            <MessageSquare size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-blue-400 font-semibold mb-1">Note from seller:</p>
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
            <div className="text-center py-12 bg-zinc-800/30 rounded-xl">
              <Clock className="text-zinc-600 mb-3 mx-auto" size={56} />
              <p className="text-zinc-500 text-lg">No tracking updates available yet</p>
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
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 rounded-2xl border border-zinc-700 max-w-md w-full shadow-2xl">
        <div className="p-6 border-b border-zinc-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-400/20 rounded-lg">
              <AlertTriangle className="text-red-400" size={24} />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Cancel Order?
            </h2>
          </div>
          <p className="text-sm text-zinc-400">This action cannot be undone</p>
        </div>

        <div className="p-6">
          <p className="text-zinc-300 mb-4">
            Are you sure you want to cancel this order?
            {!isCOD && ' Your refund will be processed within 48 hours.'}
          </p>
          
          <div className="bg-zinc-800/50 p-4 rounded-lg mb-4">
            <div className="flex items-center gap-3 mb-2">
              <Package size={16} className="text-yellow-400" />
              <span className="font-semibold text-white">Order ID:</span>
            </div>
            <p className="text-sm text-zinc-400 font-mono">{order._id.slice(0, 16)}...</p>
          </div>

          {!isCOD && (
            <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg mb-4">
              <div className="flex items-start gap-2">
                <Info className="text-blue-400 mt-0.5 flex-shrink-0" size={16} />
                <p className="text-xs text-blue-300">
                  Refund will be credited to your original payment method within 48 hours of cancellation.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              Keep Order
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/50 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <X size={16} />
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
        w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-500 shadow-lg
        ${isCustom ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white scale-110 ring-2 ring-blue-400/50' :
          isCompleted ? 'bg-gradient-to-br from-green-500 to-green-600 text-white scale-110' : 
          isActive ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-black scale-110 animate-pulse' : 
          'bg-zinc-700 text-zinc-400 scale-90'}
      `}>
        {trackingSteps[step].icon}
      </div>
      
      {isActive && !isCustom && (
        <div className="absolute inset-0 w-14 h-14 bg-yellow-400 rounded-full animate-ping opacity-30"></div>
      )}
      
      {isCustom && (
        <div className="absolute inset-0 w-14 h-14 bg-blue-400 rounded-full animate-pulse opacity-30"></div>
      )}
      
      {isCompleted && !isCustom && (
        <div className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
          <CheckCircle size={12} />
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 rounded-3xl flex items-center justify-center">
        <div className="text-center">
          <Loader />
          <p className="text-zinc-400 mt-4 animate-pulse">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={handleRetry} />;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 rounded-3xl p-8 text-white flex items-center justify-center">
        <div className="text-center bg-zinc-900/50 p-8 rounded-2xl border border-zinc-700">
          <Package className="text-zinc-600 mb-4 mx-auto" size={64} />
          <h2 className="text-2xl font-bold text-red-400 mb-4">Order Not Found</h2>
          <p className="text-zinc-400 mb-6">The requested order could not be found.</p>
          <button 
            onClick={() => navigate('/profile/orderHistory')}
            className="text-yellow-300 hover:text-yellow-200 flex items-center gap-2 mx-auto"
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
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white px-4 sm:px-8 py-10 flex justify-center">
      <div className="w-full max-w-7xl bg-zinc-900/50 rounded-3xl px-6 sm:px-12 py-10 shadow-2xl border border-zinc-700">
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

        {/* Header Section */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/profile/orderHistory')}
            className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-6 group transition-all"
          >
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={18} />
            <span className="font-medium">Back to Orders</span>
          </button>
          
          {/* Title Section with Theme Matching AllBooks */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-md mb-2">
              Order Details
            </h1>
            <div className="flex items-center justify-center gap-3 text-sm text-zinc-400">
              <span className="font-mono">Order ID: {orderId.slice(0, 12)}...</span>
              <button 
                onClick={copyOrderId}
                className="text-yellow-300 hover:text-yellow-200 p-1.5 rounded-lg hover:bg-zinc-700 transition-all"
                title="Copy Order ID"
              >
                <Copy size={14} />
              </button>
            </div>
            <hr className="mt-6 border-zinc-700 w-3/4 mx-auto rounded-full" />
          </div>
          
          {/* Status Badge */}
          <div className="flex justify-center mb-6">
            <div className={`px-6 py-3 rounded-xl font-bold text-sm shadow-lg ${
              order.orderStatus === 'Delivered' ? 'bg-gradient-to-r from-green-600 to-green-700 text-green-50' :
              order.orderStatus === 'Out for Delivery' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
              order.orderStatus === 'Shipped' ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-purple-50' :
              order.orderStatus === 'Cancelled' ? 'bg-gradient-to-r from-red-600 to-red-700 text-red-50' :
              'bg-gradient-to-r from-blue-600 to-blue-700 text-blue-50'
            }`}>
              {order.orderStatus}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Order Tracking Section */}
            <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-3">
                  <div className="p-2 bg-yellow-400/20 rounded-lg">
                    <Truck size={24} />
                  </div>
                  Order Tracking
                </h2>
                
                <button
                  onClick={() => setShowTrackingModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-semibold text-sm shadow-lg"
                >
                  <Eye size={16} />
                  View Details
                </button>
              </div>
              
              {order.orderStatus === 'Cancelled' ? (
                <div className="text-center py-12 bg-zinc-900/50 rounded-xl border border-red-500/30">
                  <div className="text-red-400 text-6xl mb-4">✕</div>
                  <h3 className="text-xl font-bold text-red-400 mb-2">Order Cancelled</h3>
                  <p className="text-zinc-400">This order has been cancelled and cannot be delivered</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute top-7 left-7 right-7 h-2 bg-zinc-700 rounded-full">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-400 via-purple-400 to-green-500 rounded-full transition-all duration-1000 shadow-lg"
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
                            index <= activeStep ? 'text-yellow-300' : 'text-zinc-500'
                          }`}>
                            {step.title}
                          </h3>
                          <p className="text-xs text-zinc-500 mb-2 leading-tight line-clamp-2">{step.description}</p>
                          
                          <div className={`flex items-center justify-center gap-1 text-xs transition-all duration-500 ${
                            step.isCustom ? 'text-blue-300 font-semibold' :
                            index === activeStep ? 'text-yellow-300 font-semibold' : 
                            index < activeStep ? 'text-green-400' : 'text-zinc-600'
                          }`}>
                            <MapPin size={12} />
                            <span className="break-words line-clamp-1">
                              {step.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Delivered' && (
                <div className="mt-8 pt-6 border-t border-zinc-700">
                  <div className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <MapPin className="text-blue-400" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">Current Location</p>
                        <p className="text-sm font-bold text-white">{order.currentLocation || 'In Transit'}</p>
                      </div>
                    </div>
                    {order.trackingHistory && order.trackingHistory.length > 0 && (
                      <div className="text-right">
                        <p className="text-xs text-zinc-500">Last Updated</p>
                        <p className="text-xs text-white font-medium">
                          {formatDate(order.trackingHistory[order.trackingHistory.length - 1].date)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Item Details Section */}
            <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center gap-3">
                <div className="p-2 bg-yellow-400/20 rounded-lg">
                  <ShoppingBag size={24} />
                </div>
                Item Details
              </h2>
              
              <div className="flex gap-6 bg-zinc-900/50 p-5 rounded-xl border border-zinc-700/50">
                {order.book && (
                  <div className="relative group cursor-pointer">
                    <img
                      src={order.book.url || "https://via.placeholder.com/150x200?text=Book"}
                      alt={order.book.title}
                      className="w-36 h-48 object-cover rounded-xl border-2 border-zinc-600 shadow-xl group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">View Book</span>
                    </div>
                  </div>
                )}
                
                <div className="flex-1">
                  {order.book ? (
                    <>
                      <h3 className="text-2xl font-bold text-yellow-300 hover:text-yellow-200 mb-3 cursor-pointer transition-colors leading-tight">
                        {order.book.title}
                      </h3>
                      <p className="text-zinc-400 mb-4 leading-relaxed text-sm">
                        {order.book.desc?.slice(0, 250) || "No description available."}
                        {order.book.desc?.length > 250 && "..."}
                      </p>
                    </>
                  ) : (
                    <h3 className="text-2xl font-bold text-zinc-400 mb-3">Book Information Unavailable</h3>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-5 bg-zinc-800/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <User className="text-yellow-400" size={16} />
                      <div>
                        <span className="text-zinc-500 block text-xs">Author</span>
                        <div className="font-semibold text-white">{order.book?.author || "Unknown"}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="text-yellow-400" size={16} />
                      <div>
                        <span className="text-zinc-500 block text-xs">Language</span>
                        <div className="font-semibold text-white">{order.book?.language || "English"}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-gradient-to-r from-green-600/20 to-green-700/20 border border-green-500/30 rounded-lg p-4">
                    <IndianRupee className="text-green-400" size={28} />
                    <div>
                      <div className="text-xs text-zinc-400">Total Amount</div>
                      <div className="text-3xl font-bold text-green-400">
                        {formatCurrency(order.amountPayable)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address Section */}
            {order.shippingAddress && (
              <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-yellow-400/20 rounded-lg">
                    <MapPin size={24} />
                  </div>
                  Delivery Address
                </h2>
                
                <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-700/50">
                  <div className="flex items-start gap-3 mb-4">
                    <Home className="text-yellow-400 mt-1" size={20} />
                    <div>
                      <div className="font-bold text-lg text-white mb-1">
                        {order.shippingAddress.fullName}
                      </div>
                      <div className="text-zinc-300 space-y-1 text-sm">
                        <div>{order.shippingAddress.addressLine1}</div>
                        {order.shippingAddress.addressLine2 && (
                          <div>{order.shippingAddress.addressLine2}</div>
                        )}
                        <div className="font-semibold">
                          {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                        </div>
                        <div className="text-zinc-400">{order.shippingAddress.country}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-zinc-700">
                    <Phone className="text-yellow-400" size={16} />
                    <span className="font-semibold">{order.shippingAddress.phone}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6 sticky top-4 shadow-xl">
              <h2 className="text-xl font-bold text-yellow-400 mb-6 flex items-center gap-2">
                <FileText size={20} />
                Order Summary
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm bg-zinc-900/50 p-3 rounded-lg">
                  <Calendar className="text-yellow-400 mt-0.5" size={18} />
                  <div className="flex-1">
                    <div className="text-zinc-400 text-xs mb-1">Order Date</div>
                    <div className="font-semibold text-white">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 text-sm bg-zinc-900/50 p-3 rounded-lg">
                  <Truck className="text-yellow-400 mt-0.5" size={18} />
                  <div className="flex-1">
                    <div className="text-zinc-400 text-xs mb-1">Expected Delivery</div>
                    <div className="font-semibold text-white">
                      {formatDate(order.expectedDeliveryDate || order.deliveryDate)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 text-sm bg-zinc-900/50 p-3 rounded-lg">
                  <CreditCard className="text-yellow-400 mt-0.5" size={18} />
                  <div className="flex-1">
                    <div className="text-zinc-400 text-xs mb-1">Payment Method</div>
                    <div className="font-semibold text-white flex items-center gap-2">
                      {order.paymentMethod}
                      {order.paymentMethod === 'RAZORPAY' && (
                        <span className="text-xs bg-purple-600 px-2 py-0.5 rounded">Online</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-zinc-700 pt-5 mt-6 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Item Price</span>
                  <span className="font-semibold">{formatCurrency(order.book?.price || order.amountPayable)}</span>
                </div>
                
                {order.discount > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Discount</span>
                    <span className="text-green-400 font-semibold">-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                
                {order.handlingFee > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Handling Fee</span>
                    <span className="font-semibold">{formatCurrency(order.handlingFee)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Delivery Charges</span>
                  <span className="text-green-400 font-bold">FREE</span>
                </div>
                
                <div className="border-t border-zinc-700 pt-3 mt-3">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-green-400 text-2xl">{formatCurrency(order.amountPayable)}</span>
                  </div>
                </div>
              </div>
              
              <div className={`mt-5 p-4 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                order.paymentStatus === 'Success' ? 'bg-green-700/30 text-green-300 border border-green-600/50' :
                order.paymentStatus === 'Pending' ? 'bg-yellow-700/30 text-yellow-300 border border-yellow-600/50' :
                'bg-red-700/30 text-red-300 border border-red-600/50'
              }`}>
                <CreditCard size={18} />
                Payment: {order.paymentStatus}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-yellow-400 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                  canCancelOrder() ? (
                    <>
                      <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg mb-2">
                        <div className="flex items-start gap-2">
                          <Info className="text-amber-400 mt-0.5 flex-shrink-0" size={16} />
                          <p className="text-xs text-amber-300 leading-relaxed">
                            <span className="font-semibold">Cancellation Policy:</span> You can only cancel before the order is shipped. 
                            {order.paymentMethod !== 'COD' && ' Refund will be given within 48 hours.'}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setShowCancelModal(true)}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/50 flex items-center justify-center gap-2"
                      >
                        <X size={16} />
                        Cancel Order
                      </button>
                    </>
                  ) : (
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Info className="text-blue-400 mt-0.5 flex-shrink-0" size={18} />
                        <div className="text-sm">
                          <p className="text-zinc-400 mb-1">
                            <span className="font-semibold text-white">Cannot cancel order</span>
                          </p>
                          <p className="text-zinc-500 text-xs leading-relaxed">
                            Orders can only be cancelled before they are shipped. Your order has already been dispatched.
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
                
                {order.book && (
                  <button
                    onClick={() => navigate(`/view-book-details/${order.book._id}`)}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 flex items-center justify-center gap-2"
                  >
                    <Package size={16} />
                    View Book Details
                  </button>
                )}
                
                {/* Download Invoice Button - Now Working! */}
                <button 
                  onClick={handleDownloadInvoice}
                  disabled={isDownloadingInvoice || !isInvoiceAvailable(order)}
                  className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                    isInvoiceAvailable(order)
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-blue-500/50'
                      : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  {isDownloadingInvoice ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      Download Invoice
                    </>
                  )}
                </button>
                
                {!isInvoiceAvailable(order) && (
                  <p className="text-xs text-zinc-500 text-center -mt-1">
                    Invoice will be available after payment confirmation
                  </p>
                )}
                
                {order.orderStatus === 'Delivered' && order.book && (
                  <button
                    onClick={() => info('Review feature coming soon!', 'Feature Coming Soon')}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2"
                  >
                    <Star size={16} />
                    Rate & Review
                  </button>
                )}
              </div>
            </div>

            {/* Need Help Section */}
            <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
                <MessageCircle size={20} />
                Need Help?
              </h3>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-zinc-300 bg-zinc-900/50 p-3 rounded-lg">
                  <Phone className="text-yellow-400" size={18} />
                  <div>
                    <div className="text-zinc-400 text-xs">Customer Support</div>
                    <div className="font-semibold text-white">1800-XXX-XXXX</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-zinc-300 bg-zinc-900/50 p-3 rounded-lg">
                  <Mail className="text-yellow-400" size={18} />
                  <div>
                    <div className="text-zinc-400 text-xs">Email Support</div>
                    <div className="font-semibold text-white">support@bookbalcony.com</div>
                  </div>
                </div>
                
                <button 
                  onClick={() => info('Chat support coming soon!', 'Feature Coming Soon')}
                  className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 text-sm flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} />
                  Chat with Support
                </button>
                
                <button 
                  onClick={() => info('Report issue feature coming soon!', 'Feature Coming Soon')}
                  className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 text-sm flex items-center justify-center gap-2"
                >
                  <AlertTriangle size={16} />
                  Report an Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;