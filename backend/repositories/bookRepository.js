const Book = require("../models/book");
const {
  invalidateBookCatalogCache,
  invalidateBookDetailCache,
  invalidateSellerStatsCache
} = require("../config/redis");

class BookRepository {
  async findBookById(bookId) {
    return await Book.findById(bookId);
  }

  async decrementStockAndIncreaseSold(bookId, quantity = 1) {
    // Atomic MongoDB conditional update guard (Pessimistic concurrency check)
    const updatedBook = await Book.findOneAndUpdate(
      { _id: bookId, stock: { $gte: quantity } },
      { $inc: { sold: quantity, stock: -quantity } },
      { new: true }
    );

    if (!updatedBook) {
      throw new Error("Item currently out of stock");
    }

    await invalidateBookCatalogCache();
    await invalidateBookDetailCache(bookId);

    return updatedBook;
  }

  async restoreStock(bookId, quantity = 1) {
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { $inc: { sold: -quantity, stock: quantity } },
      { new: true }
    );

    await invalidateBookCatalogCache();
    await invalidateBookDetailCache(bookId);

    return updatedBook;
  }

  async invalidateSellerStats(sellerId) {
    if (sellerId) {
      await invalidateSellerStatsCache(sellerId);
    }
  }
}

module.exports = new BookRepository();
