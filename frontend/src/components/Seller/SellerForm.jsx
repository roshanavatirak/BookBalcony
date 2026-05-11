
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Alert from "../Alert/Alert";
import { useAlert } from "../Alert/useAlert";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

const SellerForm = () => {
  const [user, setUser] = useState({});
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [businessType, setBusinessType] = useState("individual");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { alert, hideAlert, success, error } = useAlert();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/get-user-profile`, { headers });
        if (data?.user) setUser(data.user);
      } catch (err) {
        console.error("Error fetching user:", err);
        error("Failed to load user profile. Please try again.", "Error Loading Profile");
      } finally {
        setLoading(false);
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

  useEffect(() => {
    if (user.email) {
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
    }
  }, [firstName, middleName, lastName, businessName, gstNumber, businessType, user]);

  const handleNext = (e) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      error("Please fill in your first and last name.", "Required Fields Missing");
      return;
    }

    if (businessType === "regular" && (!businessName.trim() || !gstNumber.trim())) {
      error("Business name and GSTIN are required for registered businesses.", "Required Fields Missing");
      return;
    }

    if (businessType === "small" && !businessName.trim()) {
      error("Please provide your business name.", "Required Field Missing");
      return;
    }

    success("Personal details saved successfully!", "Step 1 Complete");
    setTimeout(() => navigate("/seller/bank-details"), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white px-4 py-8 flex justify-center items-center">
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={hideAlert}
          autoClose={alert.autoClose}
          duration={alert.duration}
          position={alert.position}
        />
      )}

      <div className="w-full max-w-4xl bg-zinc-900/50 rounded-3xl px-6 sm:px-10 py-8 shadow-2xl border border-zinc-700">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-md">
            Become a Seller
          </h1>
          <p className="text-zinc-400 mt-2 text-sm italic">
            Join our marketplace and start selling your books today
          </p>
          <hr className="mt-4 border-zinc-700 w-3/4 mx-auto rounded-full" />
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-yellow-400 font-semibold uppercase tracking-wider">Progress</span>
            <span className="text-xs text-zinc-400 font-medium">Step 1 of 4 — Personal Details</span>
          </div>
          <div className="w-full bg-zinc-700/50 rounded-full h-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2.5 rounded-full transition-all duration-700 ease-out shadow-lg shadow-yellow-400/50" style={{ width: '25%' }}></div>
          </div>
          
          {/* Step Dots */}
          <div className="flex justify-between mt-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-400/50">
                <span className="text-black font-bold">1</span>
              </div>
              <span className="text-xs text-yellow-400 mt-2 font-medium">Personal</span>
            </div>
            <div className="flex-1 h-0.5 bg-zinc-700 self-center mx-2 mt-5"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                <span className="text-zinc-400 font-bold">2</span>
              </div>
              <span className="text-xs text-zinc-500 mt-2 font-medium">Bank</span>
            </div>
            <div className="flex-1 h-0.5 bg-zinc-700 self-center mx-2 mt-5"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                <span className="text-zinc-400 font-bold">3</span>
              </div>
              <span className="text-xs text-zinc-500 mt-2 font-medium">Address</span>
            </div>
            <div className="flex-1 h-0.5 bg-zinc-700 self-center mx-2 mt-5"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                <span className="text-zinc-400 font-bold">4</span>
              </div>
              <span className="text-xs text-zinc-500 mt-2 font-medium">Review</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleNext} className="space-y-5">
          {/* Name Section */}
          <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300">
            <label className="block text-base font-semibold text-yellow-300 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Full Name <span className="text-red-400 ml-1">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="w-full px-4 py-3 bg-zinc-700/80 border border-zinc-600 rounded-xl text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  placeholder="Middle (Optional)"
                  className="w-full px-4 py-3 bg-zinc-700/80 border border-zinc-600 rounded-xl text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="w-full px-4 py-3 bg-zinc-700/80 border border-zinc-600 rounded-xl text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50">
            <label className="block text-base font-semibold text-yellow-300 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Information
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-2">Email Address</label>
                <div className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600 rounded-xl text-zinc-300 cursor-not-allowed flex items-center gap-2">
                  <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  {loading ? "Loading..." : user?.email || "Not available"}
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-2">Phone Number</label>
                <div className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600 rounded-xl text-zinc-300 cursor-not-allowed flex items-center gap-2">
                  <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  {loading ? "Loading..." : user?.phone || "Not available"}
                </div>
              </div>
            </div>
          </div>

          {/* Business Type Section */}
          <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300">
            <label className="block text-base font-semibold text-yellow-300 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Seller Type <span className="text-red-400 ml-1">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                businessType === "individual" 
                  ? "border-yellow-400 bg-yellow-400/10" 
                  : "border-zinc-600 bg-zinc-700/50 hover:border-zinc-500"
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="individual"
                  checked={businessType === "individual"}
                  onChange={() => setBusinessType("individual")}
                  className="w-4 h-4 text-yellow-400"
                />
                <div>
                  <div className="font-semibold text-white">Individual</div>
                  <div className="text-xs text-zinc-400">Personal seller</div>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                businessType === "small" 
                  ? "border-yellow-400 bg-yellow-400/10" 
                  : "border-zinc-600 bg-zinc-700/50 hover:border-zinc-500"
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="small"
                  checked={businessType === "small"}
                  onChange={() => setBusinessType("small")}
                  className="w-4 h-4 text-yellow-400"
                />
                <div>
                  <div className="font-semibold text-white">Small Business</div>
                  <div className="text-xs text-zinc-400">No GST required</div>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                businessType === "regular" 
                  ? "border-yellow-400 bg-yellow-400/10" 
                  : "border-zinc-600 bg-zinc-700/50 hover:border-zinc-500"
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="regular"
                  checked={businessType === "regular"}
                  onChange={() => setBusinessType("regular")}
                  className="w-4 h-4 text-yellow-400"
                />
                <div>
                  <div className="font-semibold text-white">Registered</div>
                  <div className="text-xs text-zinc-400">With GST</div>
                </div>
              </label>
            </div>
          </div>

          {/* Conditional Business Fields */}
          {businessType !== "individual" && (
            <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-yellow-300 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Business Name <span className="text-red-400 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. BookWorld Distributors"
                  className="w-full px-4 py-3 bg-zinc-700/80 border border-zinc-600 rounded-xl text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
                  required
                />
              </div>

              {businessType === "regular" && (
                <div>
                  <label className="block text-sm font-semibold text-yellow-300 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    GSTIN Number <span className="text-red-400 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. 27ABCDE1234F1Z5"
                    maxLength={15}
                    className="w-full px-4 py-3 bg-zinc-700/80 border border-zinc-600 rounded-xl text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
                    required
                  />
                  <p className="text-xs text-zinc-400 mt-2">15-character GST identification number</p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-yellow-400/50 transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Bank Details
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerForm;