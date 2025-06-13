import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/auth';
import { FaHeart, FaHistory, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const avatarSrc = data?.avatar?.startsWith("http")
    ? data.avatar
    : `http://localhost:3000/${data?.avatar}` || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const handleLogout = () => {
    localStorage.clear();
    dispatch(authActions.logout());
    navigate("/signin");
  };

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-gray-800 text-white 
      w-full sm:w-80 md:w-72 lg:w-64 xl:w-60 
      h-auto sm:min-h-screen p-4 sm:p-6 
      flex flex-col justify-start items-center 
      shadow-xl rounded-3xl">

      {/* Mobile Horizontal Profile Card */}
      <div className="w-full sm:hidden mb-6 bg-zinc-800 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
        <div className="rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500">
          <img
            src={avatarSrc}
            alt="User Avatar"
            className="w-16 h-16 rounded-full object-cover border-2 border-zinc-800"
          />
        </div>
        <div className="flex flex-col">
          <h2 className="text-base font-semibold">{data?.username || "Profile"}</h2>
          <p className="text-xs text-zinc-400">{data?.email || "Not available"}</p>
        </div>
      </div>

      {/* Desktop Vertical Avatar */}
      <div className="hidden sm:flex flex-col items-center mt-4">
        <div className="rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500">
          <img
            src={avatarSrc}
            alt="User Avatar"
            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-zinc-800"
          />
        </div>
        <h2 className="mt-3 text-lg md:text-xl font-semibold">{data?.username || "Profile"}</h2>
        <p className="text-sm text-zinc-400">{data?.email || "Not available"}</p>
      </div>

      {/* Navigation Links */}
      <nav className="mt-4 sm:mt-8 w-full flex flex-col gap-3 px-2">
        <Link
          to="/profile"
          className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-700 rounded-lg transition-all duration-300"
        >
          <FaHeart className="text-yellow-400" />
          <span className="text-sm font-medium">Favourites</span>
        </Link>
        <Link
          to="/profile/orderHistory"
          className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-700 rounded-lg transition-all duration-300"
        >
          <FaHistory className="text-yellow-400" />
          <span className="text-sm font-medium">Order History</span>
        </Link>
        <Link
          to="/profile/settings"
          className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-700 rounded-lg transition-all duration-300"
        >
          <FaCog className="text-yellow-400" />
          <span className="text-sm font-medium">Settings</span>
        </Link>
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-6 sm:mt-auto mb-4 flex items-center gap-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300 w-full justify-center"
      >
        <FaSignOutAlt />
        <span className="text-sm font-medium">Log Out</span>
      </button>
    </div>
  );
};

export default Sidebar;
