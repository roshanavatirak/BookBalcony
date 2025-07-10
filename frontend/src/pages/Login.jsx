import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth"

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [credentials, setCredentials] = useState({
    emailOrMobile: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { emailOrMobile, password } = credentials;

    if (!emailOrMobile || !password) {
      setError("Please enter both email/mobile and password.");
      return;
    }

    try {
      setError("");

      // Send login request to backend
      const response = await axios.post("http://localhost:3000/api/v1/sign-in", {
        emailOrMobile,
        password,
      });

      const { token, role, id } = response.data;

      // ✅ Store login info in localStorage for persistence (30 days)
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("id", response.data.id);

      console.log(response.data)
      // ✅ Update Redux store
      dispatch(authActions.login());
      dispatch(authActions.changeRole(role));



      alert("Login successful!");
      navigate("/");

    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials or server error.");
    }
  };

  // ✅ Keep user logged in on reload (if token exists)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      dispatch(authActions.login());
      if (role) {
        dispatch(authActions.changeRole(role));
      }
    }
  }, [dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-zinc-800 to-gray-900 flex items-center justify-center p-6"
    >
      <div className="bg-zinc-900 p-8 rounded-3xl shadow-lg w-full max-w-md text-white">
        <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">
          Login to Your Account
        </h2>

        {error && (
          <div className="mb-4 text-red-400 text-sm text-center bg-red-900 px-3 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="emailOrMobile"
            placeholder="Email or Mobile Number"
            value={credentials.emailOrMobile}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-transparent border border-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-transparent border border-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-md hover:bg-yellow-300 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-zinc-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-yellow-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
