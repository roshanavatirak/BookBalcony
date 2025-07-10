import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Rao from "../../assets/Rao.png";
import AddressForm from "../Forms/AddressForm";

// Onboarding slides
const pages = [
  {
    title: "🎉 Welcome to BookBalcony!",
    desc: (
      <>
        <p className="mb-2">
          📚 Your one-stop destination for book lovers — buy, sell, and explore books easily.
        </p>
        <p className="text-sm italic text-yellow-200">
          “A reader lives a thousand lives before he dies.” — George R.R. Martin
        </p>
      </>
    ),
  },
  {
    title: "👨‍💻 Meet the Developer",
    desc: (
      <div className="flex items-center gap-4">
        <img
          src={Rao}
          alt="Roshan"
          className="w-16 h-16 rounded-full border border-yellow-400"
        />
        <div>
          <p className="mb-1">
            Hi, I'm <strong className="text-yellow-300">Roshan Avatirak</strong> 👋<br />
            I created BookBalcony to empower students and readers to buy/sell books with ease.
          </p>
          <p className="text-sm text-zinc-400 italic">
            Let’s build a smarter reading community together!
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "📚 How to Use BookBalcony",
    desc: (
      <>
        <h4 className="font-semibold text-yellow-300 mb-2">📖 For Buyers:</h4>
        <ul className="list-disc list-inside mb-4 text-sm text-zinc-300 space-y-1">
          <li>Search and discover trending books</li>
          <li>Add to cart and place orders with a few clicks</li>
          <li>Track live order status like Flipkart</li>
        </ul>
        <h4 className="font-semibold text-yellow-300 mb-2">🛍️ For Sellers:</h4>
        <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
          <li>List your books with details and price</li>
          <li>Manage orders via Seller Dashboard</li>
          <li>Boost visibility by sharing your shop</li>
        </ul>
      </>
    ),
  },
  {
    title: "📍 Add Your Delivery Address",
    desc: (
      <p className="text-sm text-zinc-300 mb-2">
        To complete your journey with BookBalcony, we need your address for personalized delivery.
      </p>
    ),
    isFinal: true,
  },
];

const OnboardingModal = ({ onClose }) => {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    houseNumber: "",
    streetName: "",
    landmark: "",
    locality: "",
    villageOrTown: "",
    district: "",
    city: "",
    state: "",
    pincode: "",
  });

  const isFinalPage = pages[page].isFinal;

  const next = async () => {
    if (isFinalPage) {
      // Check required fields
      const requiredFields = [
        "houseNumber", "streetName", "locality", "city", "state", "pincode"
      ];
      const emptyField = requiredFields.find((field) => !address[field]?.trim());
      if (emptyField) return alert(`Please fill in ${emptyField.replace(/([A-Z])/g, " $1")}`);
console.log("📦 Sending address:", address);

      setLoading(true);
      try {
        await axios.post(
          "http://localhost:3000/api/v1/add-address",
          { address },
          {
            headers: {
              id: localStorage.getItem("id"),
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        localStorage.removeItem("showOnboarding");
        onClose();
      } catch (err) {
        console.error(err);
        alert("Failed to save address. Try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setPage(page + 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-zinc-900 max-w-3xl w-full rounded-2xl shadow-2xl border border-yellow-400 p-8 text-white"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-4">
          {pages[page].title}
        </h2>

        <div className="text-sm sm:text-base text-zinc-300 mb-6">{pages[page].desc}</div>

        {isFinalPage && (
          <AddressForm address={address} setAddress={setAddress} />
        )}

        <button
          onClick={next}
          disabled={loading}
          className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-md hover:bg-yellow-300 transition"
        >
          {loading ? "Saving..." : isFinalPage ? "Finish Onboarding" : "Next"}
        </button>
      </motion.div>
    </div>
  );
};

export default OnboardingModal;
