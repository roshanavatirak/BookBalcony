import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/admin/users", {
          headers: {
            id: localStorage.getItem("id"),
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const sorted = [...response.data.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setUsers(sorted);
        setFilteredUsers(sorted);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleBlockToggle = (id, isBlocked) => {
    alert(`This would ${isBlocked ? "unblock" : "block"} user: ${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/v1/admin/users/${id}`, {
        headers: {
          id: localStorage.getItem("id"),
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const updated = users.filter((u) => u._id !== id);
      setUsers(updated);
      applyFilter(filter, updated);
      alert("User deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete user");
    }
  };

  const applyFilter = (type, list = users) => {
    let sorted;
    if (type === "newest") {
      sorted = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (type === "oldest") {
      sorted = [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      sorted = list;
    }
    setFilteredUsers(sorted);
  };

  const handleFilterChange = (e) => {
    const selected = e.target.value;
    setFilter(selected);
    applyFilter(selected);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleUnblockAll = async () => {
  if (!window.confirm("Are you sure you want to unblock all users?")) return;
  try {
    const unblockPromises = users
      .filter((u) => u.blocked)
      .map((u) =>
        axios.put(
          `http://localhost:3000/api/v1/admin/users/${u._id}/unblock`,
          {},
          {
            headers: {
              id: localStorage.getItem("id"),
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
      );
    await Promise.all(unblockPromises);
    alert("All blocked users have been unblocked.");
    window.location.reload();
  } catch (err) {
    console.error("Bulk unblock failed:", err);
    alert("Failed to unblock all users.");
  }
};


 return (
  <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white px-4 sm:px-8 py-10 flex justify-center">
    <div className="w-full max-w-7xl bg-zinc-900/50 rounded-3xl px-6 sm:px-12 py-10 shadow-xl border border-zinc-700">

      {/* Header: Title + Filter */}
      <div className="flex items-center justify-between flex-wrap mb-6">
        <h1 className="text-3xl font-extrabold text-yellow-400 tracking-wide mb-2">
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
        </select>
      </div>

      {/* Stats and Bulk Actions */}
      <div className="flex justify-between items-center mb-4 text-sm text-zinc-300">
        <p>
          📊 Total Registered:{" "}
          <span className="text-yellow-400 font-semibold">{users.length}</span> | Blocked:{" "}
          <span className="text-red-400 font-semibold">{users.filter((u) => u.blocked).length}</span>
        </p>
        <button
          onClick={handleUnblockAll}
          className="bg-yellow-500 text-black font-medium px-4 py-1.5 rounded hover:bg-yellow-400 transition"
        >
          🔓 Unblock All Users
        </button>
      </div>

      {/* Loader / Empty / User List */}
      {loading ? (
        <p className="text-yellow-300">Loading users...</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-zinc-400">No users found.</p>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user, index) => (
            <div
              key={user._id}
              onClick={() => navigate(`/admin/users/${user._id}`)}
              className="bg-zinc-800/60 rounded-xl p-5 flex items-center justify-between hover:bg-zinc-800 hover:shadow-lg transition cursor-pointer border border-zinc-700"
            >
              <div className="flex items-center gap-4">
  <div className="text-lg font-bold text-yellow-300">{index + 1}.</div>

  {user.avatar && user.avatar.startsWith("http")
? (
    <img
      src={user.avatar}
      alt="User Avatar"
      className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400 shadow-md"
    />
  ) : (
    <FaUserCircle className="text-4xl text-yellow-400" />
  )}

  <div>
    <p className="font-semibold text-lg text-yellow-200">{user.username}</p>
    <p className="text-sm text-zinc-300">{user.email}</p>
    <p className="text-sm text-zinc-400">📱 {user.phone || "N/A"}</p>
    <p className="text-xs text-zinc-500 mt-1 italic">Joined on {formatDate(user.createdAt)}</p>
  </div>
</div>


              <div className="flex gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBlockToggle(user._id, user.blocked);
                  }}
                  className="bg-yellow-400 text-black px-4 py-1.5 rounded-md font-medium hover:bg-yellow-300 transition"
                >
                  {user.blocked ? "Unblock" : "Block"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(user._id);
                  }}
                  className="bg-red-500 text-white px-4 py-1.5 rounded-md font-medium hover:bg-red-400 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

};

export default AdminUsers;
