const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
require('dotenv').config();

const router = require("express").Router();
const User = require("../models/user");
const {authenticateToken} = require("./userAuth");
const Order = require('../models/order');

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
      amount: amount * 100, // convert to paisa
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

// 👉 Verify Payment & Save (Updated for new schema)
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      receipt,
      orderData // ✅ New field containing order details
    } = req.body;

    const userId = req.headers.id;
    const bookId = req.headers.bookid;

    // ✅ Verify Razorpay signature
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac('sha256', process.env.key_secret)
      .update(sign)
      .digest('hex');

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        message: 'Payment verification failed - Invalid signature' 
      });
    }

    console.log('✅ Payment signature verified successfully');

    // ✅ Save payment record
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
    console.log('✅ Payment record saved');

    // ✅ Create order with new schema structure
    try {
      // Get user details for fallback shipping address
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // ✅ Use orderData from frontend if available, otherwise create default
      let shippingAddress;
      if (orderData && orderData.shippingAddress) {
        shippingAddress = orderData.shippingAddress;
      } else {
        // ✅ Fallback shipping address from user profile or default
        shippingAddress = {
          fullName: user.username || user.name || "Customer Name",
          phone: user.phone || "9999999999",
          addressLine1: user.address || "Address not provided",
          addressLine2: user.landmark || "",
          city: user.city || "City not provided",
          state: user.state || "State not provided",
          postalCode: user.pincode || "000000",
          country: "India"
        };
      }

      // ✅ Create order with new schema
      const newOrder = await Order.create({
        user: userId,
        book: bookId.split(',')[0], // Take first book ID if multiple
        paymentMethod: 'RAZORPAY',
        paymentStatus: 'Success',
        orderStatus: 'Order Placed',
        amountPayable: amount,
        discount: orderData?.discount || 0,
        handlingFee: 0,
        shippingAddress: shippingAddress,
        paymentDetails: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          amount: amount,
          receipt: receipt
        }
      });

      console.log('✅ Order created successfully:', newOrder._id);

      res.status(200).json({ 
        success: true, 
        message: 'Payment verified and order created successfully',
        payment: payment,
        orderId: newOrder._id
      });

    } catch (orderError) {
      console.error('❌ Order creation failed:', orderError);
      
      // ✅ Payment was successful, but order creation failed
      // Return success for payment but indicate order creation issue
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully, but order creation failed',
        payment: payment,
        orderError: true,
        errorDetails: orderError.message,
        instructions: 'Your payment is safe. Our team will manually process your order within 2-4 hours.'
      });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Payment verification failed',
      error: error.message 
    });
  }
});

// ✅ New endpoint to handle manual order creation after payment success
router.post('/create-manual-order', authenticateToken, async (req, res) => {
  try {
    const {
      paymentId,
      bookId,
      amount,
      shippingAddress,
      discount = 0
    } = req.body;

    const userId = req.headers.id;

    // Verify payment exists
    const payment = await Payment.findOne({ razorpay_payment_id: paymentId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Check if order already exists for this payment
    const existingOrder = await Order.findOne({ 
      'paymentDetails.razorpay_payment_id': paymentId 
    });
    
    if (existingOrder) {
      return res.status(400).json({
        success: false,
        message: 'Order already exists for this payment',
        orderId: existingOrder._id
      });
    }

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || 
        !shippingAddress.addressLine1 || !shippingAddress.city || 
        !shippingAddress.state || !shippingAddress.postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required'
      });
    }

    // Create manual order
    const manualOrder = await Order.create({
      user: userId,
      book: bookId,
      paymentMethod: 'RAZORPAY',
      paymentStatus: 'Success',
      orderStatus: 'Order Placed',
      amountPayable: amount,
      discount: discount,
      handlingFee: 0,
      shippingAddress: shippingAddress,
      paymentDetails: {
        razorpay_order_id: payment.razorpay_order_id,
        razorpay_payment_id: payment.razorpay_payment_id,
        razorpay_signature: payment.razorpay_signature,
        amount: amount,
        receipt: payment.receipt
      }
    });

    res.status(201).json({
      success: true,
      message: 'Manual order created successfully',
      orderId: manualOrder._id
    });

  } catch (error) {
    console.error('Manual order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create manual order',
      error: error.message
    });
  }
});

// ✅ Endpoint to get payment and order status
router.get('/status/:paymentId', authenticateToken, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.headers.id;

    const payment = await Payment.findOne({ 
      razorpay_payment_id: paymentId,
      userId: userId 
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const order = await Order.findOne({ 
      'paymentDetails.razorpay_payment_id': paymentId,
      user: userId 
    }).populate('book');

    res.status(200).json({
      success: true,
      payment: {
        id: payment.razorpay_payment_id,
        amount: payment.amount,
        status: payment.status,
        createdAt: payment.createdAt
      },
      order: order ? {
        id: order._id,
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
        book: order.book,
        createdAt: order.createdAt
      } : null
    });

  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment status',
      error: error.message
    });
  }
});

module.exports = router;