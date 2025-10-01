import React, { useEffect, useRef, useState } from "react";
import {
  FaBars,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUsers,
  FaBook,
  FaPlus,
  FaCog,
  FaHome,
  FaTruck,
  FaStore,
  FaClipboardList,
  FaTags,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth";

const userLinks = [
  { title: "Dashboard", link: "/admin/dashboard", icon: <FaTachometerAlt /> },
  { title: "Users", link: "/admin/Users-List", icon: <FaUsers /> },
  { title: "Books", link: "/admin/books", icon: <FaBook /> },
  { title: "Add Book", link: "/admin/Addbook", icon: <FaPlus /> },
  { title: "Manage Orders", link: "/admin/orders", icon: <FaTruck /> },
  { title: "Settings", link: "/admin/settings", icon: <FaCog /> },
];

const sellerLinks = [
  { title: "Seller Dashboard", link: "/seller/dashboard", icon: <FaStore /> },
  { title: "All Sellers", link: "/admin/Sellers-List", icon: <FaUsers /> },
  { title: "Products", link: "/seller/products", icon: <FaClipboardList /> },
  { title: "Add Product", link: "/seller/add", icon: <FaPlus /> },
  { title: "Seller Orders", link: "/seller/orders", icon: <FaTruck /> },
  { title: "Seller Settings", link: "/seller/settings", icon: <FaTags /> },
];

const AdminNavbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSeller, setIsSeller] = useState(
    localStorage.getItem("viewMode") === "seller"
  );

  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(authActions.logout());
    localStorage.clear();
    navigate("/signin");
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const toggleView = () => {
    const newMode = !isSeller;
    setIsSeller(newMode);
    localStorage.setItem("viewMode", newMode ? "seller" : "user");
  };

  const activeLinks = isSeller ? sellerLinks : userLinks;

  return (
    <nav className="w-full bg-zinc-900 text-white px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <FaBars
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-yellow-400 text-xl cursor-pointer lg:hidden"
          />
          <Link to={isSeller ? "/seller/dashboard" : "/admin/dashboard"} className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-yellow-400">
              {isSeller ? "Seller Panel" : "Admin Panel"}
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-semibold">
          {activeLinks.map((item, idx) => (
            <Link
              to={item.link}
              key={idx}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
                currentPath === item.link
                  ? "bg-yellow-400 text-black shadow"
                  : "text-white hover:text-yellow-400 hover:bg-zinc-800"
              }`}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </div>

        {/* Profile & Toggle & Home */}
        <div className="relative flex items-center gap-4">
          {/* Toggle Switch */}
          <div
            className="flex items-center gap-2 cursor-pointer bg-zinc-800 px-2 py-1 rounded-full border border-yellow-400"
            onClick={toggleView}
            title="Switch Panel"
          >
            <div className={`w-3 h-3 rounded-full ${isSeller ? "bg-pink-400" : "bg-green-400"}`}></div>
            <span className="text-xs text-yellow-300 font-bold">
              {isSeller ? "Seller" : "User"}
            </span>
          </div>

          {/* Back to Home */}
          <Link
            to="/"
            className="hidden sm:flex items-center text-yellow-400 gap-2 hover:underline"
            title="Back to BookBalcony"
          >
            <FaHome /> Home
          </Link>

          {/* Avatar */}
          <img
            src="https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg"
            alt="Admin"
            onClick={() => setProfileOpen((prev) => !prev)}
            className="w-10 h-10 rounded-full border-2 border-yellow-400 cursor-pointer hover:scale-105 transition"
          />

          {/* Dropdown */}
          {profileOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-48 bg-zinc-800 rounded-xl shadow-lg border border-yellow-500 z-50"
            >
              <Link
                to={isSeller ? "/admin/profile" : "/admin/profile"}
                onClick={() => setProfileOpen(false)}
                className="block px-4 py-2 text-sm text-white hover:bg-yellow-400 hover:text-black transition rounded-t-xl"
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white rounded-b-xl transition"
              >
                <FaSignOutAlt className="inline mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="lg:hidden mt-4 flex flex-col gap-2 text-sm font-semibold">
          {activeLinks.map((item, idx) => (
            <Link
              to={item.link}
              key={idx}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${
                currentPath === item.link
                  ? "bg-yellow-400 text-black shadow"
                  : "text-white hover:text-yellow-400 hover:bg-zinc-800"
              }`}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
