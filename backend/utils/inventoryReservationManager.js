const { getCache, setCache, delCache } = require("../config/redis");

// Fallback memory store if Redis is unavailable
const memoryReservations = new Map();

class InventoryReservationManager {
  /**
   * Generates Redis key for a reservation
   */
  getReservationKey(bookId, userId) {
    return `reservation:book:${bookId}:user:${userId}`;
  }

  /**
   * Atomically reserves stock for a user for 10 minutes (600 seconds)
   */
  async reserveStock(bookId, userId, quantity = 1, totalDbStock = 0, ttlSeconds = 600) {
    const reservedQty = await this.getReservedQuantity(bookId);
    const availableStock = totalDbStock - reservedQty;

    if (availableStock < quantity) {
      throw new Error("Item currently out of stock");
    }

    const key = this.getReservationKey(bookId, userId);
    await setCache(key, { quantity, reservedAt: Date.now() }, ttlSeconds);

    const totalKey = `reservation:total:${bookId}`;
    const currentTotal = (await getCache(totalKey)) || 0;
    await setCache(totalKey, Number(currentTotal) + quantity, ttlSeconds);

    // Track memory fallback
    memoryReservations.set(`${bookId}:${userId}`, {
      quantity,
      expiresAt: Date.now() + ttlSeconds * 1000
    });

    return true;
  }

  /**
   * Gets total active reserved quantity for a specific book across all users
   */
  async getReservedQuantity(bookId) {
    let totalReserved = 0;
    try {
      const totalVal = await getCache(`reservation:total:${bookId}`);
      if (totalVal !== null && totalVal !== undefined) {
        return Math.max(0, Number(totalVal));
      }
    } catch (err) {
      // Ignore and fallback to memory
    }

    // Fallback memory calculation
    const now = Date.now();
    for (const [key, val] of memoryReservations.entries()) {
      if (key.startsWith(`${bookId}:`)) {
        if (val.expiresAt > now) {
          totalReserved += val.quantity;
        } else {
          memoryReservations.delete(key);
        }
      }
    }
    return totalReserved;
  }

  /**
   * Releases an active stock reservation (e.g. after order placement or cancellation)
   */
  async releaseReservation(bookId, userId) {
    const key = this.getReservationKey(bookId, userId);
    const existing = await getCache(key);
    const qtyToRelease = existing?.quantity || 1;

    await delCache(key);

    try {
      const totalKey = `reservation:total:${bookId}`;
      const currentTotal = (await getCache(totalKey)) || 0;
      const newTotal = Math.max(0, Number(currentTotal) - qtyToRelease);
      if (newTotal > 0) {
        await setCache(totalKey, newTotal, 600);
      } else {
        await delCache(totalKey);
      }
    } catch (err) {
      // Ignore
    }

    memoryReservations.delete(`${bookId}:${userId}`);
  }

  /**
   * Calculates net available stock for public display
   */
  async getAvailableStock(bookId, totalDbStock) {
    const reserved = await this.getReservedQuantity(bookId);
    const available = Math.max(0, Number(totalDbStock) - reserved);
    return available;
  }
}

module.exports = new InventoryReservationManager();
