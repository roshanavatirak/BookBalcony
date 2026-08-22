const User = require("../models/user");
const { getCache, setCache, delCache } = require("../config/redis");

const AUTH_CACHE_TTL = 300; // 5 minutes TTL for Upstash Free tier efficiency

/**
 * Retrieve minimal user auth claims from Redis cache or MongoDB fallback.
 * @param {string} userId - User ID string
 * @returns {Promise<Object|null>} Minimal claims object or null if user not found
 */
async function getUserAuthClaims(userId) {
  if (!userId) return null;

  const cacheKey = `auth:u:${userId}`;

  // 1. Try fetching from Upstash Redis cache
  const cachedClaims = await getCache(cacheKey);
  if (cachedClaims) {
    return cachedClaims;
  }

  // 2. Fallback to MongoDB on cache miss or error
  const user = await User.findById(userId).select(
    "_id email role isSeller blocked tokenVersion premium"
  );

  if (!user) return null;

  const isPremiumActive = user.isPremiumActive ? user.isPremiumActive() : false;

  const claims = {
    id: user._id.toString(),
    _id: user._id.toString(),
    email: user.email,
    role: user.role || "user",
    isSeller: !!user.isSeller,
    blocked: !!user.blocked,
    tokenVersion: user.tokenVersion || 0,
    isPremium: isPremiumActive,
    premiumType: user.premium?.membershipType || "free",
    premiumExpiry: user.premium?.expiryDate || null,
  };

  // 3. Store minimal claims in Redis (300s TTL)
  await setCache(cacheKey, claims, AUTH_CACHE_TTL);

  return claims;
}

/**
 * Invalidate user auth cache in Redis (call when user is blocked, updated, role changed, or password reset).
 * @param {string} userId - User ID string
 */
async function invalidateUserAuthCache(userId) {
  if (!userId) return;
  const cacheKey = `auth:u:${userId}`;
  await delCache(cacheKey);
}

module.exports = {
  getUserAuthClaims,
  invalidateUserAuthCache,
};
