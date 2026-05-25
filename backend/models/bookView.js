const mongoose = require("mongoose");

const bookViewSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "books",
      required: true,
      index: true,
    },
    viewerId: {
      type: String,
      required: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound unique index for strict unique view deduplication at database level
bookViewSchema.index({ book: 1, viewerId: 1 }, { unique: true });

module.exports = mongoose.models.bookViews || mongoose.model("bookViews", bookViewSchema);
