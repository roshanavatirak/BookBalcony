

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

export default function Step2_Summary({ address, onBack, onNext, book, isMultiple }) {
  const { id: paramId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (isMultiple && Array.isArray(book)) {
        setItems(book);
        setLoading(false);
      } else if (book && !isMultiple) {
        setItems([book]);
        setLoading(false);
      } else if (paramId) {
        try {
          const res = await axios.get(
            `${API_URL}/get-book-by-id/${paramId}`
          );
          setItems([res.data.data]);
        } catch (error) {
          console.error("Error fetching book:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    loadData();
  }, [book, isMultiple, paramId]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-3xl mx-auto mt-10">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-3xl mx-auto mt-10">
        <p className="text-center text-zinc-600">No items found in your order.</p>
      </div>
    );
  }

  // Pricing calculation
  const basePrice = items.reduce((sum, b) => sum + (b.price || 0), 0);
  let discount = 0;
  if (basePrice > 500) discount = 100;
  else if (basePrice > 300) discount = Math.floor(basePrice * 0.05);
  else if (basePrice <= 200) discount = Math.floor(basePrice * 0.03);

  const discountedTotal = basePrice - discount;
  const deliveryCharge = discountedTotal >= 200 ? 0 : 29;
  const payable = parseFloat((discountedTotal + deliveryCharge).toFixed(2));
  const remainingForFreeDelivery = discountedTotal < 200 ? 200 - discountedTotal : 0;

  const orderDetails = {
    items,
    total: basePrice,
    discount,
    deliveryCharge,
    payable,
    shippingAddress: address
  };

  return (
    <div className="bg-gradient-to-br from-white to-zinc-50 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto mt-10 border border-zinc-200">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mb-4 shadow-lg">
          <span className="text-3xl">🧾</span>
        </div>
        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Order Summary
        </h2>
        <p className="text-zinc-600 text-sm">Review your order before payment</p>
      </div>

      {/* Delivery Address */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 bg-white border-2 border-blue-200 p-6 rounded-xl shadow-sm"
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-lg text-zinc-800 flex items-center gap-2">
            <span>📦</span> Delivering To
          </h3>
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1 transition-colors"
          >
            <span>←</span> Change
          </button>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="font-bold text-zinc-900 mb-1">{address.fullName}</p>
          <p className="text-zinc-700">{address.addressLine1}</p>
          {address.addressLine2 && (
            <p className="text-zinc-600 text-sm">📍 {address.addressLine2}</p>
          )}
          <p className="text-zinc-700">{address.locality}, {address.city}</p>
          <p className="text-zinc-700">{address.state} - {address.postalCode}, {address.country || "India"}</p>
          <p className="text-zinc-600 mt-2 text-sm flex items-center gap-2">
            <span>📞</span> {address.phone}
          </p>
        </div>
      </motion.div>

      {/* Items List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <h3 className="font-bold text-lg text-zinc-800 mb-4 flex items-center gap-2">
          <span>📚</span> Order Items ({items.length})
        </h3>
        <div className="space-y-4">
          {items.map((b, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.01 }}
              className="flex flex-col sm:flex-row gap-4 bg-white border border-zinc-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={b.url}
                alt={b.title}
                className="w-24 h-32 object-cover rounded-lg shadow-md"
              />
              <div className="flex-1">
                <h4 className="text-lg font-bold text-zinc-900 mb-1">{b.title}</h4>
                <p className="text-sm text-zinc-600 mb-2">
                  by {b.author} • {b.language}
                </p>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-zinc-500 line-through">
                    MRP: ₹{(b.price || 0) + 50}
                  </p>
                  <p className="text-lg font-bold text-green-600">₹{b.price}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Price Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-zinc-50 to-white border-2 border-zinc-200 rounded-xl p-6 mb-6"
      >
        <h3 className="font-bold text-lg text-zinc-800 mb-4">Price Details</h3>
        
        <div className="space-y-3 text-zinc-700">
          <div className="flex justify-between">
            <span>Total MRP</span>
            <span className="font-semibold">₹{basePrice}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span className="font-semibold">-₹{discount}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span>Delivery Charges</span>
            <span className={`font-semibold ${deliveryCharge === 0 ? 'text-green-600' : ''}`}>
              {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
            </span>
          </div>
          
          {deliveryCharge > 0 && remainingForFreeDelivery > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              💡 Add ₹{remainingForFreeDelivery} more to get <strong>FREE delivery</strong>
            </div>
          )}
          
          <div className="border-t-2 border-zinc-300 pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-zinc-900">Total Payable</span>
              <span className="text-2xl font-bold text-green-600">₹{payable}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Proceed Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onNext(orderDetails)}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all"
      >
        <span className="text-xl">💳</span>
        <span>Proceed to Payment (₹{payable})</span>
        <span className="text-xl">→</span>
      </motion.button>

      <p className="text-xs text-zinc-500 text-center mt-4">
        By proceeding, you agree to our Terms & Conditions
      </p>
    </div>
  );
}