const axios = require("axios");

// Cloudflare official testing keys for development fallback
const CLOUDFLARE_TEST_SECRET_KEY = "1x0000000000000000000000000000000AA";

/**
 * Middleware to verify Cloudflare Turnstile CAPTCHA tokens.
 */
async function verifyTurnstile(req, res, next) {
  try {
    // Enable optional bypass in development if TURNSTILE_BYPASS is set to "true"
    if (process.env.TURNSTILE_BYPASS === "true") {
      return next();
    }

    const { cfTurnstileToken } = req.body;

    if (!cfTurnstileToken) {
      return res.status(400).json({
        success: false,
        message: "Security verification required. Please complete the Turnstile check.",
      });
    }

    const secretKey =
      process.env.TURNSTILE_SECRET_KEY || CLOUDFLARE_TEST_SECRET_KEY;
    const clientIp = req.ip || req.connection.remoteAddress;

    // Send token verification request to Cloudflare API
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", cfTurnstileToken);
    if (clientIp) {
      formData.append("remoteip", clientIp);
    }

    const cfResponse = await axios.post(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 5000,
      }
    );

    if (cfResponse.data && cfResponse.data.success) {
      // Turnstile verification passed!
      return next();
    } else {
      console.warn("⚠️ Turnstile verification failed:", cfResponse.data);
      return res.status(400).json({
        success: false,
        message: "Security verification failed. Please refresh and try again.",
        errorCodes: cfResponse.data["error-codes"] || [],
      });
    }
  } catch (error) {
    console.error("❌ Cloudflare Turnstile verification error:", error.message);
    // In production, enforce strict failure. In dev with test keys, allow graceful failover.
    if (process.env.NODE_ENV === "development") {
      console.warn("⚠️ Turnstile check failed in DEV mode - bypassing for developer convenience.");
      return next();
    }
    return res.status(500).json({
      success: false,
      message: "Security verification service unavailable. Please try again.",
    });
  }
}

module.exports = verifyTurnstile;
