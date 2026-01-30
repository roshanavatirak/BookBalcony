// 📁 src/components/Forms/AddressForm.jsx
import React from "react";
import { FaUser, FaPhone, FaHome, FaMapMarkerAlt, FaCity, FaGlobeAmericas, FaMapPin } from "react-icons/fa";

const AddressForm = ({ address, setAddress }) => {
  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-3">
      {/* Full Name */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400">
          <FaUser className="text-xs" />
        </div>
        <input
          type="text"
          name="fullName"
          value={address.fullName || ""}
          onChange={handleChange}
          placeholder="Full Name *"
          required
          className="w-full bg-zinc-800 border border-zinc-600 focus:border-yellow-400 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-400 transition-colors outline-none"
        />
      </div>

      {/* Phone Number */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400">
          <FaPhone className="text-xs" />
        </div>
        <input
          type="tel"
          name="phone"
          value={address.phone || ""}
          onChange={handleChange}
          placeholder="Phone Number (10 digits) *"
          maxLength={10}
          pattern="[0-9]{10}"
          required
          className="w-full bg-zinc-800 border border-zinc-600 focus:border-yellow-400 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-400 transition-colors outline-none"
        />
      </div>

      {/* Address Line 1 */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400">
          <FaHome className="text-xs" />
        </div>
        <input
          type="text"
          name="addressLine1"
          value={address.addressLine1 || ""}
          onChange={handleChange}
          placeholder="House/Flat No. + Street Name *"
          required
          className="w-full bg-zinc-800 border border-zinc-600 focus:border-yellow-400 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-400 transition-colors outline-none"
        />
      </div>

      {/* Address Line 2 (Optional) */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
          <FaMapMarkerAlt className="text-xs" />
        </div>
        <input
          type="text"
          name="addressLine2"
          value={address.addressLine2 || ""}
          onChange={handleChange}
          placeholder="Landmark (optional)"
          className="w-full bg-zinc-800 border border-zinc-600 focus:border-yellow-400 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-400 transition-colors outline-none"
        />
      </div>

      {/* Two columns for smaller fields */}
      <div className="grid grid-cols-2 gap-3">
        {/* Locality */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400">
            <FaMapMarkerAlt className="text-xs" />
          </div>
          <input
            type="text"
            name="locality"
            value={address.locality || ""}
            onChange={handleChange}
            placeholder="Locality/Area *"
            required
            className="w-full bg-zinc-800 border border-zinc-600 focus:border-yellow-400 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-400 transition-colors outline-none"
          />
        </div>

        {/* City */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400">
            <FaCity className="text-xs" />
          </div>
          <input
            type="text"
            name="city"
            value={address.city || ""}
            onChange={handleChange}
            placeholder="City *"
            required
            className="w-full bg-zinc-800 border border-zinc-600 focus:border-yellow-400 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-400 transition-colors outline-none"
          />
        </div>
      </div>

      {/* Two columns for state and postal code */}
      <div className="grid grid-cols-2 gap-3">
        {/* State */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400">
            <FaGlobeAmericas className="text-xs" />
          </div>
          <input
            type="text"
            name="state"
            value={address.state || ""}
            onChange={handleChange}
            placeholder="State *"
            required
            className="w-full bg-zinc-800 border border-zinc-600 focus:border-yellow-400 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-400 transition-colors outline-none"
          />
        </div>

        {/* Postal Code */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400">
            <FaMapPin className="text-xs" />
          </div>
          <input
            type="text"
            name="postalCode"
            value={address.postalCode || ""}
            onChange={handleChange}
            placeholder="Postal Code (6 digits) *"
            maxLength={6}
            pattern="[0-9]{6}"
            required
            className="w-full bg-zinc-800 border border-zinc-600 focus:border-yellow-400 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-400 transition-colors outline-none"
          />
        </div>
      </div>

      {/* Country (Read-only, pre-filled) */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
          <FaGlobeAmericas className="text-xs" />
        </div>
        <input
          type="text"
          name="country"
          value={address.country || "India"}
          readOnly
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-zinc-400 cursor-not-allowed"
        />
      </div>

      {/* Required fields note */}
      <p className="text-[10px] text-zinc-500 mt-2">
        * Required fields
      </p>
    </div>
  );
};

export default AddressForm;