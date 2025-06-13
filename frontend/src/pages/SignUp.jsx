import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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

    try {
      setError("");
      const response = await axios.post("http://localhost:3000/api/v1/sign-up", {
        username,
        email,
        phone,
        password,
      });

      setSuccess(response.data.message);
      setTimeout(() => {
        navigate("/signin");
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-zinc-800 to-gray-900 flex items-center justify-center px-6 py-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-zinc-900 p-8 rounded-3xl shadow-lg w-full max-w-md text-white">
        <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">Create Account</h2>

        {error && (
          <div className="mb-4 text-red-400 text-sm text-center bg-red-900 px-3 py-2 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-green-400 text-sm text-center bg-green-900 px-3 py-2 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full p-3 rounded-md bg-transparent border border-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={form.username}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full p-3 rounded-md bg-transparent border border-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Mobile Number"
            className="w-full p-3 rounded-md bg-transparent border border-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={form.phone}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 rounded-md bg-transparent border border-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={form.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full p-3 rounded-md bg-transparent border border-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-md hover:bg-yellow-300 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-zinc-400 text-center mt-4">
          Already have an account?{" "}
          <Link to="/signin" className="text-yellow-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignUp;
