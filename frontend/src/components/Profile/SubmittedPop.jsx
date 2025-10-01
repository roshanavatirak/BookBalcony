import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStore } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

const SubmittedPop = () => {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/get-seller-info", {
          headers: {
            id: localStorage.getItem("id"),
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const submittedAt = new Date(response.data.seller.applicationSubmittedAt);
        const now = new Date();
        const elapsedTime = now - submittedAt;
        const totalDuration = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
        const percentage = Math.min((elapsedTime / totalDuration) * 90, 90); // up to 90%

        setProgress(percentage);
      } catch (error) {
        console.error("Failed to fetch seller info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-zinc-800 to-gray-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-zinc-900 border border-yellow-500 rounded-2xl shadow-2xl p-10 max-w-xl w-full text-center overflow-hidden"
      >
        {/* Glowing Background Circle */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-yellow-400 opacity-10 rounded-full blur-3xl animate-pulse"></div>

        {/* Store Icon */}
        <div className="text-yellow-400 text-6xl mb-4 drop-shadow-lg animate-pulse">
          <FaStore />
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-yellow-300 mb-3 tracking-wide">
          Application Submitted!
        </h1>

        {/* Message */}
        <p className="text-zinc-300 mb-6 leading-relaxed">
          Thank you for applying to become a seller on{" "}
          <span className="text-yellow-400 font-semibold">BookBalcony</span>!
          <br />
          Our team is reviewing your application. This usually takes <br />
          <span className="text-yellow-400 font-semibold">1–2 business days</span>.
        </p>

        {/* Progress Bar */}
        {!loading && (
          <div className="mb-6">
            <div className="w-full h-3 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm text-zinc-400 mt-2 block">Review in Progress</span>
          </div>
        )}

        {/* Trust Note */}
        <div className="mb-8 text-sm text-zinc-400 italic">
          <span className="text-yellow-500 font-semibold">Trusted by thousands</span> of book lovers and sellers across India.
        </div>

        {/* CTA Button */}
        <Link
          to="/"
          className="inline-block bg-yellow-400 text-black font-semibold py-2.5 px-8 rounded-full shadow-lg hover:bg-yellow-300 transition-all duration-300"
        >
          Go to Homepage
        </Link>
      </motion.div>
    </div>
  );
};

export default SubmittedPop;
