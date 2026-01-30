// // import { useEffect, useState } from "react";

// // export default function Step1_Address({ onNext }) {
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     phone: "",
// //     city: "",
// //     address: "",
// //     pincode: "",
// //   });

// //   useEffect(() => {
// //     const saved = localStorage.getItem("userAddress");
// //     if (saved) setFormData(JSON.parse(saved));
// //   }, []);

// //   const handleChange = (e) =>
// //     setFormData({ ...formData, [e.target.name]: e.target.value });

// //   const handleSubmit = () => {
// //     localStorage.setItem("userAddress", JSON.stringify(formData));
// //     onNext(formData);
// //   };

// //   return (
// //     <div className="bg-white text-zinc-900 p-10 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] max-w-2xl mx-auto mt-10">
// //       {/* Step Title */}
// //       <h2 className="text-4xl font-bold mb-3 text-center text-zinc-800">
// //         Shipping Information
// //       </h2>
// //       <p className="mb-8 text-center text-zinc-600 text-sm">
// //         Enter your delivery address to proceed with the order.
// //       </p>

// //       <div className="grid grid-cols-1 gap-5">
// //         {[
// //           { name: "name", placeholder: "Full Name" },
// //           { name: "phone", placeholder: "Phone Number" },
// //           { name: "city", placeholder: "City" },
// //           { name: "address", placeholder: "Complete Address" },
// //           { name: "pincode", placeholder: "Pincode" },
// //         ].map(({ name, placeholder }) => (
// //           <input
// //             key={name}
// //             name={name}
// //             placeholder={placeholder}
// //             value={formData[name]}
// //             onChange={handleChange}
// //             className="p-3 rounded-lg bg-zinc-100 border border-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
// //           />
// //         ))}

// //         <button
// //           onClick={handleSubmit}
// //           className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-md"
// //         >
// //           Proceed to Order Summary
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }


// import { useEffect, useState } from "react";

// export default function Step1_Address({ onNext }) {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     phone: "",
//     houseNumber: "",
//     streetName: "",
//     landmark: "",
//     locality: "",
//     villageOrTown: "",
//     district: "",
//     city: "",
//     state: "",
//     pincode: "",
//   });

//   useEffect(() => {
//     const saved = localStorage.getItem("userAddress");
//     if (saved) setFormData(JSON.parse(saved));
//   }, []);

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = () => {
//     // Validate required fields
//     if (!formData.fullName || !formData.phone || !formData.city || !formData.state || !formData.pincode) {
//       alert("Please fill in all required fields: Full Name, Phone, City, State, and Pincode");
//       return;
//     }

//     localStorage.setItem("userAddress", JSON.stringify(formData));
//     onNext(formData);
//   };

//   return (
//     <div className="bg-white text-zinc-900 p-10 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] max-w-2xl mx-auto mt-10">
//       {/* Step Title */}
//       <h2 className="text-4xl font-bold mb-3 text-center text-zinc-800">
//         Shipping Information
//       </h2>
//       <p className="mb-8 text-center text-zinc-600 text-sm">
//         Enter your delivery address to proceed with the order.
//       </p>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//         {/* Full Name */}
//         <input
//           name="fullName"
//           placeholder="Full Name *"
//           value={formData.fullName}
//           onChange={handleChange}
//           className="p-3 rounded-lg bg-zinc-100 border border-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
//         />

//         {/* Phone Number */}
//         <input
//           name="phone"
//           placeholder="Phone Number *"
//           value={formData.phone}
//           onChange={handleChange}
//           maxLength={10}
//           className="p-3 rounded-lg bg-zinc-100 border border-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
//         />

//         {/* House Number */}
//         <input
//           name="houseNumber"
//           placeholder="House / Flat No."
//           value={formData.houseNumber}
//           onChange={handleChange}
//           className="p-3 rounded-lg bg-zinc-100 border border-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
//         />

//         {/* Street Name */}
//         <input
//           name="streetName"
//           placeholder="Street Name / Building Name"
//           value={formData.streetName}
//           onChange={handleChange}
//           className="p-3 rounded-lg bg-zinc-100 border border-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
//         />

//         {/* Landmark */}
//         <input
//           name="landmark"
//           placeholder="Landmark (optional)"
//           value={formData.landmark}
//           onChange={handleChange}
//           className="p-3 rounded-lg bg-zinc-100 border border-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
//         />

//         {/* Locality / Area */}
//         <input
//           name="locality"
//           placeholder="Locality / Area"
//           value={formData.locality}
//           onChange={handleChange}
//           className="p-3 rounded-lg bg-zinc-100 border border-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
//         />

//         {/* Village or Town */}
//         <input
//           name="villageOrTown"
//           placeholder="Village / Town"
//           value={formData.villageOrTown}
//           onChange={handleChange}
//           className="p-3 rounded-lg bg-zinc-100 border border-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
//         />

//         {/* District */}
//         <input
//           name="district"
//           placeholder="District"
//           value={formData.district}
//           onChange={handleChange}
//           className="p-3 rounded-lg bg-zinc-100 border border-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
//         />

//         {/* City */}
//         <input
//           name="city"
//           placeholder="City *"
//           value={formData.city}
//           onChange={handleChange}
//           className="p-3 rounded-lg bg-zinc-100 border border-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
//         />

//         {/* State */}
//         <input
//           name="state"
//           placeholder="State *"
//           value={formData.state}
//           onChange={handleChange}
//           className="p-3 rounded-lg bg-zinc-100 border border-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
//         />

//         {/* Pincode */}
//         <input
//           name="pincode"
//           placeholder="Pincode *"
//           value={formData.pincode}
//           onChange={handleChange}
//           maxLength={6}
//           className="p-3 rounded-lg bg-zinc-100 border border-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition sm:col-span-2"
//         />

//         <button
//           onClick={handleSubmit}
//           className="sm:col-span-2 mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-md"
//         >
//           Proceed to Order Summary
//         </button>
//       </div>

//       <p className="text-xs text-zinc-500 text-center mt-4">
//         * Required fields
//       </p>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// export default function Step1_Address({ onNext }) {
//   const [savedAddresses, setSavedAddresses] = useState([]);
//   const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
//   const [isAddingNew, setIsAddingNew] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     phone: "",
//     houseNumber: "",
//     streetName: "",
//     landmark: "",
//     locality: "",
//     villageOrTown: "",
//     district: "",
//     city: "",
//     state: "",
//     pincode: "",
//   });
//   const [loading, setLoading] = useState(true);

//   const API_URL = "http://localhost:3000/api/v1";

//   useEffect(() => {
//     fetchUserAddress();
//   }, []);

//   const fetchUserAddress = async () => {
//     try {
//       setLoading(true);
//       const id = localStorage.getItem("id");
//       const token = localStorage.getItem("token");

//       if (!id || !token) {
//         setLoading(false);
//         return;
//       }

//       const response = await fetch(`${API_URL}/get-user-information`, {
//         headers: {
//           id: id,
//           authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();

//       if (data.success && data.data.address) {
//         // Load saved addresses from user profile
//         const userAddress = data.data.address;
//         setSavedAddresses([userAddress]);
//         setFormData(userAddress);
//       } else if (data.address) {
//         setSavedAddresses([data.address]);
//         setFormData(data.address);
//       }
//     } catch (error) {
//       console.error("Error fetching address:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSelectAddress = (index) => {
//     setSelectedAddressIndex(index);
//     setFormData(savedAddresses[index]);
//     setIsAddingNew(false);
//   };

//   const handleAddNewAddress = () => {
//     setIsAddingNew(true);
//     setFormData({
//       fullName: "",
//       phone: "",
//       houseNumber: "",
//       streetName: "",
//       landmark: "",
//       locality: "",
//       villageOrTown: "",
//       district: "",
//       city: "",
//       state: "",
//       pincode: "",
//     });
//   };

//   const handleSubmit = () => {
//     // Validate required fields
//     const requiredFields = ['fullName', 'phone', 'city', 'state', 'pincode'];
//     for (let field of requiredFields) {
//       if (!formData[field]?.trim()) {
//         alert(`Please fill in: ${field.replace(/([A-Z])/g, ' $1').trim()}`);
//         return;
//       }
//     }

//     // Validate phone number
//     if (formData.phone.length !== 10) {
//       alert("Phone number must be 10 digits");
//       return;
//     }

//     // Validate pincode
//     if (formData.pincode.length !== 6) {
//       alert("Pincode must be 6 digits");
//       return;
//     }

//     // Convert to order schema format
//     const shippingAddress = {
//       fullName: formData.fullName,
//       phone: formData.phone,
//       addressLine1: `${formData.houseNumber || ''} ${formData.streetName || ''}`.trim() || formData.locality,
//       addressLine2: formData.landmark || '',
//       city: formData.city,
//       state: formData.state,
//       postalCode: formData.pincode,
//       country: "India"
//     };

//     localStorage.setItem("userAddress", JSON.stringify(formData));
//     onNext(shippingAddress);
//   };

//   if (loading) {
//     return (
//       <div className="bg-white text-zinc-900 p-10 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] max-w-3xl mx-auto mt-10">
//         <div className="flex flex-col items-center justify-center py-12">
//           <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
//           <p className="text-zinc-600">Loading your addresses...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gradient-to-br from-white to-zinc-50 text-zinc-900 p-8 md:p-10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] max-w-3xl mx-auto mt-10 border border-zinc-200">
//       {/* Header */}
//       <div className="mb-8 text-center">
//         <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mb-4 shadow-lg">
//           <span className="text-3xl">📦</span>
//         </div>
//         <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
//           Shipping Information
//         </h2>
//         <p className="text-zinc-600 text-sm">
//           Select a saved address or enter a new delivery location
//         </p>
//       </div>

//       {/* Saved Addresses */}
//       {savedAddresses.length > 0 && !isAddingNew && (
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8"
//         >
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
//               <span>📍</span> Saved Addresses
//             </h3>
//             {savedAddresses.length < 3 && (
//               <button
//                 onClick={handleAddNewAddress}
//                 className="text-sm text-yellow-600 hover:text-yellow-700 font-semibold transition-colors flex items-center gap-1"
//               >
//                 <span className="text-lg">+</span> Add New
//               </button>
//             )}
//           </div>

//           <div className="space-y-3">
//             {savedAddresses.map((address, index) => (
//               <motion.div
//                 key={index}
//                 whileHover={{ scale: 1.01 }}
//                 onClick={() => handleSelectAddress(index)}
//                 className={`p-5 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
//                   selectedAddressIndex === index && !isAddingNew
//                     ? 'border-yellow-400 bg-yellow-50 shadow-md shadow-yellow-200'
//                     : 'border-zinc-200 bg-white hover:border-yellow-300 hover:shadow-sm'
//                 }`}
//               >
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-2">
//                       {selectedAddressIndex === index && !isAddingNew && (
//                         <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
//                           SELECTED
//                         </span>
//                       )}
//                       {index === 0 && (
//                         <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
//                           PRIMARY
//                         </span>
//                       )}
//                     </div>
//                     <div className="text-sm text-zinc-700 space-y-1">
//                       <p className="font-bold text-zinc-900">{address.fullName || "User"}</p>
//                       <p>{address.houseNumber}, {address.streetName}</p>
//                       <p>{address.locality}, {address.city}</p>
//                       <p>{address.state} - {address.pincode}</p>
//                       <p className="text-zinc-600">📞 {address.phone}</p>
//                     </div>
//                   </div>
//                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
//                     selectedAddressIndex === index && !isAddingNew
//                       ? 'border-yellow-500 bg-yellow-500'
//                       : 'border-zinc-300'
//                   }`}>
//                     {selectedAddressIndex === index && !isAddingNew && (
//                       <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                       </svg>
//                     )}
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//           {!isAddingNew && (
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={handleSubmit}
//               className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-yellow-200 flex items-center justify-center gap-2"
//             >
//               <span>Proceed to Order Summary</span>
//               <span className="text-xl">→</span>
//             </motion.button>
//           )}
//         </motion.div>
//       )}

//       {/* Add New Address Form */}
//       {(isAddingNew || savedAddresses.length === 0) && (
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           {savedAddresses.length > 0 && (
//             <div className="mb-6">
//               <button
//                 onClick={() => {
//                   setIsAddingNew(false);
//                   setFormData(savedAddresses[selectedAddressIndex]);
//                 }}
//                 className="text-yellow-600 hover:text-yellow-700 font-semibold flex items-center gap-2 transition-colors"
//               >
//                 <span>←</span> Back to Saved Addresses
//               </button>
//             </div>
//           )}

//           <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
//             <h3 className="text-lg font-bold text-zinc-800 mb-5 flex items-center gap-2">
//               <span>✏️</span> {savedAddresses.length === 0 ? "Enter Delivery Address" : "Add New Address"}
//             </h3>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {/* Full Name */}
//               <div className="sm:col-span-2">
//                 <label className="block text-sm font-medium text-zinc-700 mb-2">
//                   Full Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="fullName"
//                   placeholder="Enter your full name"
//                   value={formData.fullName}
//                   onChange={handleChange}
//                   className="w-full p-3 rounded-lg bg-zinc-50 border border-zinc-300 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
//                 />
//               </div>

//               {/* Phone Number */}
//               <div className="sm:col-span-2">
//                 <label className="block text-sm font-medium text-zinc-700 mb-2">
//                   Phone Number <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="phone"
//                   placeholder="10-digit mobile number"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   maxLength={10}
//                   className="w-full p-3 rounded-lg bg-zinc-50 border border-zinc-300 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
//                 />
//               </div>

//               {/* House Number */}
//               <div>
//                 <label className="block text-sm font-medium text-zinc-700 mb-2">
//                   House/Flat No.
//                 </label>
//                 <input
//                   name="houseNumber"
//                   placeholder="e.g., 101"
//                   value={formData.houseNumber}
//                   onChange={handleChange}
//                   className="w-full p-3 rounded-lg bg-zinc-50 border border-zinc-300 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
//                 />
//               </div>

//               {/* Street Name */}
//               <div>
//                 <label className="block text-sm font-medium text-zinc-700 mb-2">
//                   Street Name
//                 </label>
//                 <input
//                   name="streetName"
//                   placeholder="e.g., MG Road"
//                   value={formData.streetName}
//                   onChange={handleChange}
//                   className="w-full p-3 rounded-lg bg-zinc-50 border border-zinc-300 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
//                 />
//               </div>

//               {/* Landmark */}
//               <div className="sm:col-span-2">
//                 <label className="block text-sm font-medium text-zinc-700 mb-2">
//                   Landmark (Optional)
//                 </label>
//                 <input
//                   name="landmark"
//                   placeholder="e.g., Near City Mall"
//                   value={formData.landmark}
//                   onChange={handleChange}
//                   className="w-full p-3 rounded-lg bg-zinc-50 border border-zinc-300 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
//                 />
//               </div>

//               {/* Locality */}
//               <div>
//                 <label className="block text-sm font-medium text-zinc-700 mb-2">
//                   Locality/Area
//                 </label>
//                 <input
//                   name="locality"
//                   placeholder="e.g., Koramangala"
//                   value={formData.locality}
//                   onChange={handleChange}
//                   className="w-full p-3 rounded-lg bg-zinc-50 border border-zinc-300 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
//                 />
//               </div>

//               {/* Village/Town */}
//               <div>
//                 <label className="block text-sm font-medium text-zinc-700 mb-2">
//                   Village/Town
//                 </label>
//                 <input
//                   name="villageOrTown"
//                   placeholder="Optional"
//                   value={formData.villageOrTown}
//                   onChange={handleChange}
//                   className="w-full p-3 rounded-lg bg-zinc-50 border border-zinc-300 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
//                 />
//               </div>

//               {/* District */}
//               <div>
//                 <label className="block text-sm font-medium text-zinc-700 mb-2">
//                   District
//                 </label>
//                 <input
//                   name="district"
//                   placeholder="e.g., Bangalore Urban"
//                   value={formData.district}
//                   onChange={handleChange}
//                   className="w-full p-3 rounded-lg bg-zinc-50 border border-zinc-300 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
//                 />
//               </div>

//               {/* City */}
//               <div>
//                 <label className="block text-sm font-medium text-zinc-700 mb-2">
//                   City <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="city"
//                   placeholder="e.g., Bangalore"
//                   value={formData.city}
//                   onChange={handleChange}
//                   className="w-full p-3 rounded-lg bg-zinc-50 border border-zinc-300 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
//                 />
//               </div>

//               {/* State */}
//               <div>
//                 <label className="block text-sm font-medium text-zinc-700 mb-2">
//                   State <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="state"
//                   placeholder="e.g., Karnataka"
//                   value={formData.state}
//                   onChange={handleChange}
//                   className="w-full p-3 rounded-lg bg-zinc-50 border border-zinc-300 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
//                 />
//               </div>

//               {/* Pincode */}
//               <div>
//                 <label className="block text-sm font-medium text-zinc-700 mb-2">
//                   Pincode <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="pincode"
//                   placeholder="6-digit pincode"
//                   value={formData.pincode}
//                   onChange={handleChange}
//                   maxLength={6}
//                   className="w-full p-3 rounded-lg bg-zinc-50 border border-zinc-300 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
//                 />
//               </div>
//             </div>

//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={handleSubmit}
//               className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-yellow-200 flex items-center justify-center gap-2"
//             >
//               <span>Proceed to Order Summary</span>
//               <span className="text-xl">→</span>
//             </motion.button>

//             <p className="text-xs text-zinc-500 text-center mt-4">
//               <span className="text-red-500">*</span> Required fields
//             </p>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Step1_Address({ onNext }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    locality: "",
    city: "",
    state: "",
    postalCode: ""
  });
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:3000/api/v1";

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  const fetchUserAddresses = async () => {
    try {
      setLoading(true);
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      if (!id || !token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/get-user-information`, {
        headers: { id, authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success && data.data.addresses) {
        setAddresses(data.data.addresses);
        // Auto-select primary or first address
        const primary = data.data.addresses.find(a => a.isPrimary);
        setSelectedAddressId(primary?._id || data.data.addresses[0]?._id);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectAddress = (addressId) => {
    setSelectedAddressId(addressId);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    if (addresses.length >= 3) {
      alert("You can only add up to 3 addresses");
      return;
    }
    setIsAddingNew(true);
    setFormData({
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      locality: "",
      city: "",
      state: "",
      postalCode: ""
    });
  };

  const validateForm = () => {
    const required = ['fullName', 'phone', 'addressLine1', 'locality', 'city', 'state', 'postalCode'];
    for (let field of required) {
      if (!formData[field]?.trim()) {
        alert(`Please fill: ${field.replace(/([A-Z])/g, ' $1')}`);
        return false;
      }
    }
    if (formData.phone.length !== 10) {
      alert("Phone must be 10 digits");
      return false;
    }
    if (formData.postalCode.length !== 6) {
      alert("Postal code must be 6 digits");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (isAddingNew) {
      if (!validateForm()) return;

      try {
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        // Add new address to user
        const response = await fetch(`${API_URL}/add-address`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            id,
            authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ...formData,
            country: "India",
            isPrimary: addresses.length === 0 // First address is primary
          })
        });

        const data = await response.json();
        if (data.success) {
          const newAddress = { ...formData, _id: data.addressId, country: "India" };
          onNext(newAddress);
        } else {
          alert(data.message || "Failed to add address");
        }
      } catch (error) {
        console.error("Error adding address:", error);
        alert("Failed to add address");
      }
    } else {
      // Use selected existing address
      const selected = addresses.find(a => a._id === selectedAddressId);
      if (selected) {
        onNext(selected);
      } else {
        alert("Please select an address");
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-3xl mx-auto mt-10">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-600">Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-zinc-50 rounded-2xl shadow-xl p-8 max-w-3xl mx-auto mt-10 border border-zinc-200">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mb-4 shadow-lg">
          <span className="text-3xl">📦</span>
        </div>
        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
          Delivery Address
        </h2>
        <p className="text-zinc-600 text-sm">
          {isAddingNew ? "Enter new delivery address" : "Select or add a delivery address"}
        </p>
      </div>

      {/* Existing Addresses */}
      {!isAddingNew && addresses.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-zinc-800 flex items-center gap-2">
              <span>📍</span> Saved Addresses
            </h3>
            {addresses.length < 3 && (
              <button
                onClick={handleAddNew}
                className="text-sm text-yellow-600 hover:text-yellow-700 font-semibold flex items-center gap-1"
              >
                <span className="text-lg">+</span> Add New
              </button>
            )}
          </div>

          <div className="space-y-3">
            {addresses.map((addr) => (
              <motion.div
                key={addr._id}
                whileHover={{ scale: 1.01 }}
                onClick={() => handleSelectAddress(addr._id)}
                className={`p-5 rounded-xl cursor-pointer transition-all border-2 ${
                  selectedAddressId === addr._id
                    ? 'border-yellow-400 bg-yellow-50 shadow-md'
                    : 'border-zinc-200 bg-white hover:border-yellow-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {selectedAddressId === addr._id && (
                        <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
                          SELECTED
                        </span>
                      )}
                      {addr.isPrimary && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          PRIMARY
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-zinc-700 space-y-1">
                      <p className="font-bold text-zinc-900">{addr.fullName}</p>
                      <p>{addr.addressLine1}</p>
                      {addr.addressLine2 && <p className="text-zinc-600">📍 {addr.addressLine2}</p>}
                      <p>{addr.locality}, {addr.city}</p>
                      <p>{addr.state} - {addr.postalCode}</p>
                      <p className="text-zinc-600">📞 {addr.phone}</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAddressId === addr._id
                      ? 'border-yellow-500 bg-yellow-500'
                      : 'border-zinc-300'
                  }`}>
                    {selectedAddressId === addr._id && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Address Form */}
      {(isAddingNew || addresses.length === 0) && (
        <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
          {addresses.length > 0 && (
            <button
              onClick={() => setIsAddingNew(false)}
              className="text-yellow-600 hover:text-yellow-700 font-semibold flex items-center gap-2 mb-6"
            >
              <span>←</span> Back to Saved Addresses
            </button>
          )}

          <h3 className="text-lg font-bold text-zinc-800 mb-5">
            {addresses.length === 0 ? "Enter Delivery Address" : "Add New Address"}
          </h3>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                name="fullName"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-zinc-50 border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                name="phone"
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                className="w-full p-3 rounded-lg bg-zinc-50 border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Address Line 1 */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                House/Flat No., Street Name <span className="text-red-500">*</span>
              </label>
              <input
                name="addressLine1"
                placeholder="e.g., 101, MG Road"
                value={formData.addressLine1}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-zinc-50 border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Address Line 2 */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">
                Landmark (Optional)
              </label>
              <input
                name="addressLine2"
                placeholder="e.g., Near City Mall"
                value={formData.addressLine2}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-zinc-50 border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Locality */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Locality/Area <span className="text-red-500">*</span>
                </label>
                <input
                  name="locality"
                  placeholder="e.g., Koramangala"
                  value={formData.locality}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-zinc-50 border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  name="city"
                  placeholder="e.g., Bangalore"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-zinc-50 border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  name="state"
                  placeholder="e.g., Karnataka"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-zinc-50 border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Postal Code <span className="text-red-500">*</span>
                </label>
                <input
                  name="postalCode"
                  placeholder="6-digit pincode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  maxLength={6}
                  className="w-full p-3 rounded-lg bg-zinc-50 border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2"
      >
        <span>Proceed to Order Summary</span>
        <span className="text-xl">→</span>
      </motion.button>

      {isAddingNew && (
        <p className="text-xs text-zinc-500 text-center mt-4">
          <span className="text-red-500">*</span> Required fields
        </p>
      )}
    </div>
  );
}