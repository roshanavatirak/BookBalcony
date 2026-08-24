import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loader from "../Loader/Loader";
import { FiEdit2 } from "react-icons/fi";
import Alert from "../Alert/Alert";
import { useAlert } from "../Alert/useAlert";
import AddressForm from "../Forms/AddressForm";


const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

export default function Step1_Address({ onNext }) {
  const { alert: alertData, hideAlert, success, error, warning } = useAlert();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    locality: "",
    city: "",
    state: "",
    postalCode: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  const fetchUserAddresses = async (selectAddressIdToSet = null) => {
    try {
      setLoading(true);
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      if (!id || !token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/get-user-information`, {
        headers: { id, authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success && data.data.addresses) {
        const fetchedAddresses = data.data.addresses;
        setAddresses(fetchedAddresses);

        if (selectAddressIdToSet) {
          setSelectedAddressId(selectAddressIdToSet);
        } else if (!selectedAddressId && fetchedAddresses.length > 0) {
          const primary = fetchedAddresses.find(a => a.isPrimary) || fetchedAddresses[0];
          setSelectedAddressId(primary._id);
        }
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectAddress = (addressId) => {
    setSelectedAddressId(addressId);
    setIsAddingNew(false);
    setEditingAddressId(null);
  };

  const handleAddNew = () => {
    if (addresses.length >= 3) {
      warning("You can only add up to 3 addresses", "Limit Reached");
      return;
    }
    setEditingAddressId(null);
    setIsAddingNew(true);
    setFormData({
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      locality: "",
      city: "",
      state: "",
      postalCode: ""
    });
  };

  const handleEditAddress = (e, addr) => {
    e.stopPropagation();
    setEditingAddressId(addr._id);
    setFormData({
      fullName: addr.fullName || "",
      phone: addr.phone || "",
      addressLine1: addr.addressLine1 || "",
      addressLine2: addr.addressLine2 || "",
      locality: addr.locality || "",
      city: addr.city || "",
      state: addr.state || "",
      postalCode: addr.postalCode || ""
    });
    setIsAddingNew(true);
  };

  const handleSetPrimary = async (e, addressId) => {
    e.stopPropagation();
    try {
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/set-primary-address`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          id,
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ addressId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        success("Primary address updated", "Success");
        await fetchUserAddresses(addressId);
      } else {
        error(data.message || "Failed to set primary address");
      }
    } catch (err) {
      console.error("Error setting primary address:", err);
      error("Failed to set primary address");
    }
  };

  const validateForm = () => {
    const required = ['fullName', 'phone', 'addressLine1', 'locality', 'city', 'state', 'postalCode'];
    for (let field of required) {
      if (!formData[field]?.trim()) {
        warning(`Please fill: ${field.replace(/([A-Z])/g, ' $1')}`, "Required Field");
        return false;
      }
    }
    if (formData.phone.length !== 10) {
      error("Phone number must be 10 digits", "Invalid Phone");
      return false;
    }
    if (formData.postalCode.length !== 6) {
      error("Postal code must be 6 digits", "Invalid Postal Code");
      return false;
    }
    return true;
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      if (editingAddressId) {
        const response = await fetch(`${API_URL}/edit-address/${editingAddressId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            id,
            authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok && data.success) {
          success("Address updated successfully!");
          const targetId = editingAddressId;
          setIsAddingNew(false);
          setEditingAddressId(null);
          await fetchUserAddresses(targetId);
        } else {
          error(data.message || "Failed to update address");
        }
      } else {
        const response = await fetch(`${API_URL}/add-address`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            id,
            authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok && data.success) {
          success("Address saved & selected successfully!");
          const newId = data.addressId;
          setIsAddingNew(false);
          setEditingAddressId(null);
          await fetchUserAddresses(newId);
        } else {
          error(data.message || "Failed to save address");
        }
      }
    } catch (err) {
      console.error("Error saving address:", err);
      error("Failed to save address");
    }
  };

  const handleProceed = () => {
    if (isAddingNew) {
      warning("Please save your address details first.");
      return;
    }

    const selected = addresses.find(a => a._id === selectedAddressId);
    if (!selected) {
      warning("Please select a delivery address");
      return;
    }

    onNext(selected);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-zinc-400">
        <Loader size="sm" />
        <p className="text-xs mt-2">Loading addresses...</p>
      </div>
    );
  }

  return (
    <div className="w-full text-white text-xs">
      {alertData && (
        <Alert
          type={alertData.type}
          title={alertData.title}
          message={alertData.message}
          duration={alertData.duration}
          position={alertData.position}
          autoClose={alertData.autoClose}
          onClose={hideAlert}
        />
      )}

      {/* Title Header */}
      <div className="text-center mb-2.5">
        <h2 className="text-sm sm:text-base font-bold bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 bg-clip-text text-transparent flex items-center justify-center gap-1.5">
          <span>📍</span> Select Delivery Address
        </h2>
        <p className="text-[11px] text-zinc-400">Choose or edit where your order will be delivered</p>
      </div>

      {/* Address Selection Cards */}
      {!isAddingNew && (
        <div className="space-y-2 mb-3">
          {addresses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {addresses.map((addr) => {
                const isSelected = selectedAddressId === addr._id;
                return (
                  <motion.div
                    key={addr._id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => handleSelectAddress(addr._id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? "bg-yellow-400/10 border-yellow-400 text-white shadow-[0_0_10px_rgba(234,179,8,0.15)]"
                        : "bg-zinc-800/60 border-zinc-700/70 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-1.5 min-w-0 pr-2">
                        <input
                          type="radio"
                          name="address"
                          checked={isSelected}
                          onChange={() => handleSelectAddress(addr._id)}
                          className="accent-yellow-400 w-3 h-3 cursor-pointer flex-shrink-0"
                        />
                        <span className="font-bold text-xs text-yellow-300 truncate">{addr.fullName}</span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {/* ✏️ Pencil Edit Button */}
                        <button
                          type="button"
                          onClick={(e) => handleEditAddress(e, addr)}
                          title="Edit Address"
                          className="p-1 rounded-md bg-zinc-700/80 hover:bg-yellow-400 text-zinc-300 hover:text-black transition-colors"
                        >
                          <FiEdit2 className="w-3 h-3" />
                        </button>
                        {addr.isPrimary ? (
                          <span className="text-[9px] bg-yellow-400/20 text-yellow-300 px-1.5 py-0.5 rounded font-semibold border border-yellow-400/30">
                            Primary
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => handleSetPrimary(e, addr._id)}
                            className="text-[9px] bg-zinc-700/80 hover:bg-yellow-400/20 text-zinc-300 hover:text-yellow-300 px-1.5 py-0.5 rounded font-medium transition-colors"
                          >
                            Set Primary
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-1 text-[11px] text-zinc-300 leading-snug pl-4">
                      <p className="truncate">{addr.addressLine1}{addr.addressLine2 && `, ${addr.addressLine2}`}</p>
                      <p>{addr.locality}, {addr.city}, {addr.state} - {addr.postalCode}</p>
                      <p className="text-zinc-400 mt-0.5">📞 {addr.phone}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-zinc-400 text-xs py-2">No saved addresses found. Please add a new address below.</p>
          )}

          {/* Add New Address Trigger Button */}
          {addresses.length < 3 && (
            <button
              onClick={handleAddNew}
              className="w-full py-2 border border-dashed border-yellow-400/50 hover:border-yellow-400 bg-yellow-400/5 hover:bg-yellow-400/10 text-yellow-400 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
            >
              <span>+ Add New Address</span>
              <span className="text-[10px] text-zinc-400">({addresses.length}/3)</span>
            </button>
          )}
        </div>
      )}

      {/* Add / Edit Address Form */}
      {isAddingNew && (
        <motion.form
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSaveAddress}
          className="bg-zinc-800/80 border border-zinc-700/80 rounded-xl p-3 mb-3 space-y-2"
        >
          <div className="flex items-center justify-between border-b border-zinc-700/50 pb-1.5 mb-1.5">
            <h3 className="font-semibold text-xs text-yellow-300 flex items-center gap-1">
              <span>{editingAddressId ? "✏️ Edit Address" : "🏠 Add New Address"}</span>
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsAddingNew(false);
                setEditingAddressId(null);
              }}
              className="text-[10px] text-zinc-400 hover:text-white bg-zinc-700 px-2 py-0.5 rounded"
            >
              ✕ Cancel
            </button>
          </div>

          <AddressForm formData={formData} onChange={handleChange} inputSize="sm" className="my-2" />

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-1.5 rounded-lg text-xs transition-colors shadow"
            >
              {editingAddressId ? "💾 Update & Select Address" : "💾 Save & Select Address"}
            </button>
          </div>
        </motion.form>
      )}

      {/* Deliver Here Action Button */}
      {!isAddingNew && (
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleProceed}
          disabled={!selectedAddressId}
          className={`w-full font-bold py-2 px-4 rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 ${
            selectedAddressId
              ? "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black shadow-yellow-500/20"
              : "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
          }`}
        >
          <span>Deliver to Selected Address</span>
          <span>→</span>
        </motion.button>
      )}
    </div>
  );
}