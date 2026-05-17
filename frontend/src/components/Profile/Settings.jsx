import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  mail:       "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm16 2l-8 5-8-5",
  phone:      "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l.86-.86a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16.92z",
  location:   "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  plus:       "M12 5v14M5 12h14",
  edit:       "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z",
  trash:      "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  star:       "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z",
  starFilled: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z",
  check:      "M20 6L9 17l-5-5",
  robot:      "M12 2a2 2 0 0 1 2 2v1h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1v1a7 7 0 0 1-14 0v-1H1a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h3V4a2 2 0 0 1 2-2h6zM9 9a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-3 4h.01",
  save:       "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8",
  x:          "M18 6L6 18M6 6l12 12",
  chevRight:  "M9 18l6-6-6-6",
};

const SvgIcon = ({ name, size = 20, stroke = 1.8, className = "" }) => (
  <Icon d={Icons[name]} size={size} stroke={stroke} className={className} />
);

/* ─── Spinner ─── */
const Spinner = () => (
 <div className="md:bg-zinc-900/50 md:rounded-3xl min-h-screen px-1 sm:px-4 md:px-8 py-4 md:py-10 md:shadow-xl md:border md:border-zinc-700">
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-yellow-400/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-yellow-400 animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-yellow-600/60 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.7s' }} />
      </div>
      <p className="text-zinc-500 text-sm tracking-widest uppercase font-light">Loading</p>
    </div>
  </div>
);

/* ─── Section Header ─── */
const SectionHeader = ({ icon, title, action }) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
        <SvgIcon name={icon} size={16} stroke={2} />
      </div>
      <h2 className="text-base font-semibold text-white tracking-tight">{title}</h2>
    </div>
    {action}
  </div>
);

/* ─── Profile Field ─── */
const ProfileField = ({ icon, label, value }) => (
  <motion.div
    whileTap={{ scale: 0.98 }}
    className="flex items-center gap-3.5 py-3.5 border-b border-zinc-800/70 last:border-0"
  >
    <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center text-zinc-400 flex-shrink-0">
      <SvgIcon name={icon} size={16} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium mb-0.5">{label}</p>
      <p className="text-white text-sm font-medium truncate">{value || "—"}</p>
    </div>
    <SvgIcon name="chevRight" size={14} className="text-zinc-700 flex-shrink-0" />
  </motion.div>
);

/* ─── Address Card ─── */
const AddressCard = ({ addr, index, onEdit, onDelete, onSetPrimary, showDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16, scale: 0.96 }}
    transition={{ type: "spring", stiffness: 400, damping: 30 }}
    className={`relative overflow-hidden rounded-2xl border ${
      addr.isPrimary
        ? "border-yellow-400/60 bg-gradient-to-br from-yellow-400/8 to-zinc-900"
        : "border-zinc-800 bg-zinc-900/60"
    }`}
  >
    {addr.isPrimary && (
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500" />
    )}

    <div className="p-4">
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {addr.isPrimary ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 text-[10px] font-bold uppercase tracking-widest">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
              Primary
            </span>
          ) : (
            <span className="text-zinc-500 text-xs">Address {index + 1}</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          {!addr.isPrimary && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onSetPrimary(index)}
              className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-yellow-400 hover:border-yellow-400/40 transition-colors"
              title="Set as primary"
            >
              <SvgIcon name="star" size={14} />
            </motion.button>
          )}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(index)}
            className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-blue-400 hover:border-blue-400/40 transition-colors"
            title="Edit"
          >
            <SvgIcon name="edit" size={14} />
          </motion.button>
          {showDelete && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(index)}
              className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-red-400 hover:border-red-400/40 transition-colors"
              title="Delete"
            >
              <SvgIcon name="trash" size={14} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Address info */}
      <div className="space-y-1">
        <p className="text-white font-semibold text-sm">{addr.fullName}</p>
        <p className="text-zinc-400 text-xs leading-relaxed">
          {addr.addressLine1}
          {addr.addressLine2 && <span className="text-zinc-500">, {addr.addressLine2}</span>}
        </p>
        <p className="text-zinc-400 text-xs">{addr.locality}, {addr.city}</p>
        <div className="flex items-center justify-between pt-1">
          <p className="text-zinc-500 text-xs">{addr.state} · <span className="font-mono text-zinc-400">{addr.postalCode}</span></p>
          <p className="text-zinc-500 text-xs font-mono">{addr.phone}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

/* ─── Form Field ─── */
const FormField = ({ label, required, children }) => (
  <div>
    <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-medium mb-2">
      {label}{required && <span className="text-yellow-400 ml-1">*</span>}
    </label>
    {children}
  </div>
);

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700/70 text-white text-sm placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all";

/* ─── Address Form ─── */
const AddressForm = ({ address, onChange, onSave, onCancel, loading, title }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="fixed inset-0 z-50 flex flex-col bg-zinc-950"
  >
    {/* Form header */}
    <div className="flex items-center justify-between px-5 pt-safe-top pt-12 pb-4 border-b border-zinc-800">
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={onCancel}
        className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400"
      >
        <SvgIcon name="x" size={16} />
      </motion.button>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={onSave}
        disabled={loading}
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-sm font-bold disabled:opacity-40 transition-all"
      >
        {loading ? "..." : "Save"}
      </motion.button>
    </div>

    {/* Scrollable form */}
    <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
      <FormField label="Full Name" required>
        <input name="fullName" value={address.fullName || ""} onChange={onChange}
          placeholder="Enter full name" className={inputClass} />
      </FormField>

      <FormField label="Phone" required>
        <input name="phone" value={address.phone || ""} onChange={onChange}
          placeholder="10-digit mobile number" maxLength={10} inputMode="numeric" className={inputClass} />
      </FormField>

      <FormField label="Address Line 1" required>
        <input name="addressLine1" value={address.addressLine1 || ""} onChange={onChange}
          placeholder="House / Flat No., Street Name" className={inputClass} />
      </FormField>

      <FormField label="Landmark (optional)">
        <input name="addressLine2" value={address.addressLine2 || ""} onChange={onChange}
          placeholder="Near..." className={inputClass} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Locality" required>
          <input name="locality" value={address.locality || ""} onChange={onChange}
            placeholder="Area / Colony" className={inputClass} />
        </FormField>
        <FormField label="City" required>
          <input name="city" value={address.city || ""} onChange={onChange}
            placeholder="City" className={inputClass} />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="State" required>
          <input name="state" value={address.state || ""} onChange={onChange}
            placeholder="State" className={inputClass} />
        </FormField>
        <FormField label="PIN Code" required>
          <input name="postalCode" value={address.postalCode || ""} onChange={onChange}
            placeholder="6-digit" maxLength={6} inputMode="numeric" className={inputClass} />
        </FormField>
      </div>
    </div>
  </motion.div>
);

/* ═══════════════════════════════
   Main Settings Component
═══════════════════════════════ */
const Settings = () => {
  const [profileData, setProfileData] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_URL;
  const API_URL = `${BASE_URL}/api/v1`;

  useEffect(() => { fetchUserData(); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

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
        setAddresses(data.data.addresses || []);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      showToast("Failed to load user data", "error");
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const startEdit = (index) => {
    setEditingIndex(index);
    setFormData({ ...addresses[index] });
    setIsAddingNew(false);
  };

  const startAddNew = () => {
    if (addresses.length >= 3) { showToast("Max 3 addresses allowed", "error"); return; }
    setIsAddingNew(true);
    setEditingIndex(null);
    setFormData({
      fullName: profileData?.username || "",
      phone: profileData?.phone || "",
      addressLine1: "", addressLine2: "",
      locality: "", city: "", state: "", postalCode: ""
    });
  };

  const cancelEdit = () => { setEditingIndex(null); setIsAddingNew(false); setFormData({}); };

  const validateForm = () => {
    const required = ['fullName', 'phone', 'addressLine1', 'locality', 'city', 'state', 'postalCode'];
    for (let field of required) {
      if (!formData[field]?.trim()) {
        showToast(`Please fill: ${field.replace(/([A-Z])/g, ' $1')}`, "error");
        return false;
      }
    }
    if (formData.phone.length !== 10) { showToast("Phone must be 10 digits", "error"); return false; }
    if (formData.postalCode.length !== 6) { showToast("PIN must be 6 digits", "error"); return false; }
    return true;
  };

  const saveAddress = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      let updatedAddresses;
      if (isAddingNew) {
        updatedAddresses = [...addresses, { ...formData, country: "India", isPrimary: addresses.length === 0 }];
      } else {
        updatedAddresses = addresses.map((addr, idx) =>
          idx === editingIndex ? { ...formData, isPrimary: addr.isPrimary } : addr
        );
      }
      const response = await fetch(`${API_URL}/update-addresses`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", id, authorization: `Bearer ${token}` },
        body: JSON.stringify({ addresses: updatedAddresses })
      });
      const data = await response.json();
      if (data.success) {
        setAddresses(updatedAddresses);
        cancelEdit();
        showToast("Address saved");
      } else { showToast(data.message || "Failed to save", "error"); }
    } catch (err) {
      showToast("Failed to save address", "error");
    } finally { setLoading(false); }
  };

  const deleteAddress = async (index) => {
    if (addresses.length === 1) { showToast("Keep at least one address", "error"); return; }
    if (!window.confirm("Delete this address?")) return;
    try {
      setLoading(true);
      const updatedAddresses = addresses.filter((_, idx) => idx !== index);
      if (addresses[index].isPrimary && updatedAddresses.length > 0) updatedAddresses[0].isPrimary = true;
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/update-addresses`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", id, authorization: `Bearer ${token}` },
        body: JSON.stringify({ addresses: updatedAddresses })
      });
      const data = await response.json();
      if (data.success) { setAddresses(updatedAddresses); showToast("Address deleted"); }
    } catch (err) { showToast("Failed to delete", "error"); }
    finally { setLoading(false); }
  };

  const setPrimary = async (index) => {
    try {
      setLoading(true);
      const updatedAddresses = addresses.map((addr, idx) => ({ ...addr, isPrimary: idx === index }));
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/update-addresses`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", id, authorization: `Bearer ${token}` },
        body: JSON.stringify({ addresses: updatedAddresses })
      });
      const data = await response.json();
      if (data.success) { setAddresses(updatedAddresses); showToast("Primary address updated"); }
    } catch (err) { showToast("Failed to update", "error"); }
    finally { setLoading(false); }
  };

  if (!profileData) return <Spinner />;

  const showForm = isAddingNew || editingIndex !== null;

  return (
    <div className="md:bg-zinc-900/50 md:rounded-3xl min-h-screen px-1 sm:px-4 md:px-8 py-4 md:py-10 md:shadow-xl md:border md:border-zinc-700">
      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            className={`fixed top-14 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-medium shadow-2xl ${
              toast.type === "error"
                ? "bg-red-950 border border-red-800/60 text-red-300"
                : "bg-zinc-800 border border-zinc-700 text-white"
            }`}
          >
            {toast.type === "error"
              ? <SvgIcon name="x" size={14} className="text-red-400" />
              : <SvgIcon name="check" size={14} className="text-yellow-400" />
            }
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Full-screen form overlay ── */}
      <AnimatePresence>
        {showForm && (
          <AddressForm
            address={formData}
            onChange={handleChange}
            onSave={saveAddress}
            onCancel={cancelEdit}
            loading={loading}
            title={isAddingNew ? "New Address" : "Edit Address"}
          />
        )}
      </AnimatePresence>

      {/* ── Main page ── */}
      <div className="px-4 pb-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-14 pb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-400/20">
              <SvgIcon name="settings" size={20} className="text-black" stroke={2} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-zinc-500 text-xs mt-0.5">Profile &amp; addresses</p>
            </div>
          </div>
        </motion.div>

        {/* ── Profile Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 mb-4"
        >
          <SectionHeader icon="user" title="Profile" />

          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-400/20 flex items-center justify-center mb-3">
              <span className="text-3xl font-bold text-yellow-400">
                {profileData.username?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <p className="text-white font-semibold text-base">{profileData.username}</p>
            <p className="text-zinc-500 text-xs mt-0.5">{profileData.email}</p>
          </div>

          <div className="divide-y divide-zinc-800/60">
            {/* <ProfileField icon="user" label="Username" value={profileData.username} />
            <ProfileField icon="mail" label="Email" value={profileData.email} /> */}
            <ProfileField icon="phone" label="Phone" value={profileData.phone} />
          </div>
        </motion.div>

        {/* ── Preferences Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 mb-4"
        >
          <SectionHeader icon="settings" title="Preferences" />

          <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-zinc-800/40 border border-zinc-700/30 opacity-50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
              <SvgIcon name="robot" size={18} className="text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-white text-sm font-medium">AI Assistant</p>
               <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 text-[10px] font-bold uppercase tracking-widest"
  style={{ animation: "badgeGlow 3.5s linear infinite" }}
>
 
  Coming soon
</span>
              </div>
              <p className="text-zinc-600 text-xs">Under development</p>
            </div>
            {/* disabled toggle */}
            <div className="relative flex-shrink-0 pointer-events-none">
              <div className="w-12 h-6 rounded-full bg-zinc-800 border border-zinc-700" />
              <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-zinc-600" />
            </div>
          </div>
        </motion.div>

        {/* ── Addresses Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4"
        >
          <SectionHeader
            icon="location"
            title="Delivery Addresses"
            action={
              addresses.length < 3 ? (
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={startAddNew}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-yellow-400 text-black text-xs font-bold shadow-lg shadow-yellow-400/20 transition-all"
                >
                  <SvgIcon name="plus" size={14} stroke={2.5} />
                  Add
                </motion.button>
              ) : null
            }
          />

          <p className="text-zinc-600 text-xs mb-4 -mt-2">
            Up to 3 addresses · one set as primary for checkout
          </p>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {addresses.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-3 py-10 text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500">
                    <SvgIcon name="location" size={24} />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-sm font-medium">No addresses yet</p>
                    <p className="text-zinc-600 text-xs mt-1">Add one to enable checkout</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={startAddNew}
                    className="mt-1 px-5 py-2.5 rounded-xl bg-yellow-400 text-black text-sm font-bold"
                  >
                    Add address
                  </motion.button>
                </motion.div>
              ) : (
                addresses.map((addr, index) => (
                  <AddressCard
                    key={index}
                    addr={addr}
                    index={index}
                    onEdit={startEdit}
                    onDelete={deleteAddress}
                    onSetPrimary={setPrimary}
                    showDelete={addresses.length > 1}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;