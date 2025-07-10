// 📁 src/components/Forms/AddressForm.jsx
import React from "react";

const AddressForm = ({ address, setAddress }) => {
  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      {/* House Number */}
      <input
        type="text"
        name="houseNumber"
        value={address.houseNumber || ""}
        onChange={handleChange}
        placeholder="House / Flat No."
        className="bg-zinc-800 border border-zinc-600 rounded-md px-4 py-2 text-sm text-white placeholder:text-zinc-400"
      />

      {/* Street Name */}
      <input
        type="text"
        name="streetName"
        value={address.streetName || ""}
        onChange={handleChange}
        placeholder="Street Name / Building Name"
        className="bg-zinc-800 border border-zinc-600 rounded-md px-4 py-2 text-sm text-white placeholder:text-zinc-400"
      />

      {/* Landmark */}
      <input
        type="text"
        name="landmark"
        value={address.landmark || ""}
        onChange={handleChange}
        placeholder="Landmark (optional)"
        className="bg-zinc-800 border border-zinc-600 rounded-md px-4 py-2 text-sm text-white placeholder:text-zinc-400"
      />

      {/* Locality / Area */}
      <input
        type="text"
        name="locality"
        value={address.locality || ""}
        onChange={handleChange}
        placeholder="Locality / Area"
        className="bg-zinc-800 border border-zinc-600 rounded-md px-4 py-2 text-sm text-white placeholder:text-zinc-400"
      />

      {/* Village or Town */}
      <input
        type="text"
        name="villageOrTown"
        value={address.villageOrTown || ""}
        onChange={handleChange}
        placeholder="Village / Town"
        className="bg-zinc-800 border border-zinc-600 rounded-md px-4 py-2 text-sm text-white placeholder:text-zinc-400"
      />

      {/* District */}
      <input
        type="text"
        name="district"
        value={address.district || ""}
        onChange={handleChange}
        placeholder="District"
        className="bg-zinc-800 border border-zinc-600 rounded-md px-4 py-2 text-sm text-white placeholder:text-zinc-400"
      />

      {/* City */}
      <input
        type="text"
        name="city"
        value={address.city || ""}
        onChange={handleChange}
        placeholder="City"
        className="bg-zinc-800 border border-zinc-600 rounded-md px-4 py-2 text-sm text-white placeholder:text-zinc-400"
      />

      {/* State */}
      <input
        type="text"
        name="state"
        value={address.state || ""}
        onChange={handleChange}
        placeholder="State"
        className="bg-zinc-800 border border-zinc-600 rounded-md px-4 py-2 text-sm text-white placeholder:text-zinc-400"
      />

      {/* Pincode */}
      <input
        type="text"
        name="pincode"
        value={address.pincode || ""}
        onChange={handleChange}
        placeholder="Pincode"
        maxLength={6}
        className="bg-zinc-800 border border-zinc-600 rounded-md px-4 py-2 text-sm text-white placeholder:text-zinc-400"
      />
    </div>
  );
};

export default AddressForm;
