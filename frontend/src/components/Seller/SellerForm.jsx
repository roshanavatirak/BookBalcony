import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SellerForm = () => {
  const [user, setUser] = useState({});
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [businessType, setBusinessType] = useState("individual"); // 'individual' | 'small' | 'regular'
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Load user & saved data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/v1/get-user-profile", { headers });
        if (data?.user) setUser(data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();

    const saved = JSON.parse(localStorage.getItem("sellerDetails"));
    if (saved) {
      const [f, m = "", l = ""] = saved.fullName?.split(" ") || [];
      setFirstName(f);
      setMiddleName(m);
      setLastName(l);
      setBusinessName(saved.businessName || "");
      setGstNumber(saved.gstNumber || "");
      setBusinessType(saved.businessType || "individual");
    }
  }, []);

  // Save form to localStorage on change
  useEffect(() => {
    const fullName = `${firstName} ${middleName} ${lastName}`.trim();
    const isIndividual = businessType === "individual";
    const isSmall = businessType === "small";

    localStorage.setItem(
      "sellerDetails",
      JSON.stringify({
        fullName,
        businessType,
        isIndividual,
        businessName: isIndividual ? "Individual Seller" : businessName,
        gstNumber: isIndividual || isSmall ? "N/A" : gstNumber,
        email: user?.email,
        phone: user?.phone,
      })
    );
  }, [firstName, middleName, lastName, businessName, gstNumber, businessType, user]);

  const handleNext = (e) => {
    e.preventDefault();

    if (!firstName || !lastName) return alert("Please fill in your full name.");

    if (businessType === "regular" && (!businessName || !gstNumber)) {
      return alert("Please fill in business name and GSTIN.");
    }

    if (businessType === "small" && !businessName) {
      return alert("Please fill in business name.");
    }

    navigate("/seller/bank-details");
  };

  return (
    <div className="bg-zinc-900/60 min-h-screen flex items-center justify-center px-4 py-12 text-white">
      <div className="w-full max-w-2xl bg-zinc-800 rounded-xl p-6 sm:p-8 shadow-lg border border-yellow-500">
        <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-4 text-center">
          Apply to Sell on BookBalcony
        </h2>
        <p className="text-center text-zinc-400 mb-6">Step 1 of 3 — Personal / Business Info</p>

        <form onSubmit={handleNext} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-yellow-300">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-300">Middle Name</label>
              <input
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-300">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white"
                required
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-yellow-300">Email</label>
              <p className="mt-1 px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white">
                {user?.email || "Loading..."}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-300">Phone</label>
              <p className="mt-1 px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white">
                {user?.phone || "Loading..."}
              </p>
            </div>
          </div>

          {/* Business Type Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-yellow-300">Seller Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="individual"
                  checked={businessType === "individual"}
                  onChange={() => setBusinessType("individual")}
                />
                Individual
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="small"
                  checked={businessType === "small"}
                  onChange={() => setBusinessType("small")}
                />
                Small Business (No GST)
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="regular"
                  checked={businessType === "regular"}
                  onChange={() => setBusinessType("regular")}
                />
                Business with GST
              </label>
            </div>
          </div>

          {/* Business Name */}
          {businessType !== "individual" && (
            <div>
              <label className="block text-sm font-medium text-yellow-300">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white"
                placeholder="e.g. BookWorld Distributors"
                required
              />
            </div>
          )}

          {/* GSTIN only for regular */}
          {businessType === "regular" && (
            <div>
              <label className="block text-sm font-medium text-yellow-300">GSTIN Number</label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-md text-white"
                placeholder="e.g. 27ABCDE1234F1Z5"
                required
              />
            </div>
          )}

          {/* Continue Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition duration-300"
          >
            Next: Bank Details →
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerForm;
