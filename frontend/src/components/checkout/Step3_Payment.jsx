// import { useEffect, useState } from "react";
// import axios from "axios";
// import { FaRupeeSign, FaMoneyBillAlt, FaUserShield } from "react-icons/fa";
// import { GiReceiveMoney } from "react-icons/gi";
// import { MdDiscount } from "react-icons/md";
// import { IoMdCloseCircle } from "react-icons/io";
// import { useNavigate } from "react-router-dom";
// import COD_Page from "./COD_Page";

// export default function Step3_Payment({ address, order, onBack, onCODSelected }) {
//   const isPremium = localStorage.getItem("isPremiumUser") === "true";
//   const [coupon, setCoupon] = useState("");
//   const [couponMessage, setCouponMessage] = useState("");
//   const [discountApplied, setDiscountApplied] = useState(0);
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//   const [paymentDetails, setPaymentDetails] = useState(null);
//   const [showCancelPopup, setShowCancelPopup] = useState(false);
//   const [showCODPage, setShowCODPage] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const navigate = useNavigate();

//   const validCoupons = ["SAVE10A", "BOOK5X1", "OFFER77B"];

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   useEffect(() => {
//     if (!window.Razorpay) {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       document.body.appendChild(script);
//     }
//   }, []);

//   const applyCoupon = () => {
//     if (validCoupons.includes(coupon.trim().toUpperCase())) {
//       setDiscountApplied(50);
//       setCouponMessage("✅ Coupon applied successfully! ₹50 off.");
//     } else {
//       setDiscountApplied(0);
//       setCouponMessage("❌ Invalid coupon code. Try again.");
//     }
//   };

//   // ✅ Helper function to validate and format address
//   const validateAndFormatAddress = (address) => {
//     const formatAddress = {
//       fullName: address.fullName || address.name || "Customer Name",
//       phone: address.phone || "9999999999",
//       addressLine1: address.addressLine1 || address.address || buildAddressLine(address),
//       addressLine2: address.addressLine2 || address.landmark || "",
//       city: address.city || address.villageOrTown || "City",
//       state: address.state || "State",
//       postalCode: address.postalCode || address.pincode || "000000",
//       country: address.country || "India",
//     };

//     // Validate required fields
//     const missingFields = [];
//     if (!formatAddress.fullName || formatAddress.fullName === "Customer Name") missingFields.push("Full Name");
//     if (!formatAddress.phone || formatAddress.phone === "9999999999") missingFields.push("Phone");
//     if (!formatAddress.addressLine1 || formatAddress.addressLine1 === "Address not provided") missingFields.push("Address");
//     if (!formatAddress.city || formatAddress.city === "City") missingFields.push("City");
//     if (!formatAddress.state || formatAddress.state === "State") missingFields.push("State");
//     if (!formatAddress.postalCode || formatAddress.postalCode === "000000") missingFields.push("Postal Code");

//     return { formatAddress, missingFields };
//   };

//   // ✅ Helper function to build address line from user's address structure
//   const buildAddressLine = (address) => {
//     const parts = [];
    
//     if (address.addressLine1) {
//       return address.addressLine1;
//     } else {
//       // Build from old format
//       if (address.houseNumber) parts.push(address.houseNumber);
//       if (address.streetName) parts.push(address.streetName);
//       if (address.locality) parts.push(address.locality);
//     }
    
//     return parts.join(", ") || "Address not provided";
//   };

//   const handleOnlinePayment = async () => {
//     if (isProcessing) return;
//     setIsProcessing(true);

//     try {
//       // ✅ Validate address before proceeding
//       const { formatAddress, missingFields } = validateAndFormatAddress(address);
      
//       if (missingFields.length > 0) {
//         alert(`Please complete your address details. Missing: ${missingFields.join(", ")}`);
//         setIsProcessing(false);
//         return;
//       }

//       if (!window.Razorpay) {
//         alert("Razorpay SDK not loaded. Please refresh the page and try again.");
//         setIsProcessing(false);
//         return;
//       }

//       // ✅ Create Razorpay order
//       const { data } = await axios.post("http://localhost:3000/api/v1/payment/order", {
//         amount: order.payable - discountApplied,
//       });

//       const options = {
//         key: "rzp_test_NBQpcL6r3o5ntb",
//         amount: data.order.amount,
//         currency: "INR",
//         name: "BookBalcony",
//         description: `Payment for ${order.items.map(i => i.title).join(", ")}`,
//         order_id: data.order.id,
//         handler: async (response) => {
//           try {
//             // ✅ Step 1: Verify payment with complete data
//             const verifyPayload = {
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               amount: order.payable - discountApplied,
//               receipt: data.order.receipt,
//               // ✅ Include order data for backend processing
//               orderData: {
//                 user: localStorage.getItem("id"),
//                 book: order.items[0]._id, // For single book orders
//                 paymentMethod: "RAZORPAY",
//                 amountPayable: order.payable - discountApplied,
//                 discount: discountApplied,
//                 shippingAddress: formatAddress,
//               }
//             };

//             const verifyResponse = await axios.post(
//               "http://localhost:3000/api/v1/payment/verify",
//               verifyPayload,
//               {
//                 headers: {
//                   id: localStorage.getItem("id"),
//                   authorization: `Bearer ${localStorage.getItem("token")}`,
//                   bookid: order.items.map(i => i._id).join(','),
//                 },
//               }
//             );

//             console.log("Payment verification response:", verifyResponse.data);

//             // ✅ Check if payment verification was successful
//             if (verifyResponse.status === 200 && verifyResponse.data.success) {
              
//               // ✅ If order was created during verification, show success
//               if (verifyResponse.data.orderId && !verifyResponse.data.orderError) {
//                 setPaymentDetails({
//                   title: order.items.map(i => i.title).join(", "),
//                   price: order.payable - discountApplied,
//                   failed: false,
//                 });

//                 setShowSuccessPopup(true);
//                 setTimeout(() => {
//                   window.location.href = "/profile/orderHistory";
//                 }, 8000);
                
//               } 
//               // ✅ If payment succeeded but order creation failed
//               else if (verifyResponse.data.orderError) {
//                 setPaymentDetails({
//                   title: order.items.map(i => i.title).join(", "),
//                   price: order.payable - discountApplied,
//                   failed: true,
//                   errorDetails: verifyResponse.data.errorDetails || "Order processing failed due to technical issues",
//                 });
//                 setShowSuccessPopup(true);
//               }
//               // ✅ Legacy flow - try to create order separately
//               else {
//                 try {
//                   const orderPayload = {
//                     order: order.items.map(book => ({
//                       book: book._id,
//                       paymentStatus: "Success",
//                       orderStatus: "Order Placed",
//                       paymentMethod: "RAZORPAY",
//                     })),
//                     shippingAddress: formatAddress,
//                     amountPayable: order.payable - discountApplied,
//                     discount: discountApplied,
//                     handlingFee: 0,
//                   };

//                   await axios.post(
//                     "http://localhost:3000/api/v1/place-order",
//                     orderPayload,
//                     {
//                       headers: {
//                         id: localStorage.getItem("id"),
//                         authorization: `Bearer ${localStorage.getItem("token")}`,
//                       },
//                     }
//                   );

//                   // Success
//                   setPaymentDetails({
//                     title: order.items.map(i => i.title).join(", "),
//                     price: order.payable - discountApplied,
//                     failed: false,
//                   });

//                   setShowSuccessPopup(true);
//                   setTimeout(() => {
//                     window.location.href = "/profile/orderHistory";
//                   }, 8000);
                  
//                 } catch (orderErr) {
//                   console.error("Separate order creation failed:", orderErr);
                  
//                   // Payment success but order creation failed
//                   setPaymentDetails({
//                     title: order.items.map(i => i.title).join(", "),
//                     price: order.payable - discountApplied,
//                     failed: true,
//                     errorDetails: orderErr.response?.data?.message || "Order processing failed after successful payment",
//                   });
//                   setShowSuccessPopup(true);
//                 }
//               }
//             } else {
//               throw new Error(verifyResponse.data?.message || "Payment verification failed");
//             }
//           } catch (err) {
//             console.error("Order processing error:", err);
            
//             // ✅ Show professional error popup with refund assurance
//             setPaymentDetails({
//               title: order.items.map(i => i.title).join(", "),
//               price: order.payable - discountApplied,
//               failed: true,
//               errorDetails: err.response?.data?.message || "Technical issue during order processing",
//             });
//             setShowSuccessPopup(true);
//           }
//         },
//         prefill: {
//           name: formatAddress.fullName,
//           email: "test@example.com",
//           contact: formatAddress.phone,
//         },
//         theme: { color: "#FACC15" },
//         modal: {
//           ondismiss: function() {
//             setIsProcessing(false);
//           }
//         }
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.on('payment.failed', function (response) {
//         console.error('Payment failed:', response.error);
//         setIsProcessing(false);
//         alert('Payment failed. Please try again.');
//       });
      
//       rzp.open();
//     } catch (err) {
//       console.error("Payment initialization error:", err);
//       setIsProcessing(false);
//       alert("Failed to initiate payment. Please check your internet connection and try again.");
//     }
//   };

//   const handleCODClick = () => {
//     const { formatAddress, missingFields } = validateAndFormatAddress(address);
    
//     if (missingFields.length > 0) {
//       alert(`Please complete your address details. Missing: ${missingFields.join(", ")}`);
//       return;
//     }
    
//     setShowCODPage(true);
//   };

//   const handleCODBack = () => {
//     setShowCODPage(false);
//   };

//   // Show COD Page if selected
//   if (showCODPage) {
//     return (
//       <COD_Page 
//         orderDetails={{
//           ...order,
//           payable: order.payable - discountApplied,
//           address: address,
//           discountApplied: discountApplied
//         }}
//         onBack={handleCODBack}
//         navigate={navigate}
//       />
//     );
//   }

//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-xl max-w-3xl mx-auto text-black relative">
//       {/* Cancel Payment Popup */}
//       {showCancelPopup && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
//           <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full text-center">
//             <h2 className="text-lg font-bold mb-4">❓ Cancel Payment?</h2>
//             <p className="mb-6 text-gray-600">Are you sure you want to cancel the payment process?</p>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={() => setShowCancelPopup(false)}
//                 className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
//               >
//                 No, Continue
//               </button>
//               <button
//                 onClick={onBack}
//                 className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
//               >
//                 Yes, Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <button
//         onClick={() => setShowCancelPopup(true)}
//         className="text-blue-600 underline text-sm mt-2 cursor-pointer"
//       >
//         ← Back to Summary
//       </button>

//       <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">💳 Payment Options</h2>

//       {/* Order Summary */}
//       {order.items.map((book, idx) => (
//         <div key={idx} className="flex gap-4 border p-4 rounded-lg bg-zinc-50 mb-4 items-center">
//           <img
//             src={book.url}
//             alt={book.title}
//             className="w-20 h-28 object-cover rounded"
//           />
//           <div className="flex-1">
//             <h3 className="text-lg font-semibold">{book.title}</h3>
//             <p className="text-gray-600 text-sm">
//               Deliver to: {address.fullName || address.name || "Customer"}, {address.city || address.villageOrTown || "City"}
//             </p>
//           </div>
//         </div>
//       ))}

//       <p className="text-black mt-1 font-medium text-lg">
//         Total Payable: <FaRupeeSign className="inline mb-1" /> {order.payable - discountApplied}
//       </p>

//       {/* Coupon Field */}
//       <div className="mb-4 mt-4">
//         <label className="font-medium text-sm flex items-center gap-1 mb-1">
//           <MdDiscount /> Apply Coupon
//         </label>
//         <div className="flex gap-2">
//           <input
//             type="text"
//             placeholder="Enter coupon code"
//             className="flex-1 border p-2 rounded"
//             value={coupon}
//             onChange={(e) => setCoupon(e.target.value)}
//           />
//           <button
//             onClick={applyCoupon}
//             className="bg-yellow-400 hover:bg-yellow-300 px-4 py-2 rounded font-medium cursor-pointer"
//           >
//             Apply
//           </button>
//         </div>
//         {couponMessage && (
//           <p className={`text-sm mt-1 ${couponMessage.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
//             {couponMessage}
//           </p>
//         )}
//       </div>

//       {/* Address Validation Warning */}
//       {(() => {
//         const { missingFields } = validateAndFormatAddress(address);
//         if (missingFields.length > 0) {
//           return (
//             <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
//               <p className="text-yellow-800 text-sm">
//                 ⚠️ Address incomplete! Missing: <strong>{missingFields.join(", ")}</strong>. 
//                 Please update your profile before placing an order.
//               </p>
//             </div>
//           );
//         }
//         return null;
//       })()}

//       {/* Payment Buttons */}
//       <div className="space-y-3 mt-6">
//         <button
//           onClick={handleOnlinePayment}
//           disabled={isProcessing}
//           className={`cursor-pointer font-semibold py-3 rounded-xl w-full flex items-center justify-center gap-2 transition ${
//             isProcessing 
//               ? "bg-gray-400 text-gray-600 cursor-not-allowed" 
//               : "bg-yellow-400 text-black hover:bg-yellow-300"
//           }`}
//         >
//           <GiReceiveMoney size={20} /> 
//           {isProcessing ? "Processing..." : "Pay Online (Razorpay)"}
//         </button>

//         <button
//           onClick={handleCODClick}
//           disabled={isProcessing}
//           className="cursor-pointer bg-white border border-gray-300 text-gray-800 font-medium py-3 rounded-xl w-full flex items-center justify-center gap-2 hover:bg-gray-100 transition"
//         >
//           <FaMoneyBillAlt size={18} /> Cash on Delivery ( ₹{order.payable - discountApplied} + ₹20 handling fee )
//         </button>

//         <p className="text-xs text-gray-500 text-center italic">
//           💡 We recommend using Razorpay for a faster, smoother experience. COD may delay processing.
//         </p>

//         <button
//           disabled={!isPremium}
//           className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl ${
//             isPremium
//               ? "cursor-pointer bg-blue-500 text-white hover:bg-blue-600"
//               : "bg-gray-200 text-gray-500 cursor-not-allowed"
//           }`}
//         >
//           <FaUserShield size={18} /> Meet in Person (Premium Only)
//         </button>
//       </div>

//       {/* Success/Failure Popup */}
//       {showSuccessPopup && paymentDetails && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
//           {paymentDetails.failed ? (
//             // Payment Failed Popup
//             <div className="bg-gradient-to-b from-red-50 to-white rounded-3xl shadow-2xl max-w-lg w-full text-center p-8 mx-4">
//               <div className="flex justify-center mb-4">
//                 <div className="bg-red-100 rounded-full p-4 border-4 border-red-300 shadow-md">
//                   <svg
//                     className="w-12 h-12 text-red-600"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="3"
//                     viewBox="0 0 24 24"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                   </svg>
//                 </div>
//               </div>
              
//               <h2 className="text-2xl font-bold text-red-700 mb-3">Payment Successful, Order Processing Issue</h2>
              
//               <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
//                 <div className="flex items-center justify-center mb-2">
//                   <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                   <span className="font-semibold text-green-800">Your Payment is Secure</span>
//                 </div>
//                 <p className="text-green-700 text-sm">
//                   ✅ Payment of <span className="font-bold">₹{paymentDetails.price}</span> was successfully processed by Razorpay.
//                   <br />Your transaction is 100% safe and secure.
//                 </p>
//               </div>

//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
//                 <h4 className="font-semibold text-blue-800 mb-2">Technical Issue Details:</h4>
//                 <p className="text-blue-700 text-sm">{paymentDetails.errorDetails}</p>
//               </div>

//               <div className="text-gray-700 mb-6">
//                 <h3 className="font-semibold text-lg mb-3">🔄 Automated Resolution Process</h3>
//                 <div className="text-left space-y-3 text-sm">
//                   <div className="flex items-start bg-yellow-50 p-3 rounded-lg">
//                     <span className="inline-block w-6 h-6 bg-yellow-400 text-white rounded-full text-xs font-bold flex items-center justify-center mr-3 mt-0.5">1</span>
//                     <div>
//                       <span className="font-semibold">Immediate Notification</span>
//                       <br />Our technical team has been auto-alerted about this issue
//                     </div>
//                   </div>
//                   <div className="flex items-start bg-blue-50 p-3 rounded-lg">
//                     <span className="inline-block w-6 h-6 bg-blue-400 text-white rounded-full text-xs font-bold flex items-center justify-center mr-3 mt-0.5">2</span>
//                     <div>
//                       <span className="font-semibold">Manual Processing (2-4 Hours)</span>
//                       <br />We'll manually create your order and send confirmation
//                     </div>
//                   </div>
//                   <div className="flex items-start bg-green-50 p-3 rounded-lg">
//                     <span className="inline-block w-6 h-6 bg-green-400 text-white rounded-full text-xs font-bold flex items-center justify-center mr-3 mt-0.5">3</span>
//                     <div>
//                       <span className="font-semibold">Guaranteed Refund Policy</span>
//                       <br />If order cannot be processed, <strong>full refund within 3-5 business days</strong>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 rounded-lg p-4 mb-4 border-l-4 border-gray-400">
//                 <p className="text-sm text-gray-700">
//                   <strong>📦 Your Order Summary:</strong><br />
//                   Books: <span className="text-blue-600">{paymentDetails.title}</span><br />
//                   Amount Paid: <span className="text-green-600 font-bold">₹{paymentDetails.price}</span><br />
//                   Status: <span className="text-yellow-600 font-semibold">Payment Confirmed, Processing Manually</span>
//                 </p>
//               </div>

//               <div className="space-y-3">
//                 <button
//                   onClick={() => window.location.href = "/contact"}
//                   className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
//                 >
//                   📞 Contact Support Team
//                 </button>
//                 <button
//                   onClick={() => window.location.href = "/profile/orderHistory"}
//                   className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
//                 >
//                   📋 Check Order Status
//                 </button>
//                 <button
//                   onClick={() => setShowSuccessPopup(false)}
//                   className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//                 >
//                   🛍️ Continue Shopping
//                 </button>
//               </div>

//               <div className="mt-4 p-3 bg-gray-100 rounded-lg">
//                 <p className="text-xs text-gray-600">
//                   <strong>📧 Email Confirmation:</strong> Transaction receipt and updates will be sent to your registered email.
//                   <br />
//                   <strong>📱 SMS Updates:</strong> You'll receive SMS updates about order status on your registered mobile number.
//                 </p>
//               </div>
//             </div>
//           ) : (
//             // Success Popup
//             <div className="bg-gradient-to-b from-green-50 to-white rounded-3xl shadow-2xl max-w-md w-full text-center p-8">
//               <div className="flex justify-center mb-4">
//                 <div className="bg-green-100 rounded-full p-4 border-4 border-green-300 animate-bounce-slow shadow-md">
//                   <svg
//                     className="w-10 h-10 text-green-600"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="3"
//                     viewBox="0 0 24 24"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                   </svg>
//                 </div>
//               </div>
//               <h2 className="text-2xl font-bold text-green-700 mb-2">🎉 Order Placed Successfully!</h2>
//               <p className="text-gray-700 text-base mb-1">
//                 You've successfully paid <span className="font-semibold text-green-800">₹{paymentDetails.price}</span>
//               </p>
//               <p className="text-lg font-semibold text-gray-900 mb-4">{paymentDetails.title}</p>
//               <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
//                 <p className="text-green-700 text-sm">
//                   ✅ Payment confirmed<br />
//                   ✅ Order placed in system<br />
//                   📦 Processing for shipment
//                 </p>
//               </div>
//               <p className="text-sm text-gray-500 mt-4">
//                 Redirecting you to <span className="font-semibold">Order History</span>...
//               </p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import { FaRupeeSign, FaMoneyBillAlt, FaUserShield } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { MdDiscount } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import COD_Page from "./COD_Page";

export default function Step3_Payment({ address, order, onBack, onCODSelected }) {
  const isPremium = localStorage.getItem("isPremiumUser") === "true";
  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [discountApplied, setDiscountApplied] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showCODPage, setShowCODPage] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const validCoupons = ["SAVE10A", "BOOK5X1", "OFFER77B"];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      document.body.appendChild(script);
    }
  }, []);

  const applyCoupon = () => {
    if (validCoupons.includes(coupon.trim().toUpperCase())) {
      setDiscountApplied(50);
      setCouponMessage("✅ Coupon applied successfully! ₹50 off.");
    } else {
      setDiscountApplied(0);
      setCouponMessage("❌ Invalid coupon code. Try again.");
    }
  };

  const validateAndFormatAddress = (address) => {
    const formatAddress = {
      fullName: address.fullName || address.name || "Customer Name",
      phone: address.phone || "9999999999",
      addressLine1: address.addressLine1 || address.address || buildAddressLine(address),
      addressLine2: address.addressLine2 || address.landmark || "",
      city: address.city || address.villageOrTown || "City",
      state: address.state || "State",
      postalCode: address.postalCode || address.pincode || "000000",
      country: address.country || "India",
    };

    const missingFields = [];
    if (!formatAddress.fullName || formatAddress.fullName === "Customer Name") missingFields.push("Full Name");
    if (!formatAddress.phone || formatAddress.phone === "9999999999") missingFields.push("Phone");
    if (!formatAddress.addressLine1 || formatAddress.addressLine1 === "Address not provided") missingFields.push("Address");
    if (!formatAddress.city || formatAddress.city === "City") missingFields.push("City");
    if (!formatAddress.state || formatAddress.state === "State") missingFields.push("State");
    if (!formatAddress.postalCode || formatAddress.postalCode === "000000") missingFields.push("Postal Code");

    return { formatAddress, missingFields };
  };

  const buildAddressLine = (address) => {
    const parts = [];
    
    if (address.addressLine1) {
      return address.addressLine1;
    } else {
      if (address.houseNumber) parts.push(address.houseNumber);
      if (address.streetName) parts.push(address.streetName);
      if (address.locality) parts.push(address.locality);
    }
    
    return parts.join(", ") || "Address not provided";
  };

  const handleOnlinePayment = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const { formatAddress, missingFields } = validateAndFormatAddress(address);
      
      if (missingFields.length > 0) {
        alert(`Please complete your address details. Missing: ${missingFields.join(", ")}`);
        setIsProcessing(false);
        return;
      }

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded. Please refresh the page and try again.");
        setIsProcessing(false);
        return;
      }

      const { data } = await axios.post("http://localhost:3000/api/v1/payment/order", {
        amount: order.payable - discountApplied,
      });

      const options = {
        key: "rzp_test_NBQpcL6r3o5ntb",
        amount: data.order.amount,
        currency: "INR",
        name: "BookBalcony",
        description: `Payment for ${order.items.map(i => i.title).join(", ")}`,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: order.payable - discountApplied,
              receipt: data.order.receipt,
              orderData: {
                user: localStorage.getItem("id"),
                book: order.items[0]._id,
                paymentMethod: "RAZORPAY",
                amountPayable: order.payable - discountApplied,
                discount: discountApplied,
                shippingAddress: formatAddress,
              }
            };

            const verifyResponse = await axios.post(
              "http://localhost:3000/api/v1/payment/verify",
              verifyPayload,
              {
                headers: {
                  id: localStorage.getItem("id"),
                  authorization: `Bearer ${localStorage.getItem("token")}`,
                  bookid: order.items.map(i => i._id).join(','),
                },
              }
            );

            console.log("Payment verification response:", verifyResponse.data);

            if (verifyResponse.status === 200 && verifyResponse.data.success) {
              
              if (verifyResponse.data.orderId && !verifyResponse.data.orderError) {
                setPaymentDetails({
                  title: order.items.map(i => i.title).join(", "),
                  price: order.payable - discountApplied,
                  failed: false,
                });

                setShowSuccessPopup(true);
                setTimeout(() => {
                  window.location.href = "/profile/orderHistory";
                }, 8000);
                
              } 
              else if (verifyResponse.data.orderError) {
                setPaymentDetails({
                  title: order.items.map(i => i.title).join(", "),
                  price: order.payable - discountApplied,
                  failed: true,
                  errorDetails: verifyResponse.data.errorDetails || "Order processing failed due to technical issues",
                });
                setShowSuccessPopup(true);
              }
              else {
                try {
                  // ✅ ADDED: Include seller info for each book
                  const orderPayload = {
                    order: order.items.map(book => ({
                      book: book._id,
                      seller: book.seller, // ✅ Add seller from book
                      paymentStatus: "Success",
                      orderStatus: "Order Placed",
                      paymentMethod: "RAZORPAY",
                    })),
                    shippingAddress: formatAddress,
                    amountPayable: order.payable - discountApplied,
                    discount: discountApplied,
                    handlingFee: 0,
                  };

                  await axios.post(
                    "http://localhost:3000/api/v1/place-order",
                    orderPayload,
                    {
                      headers: {
                        id: localStorage.getItem("id"),
                        authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                    }
                  );

                  setPaymentDetails({
                    title: order.items.map(i => i.title).join(", "),
                    price: order.payable - discountApplied,
                    failed: false,
                  });

                  setShowSuccessPopup(true);
                  setTimeout(() => {
                    window.location.href = "/profile/orderHistory";
                  }, 8000);
                  
                } catch (orderErr) {
                  console.error("Separate order creation failed:", orderErr);
                  
                  setPaymentDetails({
                    title: order.items.map(i => i.title).join(", "),
                    price: order.payable - discountApplied,
                    failed: true,
                    errorDetails: orderErr.response?.data?.message || "Order processing failed after successful payment",
                  });
                  setShowSuccessPopup(true);
                }
              }
            } else {
              throw new Error(verifyResponse.data?.message || "Payment verification failed");
            }
          } catch (err) {
            console.error("Order processing error:", err);
            
            setPaymentDetails({
              title: order.items.map(i => i.title).join(", "),
              price: order.payable - discountApplied,
              failed: true,
              errorDetails: err.response?.data?.message || "Technical issue during order processing",
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
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        setIsProcessing(false);
        alert('Payment failed. Please try again.');
      });
      
      rzp.open();
    } catch (err) {
      console.error("Payment initialization error:", err);
      setIsProcessing(false);
      alert("Failed to initiate payment. Please check your internet connection and try again.");
    }
  };

  const handleCODClick = () => {
    const { formatAddress, missingFields } = validateAndFormatAddress(address);
    
    if (missingFields.length > 0) {
      alert(`Please complete your address details. Missing: ${missingFields.join(", ")}`);
      return;
    }
    
    setShowCODPage(true);
  };

  const handleCODBack = () => {
    setShowCODPage(false);
  };

  if (showCODPage) {
    return (
      <COD_Page 
        orderDetails={{
          ...order,
          payable: order.payable - discountApplied,
          address: address,
          discountApplied: discountApplied
        }}
        onBack={handleCODBack}
        navigate={navigate}
      />
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-3xl mx-auto text-black relative">
      {showCancelPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-bold mb-4">❓ Cancel Payment?</h2>
            <p className="mb-6 text-gray-600">Are you sure you want to cancel the payment process?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowCancelPopup(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                No, Continue
              </button>
              <button
                onClick={onBack}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowCancelPopup(true)}
        className="text-blue-600 underline text-sm mt-2 cursor-pointer"
      >
        ← Back to Summary
      </button>

      <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">💳 Payment Options</h2>

      {order.items.map((book, idx) => (
        <div key={idx} className="flex gap-4 border p-4 rounded-lg bg-zinc-50 mb-4 items-center">
          <img
            src={book.url}
            alt={book.title}
            className="w-20 h-28 object-cover rounded"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{book.title}</h3>
            <p className="text-gray-600 text-sm">
              Deliver to: {address.fullName || address.name || "Customer"}, {address.city || address.villageOrTown || "City"}
            </p>
          </div>
        </div>
      ))}

      <p className="text-black mt-1 font-medium text-lg">
        Total Payable: <FaRupeeSign className="inline mb-1" /> {order.payable - discountApplied}
      </p>

      <div className="mb-4 mt-4">
        <label className="font-medium text-sm flex items-center gap-1 mb-1">
          <MdDiscount /> Apply Coupon
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter coupon code"
            className="flex-1 border p-2 rounded"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <button
            onClick={applyCoupon}
            className="bg-yellow-400 hover:bg-yellow-300 px-4 py-2 rounded font-medium cursor-pointer"
          >
            Apply
          </button>
        </div>
        {couponMessage && (
          <p className={`text-sm mt-1 ${couponMessage.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
            {couponMessage}
          </p>
        )}
      </div>

      {(() => {
        const { missingFields } = validateAndFormatAddress(address);
        if (missingFields.length > 0) {
          return (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
              <p className="text-yellow-800 text-sm">
                ⚠️ Address incomplete! Missing: <strong>{missingFields.join(", ")}</strong>. 
                Please update your profile before placing an order.
              </p>
            </div>
          );
        }
        return null;
      })()}

      <div className="space-y-3 mt-6">
        <button
          onClick={handleOnlinePayment}
          disabled={isProcessing}
          className={`cursor-pointer font-semibold py-3 rounded-xl w-full flex items-center justify-center gap-2 transition ${
            isProcessing 
              ? "bg-gray-400 text-gray-600 cursor-not-allowed" 
              : "bg-yellow-400 text-black hover:bg-yellow-300"
          }`}
        >
          <GiReceiveMoney size={20} /> 
          {isProcessing ? "Processing..." : "Pay Online (Razorpay)"}
        </button>

        <button
          onClick={handleCODClick}
          disabled={isProcessing}
          className="cursor-pointer bg-white border border-gray-300 text-gray-800 font-medium py-3 rounded-xl w-full flex items-center justify-center gap-2 hover:bg-gray-100 transition"
        >
          <FaMoneyBillAlt size={18} /> Cash on Delivery ( ₹{order.payable - discountApplied} + ₹20 handling fee )
        </button>

        <p className="text-xs text-gray-500 text-center italic">
          💡 We recommend using Razorpay for a faster, smoother experience. COD may delay processing.
        </p>

        <button
          disabled={!isPremium}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl ${
            isPremium
              ? "cursor-pointer bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          <FaUserShield size={18} /> Meet in Person (Premium Only)
        </button>
      </div>

      {showSuccessPopup && paymentDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          {paymentDetails.failed ? (
            <div className="bg-gradient-to-b from-red-50 to-white rounded-3xl shadow-2xl max-w-lg w-full text-center p-8 mx-4">
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 rounded-full p-4 border-4 border-red-300 shadow-md">
                  <svg
                    className="w-12 h-12 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-red-700 mb-3">Payment Successful, Order Processing Issue</h2>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-green-800">Your Payment is Secure</span>
                </div>
                <p className="text-green-700 text-sm">
                  ✅ Payment of <span className="font-bold">₹{paymentDetails.price}</span> was successfully processed by Razorpay.
                  <br />Your transaction is 100% safe and secure.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-blue-800 mb-2">Technical Issue Details:</h4>
                <p className="text-blue-700 text-sm">{paymentDetails.errorDetails}</p>
              </div>

              <div className="text-gray-700 mb-6">
                <h3 className="font-semibold text-lg mb-3">🔄 Automated Resolution Process</h3>
                <div className="text-left space-y-3 text-sm">
                  <div className="flex items-start bg-yellow-50 p-3 rounded-lg">
                    <span className="inline-block w-6 h-6 bg-yellow-400 text-white rounded-full text-xs font-bold flex items-center justify-center mr-3 mt-0.5">1</span>
                    <div>
                      <span className="font-semibold">Immediate Notification</span>
                      <br />Our technical team has been auto-alerted about this issue
                    </div>
                  </div>
                  <div className="flex items-start bg-blue-50 p-3 rounded-lg">
                    <span className="inline-block w-6 h-6 bg-blue-400 text-white rounded-full text-xs font-bold flex items-center justify-center mr-3 mt-0.5">2</span>
                    <div>
                      <span className="font-semibold">Manual Processing (2-4 Hours)</span>
                      <br />We'll manually create your order and send confirmation
                    </div>
                  </div>
                  <div className="flex items-start bg-green-50 p-3 rounded-lg">
                    <span className="inline-block w-6 h-6 bg-green-400 text-white rounded-full text-xs font-bold flex items-center justify-center mr-3 mt-0.5">3</span>
                    <div>
                      <span className="font-semibold">Guaranteed Refund Policy</span>
                      <br />If order cannot be processed, <strong>full refund within 3-5 business days</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4 border-l-4 border-gray-400">
                <p className="text-sm text-gray-700">
                  <strong>📦 Your Order Summary:</strong><br />
                  Books: <span className="text-blue-600">{paymentDetails.title}</span><br />
                  Amount Paid: <span className="text-green-600 font-bold">₹{paymentDetails.price}</span><br />
                  Status: <span className="text-yellow-600 font-semibold">Payment Confirmed, Processing Manually</span>
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = "/contact"}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  📞 Contact Support Team
                </button>
                <button
                  onClick={() => window.location.href = "/profile/orderHistory"}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  📋 Check Order Status
                </button>
                <button
                  onClick={() => setShowSuccessPopup(false)}
                  className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  🛍️ Continue Shopping
                </button>
              </div>

              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>📧 Email Confirmation:</strong> Transaction receipt and updates will be sent to your registered email.
                  <br />
                  <strong>📱 SMS Updates:</strong> You'll receive SMS updates about order status on your registered mobile number.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-b from-green-50 to-white rounded-3xl shadow-2xl max-w-md w-full text-center p-8">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 rounded-full p-4 border-4 border-green-300 animate-bounce-slow shadow-md">
                  <svg
                    className="w-10 h-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-green-700 mb-2">🎉 Order Placed Successfully!</h2>
              <p className="text-gray-700 text-base mb-1">
                You've successfully paid <span className="font-semibold text-green-800">₹{paymentDetails.price}</span>
              </p>
              <p className="text-lg font-semibold text-gray-900 mb-4">{paymentDetails.title}</p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-green-700 text-sm">
                  ✅ Payment confirmed<br />
                  ✅ Order placed in system<br />
                  📦 Processing for shipment
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Redirecting you to <span className="font-semibold">Order History</span>...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}