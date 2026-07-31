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
      <div className="flex flex-col items-center justify-center py-6 text-zinc-400">
        <Loader size="sm" />
        <p className="text-xs mt-2">Loading order details...</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-4 text-zinc-400 text-xs">
        No items found in your order.
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
    <div className="w-full text-white text-xs">
      {/* Title Header */}
      <div className="text-center mb-2.5">
        <h2 className="text-sm sm:text-base font-bold bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 bg-clip-text text-transparent flex items-center justify-center gap-1.5">
          <span>🧾</span> Order Summary
        </h2>
        <p className="text-[11px] text-zinc-400">Review your item details and delivery address</p>
      </div>

      {/* Delivery Address Compact Summary */}
      <div className="bg-zinc-800/60 border border-zinc-700/80 p-2.5 rounded-xl mb-2.5 flex items-center justify-between">
        <div className="min-w-0 pr-2">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">📦</span>
            <span className="font-bold text-xs text-white">{address.fullName}</span>
            <span className="text-[10px] text-zinc-400">({address.phone})</span>
          </div>
          <p className="text-[11px] text-zinc-300 truncate mt-0.5">
            {address.addressLine1}, {address.locality}, {address.city} - {address.postalCode}
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-yellow-400 hover:text-yellow-300 text-[11px] font-semibold flex-shrink-0 bg-yellow-400/10 px-2 py-1 rounded border border-yellow-400/30 transition-colors"
        >
          ← Change
        </button>
      </div>

      {/* Order Items List - Compact */}
      <div className="mb-2.5">
        <h3 className="font-semibold text-xs text-zinc-300 mb-1.5 flex items-center justify-between">
          <span>📚 Order Items ({items.length})</span>
        </h3>
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700">
          {items.map((b, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 bg-zinc-800/40 border border-zinc-700/50 p-2 rounded-lg"
            >
              <img
                src={b.url}
                alt={b.title}
                className="w-9 h-12 object-cover rounded shadow flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{b.title}</h4>
                <p className="text-[10px] text-zinc-400 truncate">{b.author} • {b.language}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-bold text-green-400">₹{b.price}</p>
                <p className="text-[9px] text-zinc-500 line-through">₹{(b.price || 0) + 50}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price Details Breakdown - Compact */}
      <div className="bg-zinc-950/70 border border-zinc-800 rounded-xl p-2.5 mb-3 space-y-1">
        <div className="flex justify-between text-[11px] text-zinc-400">
          <span>Total Item MRP</span>
          <span className="font-medium text-white">₹{basePrice}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-[11px] text-green-400">
            <span>Special Discount</span>
            <span className="font-medium">-₹{discount}</span>
          </div>
        )}

        <div className="flex justify-between text-[11px] text-zinc-400">
          <span>Delivery Charge</span>
          <span className={`font-medium ${deliveryCharge === 0 ? 'text-green-400' : 'text-white'}`}>
            {deliveryCharge === 0 ? 'FREE ✓' : `₹${deliveryCharge}`}
          </span>
        </div>

        {deliveryCharge > 0 && remainingForFreeDelivery > 0 && (
          <div className="bg-yellow-400/10 border border-yellow-400/20 rounded p-1 text-[10px] text-yellow-300 text-center">
            💡 Add ₹{remainingForFreeDelivery} more for <strong>FREE delivery</strong>
          </div>
        )}

        <div className="border-t border-zinc-800 my-1"></div>

        <div className="flex justify-between items-center pt-0.5">
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-white">Total Amount</span>
            {savingsPercent > 0 && (
              <span className="text-[9px] bg-green-400/20 text-green-300 px-1 py-0.5 rounded font-semibold border border-green-400/30">
                {savingsPercent}% OFF
              </span>
            )}
          </div>
          <span className="text-sm font-bold text-yellow-400">₹{payable}</span>
        </div>
      </div>

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => onNext(orderDetails)}
        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-2 px-4 rounded-xl text-xs shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-1.5 transition-all"
      >
        <span>Proceed to Payment</span>
        <span className="text-xs font-bold">({payable > 0 ? `₹${payable}` : ''})</span>
        <span>→</span>
      </motion.button>

      <p className="text-[9px] text-zinc-500 text-center mt-1.5">
        By continuing, you agree to BookBalcony's Terms of Service & Privacy Policy
      </p>
    </div>
  );
}