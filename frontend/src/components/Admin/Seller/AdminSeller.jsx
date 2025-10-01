import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/admin/sellers", {
          headers: {
            id: localStorage.getItem("id"),
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const sorted = [...res.data.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setSellers(sorted);
        setFilteredSellers(sorted);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching sellers:", err);
        setLoading(false);
      }
    };
    fetchSellers();
  }, []);

  const handleStatusUpdate = async (id, status, sellerName) => {
    const confirm = window.confirm(`Are you sure you want to ${status.toLowerCase()} seller "${sellerName}"?`);
    if (!confirm) return;

    try {
      await axios.put(
        `http://localhost:3000/api/v1/admin/sellers/${id}/status`,
        { status },
        {
          headers: {
            id: localStorage.getItem("id"),
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const updated = sellers.map((s) => (s._id === id ? { ...s, status } : s));
      setSellers(updated);
      applyFilter(filter, updated);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDeleteSeller = async (id, sellerName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete seller "${sellerName}"?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/api/v1/admin/sellers/${id}`, {
        headers: {
          id: localStorage.getItem("id"),
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const updated = sellers.filter((s) => s._id !== id);
      setSellers(updated);
      applyFilter(filter, updated);
    } catch (err) {
      console.error("Error deleting seller:", err);
    }
  };

  const applyFilter = (status, data = sellers) => {
    setFilter(status);
    if (status === "all") {
      setFilteredSellers(data);
    } else {
      setFilteredSellers(data.filter((s) => s.status === status));
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filterButtons = [
    { label: "All Sellers", value: "all", color: "bg-zinc-700" },
    { label: "✅ Approved", value: "Approved", color: "bg-green-600" },
    { label: "🕓 Pending", value: "Pending", color: "bg-yellow-600" },
    { label: "❌ Rejected", value: "Rejected", color: "bg-red-600" },
    { label: "🚫 Banned", value: "Banned", color: "bg-gray-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-zinc-900 to-gray-950 text-white px-6 py-10 flex justify-center">
      <div className="w-full max-w-7xl bg-zinc-900/80 rounded-3xl px-8 py-10 shadow-2xl border border-zinc-700 backdrop-blur">
        <h1 className="text-4xl font-bold text-yellow-400 mb-8 tracking-wide">🛍️ Admin – Seller Management</h1>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => applyFilter(btn.value)}
              className={`px-4 py-2 rounded-full font-medium text-sm shadow-lg border border-zinc-600 ${
                filter === btn.value ? "ring-2 ring-yellow-400" : ""
              } ${btn.color} hover:brightness-110 transition-all duration-150`}
            >
              {btn.label}{" "}
              <span className="ml-1 text-white/80 font-semibold">
                (
                {
                  btn.value === "all"
                    ? sellers.length
                    : sellers.filter((s) => s.status === btn.value).length
                }
                )
              </span>
            </button>
          ))}
        </div>

        {/* Seller List */}
        {loading ? (
          <p className="text-yellow-300">Loading sellers...</p>
        ) : filteredSellers.length === 0 ? (
          <p className="text-zinc-400">No sellers found.</p>
        ) : (
          <div className="space-y-5">
            {filteredSellers.map((seller, i) => (
              <div
                key={seller._id}
                onClick={() => navigate(`/admin/sellers/${seller._id}`)}
                className="bg-zinc-800/60 rounded-2xl p-6 flex items-center justify-between hover:bg-zinc-800 hover:shadow-xl transition cursor-pointer border border-zinc-700"
              >
                <div className="flex items-center gap-5">
                  <div className="text-xl font-bold text-yellow-300">{i + 1}.</div>
                  <img
                    src={seller.avatar || DEFAULT_AVATAR}
                    onError={(e) => (e.target.src = DEFAULT_AVATAR)}
                    alt="Avatar"
                    className="w-14 h-14 rounded-full object-cover border-2 border-yellow-400 shadow-md"
                  />
                  <div>
                    <p className="text-xl text-yellow-200 font-semibold">{seller.username || "No Name"}</p>
                    <p className="text-sm text-zinc-300">{seller.email}</p>
                    <p className="text-sm text-zinc-400">📱 {seller.phone || "N/A"}</p>
                    <p className="text-xs text-zinc-500 mt-1 italic">Joined on {formatDate(seller.createdAt)}</p>
                    <p
                      className={`text-sm mt-1 font-bold ${
                        seller.status === "Approved"
                          ? "text-green-400"
                          : seller.status === "Rejected"
                          ? "text-red-400"
                          : seller.status === "Pending"
                          ? "text-yellow-300"
                          : "text-gray-400"
                      }`}
                    >
                      Status: {seller.status}
                    </p>
                  </div>
                </div>

                {/* Status Actions */}
                <div className="flex gap-3">
                  {seller.status === "Pending" && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(seller._id, "Approved", seller.username);
                        }}
                        className="bg-green-500 text-white px-3 py-1.5 rounded-md font-medium hover:bg-green-400 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(seller._id, "Rejected", seller.username);
                        }}
                        className="bg-red-500 text-white px-3 py-1.5 rounded-md font-medium hover:bg-red-400 transition"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {seller.status === "Approved" && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(seller._id, "Banned", seller.username);
                        }}
                        className="bg-gray-700 text-white px-3 py-1.5 rounded-md font-medium hover:bg-gray-600 transition"
                      >
                        Ban
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSeller(seller._id, seller.username);
                        }}
                        className="bg-red-600 text-white px-3 py-1.5 rounded-md font-medium hover:bg-red-500 transition"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSellers;
