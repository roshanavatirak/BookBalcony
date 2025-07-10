import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import { motion } from "framer-motion";

const requiredFields = [
  "houseNumber",
  "streetName",
  "locality",
  "city",
  "state",
  "pincode",
];

const Settings = () => {
  const [profileData, setProfileData] = useState(null);
  const [addressFields, setAddressFields] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:3000/api/v1/get-user-information", {
        headers,
      });
      setProfileData(res.data);
      setAddressFields(res.data.address || {});
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressFields((prev) => ({ ...prev, [name]: value }));
  };

  const submitAddress = async () => {
    for (let field of requiredFields) {
      if (!addressFields[field]?.trim()) {
        return alert(`Please fill in the required field: ${field}`);
      }
    }

    try {
      setLoading(true);
      const res = await axios.put(
        "http://localhost:3000/api/v1/update-address",
        { address: addressFields },
        { headers }
      );
      alert(res.data.message);
      setProfileData((prev) => ({
        ...prev,
        address: addressFields,
      }));
      setEditMode(false); // close form
    } catch (err) {
      alert("Failed to update address.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!profileData) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const { username, email, phone, address } = profileData;

  return (
    <div className="min-h-screen  bg-zinc-900/50 rounded-3xl text-white p-6 md:p-10 border border-zinc-700">
      <h1 className="text-4xl font-bold mb-10 text-yellow-400 justify-center items-center" >⚙️ Settings</h1>
 
      {/* User Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div>
          <label className="text-zinc-400 text-sm">👤 Username</label>
          <p className="bg-zinc-800 rounded px-4 py-2 mt-1 font-semibold">{username}</p>
        </div>
        <div>
          <label className="text-zinc-400 text-sm">📧 Email</label>
          <p className="bg-zinc-800 rounded px-4 py-2 mt-1 font-semibold">{email}</p>
        </div>
        <div>
          <label className="text-zinc-400 text-sm">📞 Phone</label>
          <p className="bg-zinc-800 rounded px-4 py-2 mt-1 font-semibold">{phone}</p>
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-zinc-800 border border-yellow-400 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-yellow-300">📍 Delivery Address</h2>
          {!editMode && (
            <button
              className="text-sm text-yellow-300 hover:underline"
              onClick={() => setEditMode(true)}
            >
              ✏️ Edit
            </button>
          )}
        </div>

        {!editMode ? (
          <div className="text-sm text-zinc-300 leading-relaxed">
            <p><strong>🏠</strong> {address?.houseNumber}, {address?.streetName}, {address?.locality}</p>
            {address?.landmark && <p><strong>📍</strong> Landmark: {address.landmark}</p>}
            <p>
              <strong>🏡</strong> {address?.villageOrTown}, {address?.district}, {address?.city}, {address?.state} - {address?.pincode}
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "House Number", name: "houseNumber" },
                { label: "Street Name", name: "streetName" },
                { label: "Landmark (optional)", name: "landmark" },
                { label: "Locality", name: "locality" },
                { label: "Village/Town", name: "villageOrTown" },
                { label: "District", name: "district" },
                { label: "City", name: "city" },
                { label: "State", name: "state" },
                { label: "Pincode", name: "pincode" },
              ].map(({ label, name }) => (
                <div key={name}>
                  <label className="text-sm text-zinc-400">{label}</label>
                  <input
                    type="text"
                    name={name}
                    value={addressFields[name] || ""}
                    onChange={handleChange}
                    placeholder={label}
                    className="w-full p-2 rounded bg-zinc-700 border border-zinc-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-5 py-2 bg-zinc-700 text-zinc-300 rounded hover:bg-zinc-600 transition"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-300 transition"
                onClick={submitAddress}
                disabled={loading}
              >
                {loading ? "Saving..." : "Update Address"}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Settings;
