const { Redis } = require("@upstash/redis");
require("dotenv").config();

let redis = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    console.log("⚡ Upstash Redis client initialized successfully.");
  } else {
    console.warn("⚠️ Upstash Redis environment variables missing. Caching disabled.");
  }
} catch (error) {
  console.error("❌ Failed to initialize Upstash Redis:", error.message);
  redis = null;
}

/**
  Retrieve cached data by key. Returns null on cache miss or error.
 */
async function getCache(key) {
  if (!redis) return null;
  try {
    const data = await redis.get(key);
    if (data) {
      console.log(`⚡ Redis Cache HIT: [${key}]`);
      return typeof data === "string" ? JSON.parse(data) : data;
    }
    console.log(`💨 Redis Cache MISS: [${key}]`);
    return null;
  } catch (err) {
    console.error(`⚠️ Redis getCache error for key [${key}]:`, err.message);
    return null; // Graceful fallback to MongoDB
  }
}

/**
  Set cached data by key with time-to-live (ttlInSeconds).
 */
async function setCache(key, value, ttlInSeconds = 300) {
  if (!redis) return;
  try {
    const payload = typeof value === "string" ? value : JSON.stringify(value);
    await redis.set(key, payload, { ex: ttlInSeconds });
    console.log(`💾 Redis Cache SET: [${key}] (TTL: ${ttlInSeconds}s)`);
  } catch (err) {
    console.error(`⚠️ Redis setCache error for key [${key}]:`, err.message);
  }
}

/**
  Delete a single cache key.
 */
async function delCache(key) {
  if (!redis) return;
  try {
    await redis.del(key);
    console.log(`🧹 Redis Cache DELETED: [${key}]`);
  } catch (err) {
    console.error(`⚠️ Redis delCache error for key [${key}]:`, err.message);
  }
}

/**
  Invalidate all book catalog caches (call on Add, Update, Delete, or Status change).
 */
async function invalidateBookCatalogCache() {
  if (!redis) return;
  try {
    const catalogKeys = [
      "cache:books:all",
      "cache:books:recent",
      "cache:books:trending",
      "cache:books:editors",
    ];
    for (const key of catalogKeys) {
      await redis.del(key);
    }
    console.log("🧹 Redis: Invalidated all public book catalog caches");
  } catch (err) {
    console.error("⚠️ Redis invalidateBookCatalogCache error:", err.message);
  }
}

/**
  Invalidate single book detail cache.
 */
async function invalidateBookDetailCache(bookId) {
  if (!redis || !bookId) return;
  await delCache(`cache:book:${bookId}`);
}

/**
  Invalidate seller dashboard statistics cache.
 */
async function invalidateSellerStatsCache(sellerId) {
  if (!redis || !sellerId) return;
  await delCache(`cache:seller:stats:${sellerId}`);
}

module.exports = {
  redis,
  getCache,
  setCache,
  delCache,
  invalidateBookCatalogCache,
  invalidateBookDetailCache,
  invalidateSellerStatsCache,
};
