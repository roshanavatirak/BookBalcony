// 📁 src/components/Forms/AddressForm.jsx
import React from "react";
import { FaUser, FaPhone, FaHome, FaMapMarkerAlt, FaCity, FaGlobeAmericas, FaMapPin } from "react-icons/fa";

const AddressForm = ({
  address = {},
  formData,
  setAddress,
  onChange,
  showContact = true,
  className = "",
  inputSize = "sm"
}) => {
  const values = formData || address || {};

  const handleInputChange = (e) => {
    if (onChange) {
      onChange(e);
    } else if (setAddress) {
      setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const isSmall = inputSize === "sm";
  const pyClass = isSmall ? "py-1.5 text-xs" : "py-2.5 text-sm";

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Full Name & Phone Number (Contact Fields) */}
      {showContact && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Full Name */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400">
              <FaUser className="text-xs" />
            </div>
            <input
              type="text"
              name="fullName"
              value={values.fullName || ""}
              onChange={handleInputChange}
              placeholder="Full Name *"
              required
              className={`w-full bg-zinc-950 border border-zinc-700 focus:border-yellow-400 rounded-lg pl-8 pr-3 ${pyClass} text-white placeholder:text-zinc-500 transition-colors outline-none`}
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
              value={values.phone || ""}
              onChange={handleInputChange}
              placeholder="Mobile Number (10 digits) *"
              maxLength={10}
              pattern="[0-9]{10}"
              required
              className={`w-full bg-zinc-950 border border-zinc-700 focus:border-yellow-400 rounded-lg pl-8 pr-3 ${pyClass} text-white placeholder:text-zinc-500 transition-colors outline-none`}
            />
          </div>
        </div>
      )}

      {/* House/Flat No. & Street Name */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400">
          <FaHome className="text-xs" />
        </div>
        <input
          type="text"
          name="addressLine1"
          value={values.addressLine1 || values.street || ""}
          onChange={handleInputChange}
          placeholder="House/Flat No. & Street Name *"
          required
          className={`w-full bg-zinc-950 border border-zinc-700 focus:border-yellow-400 rounded-lg pl-8 pr-3 ${pyClass} text-white placeholder:text-zinc-500 transition-colors outline-none`}
        />
      </div>

      {/* Landmark / Address Line 2 (Optional) */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
          <FaMapMarkerAlt className="text-xs" />
        </div>
        <input
          type="text"
          name="addressLine2"
          value={values.addressLine2 || ""}
          onChange={handleInputChange}
          placeholder="Landmark / Building Name (Optional)"
          className={`w-full bg-zinc-950 border border-zinc-700 focus:border-yellow-400 rounded-lg pl-8 pr-3 ${pyClass} text-white placeholder:text-zinc-500 transition-colors outline-none`}
        />
      </div>

      {/* Locality & City */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Locality */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400">
            <FaMapMarkerAlt className="text-xs" />
          </div>
          <input
            type="text"
            name="locality"
            value={values.locality || values.village || ""}
            onChange={handleInputChange}
            placeholder="Area / Locality *"
            required
            className={`w-full bg-zinc-950 border border-zinc-700 focus:border-yellow-400 rounded-lg pl-8 pr-3 ${pyClass} text-white placeholder:text-zinc-500 transition-colors outline-none`}
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
            value={values.city || ""}
            onChange={handleInputChange}
            placeholder="City *"
            required
            className={`w-full bg-zinc-950 border border-zinc-700 focus:border-yellow-400 rounded-lg pl-8 pr-3 ${pyClass} text-white placeholder:text-zinc-500 transition-colors outline-none`}
          />
        </div>
      </div>

      {/* State & Postal Code */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* State */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400">
            <FaGlobeAmericas className="text-xs" />
          </div>
          <input
            type="text"
            name="state"
            value={values.state || ""}
            onChange={handleInputChange}
            placeholder="State *"
            required
            className={`w-full bg-zinc-950 border border-zinc-700 focus:border-yellow-400 rounded-lg pl-8 pr-3 ${pyClass} text-white placeholder:text-zinc-500 transition-colors outline-none`}
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
            value={values.postalCode || values.pincode || ""}
            onChange={handleInputChange}
            placeholder="Pincode (6 digits) *"
            maxLength={6}
            pattern="[0-9]{6}"
            required
            className={`w-full bg-zinc-950 border border-zinc-700 focus:border-yellow-400 rounded-lg pl-8 pr-3 ${pyClass} text-white placeholder:text-zinc-500 transition-colors outline-none`}
          />
        </div>
      </div>

      {/* Country (Read-only, default India) */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
          <FaGlobeAmericas className="text-xs" />
        </div>
        <input
          type="text"
          name="country"
          value={values.country || "India"}
          readOnly
          className={`w-full bg-zinc-900/60 border border-zinc-800 rounded-lg pl-8 pr-3 ${pyClass} text-zinc-400 cursor-not-allowed`}
        />
      </div>
    </div>
  );
};

export default AddressForm;