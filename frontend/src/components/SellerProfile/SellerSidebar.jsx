import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBox, FaClipboardList, FaCog, FaSignOutAlt, FaChartLine, FaRupeeSign } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/auth';

const SellerSidebar = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
const avatarSrc = data?.avatar?.startsWith("http")
  ? data.avatar
  : data?.avatar
    ? `http://localhost:3000/${data.avatar}`
    : data?.user?.avatar?.startsWith("http")
      ? data.user.avatar
      : data?.user?.avatar
        ? `http://localhost:3000/${data.user.avatar}`
        : "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg";

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
      shadow-xl border border-zinc-700">

      {/* Mobile Profile */}
      <div className="w-full sm:hidden mb-6 bg-zinc-800 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
        <div className="rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500">
          <img
            src={avatarSrc}
            alt="Seller Avatar"
            className="w-16 h-16 rounded-full object-cover border-2 border-zinc-800"
          />
        </div>
        <div className="flex flex-col">
          <h2 className="text-base font-semibold">{data?.storeName || "Seller"}</h2>
          <p className="text-xs text-zinc-400">{data?.email || "Not available"}</p>
        </div>
      </div>

      {/* Desktop Avatar */}
      <div className="hidden sm:flex flex-col items-center mt-4">
        <div className="rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500">
          <img
            src={avatarSrc}
            alt="Seller Avatar"
            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-zinc-800"
          />
        </div>
        <h2 className="mt-3 text-lg md:text-xl font-semibold">
  {data?.businessName ||
    (() => {
      const nameParts = data?.fullName?.split(" ");
      if (!nameParts) return "";
      if (nameParts.length === 1) return nameParts[0];
      return `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;
    })()}
</h2>

        <p className="text-sm text-zinc-400">{data?.email || "Not available"}</p>
      </div>

      {/* Navigation */}
      <nav className="mt-6 sm:mt-10 w-full flex flex-col gap-2 px-1">
        {[
            { to: "/seller/profile", icon: <FaChartLine />, label: "Account Info" },
          { to: "/seller/profile/bank-info", icon: <FaChartLine />, label: "Dashboard" },
        //   { to: "/seller/profile/products", icon: <FaBox />, label: "My Products" },
        //   { to: "/seller/profile/orders", icon: <FaClipboardList />, label: "Orders" },
        //   { to: "/seller/profile/payout-info", icon: <FaRupeeSign />, label: "Payout Info" },
        //   { to: "/seller/profile/settings", icon: <FaCog />, label: "Settings" },
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

export default SellerSidebar;
