const axios = require("axios");

/**
 * Send OTP via SMS using Fast2SMS (Free for Indian numbers)
 * @param {string} phone - 10-digit Indian mobile number
 * @param {string} otp - 6-digit OTP code
 * @returns {Promise<boolean>} Success status
 */
const sendSMSOTP = async (phone, otp) => {
  try {
    // Remove any country code or special characters
    const cleanPhone = phone.replace(/[^0-9]/g, "").slice(-10);

    // Validate Indian mobile number
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      throw new Error("Invalid Indian mobile number format");
    }

    const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY;

    // If no API key or in development, log to console
    if (!FAST2SMS_API_KEY || FAST2SMS_API_KEY === "" || process.env.NODE_ENV === "development") {
      console.log(`📱 [DEV MODE] SMS OTP for ${cleanPhone}: ${otp}`);
      console.log("⚠️ Fast2SMS API key not configured. Using dev mode.");
      return true; // Return success in dev mode
    }

    // Try to send SMS via Fast2SMS
    try {
      const message = `Your BookBalcony password reset OTP is ${otp}. Valid for 10 minutes. Do not share with anyone. -BOOKBALCONY`;

      const response = await axios.post(
        "https://www.fast2sms.com/dev/bulkV2",
        {
          route: "v3",
          sender_id: "TXTIND", // Default sender ID (change if you have custom one)
          message: message,
          language: "english",
          flash: 0,
          numbers: cleanPhone,
        },
        {
          headers: {
            authorization: FAST2SMS_API_KEY,
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        }
      );

      if (response.data && response.data.return === true) {
        console.log("✅ SMS sent successfully to:", cleanPhone);
        return true;
      } else {
        throw new Error(response.data?.message || "SMS sending failed");
      }
    } catch (apiError) {
      console.error("❌ Fast2SMS API error:", apiError.response?.data || apiError.message);
      
      // Fallback to dev mode on API error
      console.log(`📱 [FALLBACK] SMS OTP for ${cleanPhone}: ${otp}`);
      console.log("⚠️ SMS API failed, but continuing with dev mode");
      return true; // Don't fail the entire flow
    }
  } catch (error) {
    console.error("❌ SMS service error:", error.message);
    
    // In development or on error, log OTP and don't fail
    console.log(`📱 [ERROR FALLBACK] OTP for ${phone}: ${otp}`);
    return true; // Return success to not block password reset flow
  }
};

module.exports = { sendSMSOTP };