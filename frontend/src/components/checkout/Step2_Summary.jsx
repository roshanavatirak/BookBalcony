

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Loader from "../Loader/Loader";

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
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 max-w-3xl mx-auto mt-4 sm:mt-10">
        <div className="flex flex-col items-center justify-center py-8 sm:py-12">
          <Loader size="md" />
          <p className="text-zinc-500 text-xs sm:text-base mt-4">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 max-w-3xl mx-auto mt-4 sm:mt-10">
        <p className="text-center text-zinc-500 text-xs sm:text-base">No items found in your order.</p>
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
  const savingsPercent = basePrice > 0 ? Math.round(((basePrice - payable) / basePrice) * 100) : 0;

  const orderDetails = {
    items,
    total: basePrice,
    discount,
    deliveryCharge,
    payable,
    shippingAddress: address
  };

  return (
    <div className="bg-gradient-to-br from-white to-zinc-50 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-3 sm:p-8 max-w-4xl mx-auto mt-3 sm:mt-10 border border-zinc-100 sm:border-zinc-200">
      {/* Header - Compact on mobile */}
      <div className="text-center mb-3 sm:mb-8">
        <div className="inline-flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full mb-2 sm:mb-4 shadow-lg">
          <span className="text-lg sm:text-3xl">🧾</span>
        </div>
        <h2 className="text-lg sm:text-4xl font-bold mb-0.5 sm:mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Order Summary
        </h2>
        <p className="text-zinc-400 text-[11px] sm:text-sm">Review your order before payment</p>
      </div>

      {/* Delivery Address - Compact card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 sm:mb-6 bg-white border border-blue-100 sm:border-2 sm:border-blue-200 p-2.5 sm:p-5 rounded-lg sm:rounded-xl shadow-sm"
      >
        <div className="flex items-center justify-between mb-1.5 sm:mb-3">
          <h3 className="font-semibold text-[13px] sm:text-lg text-zinc-800 flex items-center gap-1 sm:gap-2">
            <span className="text-sm sm:text-base">📦</span> Delivering To
          </h3>
          <button
            onClick={onBack}
            className="text-blue-500 hover:text-blue-700 text-[11px] sm:text-sm font-medium flex items-center gap-0.5 transition-colors"
          >
            ← Change
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-2 sm:p-4 rounded-md sm:rounded-lg">
          <p className="font-semibold text-zinc-900 text-[13px] sm:text-base leading-tight">{address.fullName}</p>
          <p className="text-zinc-600 text-[11px] sm:text-sm mt-0.5 leading-snug">
            {address.addressLine1}
            {address.addressLine2 && <>, {address.addressLine2}</>}
          </p>
          <p className="text-zinc-600 text-[11px] sm:text-sm leading-snug">
            {address.locality}, {address.city}, {address.state} - {address.postalCode}
          </p>
          <p className="text-zinc-500 text-[11px] sm:text-sm mt-1 sm:mt-2 flex items-center gap-1">
            📞 {address.phone}
          </p>
        </div>
      </motion.div>

      {/* Items List - Compact horizontal cards on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-3 sm:mb-6"
      >
        <h3 className="font-semibold text-[13px] sm:text-lg text-zinc-800 mb-2 sm:mb-4 flex items-center gap-1 sm:gap-2">
          <span className="text-sm sm:text-base">📚</span> Order Items ({items.length})
        </h3>
        <div className="space-y-2 sm:space-y-4">
          {items.map((b, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.01 }}
              className="flex flex-row gap-2.5 sm:gap-4 bg-white border border-zinc-100 sm:border-zinc-200 p-2 sm:p-5 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-shadow items-center"
            >
              <img
                src={b.url}
                alt={b.title}
                className="w-14 h-20 sm:w-24 sm:h-32 object-cover rounded-md sm:rounded-lg shadow-sm sm:shadow-md flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-[13px] sm:text-lg font-bold text-zinc-900 leading-tight truncate">{b.title}</h4>
                <p className="text-[11px] sm:text-sm text-zinc-500 mt-0.5">
                  {b.author} • {b.language}
                </p>
                <div className="flex items-center gap-1.5 sm:gap-3 mt-1 sm:mt-2">
                  <p className="text-[11px] sm:text-sm text-zinc-400 line-through">
                    ₹{(b.price || 0) + 50}
                  </p>
                  <p className="text-sm sm:text-lg font-bold text-green-600">₹{b.price}</p>
                  <span className="text-[9px] sm:text-xs bg-green-50 text-green-600 px-1 sm:px-1.5 py-0.5 rounded font-medium">
                    SAVE ₹50
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Price Breakdown - Compact */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-zinc-100 sm:border-2 sm:border-zinc-200 rounded-lg sm:rounded-xl p-3 sm:p-6 mb-3 sm:mb-6"
      >
        <h3 className="font-semibold text-[13px] sm:text-lg text-zinc-800 mb-2 sm:mb-4">Price Details</h3>

        <div className="space-y-1.5 sm:space-y-3 text-zinc-600">
          <div className="flex justify-between text-[12px] sm:text-base">
            <span>Total MRP</span>
            <span className="font-medium text-zinc-800">₹{basePrice}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-[12px] sm:text-base text-green-600">
              <span>Discount</span>
              <span className="font-medium">-₹{discount}</span>
            </div>
          )}

          <div className="flex justify-between text-[12px] sm:text-base">
            <span>Delivery</span>
            <span className={`font-medium ${deliveryCharge === 0 ? 'text-green-600' : 'text-zinc-800'}`}>
              {deliveryCharge === 0 ? 'FREE ✓' : `₹${deliveryCharge}`}
            </span>
          </div>

          {deliveryCharge > 0 && remainingForFreeDelivery > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-md p-1.5 sm:p-3 text-[11px] sm:text-sm text-amber-700">
              💡 Add ₹{remainingForFreeDelivery} more for <strong>FREE delivery</strong>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-dashed border-zinc-200 my-1 sm:my-2"></div>

          <div className="flex justify-between items-center">
            <div>
              <span className="text-[13px] sm:text-lg font-bold text-zinc-900">Total Payable</span>
              {savingsPercent > 0 && (
                <span className="ml-1.5 text-[9px] sm:text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">
                  {savingsPercent}% OFF
                </span>
              )}
            </div>
            <span className="text-lg sm:text-2xl font-bold text-green-600">₹{payable}</span>
          </div>
        </div>
      </motion.div>

      {/* Proceed Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onNext(orderDetails)}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2.5 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl shadow-lg flex items-center justify-center gap-1.5 sm:gap-3 transition-all text-[13px] sm:text-base"
      >
        <span className="text-base sm:text-xl">💳</span>
        <span>Proceed to Payment — ₹{payable}</span>
        <span className="text-base sm:text-xl">→</span>
      </motion.button>

      <p className="text-[10px] sm:text-xs text-zinc-400 text-center mt-2 sm:mt-4">
        By proceeding, you agree to our Terms & Conditions
      </p>
    </div>
  );
}