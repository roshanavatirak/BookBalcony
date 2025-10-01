// import { useEffect, useState } from "react";

// export default function Step1_Address({ onNext }) {
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     city: "",
//     address: "",
//     pincode: "",
//   });

//   useEffect(() => {
//     const saved = localStorage.getItem("userAddress");
//     if (saved) setFormData(JSON.parse(saved));
//   }, []);

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = () => {
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

//       <div className="grid grid-cols-1 gap-5">
//         {[
//           { name: "name", placeholder: "Full Name" },
//           { name: "phone", placeholder: "Phone Number" },
//           { name: "city", placeholder: "City" },
//           { name: "address", placeholder: "Complete Address" },
//           { name: "pincode", placeholder: "Pincode" },
//         ].map(({ name, placeholder }) => (
//           <input
//             key={name}
//             name={name}
//             placeholder={placeholder}
//             value={formData[name]}
//             onChange={handleChange}
//             className="p-3 rounded-lg bg-zinc-100 border border-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
//           />
//         ))}

//         <button
//           onClick={handleSubmit}
//           className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-md"
//         >
//           Proceed to Order Summary
//         </button>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";

export default function Step1_Address({ onNext }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    houseNumber: "",
    streetName: "",
    landmark: "",
    locality: "",
    villageOrTown: "",
    district: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("userAddress");
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.fullName || !formData.phone || !formData.city || !formData.state || !formData.pincode) {
      alert("Please fill in all required fields: Full Name, Phone, City, State, and Pincode");
      return;
    }

    localStorage.setItem("userAddress", JSON.stringify(formData));
    onNext(formData);
  };

  return (
    <div className="bg-white text-zinc-900 p-10 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] max-w-2xl mx-auto mt-10">
      {/* Step Title */}
      <h2 className="text-4xl font-bold mb-3 text-center text-zinc-800">
        Shipping Information
      </h2>
      <p className="mb-8 text-center text-zinc-600 text-sm">
        Enter your delivery address to proceed with the order.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <input
          name="fullName"
          placeholder="Full Name *"
          value={formData.fullName}
          onChange={handleChange}
          className="p-3 rounded-lg bg-zinc-100 border border-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />

        {/* Phone Number */}
        <input
          name="phone"
          placeholder="Phone Number *"
          value={formData.phone}
          onChange={handleChange}
          maxLength={10}
          className="p-3 rounded-lg bg-zinc-100 border border-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />

        {/* House Number */}
        <input
          name="houseNumber"
          placeholder="House / Flat No."
          value={formData.houseNumber}
          onChange={handleChange}
          className="p-3 rounded-lg bg-zinc-100 border border-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />

        {/* Street Name */}
        <input
          name="streetName"
          placeholder="Street Name / Building Name"
          value={formData.streetName}
          onChange={handleChange}
          className="p-3 rounded-lg bg-zinc-100 border border-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />

        {/* Landmark */}
        <input
          name="landmark"
          placeholder="Landmark (optional)"
          value={formData.landmark}
          onChange={handleChange}
          className="p-3 rounded-lg bg-zinc-100 border border-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />

        {/* Locality / Area */}
        <input
          name="locality"
          placeholder="Locality / Area"
          value={formData.locality}
          onChange={handleChange}
          className="p-3 rounded-lg bg-zinc-100 border border-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />

        {/* Village or Town */}
        <input
          name="villageOrTown"
          placeholder="Village / Town"
          value={formData.villageOrTown}
          onChange={handleChange}
          className="p-3 rounded-lg bg-zinc-100 border border-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />

        {/* District */}
        <input
          name="district"
          placeholder="District"
          value={formData.district}
          onChange={handleChange}
          className="p-3 rounded-lg bg-zinc-100 border border-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />

        {/* City */}
        <input
          name="city"
          placeholder="City *"
          value={formData.city}
          onChange={handleChange}
          className="p-3 rounded-lg bg-zinc-100 border border-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />

        {/* State */}
        <input
          name="state"
          placeholder="State *"
          value={formData.state}
          onChange={handleChange}
          className="p-3 rounded-lg bg-zinc-100 border border-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />

        {/* Pincode */}
        <input
          name="pincode"
          placeholder="Pincode *"
          value={formData.pincode}
          onChange={handleChange}
          maxLength={6}
          className="p-3 rounded-lg bg-zinc-100 border border-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition sm:col-span-2"
        />

        <button
          onClick={handleSubmit}
          className="sm:col-span-2 mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-md"
        >
          Proceed to Order Summary
        </button>
      </div>

      <p className="text-xs text-zinc-500 text-center mt-4">
        * Required fields
      </p>
    </div>
  );
}
