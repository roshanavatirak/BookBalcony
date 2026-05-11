

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Settings = () => {
  const [profileData, setProfileData] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL;
  const API_URL = `${BASE_URL}/api/v1`;

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_URL}/get-user-information`, {
        headers: { id, authorization: `Bearer ${token}` }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProfileData(data.data);
        setAddresses(data.data.addresses || []);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Failed to load user data");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setFormData({ ...addresses[index] });
    setIsAddingNew(false);
  };

  const startAddNew = () => {
    if (addresses.length >= 3) {
      alert("Maximum 3 addresses allowed");
      return;
    }
    setIsAddingNew(true);
    setEditingIndex(null);
    setFormData({
      fullName: profileData?.username || "",
      phone: profileData?.phone || "",
      addressLine1: "",
      addressLine2: "",
      locality: "",
      city: "",
      state: "",
      postalCode: ""
    });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setIsAddingNew(false);
    setFormData({});
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

  const saveAddress = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      
      let updatedAddresses;
      if (isAddingNew) {
        const newAddress = {
          ...formData,
          country: "India",
          isPrimary: addresses.length === 0
        };
        updatedAddresses = [...addresses, newAddress];
      } else {
        updatedAddresses = addresses.map((addr, idx) =>
          idx === editingIndex ? { ...formData, isPrimary: addr.isPrimary } : addr
        );
      }

      const response = await fetch(`${API_URL}/update-addresses`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          id,
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ addresses: updatedAddresses })
      });

      const data = await response.json();
      if (data.success) {
        alert("Address saved successfully");
        setAddresses(updatedAddresses);
        cancelEdit();
      } else {
        alert(data.message || "Failed to save address");
      }
    } catch (err) {
      console.error("Error saving address:", err);
      alert("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (index) => {
    if (addresses.length === 1) {
      alert("You must have at least one address");
      return;
    }
    
    if (!window.confirm("Delete this address?")) return;

    try {
      setLoading(true);
      const updatedAddresses = addresses.filter((_, idx) => idx !== index);
      
      // If deleting primary, make first remaining address primary
      if (addresses[index].isPrimary && updatedAddresses.length > 0) {
        updatedAddresses[0].isPrimary = true;
      }

      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/update-addresses`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          id,
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ addresses: updatedAddresses })
      });

      const data = await response.json();
      if (data.success) {
        setAddresses(updatedAddresses);
        alert("Address deleted");
      }
    } catch (err) {
      console.error("Error deleting address:", err);
      alert("Failed to delete address");
    } finally {
      setLoading(false);
    }
  };

  const setPrimary = async (index) => {
    try {
      setLoading(true);
      const updatedAddresses = addresses.map((addr, idx) => ({
        ...addr,
        isPrimary: idx === index
      }));

      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/update-addresses`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          id,
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ addresses: updatedAddresses })
      });

      const data = await response.json();
      if (data.success) {
        setAddresses(updatedAddresses);
        alert("Primary address updated");
      }
    } catch (err) {
      console.error("Error setting primary:", err);
      alert("Failed to update primary address");
    } finally {
      setLoading(false);
    }
  };

  if (!profileData) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-zinc-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-400 text-lg">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900/50 rounded-3xl p-4 sm:p-8 text-white shadow-xl border border-zinc-700">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">⚙️</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Account Settings
              </h1>
              <p className="text-zinc-400 text-sm mt-1">Manage profile & addresses</p>
            </div>
          </div>
        </motion.div>

        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 rounded-2xl p-6 md:p-8 mb-6 border border-zinc-700/50 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">👤</span>
            <h2 className="text-2xl font-bold text-yellow-400">Profile</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "👤", label: "Username", value: profileData.username },
              { icon: "📧", label: "Email", value: profileData.email },
              { icon: "📞", label: "Phone", value: profileData.phone }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/30 hover:border-yellow-400/30 transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{item.icon}</span>
                  <label className="text-zinc-400 text-sm font-medium">{item.label}</label>
                </div>
                <p className="text-white font-semibold text-lg ml-7">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Addresses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 rounded-2xl p-6 md:p-8 border border-yellow-400/30 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📍</span>
              <h2 className="text-2xl font-bold text-yellow-400">Delivery Addresses</h2>
            </div>
            {addresses.length < 3 && !isAddingNew && editingIndex === null && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startAddNew}
                className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>+</span> Add New
              </motion.button>
            )}
          </div>

          <p className="text-zinc-400 text-sm mb-6">
            Save up to 3 addresses. Set one as primary for quick checkout.
          </p>

          {/* Address List */}
          <div className="space-y-4">
            <AnimatePresence>
              {addresses.map((addr, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`bg-zinc-800/50 rounded-xl p-5 border ${
                    addr.isPrimary
                      ? "border-yellow-400 shadow-lg shadow-yellow-400/20"
                      : "border-zinc-700/30"
                  } transition-all`}
                >
                  {editingIndex === index ? (
                    <AddressForm
                      address={formData}
                      onChange={handleChange}
                      onSave={saveAddress}
                      onCancel={cancelEdit}
                      loading={loading}
                    />
                  ) : (
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {addr.isPrimary && (
                            <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs font-bold rounded-full">
                              PRIMARY
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {!addr.isPrimary && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setPrimary(index)}
                              className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
                              title="Set as primary"
                            >
                              ⭐ Set Primary
                            </motion.button>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => startEdit(index)}
                            className="text-blue-400 hover:text-blue-300"
                            title="Edit"
                          >
                            ✏️
                          </motion.button>
                          {addresses.length > 1 && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => deleteAddress(index)}
                              className="text-red-400 hover:text-red-300"
                              title="Delete"
                            >
                              🗑️
                            </motion.button>
                          )}
                        </div>
                      </div>
                      <div className="text-zinc-300 space-y-1 text-sm">
                        <p className="font-bold text-white">{addr.fullName}</p>
                        <p>🏠 {addr.addressLine1}</p>
                        {addr.addressLine2 && <p className="text-zinc-400">📍 {addr.addressLine2}</p>}
                        <p>{addr.locality}, {addr.city}</p>
                        <p>{addr.state} - <span className="font-semibold">{addr.postalCode}</span></p>
                        <p className="text-zinc-400">📞 {addr.phone}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add New Form */}
            {isAddingNew && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-800/50 rounded-xl p-5 border border-yellow-400/50"
              >
                <h3 className="text-lg font-semibold text-yellow-400 mb-4">Add New Address</h3>
                <AddressForm
                  address={formData}
                  onChange={handleChange}
                  onSave={saveAddress}
                  onCancel={cancelEdit}
                  loading={loading}
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Address Form Component
const AddressForm = ({ address, onChange, onSave, onCancel, loading }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="md:col-span-2">
          <label className="text-sm text-zinc-400 font-medium mb-2 block">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            name="fullName"
            value={address.fullName || ""}
            onChange={onChange}
            placeholder="Enter full name"
            className="w-full px-4 py-2.5 rounded-lg bg-zinc-900/50 border border-zinc-600 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-zinc-400 font-medium mb-2 block">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            name="phone"
            value={address.phone || ""}
            onChange={onChange}
            placeholder="10-digit number"
            maxLength={10}
            className="w-full px-4 py-2.5 rounded-lg bg-zinc-900/50 border border-zinc-600 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-zinc-400 font-medium mb-2 block">
            Address Line 1 <span className="text-red-500">*</span>
          </label>
          <input
            name="addressLine1"
            value={address.addressLine1 || ""}
            onChange={onChange}
            placeholder="House/Flat No., Street Name"
            className="w-full px-4 py-2.5 rounded-lg bg-zinc-900/50 border border-zinc-600 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-zinc-400 font-medium mb-2 block">Landmark (Optional)</label>
          <input
            name="addressLine2"
            value={address.addressLine2 || ""}
            onChange={onChange}
            placeholder="Near..."
            className="w-full px-4 py-2.5 rounded-lg bg-zinc-900/50 border border-zinc-600 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400 font-medium mb-2 block">
            Locality <span className="text-red-500">*</span>
          </label>
          <input
            name="locality"
            value={address.locality || ""}
            onChange={onChange}
            placeholder="Area/Locality"
            className="w-full px-4 py-2.5 rounded-lg bg-zinc-900/50 border border-zinc-600 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400 font-medium mb-2 block">
            City <span className="text-red-500">*</span>
          </label>
          <input
            name="city"
            value={address.city || ""}
            onChange={onChange}
            placeholder="City"
            className="w-full px-4 py-2.5 rounded-lg bg-zinc-900/50 border border-zinc-600 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400 font-medium mb-2 block">
            State <span className="text-red-500">*</span>
          </label>
          <input
            name="state"
            value={address.state || ""}
            onChange={onChange}
            placeholder="State"
            className="w-full px-4 py-2.5 rounded-lg bg-zinc-900/50 border border-zinc-600 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label className="text-sm text-zinc-400 font-medium mb-2 block">
            Postal Code <span className="text-red-500">*</span>
          </label>
          <input
            name="postalCode"
            value={address.postalCode || ""}
            onChange={onChange}
            placeholder="6-digit code"
            maxLength={6}
            className="w-full px-4 py-2.5 rounded-lg bg-zinc-900/50 border border-zinc-600 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="px-6 py-2.5 bg-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-600 transition-all font-medium"
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSave}
          disabled={loading}
          className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? "Saving..." : "💾 Save"}
        </motion.button>
      </div>
    </div>
  );
};

export default Settings;