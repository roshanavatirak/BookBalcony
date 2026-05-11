
// ============================================
// FILE: Step3_Payment.jsx - COMPLETE UPDATED VERSION
// ============================================
import { useEffect, useState } from "react";
import axios from "axios";
import { FaRupeeSign, FaMoneyBillAlt, FaUserShield } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { MdDiscount } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import COD_Page from "./COD_Page";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

export default function Step3_Payment({ address, order, onBack }) {
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
  const [pricingPreview, setPricingPreview] = useState([]); // ✅ NEW: Preview pricing
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

  // ✅ Calculate preview pricing when books or discount changes
  useEffect(() => {
    if (booksWithSellers.length > 0) {
      const preview = calculateProportionalPricing(
        booksWithSellers,
        discountApplied,
        0 // Free delivery
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

  // ✅ PROPORTIONAL PRICING CALCULATOR
  const calculateProportionalPricing = (books, totalDiscount, deliveryCharge) => {
    console.log("💰 [PRICING] Calculating proportional pricing...");
    console.log("💰 [PRICING] Books:", books.length);
    console.log("💰 [PRICING] Total discount:", totalDiscount);
    
    const totalBasePrice = books.reduce((sum, book) => sum + (book.price || 0), 0);
    console.log("💰 [PRICING] Total base price:", totalBasePrice);
    
    if (totalBasePrice === 0) {
      return books.map(book => ({
        book, originalPrice: 0, priceShare: 0,
        discount: 0, deliveryCharge: 0, amountPayable: 0
      }));
    }
    
    const pricingDetails = books.map((book, index) => {
      const bookPrice = book.price || 0;
      const priceShare = bookPrice / totalBasePrice;
      const bookDiscount = Math.round(totalDiscount * priceShare);
      const bookDeliveryCharge = Math.round(deliveryCharge * priceShare);
      const amountPayable = bookPrice - bookDiscount + bookDeliveryCharge;
      
      console.log(`📦 Book ${index + 1}: "${book.title}"`);
      console.log(`   - Original Price: ₹${bookPrice}`);
      console.log(`   - Discount: ₹${bookDiscount}`);
      console.log(`   - Amount Payable: ₹${amountPayable}`);
      
      return {
        book, 
        originalPrice: bookPrice, 
        priceShare,
        discount: bookDiscount, 
        deliveryCharge: bookDeliveryCharge,
        amountPayable: Math.max(0, amountPayable)
      };
    });
    
    // Handle rounding errors
    const calculatedTotal = pricingDetails.reduce((sum, item) => sum + item.amountPayable, 0);
    const expectedTotal = totalBasePrice - totalDiscount + deliveryCharge;
    
    if (calculatedTotal !== expectedTotal && pricingDetails.length > 0) {
      const difference = expectedTotal - calculatedTotal;
      console.log("⚠️ [PRICING] Rounding adjustment:", difference);
      pricingDetails[pricingDetails.length - 1].amountPayable += difference;
    }
    
    console.log("✅ [PRICING] Calculation complete");
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
      console.log("✅ [FETCH] Books fetched:", completeBooks.length);
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
        alert(`Missing: ${missingFields.join(", ")}`);
        setIsProcessing(false);
        return;
      }

      if (!window.Razorpay) {
        alert("Razorpay not loaded. Refresh and try again.");
        setIsProcessing(false);
        return;
      }

      const booksToUse = booksWithSellers.length > 0 ? booksWithSellers : order.items;
      
      const booksWithoutSeller = booksToUse.filter(book => !book.seller && !book.addedby);
      if (booksWithoutSeller.length > 0) {
        alert("Some books missing seller info. Contact support.");
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
            // ✅ CALCULATE PROPORTIONAL PRICING
            const pricingDetails = calculateProportionalPricing(
              booksToUse,
              discountApplied,
              0 // Free delivery
            );
            
            // ✅ CREATE ORDER DATA WITH CORRECT PRICING
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
          email: "test@example.com",
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
        alert('Payment failed.');
      });
      rzp.open();
      
    } catch (err) {
      setIsProcessing(false);
      alert("Payment failed. Try again.");
    }
  };

  const handleCODClick = () => {
    const { formatAddress, missingFields } = validateAndFormatAddress(address);
    if (missingFields.length > 0) {
      alert(`Missing: ${missingFields.join(", ")}`);
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

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-3xl mx-auto text-black relative">
      {showCancelPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-bold mb-4">❓ Cancel Payment?</h2>
            <p className="mb-6 text-gray-600">Cancel payment process?</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowCancelPopup(false)} className="bg-gray-300 px-4 py-2 rounded-lg">
                No, Continue
              </button>
              <button onClick={onBack} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => setShowCancelPopup(true)} className="text-blue-600 underline text-sm mt-2">
        ← Back to Summary
      </button>

      <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">💳 Payment Options</h2>

      {/* ✅ FIXED: Show individual book pricing */}
      {displayBooks.map((book, idx) => {
        // Find pricing info for this book
        const pricingInfo = pricingPreview.find(p => p.book._id === book._id);
        
        return (
          <div key={idx} className="flex gap-4 border p-4 rounded-lg bg-zinc-50 mb-4 items-center">
            <img src={book.url} alt={book.title} className="w-20 h-28 object-cover rounded" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{book.title}</h3>
              <p className="text-gray-600 text-sm">
                To: {address.fullName || "Customer"}, {address.city || "City"}
              </p>
              
              {/* ✅ Show pricing breakdown */}
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500 line-through">MRP: ₹{book.price}</span>
                </div>
                
                {pricingInfo && pricingInfo.discount > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600 font-medium">
                      Discount: -₹{pricingInfo.discount}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-600">
                    ₹{pricingInfo ? pricingInfo.amountPayable : book.price}
                  </span>
                  {pricingInfo && pricingInfo.discount > 0 && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      {Math.round((pricingInfo.discount / book.price) * 100)}% off
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Total Payable */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Total Payable:</span>
          <span className="text-2xl font-bold text-green-600 flex items-center gap-1">
            <FaRupeeSign className="text-xl" />
            {order.payable - discountApplied}
          </span>
        </div>
        {discountApplied > 0 && (
          <p className="text-sm text-green-600 text-right mt-1">
            (Coupon discount: ₹{discountApplied})
          </p>
        )}
      </div>

      <div className="mb-4 mt-4">
        <label className="font-medium text-sm flex items-center gap-1 mb-1">
          <MdDiscount /> Apply Coupon
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Coupon code"
            className="flex-1 border p-2 rounded"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <button onClick={applyCoupon} className="bg-yellow-400 px-4 py-2 rounded font-medium">
            Apply
          </button>
        </div>
        {couponMessage && (
          <p className={`text-sm mt-1 ${couponMessage.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
            {couponMessage}
          </p>
        )}
      </div>

      <div className="space-y-3 mt-6">
        <button
          onClick={handleOnlinePayment}
          disabled={isProcessing}
          className={`font-semibold py-3 rounded-xl w-full flex items-center justify-center gap-2 ${
            isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-400 hover:bg-yellow-300"
          }`}
        >
          <GiReceiveMoney size={20} /> 
          {isProcessing ? "Processing..." : "Pay Online"}
        </button>

        <button
          onClick={handleCODClick}
          className="bg-white border text-gray-800 font-medium py-3 rounded-xl w-full flex items-center justify-center gap-2 hover:bg-gray-100"
        >
          <FaMoneyBillAlt size={18} /> COD (₹{order.payable - discountApplied} + 9 )
        </button>

        <button
          disabled={!isPremium}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl ${
            isPremium ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          <FaUserShield size={18} /> Meet in Person (Premium)
        </button>
      </div>

      {showSuccessPopup && paymentDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          {paymentDetails.failed ? (
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-red-700 mb-3">Payment Issue</h2>
              <p className="mb-4">{paymentDetails.errorDetails}</p>
              <button onClick={() => window.location.href = "/contact"} className="bg-blue-600 text-white py-3 px-6 rounded-lg">
                Contact Support
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-2xl max-w-md p-8 text-center">
              <h2 className="text-2xl font-bold text-green-700 mb-2">🎉 Success!</h2>
              <p className="mb-4">Paid ₹{paymentDetails.price}</p>
              <p className="text-sm text-gray-500">Redirecting...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}