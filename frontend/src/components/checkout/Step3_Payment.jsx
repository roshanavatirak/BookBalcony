import { useEffect, useState } from "react";
import axios from "axios";
import { FaRupeeSign, FaMoneyBillAlt, FaUserShield } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { MdDiscount } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import COD_Page from "./COD_Page";
import Alert from "../Alert/Alert";
import { useAlert } from "../Alert/useAlert";


const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

export default function Step3_Payment({ address, order, onBack }) {
  const { alert: alertData, hideAlert, success, error, warning } = useAlert();
  const isPremium = localStorage.getItem("isPremiumUser") === "true";
  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [discountApplied, setDiscountApplied] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showCODPage, setShowCODPage] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [booksWithSellers, setBooksWithSellers] = useState([]);
  const [pricingPreview, setPricingPreview] = useState([]);
  const navigate = useNavigate();


  const validCoupons = ["SAVE10A", "BOOK5X1", "OFFER77B"];

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBookDetails();
  }, []);

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (booksWithSellers.length > 0) {
      const preview = calculateProportionalPricing(
        booksWithSellers,
        discountApplied,
        0
      );
      setPricingPreview(preview);
    } else if (order.items.length > 0) {
      const preview = calculateProportionalPricing(
        order.items,
        discountApplied,
        0
      );
      setPricingPreview(preview);
    }
  }, [booksWithSellers, order.items, discountApplied]);

  const calculateProportionalPricing = (books, totalDiscount, deliveryCharge) => {
    const totalBasePrice = books.reduce((sum, book) => sum + (book.price || 0), 0);
    if (totalBasePrice === 0) {
      return books.map(book => ({
        book, originalPrice: 0, priceShare: 0,
        discount: 0, deliveryCharge: 0, amountPayable: 0
      }));
    }
    
    const pricingDetails = books.map((book) => {
      const bookPrice = book.price || 0;
      const priceShare = bookPrice / totalBasePrice;
      const bookDiscount = Math.round(totalDiscount * priceShare);
      const bookDeliveryCharge = Math.round(deliveryCharge * priceShare);
      const amountPayable = bookPrice - bookDiscount + bookDeliveryCharge;
      
      return {
        book, 
        originalPrice: bookPrice, 
        priceShare,
        discount: bookDiscount, 
        deliveryCharge: bookDeliveryCharge,
        amountPayable: Math.max(0, amountPayable)
      };
    });
    
    const calculatedTotal = pricingDetails.reduce((sum, item) => sum + item.amountPayable, 0);
    const expectedTotal = totalBasePrice - totalDiscount + deliveryCharge;
    
    if (calculatedTotal !== expectedTotal && pricingDetails.length > 0) {
      const difference = expectedTotal - calculatedTotal;
      pricingDetails[pricingDetails.length - 1].amountPayable += difference;
    }
    
    return pricingDetails;
  };

  const fetchBookDetails = async () => {
    try {
      const bookIds = order.items.map(item => item._id);
      const bookDetailsPromises = bookIds.map(id =>
        axios.get(`${API_URL}/get-book-by-id/${id}`, {
          headers: {
            id: localStorage.getItem("id"),
            authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        })
      );
      
      const responses = await Promise.all(bookDetailsPromises);
      const completeBooks = responses.map(res => res.data.data);
      setBooksWithSellers(completeBooks);
    } catch (err) {
      console.error("❌ [FETCH] Error:", err);
      setBooksWithSellers(order.items);
    }
  };

  const applyCoupon = () => {
    if (validCoupons.includes(coupon.trim().toUpperCase())) {
      setDiscountApplied(50);
      setCouponMessage("✅ Coupon applied! ₹50 off.");
    } else {
      setDiscountApplied(0);
      setCouponMessage("❌ Invalid coupon.");
    }
  };

  const validateAndFormatAddress = (address) => {
    const formatAddress = {
      fullName: address.fullName || address.name || "",
      phone: address.phone || "",
      addressLine1: address.addressLine1 || address.address || "",
      addressLine2: address.addressLine2 || address.landmark || "",
      city: address.city || address.villageOrTown || "",
      state: address.state || "",
      postalCode: address.postalCode || address.pincode || "",
      country: address.country || "India",
    };

    const missingFields = [];
    if (!formatAddress.fullName) missingFields.push("Full Name");
    if (!formatAddress.phone) missingFields.push("Phone");
    if (!formatAddress.addressLine1) missingFields.push("Address");
    if (!formatAddress.city) missingFields.push("City");
    if (!formatAddress.state) missingFields.push("State");
    if (!formatAddress.postalCode) missingFields.push("Postal Code");

    return { formatAddress, missingFields };
  };

  const handleOnlinePayment = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const { formatAddress, missingFields } = validateAndFormatAddress(address);
      
      if (missingFields.length > 0) {
        warning(`Missing: ${missingFields.join(", ")}`, "Incomplete Address");
        setIsProcessing(false);
        return;
      }

      if (!window.Razorpay) {
        error("Razorpay SDK not loaded. Please refresh page.", "Payment Error");
        setIsProcessing(false);
        return;
      }

      const booksToUse = booksWithSellers.length > 0 ? booksWithSellers : order.items;
      
      const booksWithoutSeller = booksToUse.filter(book => !book.seller && !book.addedby);
      if (booksWithoutSeller.length > 0) {
        error("Some books are missing seller information. Contact support.", "Order Error");
        setIsProcessing(false);
        return;
      }

      const finalAmount = order.payable - discountApplied;
      
      const { data } = await axios.post(`${API_URL}/payment/order`, {
        amount: finalAmount,
      });

      const options = {
        key: "rzp_test_NBQpcL6r3o5ntb",
        amount: data.order.amount,
        currency: "INR",
        name: "BookBalcony",
        description: `Payment for ${booksToUse.map(i => i.title).join(", ")}`,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            const pricingDetails = calculateProportionalPricing(
              booksToUse,
              discountApplied,
              0
            );
            
            const orderDataArray = pricingDetails.map((item) => {
              const { book, originalPrice, discount, amountPayable } = item;
              const sellerValue = book.seller || book.addedby;
              
              if (!sellerValue) {
                throw new Error(`Book "${book.title}" missing seller`);
              }
              
              return {
                user: localStorage.getItem("id"),
                book: book._id,
                seller: sellerValue,
                paymentMethod: "RAZORPAY",
                paymentStatus: "Success",
                orderStatus: "Order Placed",
                originalPrice: originalPrice,
                discount: discount,
                amountPayable: amountPayable,
                shippingAddress: formatAddress,
              };
            });
            
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: finalAmount,
              receipt: data.order.receipt,
              orderData: booksToUse.length === 1 ? orderDataArray[0] : orderDataArray,
              isMultipleBooks: booksToUse.length > 1
            };

            const verifyResponse = await axios.post(
              `${API_URL}/payment/verify`,
              verifyPayload,
              {
                headers: {
                  id: localStorage.getItem("id"),
                  authorization: `Bearer ${localStorage.getItem("token")}`,
                  bookid: booksToUse.map(i => i._id).join(','),
                },
              }
            );

            if (verifyResponse.status === 200 && verifyResponse.data.success) {
              if (verifyResponse.data.orderId || verifyResponse.data.orderIds) {
                setPaymentDetails({
                  title: booksToUse.map(i => i.title).join(", "),
                  price: finalAmount,
                  failed: false,
                });
                setShowSuccessPopup(true);
                setTimeout(() => {
                  window.location.href = "/profile/orderHistory";
                }, 3000);
              } else if (verifyResponse.data.orderError) {
                setPaymentDetails({
                  title: booksToUse.map(i => i.title).join(", "),
                  price: finalAmount,
                  failed: true,
                  errorDetails: verifyResponse.data.errorDetails || "Order failed",
                });
                setShowSuccessPopup(true);
              }
            }
          } catch (err) {
            setPaymentDetails({
              title: booksToUse.map(i => i.title).join(", "),
              price: finalAmount,
              failed: true,
              errorDetails: err.response?.data?.message || err.message,
            });
            setShowSuccessPopup(true);
          }
        },
        prefill: {
          name: formatAddress.fullName,
          email: "user@bookbalcony.com",
          contact: formatAddress.phone,
        },
        theme: { color: "#FACC15" },
        modal: {
          ondismiss: () => setIsProcessing(false)
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        setIsProcessing(false);
        error("Payment failed or was cancelled.", "Payment Failed");
      });
      rzp.open();
      
    } catch (err) {
      setIsProcessing(false);
      error("Payment failed. Please try again.", "Payment Error");
    }
  };

  const handleCODClick = () => {
    const { formatAddress, missingFields } = validateAndFormatAddress(address);
    if (missingFields.length > 0) {
      warning(`Missing: ${missingFields.join(", ")}`, "Incomplete Address");
      return;
    }
    setShowCODPage(true);
  };

  if (showCODPage) {
    const booksToUse = booksWithSellers.length > 0 ? booksWithSellers : order.items;
    return (
      <COD_Page 
        orderDetails={{
          ...order,
          items: booksToUse,
          payable: order.payable - discountApplied,
          address: address,
          discountApplied: discountApplied
        }}
        onBack={() => setShowCODPage(false)}
        navigate={navigate}
      />
    );
  }

  const displayBooks = booksWithSellers.length > 0 ? booksWithSellers : order.items;
  const finalPayable = order.payable - discountApplied;

  return (
    <div className="w-full text-white text-xs relative">
      {alertData && (
        <Alert
          type={alertData.type}
          title={alertData.title}
          message={alertData.message}
          duration={alertData.duration}
          position={alertData.position}
          autoClose={alertData.autoClose}
          onClose={hideAlert}
        />
      )}

      {/* Cancel Payment Confirmation Modal */}
      {showCancelPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-2xl max-w-xs w-full text-center">
            <h2 className="text-sm font-bold text-yellow-400 mb-2">❓ Cancel Payment?</h2>
            <p className="mb-4 text-zinc-300 text-xs">Are you sure you want to go back?</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setShowCancelPopup(false)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
              >
                No, Continue
              </button>
              <button
                onClick={onBack}
                className="bg-red-500/20 border border-red-500/40 hover:bg-red-500 text-red-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              >
                Yes, Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setShowCancelPopup(true)}
          className="text-yellow-400 hover:text-yellow-300 text-xs font-semibold flex items-center gap-1 transition-colors"
        >
          <span>← Back to Summary</span>
        </button>
        <span className="text-[10px] text-zinc-500">Step 3 of 3</span>
      </div>

      <h2 className="text-sm sm:text-base font-bold bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 bg-clip-text text-transparent text-center mb-2.5">
        💳 Select Payment Method
      </h2>

      {/* Book Items Pricing Preview */}
      <div className="space-y-1.5 mb-2.5 max-h-36 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700">
        {displayBooks.map((book, idx) => {
          const pricingInfo = pricingPreview.find(p => p.book._id === book._id);
          return (
            <div key={idx} className="flex items-center gap-2 bg-zinc-800/40 border border-zinc-700/50 p-2 rounded-lg">
              <img src={book.url} alt={book.title} className="w-8 h-11 object-cover rounded shadow flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-white truncate">{book.title}</h3>
                <p className="text-[10px] text-zinc-400 truncate">Deliver to: {address.fullName}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-bold text-green-400">
                  ₹{pricingInfo ? pricingInfo.amountPayable : book.price}
                </p>
                {pricingInfo && pricingInfo.discount > 0 && (
                  <p className="text-[9px] text-zinc-500 line-through">₹{book.price}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Amount Banner */}
      <div className="bg-zinc-950/70 border border-zinc-800 p-2.5 rounded-xl mb-2.5 flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-300">Total Amount Payable:</span>
        <div className="text-right">
          <span className="text-sm font-bold text-yellow-400 flex items-center gap-0.5">
            <FaRupeeSign className="text-xs" />
            {finalPayable}
          </span>
          {discountApplied > 0 && (
            <span className="text-[9px] text-green-400 block">(Discount: -₹{discountApplied})</span>
          )}
        </div>
      </div>

      {/* Coupon Code Block - Compact */}
      <div className="mb-3 bg-zinc-800/40 border border-zinc-700/50 p-2 rounded-xl">
        <label className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1 mb-1">
          <MdDiscount className="text-yellow-400" /> Apply Coupon Code
        </label>
        <div className="flex gap-1.5">
          <input
            type="text"
            placeholder="e.g. SAVE10A"
            className="flex-1 bg-zinc-950/80 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-white placeholder-zinc-500 uppercase focus:border-yellow-400 focus:outline-none"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <button
            onClick={applyCoupon}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold px-3 py-1 rounded-lg text-xs shadow transition-colors"
          >
            Apply
          </button>
        </div>
        {couponMessage && (
          <p className={`text-[10px] mt-1 ${couponMessage.startsWith("✅") ? "text-green-400" : "text-red-400"}`}>
            {couponMessage}
          </p>
        )}
      </div>

      {/* Payment Action Buttons Stack */}
      <div className="space-y-1.5">
        <button
          onClick={handleOnlinePayment}
          disabled={isProcessing}
          className={`w-full font-bold py-2 px-3 rounded-xl text-xs shadow-lg flex items-center justify-center gap-1.5 transition-all ${
            isProcessing
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
              : "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black shadow-yellow-500/20"
          }`}
        >
          <GiReceiveMoney size={16} /> 
          {isProcessing ? "Processing Online Payment..." : `Pay Online via UPI / Card (₹${finalPayable})`}
        </button>

        <button
          onClick={handleCODClick}
          className="w-full bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <FaMoneyBillAlt size={14} className="text-yellow-400" />
          Cash on Delivery — COD (₹{finalPayable + 9} incl. ₹9 handling fee)
        </button>

        <button
          disabled={!isPremium}
          className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            isPremium
              ? "bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500 hover:text-white"
              : "bg-zinc-800/30 border border-zinc-800 text-zinc-600 cursor-not-allowed"
          }`}
        >
          <FaUserShield size={14} /> Meet in Person (Premium User Feature)
        </button>
      </div>

      {/* Success / Error Popup Modal */}
      {showSuccessPopup && paymentDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
          {paymentDetails.failed ? (
            <div className="bg-zinc-900 border border-red-500/30 rounded-2xl shadow-2xl max-w-sm p-5 text-center text-white">
              <h2 className="text-base font-bold text-red-400 mb-2">Payment Issue</h2>
              <p className="text-xs text-zinc-300 mb-4">{paymentDetails.errorDetails}</p>
              <button
                onClick={() => window.location.href = "/support"}
                className="bg-red-500/20 border border-red-500/40 text-red-300 py-1.5 px-4 rounded-lg text-xs font-bold"
              >
                Contact Support
              </button>
            </div>
          ) : (
            <div className="bg-zinc-900 border border-green-500/30 rounded-2xl shadow-2xl max-w-xs p-5 text-center text-white">
              <h2 className="text-base font-bold text-green-400 mb-1">🎉 Payment Successful!</h2>
              <p className="text-xs text-zinc-300 mb-2">Amount Paid: ₹{paymentDetails.price}</p>
              <p className="text-[10px] text-zinc-500">Redirecting to Order History...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}