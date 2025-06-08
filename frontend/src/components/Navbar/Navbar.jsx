import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { title: "Home", link: "/" },
    { title: "About Us", link: "/about-us" },
    { title: "All Books", link: "/all-books" },
    { title: "Cart", link: "/cart" },
    { title: "Profile", link: "/profile" },
  ];

  const handleLinkClick = () => {
    setMenuOpen(false); // closes the menu
  };

  return (
    <nav className="w-full bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white px-4 sm:px-8 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo & Title */}
        <Link to="/" className="flex items-center gap-4" onClick={handleLinkClick}>
          <img
            className="h-10 transform hover:scale-110 transition-transform duration-300"
            src="./logo.png"
            alt="logo"
          />
          <h1 className="text-2xl font-extrabold tracking-wide text-white select-none">
            BookBalcanoy
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

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex gap-8 text-sm font-semibold">
            {links.map((item, i) => (
              <Link to={item.link}
                key={i}
                className="relative cursor-pointer text-white hover:text-yellow-400 transition-colors duration-300"
              >
                {item.title}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>
          <div className="flex gap-4">
            <Link to="/LogIn" className="px-5 py-1 border-2 border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black shadow-md hover:shadow-yellow-400 transition-all duration-300">
              Log In
            </Link>
            <Link to="/SignUp" className="px-5 py-1 bg-yellow-400 text-black rounded-lg hover:bg-white hover:text-black shadow-md hover:shadow-yellow-400 transition-all duration-300">
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden mt-4 px-4 flex flex-col justify-between items-center gap-4 text-sm font-semibold">
          {links.map((item, i) => (
            <Link
              to={item.link}
              key={i}
              onClick={handleLinkClick}
              className="text-white hover:text-yellow-400 transition-colors duration-300"
            >
              {item.title}
            </Link>
          ))}
          <div className="flex flex-col gap-3 mt-2">
            <Link
              to="/LogIn"
              onClick={handleLinkClick}
              className="w-full py-2 px-6 border-2 border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black shadow-md hover:shadow-yellow-400 transition-all duration-300"
            >
              Log In
            </Link>
            <Link
              to="/SignUp"
              onClick={handleLinkClick}
              className="w-full py-2 px-5 bg-yellow-400 text-black rounded-lg hover:bg-white hover:text-black shadow-md hover:shadow-yellow-400 transition-all duration-300"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
