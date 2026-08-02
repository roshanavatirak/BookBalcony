const Razorpay = require('razorpay');
const crypto = require('crypto');
const prisma = require("../conn/prisma");
require('dotenv').config();

const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const { authenticateToken } = require("./userAuth");
const {
  invalidateBookCatalogCache,
  invalidateBookDetailCache,
  invalidateSellerStatsCache,
} = require("../config/redis");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret
});

// 👉 Create Razorpay Order
router.post('/order', async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // convert to paisa
      currency: 'INR',
      receipt: crypto.randomBytes(10).toString('hex')
    };

    const order = await razorpay.orders.create(options);
    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('❌ [CREATE-ORDER] Order creation failed:', error);
    res.status(500).json({ success: false, message: 'Order creation failed', error: error.message });
  }
});

const paymentSagaService = require("../services/paymentSagaService");

// 👉 Verify Razorpay Payment & Save to PostgreSQL (Primary DB Write) - 1 Master Order with OrderItems
router.post("/verify", authenticateToken, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      receipt,
      orderData,
      isMultipleBooks
    } = req.body;

    if (!process.env.key_secret) {
      return res.status(500).json({ 
        success: false, 
        message: "Server configuration error: Razorpay key_secret missing" 
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid payment signature" 
      });
    }

    const userId = req.user?.id || req.headers.id;

    const ordersToProcess = Array.isArray(orderData)
      ? orderData
      : (orderData ? [orderData] : []);

    if (ordersToProcess.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items or data provided for verification"
      });
    }

    // Execute VerifyPaymentSaga via Saga Orchestrator
    const result = await paymentSagaService.verifyPaymentAndCreateOrders({
      userId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      receipt,
      ordersToProcess
    });

    return res.json({
      success: true,
      message: "Payment verified and orders created successfully",
      paymentId: result.payment.id,
      orderId: result.orders.length === 1 ? result.orders[0].id : undefined,
      orderIds: result.orders.length > 1 ? result.orders.map(o => o.id) : undefined,
      orderCount: result.orders.length,
    });

  } catch (error) {
    console.error("❌ Fatal payment verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
});

// 👉 Get Payment Status (PostgreSQL Read Replica)
router.get('/status/:paymentId', authenticateToken, async (req, res) => {
  try {
    const { paymentId } = req.params;

    // Query payment from PostgreSQL Read Replica
    const payment = await prisma.payment.findFirst({
      where: {
        OR: [
          { razorpay_payment_id: paymentId },
          { id: paymentId },
          { mongoId: paymentId }
        ]
      }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { razorpayPaymentId: payment.razorpay_payment_id },
          { id: payment.orderId || '' }
        ]
      },
      include: { items: true }
    });

    res.status(200).json({
      success: true,
      payment: {
        id: payment.razorpay_payment_id || payment.id,
        amount: payment.amount,
        status: payment.status,
        createdAt: payment.createdAt
      },
      order: order ? {
        id: order.id,
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
        itemsCount: order.items ? order.items.length : 1,
        createdAt: order.createdAt
      } : null
    });

  } catch (error) {
    console.error('❌ Status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment status',
      error: error.message
    });
  }
});

module.exports = router;