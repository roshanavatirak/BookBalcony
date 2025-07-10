import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/auth';
import { FaHeart, FaHistory, FaCog, FaSignOutAlt, FaStore } from 'react-icons/fa';

const Sidebar = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const avatarSrc = data?.avatar?.startsWith("http")
    ? data.avatar
    : `http://localhost:3000/${data?.avatar}` || "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg";

  const handleLogout = () => {
    localStorage.clear();
    dispatch(authActions.logout());
    navigate("/signin");
  };

  

  return (
    <div className="bg-zinc-900/50 rounded-3xl text-white 
      w-full sm:w-80 md:w-72 lg:w-64 xl:w-60 
      h-auto sm:min-h-screen p-4 sm:p-6 
      flex flex-col justify-start items-center 
      shadow-xl rounded-3xl border border-zinc-700">

      {/* Mobile Profile */}
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

      {/* Desktop Avatar */}
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

      {/* Navigation */}
      <nav className="mt-6 sm:mt-10 w-full flex flex-col gap-2 px-1">
        {[
          { to: "/profile", icon: <FaHeart />, label: "Favourites" },
          { to: "/profile/orderHistory", icon: <FaHistory />, label: "Order History" },
          { to: "/profile/settings", icon: <FaCog />, label: "Settings" },
        ].map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`relative group flex items-center gap-3 pl-5 pr-4 py-3 rounded-xl transition-all duration-300 
              ${active
                  ? "bg-zinc-700 border-l-[5px] border-yellow-400 shadow-md"
                  : "hover:bg-zinc-800"
                }`}
            >
              <div className={`text-lg ${active ? "text-yellow-400" : "text-zinc-400 group-hover:text-yellow-300"}`}>
                {item.icon}
              </div>
              <span className={`text-sm font-medium ${active ? "text-white" : "text-zinc-300 group-hover:text-yellow-100"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Conditional Seller Section */}
{data?.isSeller  ? (
  <Link
    to="/profile/verified-seller-info"
    className="relative group flex items-center gap-3 pl-5 pr-4 py-3 mt-2 rounded-xl transition-all duration-300 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 shadow-md hover:shadow-yellow-500 text-black"
  >
    <div className="text-lg text-black group-hover:text-zinc-800">
      <FaStore />
    </div>
    <span className="text-sm font-semibold">You're a Verified Seller</span>
  </Link>
) : (
  <Link
    to="/profile/become-seller"
    className="relative group flex items-center gap-3 pl-5 pr-4 py-3 mt-2 rounded-xl transition-all duration-300 bg-zinc-800 hover:bg-yellow-400 hover:text-black"
  >
    <div className="text-lg text-yellow-400 group-hover:text-black">
      <FaStore />
    </div>
    <span className="text-sm font-semibold text-yellow-300 group-hover:text-black">
      Become a Seller on BookBalcony
    </span>
  </Link>
)}

      </nav>

      {/* Logout */}
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
