

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../Alert/Alert";
import { useAlert } from "../Alert/useAlert";

const BankDetailsForm = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();
  const { alert, hideAlert, success, error, warning } = useAlert();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("sellerDetails"));
    if (saved) {
      setAccountNumber(saved.accountNumber || "");
      setConfirmAccountNumber(saved.accountNumber || "");
      setIfsc(saved.ifsc || "");
      setAccountHolder(saved.accountHolder || "");
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return; // Don't save until initial data is loaded
    
    const saved = JSON.parse(localStorage.getItem("sellerDetails")) || {};
    const updated = {
      ...saved,
      accountNumber,
      ifsc,
      accountHolder,
    };
    localStorage.setItem("sellerDetails", JSON.stringify(updated));
  }, [accountNumber, ifsc, accountHolder, isLoaded]);

  const validateInputs = () => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    
    if (!accountHolder.trim()) {
      error("Account holder name is required", "Missing Field");
      return false;
    }

    if (accountNumber.length < 8 || accountNumber.length > 20) {
      error("Account number must be between 8 to 20 digits", "Invalid Account Number");
      return false;
    }

    if (accountNumber !== confirmAccountNumber) {
      error("Account numbers do not match. Please verify.", "Mismatch Error");
      return false;
    }

    if (!ifscRegex.test(ifsc)) {
      error("Invalid IFSC code format. Example: SBIN0001234", "Invalid IFSC");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    success("Bank details saved successfully!", "Step 2 Complete");
    setTimeout(() => navigate("/seller/pickup-address"), 1000);
  };

  const handleBack = () => {
    // Save current state to localStorage before navigating back
    const saved = JSON.parse(localStorage.getItem("sellerDetails")) || {};
    const updated = {
      ...saved,
      accountNumber,
      ifsc,
      accountHolder,
    };
    localStorage.setItem("sellerDetails", JSON.stringify(updated));
    
    navigate("/seller/form");
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
            Bank Details
          </h1>
          <p className="text-zinc-400 mt-2 text-sm italic">
            Secure payment information for your earnings
          </p>
          <hr className="mt-4 border-zinc-700 w-3/4 mx-auto rounded-full" />
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-yellow-400 font-semibold uppercase tracking-wider">Progress</span>
            <span className="text-xs text-zinc-400 font-medium">Step 2 of 4 — Bank Information</span>
          </div>
          <div className="w-full bg-zinc-700/50 rounded-full h-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2.5 rounded-full transition-all duration-700 ease-out shadow-lg shadow-yellow-400/50" style={{ width: '50%' }}></div>
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
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-400/50">
                <span className="text-black font-bold">2</span>
              </div>
              <span className="text-xs text-yellow-400 mt-2 font-medium">Bank</span>
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Security Notice */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-5 flex items-start gap-4">
            <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <h4 className="text-sm font-semibold text-blue-300 mb-1">Your Information is Secure</h4>
              <p className="text-xs text-blue-200/80 leading-relaxed">
                All banking information is encrypted and stored securely. We use industry-standard security measures to protect your data.
              </p>
            </div>
          </div>

          {/* Account Holder Name */}
          <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300">
            <label className="block text-base font-semibold text-yellow-300 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Account Holder Name <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="text"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              placeholder="Full name as per bank account"
              className="w-full px-4 py-3 bg-zinc-700/80 border border-zinc-600 rounded-xl text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
              required
            />
            <p className="text-xs text-zinc-400 mt-2">Enter name exactly as it appears on your bank account</p>
          </div>

          {/* Account Number */}
          <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300">
            <label className="block text-base font-semibold text-yellow-300 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Account Number <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter your bank account number"
              className="w-full px-4 py-3 bg-zinc-700/80 border border-zinc-600 rounded-xl text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all font-mono text-lg tracking-wider"
              required
              inputMode="numeric"
              maxLength={20}
              onPaste={(e) => e.preventDefault()}
            />
            <p className="text-xs text-zinc-400 mt-2 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Copy-paste disabled for security. Please type carefully.
            </p>
          </div>

          {/* Confirm Account Number */}
          <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300">
            <label className="block text-base font-semibold text-yellow-300 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Confirm Account Number <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="text"
              value={confirmAccountNumber}
              onChange={(e) => setConfirmAccountNumber(e.target.value.replace(/\D/g, ""))}
              placeholder="Re-enter your account number"
              className={`w-full px-4 py-3 bg-zinc-700/80 border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all font-mono text-lg tracking-wider ${
                confirmAccountNumber && accountNumber === confirmAccountNumber
                  ? "border-green-500 focus:border-green-400 focus:ring-green-400/20"
                  : "border-zinc-600 focus:border-yellow-400 focus:ring-yellow-400/20"
              }`}
              required
              inputMode="numeric"
              maxLength={20}
              onPaste={(e) => e.preventDefault()}
            />
            {confirmAccountNumber && (
              <p className={`text-xs mt-2 flex items-center gap-1 ${
                accountNumber === confirmAccountNumber ? "text-green-400" : "text-red-400"
              }`}>
                {accountNumber === confirmAccountNumber ? (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Account numbers match
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Account numbers do not match
                  </>
                )}
              </p>
            )}
          </div>

          {/* IFSC Code */}
          <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300">
            <label className="block text-base font-semibold text-yellow-300 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              IFSC Code <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="text"
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value.toUpperCase())}
              placeholder="e.g. SBIN0001234"
              className="w-full px-4 py-3 bg-zinc-700/80 border border-zinc-600 rounded-xl text-white placeholder-zinc-500 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all font-mono text-lg tracking-wider uppercase"
              required
              maxLength={11}
            />
            <p className="text-xs text-zinc-400 mt-2">
              Format: 4 letters + 0 + 6 alphanumeric characters (e.g., SBIN0001234)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
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
              type="submit"
              className="flex-1 py-3 px-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-yellow-400/50 transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              Continue to Address
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

export default BankDetailsForm;