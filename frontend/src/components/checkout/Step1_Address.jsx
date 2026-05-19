

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loader from "../Loader/Loader";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

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
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 max-w-3xl mx-auto mt-6 sm:mt-10">
        <div className="flex flex-col items-center justify-center py-8 sm:py-12">
          <Loader size="md" />
          <p className="text-zinc-600 text-sm sm:text-base mt-4">Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-zinc-50 rounded-2xl shadow-xl p-4 sm:p-8 max-w-3xl mx-auto mt-6 sm:mt-10 border border-zinc-200">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mb-3 sm:mb-4 shadow-lg">
          <span className="text-2xl sm:text-3xl">📦</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
          Delivery Address
        </h2>
        <p className="text-zinc-600 text-xs sm:text-sm">
          {isAddingNew ? "Enter new delivery address" : "Select or add a delivery address"}
        </p>
      </div>

      {/* Existing Addresses */}
      {!isAddingNew && addresses.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-bold text-zinc-800 flex items-center gap-1.5 sm:gap-2">
              <span>📍</span> Saved Addresses
            </h3>
            {addresses.length < 3 && (
              <button
                onClick={handleAddNew}
                className="text-xs sm:text-sm text-yellow-600 hover:text-yellow-700 font-semibold flex items-center gap-1"
              >
                <span className="text-base sm:text-lg">+</span> Add New
              </button>
            )}
          </div>

          <div className="space-y-3">
            {addresses.map((addr) => (
              <motion.div
                key={addr._id}
                whileHover={{ scale: 1.01 }}
                onClick={() => handleSelectAddress(addr._id)}
                className={`p-3 sm:p-5 rounded-xl cursor-pointer transition-all border-2 ${
                  selectedAddressId === addr._id
                    ? 'border-yellow-400 bg-yellow-50 shadow-md'
                    : 'border-zinc-200 bg-white hover:border-yellow-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap">
                      {selectedAddressId === addr._id && (
                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[10px] sm:text-xs font-bold rounded-full">
                          SELECTED
                        </span>
                      )}
                      {addr.isPrimary && (
                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-100 text-green-700 text-[10px] sm:text-xs font-bold rounded-full">
                          PRIMARY
                        </span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm text-zinc-700 space-y-0.5 sm:space-y-1">
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
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-zinc-200 shadow-sm">
          {addresses.length > 0 && (
            <button
              onClick={() => setIsAddingNew(false)}
              className="text-yellow-600 hover:text-yellow-700 font-semibold flex items-center gap-2 mb-4 sm:mb-6 text-sm sm:text-base"
            >
              <span>←</span> Back to Saved Addresses
            </button>
          )}

          <h3 className="text-base sm:text-lg font-bold text-zinc-800 mb-3 sm:mb-5">
            {addresses.length === 0 ? "Enter Delivery Address" : "Add New Address"}
          </h3>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-zinc-700 mb-1 sm:mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                name="fullName"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-2.5 sm:p-3 rounded-lg bg-zinc-50 border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"
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
        className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <span>Proceed to Order Summary</span>
        <span className="text-lg sm:text-xl">→</span>
      </motion.button>

      {isAddingNew && (
        <p className="text-xs text-zinc-500 text-center mt-4">
          <span className="text-red-500">*</span> Required fields
        </p>
      )}
    </div>
  );
}