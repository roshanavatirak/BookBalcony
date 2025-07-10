import React, { useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

const BecomeSeller = () => {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const handleBecomeSeller = async () => {
    if (!agreed) {
      alert("Please agree to the terms & conditions first.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/v1/become-seller",
        {},
        { headers }
      );
      setSuccessMsg(res.data.message || "You are now a seller!");
    } catch (err) {
      console.error("Error becoming seller:", err);
      alert("Failed to become seller. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900/50 rounded-3xl min-h-screen px-8 py-10 shadow-xl border border-zinc-700">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-yellow-400 mb-2">
        Become a Seller on BookBalcony
      </h1>
      <p className="text-center italic text-zinc-300 text-sm sm:text-base mb-8">
        Unlock your storefront and reach thousands of book lovers across India 📚🚀
      </p>

      <div className="max-w-3xl mx-auto text-zinc-300 space-y-4 text-sm sm:text-base">
        <h2 className="text-xl font-bold text-yellow-300">Why sell on BookBalcony?</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>📦 Easy listing and inventory management</li>
          <li>💳 Secure payment and hassle-free transactions</li>
          <li>📈 Grow your visibility with a large reader base</li>
          <li>📞 Dedicated seller support and analytics</li>
        </ul>

        <h2 className="text-xl font-bold text-yellow-300 mt-6">Terms & Conditions</h2>
        <ul className="list-decimal ml-6 space-y-2">
          <li>You must provide accurate book information and handle timely deliveries.</li>
          <li>Only original or authorized books may be listed. No pirated content is allowed.</li>
          <li>BookBalcony holds the right to suspend accounts violating community rules.</li>
        </ul>

        <div className="mt-6 flex items-center gap-3">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="accent-yellow-400 w-4 h-4"
          />
          <label className="text-zinc-200">
            I agree to the <span className="text-yellow-400 font-medium">terms and conditions</span>.
          </label>
        </div>

        <div className="mt-6">
          <Link to="/seller/form">
          <button
            // onClick={handleBecomeSeller}
            disabled={loading || !agreed}
            className={`w-full sm:w-auto px-6 py-2 rounded-lg text-black font-bold transition-all duration-300 ${
              loading || !agreed
                ? "bg-yellow-300 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-300 shadow hover:shadow-yellow-400"
            }`}
          >
            {loading ? "Processing..." : "Apply as Seller"}
          </button>
          </Link>
        </div>

        {successMsg && (
          <p className="text-green-400 mt-4 font-semibold text-center">{successMsg}</p>
        )}
      </div>
    </div>
  );
};

export default BecomeSeller;
