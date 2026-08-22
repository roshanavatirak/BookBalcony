import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaCheckCircle, FaCrown, FaPlus, FaStar, FaLock } from "react-icons/fa";
import Alert from "../Alert/Alert";
import { useAlert } from "../Alert/useAlert";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

const MyProfile = () => {
  const { alert: alertData, hideAlert, success, error, warning } = useAlert();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  
  // Profile edit form state (Only First Name & Last Name)
  const [infoForm, setInfoForm] = useState({
    firstName: "",
    lastName: "",
  });

  // Address add form state
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    locality: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");

      if (!token || !id) return;

      const res = await axios.get(`${API_URL}/get-user-information`, {
        headers: { id, authorization: `Bearer ${token}` },
      });

      const user = res.data?.data || res.data;
      setUserData(user);
      setInfoForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    } catch (err) {
      console.error("Error fetching user profile:", err);
      error("Failed to load profile details.", "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleInfoChange = (e) => {
    setInfoForm({ ...infoForm, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");

      await axios.put(
        `${API_URL}/update-profile`,
        {
          firstName: infoForm.firstName,
          lastName: infoForm.lastName,
        },
        { headers: { id, authorization: `Bearer ${token}` } }
      );

      success("Name updated successfully!", "Updated");
      setIsEditingInfo(false);
      fetchProfileData();
    } catch (err) {
      console.error("Error updating profile:", err);
      error(err.response?.data?.message || "Failed to update profile.", "Error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const required = ["fullName", "phone", "addressLine1", "locality", "city", "state", "postalCode"];
    for (const field of required) {
      if (!addressForm[field]?.trim()) {
        warning(`Please fill required field: ${field}`, "Validation Error");
        return;
      }
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");

      await axios.post(
        `${API_URL}/add-address`,
        addressForm,
        { headers: { id, authorization: `Bearer ${token}` } }
      );

      success("New delivery address added successfully!", "Address Saved");
      setIsAddingAddress(false);
      setAddressForm({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        locality: "",
        city: "",
        state: "",
        postalCode: "",
      });
      fetchProfileData();
    } catch (err) {
      console.error("Error adding address:", err);
      error(err.response?.data?.message || "Failed to save address.", "Error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-zinc-900/50 rounded-2xl min-h-[400px] p-6 flex flex-col items-center justify-center border border-zinc-700/50">
        <div className="w-10 h-10 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-zinc-400 text-[11px] tracking-widest uppercase">Loading Profile...</p>
      </div>
    );
  }

  const addresses = userData?.addresses || [];
  const displayName = [userData?.firstName, userData?.lastName].filter(Boolean).join(" ") || userData?.username || "Valued User";
  const displayEmail = (userData?.email && !userData.email.includes("bookbalcony.local")) ? userData.email : "Not provided";
  const displayPhone = (userData?.phone && !userData.phone.includes("00000000")) ? userData.phone : "Not provided";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-zinc-900/95 via-zinc-850 to-zinc-900/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-zinc-700/50 shadow-xl space-y-4 text-white"
    >
      {alertData && (
        <Alert
          type={alertData.type}
          title={alertData.title}
          message={alertData.message}
          duration={alertData.duration}
          position={alertData.position}
          autoClose={alertData.autoClose}
          onClose={hideAlert}
        />
      )}

      {/* Header Banner - Compact & Space Optimized */}
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-purple-500/10 p-4 rounded-xl border border-yellow-400/20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-amber-300 to-yellow-500 shadow-md">
              {userData?.avatar ? (
                <img
                  src={userData.avatar}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover border-2 border-zinc-900"
                  onError={(e) => {
                    e.target.src = "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg";
                  }}
                />
              ) : (
                <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center">
                  <FaUserCircle className="text-zinc-400 text-3xl" />
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-900 shadow-sm" />
          </div>

          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent truncate">
                {displayName}
              </h1>
              {userData?.isPremium && (
                <span className="bg-yellow-400/20 border border-yellow-400/40 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                  <FaCrown className="text-[10px]" /> Premium
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>@{userData?.username || "user"}</span>
              <span>•</span>
              <span className="text-yellow-400 font-semibold capitalize">{userData?.role || "User"}</span>
              {userData?.isSeller && (
                <span className="text-green-400 flex items-center gap-0.5 text-[11px] font-medium">
                  <FaCheckCircle className="text-[10px]" /> Verified Seller
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsEditingInfo(!isEditingInfo)}
          className="px-3.5 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xs rounded-lg transition-all duration-200 shadow-md flex items-center gap-1.5 flex-shrink-0 active:scale-95"
        >
          <FaEdit className="text-xs" /> {isEditingInfo ? "Cancel Edit" : "Edit Profile"}
        </button>
      </div>

      {/* Personal Details Card */}
      <div className="bg-zinc-800/40 rounded-xl p-4 border border-zinc-700/40 space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-700/50 pb-2.5">
          <h2 className="text-xs font-bold text-yellow-400 tracking-wider uppercase flex items-center gap-1.5">
            <FaUserCircle className="text-sm" /> Personal Details
          </h2>
          <span className="text-[10px] text-zinc-400 flex items-center gap-1">
            <FaLock className="text-[9px] text-zinc-500" /> Account Security Credentials Locked
          </span>
        </div>

        {isEditingInfo ? (
          <form onSubmit={handleSaveInfo} className="space-y-3 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={infoForm.firstName}
                  onChange={handleInfoChange}
                  placeholder="Enter first name"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={infoForm.lastName}
                  onChange={handleInfoChange}
                  placeholder="Enter last name"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditingInfo(false)}
                className="px-3 py-1 rounded-lg text-xs text-zinc-300 bg-zinc-700 hover:bg-zinc-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-1 rounded-lg text-xs font-bold text-black bg-yellow-400 hover:bg-yellow-300 transition-colors disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Name"}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-700/30">
              <p className="text-[10px] text-zinc-400 font-medium">First Name</p>
              <p className="text-xs font-semibold text-zinc-100 mt-0.5 truncate">
                {userData?.firstName || <span className="text-zinc-500 italic">Not set</span>}
              </p>
            </div>
            <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-700/30">
              <p className="text-[10px] text-zinc-400 font-medium">Last Name</p>
              <p className="text-xs font-semibold text-zinc-100 mt-0.5 truncate">
                {userData?.lastName || <span className="text-zinc-500 italic">Not set</span>}
              </p>
            </div>
            <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-700/30 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-yellow-400/10 text-yellow-400 flex items-center justify-center flex-shrink-0">
                <FaPhone className="text-[10px]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
                  Mobile Number <FaLock className="text-[8px] text-zinc-500" />
                </p>
                <p className="text-xs font-semibold text-zinc-100 truncate mt-0.5">{displayPhone}</p>
              </div>
            </div>
            <div className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-700/30 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-yellow-400/10 text-yellow-400 flex items-center justify-center flex-shrink-0">
                <FaEnvelope className="text-[10px]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
                  Email Address <FaLock className="text-[8px] text-zinc-500" />
                </p>
                <p className="text-xs font-semibold text-zinc-100 truncate mt-0.5">{displayEmail}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delivery Addresses Section */}
      <div className="bg-zinc-800/40 rounded-xl p-4 border border-zinc-700/40 space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-700/50 pb-2.5">
          <div className="flex items-center gap-1.5">
            <FaMapMarkerAlt className="text-yellow-400 text-sm" />
            <h2 className="text-xs font-bold text-yellow-400 tracking-wider uppercase">
              Delivery Addresses ({addresses.length}/3)
            </h2>
          </div>
          {addresses.length < 3 && !isAddingAddress && (
            <button
              onClick={() => setIsAddingAddress(true)}
              className="px-2.5 py-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20 text-[11px] font-semibold rounded-md transition-colors flex items-center gap-1"
            >
              <FaPlus className="text-[9px]" /> Add Address
            </button>
          )}
        </div>

        {/* Add Address Form Modal / Inline */}
        <AnimatePresence>
          {isAddingAddress && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSaveAddress}
              className="bg-zinc-900/90 p-3 rounded-lg border border-yellow-400/30 space-y-2.5"
            >
              <h3 className="text-xs font-bold text-yellow-400">Add New Delivery Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name *"
                  value={addressForm.fullName}
                  onChange={handleAddressChange}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-1.5 text-xs text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Mobile Number (10 digits) *"
                  value={addressForm.phone}
                  onChange={handleAddressChange}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-1.5 text-xs text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none"
                />
                <input
                  type="text"
                  name="addressLine1"
                  placeholder="House/Flat No. & Street *"
                  value={addressForm.addressLine1}
                  onChange={handleAddressChange}
                  className="sm:col-span-2 w-full bg-zinc-950 border border-zinc-700 rounded-md p-1.5 text-xs text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none"
                />
                <input
                  type="text"
                  name="locality"
                  placeholder="Area / Locality *"
                  value={addressForm.locality}
                  onChange={handleAddressChange}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-1.5 text-xs text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City *"
                  value={addressForm.city}
                  onChange={handleAddressChange}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-1.5 text-xs text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State *"
                  value={addressForm.state}
                  onChange={handleAddressChange}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-1.5 text-xs text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none"
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Pincode (6 digits) *"
                  value={addressForm.postalCode}
                  onChange={handleAddressChange}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-1.5 text-xs text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(false)}
                  className="px-2.5 py-1 rounded-md text-[11px] bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-3 py-1 rounded-md text-[11px] font-bold text-black bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Address"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Address Cards List */}
        {addresses.length === 0 ? (
          <div className="bg-zinc-900/40 p-4 rounded-lg border border-dashed border-zinc-700/60 text-center space-y-1.5">
            <FaMapMarkerAlt className="text-zinc-600 text-xl mx-auto" />
            <p className="text-[11px] text-zinc-400">No delivery addresses saved yet.</p>
            {!isAddingAddress && (
              <button
                onClick={() => setIsAddingAddress(true)}
                className="px-3 py-1.5 bg-yellow-400 text-black font-bold text-xs rounded-lg hover:bg-yellow-300 transition-colors"
              >
                + Add Delivery Address
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {addresses.map((addr, idx) => (
              <div
                key={addr._id || idx}
                className={`p-3 rounded-lg border relative transition-all ${
                  addr.isPrimary
                    ? "bg-zinc-900/90 border-yellow-400/50 shadow-md"
                    : "bg-zinc-900/50 border-zinc-700/50"
                }`}
              >
                {addr.isPrimary && (
                  <span className="absolute top-2.5 right-2.5 bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <FaStar className="text-[8px]" /> Primary
                  </span>
                )}
                <p className="text-xs font-bold text-white truncate pr-16">{addr.fullName}</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">{addr.phone}</p>
                <p className="text-[11px] text-zinc-300 mt-1.5 leading-snug line-clamp-2">
                  {addr.addressLine1}
                  {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}, {addr.locality}, {addr.city}, {addr.state} - <strong className="text-yellow-400">{addr.postalCode}</strong>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MyProfile;
