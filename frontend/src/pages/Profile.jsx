import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Profile/Sidebar';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
import Loader from '../components/Loader/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHeart, FaHistory, FaCog, FaBell, FaStore, FaSignOutAlt,
  FaUserCircle, FaCrown, FaChevronRight, FaEllipsisV
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { authActions } from '../store/auth';

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [sellerData, setSellerData] = useState(null);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/get-user-information`,
          { headers }
        );
        console.log("User info:", response.data);
        setUserData(response.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    const fetchSeller = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/seller/get-seller-info`,
          { headers }
        );
        console.log("Seller info:", response.data);
        setSellerData(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          console.log("User is not a seller (404 - normal behavior)");
          setSellerData(null);
        } else {
          console.error("Error fetching seller info:", err);
        }
      }
    };

    fetchUser();
    fetchSeller();
  }, []);

  // Close more menu when clicking outside
  useEffect(() => {
    if (!moreMenuOpen) return;
    const handleClick = () => setMoreMenuOpen(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [moreMenuOpen]);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(authActions.logout());
    navigate("/signin");
  };

  // Extract user info safely
  const username = userData?.username || userData?.data?.username || userData?.name || 'Profile';
  const email = userData?.email || userData?.data?.email || '';
  const avatarSrc = userData?.avatar
    ? (userData.avatar.startsWith('http') ? userData.avatar : `${BASE_URL}/${userData.avatar}`)
    : "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?w=740";

  // Seller status
  const sellerStatus = sellerData?.data?.status || sellerData?.status || null;

  // Mobile tab navigation items
  const tabs = [
    { to: "/profile", icon: <FaHeart />, label: "Favourites", exact: true },
    { to: "/profile/orderHistory", icon: <FaHistory />, label: "Orders" },
    { to: "/profile/my-subscriptions", icon: <FaBell />, label: "Subscriptions" },
    { to: "/profile/settings", icon: <FaCog />, label: "Settings" },
  ];

  const isTabActive = (tab) => {
    if (tab.exact) return location.pathname === tab.to;
    return location.pathname.startsWith(tab.to);
  };

  return (
    <div className="bg-gradient-to-b md:bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 min-h-screen text-white">
      {!userData ? (
        <div className="w-full h-[60vh] flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {/* ═══════════════════════════════════════════
              MOBILE LAYOUT (hidden on md+)
          ═══════════════════════════════════════════ */}
          <div className="md:hidden">
            {/* ── Mobile Profile Header ── */}
            <div className="relative px-4 pt-4 pb-3">
              <div className="flex items-center justify-between">
                {/* Avatar + Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500">
                      <img
                        src={avatarSrc}
                        alt="Avatar"
                        className="w-12 h-12 rounded-full object-cover border-2 border-zinc-900"
                        onError={(e) => {
                          e.target.src = "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?w=740";
                        }}
                      />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-3.5 h-3.5 rounded-full border-2 border-zinc-900" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-base font-bold text-white truncate">{username}</h1>
                    <p className="text-xs text-zinc-400 truncate">{email}</p>
                  </div>
                </div>

                {/* Three-dot Menu */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMoreMenuOpen(!moreMenuOpen);
                    }}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-800/80 border border-zinc-700/50 hover:bg-zinc-700 transition-all"
                    aria-label="More options"
                  >
                    <FaEllipsisV className="text-zinc-400 text-sm" />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {moreMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-11 w-52 bg-zinc-800/95 backdrop-blur-xl border border-zinc-700/60 rounded-xl shadow-2xl overflow-hidden z-50"
                      >
                        {/* Seller Action */}
                        {sellerStatus === "Approved" ? (
                          <Link
                            to="/profile/verified-seller-info"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-yellow-400/10 transition-colors"
                          >
                            <FaStore className="text-yellow-400 text-sm" />
                            <span className="text-sm text-yellow-300 font-medium">Seller Dashboard</span>
                            <FaChevronRight className="ml-auto text-[10px] text-zinc-500" />
                          </Link>
                        ) : sellerStatus === "Pending" ? (
                          <Link
                            to="/profile/seller-application-submitted"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-orange-400/10 transition-colors"
                          >
                            <FaStore className="text-orange-400 text-sm animate-pulse" />
                            <span className="text-sm text-orange-300 font-medium">Application Pending</span>
                          </Link>
                        ) : (
                          <Link
                            to="/profile/become-seller"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-yellow-400/10 transition-colors"
                          >
                            <FaStore className="text-yellow-400 text-sm" />
                            <span className="text-sm text-zinc-300">Become a Seller</span>
                            <FaChevronRight className="ml-auto text-[10px] text-zinc-500" />
                          </Link>
                        )}

                        <div className="h-px bg-zinc-700/50 mx-3" />

                        {/* Logout */}
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition-colors w-full text-left"
                        >
                          <FaSignOutAlt className="text-red-400 text-sm" />
                          <span className="text-sm text-red-400 font-medium">Log Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* ── Mobile Tab Bar (horizontal scrollable) ── */}
            <div className="px-4 mb-3">
              <div className="flex gap-1.5 bg-zinc-800/60 rounded-xl p-1 border border-zinc-700/30">
                {tabs.map((tab) => {
                  const active = isTabActive(tab);
                  return (
                    <Link
                      key={tab.to}
                      to={tab.to}
                      className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-center transition-all duration-200
                        ${active
                          ? 'bg-gradient-to-b from-yellow-400/20 to-yellow-400/5 text-yellow-400 shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                    >
                      <span className={`text-sm ${active ? 'drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]' : ''}`}>
                        {tab.icon}
                      </span>
                      <span className={`text-[10px] font-medium leading-none ${active ? 'text-yellow-300' : 'text-zinc-500'}`}>
                        {tab.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* ── Mobile Content Area ── */}
            <div className="px-3 pb-28">
              <Outlet />
            </div>
          </div>

          {/* ═══════════════════════════════════════════
              DESKTOP LAYOUT (hidden on mobile)
          ═══════════════════════════════════════════ */}
          <div className="hidden md:flex flex-row px-8 lg:px-12 py-8 gap-4">
            <div className="w-1/4 xl:w-1/5 min-h-screen">
              <Sidebar data={userData} seller={sellerData} />
            </div>
            <div className="w-3/4 xl:w-4/5">
              <Outlet />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;