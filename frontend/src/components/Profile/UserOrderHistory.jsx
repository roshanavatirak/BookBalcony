import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Loader from '../Loader/Loader';
import { Link } from 'react-router-dom';
import { FaBookOpen, FaShoppingBag, FaTruck, FaBox, FaCheckCircle, FaClock, FaEye } from "react-icons/fa";

const UserOrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState(null);
  const [groupedOrders, setGroupedOrders] = useState({});
  const [viewMode, setViewMode] = useState('individual'); // 'individual' or 'grouped'
  
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/get-order-history",
          { headers }
        );
        const orders = response.data.data || [];
        setOrderHistory(orders);
        
        // Group orders by date and payment method for cart-like display
        const grouped = orders.reduce((acc, order) => {
          const dateKey = new Date(order.createdAt).toDateString();
          const key = `${dateKey}_${order.paymentMethod}`;
          
          if (!acc[key]) {
            acc[key] = {
              date: order.createdAt,
              paymentMethod: order.paymentMethod,
              paymentStatus: order.paymentStatus,
              orders: [],
              totalAmount: 0
            };
          }
          
          acc[key].orders.push(order);
          acc[key].totalAmount += order.amountPayable || order.book?.price || 0;
          return acc;
        }, {});
        
        setGroupedOrders(grouped);
      } catch (error) {
        console.error("Failed to fetch order history", error);
        setOrderHistory([]);
      }
    };
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Order Placed': return <FaBox className="text-blue-400" />;
      case 'Out for Delivery': return <FaTruck className="text-yellow-400" />;
      case 'Delivered': return <FaCheckCircle className="text-green-400" />;
      case 'Cancelled': return <FaClock className="text-red-400" />;
      default: return <FaBox className="text-blue-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-700 text-green-100';
      case 'Out for Delivery': return 'bg-yellow-600 text-yellow-100';
      case 'Cancelled': return 'bg-red-600 text-red-100';
      default: return 'bg-blue-600 text-blue-100';
    }
  };

  const renderIndividualOrders = () => (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {orderHistory.map((order, index) => {
        const deliveryDate = new Date(order.deliveryDate || order.createdAt);
        if (!order.deliveryDate) {
          deliveryDate.setDate(deliveryDate.getDate() + 7);
        }
        const options = { weekday: 'long', day: 'numeric', month: 'short' };
        const deliveryLabel = deliveryDate.toLocaleDateString('en-IN', options);

        return (
          <div
            key={order._id}
            className="relative bg-zinc-800 border border-zinc-700 rounded-2xl shadow-lg hover:shadow-yellow-300/10 transition-all duration-300 p-6 flex flex-col group hover:scale-[1.02]"
          >
            {/* Status Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-zinc-900/80 px-3 py-1 rounded-full">
              {getStatusIcon(order.orderStatus)}
              <span className="text-xs font-semibold text-zinc-200">
                {order.orderStatus}
              </span>
            </div>

            {/* Delivery ETA */}
            <div className="mb-4">
              <div className="bg-gradient-to-r from-yellow-400/20 to-orange-300/20 border border-yellow-400/30 text-yellow-300 text-xs font-bold px-3 py-2 rounded-lg">
                📦 Expected delivery: {deliveryLabel}
              </div>
            </div>

            {/* Book Image and Info */}
            <Link to={`/view-book-details/${order.book?._id}`} className="mb-4">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img
                    src={order.book?.url || "https://via.placeholder.com/80x120?text=Book"}
                    alt="Book Cover"
                    className="w-20 h-28 object-cover rounded-lg border border-zinc-600 shadow-md"
                  />
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-yellow-300 mb-2 line-clamp-2 group-hover:text-yellow-200 transition-colors">
                    {order.book?.title || "Unknown Title"}
                  </h3>
                  <p className="text-sm text-zinc-400 line-clamp-2 mb-2">
                    {order.book?.desc?.slice(0, 100) || "No description available."}
                  </p>
                  <div className="text-lg font-bold text-green-400">
                    ₹{order.amountPayable || order.book?.price}
                  </div>
                </div>
              </div>
            </Link>

            {/* Order Details Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div className="bg-zinc-900/50 p-3 rounded-lg">
                <span className="text-zinc-500 block mb-1">Payment</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  order.paymentMethod === "COD" ? "bg-yellow-700 text-yellow-100" : "bg-purple-700 text-purple-100"
                }`}>
                  {order.paymentMethod || "Unknown"}
                </span>
              </div>
              
              <div className="bg-zinc-900/50 p-3 rounded-lg">
                <span className="text-zinc-500 block mb-1">Status</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  order.paymentStatus === "Success" ? "bg-green-700 text-green-100" :
                  order.paymentStatus === "Pending" ? "bg-yellow-700 text-yellow-100" : "bg-red-700 text-red-100"
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            <div className="text-xs text-zinc-500 mb-4">
              Ordered on: {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                day: 'numeric', month: 'short', year: 'numeric' 
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-auto">
              <Link
                to={`/profile/orderHistory/order-details/${order._id}`}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-300 text-black font-bold py-2 px-4 rounded-lg hover:from-yellow-300 hover:to-orange-200 transition duration-300 text-center flex items-center justify-center gap-2"
              >
                <FaEye className="text-sm" />
                View Details
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderGroupedOrders = () => (
    <div className="space-y-8">
      {Object.entries(groupedOrders).map(([key, group]) => (
        <div key={key} className="bg-zinc-800 border border-zinc-700 rounded-2xl p-6 shadow-lg">
          {/* Group Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-700">
            <div>
              <h3 className="text-xl font-bold text-yellow-300">
                Order placed on {new Date(group.date).toLocaleDateString('en-IN', { 
                  day: 'numeric', month: 'long', year: 'numeric' 
                })}
              </h3>
              <p className="text-zinc-400 text-sm mt-1">
                {group.orders.length} item{group.orders.length > 1 ? 's' : ''} • Total: ₹{group.totalAmount}
              </p>
            </div>
            <div className="text-right">
              <div className={`px-3 py-1 rounded-lg text-sm font-bold ${
                group.paymentMethod === "COD" ? "bg-yellow-700 text-yellow-100" : "bg-purple-700 text-purple-100"
              }`}>
                {group.paymentMethod}
              </div>
              <div className={`px-3 py-1 rounded-lg text-sm font-bold mt-2 ${
                group.paymentStatus === "Success" ? "bg-green-700 text-green-100" :
                group.paymentStatus === "Pending" ? "bg-yellow-700 text-yellow-100" : "bg-red-700 text-red-100"
              }`}>
                {group.paymentStatus}
              </div>
            </div>
          </div>

          {/* Group Items */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {group.orders.map((order) => (
              <div key={order._id} className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-600 hover:border-yellow-400/50 transition-all">
                <Link to={`/view-book-details/${order.book?._id}`} className="block mb-3">
                  <div className="flex gap-3">
                    <img
                      src={order.book?.url || "https://via.placeholder.com/60x80?text=Book"}
                      alt="Book Cover"
                      className="w-12 h-16 object-cover rounded border border-zinc-700"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-yellow-300 text-sm line-clamp-2 mb-1">
                        {order.book?.title || "Unknown Title"}
                      </h4>
                      <div className="text-green-400 font-bold">
                        ₹{order.amountPayable || order.book?.price}
                      </div>
                    </div>
                  </div>
                </Link>
                
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                  <Link
                    to={`order-details/${order._id}`}
                    className="text-yellow-300 hover:text-yellow-200 text-sm font-medium"
                  >
                    Track →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  if (!orderHistory) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900/50 rounded-3xl p-4 sm:p-8 text-white shadow-xl border border-zinc-700">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-300 to-yellow-500 drop-shadow-lg flex justify-center items-center gap-3 mb-4">
          <FaShoppingBag className="text-yellow-300 sm:text-5xl text-3xl" />
          Your Orders
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 italic tracking-wide mb-6">
          Track your orders, manage returns & view purchase history
        </p>
        
        {/* View Toggle */}
        {orderHistory.length > 0 && (
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => setViewMode('individual')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                viewMode === 'individual' 
                  ? 'bg-yellow-400 text-black' 
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              Individual Orders
            </button>
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                viewMode === 'grouped' 
                  ? 'bg-yellow-400 text-black' 
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              Grouped Orders
            </button>
          </div>
        )}
      </div>

      {orderHistory.length === 0 ? (
        <div className="h-[60vh] flex flex-col items-center justify-center text-center">
          <div className="bg-zinc-800 p-8 rounded-full mb-6">
            <FaBookOpen className="text-6xl text-zinc-500" />
          </div>
          <h2 className="text-3xl font-bold text-zinc-400 mb-4">No Orders Yet</h2>
          <p className="text-zinc-500 text-lg mb-6">Start shopping to see your orders here!</p>
          <Link 
            to="/all-books" 
            className="bg-gradient-to-r from-yellow-400 to-orange-300 text-black font-bold py-3 px-8 rounded-lg hover:from-yellow-300 hover:to-orange-200 transition duration-300"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <>
          {viewMode === 'individual' ? renderIndividualOrders() : renderGroupedOrders()}
        </>
      )}
    </div>
  );
};

export default UserOrderHistory;