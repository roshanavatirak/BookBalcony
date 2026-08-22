import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaCheckCircle, FaCrown, FaPlus, FaStar, FaShieldAlt } from "react-icons/fa";
import Alert from "../Alert/Alert";
import { useAlert } from "../Alert/useAlert";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

const MyProfile = () => {
  const { alert: alertData, hideAlert, success, error, warning, info } = useAlert();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  
  // Profile edit form state
  const [infoForm, setInfoForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
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
        email: (user.email && !user.email.includes("bookbalcony.local")) ? user.email : "",
        phone: (user.phone && !user.phone.includes("00000000")) ? user.phone : "",
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
          email: infoForm.email,
          phone: infoForm.phone,
        },
        { headers: { id, authorization: `Bearer ${token}` } }
      );

      success("Profile details updated successfully!", "Updated");
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
      <div className="bg-zinc-900/50 rounded-3xl min-h-[500px] p-6 flex flex-col items-center justify-center border border-zinc-700/50">
        <div className="w-12 h-12 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-zinc-400 text-xs tracking-widest uppercase">Loading Profile...</p>
      </div>
    );
  }

  const addresses = userData?.addresses || [];
  const displayName = [userData?.firstName, userData?.lastName].filter(Boolean).join(" ") || userData?.username || "Valued User";
  const displayEmail = (userData?.email && !userData.email.includes("bookbalcony.local")) ? userData.email : "Not provided";
  const displayPhone = (userData?.phone && !userData.phone.includes("00000000")) ? userData.phone : "Not provided";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-zinc-900/90 via-zinc-800/90 to-zinc-900/90 backdrop-blur-md rounded-3xl p-4 sm:p-8 border border-zinc-700/50 shadow-2xl space-y-6 text-white"
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

      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-purple-500/10 p-6 rounded-2xl border border-yellow-400/20 flex flex-col sm:flex-row items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-amber-300 to-yellow-500">
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
                <FaUserCircle className="text-zinc-400 text-4xl" />
              </div>
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-zinc-900 shadow-md" />
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
              {displayName}
            </h1>
            {userData?.isPremium && (
              <span className="bg-yellow-400/20 border border-yellow-400/40 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <FaCrown className="text-xs" /> Premium
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400">@{userData?.username || "username"}</p>
          <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
            <span className="text-[11px] bg-zinc-800/80 border border-zinc-700 text-zinc-300 px-2.5 py-0.5 rounded-full">
              Role: <strong className="text-yellow-400 capitalize">{userData?.role || "User"}</strong>
            </span>
            {userData?.isSeller && (
              <span className="text-[11px] bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <FaCheckCircle className="text-xs text-green-400" /> Verified Seller
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsEditingInfo(!isEditingInfo)}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-xs rounded-xl transition-all duration-200 shadow-md flex items-center gap-1.5 active:scale-95"
        >
          <FaEdit /> {isEditingInfo ? "Cancel Edit" : "Edit Profile"}
        </button>
      </div>

      {/* Profile Details Edit Form / Display Grid */}
      <div className="bg-zinc-800/50 rounded-2xl p-5 border border-zinc-700/50 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-700/60 pb-3">
          <h2 className="text-sm font-bold text-yellow-400 tracking-wide uppercase flex items-center gap-2">
            <FaUserCircle className="text-base" /> Personal Details
          </h2>
          <span className="text-[11px] text-zinc-400">Primary Account Contact</span>
        </div>

        {isEditingInfo ? (
          <form onSubmit={handleSaveInfo} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={infoForm.firstName}
                onChange={handleInfoChange}
                placeholder="e.g. Roshan"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={infoForm.lastName}
                onChange={handleInfoChange}
                placeholder="e.g. Avatirak"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Mobile Number</label>
              <input
                type="tel"
                name="phone"
                value={infoForm.phone}
                onChange={handleInfoChange}
                placeholder="10-digit mobile number"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={infoForm.email}
                onChange={handleInfoChange}
                placeholder="user@example.com"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingInfo(false)}
                className="px-4 py-2 rounded-xl text-xs text-zinc-300 bg-zinc-700 hover:bg-zinc-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-yellow-400 hover:bg-yellow-300 transition-colors disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-700/40">
              <p className="text-[11px] text-zinc-400 font-medium">First Name</p>
              <p className="text-sm font-semibold text-zinc-100 mt-0.5">
                {userData?.firstName || <span className="text-zinc-500 italic">Not set</span>}
              </p>
            </div>
            <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-700/40">
              <p className="text-[11px] text-zinc-400 font-medium">Last Name</p>
              <p className="text-sm font-semibold text-zinc-100 mt-0.5">
                {userData?.lastName || <span className="text-zinc-500 italic">Not set</span>}
              </p>
            </div>
            <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-700/40 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-400/10 text-yellow-400 flex items-center justify-center flex-shrink-0">
                <FaPhone className="text-xs" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-zinc-400 font-medium">Mobile Number</p>
                <p className="text-sm font-semibold text-zinc-100 truncate mt-0.5">{displayPhone}</p>
              </div>
            </div>
            <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-700/40 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-400/10 text-yellow-400 flex items-center justify-center flex-shrink-0">
                <FaEnvelope className="text-xs" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-zinc-400 font-medium">Email Address</p>
                <p className="text-sm font-semibold text-zinc-100 truncate mt-0.5">{displayEmail}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delivery Addresses Section */}
      <div className="bg-zinc-800/50 rounded-2xl p-5 border border-zinc-700/50 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-700/60 pb-3">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-yellow-400 text-base" />
            <h2 className="text-sm font-bold text-yellow-400 tracking-wide uppercase">
              Delivery Addresses ({addresses.length}/3)
            </h2>
          </div>
          {addresses.length < 3 && !isAddingAddress && (
            <button
              onClick={() => setIsAddingAddress(true)}
              className="px-3 py-1.5 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
            >
              <FaPlus className="text-[10px]" /> Add Address
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
              className="bg-zinc-900/90 p-4 rounded-xl border border-yellow-400/30 space-y-3"
            >
              <h3 className="text-xs font-bold text-yellow-400">Add New Delivery Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name *"
                  value={addressForm.fullName}
                  onChange={handleAddressChange}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-xs text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Mobile Number (10 digits) *"
                  value={addressForm.phone}
                  onChange={handleAddressChange}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-xs text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none"
                />
                <input
                  type="text"
                  name="addressLine1"
                  placeholder="House/Flat No. & Street *"
                  value={addressForm.addressLine1}
                  onChange={handleAddressChange}
                  className="sm:col-span-2 w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-xs text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none"
                />
                <input
                  type="text"
                  name="locality"
                  placeholder="Area / Locality *"
                  value={addressForm.locality}
                  onChange={handleAddressChange}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-xs text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City *"
                  value={addressForm.city}
                  onChange={handleAddressChange}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-xs text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State *"
                  value={addressForm.state}
                  onChange={handleAddressChange}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-xs text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none"
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Pincode (6 digits) *"
                  value={addressForm.postalCode}
                  onChange={handleAddressChange}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-xs text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(false)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-black bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Address"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Address Cards List */}
        {addresses.length === 0 ? (
          <div className="bg-zinc-900/40 p-6 rounded-xl border border-dashed border-zinc-700 text-center space-y-2">
            <FaMapMarkerAlt className="text-zinc-600 text-2xl mx-auto" />
            <p className="text-xs text-zinc-400">No delivery addresses saved yet.</p>
            {!isAddingAddress && (
              <button
                onClick={() => setIsAddingAddress(true)}
                className="px-4 py-2 bg-yellow-400 text-black font-bold text-xs rounded-xl hover:bg-yellow-300 transition-colors"
              >
                + Add Delivery Address
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {addresses.map((addr, idx) => (
              <div
                key={addr._id || idx}
                className={`p-4 rounded-xl border relative transition-all ${
                  addr.isPrimary
                    ? "bg-zinc-900/90 border-yellow-400/50 shadow-md shadow-yellow-400/5"
                    : "bg-zinc-900/50 border-zinc-700/60"
                }`}
              >
                {addr.isPrimary && (
                  <span className="absolute top-3 right-3 bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <FaStar className="text-[9px]" /> Primary
                  </span>
                )}
                <p className="text-xs font-bold text-white">{addr.fullName}</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">{addr.phone}</p>
                <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
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
