import { useState, useEffect } from "react";
import axios from "axios";
import { Package, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";

export default function SellerOrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchOrders();
    fetchStats();
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

      const response = await axios.get(
        `http://localhost:3000/api/v1/seller/orders?${queryParams}`,
        {
          headers: {
            id: localStorage.getItem("id"),
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setOrders(response.data.data.orders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/seller/dashboard-stats",
        {
          headers: {
            id: localStorage.getItem("id"),
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setStats(response.data.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3000/api/v1/seller/order/${orderId}/status`,
        { orderStatus: newStatus },
        {
          headers: {
            id: localStorage.getItem("id"),
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert(`Order status updated to: ${newStatus}`);
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error("Failed to update order:", error);
      alert("Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      "Order Placed": "bg-blue-100 text-blue-800",
      "Processing": "bg-yellow-100 text-yellow-800",
      "Shipped": "bg-purple-100 text-purple-800",
      "Out for Delivery": "bg-orange-100 text-orange-800",
      "Delivered": "bg-green-100 text-green-800",
      "Cancelled": "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusColor = (status) => {
    return status === "Success" 
      ? "text-green-600" 
      : status === "Pending" 
      ? "text-yellow-600" 
      : "text-red-600";
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
          <p className="text-gray-600">Manage your orders and track sales</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{stats.overview.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Payments</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    ₹{stats.overview.pendingRevenue.toLocaleString()}
                  </p>
                </div>
                <Clock className="w-10 h-10 text-yellow-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.overview.totalOrders}
                  </p>
                </div>
                <Package className="w-10 h-10 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">COD Orders</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.overview.codOrders}
                  </p>
                </div>
                <CheckCircle className="w-10 h-10 text-purple-600" />
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b overflow-x-auto">
            {["all", "Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilterStatus(status);
                  setCurrentPage(1);
                }}
                className={`px-6 py-3 font-medium whitespace-nowrap ${
                  filterStatus === status
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {status === "all" ? "All Orders" : status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No orders found
            </div>
          ) : (
            <div className="divide-y">
              {orders.map((order) => (
                <div key={order._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <img
                        src={order.book?.url || "/placeholder.jpg"}
                        alt={order.book?.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {order.book?.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Order ID: {order._id}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                          <span className={`text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentMethod} - {order.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ₹{order.amountPayable}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold">Order Details</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                {/* Book Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Book Information</h3>
                  <div className="flex gap-4">
                    <img
                      src={selectedOrder.book?.url}
                      alt={selectedOrder.book?.title}
                      className="w-20 h-28 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{selectedOrder.book?.title}</p>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.book?.author}
                      </p>
                      <p className="text-sm text-gray-600">
                        Language: {selectedOrder.book?.language}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Payment Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Amount</p>
                      <p className="font-medium">₹{selectedOrder.amountPayable}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Payment Method</p>
                      <p className="font-medium">{selectedOrder.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Payment Status</p>
                      <p className={`font-medium ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                        {selectedOrder.paymentStatus}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Order Date</p>
                      <p className="font-medium">
                        {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">Name</p>
                      <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Phone</p>
                      <p className="font-medium">{selectedOrder.shippingAddress.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-medium">{selectedOrder.user?.email || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Delivery Address</h3>
                  <p className="text-sm">
                    {selectedOrder.shippingAddress.addressLine1}
                    {selectedOrder.shippingAddress.addressLine2 && `, ${selectedOrder.shippingAddress.addressLine2}`}
                    <br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.postalCode}
                    <br />
                    {selectedOrder.shippingAddress.country}
                  </p>
                </div>

                {/* Delivery Timeline */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Delivery Timeline</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Expected Delivery</p>
                      <p className="font-medium">
                        {selectedOrder.expectedDeliveryDate 
                          ? new Date(selectedOrder.expectedDeliveryDate).toLocaleDateString()
                          : "Not set"}
                      </p>
                    </div>
                    {selectedOrder.actualDeliveryDate && (
                      <div>
                        <p className="text-gray-600">Actual Delivery</p>
                        <p className="font-medium text-green-600">
                          {new Date(selectedOrder.actualDeliveryDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Update Order Status */}
                <div className="mb-4">
                  <h3 className="font-semibold mb-3">Update Order Status</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["Processing", "Shipped", "Out for Delivery", "Delivered"].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder._id, status)}
                        disabled={selectedOrder.orderStatus === status}
                        className={`px-4 py-2 rounded text-sm font-medium ${
                          selectedOrder.orderStatus === status
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        Mark as {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tracking History */}
                {selectedOrder.trackingHistory && selectedOrder.trackingHistory.length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-3">Tracking History</h3>
                    <div className="space-y-3">
                      {selectedOrder.trackingHistory.map((track, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                            {index !== selectedOrder.trackingHistory.length - 1 && (
                              <div className="w-0.5 h-full bg-blue-200 mt-1"></div>
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <p className="font-medium text-sm">{track.status}</p>
                            <p className="text-xs text-gray-600">{track.location}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(track.date).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}