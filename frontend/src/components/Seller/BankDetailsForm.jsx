import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BankDetailsForm = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  const navigate = useNavigate();

  // Load existing values if user comes back to edit
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("sellerDetails"));
    if (saved) {
      setAccountNumber(saved.accountNumber || "");
      setIfsc(saved.ifsc || "");
      setAccountHolder(saved.accountHolder || "");
    }
  }, []);

  // Auto-save form to localStorage on change
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("sellerDetails")) || {};
    const updated = {
      ...saved,
      accountNumber,
      ifsc,
      accountHolder,
    };
    localStorage.setItem("sellerDetails", JSON.stringify(updated));
  }, [accountNumber, ifsc, accountHolder]);

  // Basic validation for IFSC and account number
  const validateInputs = () => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(ifsc)) {
      alert("Invalid IFSC code. Example: SBIN0001234");
      return false;
    }

    if (accountNumber.length < 8 || accountNumber.length > 20) {
      alert("Account number must be between 8 to 20 digits.");
      return false;
    }

    if (!accountHolder.trim()) {
      alert("Account holder name is required.");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    // Navigate to next step (pickup address)
    navigate("/seller/pickup-address");
  };

  return (
    <div className="bg-zinc-900/60 min-h-screen flex items-center justify-center px-4 py-12 text-white">
      <div className="w-full max-w-2xl bg-zinc-800 rounded-xl p-8 shadow-lg border border-yellow-500">
        <h2 className="text-3xl font-bold text-yellow-400 mb-4 text-center">Bank Details</h2>
        <p className="text-center text-zinc-400 mb-6">Step 2 of 4 — Payment Credentials</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-yellow-300">
              Account Holder Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              placeholder="e.g. Roshan Avatirak"
              className="w-full mt-1 px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-300">
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
              placeholder="e.g. 123456789012"
              className="w-full mt-1 px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
              required
              inputMode="numeric"
              onPaste={(e) => e.preventDefault()}
            />
            <p className="text-xs text-zinc-400 mt-1">Avoid copy-pasting. Please type carefully.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-300">
              IFSC Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value.toUpperCase())}
              placeholder="e.g. SBIN0001234"
              className="w-full mt-1 px-4 py-2 rounded-md bg-zinc-700 border border-zinc-600 text-white"
              required
              maxLength={11}
            />
            <p className="text-xs text-zinc-400 mt-1">
              Format: 4 letters + 0 + 6 alphanumeric (e.g. SBIN0001234)
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition duration-300"
          >
            Next: Pickup Address →
          </button>
        </form>
      </div>
    </div>
  );
};

export default BankDetailsForm;
