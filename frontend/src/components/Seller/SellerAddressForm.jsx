// // import React, { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";

// // const SellerAddressForm = () => {
// //   const [addressData, setAddressData] = useState({
// //     street: "",
// //     village: "",
// //     city: "",
// //     state: "",
// //     pincode: "",
// //     country: "India"
// //   });

// //   const navigate = useNavigate();

// //   // Load saved address data
// //   useEffect(() => {
// //     const sellerInfo = JSON.parse(localStorage.getItem("sellerDetails"));

// //     if (sellerInfo && sellerInfo.pickupAddress) {
// //       setAddressData((prev) => ({
// //         ...prev,
// //         ...sellerInfo.pickupAddress,
// //       }));
// //     }
// //   }, []);

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setAddressData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   const handleSave = (e) => {
// //     e.preventDefault();

// //     const sellerDetails = JSON.parse(localStorage.getItem("sellerDetails")) || {};
// //     sellerDetails.pickupAddress = addressData;
// //     localStorage.setItem("sellerDetails", JSON.stringify(sellerDetails));

// //     navigate("/seller/form-preview");
// //   };

// //   return (
// //     <div className="bg-zinc-900/60 min-h-screen flex items-center justify-center px-4 py-12 text-white">
// //       <div className="w-full max-w-2xl bg-zinc-800 rounded-xl p-6 sm:p-8 shadow-lg border border-yellow-500">
// //         <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-4 text-center">
// //           Pickup Address Details
// //         </h2>
// //         <p className="text-center text-zinc-400 mb-6">
// //           Step 3 of 4 — Enter pickup location for shipping.
// //         </p>

// //         <form onSubmit={handleSave} className="space-y-5">
// //           <div>
// //             <label className="block text-sm font-medium text-yellow-300">
// //               Street / Building / Landmark
// //             </label>
// //             <input
// //               type="text"
// //               name="street"
// //               value={addressData.street}
// //               onChange={handleChange}
// //               placeholder="e.g. 5th Lane, Near Book Tower"
// //               required
// //               className="w-full mt-1 px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
// //             />
// //           </div>

// //           <div>
// //             <label className="block text-sm font-medium text-yellow-300">
// //               Village / Town (for small business or rural area)
// //             </label>
// //             <input
// //               type="text"
// //               name="village"
// //               value={addressData.village}
// //               onChange={handleChange}
// //               placeholder="e.g. Shirpur or leave blank"
// //               className="w-full mt-1 px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
// //             />
// //           </div>

// //           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //             <div>
// //               <label className="block text-sm font-medium text-yellow-300">City</label>
// //               <input
// //                 type="text"
// //                 name="city"
// //                 value={addressData.city}
// //                 onChange={handleChange}
// //                 required
// //                 placeholder="e.g. Amravati"
// //                 className="w-full mt-1 px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-sm font-medium text-yellow-300">State</label>
// //               <input
// //                 type="text"
// //                 name="state"
// //                 value={addressData.state}
// //                 onChange={handleChange}
// //                 required
// //                 placeholder="e.g. Maharashtra"
// //                 className="w-full mt-1 px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
// //               />
// //             </div>
// //           </div>

// //           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //             <div>
// //               <label className="block text-sm font-medium text-yellow-300">Pincode</label>
// //               <input
// //                 type="text"
// //                 name="pincode"
// //                 value={addressData.pincode}
// //                 onChange={handleChange}
// //                 required
// //                 placeholder="e.g. 444601"
// //                 pattern="^\d{6}$"
// //                 title="Enter a valid 6-digit pincode"
// //                 className="w-full mt-1 px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-sm font-medium text-yellow-300">Country</label>
// //               <input
// //                 type="text"
// //                 name="country"
// //                 value={addressData.country}
// //                 onChange={handleChange}
// //                 required
// //                 className="w-full mt-1 px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
// //               />
// //             </div>
// //           </div>

// //           <button
// //             type="submit"
// //             className="w-full py-3 mt-4 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition duration-300"
// //           >
// //             Save & Continue →
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default SellerAddressForm;





// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Alert from "../Alert/Alert";
// import { useAlert } from "../Alert/useAlert";

// const SellerAddressForm = () => {
//   const [addressData, setAddressData] = useState({
//     street: "",
//     village: "",
//     city: "",
//     state: "",
//     pincode: "",
//     country: "India"
//   });

//   const navigate = useNavigate();
//   const { alert, hideAlert, success, error, warning } = useAlert();

//   useEffect(() => {
//     const sellerInfo = JSON.parse(localStorage.getItem("sellerDetails"));

//     if (sellerInfo && sellerInfo.pickupAddress) {
//       setAddressData((prev) => ({
//         ...prev,
//         ...sellerInfo.pickupAddress,
//       }));
//     }
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setAddressData((prev) => ({ ...prev, [name]: value }));
//   };

//   const validatePincode = (pincode) => {
//     const pincodeRegex = /^\d{6}$/;
//     return pincodeRegex.test(pincode);
//   };

//   const handleSave = (e) => {
//     e.preventDefault();

//     if (!addressData.street.trim()) {
//       error("Street address is required", "Missing Field");
//       return;
//     }

//     if (!addressData.city.trim()) {
//       error("City is required", "Missing Field");
//       return;
//     }

//     if (!addressData.state.trim()) {
//       error("State is required", "Missing Field");
//       return;
//     }

//     if (!validatePincode(addressData.pincode)) {
//       error("Please enter a valid 6-digit pincode", "Invalid Pincode");
//       return;
//     }

//     if (!addressData.country.trim()) {
//       error("Country is required", "Missing Field");
//       return;
//     }

//     const sellerDetails = JSON.parse(localStorage.getItem("sellerDetails")) || {};
//     sellerDetails.pickupAddress = addressData;
//     localStorage.setItem("sellerDetails", JSON.stringify(sellerDetails));

//     success("Pickup address saved successfully!", "Step 3 Complete");
//     setTimeout(() => navigate("/seller/form-preview"), 1000);
//   };

//   const handleBack = () => {
//     const sellerDetails = JSON.parse(localStorage.getItem("sellerDetails")) || {};
//     sellerDetails.pickupAddress = addressData;
//     localStorage.setItem("sellerDetails", JSON.stringify(sellerDetails));
    
//     warning("Your changes have been saved", "Going Back");
//     setTimeout(() => navigate("/seller/bank-details"), 800);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white px-4 py-10 flex justify-center items-center">
//       {alert && (
//         <Alert
//           type={alert.type}
//           title={alert.title}
//           message={alert.message}
//           onClose={hideAlert}
//           autoClose={alert.autoClose}
//           duration={alert.duration}
//           position={alert.position}
//         />
//       )}

//       <div className="w-full max-w-5xl bg-zinc-900/50 rounded-3xl px-6 sm:px-12 py-10 shadow-2xl border border-zinc-700">
        
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-md">
//             Pickup Address
//           </h1>
//           <p className="text-zinc-400 mt-3 text-sm sm:text-base italic">
//             Where we'll collect your books for shipping
//           </p>
//           <hr className="mt-6 border-zinc-700 w-3/4 mx-auto rounded-full" />
//         </div>

//         {/* Progress Indicator */}
//         <div className="mb-10">
//           <div className="flex items-center justify-between mb-3">
//             <span className="text-xs text-yellow-400 font-semibold uppercase tracking-wider">Progress</span>
//             <span className="text-xs text-zinc-400 font-medium">Step 3 of 4 — Pickup Location</span>
//           </div>
//           <div className="w-full bg-zinc-700/50 rounded-full h-2.5 overflow-hidden">
//             <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2.5 rounded-full transition-all duration-700 ease-out shadow-lg shadow-yellow-400/50" style={{ width: '75%' }}></div>
//           </div>
          
//           {/* Step Dots */}
//           <div className="flex justify-between mt-4">
//             <div className="flex flex-col items-center">
//               <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
//                 <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                 </svg>
//               </div>
//               <span className="text-xs text-green-400 mt-2 font-medium">Complete</span>
//             </div>
//             <div className="flex-1 h-0.5 bg-green-500 self-center mx-2 mt-5"></div>
//             <div className="flex flex-col items-center">
//               <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
//                 <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//                 </svg>
//               </div>
//               <span className="text-xs text-green-400 mt-2 font-medium">Complete</span>
//             </div>
//             <div className="flex-1 h-0.5 bg-green-500 self-center mx-2 mt-5"></div>
//             <div className="flex flex-col items-center">
//               <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-400/50">
//                 <span className="text-black font-bold">3</span>
//               </div>
//               <span className="text-xs text-yellow-400 mt-2 font-medium">Address</span>
//             </div>
//             <div className="flex-1 h-0.5 bg-zinc-700 self-center mx-2 mt-5"></div>
//             <div className="flex flex-col items-center">
//               <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
//                 <span className="text-zinc-400 font-bold">4</span>
//               </div>
//               <span className="text-xs text-zinc-500 mt-2 font-medium">Review</span>
//             </div>
//           </div>
//         </div>

//         <form onSubmit={handleSave} className="space-y-7">
//           {/* Info Notice */}
//           <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-2xl p-5 flex items-start gap-4">
//             <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <div>
//               <h4 className="text-sm font-semibold text-yellow-300 mb-1">Important Information</h4>
//               <p className="text-xs text-yellow-200/80 leading-relaxed">
//                 This is the address where our courier partners will pick up your sold items. Make sure it's accurate and accessible during business hours.
//               </p>
//             </div>
//           </div>

//           {/* Street Address */}
//           <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300">
//             <label className="block text-base font-semibold text-yellow-300 mb-4 flex items-center gap-2">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//               </svg>
//               Street / Building / Landmark <span className="text-red-400 ml-1">*</span>
//             </label>
//             <textarea
//               name="street"
//               value={addressData.street}
//               onChange={handleChange}
//               placeholder="e.g. Building No. 5, 2nd Floor, Near Book Tower"
//               required
//               rows={3}
//               className="w-full px-4 py-3 bg-zinc-700/80 border border-zinc-600 rounded-xl text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all resize-none"
//             />
//             <p className="text-xs text-zinc-400 mt-2">Provide detailed address including building name, floor, and nearby landmarks</p>
//           </div>

//           {/* Village/Town (Optional) */}
//           <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300">
//             <label className="block text-base font-semibold text-yellow-300 mb-4 flex items-center gap-2">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//               </svg>
//               Village / Town <span className="text-zinc-500 text-xs">(Optional)</span>
//             </label>
//             <input
//               type="text"
//               name="village"
//               value={addressData.village}
//               onChange={handleChange}
//               placeholder="e.g. Shirpur or leave blank if not applicable"
//               className="w-full px-4 py-3 bg-zinc-700/80 border border-zinc-600 rounded-xl text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
//             />
//             <p className="text-xs text-zinc-400 mt-2">For rural areas or small towns - skip if you're in a major city</p>
//           </div>

//           {/* City and State */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300">
//               <label className="block text-base font-semibold text-yellow-300 mb-4 flex items-center gap-2">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                 </svg>
//                 City <span className="text-red-400 ml-1">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="city"
//                 value={addressData.city}
//                 onChange={handleChange}
//                 required
//                 placeholder="e.g. Mumbai"
//                 className="w-full px-4 py-3 bg-zinc-700/80 border border-zinc-600 rounded-xl text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
//               />
//             </div>

//             <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300">
//               <label className="block text-base font-semibold text-yellow-300 mb-4 flex items-center gap-2">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
//                 </svg>
//                 State <span className="text-red-400 ml-1">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="state"
//                 value={addressData.state}
//                 onChange={handleChange}
//                 required
//                 placeholder="e.g. Maharashtra"
//                 className="w-full px-4 py-3 bg-zinc-700/80 border border-zinc-600 rounded-xl text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
//               />
//             </div>
//           </div>

//           {/* Pincode and Country */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300">
//               <label className="block text-base font-semibold text-yellow-300 mb-4 flex items-center gap-2">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
//                 </svg>
//                 Pincode <span className="text-red-400 ml-1">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="pincode"
//                 value={addressData.pincode}
//                 onChange={handleChange}
//                 required
//                 placeholder="e.g. 444601"
//                 pattern="^\d{6}$"
//                 maxLength={6}
//                 className="w-full px-4 py-3 bg-zinc-700/80 border border-zinc-600 rounded-xl text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all font-mono text-lg tracking-wider"
//                 inputMode="numeric"
//               />
//               <p className="text-xs text-zinc-400 mt-2">6-digit postal code</p>
//             </div>

//             <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300">
//               <label className="block text-base font-semibold text-yellow-300 mb-4 flex items-center gap-2">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 Country <span className="text-red-400 ml-1">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="country"
//                 value={addressData.country}
//                 onChange={handleChange}
//                 required
//                 placeholder="India"
//                 className="w-full px-4 py-3 bg-zinc-700/80 border border-zinc-600 rounded-xl text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
//               />
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-4 pt-4">
//             <button
//               type="button"
//               onClick={handleBack}
//               className="flex-1 py-3 px-6 bg-zinc-700 text-white font-semibold rounded-xl hover:bg-zinc-600 transition-all duration-300 border border-zinc-600 flex items-center justify-center gap-2"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//               </svg>
//               Previous Step
//             </button>
//             <button
//               type="submit"
//               className="flex-1 py-3 px-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-yellow-400/50 transform hover:scale-[1.02] flex items-center justify-center gap-2"
//             >
//               Review & Submit
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//               </svg>
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SellerAddressForm;



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../Alert/Alert";
import { useAlert } from "../Alert/useAlert";

const SellerAddressForm = () => {
  const [addressData, setAddressData] = useState({
    street: "",
    village: "",
    city: "",
    state: "",
    pincode: "",
    country: "India"
  });

  const navigate = useNavigate();
  const { alert, hideAlert, success, error, warning } = useAlert();

  useEffect(() => {
    const sellerInfo = JSON.parse(localStorage.getItem("sellerDetails"));

    if (sellerInfo && sellerInfo.pickupAddress) {
      setAddressData((prev) => ({
        ...prev,
        ...sellerInfo.pickupAddress,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePincode = (pincode) => {
    const pincodeRegex = /^\d{6}$/;
    return pincodeRegex.test(pincode);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!addressData.street.trim()) {
      error("Street address is required", "Missing Field");
      return;
    }

    if (!addressData.city.trim()) {
      error("City is required", "Missing Field");
      return;
    }

    if (!addressData.state.trim()) {
      error("State is required", "Missing Field");
      return;
    }

    if (!validatePincode(addressData.pincode)) {
      error("Please enter a valid 6-digit pincode", "Invalid Pincode");
      return;
    }

    if (!addressData.country.trim()) {
      error("Country is required", "Missing Field");
      return;
    }

    const sellerDetails = JSON.parse(localStorage.getItem("sellerDetails")) || {};
    sellerDetails.pickupAddress = addressData;
    localStorage.setItem("sellerDetails", JSON.stringify(sellerDetails));

    success("Pickup address saved successfully!", "Step 3 Complete");
    setTimeout(() => navigate("/seller/form-preview"), 1000);
  };

  const handleBack = () => {
    const sellerDetails = JSON.parse(localStorage.getItem("sellerDetails")) || {};
    sellerDetails.pickupAddress = addressData;
    localStorage.setItem("sellerDetails", JSON.stringify(sellerDetails));
    
    navigate("/seller/bank-details");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white px-4 py-8 flex justify-center items-center">
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={hideAlert}
          autoClose={alert.autoClose}
          duration={alert.duration}
          position={alert.position}
        />
      )}

      <div className="w-full max-w-4xl bg-zinc-900/50 rounded-3xl px-6 sm:px-10 py-8 shadow-2xl border border-zinc-700">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-md">
            Pickup Address
          </h1>
          <p className="text-zinc-400 mt-2 text-sm italic">
            Where we'll collect your books for shipping
          </p>
          <hr className="mt-4 border-zinc-700 w-3/4 mx-auto rounded-full" />
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-yellow-400 font-semibold uppercase tracking-wider">Progress</span>
            <span className="text-xs text-zinc-400 font-medium">Step 3 of 4 — Pickup Location</span>
          </div>
          <div className="w-full bg-zinc-700/50 rounded-full h-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2.5 rounded-full transition-all duration-700 ease-out shadow-lg shadow-yellow-400/50" style={{ width: '75%' }}></div>
          </div>
          
          {/* Step Dots */}
          <div className="flex justify-between mt-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xs text-green-400 mt-2 font-medium">Complete</span>
            </div>
            <div className="flex-1 h-0.5 bg-green-500 self-center mx-2 mt-5"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xs text-green-400 mt-2 font-medium">Complete</span>
            </div>
            <div className="flex-1 h-0.5 bg-green-500 self-center mx-2 mt-5"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-400/50">
                <span className="text-black font-bold">3</span>
              </div>
              <span className="text-xs text-yellow-400 mt-2 font-medium">Address</span>
            </div>
            <div className="flex-1 h-0.5 bg-zinc-700 self-center mx-2 mt-5"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                <span className="text-zinc-400 font-bold">4</span>
              </div>
              <span className="text-xs text-zinc-500 mt-2 font-medium">Review</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Info Notice */}
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-2xl p-5 flex items-start gap-4">
            <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-semibold text-yellow-300 mb-1">Important Information</h4>
              <p className="text-xs text-yellow-200/80 leading-relaxed">
                This is the address where our courier partners will pick up your sold items. Make sure it's accurate and accessible during business hours.
              </p>
            </div>
          </div>

          {/* Street Address */}
          <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300">
            <label className="block text-base font-semibold text-yellow-300 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Street / Building / Landmark <span className="text-red-400 ml-1">*</span>
            </label>
            <textarea
              name="street"
              value={addressData.street}
              onChange={handleChange}
              placeholder="e.g. Building No. 5, 2nd Floor, Near Book Tower"
              required
              rows={3}
              className="w-full px-4 py-3 bg-zinc-700/80 border border-zinc-600 rounded-xl text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all resize-none"
            />
            <p className="text-xs text-zinc-400 mt-2">Provide detailed address including building name, floor, and nearby landmarks</p>
          </div>

          {/* Village/Town (Optional) */}
          <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300">
            <label className="block text-base font-semibold text-yellow-300 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Village / Town <span className="text-zinc-500 text-xs">(Optional)</span>
            </label>
            <input
              type="text"
              name="village"
              value={addressData.village}
              onChange={handleChange}
              placeholder="e.g. Shirpur or leave blank if not applicable"
              className="w-full px-4 py-3 bg-zinc-700/80 border border-zinc-600 rounded-xl text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
            />
            <p className="text-xs text-zinc-400 mt-2">For rural areas or small towns - skip if you're in a major city</p>
          </div>

          {/* City and State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300">
              <label className="block text-base font-semibold text-yellow-300 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                City <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={addressData.city}
                onChange={handleChange}
                required
                placeholder="e.g. Mumbai"
                className="w-full px-4 py-3 bg-zinc-700/80 border border-zinc-600 rounded-xl text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
              />
            </div>

            <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300">
              <label className="block text-base font-semibold text-yellow-300 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                State <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={addressData.state}
                onChange={handleChange}
                required
                placeholder="e.g. Maharashtra"
                className="w-full px-4 py-3 bg-zinc-700/80 border border-zinc-600 rounded-xl text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
              />
            </div>
          </div>

          {/* Pincode and Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300">
              <label className="block text-base font-semibold text-yellow-300 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Pincode <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="text"
                name="pincode"
                value={addressData.pincode}
                onChange={handleChange}
                required
                placeholder="e.g. 444601"
                pattern="^\d{6}$"
                maxLength={6}
                className="w-full px-4 py-3 bg-zinc-700/80 border border-zinc-600 rounded-xl text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all font-mono text-lg tracking-wider"
                inputMode="numeric"
              />
              <p className="text-xs text-zinc-400 mt-2">6-digit postal code</p>
            </div>

            <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300">
              <label className="block text-base font-semibold text-yellow-300 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Country <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="text"
                name="country"
                value={addressData.country}
                onChange={handleChange}
                required
                placeholder="India"
                className="w-full px-4 py-3 bg-zinc-700/80 border border-zinc-600 rounded-xl text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-3 px-6 bg-zinc-700 text-white font-semibold rounded-xl hover:bg-zinc-600 transition-all duration-300 border border-zinc-600 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Previous Step
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-yellow-400/50 transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              Review & Submit
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerAddressForm;
