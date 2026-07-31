import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaRupeeSign, FaArrowLeft } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

export default function COD_Page({ orderDetails, onBack, navigate }) {
  const [captcha, setCaptcha] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  const payableAmount = orderDetails?.payable || 0;
  const handlingFee = 9;
  const totalAmount = payableAmount + handlingFee;
  const address = orderDetails?.address || {};
  const items = orderDetails?.items || [];

  useEffect(() => {
    generateCaptcha();
    window.scrollTo(0, 0);
  }, []);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(code);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#18181b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `rgba(234, 179, 8, 0.3)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    ctx.font = "bold 22px monospace";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    for (let i = 0; i < code.length; i++) {
      const angle = (Math.random() - 0.5) * 0.3;
      const x = 15 + i * 22;
      const y = canvas.height / 2;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = `#facc15`;
      ctx.fillText(code[i], 0, 0);
      ctx.restore();
    }

    ctx.strokeStyle = "#3f3f46";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  };

  const buildAddressLine = (address) => {
    const parts = [];
    if (address.addressLine1) {
      parts.push(address.addressLine1);
    } else {
      if (address.houseNumber) parts.push(address.houseNumber);
      if (address.streetName) parts.push(address.streetName);
      if (address.locality) parts.push(address.locality);
    }
    return parts.join(", ") || "Address not provided";
  };

  const handlePlaceOrder = async () => {
    if (userCaptcha.trim().toUpperCase() !== captcha) {
      setError("❌ Incorrect captcha. Please try again.");
      generateCaptcha();
      setUserCaptcha("");
      return;
    }

    const fullName = address.fullName || "Customer Name";
    const phone = address.phone || orderDetails.userPhone || "Phone not provided";
    const addressLine1 = address.addressLine1 || buildAddressLine(address);
    const city = address.city || address.villageOrTown || "City not provided";
    const state = address.state || "State not provided";
    const postalCode = address.postalCode || address.pincode || "000000";

    if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
      setError("❌ Address information is incomplete. Please update your address details.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const orderResponse = await axios.post(
        `${API_URL}/place-order`,
        {
          order: items.map(book => ({
            book: book._id,
            seller: book.seller,
            paymentStatus: "Pending",
            orderStatus: "Order Placed",
            paymentMethod: "COD",
          })),
          shippingAddress: {
            fullName: fullName,
            phone: phone,
            addressLine1: addressLine1,
            addressLine2: address.addressLine2 || address.landmark || "",
            city: city,
            state: state,
            postalCode: postalCode,
            country: address.country || "India",
          },
          amountPayable: totalAmount,
          discount: orderDetails.discountApplied || 0,
          handlingFee: handlingFee || 0,
        },
        {
          headers: {
            id: localStorage.getItem("id"),
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (orderResponse.status === 200 || orderResponse.status === 201) {
        setShowPopup(true);

        setTimeout(() => {
          if (navigate) {
            navigate("/profile/orderHistory");
          } else {
            window.location.href = "/profile/orderHistory";
          }
        }, 4000);
      } else {
        throw new Error("Failed to place order");
      }

    } catch (err) {
      console.error("COD Order placement failed:", err);
      if (err.response?.data?.message) {
        setError(`❌ ${err.response.data.message}`);
      } else if (err.response?.data?.errors) {
        setError(`❌ ${err.response.data.errors.join(", ")}`);
      } else {
        setError("❌ Failed to place order. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full text-white text-xs relative">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 text-xs font-semibold mb-2 transition-colors"
      >
        <FaArrowLeft size={10} />
        <span>Back to Payment Options</span>
      </button>

      <h2 className="text-sm sm:text-base font-bold bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 bg-clip-text text-transparent text-center mb-2.5">
        🏠 Cash on Delivery Confirmation
      </h2>

      {/* Order Summary & Address Dual Box Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2.5">
        {/* Order Items & Total Box */}
        <div className="bg-zinc-800/40 border border-zinc-700/50 p-2.5 rounded-xl">
          <h3 className="font-semibold text-xs text-yellow-300 mb-1.5 flex items-center justify-between">
            <span>📋 Order Summary</span>
            <span className="text-[10px] text-zinc-400">({items.length} items)</span>
          </h3>
          <div className="space-y-1 mb-2 max-h-24 overflow-y-auto pr-1">
            {items.map((book, idx) => (
              <div key={idx} className="flex justify-between items-center text-[11px]">
                <span className="text-zinc-300 truncate mr-2">{book.title}</span>
                <span className="text-white font-semibold">₹{book.price}</span>
              </div>
            ))}
          </div>

          <div className="pt-1.5 border-t border-zinc-700/60 text-[11px] space-y-0.5">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal</span>
              <span>₹{orderDetails.payable}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Handling Fee</span>
              <span>₹{handlingFee}</span>
            </div>
            <div className="flex justify-between font-bold text-xs pt-0.5 border-t border-zinc-800 text-yellow-400">
              <span>Total Payable on Delivery</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address Box */}
        <div className="bg-zinc-800/40 border border-zinc-700/50 p-2.5 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-xs text-yellow-300 mb-1">🚚 Delivery Address</h3>
            <div className="text-[11px] text-zinc-300 space-y-0.5 leading-snug">
              <p className="font-bold text-white text-xs">{address.fullName || "Customer Name"}</p>
              <p className="truncate">{buildAddressLine(address)}</p>
              <p>{address.city || address.villageOrTown}, {address.state} - {address.postalCode || address.pincode}</p>
              <p className="text-zinc-400">📞 {address.phone || orderDetails.userPhone}</p>
            </div>
          </div>

          <div className="mt-2 bg-yellow-400/10 border border-yellow-400/20 p-1.5 rounded text-[10px] text-yellow-300">
            💡 Pay <strong>₹{totalAmount}</strong> in cash or UPI to the delivery executive upon arrival.
          </div>
        </div>
      </div>

      {/* Security Verification Captcha Section */}
      <div className="bg-zinc-950/70 border border-zinc-800 p-2.5 rounded-xl mb-2.5">
        <h3 className="font-semibold text-xs text-zinc-300 mb-1.5 text-center">🔐 Security Captcha Verification</h3>
        <div className="flex items-center justify-center gap-2">
          <canvas
            ref={canvasRef}
            width="150"
            height="40"
            className="border border-zinc-700 rounded-lg bg-zinc-900 shadow-inner w-[130px] h-[36px]"
          ></canvas>
          <button
            onClick={generateCaptcha}
            className="bg-zinc-800 hover:bg-zinc-700 text-yellow-400 border border-zinc-700 px-2 py-1.5 rounded-lg text-[11px] transition-colors"
          >
            🔄 Refresh
          </button>
          <input
            type="text"
            placeholder="Enter code"
            value={userCaptcha}
            onChange={(e) => {
              setUserCaptcha(e.target.value);
              setError("");
            }}
            className="w-28 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-center font-mono text-xs uppercase text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none"
            maxLength="6"
          />
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-2.5 py-1.5 rounded-lg mb-2 text-[11px] text-center font-semibold">
          {error}
        </div>
      )}

      {/* Confirm & Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={isLoading || userCaptcha.length !== 6}
        className={`w-full py-2 px-4 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 ${
          isLoading || userCaptcha.length !== 6
            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
            : "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black shadow-yellow-500/20"
        }`}
      >
        {isLoading ? (
          <span className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            <span>Placing COD Order...</span>
          </span>
        ) : (
          "✅ Confirm & Place Order"
        )}
      </button>

      {/* Success Modal Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
          <div className="bg-zinc-900 border border-green-500/40 rounded-2xl shadow-2xl max-w-xs w-full text-center p-5 text-white">
            <div className="w-10 h-10 bg-green-500/20 border border-green-500/40 rounded-full flex items-center justify-center mx-auto mb-2 text-green-400 text-lg font-bold">
              ✓
            </div>
            <h2 className="text-sm font-bold text-green-400 mb-1">🎉 Order Placed Successfully!</h2>
            <p className="text-xs text-zinc-300 mb-2">Total Payable: <strong className="text-yellow-400">₹{totalAmount}</strong></p>
            <p className="text-[10px] text-zinc-400 mb-3">Redirecting to your Order History in 4s...</p>
            <div className="w-full bg-zinc-800 rounded-full h-1">
              <div className="bg-green-400 h-1 rounded-full animate-pulse" style={{ width: "100%" }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}