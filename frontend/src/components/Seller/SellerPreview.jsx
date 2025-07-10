import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SellerPreview = () => {
  const [sellerData, setSellerData] = useState(null);
  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("sellerDetails"));
    if (!data) {
      alert("Incomplete form data. Redirecting to start.");
      return navigate("/seller/apply");
    }
    setSellerData(data);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSellerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setSellerData((prev) => ({
      ...prev,
      pickupAddress: {
        ...prev.pickupAddress,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async () => {
  const {
    fullName,
    email,
    phone,
    businessName,
    gstNumber,
    accountNumber,
    ifsc,
    accountHolder,
    pickupAddress,
    isIndividual
  } = sellerData;

  const payload = {
    fullName,
    email,
    phone,
    sellerType: isIndividual ? "Individual" : (gstNumber ? "Business" : "Small Business"),
    businessName: isIndividual ? undefined : businessName,
    gstNumber: isIndividual ? undefined : gstNumber,
    bankAccountNumber: accountNumber,
    bankIFSC: ifsc,
    bankHolderName: accountHolder,
    pickupAddress,
  };

  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/become-seller",
      payload,
      { headers }
    );
    alert(response.data.message || "Seller registered successfully!");
    localStorage.removeItem("sellerDetails");
    navigate("/");
  } catch (err) {
    console.error(err);
    alert("Failed to register seller. Check all fields are valid.");
  }
};

  if (!sellerData) return null;

  return (
    <div className="bg-zinc-900/60 min-h-screen flex items-center justify-center px-4 py-12 text-white">
      <div className="w-full max-w-3xl bg-zinc-800 rounded-xl p-6 sm:p-8 shadow-lg border border-yellow-500">
        <h2 className="text-3xl font-bold text-yellow-400 mb-4 text-center">
          Preview Your Seller Information
        </h2>
        <p className="text-center text-zinc-400 mb-8">Step 4 of 4 — Final Review & Submit</p>

        <form className="space-y-8">
          {/* Section: Personal / Business Info */}
          <section>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold text-yellow-300">Personal / Business Info</h3>
              <button
                type="button"
                onClick={() => navigate("/seller/apply")}
                className="text-sm text-yellow-400 underline hover:text-yellow-300"
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="fullName"
                value={sellerData.fullName}
                onChange={handleInputChange}
                className="px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
              />
              <input
                name="email"
                value={sellerData.email}
                onChange={handleInputChange}
                readOnly
                className="px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white cursor-not-allowed"
              />
              <input
                name="phone"
                value={sellerData.phone}
                onChange={handleInputChange}
                readOnly
                className="px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white cursor-not-allowed"
              />
              <input
                name="businessName"
                value={sellerData.businessName}
                onChange={handleInputChange}
                className="px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
              />
              {!sellerData.isIndividual && (
                <input
                  name="gstNumber"
                  value={sellerData.gstNumber || ""}
                  onChange={handleInputChange}
                  placeholder="GST Number"
                  className="px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
                />
              )}
            </div>
          </section>

          {/* Section: Bank Details */}
          <section>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold text-yellow-300">Bank Details</h3>
              <button
                type="button"
                onClick={() => navigate("/seller/bank-details")}
                className="text-sm text-yellow-400 underline hover:text-yellow-300"
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="accountHolder"
                value={sellerData.accountHolder}
                onChange={handleInputChange}
                className="px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
              />
              <input
                name="accountNumber"
                value={sellerData.accountNumber}
                onChange={handleInputChange}
                className="px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
              />
              <input
                name="ifsc"
                value={sellerData.ifsc}
                onChange={handleInputChange}
                className="px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
              />
            </div>
          </section>

          {/* Section: Pickup Address */}
          <section>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold text-yellow-300">Pickup Address</h3>
              <button
                type="button"
                onClick={() => navigate("/seller/pickup-address")}
                className="text-sm text-yellow-400 underline hover:text-yellow-300"
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="street"
                value={sellerData.pickupAddress?.street || ""}
                onChange={handleAddressChange}
                placeholder="Street"
                className="px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
              />
              <input
                name="village"
                value={sellerData.pickupAddress?.village || ""}
                onChange={handleAddressChange}
                placeholder="Village/Town"
                className="px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
              />
              <input
                name="city"
                value={sellerData.pickupAddress?.city || ""}
                onChange={handleAddressChange}
                placeholder="City"
                className="px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
              />
              <input
                name="state"
                value={sellerData.pickupAddress?.state || ""}
                onChange={handleAddressChange}
                placeholder="State"
                className="px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
              />
              <input
                name="pincode"
                value={sellerData.pickupAddress?.pincode || ""}
                onChange={handleAddressChange}
                placeholder="Pincode"
                className="px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
              />
              <input
                name="country"
                value={sellerData.pickupAddress?.country || ""}
                onChange={handleAddressChange}
                placeholder="Country"
                className="px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
              />
            </div>
          </section>

          {/* Final Submit Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition duration-300"
            >
              Submit & Become Seller
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerPreview;
