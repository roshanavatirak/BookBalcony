import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useSelector } from 'react-redux';
import axios from 'axios';

// Icons
import {
  FaHome,
  FaInfoCircle,
  FaPlus,
  FaBoxOpen,
  FaUser,
  FaComments,
  FaShoppingCart,
} from 'react-icons/fa';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSellerApproved, setIsSellerApproved] = useState(false);
  const [sellerMode, setSellerMode] = useState(localStorage.getItem('sellerMode') === 'true');

  const location = useLocation();
  const currentPath = location.pathname;
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSeller = async () => {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('id');
      if (!token || !id) return;

      try {
        const res = await axios.get(`http://localhost:3000/api/v1/seller/check/${id}`, {
          headers: { authorization: `Bearer ${token}` },
        });
        if (res.data?.isSeller && res.data?.status === 'Approved') {
          setIsSellerApproved(true);
        }
      } catch (err) {
        console.log('Not a seller or error', err);
      }
    };

    checkSeller();
  }, []);

  const handleToggleMode = () => {
    const updated = !sellerMode;
    setSellerMode(updated);
    localStorage.setItem('sellerMode', updated);
    navigate(updated ? '/seller/dashboard' : '/');
  };

  const handleLinkClick = () => setMenuOpen(false);

  let links = [];
  if (isLoggedIn && sellerMode && isSellerApproved) {
    links = [
      { title: 'Dashboard', link: '/seller/dashboard', icon: <FaHome /> },
      // { title: 'About Us', link: '/seller/about-us', icon: <FaInfoCircle /> },
      { title: 'Add Product', link: '/seller/add-book', icon: <FaPlus /> },
      { title: 'My Products', link: '/seller/products', icon: <FaBoxOpen /> },
      { title: 'Orders', link: '/seller/orders', icon: <FaShoppingCart /> },
      // { title: 'Messages', link: '/seller/messages', icon: <FaComments /> },
      { title: 'Profile', link: '/seller/profile', icon: <FaUser /> },
    ];
  } else {
    links = [
      { title: 'Home', link: '/', icon: <FaHome /> },
      { title: 'About Us', link: '/about-us', icon: <FaInfoCircle /> },
      { title: 'All Books', link: '/all-books', icon: <FaBoxOpen /> },
    ];
    if (isLoggedIn) {
      links.push(
        { title: 'Cart', link: '/cart', icon: <FaShoppingCart /> },
        { title: 'Profile', link: '/profile', icon: <FaUser /> }
      );
    }
  }

  return (
    <nav className="w-full bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white px-4 sm:px-8 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
        {/* Logo */}
        <Link
          to={sellerMode && isSellerApproved ? '/seller/dashboard' : '/'}
          className="flex items-center gap-4"
          onClick={handleLinkClick}
        >
          <img className="h-9 sm:h-10" src={logo} alt="logo" />
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide text-white select-none">
            BookBalcony
          </h1>
        </Link>

        {/* Seller Toggle */}
        {isLoggedIn && isSellerApproved && (
          <div className="mx-auto mt-2 sm:mt-0">
            <div
              className={`flex items-center cursor-pointer w-24 sm:w-28 h-8 sm:h-10 rounded-full p-0.5 transition duration-300 ${
                sellerMode ? 'bg-yellow-400' : 'bg-zinc-700'
              }`}
              onClick={handleToggleMode}
            >
              <div
                className={`w-1/2 h-full flex items-center justify-center text-xs sm:text-sm font-medium rounded-full transition-all duration-300 ${
                  !sellerMode ? 'bg-white text-black shadow' : 'text-white'
                }`}
              >
                User
              </div>
              <div
                className={`w-1/2 h-full flex items-center justify-center text-xs sm:text-sm font-medium rounded-full transition-all duration-300 ${
                  sellerMode ? 'bg-white text-black shadow' : 'text-white'
                }`}
              >
                Seller
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu Button */}
        <div className="lg:hidden ml-auto">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-yellow-400 text-2xl">
            ☰
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium ml-auto">
          {links.map((item, i) => {
            const isActive = currentPath === item.link;
            return (
              <div className="group relative" key={i}>
                <Link
                  to={item.link}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-1 transition-all duration-300 ${
                    isActive ? 'text-yellow-400' : 'text-white hover:text-yellow-400'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 bg-yellow-400 transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                ></span>
              </div>
            );
          })}
          {!isLoggedIn && (
            <>
              <Link
                to="/signin"
                className="px-4 py-1 border-2 border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black transition duration-300"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1 bg-yellow-400 text-black rounded-lg hover:bg-white hover:text-black transition duration-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="lg:hidden mt-4 px-4 flex flex-col gap-4 text-sm font-semibold">
          {links.map((item, i) => (
            <Link
              key={i}
              to={item.link}
              onClick={handleLinkClick}
              className={`flex items-center gap-2 transition duration-300 ${
                currentPath === item.link ? 'text-yellow-400 font-bold' : 'text-white hover:text-yellow-400'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
