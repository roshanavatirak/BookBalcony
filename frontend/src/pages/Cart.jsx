import React, { useState, useEffect } from 'react';
import Loader from "../components/Loader/Loader";
import axios from 'axios';
import { FaTrashAlt, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate= useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/v1/get-user-cart", { headers });
      setCart(res.data.data || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
    setLoading(false);
  };

  const removeFromCart = async (bookid) => {
    setRemovingId(bookid);
    try {
      await axios.put(`http://localhost:3000/api/v1/remove-from-cart/${bookid}`, {}, { headers });
      setCart(prev => prev.filter(item => item._id !== bookid));
    } catch (error) {
      alert("Failed to remove item.");
      console.error(error);
    } finally {
      setRemovingId(null);
    }
  };

  const placeOrder = async () => {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  try {
    setPlacingOrder(true);

    const res = await axios.post(
      "http://localhost:3000/api/v1/place-order",
      { order: cart }, // 🔥 This must be an array
      { headers }
    );

    alert(res.data.message || "Order placed!");
    navigate("/profile/orderHistory");
    setCart([]); // clear cart in UI
  } catch (err) {
    console.error("Order failed:", err.response?.data || err.message);
    alert("Order failed: " + (err.response?.data?.message || "Unknown error"));
  } finally {
    setPlacingOrder(false);
  }
};

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    fetchCart();
  }, []);

 const placeOrdernew = () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Navigate to checkout page with all cart items in state
  navigate(`/checkout/cart`, {
    state: {
      cartItems: cart
    },
  });
};

 

 return (
  <div className="bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 min-h-screen p-6 sm:p-10 text-white pb-32">
    {/* Show Loader */}
    {loading ? (
      <div className="w-full h-[70vh] flex items-center justify-center">
        <Loader />
      </div>
    ) : (
      <>
        {/* Heading */}
        <div className="flex justify-between items-center border-b border-zinc-700 pb-4 mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-yellow-400">🛒 Your Cart</h1>
          <span className="text-sm text-zinc-400">{cart.length} item{cart.length !== 1 && 's'}</span>
        </div>

        {/* Empty Cart */}
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[70vh] text-center">
            <FaShoppingCart className="text-7xl text-zinc-500 mb-4" />
            <h1 className="text-4xl font-semibold text-zinc-400 mb-2">Cart is Empty</h1>
            <p className="text-zinc-500 italic">Start adding your favorite books!</p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-6">
              {cart.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-800 border border-zinc-700 rounded-2xl p-4 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center gap-4 w-full">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-24 h-32 object-cover rounded-lg shadow-md"
                    />
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-yellow-300">{item.title}</h2>
                      <p className="text-sm text-zinc-400 mt-1 hidden sm:block">
                        {item.desc.length > 100 ? item.desc.slice(0, 100) + "..." : item.desc}
                      </p>
                      <p className="text-sm text-zinc-400 mt-1 sm:hidden">
                        {item.desc.length > 65 ? item.desc.slice(0, 65) + "..." : item.desc}
                      </p>
                      <p className="text-lg text-yellow-400 mt-2 font-semibold">₹ {item.price}</p>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className={`mt-4 sm:mt-0 sm:ml-4 px-4 py-2 ${
                      removingId === item._id
                        ? "bg-red-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    } text-white rounded-lg flex items-center gap-2 transition duration-300`}
                    disabled={removingId === item._id}
                  >
                    {removingId === item._id ? (
                      <span className="text-sm animate-pulse">Removing...</span>
                    ) : (
                      <>
                        <FaTrashAlt className="text-sm" />
                        Remove
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Fixed Footer Total + Place Order */}
            <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-700 p-4 sm:px-10 flex flex-col sm:flex-row justify-between items-center z-50">
              <h2 className="text-lg sm:text-2xl font-bold text-yellow-300">
                Total Amount: ₹ {totalAmount}
              </h2>
              <button
                onClick={placeOrdernew}
                disabled={placingOrder}
                className="mt-3 sm:mt-0 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition duration-300 disabled:opacity-50"
              >
                {placingOrder ? "Placing Order..." : "Place Your Order"}
              </button>
            </div>
          </>
        )}
      </>
    )}
  </div>
);
}

export default Cart;
