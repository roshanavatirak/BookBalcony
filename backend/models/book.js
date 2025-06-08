const mongoose = require("mongoose");

const book = new mongoose.Schema({
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

  // New field for tracking views to support trending feature
  views: {
    type: Number,
    default: 0,
  },

  // Optional: number of times the book was sold/downloaded/etc.
  sold: {
    type: Number,
    default: 0,
  },
},
{ timestamps: true });

module.exports = mongoose.model("books", book);
