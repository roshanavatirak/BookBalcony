import React, { useEffect, useState } from 'react';
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
  X
} from 'lucide-react';

// Loading Component
const Loader = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
  </div>
);

// Error Component
const ErrorDisplay = ({ error, onRetry }) => (
  <div className="min-h-screen bg-zinc-900/50 rounded-3xl p-8 text-white flex items-center justify-center">
    <div className="text-center max-w-md">
      <AlertTriangle className="text-red-400 text-6xl mb-4 mx-auto" size={64} />
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

// Toast Notification Component
const Toast = ({ message, type, onClose }) => (
  <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all transform ${
    type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'
  } text-white flex items-center gap-3`}>
    <span>{message}</span>
    <button onClick={onClose} className="text-white/70 hover:text-white">
      <X size={16} />
    </button>
  </div>
);

const OrderDetailsPage = () => {
  // Mock orderId for demo - in real app this would come from useParams()
  const orderId = "68bd22af77d201dab3f67d0f";
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Mock API call function
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock order data
      const mockOrder = {
        _id: orderId,
        orderStatus: "Out for Delivery",
        paymentStatus: "Success",
        paymentMethod: "RAZORPAY",
        amountPayable: 599,
        discount: 50,
        handlingFee: 0,
        currentLocation: "Mumbai Distribution Center",
        createdAt: new Date(Date.now() - 2*24*60*60*1000), // 2 days ago
        deliveryDate: new Date(Date.now() + 1*24*60*60*1000), // 1 day from now
        book: {
          _id: "book123",
          title: "The Complete Guide to React Development",
          desc: "Master React development with this comprehensive guide covering hooks, context, performance optimization, and modern best practices. Perfect for both beginners and experienced developers looking to enhance their skills.",
          price: 649,
          author: "John Smith",
          language: "English",
          url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop"
        },
        shippingAddress: {
          fullName: "Rahul Sharma",
          phone: "+91 9876543210",
          addressLine1: "123, Tech Park Avenue",
          addressLine2: "Near IT Hub",
          city: "Nagpur",
          state: "Maharashtra",
          postalCode: "440001",
          country: "India"
        },
        trackingHistory: [
          {
            status: "Order Placed",
            location: "Warehouse",
            date: new Date(Date.now() - 2*24*60*60*1000)
          },
          {
            status: "Out for Delivery",
            location: "Mumbai Distribution Center",
            date: new Date(Date.now() - 1*24*60*60*1000)
          }
        ]
      };

      setOrder(mockOrder);
      
      // Set active step based on order status
      const stepMap = {
        'Order Placed': 0,
        'Out for Delivery': 1,
        'Delivered': 2,
        'Cancelled': -1
      };
      setActiveStep(stepMap[mockOrder.orderStatus] || 0);

    } catch (error) {
      console.error("Failed to fetch order details:", error);
      setError("Failed to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

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

  // Animated circle component for tracking
  const AnimatedCircle = ({ isActive, isCompleted, step }) => (
    <div className="relative">
      <div className={`
        w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-500
        ${isCompleted ? 'bg-green-500 text-white animate-pulse' : 
          isActive ? 'bg-yellow-400 text-black animate-bounce' : 
          'bg-zinc-700 text-zinc-400'}
      `}>
        {trackingSteps[step].icon}
      </div>
      
      {isActive && (
        <div className="absolute inset-0 w-12 h-12 bg-yellow-400 rounded-full animate-ping opacity-30"></div>
      )}
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900/50 rounded-3xl flex items-center justify-center">
        <div className="text-center">
          <Loader />
          <p className="text-zinc-400 mt-4">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return <ErrorDisplay error={error} onRetry={handleRetry} />;
  }

  // Order not found
  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-900/50 rounded-3xl p-8 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Order Not Found</h2>
          <p className="text-zinc-400 mb-6">The requested order could not be found.</p>
          <button 
            onClick={() => window.history.back()}
            className="text-yellow-300 hover:text-yellow-200"
          >
            ← Back to Order History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900/50 rounded-3xl p-4 sm:p-8 text-white shadow-xl border border-zinc-700">
      {/* Toast Notification */}
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
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-yellow-300 hover:text-yellow-200 mb-6 group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={16} />
          Back to Orders
        </button>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-yellow-300 mb-2">Order Details</h1>
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <span>Order ID: {orderId}</span>
              <button 
                onClick={copyOrderId}
                className="text-yellow-300 hover:text-yellow-200 p-1 rounded transition-colors"
                title="Copy Order ID"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
          
          <div className={`px-4 py-2 rounded-lg font-bold text-sm ${
            order.orderStatus === 'Delivered' ? 'bg-green-700 text-green-100' :
            order.orderStatus === 'Out for Delivery' ? 'bg-yellow-600 text-yellow-100' :
            order.orderStatus === 'Cancelled' ? 'bg-red-600 text-red-100' :
            'bg-blue-600 text-blue-100'
          }`}>
            {order.orderStatus}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Tracking */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center gap-3">
              <Truck size={24} />
              Order Tracking
            </h2>
            
            {order.orderStatus === 'Cancelled' ? (
              <div className="text-center py-8">
                <div className="text-red-400 text-6xl mb-4">✕</div>
                <h3 className="text-xl font-bold text-red-400 mb-2">Order Cancelled</h3>
                <p className="text-zinc-400">This order has been cancelled</p>
              </div>
            ) : (
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-6 left-6 right-6 h-1 bg-zinc-700 rounded">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-green-500 rounded transition-all duration-1000"
                    style={{ width: `${(activeStep / (trackingSteps.length - 1)) * 100}%` }}
                  ></div>
                </div>
                
                {/* Steps */}
                <div className="relative flex justify-between">
                  {trackingSteps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center text-center max-w-xs">
                      <AnimatedCircle 
                        isActive={index === activeStep} 
                        isCompleted={index < activeStep} 
                        step={index}
                      />
                      
                      <div className="mt-4">
                        <h3 className={`font-bold text-sm mb-1 ${
                          index <= activeStep ? 'text-yellow-300' : 'text-zinc-400'
                        }`}>
                          {step.title}
                        </h3>
                        <p className="text-xs text-zinc-500 mb-2">{step.description}</p>
                        
                        <div className={`flex items-center justify-center gap-1 text-xs transition-all duration-500 ${
                          index === activeStep ? 'text-yellow-300 animate-pulse' : 
                          index < activeStep ? 'text-green-400' : 'text-zinc-500'
                        }`}>
                          <MapPin size={12} />
                          <span>{step.location}</span>
                        </div>
                        
                        {/* Time stamp */}
                        {order.trackingHistory && order.trackingHistory[index] && (
                          <div className="text-xs text-zinc-600 mt-1">
                            {new Date(order.trackingHistory[index].date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
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
          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-yellow-300 mb-6">Item Details</h2>
            
            <div className="flex gap-6">
              {order.book && (
                <div className="cursor-pointer">
                  <img
                    src={order.book.url || "https://via.placeholder.com/120x160?text=Book"}
                    alt="Book Cover"
                    className="w-32 h-44 object-cover rounded-xl border border-zinc-600 shadow-lg hover:scale-105 transition-transform"
                  />
                </div>
              )}
              
              <div className="flex-1">
                {order.book ? (
                  <h3 className="text-2xl font-bold text-yellow-300 hover:text-yellow-200 mb-3 cursor-pointer">
                    {order.book.title}
                  </h3>
                ) : (
                  <h3 className="text-2xl font-bold text-zinc-400 mb-3">Book Not Available</h3>
                )}
                
                <p className="text-zinc-400 mb-4 leading-relaxed">
                  {order.book?.desc?.slice(0, 200) || "No description available."}
                  {order.book?.desc?.length > 200 && "..."}
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-zinc-500">Author:</span>
                    <div className="font-semibold text-white">{order.book?.author || "Unknown"}</div>
                  </div>
                  <div>
                    <span className="text-zinc-500">Language:</span>
                    <div className="font-semibold text-white">{order.book?.language || "English"}</div>
                  </div>
                </div>
                
                <div className="text-3xl font-bold text-green-400">
                  ₹{order.amountPayable || order.book?.price || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          {order.shippingAddress && (
            <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center gap-3">
                <MapPin size={24} />
                Delivery Address
              </h2>
              
              <div className="bg-zinc-900/50 p-4 rounded-xl">
                <div className="font-bold text-lg text-white mb-2">
                  {order.shippingAddress.fullName}
                </div>
                <div className="text-zinc-400 space-y-1">
                  <div>{order.shippingAddress.addressLine1}</div>
                  {order.shippingAddress.addressLine2 && (
                    <div>{order.shippingAddress.addressLine2}</div>
                  )}
                  <div>
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Phone className="text-yellow-300" size={16} />
                    <span>{order.shippingAddress.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 sticky top-4">
            <h2 className="text-xl font-bold text-yellow-300 mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="text-yellow-300" size={16} />
                <div>
                  <div className="text-zinc-400">Order Date</div>
                  <div className="font-semibold">
                    {new Date(order.createdAt || order.orderDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <Truck className="text-yellow-300" size={16} />
                <div>
                  <div className="text-zinc-400">Expected Delivery</div>
                  <div className="font-semibold">
                    {new Date(order.deliveryDate || new Date(Date.now() + 7*24*60*60*1000)).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <CreditCard className="text-yellow-300" size={16} />
                <div>
                  <div className="text-zinc-400">Payment Method</div>
                  <div className="font-semibold">{order.paymentMethod || 'COD'}</div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-zinc-700 pt-4 mt-6">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-zinc-400">Item Price</span>
                <span>₹{order.book?.price || order.amountPayable || 0}</span>
              </div>
              
              {order.discount > 0 && (
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-zinc-400">Discount</span>
                  <span className="text-green-400">-₹{order.discount}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-zinc-400">Delivery Charges</span>
                <span className="text-green-400">FREE</span>
              </div>
              
              <div className="border-t border-zinc-700 pt-2 mt-2">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-green-400">₹{order.amountPayable || 0}</span>
                </div>
              </div>
            </div>
            
            <div className={`mt-4 p-3 rounded-lg text-sm font-semibold ${
              order.paymentStatus === 'Success' ? 'bg-green-700/30 text-green-300 border border-green-600' :
              order.paymentStatus === 'Pending' ? 'bg-yellow-700/30 text-yellow-300 border border-yellow-600' :
              'bg-red-700/30 text-red-300 border border-red-600'
            }`}>
              Payment Status: {order.paymentStatus || 'Pending'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-yellow-300 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                <button 
                  onClick={() => showToast('Cancel order functionality coming soon!', 'info')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Cancel Order
                </button>
              )}
              
              {order.book && (
                <button
                  onClick={() => showToast('Redirecting to book details...', 'info')}
                  className="block w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-3 px-4 rounded-lg text-center transition-colors"
                >
                  View Book Details
                </button>
              )}
              
              <button 
                onClick={() => showToast('Invoice download coming soon!', 'info')}
                className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Download Invoice
              </button>
              
              {order.orderStatus === 'Delivered' && order.book && (
                <button
                  onClick={() => showToast('Review feature coming soon!', 'info')}
                  className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  <Star size={16} />
                  Rate & Review
                </button>
              )}
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-yellow-300 mb-4">Need Help?</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-zinc-400">
                <Phone className="text-yellow-300" size={16} />
                <div>
                  <div>Customer Support</div>
                  <div className="font-semibold text-white">1800-XXX-XXXX</div>
                </div>
              </div>
              
              <button 
                onClick={() => showToast('Chat support coming soon!', 'info')}
                className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Chat with Support
              </button>
              
              <button 
                onClick={() => showToast('Report issue feature coming soon!', 'info')}
                className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
              >
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