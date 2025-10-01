const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    price: { type: Number, required: true },
    desc: { type: String, required: true },
    url: { type: String, required: true },
    language: { type: String, required: true },
    category: { type: String, default: "General", required: true },
    editionOrPublishYear: { type: String, default: "N/A" },
    postedAt: { type: Date, default: Date.now },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    stock: { type: Number, default: 1 },
    views: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError during dev
module.exports = mongoose.models.books || mongoose.model("books", bookSchema);
