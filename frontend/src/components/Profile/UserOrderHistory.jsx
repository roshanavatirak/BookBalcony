import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Loader from '../Loader/Loader';
import { Link } from 'react-router-dom';
import { FaBookOpen } from "react-icons/fa";
import { FaShoppingBag } from 'react-icons/fa';

const UserOrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState(null);
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/get-order-history",
          { headers }
        );
        setOrderHistory(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch order history", error);
        setOrderHistory([]);
      }
    };
    fetch();
  }, []);

  if (!orderHistory) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900/50 rounded-3xl p-4 sm:p-8 text-white shadow-xl border border-zinc-700">
   <div className="mb-10 text-center">
  <h1 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-300 to-yellow-500 drop-shadow-lg flex justify-center items-center gap-3">
    <FaShoppingBag className="text-yellow-300 sm:text-5xl text-3xl " />
    Your Orders
  </h1>
  <p className="mt-2 text-sm sm:text-base text-zinc-300 italic tracking-wide">
    Easily track order status, payments & book details at a glance.
  </p>
</div>


      {orderHistory.length === 0 ? (
        <div className="h-[60vh] flex flex-col items-center justify-center text-center">
          <FaBookOpen className="text-7xl text-zinc-500 mb-4" />
          <h1 className="text-3xl font-semibold text-zinc-400 mb-2">No Order History</h1>
          <p className="text-zinc-500 italic">Place an order to see it here!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
  {orderHistory.map((order, index) => {
    const deliveryDate = new Date(order.createdAt);
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    const deliveryLabel = deliveryDate.toLocaleDateString('en-IN', options);

    return (
      <div
        key={order._id}
        className="relative bg-zinc-800 border border-zinc-700 rounded-2xl shadow-lg hover:shadow-yellow-300/10 transition-all p-5 flex flex-col"
      >
        {/* Delivery ETA Badge */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-300 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md">
          Delivery by {deliveryLabel}
        </div>

        {/* Top: Book Image + Serial No */}
        <Link to={`/view-book-details/${order.book?._id}`}>
          <div className="flex items-center gap-4 mb-4">
            <img
              src={order.book?.url || "https://via.placeholder.com/80x100?text=Book"}
              alt="Book Cover"
              className="w-20 h-28 object-cover rounded-md border border-zinc-700"
            />
            <div className="text-sm text-zinc-400 font-semibold">Sr. No: #{index + 1}</div>
          </div>

          {/* Book Info */}
          <div className="flex flex-col gap-1 mb-4">
            <h2 className="text-xl font-semibold text-yellow-300">
              {order.book?.title || "Unknown Title"}
            </h2>
            <p className="text-sm text-zinc-400 line-clamp-2">
              {order.book?.desc?.slice(0, 120) || "No description available."}
            </p>
          </div>
        </Link>

        {/* Price + Payment + Status */}
        <div className="flex flex-col gap-2 text-sm text-zinc-300 mb-4">
          <div>
            <span className="font-medium text-green-400">Price:</span> ₹{order.book?.price}
          </div>
          <div>
            <span className="font-medium text-blue-400">Payment Mode:</span>{" "}
            {order.paymentStatus || "Online"}
          </div>
          <div>
            <span className="font-medium">Status:</span>{" "}
            <span
              className={`px-3 py-1 ml-1 rounded-full text-xs font-bold ${
                order.orderStatus === "Delivered"
                  ? "bg-green-700 text-green-100"
                  : order.orderStatus === "Out for delivery"
                  ? "bg-yellow-600 text-yellow-100"
                  : order.orderStatus === "Canceled"
                  ? "bg-red-600 text-red-100"
                  : "bg-blue-600 text-blue-100"
              }`}
            >
              {order.orderStatus}
            </span>
          </div>
          <div>
            <span className="text-zinc-500">Ordered on:</span>{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* View More Button */}
        <Link
          to={`/view/book/details/${order.book?._id}`}
          className="mt-auto text-center bg-yellow-400 text-black font-semibold py-2 rounded-lg hover:bg-yellow-300 transition"
        >
          View More
        </Link>
      </div>
    );
  })}
</div>

      )}
    </div>
  );
};

export default UserOrderHistory;
