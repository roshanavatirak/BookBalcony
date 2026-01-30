const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { sendEmailOTP } = require("../services/emailService");
const { sendSMSOTP } = require("../services/smsService");

// In-memory OTP storage (for production, use Redis)
const otpStore = new Map();

// OTP Configuration
const OTP_EXPIRY = 10 * 60 * 1000; // 10 minutes
const OTP_LENGTH = 6;
const MAX_OTP_ATTEMPTS = 5;

/**
 * Generate a random 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Clean up expired OTPs (runs every 5 minutes)
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(key);
      console.log(`🧹 Cleaned up expired OTP for: ${key}`);
    }
  }
}, 5 * 60 * 1000);

/**
 * STEP 1: Request OTP
 * POST /api/v1/forgot-password/request-otp
 * Body: { emailOrMobile: "user@example.com" or "9876543210" }
 */
const requestOTP = async (req, res) => {
  try {
    const { emailOrMobile } = req.body;

    if (!emailOrMobile) {
      return res.status(400).json({
        message: "Please provide email or mobile number",
      });
    }

    // Determine if it's email or mobile
    const isEmail = emailOrMobile.includes("@");
    const isMobile = /^[6-9]\d{9}$/.test(emailOrMobile.replace(/[^0-9]/g, ""));

    if (!isEmail && !isMobile) {
      return res.status(400).json({
        message: "Invalid email or mobile number format",
      });
    }

    // Find user by email or mobile
    let user;
    if (isEmail) {
      user = await User.findOne({ email: emailOrMobile });
    } else {
      const cleanPhone = emailOrMobile.replace(/[^0-9]/g, "").slice(-10);
      user = await User.findOne({ phone: cleanPhone });
    }

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email/mobile number",
      });
    }

    // Check if user is blocked
    if (user.blocked) {
      return res.status(403).json({
        message: "Your account has been blocked. Please contact support.",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + OTP_EXPIRY;

    // Store OTP with user identifier
    const otpKey = isEmail ? user.email : user.phone;
    otpStore.set(otpKey, {
      otp,
      expiresAt,
      attempts: 0,
      userId: user._id.toString(),
      type: isEmail ? "email" : "mobile",
    });

    console.log(`🔐 Generated OTP for ${otpKey}: ${otp} (Dev mode)`);

    // Send OTP via email or SMS
    try {
      if (isEmail) {
        await sendEmailOTP(user.email, otp);
        return res.status(200).json({
          message: "OTP sent to your email successfully",
          type: "email",
          maskedContact: user.email.replace(/(.{2})(.*)(@.*)/, "$1****$3"),
        });
      } else {
        await sendSMSOTP(user.phone, otp);
        return res.status(200).json({
          message: "OTP sent to your mobile number successfully",
          type: "mobile",
          maskedContact: user.phone.replace(/(\d{2})(\d{6})(\d{2})/, "$1******$3"),
        });
      }
    } catch (sendError) {
      // Clean up OTP if sending failed
      otpStore.delete(otpKey);
      console.error("Failed to send OTP:", sendError);
      return res.status(500).json({
        message: sendError.message || "Failed to send OTP. Please try again.",
      });
    }
  } catch (error) {
    console.error("❌ Request OTP error:", error);
    res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

/**
 * STEP 2: Verify OTP
 * POST /api/v1/forgot-password/verify-otp
 * Body: { emailOrMobile: "user@example.com", otp: "123456" }
 */
const verifyOTP = async (req, res) => {
  try {
    const { emailOrMobile, otp } = req.body;

    if (!emailOrMobile || !otp) {
      return res.status(400).json({
        message: "Please provide both email/mobile and OTP",
      });
    }

    // Determine contact type
    const isEmail = emailOrMobile.includes("@");
    const otpKey = isEmail
      ? emailOrMobile
      : emailOrMobile.replace(/[^0-9]/g, "").slice(-10);

    const otpData = otpStore.get(otpKey);

    if (!otpData) {
      return res.status(400).json({
        message: "OTP not found or expired. Please request a new OTP.",
      });
    }

    // Check expiry
    if (Date.now() > otpData.expiresAt) {
      otpStore.delete(otpKey);
      return res.status(400).json({
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // Check attempts
    if (otpData.attempts >= MAX_OTP_ATTEMPTS) {
      otpStore.delete(otpKey);
      return res.status(429).json({
        message: "Too many failed attempts. Please request a new OTP.",
      });
    }

    // Verify OTP
    if (otpData.otp !== otp.trim()) {
      otpData.attempts += 1;
      return res.status(400).json({
        message: `Invalid OTP. ${MAX_OTP_ATTEMPTS - otpData.attempts} attempts remaining.`,
      });
    }

    // OTP verified successfully - mark as verified
    otpData.verified = true;

    console.log(`✅ OTP verified for: ${otpKey}`);

    res.status(200).json({
      message: "OTP verified successfully. You can now reset your password.",
      verified: true,
    });
  } catch (error) {
    console.error("❌ Verify OTP error:", error);
    res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

/**
 * STEP 3: Reset Password
 * POST /api/v1/forgot-password/reset-password
 * Body: { emailOrMobile: "user@example.com", newPassword: "NewPass123" }
 */
const resetPassword = async (req, res) => {
  try {
    const { emailOrMobile, newPassword } = req.body;

    if (!emailOrMobile || !newPassword) {
      return res.status(400).json({
        message: "Please provide email/mobile and new password",
      });
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    // Determine contact type
    const isEmail = emailOrMobile.includes("@");
    const otpKey = isEmail
      ? emailOrMobile
      : emailOrMobile.replace(/[^0-9]/g, "").slice(-10);

    const otpData = otpStore.get(otpKey);

    if (!otpData) {
      return res.status(400).json({
        message: "Session expired. Please request a new OTP.",
      });
    }

    if (!otpData.verified) {
      return res.status(400).json({
        message: "Please verify OTP first",
      });
    }

    // Find user
    const user = await User.findById(otpData.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    // Clean up OTP data
    otpStore.delete(otpKey);

    console.log(`✅ Password reset successful for user: ${user._id}`);

    res.status(200).json({
      message: "Password reset successful! You can now login with your new password.",
      success: true,
    });
  } catch (error) {
    console.error("❌ Reset password error:", error);
    res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

/**
 * Resend OTP (Rate limited)
 * POST /api/v1/forgot-password/resend-otp
 */
const resendOTP = async (req, res) => {
  try {
    const { emailOrMobile } = req.body;

    if (!emailOrMobile) {
      return res.status(400).json({
        message: "Please provide email or mobile number",
      });
    }

    const isEmail = emailOrMobile.includes("@");
    const otpKey = isEmail
      ? emailOrMobile
      : emailOrMobile.replace(/[^0-9]/g, "").slice(-10);

    // Check if there's an existing valid OTP
    const existingOTP = otpStore.get(otpKey);
    if (existingOTP && Date.now() < existingOTP.expiresAt) {
      const timeRemaining = Math.ceil((existingOTP.expiresAt - Date.now()) / 1000 / 60);
      return res.status(429).json({
        message: `Please wait ${timeRemaining} minutes before requesting a new OTP`,
      });
    }

    // Call requestOTP to send new OTP
    return requestOTP(req, res);
  } catch (error) {
    console.error("❌ Resend OTP error:", error);
    res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = {
  requestOTP,
  verifyOTP,
  resetPassword,
  resendOTP,
};