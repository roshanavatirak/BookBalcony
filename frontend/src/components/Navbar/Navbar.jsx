import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useSelector } from 'react-redux';
import { authActions } from '../../store/auth';
import {useDispatch} from'react-redux'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const links = [
    { title: "Home", link: "/" },
    { title: "About Us", link: "/about-us" },
    { title: "All Books", link: "/all-books" },
  ];

  if (isLoggedIn) {
    links.push({ title: "Cart", link: "/cart" });
    links.push({ title: "Profile", link: "/profile" });
  }

  const navigate=useNavigate();
  const dispatch=useDispatch();
  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  // const submit=async()=>{
  //   try{
  //     if
  //   }
  // }

  return (
    <nav className="w-full bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white px-4 sm:px-8 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4" onClick={handleLinkClick}>
          <img
            className="h-10 transform hover:scale-110 transition-transform duration-300"
            src={logo}
            alt="logo"
          />
          <h1 className="text-2xl font-extrabold tracking-wide text-white select-none">
            BookBalcony
          </h1>
        </Link>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-yellow-400 focus:outline-none text-2xl"
          >
            ☰
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex gap-8 text-sm font-semibold">
            {links.map((item, i) => {
              const isActive = currentPath === item.link;
              return (
                <div className="group relative" key={i}>
                  <Link
                    to={item.link}
                    onClick={handleLinkClick}
                    className={`transition-all duration-300 ${
                      isActive ? "text-yellow-400" : "text-white hover:text-yellow-400"
                    }`}
                  >
                    {item.title}
                  </Link>
                  <span
                    className={`absolute left-0 -bottom-1 h-0.5 bg-yellow-400 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </div>
              );
            })}
          </div>

          {/* Auth Buttons */}
          {!isLoggedIn && (
            <div className="flex gap-4">
              <Link
                to="/signin"
                className="px-5 py-1 border-2 border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black shadow-md hover:shadow-yellow-400 transition-all duration-300"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-1 bg-yellow-400 text-black rounded-lg hover:bg-white hover:text-black shadow-md hover:shadow-yellow-400 transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="lg:hidden mt-4 px-4 flex flex-col justify-between items-center gap-4 text-sm font-semibold">
          {links.map((item, i) => (
            <Link
              to={item.link}
              key={i}
              onClick={handleLinkClick}
              className={`transition-all duration-300 ${
                currentPath === item.link ? "text-yellow-400 font-bold" : "text-white hover:text-yellow-400"
              }`}
            >
              {item.title}
            </Link>
          ))}

          {!isLoggedIn && (
            <div className="flex flex-col gap-3 mt-2">
              <Link
                to="/signin"
                onClick={handleLinkClick}
                className="w-full py-2 px-6 border-2 border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black shadow-md hover:shadow-yellow-400 transition-all duration-300"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                onClick={handleLinkClick}
                className="w-full py-2 px-5 bg-yellow-400 text-black rounded-lg hover:bg-white hover:text-black shadow-md hover:shadow-yellow-400 transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
