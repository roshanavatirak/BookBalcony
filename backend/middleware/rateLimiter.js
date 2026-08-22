const rateLimit = require("express-rate-limit");

/**
 * Strict Rate Limiter for Authentication Endpoints (Sign-In, Sign-Up, Forgot-Password)
 * Limits per IP: Max 5 attempts every 15 minutes
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 auth requests per 15 mins per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts from this IP. Please try again after 15 minutes.",
  },
});

/**
 * Global Rate Limiter for general API Endpoints
 * Limits per IP: Max 150 requests per minute
 */
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 150, // Max 150 requests per min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
  },
});

module.exports = {
  authLimiter,
  apiLimiter,
};
