
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
require('dotenv').config();

const router = require("express").Router();
const User = require("../models/user");
const {authenticateToken} = require("./userAuth");
const Order = require('../models/order')


// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret
});

// 👉 Create Order
router.post('/order', async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount*100, // convert to paisa
      currency: 'INR',
      receipt: crypto.randomBytes(10).toString('hex')
    };

    const order = await razorpay.orders.create(options);
    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(500).json({ success: false, message: 'Order creation failed' });
  }
});

// 👉 Verify Payment & Save
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      receipt,
    } = req.body;

    const userId = req.headers.id;

    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac('sha256', process.env.key_secret)
      .update(sign)
      .digest('hex');

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    const payment = new Payment({
      userId,
      amount,
      currency: 'INR',
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      receipt,
      status: 'Success'
    });

    await payment.save();
await Order.create({
  userId,
  books: [{ bookId: req.headers.bookid, quantity: 1 }],
  totalPrice: amount,
  address: 'Online Paid Order - Address not required',
  paymentMode: 'Online',
  paymentStatus: "Success",
});
    res.status(200).json({ success: true, message: 'Payment verified & saved', payment });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
