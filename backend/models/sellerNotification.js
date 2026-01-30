const mongoose = require("mongoose");

const sellerNotificationSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true
    },
    
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
      required: true
    },
    
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "books",
      required: true
    },
    
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    
    type: {
      type: String,
      enum: ["NEW_ORDER", "PAYMENT_SUCCESS", "PAYMENT_FAILED"],
      default: "NEW_ORDER"
    },
    
    amount: {
      type: Number,
      required: true
    },
    
    paymentMethod: {
      type: String,
      enum: ["COD", "RAZORPAY"],
      required: true
    },
    
    read: {
      type: Boolean,
      default: false
    },
    
    readAt: {
      type: Date
    }
  },
  { 
    timestamps: true 
  }
);

sellerNotificationSchema.index({ seller: 1, read: 1, createdAt: -1 });

module.exports = mongoose.models.sellerNotification || mongoose.model("sellerNotification", sellerNotificationSchema);