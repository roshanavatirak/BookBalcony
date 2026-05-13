import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, phone, password, confirmPassword } = form;

    // Frontend validation
    if (!username || !email || !phone || !password || !confirmPassword) {
      return setError("Please fill in all fields.");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError("Please enter a valid email address.");
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9]{10,}$/;
    if (!phoneRegex.test(phone.replace(/[^0-9]/g, ''))) {
      return setError("Please enter a valid phone number (at least 10 digits).");
    }

    // Password strength validation
    if (password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }

    try {
      setError("");
      setLoading(true);
      
      console.log("📝 Attempting signup...");

      const response = await axios.post(`${API_URL}/sign-up`, {
        username,
        email,
        phone,
        password,
      });

      console.log("✅ Signup successful:", response.data);

      setSuccess(response.data.message || "Account created successfully! Redirecting to login...");

      // Set onboarding flag
      localStorage.setItem("showOnboarding", "true");
      
      // ✅ Optional: Dispatch signup event (if you want to track new signups)
      const signupEvent = new CustomEvent('userSignedUp', {
        detail: {
          email: email,
          username: username
        }
      });
      window.dispatchEvent(signupEvent);
      console.log("📢 SignUp: Dispatched userSignedUp event");
       
      setTimeout(() => {
        navigate("/signin");
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      console.error("❌ Signup error:", err);
      const errorMessage = err.response?.data?.message || "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-zinc-800 to-gray-900 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-zinc-900 p-6 sm:p-8 rounded-3xl shadow-lg w-full max-w-md text-white border border-zinc-800">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-yellow-400 text-center">Create Account</h2>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-red-400 text-xs sm:text-sm text-center bg-red-900/50 border border-red-500/50 px-3 py-2 rounded-lg"
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-green-400 text-xs sm:text-sm text-center bg-green-900/50 border border-green-500/50 px-3 py-2 rounded-lg"
          >
            {success}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base rounded-md bg-transparent border border-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all disabled:opacity-50"
            value={form.username}
            onChange={handleChange}
            disabled={loading}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base rounded-md bg-transparent border border-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all disabled:opacity-50"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Mobile Number"
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base rounded-md bg-transparent border border-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all disabled:opacity-50"
            value={form.phone}
            onChange={handleChange}
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password (min. 6 characters)"
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base rounded-md bg-transparent border border-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all disabled:opacity-50"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base rounded-md bg-transparent border border-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all disabled:opacity-50"
            value={form.confirmPassword}
            onChange={handleChange}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-semibold py-2.5 sm:py-3 text-sm sm:text-base rounded-md hover:bg-yellow-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Account...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-xs sm:text-sm text-zinc-400 text-center mt-5 sm:mt-6">
          Already have an account?{" "}
          <Link to="/signin" className="text-yellow-400 hover:underline transition-all duration-300 hover:text-yellow-300">
            Sign In
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignUp;