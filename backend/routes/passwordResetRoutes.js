const express = require("express");
const router = express.Router();
const verifyTurnstile = require("../middleware/turnstileMiddleware");
const { authLimiter } = require("../middleware/rateLimiter");
const {
  requestOTP,
  verifyOTP,
  resetPassword,
  resendOTP,
} = require("../controllers/passwordResetController");

/**
 * Password Reset Routes
 * Base path: /api/v1/forgot-password
 */

// STEP 1: Request OTP (via Email or SMS) - Secured with Turnstile & Auth Rate Limiter
router.post("/request-otp", authLimiter, verifyTurnstile, requestOTP);

// STEP 2: Verify OTP
router.post("/verify-otp", verifyOTP);

// STEP 3: Reset Password
router.post("/reset-password", resetPassword);

// Optional: Resend OTP
router.post("/resend-otp", resendOTP);

module.exports = router;