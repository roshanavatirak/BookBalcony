const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const User = require("../models/user");
const Seller = require("../models/seller");
const { authenticateToken } = require("./userAuth");

// ➕ POST: Add Book — Seller
router.post("/seller/add-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);

    if (!user || !user.isSeller) {
      return res
        .status(403)
        .json({ message: "Access denied: You are not a verified seller." });
    }

    const seller = await Seller.findOne({ user: user._id, status: "Approved" });

    if (!seller) {
      return res
        .status(403)
        .json({ message: "Access denied: Seller not approved." });
    }

    const {
      url,
      title,
      author,
      price,
      desc,
      language,
      category,
      editionOrPublishYear,
      stock,
    } = req.body;

    // Basic validation
    if (!url || !title || !author || !price || !desc || !language) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const newBook = new Book({
      url,
      title,
      author,
      price,
      desc,
      language,
      category: category || "General",
      editionOrPublishYear: editionOrPublishYear || "N/A",
      stock: stock || 1,
      seller: seller._id, // this refers to Seller collection
    });

    await newBook.save();

    return res.status(201).json({ message: "✅ Book added by seller successfully!" });
  } catch (error) {
    console.error("❌ Error during seller book addition:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete Book (Admin or Seller)
router.delete("/delete-book/:id", authenticateToken, async (req, res) => {
  try {
    const bookId = req.params.id;

    const deleted = await Book.findByIdAndDelete(bookId);

    if (!deleted) {
      return res.status(404).json({ message: "Book not found." });
    }

    return res.status(200).json({
      message: "✅ Book deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete book error:", error);
    return res.status(500).json({ message: "❌ Internal Server Error" });
  }
});

module.exports = router;
