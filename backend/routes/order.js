const router = require("express").Router();
const { authenticateToken } = require("./userAuth");
const Order = require("../models/order");
const User = require("../models/user");
const Book = require("../models/book");
// // 📌 Place an order
// router.post("/place-order", authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.headers;
//     const { order, shippingAddress, amountPayable, discount, handlingFee } = req.body;

//     // Validate required fields
//     if (!shippingAddress || !amountPayable) {
//       return res.status(400).json({ 
//         message: "Shipping address and amount payable are required" 
//       });
//     }

//     // Validate shipping address fields
//     const requiredAddressFields = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'postalCode'];
//     for (const field of requiredAddressFields) {
//       if (!shippingAddress[field]) {
//         return res.status(400).json({ 
//           message: `Shipping address field '${field}' is required` 
//         });
//       }
//     }

//     const savedOrders = [];

//     for (const orderData of order) {
//       const newOrder = new Order({
//         user: id,
//         book: orderData.book || orderData._id,
//         orderStatus: orderData.orderStatus || "Order Placed",
//         paymentStatus: orderData.paymentStatus || "Pending",
//         paymentMethod: orderData.paymentMethod || "COD",
        
//         // ✅ Add the missing required fields
//         amountPayable: amountPayable,
//         shippingAddress: {
//           fullName: shippingAddress.fullName,
//           phone: shippingAddress.phone,
//           addressLine1: shippingAddress.addressLine1,
//           addressLine2: shippingAddress.addressLine2 || "",
//           city: shippingAddress.city,
//           state: shippingAddress.state,
//           postalCode: shippingAddress.postalCode,
//           country: shippingAddress.country || "India"
//         },
        
//         // ✅ Optional: Add discount and handling fee if your schema supports them
//         // discount: discount || 0,
//         // handlingFee: handlingFee || 0,
        
//         // ✅ Initialize tracking
//         currentLocation: "Warehouse",
//         trackingHistory: [{
//           status: "Order Placed",
//           location: "Warehouse",
//           date: new Date()
//         }]
//       });

//       const savedOrder = await newOrder.save();
//       savedOrders.push(savedOrder);

//       // ✅ Update user's orders and remove from cart
//       await User.findByIdAndUpdate(id, {
//         $push: { orders: savedOrder._id },
//         $pull: { cart: orderData.book || orderData._id },
//       });
//     }

//     return res.status(201).json({
//       status: "Success",
//       message: "Order Placed Successfully",
//       orders: savedOrders.map(order => ({
//         orderId: order._id,
//         orderStatus: order.orderStatus,
//         paymentStatus: order.paymentStatus,
//         amountPayable: order.amountPayable
//       }))
//     });

//   } catch (error) {
//     console.log("Place Order Error:", error);
    
//     // ✅ Better error handling
//     if (error.name === 'ValidationError') {
//       const validationErrors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({ 
//         message: "Validation failed", 
//         errors: validationErrors 
//       });
//     }
    
//     return res.status(500).json({ 
//       message: "An error occurred while placing the order",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });


// Place an order with seller notification
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order, shippingAddress, amountPayable, discount, handlingFee } = req.body;

    if (!shippingAddress || !amountPayable) {
      return res.status(400).json({ 
        message: "Shipping address and amount payable are required" 
      });
    }

    const requiredAddressFields = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'postalCode'];
    for (const field of requiredAddressFields) {
      if (!shippingAddress[field]) {
        return res.status(400).json({ 
          message: `Shipping address field '${field}' is required` 
        });
      }
    }

    const savedOrders = [];

    for (const orderData of order) {
      // Fetch book to get seller information
      const book = await Book.findById(orderData.book || orderData._id);
      
      if (!book) {
        return res.status(404).json({ 
          message: `Book not found: ${orderData.book || orderData._id}` 
        });
      }

      if (!book.seller) {
        return res.status(400).json({ 
          message: `Book does not have a seller assigned: ${book.title}` 
        });
      }

      // Calculate expected delivery date (7 days from now)
      const expectedDelivery = new Date();
      expectedDelivery.setDate(expectedDelivery.getDate() + 7);

      const newOrder = new Order({
        user: id,
        book: book._id,
        seller: book.seller, // ✅ Add seller from book
        orderStatus: orderData.orderStatus || "Order Placed",
        paymentStatus: orderData.paymentStatus || "Pending",
        paymentMethod: orderData.paymentMethod || "COD",
        amountPayable: amountPayable,
        discount: discount || 0,
        handlingFee: handlingFee || 0,
        shippingAddress: {
          fullName: shippingAddress.fullName,
          phone: shippingAddress.phone,
          addressLine1: shippingAddress.addressLine1,
          addressLine2: shippingAddress.addressLine2 || "",
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country || "India"
        },
        currentLocation: "Warehouse",
        expectedDeliveryDate: expectedDelivery,
        trackingHistory: [{
          status: "Order Placed",
          location: "Warehouse",
          date: new Date()
        }],
        sellerNotified: true,
        sellerNotificationDate: new Date()
      });

      const savedOrder = await newOrder.save();
      savedOrders.push(savedOrder);

      // Update user's orders and remove from cart
      await User.findByIdAndUpdate(id, {
        $push: { orders: savedOrder._id },
        $pull: { cart: book._id },
      });

      // ✅ Add order to seller's orders list
      await User.findByIdAndUpdate(book.seller, {
        $push: { orders: savedOrder._id }
      });

      // Update book stock and sold count
      await Book.findByIdAndUpdate(book._id, {
        $inc: { sold: 1, stock: -1 }
      });
    }

    return res.status(201).json({
      status: "Success",
      message: "Order Placed Successfully",
      orders: savedOrders.map(order => ({
        orderId: order._id,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        amountPayable: order.amountPayable,
        expectedDelivery: order.expectedDeliveryDate
      }))
    });

  } catch (error) {
    console.log("Place Order Error:", error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validationErrors 
      });
    }
    
    return res.status(500).json({ 
      message: "An error occurred while placing the order",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 📌 Get order history of user
router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { path: "book", select: "title desc price url" },
    });

    const ordersData = userData.orders.reverse();
    return res.json({
      status: "Success",
      data: ordersData,
    });
  } catch (error) {
    console.log("Order History Error:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// 📌 Get all orders (admin only)
router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        status: "Error",
        message: "Access denied. Admins only.",
      });
    }

    const allOrders = await Order.find()
      .populate("book")
      .populate("user")
      .sort({ createdAt: -1 });

    return res.json({
      status: "Success",
      data: allOrders,
    });
  } catch (error) {
    console.log("Get All Orders Error:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// 📌 Update order status (admin only)
router.put("/update-status/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    let { orderStatus } = req.body;

    // ✅ Admin check
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        status: "Error",
        message: "Access denied. Admins only.",
      });
    }

    const allowedStatuses = [
      "Order Placed",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!orderStatus || !allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        status: "Error",
        message: `Invalid status. Allowed: ${allowedStatuses.join(", ")}`,
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        status: "Error",
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      status: "Success",
      message: `Order status updated to '${orderStatus}'.`,
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error.",
    });
  }
});

// GET /api/v1/get-order-details/:orderId - Improved with better error handling
router.get('/get-order-details/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.headers.id;
    
    // Validate orderId format
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid order ID format" 
      });
    }
    
    // Validate userId
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        message: "User ID is required in headers" 
      });
    }
    
    console.log(`Fetching order details for orderId: ${orderId}, userId: ${userId}`);
    
    const order = await Order.findById(orderId)
      .populate({
        path: 'book',
        select: 'title desc price url author language'
      })
      .populate({
        path: 'user', 
        select: 'username email'
      })
      .lean(); // Use lean() for better performance
    
    if (!order) {
      console.log(`Order not found: ${orderId}`);
      return res.status(404).json({ 
        success: false,
        message: "Order not found" 
      });
    }
    
    // Ensure user owns this order or is admin
    if (order.user._id.toString() !== userId && req.user?.role !== 'admin') {
      console.log(`Access denied for user ${userId} to order ${orderId}`);
      return res.status(403).json({ 
        success: false,
        message: "Access denied - you can only view your own orders" 
      });
    }
    
    // Ensure tracking history exists
    if (!order.trackingHistory || order.trackingHistory.length === 0) {
      order.trackingHistory = [{
        status: order.orderStatus || "Order Placed",
        location: order.currentLocation || "Warehouse",
        date: order.createdAt || new Date()
      }];
    }
    
    console.log(`Order details fetched successfully for orderId: ${orderId}`);
    
    res.json({ 
      success: true, 
      data: order 
    });
    
  } catch (error) {
    console.error("Get Order Details Error:", error);
    
    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        message: "Invalid order ID format" 
      });
    }
    
    if (error.name === 'MongoNetworkError') {
      return res.status(503).json({ 
        success: false,
        message: "Database connection error" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Internal server error while fetching order details",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Additional helper route to validate order existence
router.get('/validate-order/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid order ID format" 
      });
    }
    
    const orderExists = await Order.exists({ _id: orderId });
    
    res.json({ 
      success: true,
      exists: !!orderExists 
    });
    
  } catch (error) {
    console.error("Validate Order Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error validating order" 
    });
  }
});

module.exports= router;