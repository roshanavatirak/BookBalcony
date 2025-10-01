import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Step2_Summary({ address, onBack, onNext, book, isMultiple }) {
  const { id: paramId } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (isMultiple && Array.isArray(book)) {
        // Multiple checkout - data already passed
        setItems(book);
        setLoading(false);
      } else if (book && !isMultiple) {
        // Single checkout - data already passed
        setItems([book]);
        setLoading(false);
      } else if (paramId) {
        // Fetch single book from API using URL id
        try {
          const res = await axios.get(
            `http://localhost:3000/api/v1/get-book-by-id/${paramId}`
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

  if (loading) return <div>Loading book details...</div>;
  if (!items || items.length === 0) return <div>No books found.</div>;

  // Pricing calculation for single/multiple
  const basePrice = items.reduce((sum, b) => sum + (b.price || 0), 0);

  let discount = 0;
  if (basePrice > 500) discount = 100;
  else if (basePrice > 300) discount = basePrice * 0.05;
  else if (basePrice <= 200) discount = basePrice * 0.03;
  discount = Math.floor(discount);

  const discountedTotal = basePrice - discount;
  const deliveryCharge = discountedTotal >= 200 ? 0 : 29;
  const payable = parseFloat((discountedTotal + deliveryCharge).toFixed(2));

  const remainingForFreeDelivery =
    discountedTotal < 200 ? 200 - discountedTotal : 0;

  const orderDetails = {
    items,
    total: basePrice,
    discount,
    deliveryCharge,
    payable,
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 text-black max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">🧾 Order Summary</h2>

      {/* Address */}
      <div className="mb-6 border border-zinc-300 p-4 rounded-xl bg-zinc-50">
        <h3 className="font-semibold mb-2 text-gray-800">📦 Deliver To</h3>
        <p>{address.name}</p>
        <p>{address.address}, {address.city} - {address.pincode}</p>
        <button
          onClick={onBack}
          className="mt-2 text-blue-600 hover:underline text-sm"
        >
          ← Edit Address
        </button>
      </div>

      {/* Items List */}
      <div className="mb-6 space-y-4">
        {items.map((b, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row gap-4 border border-zinc-300 p-4 rounded-xl bg-zinc-100"
          >
            <img
              src={b.url}
              alt={b.title}
              className="w-28 h-40 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-black">{b.title}</h3>
              <p className="text-sm text-gray-600 mb-1">
                by {b.author} · {b.language}
              </p>
              <p className="text-sm text-gray-700 line-through">MRP: ₹{(b.price || 0) + 50}</p>
              <p className="text-gray-800 font-semibold">Price: ₹{b.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Breakdown */}
      <div className="border-t pt-4 text-right space-y-1 text-sm sm:text-base">
        <p>Total MRP: ₹{basePrice}</p>
        {discount > 0 && <p className="text-green-600">Discount: -₹{discount}</p>}
        <p>Delivery: {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}</p>
        <hr className="my-2" />
        <p className="text-xl font-bold text-black">
          Total Payable: ₹{payable}
        </p>
        {deliveryCharge > 0 && (
          <p className="text-xs text-gray-600">
            Add ₹{remainingForFreeDelivery} more for Free Delivery
          </p>
        )}
      </div>

      <button
        onClick={() => onNext(orderDetails)}
        className="mt-6 w-full bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-300 transition"
      >
        Proceed to Payment →
      </button>
    </div>
  );
}
