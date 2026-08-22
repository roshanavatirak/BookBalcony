const Book = require("../models/book");

class ViewBatcher {
  constructor() {
    // Map of bookId -> pending view count
    this.buffer = new Map();
    this.FLUSH_INTERVAL_MS = 60000; // 60 seconds
    this.MAX_BUFFER_SIZE = 50; // Flush early if total accumulated views reach 50
    this.totalBufferedCount = 0;
    this.timer = null;

    this.startInterval();
  }

  startInterval() {
    this.timer = setInterval(() => {
      this.flush().catch((err) =>
        console.error("⚠️ ViewBatcher flush error:", err.message)
      );
    }, this.FLUSH_INTERVAL_MS);

    // Prevent unref error in edge environments
    if (this.timer && typeof this.timer.unref === "function") {
      this.timer.unref();
    }
  }

  /**
   * Records a view for a book in memory buffer
   */
  recordView(bookId) {
    if (!bookId) return;
    const current = this.buffer.get(bookId) || 0;
    this.buffer.set(bookId, current + 1);
    this.totalBufferedCount += 1;

    if (this.totalBufferedCount >= this.MAX_BUFFER_SIZE) {
      setImmediate(() => {
        this.flush().catch((err) =>
          console.error("⚠️ ViewBatcher early flush error:", err.message)
        );
      });
    }
  }

  /**
   * Flushes all buffered view increments into MongoDB using bulkWrite
   */
  async flush() {
    if (this.buffer.size === 0) return;

    // Snapshot buffer and reset
    const snapshot = new Map(this.buffer);
    this.buffer.clear();
    this.totalBufferedCount = 0;

    const bulkOps = [];
    for (const [bookId, count] of snapshot.entries()) {
      bulkOps.push({
        updateOne: {
          filter: { _id: bookId },
          update: { $inc: { views: count } },
        },
      });
    }

    if (bulkOps.length > 0) {
      try {
        const result = await Book.bulkWrite(bulkOps, { ordered: false });
        console.log(
          `⚡ ViewBatcher flushed ${bulkOps.length} book view counters (${result.modifiedCount} updated).`
        );
      } catch (err) {
        console.error("❌ ViewBatcher bulkWrite error:", err.message);
        // Restore failed counts back to buffer
        for (const [bookId, count] of snapshot.entries()) {
          const current = this.buffer.get(bookId) || 0;
          this.buffer.set(bookId, current + count);
          this.totalBufferedCount += count;
        }
      }
    }
  }
}

const viewBatcher = new ViewBatcher();

// Flush remaining buffered views on process exit
process.on("SIGINT", async () => {
  await viewBatcher.flush();
});

process.on("SIGTERM", async () => {
  await viewBatcher.flush();
});

module.exports = viewBatcher;
