import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  FaStore, FaClipboardList, FaPlusCircle, FaTruck, FaWallet, FaHome, FaBoxOpen, FaShoppingCart
} from 'react-icons/fa';
import {
  FiBriefcase, FiList, FiPlusCircle, FiTruck, FiCreditCard, FiHome, FiPackage, FiShoppingCart
} from 'react-icons/fi';

function SellerMobileBottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Bottom nav state
  const [ripple, setRipple] = useState({ key: null, x: 0, y: 0 });

  // ── Seller Nav items ──
  const navItems = [
    { title: 'Dashboard',   link: '/seller/dashboard',       icon: <FiHome />,            activeIcon: <FaHome /> },
    { title: 'Products',    link: '/seller/myproducts',      icon: <FiPackage />,         activeIcon: <FaBoxOpen /> },
    { title: 'Add',         link: '/seller/add-product',     icon: <FiPlusCircle />,      activeIcon: <FaPlusCircle /> },
    { title: 'Orders',      link: '/seller/orders',          icon: <FiShoppingCart />,    activeIcon: <FaShoppingCart /> },
    { title: 'Wallet',      link: '/seller/mywallet',        icon: <FiCreditCard />,      activeIcon: <FaWallet /> },
  ];

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
        .snav-tab-active { animation: tabPop 0.25s ease forwards; }
        .snav-tab-label  { animation: labelSlide 0.15s ease forwards; }
        .snav-dot        { animation: glowPulse 2.5s ease-in-out infinite; }
        .snav-ripple     { animation: navRipple 0.5s ease-out forwards; }

        .snav-bar {
          background: linear-gradient(135deg,
            rgba(15,23,42,0.97) 0%,
            rgba(17,24,39,0.98) 50%,
            rgba(15,23,42,0.97) 100%);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-top: 1px solid rgba(250,204,21,0.1);
          box-shadow: 0 -2px 12px rgba(0,0,0,0.4);
        }
        .snav-glow::before {
          content: '';
          position: absolute; inset: 0;
          border-radius: 14px;
          background: radial-gradient(ellipse at 50% 80%, rgba(250,204,21,0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        @media (max-width: 1023px) {
          body { padding-bottom: 72px; }
        }
      `}</style>

      {/* ════════════════════════════════════════════════
          BOTTOM NAVIGATION BAR
      ════════════════════════════════════════════════ */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] snav-bar"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />

        <div className="flex items-center justify-around px-1 py-2">
          {navItems.map((item) => {
            /* ── Regular nav tab ── */
            const isActive = currentPath === item.link ||
              (item.link !== '/' && currentPath.startsWith(item.link));

            return (
              <Link
                key={item.link}
                to={item.link}
                onClick={(e) => {
                  handleRipple(e, item.link);
                }}
                className={`
                  relative flex flex-col items-center justify-center
                  min-w-[50px] px-2 py-2 rounded-2xl
                  transition-colors duration-200 select-none overflow-hidden
                  ${isActive
                    ? 'snav-tab-active snav-glow text-yellow-400'
                    : 'text-gray-400 active:text-yellow-300'
                  }
                `}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {ripple.key === item.link && (
                  <span
                    className="snav-ripple absolute rounded-full bg-yellow-400/25 pointer-events-none"
                    style={{ width: 40, height: 40, left: ripple.x - 20, top: ripple.y - 20 }}
                  />
                )}

                {isActive && (
                  <span className="absolute inset-0 rounded-2xl"
                    style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(250,204,21,0.15) 0%, transparent 70%)' }}
                  />
                )}

                <span
                  className={`relative z-10 flex items-center justify-center transition-colors duration-200 ${isActive ? 'text-[20px]' : 'text-[18px]'}`}
                  style={isActive ? { textShadow: '0 0 6px rgba(250,204,21,0.5)' } : {}}
                >
                  {isActive ? item.activeIcon : item.icon}
                </span>

                {isActive && (
                  <span className="snav-dot absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-yellow-400"
                    style={{ boxShadow: '0 0 4px 1px rgba(250,204,21,0.4)' }}
                  />
                )}

                <span className={`relative z-10 mt-0.5 font-medium tracking-wide text-[9px] transition-colors duration-200 ${isActive ? 'snav-tab-label text-yellow-400' : 'text-gray-500'}`}>
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export default SellerMobileBottomNav;
