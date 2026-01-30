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
  Download
} from 'lucide-react';

const Loader = () => (
  <div className="flex items-center justify-center p-8">
    <div className="relative">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-400"></div>
      <Package className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-400" size={24} />
    </div>
  </div>
);

const ErrorDisplay = ({ error, onRetry }) => (
  <div className="min-h-screen bg-zinc-900/50 rounded-3xl p-8 text-white flex items-center justify-center">
    <div className="text-center max-w-md">
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

const Toast = ({ message, type, onClose }) => (
  <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all transform ${
    type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'
  } text-white flex items-center gap-3 animate-slide-in`}>
    <span>{message}</span>
    <button onClick={onClose} className="text-white/70 hover:text-white">
      <X size={16} />
    </button>
  </div>
);

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

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
        `http://localhost:3000/api/v1/get-order-details/${orderId}`,
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
        'Shipped': 1,
        'Out for Delivery': 2,
        'Delivered': 3,
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
      showToast('Order ID copied to clipboard!');
    } catch (err) {
      showToast('Failed to copy Order ID', 'error');
    }
  };

  const handleRetry = () => {
    fetchOrderDetails();
  };

  const trackingSteps = [
    {
      title: 'Order Placed',
      description: 'Your order has been confirmed',
      icon: <Package size={20} />,
      location: 'Warehouse'
    },
    {
      title: 'Processing',
      description: 'Preparing your order',
      icon: <Clock size={20} />,
      location: 'Processing Center'
    },
    {
      title: 'Out for Delivery',
      description: 'Your order is on the way',
      icon: <Truck size={20} />,
      location: order?.currentLocation || 'In Transit'
    },
    {
      title: 'Delivered',
      description: 'Package delivered successfully',
      icon: <CheckCircle size={20} />,
      location: 'Delivered'
    }
  ];

  const AnimatedCircle = ({ isActive, isCompleted, step }) => (
    <div className="relative">
      <div className={`
        w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-500 shadow-lg
        ${isCompleted ? 'bg-gradient-to-br from-green-500 to-green-600 text-white scale-110' : 
          isActive ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-black scale-110 animate-pulse' : 
          'bg-zinc-700 text-zinc-400 scale-90'}
      `}>
        {trackingSteps[step].icon}
      </div>
      
      {isActive && (
        <div className="absolute inset-0 w-14 h-14 bg-yellow-400 rounded-full animate-ping opacity-30"></div>
      )}
      
      {isCompleted && (
        <div className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
          <CheckCircle size={12} />
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 rounded-3xl flex items-center justify-center">
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
      <div className="min-h-screen bg-zinc-900/50 rounded-3xl p-8 text-white flex items-center justify-center">
        <div className="text-center">
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
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 rounded-3xl p-4 sm:p-8 text-white shadow-2xl border border-zinc-700">
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => navigate('/profile/orderHistory')}
          className="inline-flex items-center gap-2 text-yellow-300 hover:text-yellow-200 mb-6 group transition-all"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={18} />
          <span className="font-medium">Back to Orders</span>
        </button>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-zinc-800/50 backdrop-blur-sm p-6 rounded-2xl border border-zinc-700">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
              Order Details
            </h1>
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <span className="font-mono">Order ID: {orderId.slice(0, 8)}...</span>
              <button 
                onClick={copyOrderId}
                className="text-yellow-300 hover:text-yellow-200 p-1.5 rounded-lg hover:bg-zinc-700 transition-all"
                title="Copy Order ID"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
          
          <div className={`px-4 py-2 rounded-xl font-bold text-sm shadow-lg ${
            order.orderStatus === 'Delivered' ? 'bg-gradient-to-r from-green-600 to-green-700 text-green-50' :
            order.orderStatus === 'Out for Delivery' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
            order.orderStatus === 'Cancelled' ? 'bg-gradient-to-r from-red-600 to-red-700 text-red-50' :
            'bg-gradient-to-r from-blue-600 to-blue-700 text-blue-50'
          }`}>
            {order.orderStatus}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Tracking */}
          <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-yellow-400 mb-8 flex items-center gap-3">
              <div className="p-2 bg-yellow-400/20 rounded-lg">
                <Truck size={24} />
              </div>
              Order Tracking
            </h2>
            
            {order.orderStatus === 'Cancelled' ? (
              <div className="text-center py-12 bg-zinc-900/50 rounded-xl border border-red-500/30">
                <div className="text-red-400 text-6xl mb-4">✕</div>
                <h3 className="text-xl font-bold text-red-400 mb-2">Order Cancelled</h3>
                <p className="text-zinc-400">This order has been cancelled and cannot be delivered</p>
              </div>
            ) : (
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-7 left-7 right-7 h-2 bg-zinc-700 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-green-500 rounded-full transition-all duration-1000 shadow-lg"
                    style={{ width: `${(activeStep / (trackingSteps.length - 1)) * 100}%` }}
                  ></div>
                </div>
                
                {/* Steps */}
                <div className="relative flex justify-between">
                  {trackingSteps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center text-center max-w-[120px]">
                      <AnimatedCircle 
                        isActive={index === activeStep} 
                        isCompleted={index < activeStep} 
                        step={index}
                      />
                      
                      <div className="mt-5">
                        <h3 className={`font-bold text-sm mb-1 transition-colors ${
                          index <= activeStep ? 'text-yellow-300' : 'text-zinc-500'
                        }`}>
                          {step.title}
                        </h3>
                        <p className="text-xs text-zinc-500 mb-2 leading-tight">{step.description}</p>
                        
                        <div className={`flex items-center justify-center gap-1 text-xs transition-all duration-500 ${
                          index === activeStep ? 'text-yellow-300 font-semibold' : 
                          index < activeStep ? 'text-green-400' : 'text-zinc-600'
                        }`}>
                          <MapPin size={12} />
                          <span>{index === 2 ? order.currentLocation : step.location}</span>
                        </div>
                        
                        {order.trackingHistory && order.trackingHistory[index] && (
                          <div className="text-xs text-zinc-600 mt-2 font-medium">
                            {formatDate(order.trackingHistory[index].date)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Book Details */}
          <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6 shadow-xl">
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

          {/* Delivery Address */}
          {order.shippingAddress && (
            <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6 shadow-xl">
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

        {/* Right Column */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6 sticky top-4 shadow-xl">
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

          {/* Action Buttons */}
          <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-yellow-400 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                <button 
                  onClick={() => showToast('Cancel order functionality coming soon!', 'info')}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/50 flex items-center justify-center gap-2"
                >
                  <X size={16} />
                  Cancel Order
                </button>
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
              
              <button 
                onClick={() => showToast('Invoice download coming soon!', 'info')}
                className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Download Invoice
              </button>
              
              {order.orderStatus === 'Delivered' && order.book && (
                <button
                  onClick={() => showToast('Review feature coming soon!', 'info')}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50 flex items-center justify-center gap-2"
                >
                  <Star size={16} />
                  Rate & Review
                </button>
              )}
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-2xl p-6 shadow-xl">
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
                onClick={() => showToast('Chat support coming soon!', 'info')}
                className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 text-sm flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} />
                Chat with Support
              </button>
              
              <button 
                onClick={() => showToast('Report issue feature coming soon!', 'info')}
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
  );
};

export default OrderDetailsPage;