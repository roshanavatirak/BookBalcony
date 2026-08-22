
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import Alert from "../components/Alert/Alert";
import { useAlert } from "../components/Alert/useAlert";
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import TurnstileWidget from '../components/Security/TurnstileWidget';
import logo from '../assets/logo.png';

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { alert, showAlert, hideAlert, success, error, warning, info } = useAlert();

  const [credentials, setCredentials] = useState({
    emailOrMobile: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  // Google Auth states
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [googleToken, setGoogleToken] = useState("");
  const [phone, setPhone] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { emailOrMobile, password } = credentials;

    // Validation
    if (!emailOrMobile || !password) {
      error("Please enter both email/mobile and password.", "Validation Error");
      return;
    }

    if (!turnstileToken) {
      error("Please complete the security check.", "Security Verification");
      return;
    }

    try {
      setLoading(true);
      info("Logging you in...", "Please Wait");

      console.log("🔐 Attempting login...");

      // Send login request to backend with Cloudflare Turnstile Token
      const response = await axios.post(`${API_URL}/sign-in`, {
        emailOrMobile,
        password,
        rememberMe,
        cfTurnstileToken: turnstileToken,
      });

      console.log("📥 Login response:", response.data);

      const { token, role, id } = response.data;

      // Validate response data
      if (!token || !role || !id) {
        throw new Error("Invalid response from server - missing required fields");
      }

      console.log("✅ Login data received:", { role, id, hasToken: !!token });

      // Store login info in localStorage & save remembered credential for pre-fill
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("id", id);
      if (emailOrMobile) {
        localStorage.setItem("rememberedUser", emailOrMobile);
      }

      console.log("💾 Data stored in localStorage");
      console.log("Role stored:", localStorage.getItem("role"));
      console.log("ID stored:", localStorage.getItem("id"));

      // Update Redux store
      dispatch(authActions.login());
      dispatch(authActions.changeRole(role));

      console.log("✅ Redux state updated with role:", role);

      // ✅ Dispatch login event to notify Footer and other components
      const loginEvent = new CustomEvent('userLoggedIn', {
        detail: {
          email: response.data.email,
          userId: id,
          role: role
        }
      });
      window.dispatchEvent(loginEvent);
      console.log("📢 Login: Dispatched userLoggedIn event");

      // Show success alert
      success(
        `Welcome back! Redirecting to your ${role === "admin" ? "admin panel" : "dashboard"}...`,
        "Login Successful"
      );

      // Force a small delay to ensure Redux state propagates
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Navigate based on role
      if (role === "admin") {
        console.log("🔀 Navigating to Admin Profile...");
        navigate("/Admin/profile", { replace: true });
      } else {
        console.log("🔀 Navigating to home...");
        navigate("/", { replace: true });
      }

    } catch (err) {
      console.error("❌ Login error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Invalid credentials or server error.";
      error(errorMessage, "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        info("Authenticating with Google...", "Please Wait");

        const response = await axios.post(`${API_URL}/google-auth`, {
          token: tokenResponse.access_token,
          rememberMe,
        });

        if (response.data.isNewUser) {
          // Need phone number
          setGoogleToken(tokenResponse.access_token);
          setShowPhoneModal(true);
          hideAlert();
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

          success(`Welcome back! Redirecting...`, "Login Successful");
          setTimeout(() => {
            if (role === "admin") navigate("/Admin/profile", { replace: true });
            else navigate("/", { replace: true });
          }, 1500);
        }
      } catch (err) {
        console.error("Google Auth Error:", err);
        error("Google Sign-In failed.", "Error");
      } finally {
        setLoading(false);
      }
    },
    onError: () => error("Google Sign-In failed", "Error")
  });

  const handleGoogleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!phone) {
      return error("Please enter your phone number", "Validation Error");
    }

    try {
      setLoading(true);
      info("Creating account...", "Please Wait");

      const response = await axios.post(`${API_URL}/google-signup`, {
        token: googleToken,
        phone: phone,
        rememberMe,
      });

      const { token, role, id } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("id", id);
      dispatch(authActions.login());
      dispatch(authActions.changeRole(role));

      success(`Account created successfully!`, "Welcome");
      setShowPhoneModal(false);

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Sign up failed.";
      error(errorMessage, "Error");
    } finally {
      setLoading(false);
    }
  };

  // Pre-fill remembered username/email on load
  useEffect(() => {
    const savedUser = localStorage.getItem("rememberedUser");
    if (savedUser) {
      setCredentials((prev) => ({ ...prev, emailOrMobile: savedUser }));
    }
  }, []);

  // Keep user logged in on reload
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("id");

    console.log("🔍 Login Page - Checking existing session...");
    console.log("Token exists:", !!token);
    console.log("Role:", role);
    console.log("ID:", id);

    if (token && role && id) {
      console.log("✅ Session found, user already logged in");
      dispatch(authActions.login());
      dispatch(authActions.changeRole(role));

      // Redirect if already logged in
      info("You're already logged in. Redirecting...", "Session Active");

      setTimeout(() => {
        if (role === "admin") {
          navigate("/Admin/profile", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }, 1500);
    }
  }, [dispatch, navigate, info]);

  return (
    <>
      {/* Alert Component */}
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          duration={alert.duration}
          position={alert.position}
          autoClose={alert.autoClose}
          onClose={hideAlert}
        />
      )}

      {/* Login Form */}
      <div className="min-h-[calc(100vh-90px)] bg-gradient-to-br from-gray-900 via-zinc-800 to-gray-900 flex items-center justify-center p-3 transition-all duration-500">
        <div className="bg-zinc-900 p-5 sm:p-6 rounded-2xl shadow-2xl w-full max-w-[350px] text-white border border-zinc-800 transition-all duration-300 hover:shadow-yellow-500/10">
          
          {/* Logo Header with Signature Yellow Brand Title */}
          <div className="flex flex-col items-center justify-center mb-4 space-y-1">
            <img src={logo} alt="BookBalcony" className="w-10 h-10 object-contain drop-shadow" />
            <span className="text-xl font-bold tracking-tight text-yellow-400">BookBalcony</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2.5" autoComplete="on">
            <input
              type="text"
              id="username"
              name="emailOrMobile"
              autoComplete="username"
              placeholder="Email or Mobile Number"
              value={credentials.emailOrMobile}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-transparent border border-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 transition-all duration-200 text-white"
            />

            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                autoComplete="current-password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                disabled={loading}
                className="w-full pl-3 pr-10 py-2 text-xs sm:text-sm rounded-xl bg-transparent border border-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 transition-all duration-200 text-white"
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

            {/* Cloudflare Turnstile Verification Widget */}
            <TurnstileWidget
              onSuccess={(token) => setTurnstileToken(token)}
              onExpire={() => setTurnstileToken("")}
            />

            {/* Primary Sign In Button (Theme Signature Yellow) */}
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
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Terms & Privacy Legal Statement */}
          <p className="text-[11px] text-zinc-400 text-center my-2.5 leading-tight">
            By continuing, you agree to <Link to="/terms" className="text-yellow-400 hover:underline hover:text-yellow-300">Terms</Link> & <Link to="/privacy" className="text-yellow-400 hover:underline hover:text-yellow-300">Privacy Policy</Link>.
          </p>

          {/* Links Row: Forgot Password & Sign Up */}
          <div className="flex items-center justify-between text-xs text-zinc-400 my-2 pt-1 border-t border-zinc-800">
            <Link to="/forgot-password" className="text-yellow-400 hover:underline hover:text-yellow-300 transition-colors">
              Forgot Password?
            </Link>
            <Link to="/account/signup" className="text-yellow-400 hover:underline hover:text-yellow-300 font-semibold transition-colors">
              Sign Up
            </Link>
          </div>

          {/* Social Auth Icons Section */}
          <div className="mt-3 pt-2">
            <p className="text-[11px] text-zinc-400 text-center mb-2">or you can sign in with</p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => loginWithGoogle()}
                disabled={loading}
                className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 hover:border-yellow-400/50 hover:bg-zinc-700 transition-all duration-200 flex items-center justify-center shadow-sm group active:scale-95 disabled:opacity-50"
                title="Sign in with Google"
              >
                <FcGoogle className="text-xl transition-transform group-hover:scale-110" />
              </button>
            </div>
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
    </>
  );
};

export default Login;