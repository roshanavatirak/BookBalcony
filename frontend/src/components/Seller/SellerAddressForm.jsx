import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SellerAddressForm = () => {
  const [addressData, setAddressData] = useState({
    street: "",
    village: "",
    city: "",
    state: "",
    pincode: "",
    country: "India"
  });

  const navigate = useNavigate();

  // Load saved address data
  useEffect(() => {
    const sellerInfo = JSON.parse(localStorage.getItem("sellerDetails"));

    if (sellerInfo && sellerInfo.pickupAddress) {
      setAddressData((prev) => ({
        ...prev,
        ...sellerInfo.pickupAddress,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    const sellerDetails = JSON.parse(localStorage.getItem("sellerDetails")) || {};
    sellerDetails.pickupAddress = addressData;
    localStorage.setItem("sellerDetails", JSON.stringify(sellerDetails));

    navigate("/seller/form-preview");
  };

  return (
    <div className="bg-zinc-900/60 min-h-screen flex items-center justify-center px-4 py-12 text-white">
      <div className="w-full max-w-2xl bg-zinc-800 rounded-xl p-6 sm:p-8 shadow-lg border border-yellow-500">
        <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-4 text-center">
          Pickup Address Details
        </h2>
        <p className="text-center text-zinc-400 mb-6">
          Step 3 of 4 — Enter pickup location for shipping.
        </p>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-yellow-300">
              Street / Building / Landmark
            </label>
            <input
              type="text"
              name="street"
              value={addressData.street}
              onChange={handleChange}
              placeholder="e.g. 5th Lane, Near Book Tower"
              required
              className="w-full mt-1 px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-300">
              Village / Town (for small business or rural area)
            </label>
            <input
              type="text"
              name="village"
              value={addressData.village}
              onChange={handleChange}
              placeholder="e.g. Shirpur or leave blank"
              className="w-full mt-1 px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-yellow-300">City</label>
              <input
                type="text"
                name="city"
                value={addressData.city}
                onChange={handleChange}
                required
                placeholder="e.g. Amravati"
                className="w-full mt-1 px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-300">State</label>
              <input
                type="text"
                name="state"
                value={addressData.state}
                onChange={handleChange}
                required
                placeholder="e.g. Maharashtra"
                className="w-full mt-1 px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-yellow-300">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={addressData.pincode}
                onChange={handleChange}
                required
                placeholder="e.g. 444601"
                pattern="^\d{6}$"
                title="Enter a valid 6-digit pincode"
                className="w-full mt-1 px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-300">Country</label>
              <input
                type="text"
                name="country"
                value={addressData.country}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition duration-300"
          >
            Save & Continue →
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerAddressForm;
