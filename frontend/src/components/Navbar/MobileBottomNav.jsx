import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

import {
  FaHome, FaBook, FaBriefcase, FaShoppingCart,
  FaUser, FaSearch, FaTimes, FaArrowRight, FaStar,
} from 'react-icons/fa';
import {
  FiHome, FiBookOpen, FiBriefcase, FiShoppingCart, FiSearch,
} from 'react-icons/fi';

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

// ── Animated placeholder with smooth crossfade ──
const PLACEHOLDERS = [
  'Search books...',
  '"Harry Potter"',
  '"Engineering"',
  'Search services...',
  '"UPSC Prep"',
  '"Rich Dad Poor Dad"',
  'Search by author...',
  '"Atomic Habits"',
];

function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // Bottom nav state
  const [ripple, setRipple] = useState({ key: null, x: 0, y: 0 });

  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [phIdx, setPhIdx] = useState(0);
  const [phFading, setPhFading] = useState(false);
  const searchInputRef = useRef(null);

  // ── Nav items ──
  const navItems = isLoggedIn
    ? [
        { title: 'Home',      link: '/',          icon: <FiHome />,         activeIcon: <FaHome /> },
        { title: 'All Books', link: '/all-books',  icon: <FiBookOpen />,     activeIcon: <FaBook /> },
        { id: 'search',       isSearch: true },
        { title: 'Services',  link: '/services',   icon: <FiBriefcase />,    activeIcon: <FaBriefcase /> },
        { title: 'Cart',      link: '/cart',        icon: <FiShoppingCart />, activeIcon: <FaShoppingCart /> },
      ]
    : [
        { title: 'Home',      link: '/',          icon: <FiHome />,      activeIcon: <FaHome /> },
        { title: 'All Books', link: '/all-books',  icon: <FiBookOpen />,  activeIcon: <FaBook /> },
        { id: 'search',       isSearch: true },
        { title: 'Services',  link: '/services',   icon: <FiBriefcase />, activeIcon: <FaBriefcase /> },
      ];

  // ── Smooth placeholder cycling with crossfade ──
  useEffect(() => {
    const interval = setInterval(() => {
      setPhFading(true);
      setTimeout(() => {
        setPhIdx((prev) => (prev + 1) % PLACEHOLDERS.length);
        setPhFading(false);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ── Fetch books for search ──
  useEffect(() => {
    axios.get(`${API_URL}/get-all-books`)
      .then(res => setAllBooks(res.data.data || []))
      .catch(() => {});
  }, []);

  // ── Filter results ──
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const q = searchQuery.toLowerCase();
    setSearchResults(
      allBooks.filter(b =>
        b.title?.toLowerCase().includes(q) ||
        b.author?.toLowerCase().includes(q) ||
        b.category?.toLowerCase().includes(q)
      ).slice(0, 8)
    );
  }, [searchQuery, allBooks]);

  const openSearch = useCallback(() => {
    setSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 150);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  const selectResult = useCallback((id) => {
    closeSearch();
    navigate(`/view-book-details/${id}`);
  }, [navigate, closeSearch]);

  const handleRipple = (e, key) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({ key, x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setRipple({ key: null, x: 0, y: 0 }), 500);
  };

  return (
    <>
      {/* ── Scoped CSS ── */}
      <style>{`
        @keyframes navRipple {
          0%   { transform: scale(0); opacity: 0.4; }
          100% { transform: scale(3); opacity: 0; }
        }
        @keyframes tabPop {
          0%   { transform: translateY(0) scale(1); }
          50%  { transform: translateY(-3px) scale(1.08); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 4px 1px rgba(250,204,21,0.3); }
          50%       { box-shadow: 0 0 6px 2px rgba(250,204,21,0.45); }
        }
        @keyframes labelSlide {
          0%   { opacity: 0; transform: translateY(2px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes searchPulseRing {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        .mnav-tab-active { animation: tabPop 0.25s ease forwards; }
        .mnav-tab-label  { animation: labelSlide 0.15s ease forwards; }
        .mnav-dot        { animation: glowPulse 2.5s ease-in-out infinite; }
        .mnav-ripple     { animation: navRipple 0.5s ease-out forwards; }

        .mnav-bar {
          background: linear-gradient(135deg,
            rgba(15,23,42,0.97) 0%,
            rgba(17,24,39,0.98) 50%,
            rgba(15,23,42,0.97) 100%);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-top: 1px solid rgba(250,204,21,0.1);
          box-shadow: 0 -2px 12px rgba(0,0,0,0.4);
        }
        .mnav-glow::before {
          content: '';
          position: absolute; inset: 0;
          border-radius: 14px;
          background: radial-gradient(ellipse at 50% 80%, rgba(250,204,21,0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Search placeholder crossfade */
        .search-ph-fade { transition: opacity 0.3s ease, transform 0.3s ease; }
        .search-ph-out  { opacity: 0; transform: translateY(-6px); }
        .search-ph-in   { opacity: 1; transform: translateY(0); }

        /* Search overlay slide */
        @keyframes searchSlideUp {
          0%   { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .search-overlay-enter { animation: searchSlideUp 0.25s ease forwards; }

        @media (max-width: 1023px) {
          body { padding-bottom: 72px; }
        }
      `}</style>

      {/* ════════════════════════════════════════════════
          SEARCH OVERLAY — Premium Fullscreen
      ════════════════════════════════════════════════ */}
      {searchOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] flex flex-col search-overlay-enter"
          style={{ background: 'linear-gradient(to bottom, rgba(9,9,11,0.99), rgba(15,15,20,0.99))' }}
        >
          {/* Top bar with gradient border */}
          <div className="px-4 pt-5 pb-3">
            <div className="relative flex items-center gap-2">
              {/* Premium search input */}
              <div className="flex-1 relative group">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/20 via-amber-400/10 to-yellow-400/20 blur-sm opacity-60 group-focus-within:opacity-100 transition-opacity" />
                <div className="relative flex items-center bg-zinc-900/90 border border-zinc-700/60 rounded-2xl overflow-hidden group-focus-within:border-yellow-400/40 transition-colors">
                  <FiSearch className="ml-4 text-yellow-400/70 text-lg flex-shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent py-3.5 pl-3 pr-4 text-white text-sm focus:outline-none"
                  />
                  {/* Animated placeholder (only visible when input is empty) */}
                  {!searchQuery && (
                    <span
                      className={`absolute left-11 text-sm pointer-events-none select-none search-ph-fade ${phFading ? 'search-ph-out' : 'search-ph-in'}`}
                      style={{ color: 'rgba(161,161,170,0.6)' }}
                    >
                      {PLACEHOLDERS[phIdx]}
                    </span>
                  )}
                </div>
              </div>

              {/* Cancel button */}
              <button
                onClick={closeSearch}
                className="flex-shrink-0 px-3 py-2 text-yellow-400/80 text-sm font-medium hover:text-yellow-300 transition-colors"
              >
                Cancel
              </button>
            </div>

            {/* Quick suggestion chips */}
            {!searchQuery && (
              <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
                {['Engineering', 'Novel', 'UPSC', 'Science', 'Comics'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium
                      bg-zinc-800/70 text-zinc-300 border border-zinc-700/50
                      hover:bg-yellow-400/10 hover:text-yellow-400 hover:border-yellow-400/30
                      transition-all duration-200"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto px-4 pb-6">
            {searchQuery.trim() === '' ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-8">
                <div className="w-16 h-16 rounded-full bg-zinc-800/60 border border-zinc-700/40 flex items-center justify-center mb-4">
                  <FiSearch className="text-2xl text-zinc-600" />
                </div>
                <p className="text-zinc-500 text-sm mb-1">Discover your next read</p>
                <p className="text-zinc-600 text-xs">Search by book name, author, or category</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <p className="text-zinc-500 text-sm">No results for "<span className="text-zinc-300">{searchQuery}</span>"</p>
                <p className="text-zinc-600 text-xs mt-1">Try a different keyword</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[11px] text-zinc-500 mb-2 px-0.5">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                </p>
                {searchResults.map((book) => (
                  <button
                    key={book._id}
                    onClick={() => selectResult(book._id)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl text-left
                      bg-zinc-800/40 border border-zinc-800/60
                      hover:bg-zinc-800/80 hover:border-zinc-700/60
                      active:scale-[0.98] transition-all duration-200"
                  >
                    <img
                      src={book.url}
                      alt={book.title}
                      className="w-12 h-16 rounded-xl object-cover flex-shrink-0 shadow-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{book.title}</p>
                      <p className="text-zinc-400 text-[11px] truncate mt-0.5">
                        {book.author || 'Unknown Author'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-yellow-400 text-xs font-bold">₹{book.price}</span>
                        {book.category && (
                          <span className="text-[9px] bg-yellow-400/10 text-yellow-400/80 px-2 py-0.5 rounded-full border border-yellow-400/20">
                            {book.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <FaArrowRight className="text-zinc-700 text-[10px] flex-shrink-0 mr-1" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════
          BOTTOM NAVIGATION BAR
      ════════════════════════════════════════════════ */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 mnav-bar"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />

        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            /* ── Search button ── */
            if (item.isSearch) {
              return (
                <button
                  key="__search__"
                  onClick={openSearch}
                  className={`
                    relative flex flex-col items-center justify-center
                    min-w-[60px] px-3 py-2 rounded-2xl
                    transition-colors duration-200 select-none
                    ${searchOpen
                      ? 'mnav-tab-active mnav-glow text-yellow-400'
                      : 'text-gray-400 active:text-yellow-300'
                    }
                  `}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <span
                    className={`relative z-10 flex items-center justify-center transition-colors duration-200 ${searchOpen ? 'text-[22px]' : 'text-[20px]'}`}
                    style={searchOpen ? { textShadow: '0 0 6px rgba(250,204,21,0.5)' } : {}}
                  >
                    {searchOpen ? <FaSearch /> : <FiSearch />}
                  </span>
                  <span className={`relative z-10 mt-0.5 font-medium tracking-wide text-[10px] transition-colors duration-200 ${searchOpen ? 'text-yellow-400' : 'text-gray-500'}`}>
                    Search
                  </span>
                </button>
              );
            }

            /* ── Regular nav tab ── */
            const isActive = currentPath === item.link ||
              (item.link !== '/' && currentPath.startsWith(item.link));

            return (
              <Link
                key={item.link}
                to={item.link}
                onClick={(e) => {
                  handleRipple(e, item.link);
                  if (searchOpen) closeSearch();
                }}
                className={`
                  relative flex flex-col items-center justify-center
                  min-w-[60px] px-3 py-2 rounded-2xl
                  transition-colors duration-200 select-none overflow-hidden
                  ${isActive
                    ? 'mnav-tab-active mnav-glow text-yellow-400'
                    : 'text-gray-400 active:text-yellow-300'
                  }
                `}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {ripple.key === item.link && (
                  <span
                    className="mnav-ripple absolute rounded-full bg-yellow-400/25 pointer-events-none"
                    style={{ width: 40, height: 40, left: ripple.x - 20, top: ripple.y - 20 }}
                  />
                )}

                {isActive && (
                  <span className="absolute inset-0 rounded-2xl"
                    style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(250,204,21,0.15) 0%, transparent 70%)' }}
                  />
                )}

                <span
                  className={`relative z-10 flex items-center justify-center transition-colors duration-200 ${isActive ? 'text-[22px]' : 'text-[20px]'}`}
                  style={isActive ? { textShadow: '0 0 6px rgba(250,204,21,0.5)' } : {}}
                >
                  {isActive ? item.activeIcon : item.icon}
                </span>

                {isActive && (
                  <span className="mnav-dot absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-yellow-400"
                    style={{ boxShadow: '0 0 4px 1px rgba(250,204,21,0.4)' }}
                  />
                )}

                <span className={`relative z-10 mt-0.5 font-medium tracking-wide text-[10px] transition-colors duration-200 ${isActive ? 'mnav-tab-label text-yellow-400' : 'text-gray-500'}`}>
                  {item.title}
                </span>
              </Link>
            );
          })}

          {/* Sign In button for logged-out */}
          {!isLoggedIn && (
            <Link
              to="/signin"
              className="flex flex-col items-center justify-center min-w-[60px] px-3 py-2 rounded-2xl text-[10px] font-semibold tracking-wide text-yellow-400 border border-yellow-400/40 bg-yellow-400/5 hover:bg-yellow-400/15 transition-all duration-200"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <FaUser className="text-[18px] mb-0.5" />
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

export default MobileBottomNav;
