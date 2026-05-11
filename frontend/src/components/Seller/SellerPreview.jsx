


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Alert from "../Alert/Alert";
import { useAlert } from "../Alert/useAlert";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

const SellerPreview = () => {
  const [sellerData, setSellerData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { alert, hideAlert, success, error, warning } = useAlert();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("sellerDetails"));
    if (!data || !data.fullName || !data.accountNumber || !data.pickupAddress) {
      warning(
        "Please complete all previous steps before proceeding.",
        "Incomplete Application"
      );
      setTimeout(() => {
        navigate("/seller/apply");
      }, 2000);
      return;
    }
    setSellerData(data);
  }, [navigate, warning]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSellerData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const updated = { ...sellerData, [name]: value };
    localStorage.setItem("sellerDetails", JSON.stringify(updated));
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

    const updated = {
      ...sellerData,
      pickupAddress: {
        ...sellerData.pickupAddress,
        [name]: value,
      },
    };
    localStorage.setItem("sellerDetails", JSON.stringify(updated));
  };

  const validateAllFields = () => {
    const {
      fullName,
      email,
      phone,
      accountNumber,
      ifsc,
      accountHolder,
      pickupAddress,
    } = sellerData;

    if (!fullName?.trim()) {
      error("Full name is required", "Validation Error");
      return false;
    }

    if (!email || !phone) {
      error("Email and phone are required", "Validation Error");
      return false;
    }

    if (!accountNumber || !ifsc || !accountHolder) {
      error("All bank details are required", "Validation Error");
      return false;
    }

    if (
      !pickupAddress ||
      !pickupAddress.street ||
      !pickupAddress.city ||
      !pickupAddress.state ||
      !pickupAddress.pincode ||
      !pickupAddress.country
    ) {
      error("Complete pickup address is required", "Validation Error");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateAllFields()) return;

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
      isIndividual,
    } = sellerData;

    const payload = {
      fullName,
      email,
      phone,
      sellerType: isIndividual
        ? "Individual"
        : gstNumber && gstNumber !== "N/A"
        ? "Business"
        : "Small Business",
      businessName: isIndividual ? undefined : businessName,
      gstNumber: isIndividual || gstNumber === "N/A" ? undefined : gstNumber,
      bankAccountNumber: accountNumber,
      bankIFSC: ifsc,
      bankHolderName: accountHolder,
      pickupAddress,
    };

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${API_URL}/seller/become-seller`,
        payload,
        { headers }
      );

      success(
        "Your seller application has been submitted successfully! We'll review it and notify you via email within 2-3 business days.",
        "Application Submitted!"
      );

      localStorage.removeItem("sellerDetails");

      setTimeout(() => {
        navigate("/profile/Submitted");
      }, 3000);
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to submit your application. Please check all fields and try again.";
      error(errorMessage, "Submission Failed");
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/seller/pickup-address");
  };

  if (!sellerData) return null;

  return (
    <>
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

      <div className="min-h-screen bg-gradient-to-r from-gray-900 via-zinc-800 to-gray-900 text-white px-4 py-8 flex justify-center items-center">
        <div className="w-full max-w-5xl bg-zinc-900/50 rounded-3xl px-6 sm:px-10 py-8 shadow-2xl border border-zinc-700">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-md">
              Review & Submit
            </h1>
            <p className="text-zinc-400 mt-2 text-sm italic">
              Final step — Verify your information before submitting
            </p>
            <hr className="mt-4 border-zinc-700 w-3/4 mx-auto rounded-full" />
          </div>

          {/* Edit Info Notice */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-semibold text-blue-300 mb-1">You Can Edit Directly</h4>
              <p className="text-xs text-blue-200/80 leading-relaxed">
                Simply tap on any field below to edit your information. Changes are saved automatically.
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-yellow-400 font-semibold uppercase tracking-wider">
                Progress
              </span>
              <span className="text-xs text-zinc-400 font-medium">
                Step 4 of 4 — Final Review
              </span>
            </div>
            <div className="w-full bg-zinc-700/50 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2.5 rounded-full transition-all duration-700 ease-out shadow-lg shadow-yellow-400/50"
                style={{ width: "100%" }}
              ></div>
            </div>

            {/* Step Dots */}
            <div className="flex justify-between mt-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs text-green-400 mt-2 font-medium">Complete</span>
              </div>
              <div className="flex-1 h-0.5 bg-green-500 self-center mx-2 mt-5"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs text-green-400 mt-2 font-medium">Complete</span>
              </div>
              <div className="flex-1 h-0.5 bg-green-500 self-center mx-2 mt-5"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs text-green-400 mt-2 font-medium">Complete</span>
              </div>
              <div className="flex-1 h-0.5 bg-green-500 self-center mx-2 mt-5"></div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-400/50">
                  <span className="text-black font-bold">4</span>
                </div>
                <span className="text-xs text-yellow-400 mt-2 font-medium">Review</span>
              </div>
            </div>
          </div>

          <form className="space-y-6">
            {/* Section: Personal / Business Info */}
            <section className="bg-zinc-800/50 rounded-2xl p-5 border border-zinc-700/50">
              <h3 className="text-lg font-bold text-yellow-300 flex items-center gap-2 mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal / Business Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Full Name *</label>
                  <input
                    name="fullName"
                    value={sellerData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-700/80 border border-zinc-600 text-white text-sm focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Email *</label>
                  <input
                    name="email"
                    value={sellerData.email}
                    readOnly
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-700/50 border border-zinc-600 text-zinc-300 text-sm cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Phone *</label>
                  <input
                    name="phone"
                    value={sellerData.phone}
                    readOnly
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-700/50 border border-zinc-600 text-zinc-300 text-sm cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Business Name</label>
                  <input
                    name="businessName"
                    value={sellerData.businessName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-700/80 border border-zinc-600 text-white text-sm focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
                    placeholder="Business Name (if applicable)"
                  />
                </div>
                {!sellerData.isIndividual && sellerData.gstNumber !== "N/A" && (
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5 font-medium">GST Number</label>
                    <input
                      name="gstNumber"
                      value={sellerData.gstNumber || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-700/80 border border-zinc-600 text-white text-sm focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Section: Bank Details */}
            <section className="bg-zinc-800/50 rounded-2xl p-5 border border-zinc-700/50">
              <h3 className="text-lg font-bold text-yellow-300 flex items-center gap-2 mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Bank Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Account Holder Name *</label>
                  <input
                    name="accountHolder"
                    value={sellerData.accountHolder}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-700/80 border border-zinc-600 text-white text-sm focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Account Number *</label>
                  <input
                    name="accountNumber"
                    value={sellerData.accountNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-700/80 border border-zinc-600 text-white text-sm focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">IFSC Code *</label>
                  <input
                    name="ifsc"
                    value={sellerData.ifsc}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-700/80 border border-zinc-600 text-white text-sm focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all font-mono uppercase"
                  />
                </div>
              </div>
            </section>

            {/* Section: Pickup Address */}
            <section className="bg-zinc-800/50 rounded-2xl p-5 border border-zinc-700/50">
              <h3 className="text-lg font-bold text-yellow-300 flex items-center gap-2 mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Pickup Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Street Address *</label>
                  <textarea
                    name="street"
                    value={sellerData.pickupAddress?.street || ""}
                    onChange={handleAddressChange}
                    rows={2}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-700/80 border border-zinc-600 text-white text-sm focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Village/Town</label>
                  <input
                    name="village"
                    value={sellerData.pickupAddress?.village || ""}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-700/80 border border-zinc-600 text-white text-sm focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">City *</label>
                  <input
                    name="city"
                    value={sellerData.pickupAddress?.city || ""}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-700/80 border border-zinc-600 text-white text-sm focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">State *</label>
                  <input
                    name="state"
                    value={sellerData.pickupAddress?.state || ""}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-700/80 border border-zinc-600 text-white text-sm focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Pincode *</label>
                  <input
                    name="pincode"
                    value={sellerData.pickupAddress?.pincode || ""}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-700/80 border border-zinc-600 text-white text-sm focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Country *</label>
                  <input
                    name="country"
                    value={sellerData.pickupAddress?.country || ""}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-700/80 border border-zinc-600 text-white text-sm focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Important Notice */}
            <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/40 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-yellow-300 mb-2">Before You Submit</h4>
                  <p className="text-xs text-yellow-100/90 leading-relaxed mb-2">
                    Please review all information carefully. Once submitted, your application will be reviewed by our team within 2-3 business days.
                  </p>
                  <ul className="text-xs text-yellow-100/80 space-y-1 list-disc list-inside">
                    <li>Ensure all details are accurate and up-to-date</li>
                    <li>Bank account information cannot be changed after approval</li>
                    <li>Your pickup address should be accessible during business hours</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-3 px-6 bg-zinc-700 text-white font-semibold rounded-xl hover:bg-zinc-600 transition-all duration-300 border border-zinc-600 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Previous Step
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-yellow-400/50 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SellerPreview;