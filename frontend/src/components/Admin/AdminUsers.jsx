

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaTimes, FaShoppingCart, FaHeart, FaBox, FaMapMarkerAlt, FaCrown, FaCalendar, FaEnvelope, FaPhone, FaStore } from "react-icons/fa";
import Alert from "../Alert/Alert"; // Import Alert component
import { useAlert } from "../Alert/useAlert"; // Import useAlert hook
import "../Alert/Alert.css"; // Import Alert styles

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ show: false, type: "", userId: "", userName: "" });
  const navigate = useNavigate();

  // Use the alert hook
  const { alert, showAlert, hideAlert, success, error, warning, info } = useAlert();

  const BASE_URL = import.meta.env.VITE_API_URL;
  const API_URL = `${BASE_URL}/api/v1`;
  const API_BASE = API_URL;
  const authHeaders = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE}/admin/users`, {
        headers: authHeaders,
      });

      const sorted = [...response.data.data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setUsers(sorted);
      setFilteredUsers(sorted);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
      error("Failed to load users. Please try again.", "Error!");
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    setLoadingDetails(true);
    try {
      const response = await axios.get(`${API_BASE}/admin/users/${userId}/details`, {
        headers: authHeaders,
      });
      setUserDetails(response.data.data);
      info("User details loaded successfully");
    } catch (err) {
      console.error("Error fetching user details:", err);
      error("Failed to load user details. Please try again.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleViewDetails = async (user) => {
    setSelectedUser(user);
    setShowModal(true);
    await fetchUserDetails(user._id);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setUserDetails(null);
  };

  const openConfirmModal = (type, userId, userName, isBlocked = false) => {
    setConfirmModal({
      show: true,
      type,
      userId,
      userName,
      isBlocked,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ show: false, type: "", userId: "", userName: "", isBlocked: false });
  };

  const handleBlockToggle = async (id, isBlocked) => {
    try {
      const endpoint = isBlocked ? "unblock" : "block";
      await axios.put(
        `${API_BASE}/admin/users/${id}/${endpoint}`,
        {},
        { headers: authHeaders }
      );

      const updatedUsers = users.map((u) =>
        u._id === id ? { ...u, blocked: !isBlocked } : u
      );
      setUsers(updatedUsers);
      applyFilter(filter, updatedUsers);
      
      // Update modal if open
      if (selectedUser?._id === id) {
        setSelectedUser({ ...selectedUser, blocked: !isBlocked });
      }

      // Show success alert
      success(
        `User has been ${isBlocked ? "unblocked" : "blocked"} successfully`,
        `${isBlocked ? "Unblocked" : "Blocked"}!`
      );
      
      closeConfirmModal();
    } catch (err) {
      console.error("Block toggle error:", err);
      error(
        `Failed to ${isBlocked ? "unblock" : "block"} user. Please try again.`,
        "Operation Failed"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/admin/users/${id}`, {
        headers: authHeaders,
      });

      const updated = users.filter((u) => u._id !== id);
      setUsers(updated);
      applyFilter(filter, updated);
      
      if (selectedUser?._id === id) {
        closeModal();
      }

      // Show success alert
      success("User has been deleted successfully", "Deleted!");
      
      closeConfirmModal();
    } catch (err) {
      console.error("Delete error:", err);
      const errorMessage = err.response?.data?.message || "Failed to delete user. Please try again.";
      error(errorMessage, "Delete Failed");
    }
  };

  const applyFilter = (type, list = users) => {
    let sorted;
    if (type === "newest") {
      sorted = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (type === "oldest") {
      sorted = [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (type === "sellers") {
      sorted = list.filter((u) => u.isSeller);
    } else if (type === "premium") {
      sorted = list.filter((u) => u.premium?.isPremium);
    } else if (type === "blocked") {
      sorted = list.filter((u) => u.blocked);
    } else {
      sorted = list;
    }
    setFilteredUsers(sorted);
    
    // Show info about filter applied
    const filterNames = {
      all: "All Users",
      newest: "Newest First",
      oldest: "Oldest First",
      sellers: "Sellers Only",
      premium: "Premium Users",
      blocked: "Blocked Users"
    };
    
    info(`Showing: ${filterNames[type]}`, "Filter Applied");
  };

  const handleFilterChange = (e) => {
    const selected = e.target.value;
    setFilter(selected);
    applyFilter(selected);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleUnblockAll = async () => {
    // Show warning before proceeding
    if (!window.confirm("Are you sure you want to unblock all users?")) return;
    
    try {
      const blockedUsers = users.filter((u) => u.blocked);
      
      if (blockedUsers.length === 0) {
        warning("No blocked users found", "Nothing to Unblock");
        return;
      }

      const unblockPromises = blockedUsers.map((u) =>
        axios.put(`${API_BASE}/admin/users/${u._id}/unblock`, {}, { headers: authHeaders })
      );
      
      await Promise.all(unblockPromises);
      
      success(
        `Successfully unblocked ${blockedUsers.length} user(s)`,
        "Bulk Unblock Complete!"
      );
      
      fetchUsers();
    } catch (err) {
      console.error("Bulk unblock failed:", err);
      error("Failed to unblock all users. Some users may have been unblocked.", "Bulk Operation Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white px-4 sm:px-8 py-10 flex justify-center">
      {/* Premium Alert Component */}
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={hideAlert}
          duration={alert.duration}
          position={alert.position}
          autoClose={alert.autoClose}
        />
      )}

      <div className="w-full max-w-7xl bg-zinc-900/50 rounded-3xl px-6 sm:px-12 py-10 shadow-xl border border-zinc-700">
        
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap mb-6 gap-4">
          <h1 className="text-3xl font-extrabold text-yellow-400 tracking-wide">
            👥 Admin – User Management
          </h1>

          <select
            value={filter}
            onChange={handleFilterChange}
            className="bg-zinc-800 text-yellow-300 border border-zinc-600 px-4 py-2 rounded-lg shadow-sm hover:border-yellow-400 transition"
          >
            <option value="all">All Users</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="sellers">Sellers Only</option>
            <option value="premium">Premium Users</option>
            <option value="blocked">Blocked Users</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-zinc-800/60 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-400">{users.length}</p>
            <p className="text-xs text-zinc-400">Total Users</p>
          </div>
          <div className="bg-zinc-800/60 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-400">{users.filter((u) => u.blocked).length}</p>
            <p className="text-xs text-zinc-400">Blocked</p>
          </div>
          <div className="bg-zinc-800/60 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-400">{users.filter((u) => u.isSeller).length}</p>
            <p className="text-xs text-zinc-400">Sellers</p>
          </div>
          <div className="bg-zinc-800/60 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-purple-400">{users.filter((u) => u.premium?.isPremium).length}</p>
            <p className="text-xs text-zinc-400">Premium</p>
          </div>
          <div className="bg-zinc-800/60 p-4 rounded-lg text-center">
            <button
              onClick={handleUnblockAll}
              className="w-full bg-yellow-500 text-black font-medium px-3 py-2 rounded hover:bg-yellow-400 transition text-xs"
            >
              🔓 Unblock All
            </button>
          </div>
        </div>

        {/* User List */}
        {loading ? (
          <p className="text-yellow-300 text-center py-8">Loading users...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-zinc-400 text-center py-8">No users found.</p>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user, index) => (
              <div
                key={user._id}
                className="bg-zinc-800/60 rounded-xl p-4 flex items-center justify-between hover:bg-zinc-800 hover:shadow-lg transition border border-zinc-700"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-lg font-bold text-yellow-300 w-8">{index + 1}.</div>

                  {user.avatar && user.avatar.startsWith("http") ? (
                    <img
                      src={user.avatar}
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400 shadow-md"
                    />
                  ) : (
                    <FaUserCircle className="text-4xl text-yellow-400" />
                  )}

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-lg text-yellow-200">{user.username}</p>
                      {user.premium?.isPremium && <FaCrown className="text-yellow-400" title="Premium User" />}
                      {user.isSeller && <FaStore className="text-green-400" title="Seller" />}
                      {user.blocked && <span className="text-xs bg-red-500 px-2 py-1 rounded">BLOCKED</span>}
                    </div>
                    <p className="text-sm text-zinc-300">{user.email}</p>
                    <p className="text-sm text-zinc-400">📱 {user.phone || "N/A"}</p>
                    <p className="text-xs text-zinc-500 mt-1 italic">
                      Joined {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleViewDetails(user)}
                    className="bg-blue-500 text-white px-4 py-1.5 rounded-md font-medium hover:bg-blue-400 transition text-sm"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => openConfirmModal("block", user._id, user.username, user.blocked)}
                    className="bg-yellow-400 text-black px-4 py-1.5 rounded-md font-medium hover:bg-yellow-300 transition text-sm"
                  >
                    {user.blocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    onClick={() => openConfirmModal("delete", user._id, user.username)}
                    className="bg-red-500 text-white px-4 py-1.5 rounded-md font-medium hover:bg-red-400 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-zinc-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-yellow-400 shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-zinc-800 p-6 border-b border-zinc-700 flex justify-between items-center">
              <div className="flex items-center gap-4">
                {selectedUser.avatar && selectedUser.avatar.startsWith("http") ? (
                  <img
                    src={selectedUser.avatar}
                    alt="User"
                    className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400"
                  />
                ) : (
                  <FaUserCircle className="text-5xl text-yellow-400" />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
                    {selectedUser.username}
                    {selectedUser.premium?.isPremium && <FaCrown className="text-yellow-400" />}
                    {selectedUser.isSeller && <FaStore className="text-green-400" />}
                  </h2>
                  <p className="text-zinc-400 text-sm">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-zinc-400 hover:text-white transition"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {loadingDetails ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
                  <p className="text-zinc-400 mt-4">Loading details...</p>
                </div>
              ) : userDetails ? (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="bg-zinc-800/50 rounded-lg p-5">
                    <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                      <FaUserCircle /> Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-zinc-400 text-sm">Username</p>
                        <p className="text-white font-semibold">{userDetails.username}</p>
                      </div>
                      <div>
                        <p className="text-zinc-400 text-sm flex items-center gap-1">
                          <FaEnvelope className="text-xs" /> Email
                        </p>
                        <p className="text-white font-semibold">{userDetails.email}</p>
                      </div>
                      <div>
                        <p className="text-zinc-400 text-sm flex items-center gap-1">
                          <FaPhone className="text-xs" /> Phone
                        </p>
                        <p className="text-white font-semibold">{userDetails.phone || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-zinc-400 text-sm flex items-center gap-1">
                          <FaCalendar className="text-xs" /> Joined
                        </p>
                        <p className="text-white font-semibold">{formatDate(userDetails.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-zinc-400 text-sm">Account Status</p>
                        <p className={`font-semibold ${userDetails.blocked ? "text-red-400" : "text-green-400"}`}>
                          {userDetails.blocked ? "Blocked" : "Active"}
                        </p>
                      </div>
                      <div>
                        <p className="text-zinc-400 text-sm">Role</p>
                        <p className="text-white font-semibold capitalize">{userDetails.role}</p>
                      </div>
                      <div>
                        <p className="text-zinc-400 text-sm flex items-center gap-1">
                          <FaStore className="text-xs" /> Seller Status
                        </p>
                        <p className={`font-semibold ${userDetails.isSeller ? "text-green-400" : "text-zinc-400"}`}>
                          {userDetails.isSeller ? "Yes" : "No"}
                        </p>
                      </div>
                      <div>
                        <p className="text-zinc-400 text-sm flex items-center gap-1">
                          <FaCrown className="text-xs" /> Premium Status
                        </p>
                        <p className={`font-semibold ${userDetails.premium?.isPremium ? "text-purple-400" : "text-zinc-400"}`}>
                          {userDetails.premium?.isPremium ? `Yes (${userDetails.premium.membershipType})` : "No"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Premium Details */}
                  {userDetails.premium?.isPremium && (
                    <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-5 border border-purple-500/50">
                      <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                        <FaCrown /> Premium Membership
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-zinc-400 text-sm">Membership Type</p>
                          <p className="text-white font-semibold capitalize">{userDetails.premium.membershipType}</p>
                        </div>
                        {userDetails.premium.startDate && (
                          <div>
                            <p className="text-zinc-400 text-sm">Start Date</p>
                            <p className="text-white font-semibold">{formatDate(userDetails.premium.startDate)}</p>
                          </div>
                        )}
                        {userDetails.premium.expiryDate && (
                          <div>
                            <p className="text-zinc-400 text-sm">Expiry Date</p>
                            <p className="text-white font-semibold">{formatDate(userDetails.premium.expiryDate)}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-zinc-400 text-sm">Features</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {Object.entries(userDetails.premium.features || {})
                              .filter(([_, enabled]) => enabled)
                              .map(([feature, _]) => (
                                <span key={feature} className="bg-purple-500/30 text-purple-300 text-xs px-2 py-1 rounded">
                                  {feature.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Addresses */}
                  <div className="bg-zinc-800/50 rounded-lg p-5">
                    <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                      <FaMapMarkerAlt /> Addresses ({userDetails.addresses?.length || 0})
                    </h3>
                    {userDetails.addresses && userDetails.addresses.length > 0 ? (
                      <div className="space-y-3">
                        {userDetails.addresses.map((addr, idx) => (
                          <div key={addr._id || idx} className="bg-zinc-700/50 p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <p className="font-semibold text-white">{addr.fullName}</p>
                              {addr.isPrimary && (
                                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Primary</span>
                              )}
                            </div>
                            <p className="text-zinc-300 text-sm">{addr.phone}</p>
                            <p className="text-zinc-300 text-sm mt-2">
                              {addr.addressLine1}{addr.addressLine2 && `, ${addr.addressLine2}`}
                            </p>
                            <p className="text-zinc-300 text-sm">
                              {addr.locality}, {addr.city}, {addr.state} - {addr.postalCode}
                            </p>
                            <p className="text-zinc-400 text-sm">{addr.country}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-zinc-400 text-sm">No addresses added</p>
                    )}
                  </div>

                  {/* Cart */}
                  <div className="bg-zinc-800/50 rounded-lg p-5">
                    <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                      <FaShoppingCart /> Cart ({userDetails.cart?.length || 0} items)
                    </h3>
                    {userDetails.cart && userDetails.cart.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {userDetails.cart.map((item, idx) => (
                          <div key={item._id || idx} className="bg-zinc-700/50 p-3 rounded-lg flex gap-3">
                            {item.url && (
                              <img
                                src={item.url}
                                alt={item.title}
                                className="w-16 h-20 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <p className="text-white font-semibold text-sm">{item.title}</p>
                              <p className="text-green-400 text-sm">₹{item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-zinc-400 text-sm">Cart is empty</p>
                    )}
                  </div>

                  {/* Favourites */}
                  <div className="bg-zinc-800/50 rounded-lg p-5">
                    <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                      <FaHeart /> Favourites ({userDetails.favourites?.length || 0} items)
                    </h3>
                    {userDetails.favourites && userDetails.favourites.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {userDetails.favourites.map((item, idx) => (
                          <div key={item._id || idx} className="bg-zinc-700/50 p-3 rounded-lg">
                            {item.url && (
                              <img
                                src={item.url}
                                alt={item.title}
                                className="w-full h-32 object-cover rounded mb-2"
                              />
                            )}
                            <p className="text-white font-semibold text-sm truncate">{item.title}</p>
                            <p className="text-green-400 text-sm">₹{item.price}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-zinc-400 text-sm">No favourites</p>
                    )}
                  </div>

                  {/* Orders */}
                  <div className="bg-zinc-800/50 rounded-lg p-5">
                    <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                      <FaBox /> Order History ({userDetails.orders?.length || 0} orders)
                    </h3>
                    {userDetails.orders && userDetails.orders.length > 0 ? (
                      <div className="space-y-3">
                        {userDetails.orders.map((order, idx) => (
                          <div key={order._id || idx} className="bg-zinc-700/50 p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="text-white font-semibold">Order #{order._id?.slice(-8)}</p>
                                <p className="text-zinc-400 text-sm">{formatDate(order.createdAt)}</p>
                              </div>
                              <span className={`text-xs px-3 py-1 rounded ${
                                order.status === "Order placed" ? "bg-blue-500" :
                                order.status === "Out for delivery" ? "bg-yellow-500" :
                                order.status === "Delivered" ? "bg-green-500" :
                                "bg-red-500"
                              } text-white`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-green-400 font-bold">Total: ₹{order.totalAmount || 0}</p>
                            <p className="text-zinc-400 text-sm mt-2">{order.book?.length || 0} items</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-zinc-400 text-sm">No orders yet</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-zinc-400 text-center py-8">Failed to load user details</p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-zinc-800 p-4 border-t border-zinc-700 flex gap-3 justify-end">
              <button
                onClick={() => openConfirmModal("block", selectedUser._id, selectedUser.username, selectedUser.blocked)}
                className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium hover:bg-yellow-300 transition"
              >
                {selectedUser.blocked ? "Unblock User" : "Block User"}
              </button>
              <button
                onClick={() => openConfirmModal("delete", selectedUser._id, selectedUser.username)}
                className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-400 transition"
              >
                Delete User
              </button>
              <button
                onClick={closeModal}
                className="bg-zinc-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-zinc-500 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl w-full max-w-md border-2 border-yellow-400 shadow-2xl p-6">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                confirmModal.type === "delete" ? "bg-red-500/20" : "bg-yellow-500/20"
              }`}>
                {confirmModal.type === "delete" ? (
                  <FaTimes className="text-3xl text-red-500" />
                ) : (
                  <span className="text-3xl">{confirmModal.isBlocked ? "🔓" : "🔒"}</span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {confirmModal.type === "delete" ? "Delete User?" : confirmModal.isBlocked ? "Unblock User?" : "Block User?"}
              </h3>
              <p className="text-zinc-400">
                Are you sure you want to {confirmModal.type === "delete" ? "permanently delete" : confirmModal.isBlocked ? "unblock" : "block"}{" "}
                <span className="text-yellow-400 font-semibold">{confirmModal.userName}</span>?
              </p>
              {confirmModal.type === "delete" && (
                <p className="text-red-400 text-sm mt-2">This action cannot be undone!</p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={closeConfirmModal}
                className="flex-1 bg-zinc-700 text-white px-4 py-3 rounded-lg font-medium hover:bg-zinc-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmModal.type === "delete") {
                    handleDelete(confirmModal.userId);
                  } else {
                    handleBlockToggle(confirmModal.userId, confirmModal.isBlocked);
                  }
                }}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
                  confirmModal.type === "delete"
                    ? "bg-red-500 hover:bg-red-400 text-white"
                    : "bg-yellow-400 hover:bg-yellow-300 text-black"
                }`}
              >
                {confirmModal.type === "delete" ? "Delete" : confirmModal.isBlocked ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;