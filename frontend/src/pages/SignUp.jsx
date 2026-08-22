import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import TurnstileWidget from '../components/Security/TurnstileWidget';
import logo from '../assets/logo.png';

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

const SignUp = ({ onSuccess, onSwitchToLogin, isModal = false }) => {
  const [signUpMode, setSignUpMode] = useState("email"); // 'email' | 'phone'
  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Google Auth states
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [googleToken, setGoogleToken] = useState("");
  const [googlePhone, setGooglePhone] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, phone, password, confirmPassword } = form;

    // Validation based on selected mode
    if (signUpMode === "email") {
      if (!email) {
        return setError("Please enter your email address.");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return setError("Please enter a valid email address.");
      }
    } else {
      if (!phone) {
        return setError("Please enter your 10-digit mobile number.");
      }
      const phoneDigits = phone.replace(/[^0-9]/g, '');
      if (phoneDigits.length < 10) {
        return setError("Mobile number must be at least 10 digits.");
      }
    }

    if (!password || password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (!turnstileToken) {
      return setError("Please complete the security verification check.");
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        email: signUpMode === "email" ? email : undefined,
        phone: signUpMode === "phone" ? phone : undefined,
        password,
        cfTurnstileToken: turnstileToken,
      };

      const response = await axios.post(`${API_URL}/sign-up`, payload);

      const { token, role, id, email: returnedEmail } = response.data;

      // Set onboarding flag
      localStorage.setItem("showOnboarding", "true");

      if (token && role && id) {
        // Save auth data to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("id", id);
        if (returnedEmail) {
          localStorage.setItem("rememberedUser", returnedEmail);
        }

        // Update Redux state
        dispatch(authActions.login());
        dispatch(authActions.changeRole(role));

        // Dispatch login event
        const loginEvent = new CustomEvent('userLoggedIn', {
          detail: { email: returnedEmail, userId: id, role }
        });
        window.dispatchEvent(loginEvent);

        setSuccess("Account created successfully! Logging you in...");

        if (onSuccess) {
          onSuccess(response.data);
          return;
        }

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1200);
      } else {
        setSuccess(response.data.message || "Account created!");

        if (onSuccess) {
          onSuccess(response.data);
          return;
        }

        setTimeout(() => {
          if (onSwitchToLogin) onSwitchToLogin();
          else navigate("/account/login", { replace: true });
        }, 1500);
      }
    } catch (err) {
      console.error("❌ Signup error:", err);
      const errorMessage = err.response?.data?.message || "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setError("");
        setSuccess("Authenticating with Google...");

        const response = await axios.post(`${API_URL}/google-auth`, {
          token: tokenResponse.access_token,
        });

        if (response.data.isNewUser) {
          // Need phone number
          setGoogleToken(tokenResponse.access_token);
          setSuccess("");
          setShowPhoneModal(true);
        } else {
          // Normal login success
          const { token, role, id } = response.data;
          localStorage.setItem("token", token);
          localStorage.setItem("role", role);
          localStorage.setItem("id", id);
          dispatch(authActions.login());
          dispatch(authActions.changeRole(role));

          const loginEvent = new CustomEvent('userLoggedIn', {
            detail: { email: response.data.email, userId: id, role: role }
          });
          window.dispatchEvent(loginEvent);

          setSuccess(`Welcome back! Redirecting...`);
          setTimeout(() => {
            if (role === "admin") navigate("/Admin/profile", { replace: true });
            else navigate("/", { replace: true });
          }, 1500);
        }
      } catch (err) {
        console.error("Google Auth Error:", err);
        setError("Google Sign-In failed.");
        setSuccess("");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError("Google Sign-In failed")
  });

  const handleGoogleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!googlePhone) {
      return setError("Please enter your phone number");
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("Creating account...");

      const response = await axios.post(`${API_URL}/google-signup`, {
        token: googleToken,
        phone: googlePhone,
      });

      const { token, role, id, email } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("id", id);
      dispatch(authActions.login());
      dispatch(authActions.changeRole(role));

      // Dispatch signup event
      const signupEvent = new CustomEvent('userSignedUp', {
        detail: { email: email }
      });
      window.dispatchEvent(signupEvent);

      setSuccess(`Account created successfully!`);
      setShowPhoneModal(false);

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Sign up failed.";
      setError(errorMessage);
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={isModal ? "w-full text-white" : "min-h-[calc(100vh-90px)] bg-gradient-to-br from-gray-900 via-zinc-800 to-gray-900 flex items-center justify-center p-3 transition-all duration-500"}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={isModal ? "bg-zinc-900 p-4 sm:p-5 rounded-2xl w-full text-white" : "bg-zinc-900 p-5 sm:p-6 rounded-2xl shadow-2xl w-full max-w-[350px] text-white border border-zinc-800 transition-all duration-300 hover:shadow-yellow-500/10"}>
        
        {/* Logo Header with Signature Yellow Brand Title */}
        <div className="flex flex-col items-center justify-center mb-3 space-y-1">
          <img src={logo} alt="BookBalcony" className="w-10 h-10 object-contain drop-shadow" />
          <span className="text-xl font-bold tracking-tight text-yellow-400">BookBalcony</span>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 text-red-400 text-xs text-center bg-red-900/50 border border-red-500/50 px-2.5 py-1.5 rounded-lg"
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 text-green-400 text-xs text-center bg-green-900/50 border border-green-500/50 px-2.5 py-1.5 rounded-lg"
          >
            {success}
          </motion.div>
        )}

        {/* Dynamic Mode Switcher Tabs */}
        <div className="flex bg-zinc-800 p-1 rounded-xl mb-3 border border-zinc-700/60">
          <button
            type="button"
            onClick={() => setSignUpMode('email')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              signUpMode === 'email'
                ? 'bg-yellow-400 text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Email Sign Up
          </button>
          <button
            type="button"
            onClick={() => setSignUpMode('phone')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              signUpMode === 'phone'
                ? 'bg-yellow-400 text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Mobile Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5" autoComplete="on">
          {signUpMode === 'email' ? (
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              placeholder="Email Address"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-transparent border border-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 transition-all duration-200 text-white"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
            />
          ) : (
            <input
              type="tel"
              id="phone"
              name="phone"
              autoComplete="tel"
              placeholder="10-digit Mobile Number"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-transparent border border-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 transition-all duration-200 text-white"
              value={form.phone}
              onChange={handleChange}
              disabled={loading}
            />
          )}

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              autoComplete="new-password"
              placeholder="Password (min. 6 chars)"
              className="w-full pl-3 pr-10 py-2 text-xs sm:text-sm rounded-xl bg-transparent border border-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 transition-all duration-200 text-white"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-yellow-400 transition-colors focus:outline-none p-1"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash className="text-sm sm:text-base" /> : <FaEye className="text-sm sm:text-base" />}
            </button>
          </div>

          <div className="relative w-full">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Confirm Password"
              className="w-full pl-3 pr-10 py-2 text-xs sm:text-sm rounded-xl bg-transparent border border-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 transition-all duration-200 text-white"
              value={form.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-yellow-400 transition-colors focus:outline-none p-1"
              tabIndex={-1}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <FaEyeSlash className="text-sm sm:text-base" /> : <FaEye className="text-sm sm:text-base" />}
            </button>
          </div>

          {/* Cloudflare Turnstile Verification Widget */}
          <TurnstileWidget
            onSuccess={(token) => setTurnstileToken(token)}
            onExpire={() => setTurnstileToken("")}
          />

          {/* Primary Sign Up Button (Theme Signature Yellow) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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

        {/* Terms & Privacy Legal Statement */}
        <p className="text-[11px] text-zinc-400 text-center my-2 leading-tight">
          By continuing, you agree to <Link to="/terms-of-service" className="text-yellow-400 hover:underline hover:text-yellow-300">Terms</Link> & <Link to="/privacy-policy" className="text-yellow-400 hover:underline hover:text-yellow-300">Privacy Policy</Link>.
        </p>

        {/* Links Row */}
        <div className="flex items-center justify-between text-xs text-zinc-400 my-2 pt-1 border-t border-zinc-800">
          <span>Already have an account?</span>
          {onSwitchToLogin ? (
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-yellow-400 hover:underline hover:text-yellow-300 font-semibold transition-colors focus:outline-none"
            >
              Sign In
            </button>
          ) : (
            <Link to="/account/login" className="text-yellow-400 hover:underline hover:text-yellow-300 font-semibold transition-colors">
              Sign In
            </Link>
          )}
        </div>

        {/* Social Auth Icons Section */}
        <div className="mt-2 pt-1">
          <p className="text-[11px] text-zinc-400 text-center mb-1.5">or you can sign up with</p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => loginWithGoogle()}
              disabled={loading}
              className="w-9 h-9 rounded-full bg-zinc-800/90 border border-zinc-700/80 hover:bg-zinc-750 hover:border-yellow-400/50 transition-all duration-200 flex items-center justify-center shadow-sm group active:scale-95 disabled:opacity-50"
              title="Sign up with Google"
            >
              <FcGoogle className="text-xl transition-transform group-hover:scale-110" />
            </button>
          </div>
        </div>
      </div>

      {/* Phone Number Modal for Google Sign-Up */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm w-full">
            <h3 className="text-xl font-bold text-yellow-400 mb-2">Almost there!</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Please provide your mobile number to complete your registration.
            </p>
            <form onSubmit={handleGoogleSignupSubmit} className="space-y-4">
              <input
                type="tel"
                placeholder="Mobile Number (10 digits)"
                value={googlePhone}
                onChange={(e) => setGooglePhone(e.target.value)}
                disabled={loading}
                className="w-full p-3 rounded-md bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPhoneModal(false)}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-md text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-md bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Complete"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SignUp;