const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    desc: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      required: true,
    },

    // Optional new fields (non-breaking)
    category: {
      type: String,
      default: "General", 
      required:true,// Optional default
    },

    editionOrPublishYear: {
      type: String,
      default: "N/A",
    },

    postedAt: {
      type: Date,
      default: Date.now, // Automatically captures posting time
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference to the user schema
    },

    stock: {
      type: Number,
      default: 1, // Total available quantity
    },

    views: {
      type: Number,
      default: 0,
    },

    sold: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("books", bookSchema);
