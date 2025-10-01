// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { FaRupeeSign, FaArrowLeft } from "react-icons/fa";

// export default function COD_Page({ orderDetails, onBack, navigate }) {
//   const [captcha, setCaptcha] = useState("");
//   const [userCaptcha, setUserCaptcha] = useState("");
//   const [showPopup, setShowPopup] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const canvasRef = useRef(null);

//   // Extract order details
//   const payableAmount = orderDetails?.payable || 0;
//   const handlingFee = 20;
//   const totalAmount = payableAmount + handlingFee;
//   const address = orderDetails?.address || {};
//   const items = orderDetails?.items || [];

//   useEffect(() => {
//     generateCaptcha();
//     window.scrollTo(0, 0);
//   }, []);

//   const generateCaptcha = () => {
//     const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
//     let code = "";
//     for (let i = 0; i < 6; i++) {
//       code += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     setCaptcha(code);

//     const canvas = canvasRef.current;
//     if (!canvas) return;
    
//     const ctx = canvas.getContext("2d");

//     // Clear canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
    
//     // Background
//     ctx.fillStyle = "#f8fafc";
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     // Add noise lines
//     for (let i = 0; i < 8; i++) {
//       ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
//       ctx.lineWidth = Math.random() * 2 + 1;
//       ctx.beginPath();
//       ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
//       ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
//       ctx.stroke();
//     }

//     // Draw captcha text
//     ctx.font = "bold 28px Arial";
//     ctx.textBaseline = "middle";
//     ctx.textAlign = "center";

//     for (let i = 0; i < code.length; i++) {
//       const angle = (Math.random() - 0.5) * 0.4; // Random rotation
//       const x = 20 + i * 25;
//       const y = canvas.height / 2 + (Math.random() - 0.5) * 10;
      
//       ctx.save();
//       ctx.translate(x, y);
//       ctx.rotate(angle);
//       ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 30%)`;
//       ctx.fillText(code[i], 0, 0);
//       ctx.restore();
//     }

//     // Add border
//     ctx.strokeStyle = "#e2e8f0";
//     ctx.lineWidth = 2;
//     ctx.strokeRect(0, 0, canvas.width, canvas.height);
//   };

//   // ✅ Helper function to build address line from user's address structure
//   const buildAddressLine = (address) => {
//     const parts = [];
    
//     // Handle both new and old address formats
//     if (address.addressLine1) {
//       parts.push(address.addressLine1);
//     } else {
//       // Build from old format
//       if (address.houseNumber) parts.push(address.houseNumber);
//       if (address.streetName) parts.push(address.streetName);
//       if (address.locality) parts.push(address.locality);
//     }
    
//     return parts.join(", ") || "Address not provided";
//   };

//   const handlePlaceOrder = async () => {
//     // Validate captcha
//     if (userCaptcha.trim().toUpperCase() !== captcha) {
//       setError("❌ Incorrect captcha. Please try again.");
//       generateCaptcha();
//       setUserCaptcha("");
//       return;
//     }

//     // ✅ Build complete address from user data, handling both old and new formats
//     const fullName = address.fullName || "Customer Name";
//     const phone = address.phone || orderDetails.userPhone || "Phone not provided";
//     const addressLine1 = address.addressLine1 || buildAddressLine(address);
//     const city = address.city || address.villageOrTown || "City not provided";
//     const state = address.state || "State not provided";
//     const postalCode = address.postalCode || address.pincode || "000000";

//     // Validate required fields
//     if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
//       setError("❌ Address information is incomplete. Please update your profile with complete address details.");
//       return;
//     }

//     setIsLoading(true);
//     setError("");

//     try {
//       // Place order in database
//       const orderResponse = await axios.post(
//         "http://localhost:3000/api/v1/place-order",
//         {
//           order: items.map(book => ({
//             book: book._id,
//             paymentStatus: "Pending",
//             orderStatus: "Order Placed",
//             paymentMethod: "COD",
//           })),
//           shippingAddress: {
//             fullName: fullName,
//             phone: phone,
//             addressLine1: addressLine1,
//             addressLine2: address.addressLine2 || address.landmark || "",
//             city: city,
//             state: state,
//             postalCode: postalCode,
//             country: address.country || "India",
//           },
//           amountPayable: totalAmount,
//           discount: orderDetails.discountApplied || 0,
//           handlingFee: handlingFee || 0,
//         },
//         {
//           headers: {
//             id: localStorage.getItem("id"),
//             authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       if (orderResponse.status === 200 || orderResponse.status === 201) {
//         // Show success popup
//         setShowPopup(true);
        
//         // Redirect after 5 seconds
//         setTimeout(() => {
//           if (navigate) {
//             navigate("/profile/orderHistory");
//           } else {
//             window.location.href = "/profile/orderHistory";
//           }
//         }, 5000);
//       } else {
//         throw new Error("Failed to place order");
//       }

//     } catch (err) {
//       console.error("COD Order placement failed:", err);
//       if (err.response?.data?.message) {
//         setError(`❌ ${err.response.data.message}`);
//       } else if (err.response?.data?.errors) {
//         setError(`❌ ${err.response.data.errors.join(", ")}`);
//       } else {
//         setError("❌ Failed to place order. Please try again.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-xl p-6 text-black max-w-3xl mx-auto">
//       {/* Back Button */}
//       <button
//         onClick={onBack}
//         className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors"
//       >
//         <FaArrowLeft size={16} />
//         Back to Payment Options
//       </button>

//       <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">
//         🏠 Cash on Delivery Confirmation
//       </h2>

//       {/* Order Summary */}
//       <div className="bg-gray-50 p-4 rounded-lg mb-6">
//         <h3 className="font-semibold text-lg mb-3">📋 Order Summary</h3>
//         {items.map((book, idx) => (
//           <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
//             <span className="font-medium">{book.title}</span>
//             <span className="text-gray-600">₹{book.price}</span>
//           </div>
//         ))}
        
//         <div className="mt-4 pt-3 border-t border-gray-300">
//           <div className="flex justify-between">
//             <span>Subtotal:</span>
//             <span>₹{orderDetails.payable}</span>
//           </div>
//           {orderDetails.discountApplied > 0 && (
//             <div className="flex justify-between text-green-600">
//               <span>Discount:</span>
//               <span>-₹{orderDetails.discountApplied}</span>
//             </div>
//           )}
//           <div className="flex justify-between">
//             <span>Handling Fee:</span>
//             <span>₹{handlingFee}</span>
//           </div>
//           <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-400">
//             <span>Total Amount:</span>
//             <span className="text-green-600">₹{totalAmount}</span>
//           </div>
//         </div>
//       </div>

//       {/* Delivery Address */}
//       <div className="bg-blue-50 p-4 rounded-lg mb-6">
//         <h3 className="font-semibold text-lg mb-2">🚚 Delivery Address</h3>
//         <p className="text-gray-700">
//           <strong>{address.fullName || "Customer Name"}</strong><br />
//           {buildAddressLine(address)}<br />
//           {address.city || address.villageOrTown}, {address.state} - {address.postalCode || address.pincode}<br />
//           📞 {address.phone || orderDetails.userPhone || "Phone not provided"}
//         </p>
        
//         {(!address.fullName || !address.phone || !address.city || !address.state) && (
//           <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
//             <p className="text-yellow-800 text-sm">
//               ⚠️ Some address details are missing. Please update your profile for complete address information.
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Captcha Section */}
//       <div className="mb-6">
//         <h3 className="font-semibold text-lg mb-3">🔐 Security Verification</h3>
//         <div className="flex flex-col items-center">
//           <div className="flex items-center gap-3 mb-3">
//             <canvas
//               ref={canvasRef}
//               width="180"
//               height="60"
//               className="border-2 border-gray-300 rounded-lg bg-gray-50 shadow-sm"
//             ></canvas>
//             <button
//               onClick={generateCaptcha}
//               className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
//             >
//               🔄 Refresh
//             </button>
//           </div>
          
//           <input
//             type="text"
//             placeholder="Enter the captcha code above"
//             value={userCaptcha}
//             onChange={(e) => {
//               setUserCaptcha(e.target.value);
//               setError(""); // Clear error when user types
//             }}
//             className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full max-w-xs text-center font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
//             maxLength="6"
//           />
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
//           {error}
//         </div>
//       )}

//       {/* COD Info */}
//       <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
//         <h4 className="font-semibold text-yellow-800 mb-2">📝 COD Instructions:</h4>
//         <ul className="text-sm text-yellow-700 space-y-1">
//           <li>• Pay ₹{totalAmount} to the delivery person</li>
//           <li>• Have exact change ready if possible</li>
//           <li>• Order will be delivered within 3-5 business days</li>
//           <li>• You can track your order in Order History</li>
//         </ul>
//       </div>

//       {/* Place Order Button */}
//       <button
//         onClick={handlePlaceOrder}
//         disabled={isLoading || userCaptcha.length !== 6}
//         className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
//           isLoading || userCaptcha.length !== 6
//             ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//             : "bg-green-500 text-white hover:bg-green-600 cursor-pointer shadow-lg hover:shadow-xl"
//         }`}
//       >
//         {isLoading ? (
//           <span className="flex items-center justify-center gap-2">
//             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//             Placing Order...
//           </span>
//         ) : (
//           "✅ Confirm & Place COD Order"
//         )}
//       </button>

//       {/* Success Popup */}
//       {showPopup && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
//           <div className="bg-gradient-to-b from-green-50 to-white rounded-3xl shadow-2xl max-w-md w-full text-center p-8 animate-pulse">
//             <div className="flex justify-center mb-4">
//               <div className="bg-green-100 rounded-full p-4 border-4 border-green-300 shadow-md">
//                 <svg
//                   className="w-12 h-12 text-green-600"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="3"
//                   viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                 </svg>
//               </div>
//             </div>
            
//             <h2 className="text-2xl font-bold text-green-700 mb-3">
//               🎉 Order Placed Successfully!
//             </h2>
            
//             <div className="text-gray-700 mb-4">
//               <p className="mb-2">
//                 Order Total: <span className="font-bold text-green-800">₹{totalAmount}</span>
//               </p>
//               <p className="text-sm">
//                 Books: {items.map(book => book.title).join(", ")}
//               </p>
//             </div>
            
//             <div className="bg-yellow-100 p-3 rounded-lg mb-4">
//               <p className="text-sm text-yellow-800">
//                 💰 Pay ₹{totalAmount} to delivery person
//               </p>
//             </div>
            
//             <p className="text-sm text-gray-500">
//               Redirecting to <span className="font-semibold">Order History</span> in 5 seconds...
//             </p>
            
//             <div className="mt-4">
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{width: "100%"}}></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaRupeeSign, FaArrowLeft } from "react-icons/fa";

export default function COD_Page({ orderDetails, onBack, navigate }) {
  const [captcha, setCaptcha] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  // Extract order details
  const payableAmount = orderDetails?.payable || 0;
  const handlingFee = 20;
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

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise lines
    for (let i = 0; i < 8; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
      ctx.lineWidth = Math.random() * 2 + 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Draw captcha text
    ctx.font = "bold 28px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    for (let i = 0; i < code.length; i++) {
      const angle = (Math.random() - 0.5) * 0.4; // Random rotation
      const x = 20 + i * 25;
      const y = canvas.height / 2 + (Math.random() - 0.5) * 10;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 30%)`;
      ctx.fillText(code[i], 0, 0);
      ctx.restore();
    }

    // Add border
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  };

  // ✅ Helper function to build address line from user's address structure
  const buildAddressLine = (address) => {
    const parts = [];
    
    // Handle both new and old address formats
    if (address.addressLine1) {
      parts.push(address.addressLine1);
    } else {
      // Build from old format
      if (address.houseNumber) parts.push(address.houseNumber);
      if (address.streetName) parts.push(address.streetName);
      if (address.locality) parts.push(address.locality);
    }
    
    return parts.join(", ") || "Address not provided";
  };

  const handlePlaceOrder = async () => {
    // Validate captcha
    if (userCaptcha.trim().toUpperCase() !== captcha) {
      setError("❌ Incorrect captcha. Please try again.");
      generateCaptcha();
      setUserCaptcha("");
      return;
    }

    // ✅ Build complete address from user data, handling both old and new formats
    const fullName = address.fullName || "Customer Name";
    const phone = address.phone || orderDetails.userPhone || "Phone not provided";
    const addressLine1 = address.addressLine1 || buildAddressLine(address);
    const city = address.city || address.villageOrTown || "City not provided";
    const state = address.state || "State not provided";
    const postalCode = address.postalCode || address.pincode || "000000";

    // Validate required fields
    if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
      setError("❌ Address information is incomplete. Please update your profile with complete address details.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Place order in database
      const orderResponse = await axios.post(
        "http://localhost:3000/api/v1/place-order",
        {
          order: items.map(book => ({
            book: book._id,
            seller: book.seller, // ✅ ADDED: Include seller from book
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
        // Show success popup
        setShowPopup(true);
        
        // Redirect after 5 seconds
        setTimeout(() => {
          if (navigate) {
            navigate("/profile/orderHistory");
          } else {
            window.location.href = "/profile/orderHistory";
          }
        }, 5000);
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
    <div className="bg-white rounded-2xl shadow-xl p-6 text-black max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors"
      >
        <FaArrowLeft size={16} />
        Back to Payment Options
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">
        🏠 Cash on Delivery Confirmation
      </h2>

      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-lg mb-3">📋 Order Summary</h3>
        {items.map((book, idx) => (
          <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
            <span className="font-medium">{book.title}</span>
            <span className="text-gray-600">₹{book.price}</span>
          </div>
        ))}
        
        <div className="mt-4 pt-3 border-t border-gray-300">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{orderDetails.payable}</span>
          </div>
          {orderDetails.discountApplied > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount:</span>
              <span>-₹{orderDetails.discountApplied}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Handling Fee:</span>
            <span>₹{handlingFee}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-400">
            <span>Total Amount:</span>
            <span className="text-green-600">₹{totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-lg mb-2">🚚 Delivery Address</h3>
        <p className="text-gray-700">
          <strong>{address.fullName || "Customer Name"}</strong><br />
          {buildAddressLine(address)}<br />
          {address.city || address.villageOrTown}, {address.state} - {address.postalCode || address.pincode}<br />
          📞 {address.phone || orderDetails.userPhone || "Phone not provided"}
        </p>
        
        {(!address.fullName || !address.phone || !address.city || !address.state) && (
          <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
            <p className="text-yellow-800 text-sm">
              ⚠️ Some address details are missing. Please update your profile for complete address information.
            </p>
          </div>
        )}
      </div>

      {/* Captcha Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3">🔐 Security Verification</h3>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3 mb-3">
            <canvas
              ref={canvasRef}
              width="180"
              height="60"
              className="border-2 border-gray-300 rounded-lg bg-gray-50 shadow-sm"
            ></canvas>
            <button
              onClick={generateCaptcha}
              className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              🔄 Refresh
            </button>
          </div>
          
          <input
            type="text"
            placeholder="Enter the captcha code above"
            value={userCaptcha}
            onChange={(e) => {
              setUserCaptcha(e.target.value);
              setError(""); // Clear error when user types
            }}
            className="border-2 border-gray-300 rounded-lg px-4 py-3 w-full max-w-xs text-center font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            maxLength="6"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* COD Info */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
        <h4 className="font-semibold text-yellow-800 mb-2">📝 COD Instructions:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Pay ₹{totalAmount} to the delivery person</li>
          <li>• Have exact change ready if possible</li>
          <li>• Order will be delivered within 3-5 business days</li>
          <li>• You can track your order in Order History</li>
        </ul>
      </div>

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={isLoading || userCaptcha.length !== 6}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
          isLoading || userCaptcha.length !== 6
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-green-500 text-white hover:bg-green-600 cursor-pointer shadow-lg hover:shadow-xl"
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Placing Order...
          </span>
        ) : (
          "✅ Confirm & Place COD Order"
        )}
      </button>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gradient-to-b from-green-50 to-white rounded-3xl shadow-2xl max-w-md w-full text-center p-8 animate-pulse">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4 border-4 border-green-300 shadow-md">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-green-700 mb-3">
              🎉 Order Placed Successfully!
            </h2>
            
            <div className="text-gray-700 mb-4">
              <p className="mb-2">
                Order Total: <span className="font-bold text-green-800">₹{totalAmount}</span>
              </p>
              <p className="text-sm">
                Books: {items.map(book => book.title).join(", ")}
              </p>
            </div>
            
            <div className="bg-yellow-100 p-3 rounded-lg mb-4">
              <p className="text-sm text-yellow-800">
                💰 Pay ₹{totalAmount} to delivery person
              </p>
            </div>
            
            <p className="text-sm text-gray-500">
              Redirecting to <span className="font-semibold">Order History</span> in 5 seconds...
            </p>
            
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{width: "100%"}}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}