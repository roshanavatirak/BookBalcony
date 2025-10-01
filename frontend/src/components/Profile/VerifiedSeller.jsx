import React from 'react';
import { FaCheckCircle, FaEnvelope, FaHeadset, FaBug } from 'react-icons/fa';

const VerifiedSeller = () => {
  return (
    <div className="min-h-screen bg-zinc-900/50 rounded-3xl p-4 sm:p-8 text-white shadow-xl border border-zinc-700">
      <div className="max-w-4xl mx-auto bg-zinc-900/70 rounded-3xl shadow-2xl p-8 md:p-12 border border-yellow-400">

        <h1 className="text-3xl sm:text-4xl font-extrabold text-yellow-400 mb-6 flex items-center gap-3">
          <FaCheckCircle className="text-green-400 text-3xl" />
          Verified Seller Information
        </h1>

        {/* Benefits */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-2 text-white">🎁 Seller Benefits</h2>
          <ul className="list-disc list-inside text-zinc-300 space-y-1">
            <li>Zero Commission Fees on first 10 sales</li>
            <li>Priority Listing for Products</li>
            <li>Seller Dashboard with advanced analytics</li>
            <li>Dedicated Support for Verified Sellers</li>
            <li>Early Access to New Features</li>
          </ul>
        </section>

        {/* Terms */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-2 text-white">📜 Terms & Conditions</h2>
          <ul className="list-disc list-inside text-zinc-400 space-y-1">
            <li>Products must comply with BookBalcony quality standards.</li>
            <li>Misuse of seller privileges can result in account suspension.</li>
            <li>All disputes are handled under Indian Cyber Law regulations.</li>
            <li>Refunds must be honored in case of order failures or disputes.</li>
          </ul>
        </section>

        {/* Support */}
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-2 text-white flex items-center gap-2">
            <FaHeadset /> 24×7 Seller Support
          </h2>
          <p className="text-zinc-300">
            Have questions or need help? Our seller support team is available 24×7 to assist you.
          </p>
        </section>

        {/* Developer Contact */}
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-2 text-white flex items-center gap-2">
            <FaEnvelope /> Developer Contact
          </h2>
          <p className="text-zinc-300">
            For technical issues, contact our dev team:{" "}
            <a href="mailto:support@bookbalcony.in" className="text-yellow-400 underline">
              support@bookbalcony.in
            </a>
          </p>
        </section>

        {/* Report Issue Button */}
        <div className="mt-6">
          <a
            href="mailto:support@bookbalcony.in?subject=Issue%20Report"
            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold transition-all duration-300"
          >
            <FaBug />
            Report an Issue
          </a>
        </div>
      </div>
    </div>
  );
};

export default VerifiedSeller;
