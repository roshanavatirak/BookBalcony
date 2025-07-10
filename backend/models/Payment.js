const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  razorpay_order_id: {
    type: String,
    required: true
  },
  razorpay_payment_id: {
    type: String,
    required: true
  },
  razorpay_signature: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Success', 'Failed'],
    default: 'Success'
  },
  date: {
    type: Date,
    default: Date.now
  },
  receipt: {
    type: String
  },
  notes: {
    type: Object
  }
});

module.exports = mongoose.model('Payment', PaymentSchema);
