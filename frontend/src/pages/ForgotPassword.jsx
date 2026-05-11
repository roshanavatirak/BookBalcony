import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/v1`;

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Step management
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Verify OTP, 3: Reset Password, 4: Success

  // Form data
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [autoLoginLoading, setAutoLoginLoading] = useState(false);

  // Timer for resend OTP
  const [resendTimer, setResendTimer] = useState(0);

  // Auto redirect countdown (only if user doesn't choose)
  const [redirectCountdown, setRedirectCountdown] = useState(10);

  // Auto redirect countdown effect
  useEffect(() => {
    if (step === 4 && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (step === 4 && redirectCountdown === 0) {
      // Auto logout after 10 seconds
      navigate("/signin");
    }
  }, [step, redirectCountdown, navigate]);

  // Start resend timer
  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // STEP 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!isValidEmail(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/forgot-password/request-otp`,
        { emailOrMobile: email.trim() }
      );

      setSuccess(response.data.message);
      setMaskedEmail(response.data.maskedContact);
      setStep(2);
      startResendTimer();

      console.log("✅ OTP sent successfully");
    } catch (err) {
      console.error("❌ Request OTP error:", err);
      
      if (err.response?.status === 404) {
        setError("No account found with this email address");
      } else if (err.response?.status === 403) {
        setError("Your account has been blocked. Please contact support.");
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || "Invalid email format");
      } else if (err.response?.status === 500) {
        setError("Failed to send OTP. Please check your email and try again.");
      } else {
        setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/forgot-password/verify-otp`,
        {
          emailOrMobile: email,
          otp: otp.trim(),
        }
      );

      setSuccess(response.data.message);
      setStep(3);

      console.log("✅ OTP verified successfully");
    } catch (err) {
      console.error("❌ Verify OTP error:", err);
      
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || "Invalid or expired OTP");
      } else if (err.response?.status === 429) {
        setError("Too many failed attempts. Please request a new OTP.");
      } else {
        setError(err.response?.data?.message || "Invalid OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/forgot-password/reset-password`,
        {
          emailOrMobile: email,
          newPassword,
        }
      );

      setSuccess(response.data.message);
      setStep(4);

      console.log("✅ Password reset successful");
    } catch (err) {
      console.error("❌ Reset password error:", err);
      
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || "Session expired. Please start again.");
      } else if (err.response?.status === 404) {
        setError("User not found. Please start again.");
      } else {
        setError(err.response?.data?.message || "Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/forgot-password/resend-otp`,
        { emailOrMobile: email }
      );

      setSuccess(response.data.message);
      startResendTimer();

      console.log("✅ OTP resent successfully");
    } catch (err) {
      console.error("❌ Resend OTP error:", err);
      
      if (err.response?.status === 429) {
        setError(err.response?.data?.message || "Please wait before requesting a new OTP");
      } else {
        setError(err.response?.data?.message || "Failed to resend OTP");
      }
    } finally {
      setLoading(false);
    }
  };

// Handle automatic login and stay logged in
const handleStayLoggedIn = async () => {
  try {
    setAutoLoginLoading(true);
    setError("");

    // Perform login with the new password
    const response = await axios.post(
      `${API_URL}/sign-in`,
      {
        emailOrMobile: email,
        password: newPassword,
      }
    );

    // Validate response
    if (response.data.success && response.data.id && response.data.token) {
      // Store auth data
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("isPremium", response.data.isPremium || false);
      localStorage.setItem("premiumType", response.data.premiumType || "free");
      
      console.log("✅ Auto-login successful, reloading...");

      // ✅ Force reload to update navbar
      // Redirect based on role with reload
      if (response.data.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else if (response.data.role === "seller" || response.data.isSeller) {
        window.location.href = "/seller/dashboard";
      } else {
        window.location.href = "/";
      }
    } else {
      throw new Error("Invalid login response structure");
    }
  } catch (err) {
    console.error("❌ Auto-login error:", err);
    
    const errorMsg = err.response?.data?.message || 
                     err.message || 
                     "Failed to log in automatically";
    
    setError(`${errorMsg}. Redirecting to login page...`);
    
    localStorage.clear();
    
    setTimeout(() => {
      navigate("/signin");
    }, 2000);
  } finally {
    setAutoLoginLoading(false);
  }
};

  // Handle logout (go to login page)
  const handleGoToLogin = () => {
    navigate("/signin");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-zinc-800 to-gray-900 flex items-center justify-center p-6"
    >
      <div className="bg-zinc-900 p-8 rounded-3xl shadow-lg w-full max-w-md text-white">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-yellow-400">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Reset Password"}
            {step === 4 && "Success!"}
          </h2>
          <p className="text-zinc-400 mt-2 text-sm">
            {step === 1 && "Enter your email address to receive OTP"}
            {step === 2 && `OTP sent to ${maskedEmail}`}
            {step === 3 && "Create a new password for your account"}
            {step === 4 && "Your password has been reset successfully"}
          </p>
        </div>

        {/* Progress Indicator */}
        {step !== 4 && (
          <div className="flex justify-center items-center mb-6 space-x-2">
            <div className={`h-2 w-12 rounded-full ${step >= 1 ? "bg-yellow-400" : "bg-zinc-700"}`}></div>
            <div className={`h-2 w-12 rounded-full ${step >= 2 ? "bg-yellow-400" : "bg-zinc-700"}`}></div>
            <div className={`h-2 w-12 rounded-full ${step >= 3 ? "bg-yellow-400" : "bg-zinc-700"}`}></div>
          </div>
        )}

        {/* Info Banner */}
        {step === 1 && (
          <div className="mb-4 bg-blue-900/30 border border-blue-700 rounded-lg p-3">
            <p className="text-xs text-blue-300 text-center">
              💡 <strong>Note:</strong> Mobile OTP service will be available soon. 
              Please use email for password reset.
            </p>
          </div>
        )}

        {/* Error/Success Messages */}
        {error && step !== 4 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-red-400 text-sm text-center bg-red-900/30 px-3 py-2 rounded border border-red-800"
          >
            {error}
          </motion.div>
        )}

        {success && step !== 4 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-green-400 text-sm text-center bg-green-900/30 px-3 py-2 rounded border border-green-800"
          >
            {success}
          </motion.div>
        )}

        {/* STEP 1: Request OTP */}
        {step === 1 && (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full p-3 rounded-md bg-transparent border border-zinc-700 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                autoComplete="email"
              />
              <p className="text-xs text-zinc-500 mt-1">
                We'll send a 6-digit OTP to your email
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-md hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2: Verify OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Enter 6-Digit OTP *
              </label>
              <input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                disabled={loading}
                maxLength={6}
                className="w-full p-3 rounded-md bg-transparent border border-zinc-700 text-center text-2xl tracking-widest placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                autoComplete="off"
              />
              <p className="text-xs text-zinc-500 mt-1 text-center">
                Check your email inbox (and spam folder)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-md hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="text-center">
              {resendTimer > 0 ? (
                <p className="text-zinc-400 text-sm">
                  Resend OTP in <span className="text-yellow-400 font-semibold">{resendTimer}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-yellow-400 text-sm hover:underline disabled:opacity-50"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp("");
                setError("");
                setSuccess("");
              }}
              className="w-full text-zinc-400 text-sm hover:text-white transition"
            >
              ← Back to Enter Email
            </button>
          </form>
        )}

        {/* STEP 3: Reset Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                New Password *
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                className="w-full p-3 rounded-md bg-transparent border border-zinc-700 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                autoComplete="new-password"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Minimum 6 characters
              </p>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="w-full p-3 rounded-md bg-transparent border border-zinc-700 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-md hover:bg-yellow-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* STEP 4: Success Screen */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Success Icon */}
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center"
              >
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
            </div>

            {/* Success Message */}
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-white">
                Password Reset Successful!
              </h3>
              <p className="text-zinc-400 text-sm">
                Your password has been changed successfully.
              </p>
            </div>

            {/* Question Banner */}
            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
              <p className="text-sm text-blue-200 text-center font-medium">
                Would you like to stay logged in or go to login page?
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleStayLoggedIn}
                disabled={autoLoginLoading}
                className="w-full bg-green-500 text-white font-semibold py-3 rounded-md hover:bg-green-600 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {autoLoginLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Stay Logged In & Continue</span>
                  </>
                )}
              </button>

              <button
                onClick={handleGoToLogin}
                disabled={autoLoginLoading}
                className="w-full bg-zinc-700 text-white font-semibold py-3 rounded-md hover:bg-zinc-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Go to Login Page</span>
              </button>

              <div className="text-center">
                <p className="text-xs text-zinc-500">
                  Auto-redirecting to login in <span className="text-yellow-400 font-semibold">{redirectCountdown}s</span>
                </p>
              </div>
            </div>

            {/* Security Tip */}
            <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-yellow-400 mb-1">
                    Security Tips
                  </h4>
                  <ul className="text-xs text-yellow-200/80 space-y-1">
                    <li>• Keep your password secure and private</li>
                    <li>• Use a strong, unique password</li>
                    <li>• Don't share your account with others</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        {step !== 4 && (
          <div className="mt-6 text-center">
            <Link to="/signin" className="text-zinc-400 hover:text-yellow-400 text-sm transition">
              ← Back to Login
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ForgotPassword;