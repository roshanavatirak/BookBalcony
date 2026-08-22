import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

/* ─── Icon Components ─── */
const Icon = ({ d, size = 20, stroke = 1.8, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
    className={className}>
    <path d={d} />
  </svg>
);

const Icons = {
  settings:   "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6.93-3a7 7 0 0 0-.07-1l1.54-1.2a.4.4 0 0 0 .09-.5l-1.46-2.52a.4.4 0 0 0-.48-.18l-1.82.73a7.1 7.1 0 0 0-1.73-1l-.27-1.93A.4.4 0 0 0 14.25 4h-2.9a.4.4 0 0 0-.4.34l-.27 1.93a7.1 7.1 0 0 0-1.73 1L7.13 6.6a.4.4 0 0 0-.48.18L5.19 9.3a.39.39 0 0 0 .09.5L6.82 11A7.2 7.2 0 0 0 6.75 12a7.2 7.2 0 0 0 .07 1l-1.54 1.2a.4.4 0 0 0-.09.5l1.46 2.52a.4.4 0 0 0 .48.18l1.82-.73a7.1 7.1 0 0 0 1.73 1l.27 1.93a.4.4 0 0 0 .4.34h2.9a.4.4 0 0 0 .4-.34l.27-1.93a7.1 7.1 0 0 0 1.73-1l1.82.73a.4.4 0 0 0 .48-.18l1.46-2.52a.39.39 0 0 0-.09-.5z",
  user:       "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  robot:      "M12 2a2 2 0 0 1 2 2v1h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1v1a7 7 0 0 1-14 0v-1H1a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h3V4a2 2 0 0 1 2-2h6zM9 9a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-3 4h.01",
  shield:     "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  bell:       "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  chevRight:  "M9 18l6-6-6-6",
};

const SvgIcon = ({ name, size = 20, stroke = 1.8, className = "" }) => (
  <Icon d={Icons[name]} size={size} stroke={stroke} className={className} />
);

/* ─── Section Header ─── */
const SectionHeader = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-8 h-8 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
      <SvgIcon name={icon} size={16} stroke={2} />
    </div>
    <div>
      <h2 className="text-sm font-bold text-white tracking-tight">{title}</h2>
      {subtitle && <p className="text-[10px] text-zinc-500">{subtitle}</p>}
    </div>
  </div>
);

const Settings = () => {
  const [profileData, setProfileData] = useState(null);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [orderNotifs, setOrderNotifs] = useState(true);

  const BASE_URL = import.meta.env.VITE_API_URL;
  const API_URL = `${BASE_URL}/api/v1`;

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/get-user-information`, {
        headers: { id, authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setProfileData(data.data);
      }
    } catch (error) {
      console.error("Error fetching user settings data:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-zinc-900/95 via-zinc-850 to-zinc-900/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-zinc-700/50 shadow-xl space-y-4 text-white"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-700/50 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-400/20">
            <SvgIcon name="settings" size={20} className="text-black" stroke={2} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              Account Settings
            </h1>
            <p className="text-zinc-400 text-xs">Manage system preferences and security</p>
          </div>
        </div>
        <Link
          to="/account/profile"
          className="text-xs text-yellow-400 hover:text-yellow-300 font-semibold px-3 py-1.5 rounded-lg bg-yellow-400/10 border border-yellow-400/30 transition-colors flex items-center gap-1"
        >
          <SvgIcon name="user" size={14} /> My Profile →
        </Link>
      </div>

      {/* ── Preferences Section ── */}
      <div className="bg-zinc-800/40 rounded-xl p-4 border border-zinc-700/40 space-y-3">
        <SectionHeader icon="settings" title="System Preferences" subtitle="Customise application features" />

        <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-700/30 opacity-60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
              <SvgIcon name="robot" size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-white text-xs font-semibold">BookBalcony AI Assistant</p>
                <span className="px-2 py-0.5 rounded-full bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 text-[9px] font-bold uppercase tracking-widest">
                  Coming soon
                </span>
              </div>
              <p className="text-zinc-500 text-[10px]">Smart recommendations & assistant</p>
            </div>
          </div>
          <div className="w-10 h-5 rounded-full bg-zinc-800 border border-zinc-700 relative pointer-events-none">
            <div className="w-3.5 h-3.5 rounded-full bg-zinc-600 absolute top-0.5 left-0.5" />
          </div>
        </div>
      </div>

      {/* ── Notifications Section ── */}
      <div className="bg-zinc-800/40 rounded-xl p-4 border border-zinc-700/40 space-y-3">
        <SectionHeader icon="bell" title="Notification Preferences" subtitle="Manage alerts & communication" />

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-700/30">
            <div>
              <p className="text-white text-xs font-semibold">Order Status Updates</p>
              <p className="text-zinc-400 text-[10px]">Receive instant updates about book shipments</p>
            </div>
            <button
              onClick={() => setOrderNotifs(!orderNotifs)}
              className={`w-10 h-5 rounded-full transition-colors relative ${
                orderNotifs ? "bg-yellow-400" : "bg-zinc-800 border border-zinc-700"
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-full transition-transform ${
                orderNotifs ? "bg-black translate-x-5" : "bg-zinc-400 translate-x-0.5"
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-700/30">
            <div>
              <p className="text-white text-xs font-semibold">Promotions & Recommendations</p>
              <p className="text-zinc-400 text-[10px]">Get curated book recommendations and offers</p>
            </div>
            <button
              onClick={() => setEmailNotifs(!emailNotifs)}
              className={`w-10 h-5 rounded-full transition-colors relative ${
                emailNotifs ? "bg-yellow-400" : "bg-zinc-800 border border-zinc-700"
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-full transition-transform ${
                emailNotifs ? "bg-black translate-x-5" : "bg-zinc-400 translate-x-0.5"
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Security Section ── */}
      <div className="bg-zinc-800/40 rounded-xl p-4 border border-zinc-700/40 space-y-3">
        <SectionHeader icon="shield" title="Security & Privacy" subtitle="Manage account authentication & safety" />

        <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-700/30">
          <div>
            <p className="text-white text-xs font-semibold">Account Authentication</p>
            <p className="text-zinc-400 text-[10px]">Logged in as <strong className="text-yellow-400">{profileData?.username || "User"}</strong></p>
          </div>
          <Link
            to="/forgot-password"
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-600/50 rounded-lg text-xs font-semibold transition-colors"
          >
            Reset Password
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;