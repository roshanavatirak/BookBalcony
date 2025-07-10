import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaCogs, FaBook, FaUserShield, FaUsers, FaShoppingCart, FaBoxOpen } from "react-icons/fa";

const AdminProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/get-user-information", { headers });
        if (res.data.role !== "admin") {
          alert("Access denied. Not an admin.");
          window.location.href = "/";
        } else {
          setUser(res.data);
        }
      } catch (err) {
        console.error("Error fetching admin info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-900 text-yellow-300">
        <p className="animate-pulse text-lg font-semibold">Loading Admin Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-black p-6 text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-yellow-400 mb-6">🚀 Admin Control Center</h1>

        {/* Profile Card */}
        <div className="bg-zinc-800 rounded-2xl border border-yellow-500 p-6 flex flex-col md:flex-row gap-6 shadow-xl hover:shadow-yellow-500/40 transition-all duration-300">
          <img
            src={user?.avatar || "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg"}
            alt="admin-avatar"
            className="w-28 h-28 rounded-full border-4 border-yellow-400 shadow-lg hover:scale-105 transition"
          />
          <div className="flex-1 space-y-2">
            <h2 className="text-2xl font-bold">{user?.username}</h2>
            <p className="text-sm text-zinc-300">📧 {user?.email}</p>
            <p className="text-sm text-zinc-300">📞 {user?.phone}</p>
            <p className="text-sm text-yellow-300 font-semibold uppercase">🔒 {user?.role}</p>

            {user?.address && (
              <div className="bg-zinc-900 p-3 rounded-md border border-zinc-700 mt-4 text-sm text-zinc-200">
                <p><strong>📍 Address:</strong></p>
                <p>
                  {user.address.houseNumber}, {user.address.streetName}, {user.address.locality}
                </p>
                <p>
                  {user.address.city}, {user.address.state} - {user.address.pincode}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Admin Features */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-xl p-5 border border-yellow-400 shadow-lg hover:shadow-yellow-300/30 transition"
          >
            <h3 className="text-xl font-semibold text-yellow-300 mb-3 flex items-center gap-2">
              <FaUsers /> Manage Users
            </h3>
            <p className="text-sm text-zinc-300">Edit, block, or assign roles to users.</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-xl p-5 border border-yellow-400 shadow-lg hover:shadow-yellow-300/30 transition"
          >
            <h3 className="text-xl font-semibold text-yellow-300 mb-3 flex items-center gap-2">
              <FaBook /> Manage Books
            </h3>
            <p className="text-sm text-zinc-300">Add, edit, or remove book listings.</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-xl p-5 border border-yellow-400 shadow-lg hover:shadow-yellow-300/30 transition"
          >
            <h3 className="text-xl font-semibold text-yellow-300 mb-3 flex items-center gap-2">
              <FaShoppingCart /> Orders & Payments
            </h3>
            <p className="text-sm text-zinc-300">Track, update, and verify orders and payments.</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-xl p-5 border border-yellow-400 shadow-lg hover:shadow-yellow-300/30 transition"
          >
            <h3 className="text-xl font-semibold text-yellow-300 mb-3 flex items-center gap-2">
              <FaCogs /> Settings & Customization
            </h3>
            <p className="text-sm text-zinc-300">Manage homepage, banners, and platform preferences.</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminProfile;
