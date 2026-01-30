// const Razorpay = require('razorpay');
// const crypto = require('crypto');
// const Payment = require('../models/Payment');
// require('dotenv').config();

// const router = require("express").Router();
// const User = require("../models/user");
// const {authenticateToken} = require("./userAuth");
// const Order = require('../models/order');

// // Initialize Razorpay instance
// const razorpay = new Razorpay({
//   key_id: process.env.key_id,
//   key_secret: process.env.key_secret
// });

// // 👉 Create Order
// router.post('/order', async (req, res) => {
//   try {
//     const { amount } = req.body;

//     const options = {
//       amount: amount * 100, // convert to paisa
//       currency: 'INR',
//       receipt: crypto.randomBytes(10).toString('hex')
//     };

//     const order = await razorpay.orders.create(options);
//     res.status(201).json({ success: true, order });
//   } catch (error) {
//     console.error('Order creation failed:', error);
//     res.status(500).json({ success: false, message: 'Order creation failed' });
//   }
// });

// // 👉 Verify Payment & Save (Updated for new schema)
// router.post('/verify', async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       amount,
//       receipt,
//       orderData // ✅ New field containing order details
//     } = req.body;

//     const userId = req.headers.id;
//     const bookId = req.headers.bookid;

//     // ✅ Verify Razorpay signature
//     const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
//     const expectedSign = crypto
//       .createHmac('sha256', process.env.key_secret)
//       .update(sign)
//       .digest('hex');

//     if (expectedSign !== razorpay_signature) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Payment verification failed - Invalid signature' 
//       });
//     }

//     console.log('✅ Payment signature verified successfully');

//     // ✅ Save payment record
//     const payment = new Payment({
//       userId,
//       amount,
//       currency: 'INR',
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       receipt,
//       status: 'Success'
//     });

//     await payment.save();
//     console.log('✅ Payment record saved');

//     // ✅ Create order with new schema structure
//     try {
//       // Get user details for fallback shipping address
//       const user = await User.findById(userId);
//       if (!user) {
//         throw new Error('User not found');
//       }

//       // ✅ Use orderData from frontend if available, otherwise create default
//       let shippingAddress;
//       if (orderData && orderData.shippingAddress) {
//         shippingAddress = orderData.shippingAddress;
//       } else {
//         // ✅ Fallback shipping address from user profile or default
//         shippingAddress = {
//           fullName: user.username || user.name || "Customer Name",
//           phone: user.phone || "9999999999",
//           addressLine1: user.address || "Address not provided",
//           addressLine2: user.landmark || "",
//           city: user.city || "City not provided",
//           state: user.state || "State not provided",
//           postalCode: user.pincode || "000000",
//           country: "India"
//         };
//       }

//       // ✅ Create order with new schema
//       const newOrder = await Order.create({
//         user: userId,
//         book: bookId.split(',')[0], // Take first book ID if multiple
//         paymentMethod: 'RAZORPAY',
//         paymentStatus: 'Success',
//         orderStatus: 'Order Placed',
//         amountPayable: amount,
//         discount: orderData?.discount || 0,
//         handlingFee: 0,
//         shippingAddress: shippingAddress,
//         paymentDetails: {
//           razorpay_order_id,
//           razorpay_payment_id,
//           razorpay_signature,
//           amount: amount,
//           receipt: receipt
//         }
//       });

//       console.log('✅ Order created successfully:', newOrder._id);

//       res.status(200).json({ 
//         success: true, 
//         message: 'Payment verified and order created successfully',
//         payment: payment,
//         orderId: newOrder._id
//       });

//     } catch (orderError) {
//       console.error('❌ Order creation failed:', orderError);
      
//       // ✅ Payment was successful, but order creation failed
//       // Return success for payment but indicate order creation issue
//       res.status(200).json({
//         success: true,
//         message: 'Payment verified successfully, but order creation failed',
//         payment: payment,
//         orderError: true,
//         errorDetails: orderError.message,
//         instructions: 'Your payment is safe. Our team will manually process your order within 2-4 hours.'
//       });
//     }

//   } catch (error) {
//     console.error('Payment verification error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Payment verification failed',
//       error: error.message 
//     });
//   }
// });

// // ✅ New endpoint to handle manual order creation after payment success
// router.post('/create-manual-order', authenticateToken, async (req, res) => {
//   try {
//     const {
//       paymentId,
//       bookId,
//       amount,
//       shippingAddress,
//       discount = 0
//     } = req.body;

//     const userId = req.headers.id;

//     // Verify payment exists
//     const payment = await Payment.findOne({ razorpay_payment_id: paymentId });
//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: 'Payment record not found'
//       });
//     }

//     // Check if order already exists for this payment
//     const existingOrder = await Order.findOne({ 
//       'paymentDetails.razorpay_payment_id': paymentId 
//     });
    
//     if (existingOrder) {
//       return res.status(400).json({
//         success: false,
//         message: 'Order already exists for this payment',
//         orderId: existingOrder._id
//       });
//     }

//     // Validate shipping address
//     if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || 
//         !shippingAddress.addressLine1 || !shippingAddress.city || 
//         !shippingAddress.state || !shippingAddress.postalCode) {
//       return res.status(400).json({
//         success: false,
//         message: 'Complete shipping address is required'
//       });
//     }

//     // Create manual order
//     const manualOrder = await Order.create({
//       user: userId,
//       book: bookId,
//       paymentMethod: 'RAZORPAY',
//       paymentStatus: 'Success',
//       orderStatus: 'Order Placed',
//       amountPayable: amount,
//       discount: discount,
//       handlingFee: 0,
//       shippingAddress: shippingAddress,
//       paymentDetails: {
//         razorpay_order_id: payment.razorpay_order_id,
//         razorpay_payment_id: payment.razorpay_payment_id,
//         razorpay_signature: payment.razorpay_signature,
//         amount: amount,
//         receipt: payment.receipt
//       }
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Manual order created successfully',
//       orderId: manualOrder._id
//     });

//   } catch (error) {
//     console.error('Manual order creation error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create manual order',
//       error: error.message
//     });
//   }
// });

// // ✅ Endpoint to get payment and order status
// router.get('/status/:paymentId', authenticateToken, async (req, res) => {
//   try {
//     const { paymentId } = req.params;
//     const userId = req.headers.id;

//     const payment = await Payment.findOne({ 
//       razorpay_payment_id: paymentId,
//       userId: userId 
//     });

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: 'Payment not found'
//       });
//     }

//     const order = await Order.findOne({ 
//       'paymentDetails.razorpay_payment_id': paymentId,
//       user: userId 
//     }).populate('book');

//     res.status(200).json({
//       success: true,
//       payment: {
//         id: payment.razorpay_payment_id,
//         amount: payment.amount,
//         status: payment.status,
//         createdAt: payment.createdAt
//       },
//       order: order ? {
//         id: order._id,
//         status: order.orderStatus,
//         paymentStatus: order.paymentStatus,
//         book: order.book,
//         createdAt: order.createdAt
//       } : null
//     });

//   } catch (error) {
//     console.error('Status check error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get payment status',
//       error: error.message
//     });
//   }
// });

// module.exports = router;
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
require('dotenv').config();

const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
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
    console.log("💰 [CREATE-ORDER] Received request:", req.body);
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // convert to paisa
      currency: 'INR',
      receipt: crypto.randomBytes(10).toString('hex')
    };

    console.log("💰 [CREATE-ORDER] Razorpay options:", options);
    const order = await razorpay.orders.create(options);
    console.log("✅ [CREATE-ORDER] Order created successfully:", order);
    
    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('❌ [CREATE-ORDER] Order creation failed:', error);
    res.status(500).json({ success: false, message: 'Order creation failed', error: error.message });
  }
});
router.post("/verify", authenticateToken, async (req, res) => {
  console.log("🔐 [VERIFY] ========== PAYMENT VERIFICATION STARTED ==========");
  console.log("🔐 [VERIFY] Request body:", JSON.stringify(req.body, null, 2));
  console.log("🔐 [VERIFY] Headers - userId:", req.headers.id);
  console.log("🔐 [VERIFY] Headers - bookId:", req.headers.bookid);

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

    // ✅ Step 1: Verify Razorpay Signature
    console.log("🔐 [VERIFY] Step 1: Verifying Razorpay signature...");
    console.log("🔐 [VERIFY] Using key_secret from env:", process.env.key_secret ? "✅ Found" : "❌ Missing");
    
    if (!process.env.key_secret) {
      console.error("❌ [VERIFY] RAZORPAY key_secret not found in environment variables!");
      return res.status(500).json({ 
        success: false, 
        message: "Server configuration error: Razorpay key_secret missing" 
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    console.log("🔐 [VERIFY] Generated signature:", generatedSignature);
    console.log("🔐 [VERIFY] Received signature:", razorpay_signature);

    if (generatedSignature !== razorpay_signature) {
      console.error("❌ [VERIFY] Invalid signature");
      return res.status(400).json({ 
        success: false, 
        message: "Invalid payment signature" 
      });
    }
    console.log("✅ [VERIFY] Payment signature verified successfully");

    // ✅ Step 2: Save Payment Record
    console.log("💾 [VERIFY] Step 2: Saving payment record...");
    const userId = req.headers.id;
    console.log("💾 [VERIFY] User ID for payment:", userId);
    
    const payment = new Payment({
      userId: userId, // ✅ CRITICAL FIX: Add userId field
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      receipt,
      status: "Success",
    });
    await payment.save();
    console.log("✅ [VERIFY] Payment record saved:", payment._id);

    // ✅ Step 3: Create Order(s)
    console.log("📦 [VERIFY] Step 3: Creating order(s)...");
    
    let createdOrders = [];
    let orderError = null;
    let errorDetails = null;

    try {
      if (isMultipleBooks && Array.isArray(orderData)) {
        // Multiple books - create multiple orders
        console.log(`📦 [VERIFY] Creating ${orderData.length} orders...`);
        
        for (let i = 0; i < orderData.length; i++) {
          const data = orderData[i];
          console.log(`📦 [VERIFY] Creating order ${i + 1}/${orderData.length}:`, {
            book: data.book,
            seller: data.seller,
            user: data.user,
            amount: data.amountPayable
          });
          
          // ✅ CRITICAL: Validate seller exists
          if (!data.seller) {
            throw new Error(`Order ${i + 1}: Missing seller information for book ${data.book}`);
          }
          
          const order = new Order({
            user: data.user,
            book: data.book,
            seller: data.seller,
            paymentMethod: data.paymentMethod,
            paymentStatus: "Success",
            orderStatus: data.orderStatus || "Order Placed",
            amountPayable: data.amountPayable,
            discount: data.discount || 0,
            handlingFee: data.handlingFee || 0,
            shippingAddress: data.shippingAddress,
            currentLocation: "Warehouse",
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
          });
          
          const savedOrder = await order.save();
          console.log(`✅ [VERIFY] Order ${i + 1} created:`, savedOrder._id);
          createdOrders.push(savedOrder);
          
          // ✅ CRITICAL FIX: Add order to user's orders array and remove from cart
          console.log(`📝 [VERIFY] Updating user ${data.user} orders array...`);
          await User.findByIdAndUpdate(data.user, {
            $push: { orders: savedOrder._id },
            $pull: { cart: data.book }
          });
          console.log(`✅ [VERIFY] User orders array updated`);
          
          // ✅ Add order to seller's orders array
          console.log(`📝 [VERIFY] Updating seller ${data.seller} orders array...`);
          await User.findByIdAndUpdate(data.seller, {
            $push: { orders: savedOrder._id }
          });
          console.log(`✅ [VERIFY] Seller orders array updated`);
          
          // ✅ Update book stock and sold count
          console.log(`📚 [VERIFY] Updating book ${data.book} stock...`);
          await Book.findByIdAndUpdate(data.book, {
            $inc: { sold: 1, stock: -1 }
          });
          console.log(`✅ [VERIFY] Book stock updated`);
        }
        
      } else {
        // Single book - create single order
        console.log("📦 [VERIFY] Creating single order...");
        const data = Array.isArray(orderData) ? orderData[0] : orderData;
        
        // ✅ CRITICAL: Validate seller exists
        if (!data.seller) {
          console.error("❌ [VERIFY] Missing seller in order data:", data);
          throw new Error(`Missing seller information for book ${data.book}`);
        }
        
        console.log("📦 [VERIFY] Order data:", {
          user: data.user,
          book: data.book,
          seller: data.seller,
          paymentMethod: data.paymentMethod,
          amountPayable: data.amountPayable
        });
        
        const order = new Order({
          user: data.user,
          book: data.book,
          seller: data.seller,
          paymentMethod: data.paymentMethod,
          paymentStatus: "Success",
          orderStatus: data.orderStatus || "Order Placed",
          amountPayable: data.amountPayable,
          discount: data.discount || 0,
          handlingFee: data.handlingFee || 0,
          shippingAddress: data.shippingAddress,
          currentLocation: "Warehouse",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        });
        
        const savedOrder = await order.save();
        console.log("✅ [VERIFY] Order created:", savedOrder._id);
        createdOrders.push(savedOrder);
        
        // ✅ CRITICAL FIX: Add order to user's orders array and remove from cart
        console.log(`📝 [VERIFY] Updating user ${data.user} orders array...`);
        await User.findByIdAndUpdate(data.user, {
          $push: { orders: savedOrder._id },
          $pull: { cart: data.book }
        });
        console.log(`✅ [VERIFY] User orders array updated`);
        
        // ✅ Add order to seller's orders array
        console.log(`📝 [VERIFY] Updating seller ${data.seller} orders array...`);
        await User.findByIdAndUpdate(data.seller, {
          $push: { orders: savedOrder._id }
        });
        console.log(`✅ [VERIFY] Seller orders array updated`);
        
        // ✅ Update book stock and sold count
        console.log(`📚 [VERIFY] Updating book ${data.book} stock...`);
        await Book.findByIdAndUpdate(data.book, {
          $inc: { sold: 1, stock: -1 }
        });
        console.log(`✅ [VERIFY] Book stock updated`);
      }
      
    } catch (err) {
      console.error("❌ [VERIFY] Order creation error:", err);
      console.error("❌ [VERIFY] Error stack:", err.stack);
      orderError = true;
      errorDetails = err.message;
    }

    // ✅ Step 4: Return Response
    if (orderError) {
      console.log("⚠️ [VERIFY] Payment verified but order creation failed");
      return res.json({
        success: true,
        message: "Payment verified but order creation failed",
        paymentId: payment._id,
        orderError: true,
        errorDetails: errorDetails,
      });
    } else {
      console.log("✅ [VERIFY] Everything successful!");
      console.log(`✅ [VERIFY] Created ${createdOrders.length} order(s)`);
      return res.json({
        success: true,
        message: "Payment verified and orders created successfully",
        paymentId: payment._id,
        orderId: createdOrders.length === 1 ? createdOrders[0]._id : undefined,
        orderIds: createdOrders.length > 1 ? createdOrders.map(o => o._id) : undefined,
        orderCount: createdOrders.length,
      });
    }
    
  } catch (error) {
    console.error("❌ [VERIFY] Fatal error:", error);
    console.error("❌ [VERIFY] Error stack:", error.stack);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
});

// ✅ Endpoint to handle manual order creation after payment success
router.post('/create-manual-order', authenticateToken, async (req, res) => {
  console.log("\n📦 [MANUAL-ORDER] ========== MANUAL ORDER CREATION STARTED ==========");
  
  try {
    const {
      paymentId,
      bookId,
      amount,
      shippingAddress,
      discount = 0
    } = req.body;

    const userId = req.headers.id;

    console.log("📦 [MANUAL-ORDER] Request body:", JSON.stringify(req.body, null, 2));
    console.log("📦 [MANUAL-ORDER] User ID:", userId);

    // Verify payment exists
    console.log("💳 [MANUAL-ORDER] Verifying payment exists...");
    const payment = await Payment.findOne({ razorpay_payment_id: paymentId });
    if (!payment) {
      console.error("❌ [MANUAL-ORDER] Payment not found");
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }
    console.log("✅ [MANUAL-ORDER] Payment found:", payment._id);

    // Check if order already exists for this payment
    console.log("🔍 [MANUAL-ORDER] Checking for existing order...");
    const existingOrder = await Order.findOne({ 
      razorpayPaymentId: paymentId 
    });
    
    if (existingOrder) {
      console.warn("⚠️ [MANUAL-ORDER] Order already exists:", existingOrder._id);
      return res.status(400).json({
        success: false,
        message: 'Order already exists for this payment',
        orderId: existingOrder._id
      });
    }
    console.log("✅ [MANUAL-ORDER] No existing order found");

    // ✅ Fetch book to get seller
    console.log("📚 [MANUAL-ORDER] Fetching book details...");
    const book = await Book.findById(bookId);
    if (!book) {
      console.error("❌ [MANUAL-ORDER] Book not found");
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    console.log("📚 [MANUAL-ORDER] Book found:", book.title);
    console.log("📚 [MANUAL-ORDER] Book seller:", book.seller);
    console.log("📚 [MANUAL-ORDER] Book addedby:", book.addedby);

    const sellerValue = book.seller || book.addedby;
    
    if (!sellerValue) {
      console.error("❌ [MANUAL-ORDER] Seller information missing");
      return res.status(400).json({
        success: false,
        message: 'Book seller information missing'
      });
    }

    // Validate shipping address
    console.log("📍 [MANUAL-ORDER] Validating shipping address...");
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || 
        !shippingAddress.addressLine1 || !shippingAddress.city || 
        !shippingAddress.state || !shippingAddress.postalCode) {
      console.error("❌ [MANUAL-ORDER] Incomplete shipping address");
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required'
      });
    }
    console.log("✅ [MANUAL-ORDER] Address validation passed");

    // Create manual order
    const orderPayload = {
      user: userId,
      book: bookId,
      seller: sellerValue, // ✅ CRITICAL: Include seller
      paymentMethod: 'RAZORPAY',
      paymentStatus: 'Success',
      orderStatus: 'Order Placed',
      amountPayable: amount,
      discount: discount,
      handlingFee: 0,
      shippingAddress: shippingAddress,
      razorpayOrderId: payment.razorpay_order_id,
      razorpayPaymentId: payment.razorpay_payment_id,
      razorpaySignature: payment.razorpay_signature,
    };

    console.log("📦 [MANUAL-ORDER] Creating order with payload:", JSON.stringify(orderPayload, null, 2));
    
    const manualOrder = await Order.create(orderPayload);

    console.log("✅ [MANUAL-ORDER] Order created successfully:", manualOrder._id);

    res.status(201).json({
      success: true,
      message: 'Manual order created successfully',
      orderId: manualOrder._id
    });

  } catch (error) {
    console.error('❌ [MANUAL-ORDER] Error:', error);
    console.error('❌ [MANUAL-ORDER] Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to create manual order',
      error: error.message
    });
  }
});

// ✅ Endpoint to get payment and order status
router.get('/status/:paymentId', authenticateToken, async (req, res) => {
  console.log("\n📊 [STATUS] ========== STATUS CHECK STARTED ==========");
  
  try {
    const { paymentId } = req.params;
    const userId = req.headers.id;

    console.log("📊 [STATUS] Payment ID:", paymentId);
    console.log("📊 [STATUS] User ID:", userId);

    const payment = await Payment.findOne({ 
      razorpay_payment_id: paymentId
    });

    if (!payment) {
      console.error("❌ [STATUS] Payment not found");
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    console.log("✅ [STATUS] Payment found:", payment._id);

    const order = await Order.findOne({ 
      razorpayPaymentId: paymentId,
      user: userId 
    }).populate('book');

    if (order) {
      console.log("✅ [STATUS] Order found:", order._id);
    } else {
      console.log("⚠️ [STATUS] No order found for this payment");
    }

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
    console.error('❌ [STATUS] Error:', error);
    console.error('❌ [STATUS] Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment status',
      error: error.message
    });
  }
});

module.exports = router;