// const router = require("express").Router();
// const { authenticateToken, authenticateSeller } = require("./userAuth");
// const Order = require("../models/order");
// const mongoose = require("mongoose");

// // Get all orders for a specific seller
// router.get("/seller/orders", authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.headers;
//     const { status, paymentStatus, page = 1, limit = 10 } = req.query;

//     // Build filter query
//     const filter = { seller: id };
    
//     if (status) {
//       filter.orderStatus = status;
//     }
    
//     if (paymentStatus) {
//       filter.paymentStatus = paymentStatus;
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     // Fetch orders with populated data
//     const orders = await Order.find(filter)
//       .populate({
//         path: "book",
//         select: "title desc price url author language"
//       })
//       .populate({
//         path: "user",
//         select: "username email phone"
//       })
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit));

//     const totalOrders = await Order.countDocuments(filter);

//     // Calculate statistics
//     const stats = await Order.aggregate([
//       { $match: { seller: new mongoose.Types.ObjectId(id) } },
//       {
//         $group: {
//           _id: null,
//           totalRevenue: { 
//             $sum: { 
//               $cond: [{ $eq: ["$paymentStatus", "Success"] }, "$amountPayable", 0] 
//             } 
//           },
//           pendingPayments: { 
//             $sum: { 
//               $cond: [{ $eq: ["$paymentStatus", "Pending"] }, "$amountPayable", 0] 
//             } 
//           },
//           totalOrders: { $sum: 1 },
//           completedOrders: { 
//             $sum: { 
//               $cond: [{ $eq: ["$orderStatus", "Delivered"] }, 1, 0] 
//             } 
//           },
//           pendingOrders: { 
//             $sum: { 
//               $cond: [
//                 { $in: ["$orderStatus", ["Order Placed", "Processing", "Shipped", "Out for Delivery"]] }, 
//                 1, 
//                 0
//               ] 
//             } 
//           }
//         }
//       }
//     ]);

//     return res.json({
//       status: "Success",
//       data: {
//         orders: orders,
//         pagination: {
//           currentPage: parseInt(page),
//           totalPages: Math.ceil(totalOrders / parseInt(limit)),
//           totalOrders: totalOrders,
//           limit: parseInt(limit)
//         },
//         statistics: stats[0] || {
//           totalRevenue: 0,
//           pendingPayments: 0,
//           totalOrders: 0,
//           completedOrders: 0,
//           pendingOrders: 0
//         }
//       }
//     });

//   } catch (error) {
//     console.error("Get Seller Orders Error:", error);
//     return res.status(500).json({ 
//       message: "An error occurred while fetching orders",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // Get specific order details for seller
// router.get("/seller/order/:orderId", authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.headers;
//     const { orderId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(orderId)) {
//       return res.status(400).json({ 
//         message: "Invalid order ID format" 
//       });
//     }

//     const order = await Order.findOne({ 
//       _id: orderId, 
//       seller: id 
//     })
//       .populate({
//         path: "book",
//         select: "title desc price url author language category"
//       })
//       .populate({
//         path: "user",
//         select: "username email"
//       });

//     if (!order) {
//       return res.status(404).json({ 
//         message: "Order not found or you don't have access to this order" 
//       });
//     }

//     return res.json({
//       status: "Success",
//       data: order
//     });

//   } catch (error) {
//     console.error("Get Seller Order Details Error:", error);
//     return res.status(500).json({ 
//       message: "An error occurred",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // Update order status (seller only)
// router.put("/seller/order/:orderId/status", authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.headers;
//     const { orderId } = req.params;
//     const { orderStatus, trackingLocation } = req.body;

//     const allowedStatuses = [
//       "Order Placed",
//       "Processing",
//       "Shipped",
//       "Out for Delivery",
//       "Delivered",
//       "Cancelled"
//     ];

//     if (!orderStatus || !allowedStatuses.includes(orderStatus)) {
//       return res.status(400).json({
//         message: `Invalid status. Allowed: ${allowedStatuses.join(", ")}`
//       });
//     }

//     const order = await Order.findOne({ 
//       _id: orderId, 
//       seller: id 
//     });

//     if (!order) {
//       return res.status(404).json({ 
//         message: "Order not found or you don't have access to this order" 
//       });
//     }

//     // Update order status
//     order.orderStatus = orderStatus;
    
//     if (trackingLocation) {
//       order.currentLocation = trackingLocation;
//     }

//     // Add to tracking history
//     order.trackingHistory.push({
//       status: orderStatus,
//       location: trackingLocation || order.currentLocation,
//       date: new Date()
//     });

//     // If delivered, set actual delivery date
//     if (orderStatus === "Delivered") {
//       order.actualDeliveryDate = new Date();
//     }

//     await order.save();

//     return res.json({
//       status: "Success",
//       message: `Order status updated to '${orderStatus}'`,
//       data: order
//     });

//   } catch (error) {
//     console.error("Update Order Status Error:", error);
//     return res.status(500).json({ 
//       message: "An error occurred",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // Get seller dashboard statistics
// router.get("/seller/dashboard-stats", authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.headers;

//     const stats = await Order.aggregate([
//       { $match: { seller: new mongoose.Types.ObjectId(id) } },
//       {
//         $facet: {
//           overview: [
//             {
//               $group: {
//                 _id: null,
//                 totalRevenue: { 
//                   $sum: { 
//                     $cond: [{ $eq: ["$paymentStatus", "Success"] }, "$amountPayable", 0] 
//                   } 
//                 },
//                 pendingRevenue: { 
//                   $sum: { 
//                     $cond: [{ $eq: ["$paymentStatus", "Pending"] }, "$amountPayable", 0] 
//                   } 
//                 },
//                 totalOrders: { $sum: 1 },
//                 codOrders: { 
//                   $sum: { 
//                     $cond: [{ $eq: ["$paymentMethod", "COD"] }, 1, 0] 
//                   } 
//                 },
//                 onlineOrders: { 
//                   $sum: { 
//                     $cond: [{ $eq: ["$paymentMethod", "RAZORPAY"] }, 1, 0] 
//                   } 
//                 }
//               }
//             }
//           ],
//           byStatus: [
//             {
//               $group: {
//                 _id: "$orderStatus",
//                 count: { $sum: 1 },
//                 totalAmount: { $sum: "$amountPayable" }
//               }
//             }
//           ],
//           recentOrders: [
//             { $sort: { createdAt: -1 } },
//             { $limit: 5 },
//             {
//               $lookup: {
//                 from: "books",
//                 localField: "book",
//                 foreignField: "_id",
//                 as: "bookDetails"
//               }
//             },
//             {
//               $lookup: {
//                 from: "users",
//                 localField: "user",
//                 foreignField: "_id",
//                 as: "userDetails"
//               }
//             },
//             {
//               $project: {
//                 orderStatus: 1,
//                 paymentStatus: 1,
//                 amountPayable: 1,
//                 createdAt: 1,
//                 "bookDetails.title": 1,
//                 "userDetails.username": 1,
//                 "shippingAddress.city": 1
//               }
//             }
//           ]
//         }
//       }
//     ]);

//     return res.json({
//       status: "Success",
//       data: {
//         overview: stats[0].overview[0] || {
//           totalRevenue: 0,
//           pendingRevenue: 0,
//           totalOrders: 0,
//           codOrders: 0,
//           onlineOrders: 0
//         },
//         ordersByStatus: stats[0].byStatus,
//         recentOrders: stats[0].recentOrders
//       }
//     });

//   } catch (error) {
//     console.error("Get Dashboard Stats Error:", error);
//     return res.status(500).json({ 
//       message: "An error occurred",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// module.exports = router;

const router = require("express").Router();
const { authenticateToken, authenticateSeller } = require("./userAuth");
const Order = require("../models/order");
const Book = require("../models/book");
const mongoose = require("mongoose");

// Get all orders for a specific seller
router.get("/seller/orders", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { status, paymentStatus, page = 1, limit = 10 } = req.query;

    // Build filter query
    const filter = { seller: id };
    
    if (status && status !== "all") {
      filter.orderStatus = status;
    }
    
    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch orders with populated data
    const orders = await Order.find(filter)
      .populate({
        path: "book",
        select: "title desc price url author language category"
      })
      .populate({
        path: "user",
        select: "username email phone"
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalOrders = await Order.countDocuments(filter);

    return res.json({
      status: "Success",
      data: {
        orders: orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalOrders / parseInt(limit)),
          totalOrders: totalOrders,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error("Get Seller Orders Error:", error);
    return res.status(500).json({ 
      message: "An error occurred while fetching orders",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get specific order details for seller
router.get("/seller/order/:orderId", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ 
        message: "Invalid order ID format" 
      });
    }

    const order = await Order.findOne({ 
      _id: orderId, 
      seller: id 
    })
      .populate({
        path: "book",
        select: "title desc price url author language category"
      })
      .populate({
        path: "user",
        select: "username email"
      });

    if (!order) {
      return res.status(404).json({ 
        message: "Order not found or you don't have access to this order" 
      });
    }

    return res.json({
      status: "Success",
      data: order
    });

  } catch (error) {
    console.error("Get Seller Order Details Error:", error);
    return res.status(500).json({ 
      message: "An error occurred",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update order status (seller only)
router.put("/seller/order/:orderId/status", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { orderId } = req.params;
    const { orderStatus, trackingLocation } = req.body;

    const allowedStatuses = [
      "Order Placed",
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled"
    ];

    if (!orderStatus || !allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        message: `Invalid status. Allowed: ${allowedStatuses.join(", ")}`
      });
    }

    const order = await Order.findOne({ 
      _id: orderId, 
      seller: id 
    }).populate('book');

    if (!order) {
      return res.status(404).json({ 
        message: "Order not found or you don't have access to this order" 
      });
    }

    // Update order status
    order.orderStatus = orderStatus;
    
    if (trackingLocation) {
      order.currentLocation = trackingLocation;
    }

    // Add to tracking history
    order.trackingHistory.push({
      status: orderStatus,
      location: trackingLocation || order.currentLocation,
      date: new Date()
    });

    // If delivered, set actual delivery date and update payment status for COD
    if (orderStatus === "Delivered") {
      order.actualDeliveryDate = new Date();
      if (order.paymentMethod === "COD" && order.paymentStatus === "Pending") {
        order.paymentStatus = "Success";
      }
    }

    await order.save();

    return res.json({
      status: "Success",
      message: `Order status updated to '${orderStatus}'`,
      data: order
    });

  } catch (error) {
    console.error("Update Order Status Error:", error);
    return res.status(500).json({ 
      message: "An error occurred",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Add tracking update
router.post("/seller/order/:orderId/tracking", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { orderId } = req.params;
    const { status, location } = req.body;

    if (!status || !location) {
      return res.status(400).json({
        message: "Status and location are required"
      });
    }

    const order = await Order.findOne({ 
      _id: orderId, 
      seller: id 
    }).populate('book');

    if (!order) {
      return res.status(404).json({ 
        message: "Order not found or you don't have access to this order" 
      });
    }

    // Update current location
    order.currentLocation = location;

    // Add to tracking history
    order.trackingHistory.push({
      status: status,
      location: location,
      date: new Date()
    });

    await order.save();

    return res.json({
      status: "Success",
      message: "Tracking update added successfully",
      data: {
        order: order
      }
    });

  } catch (error) {
    console.error("Add Tracking Update Error:", error);
    return res.status(500).json({ 
      message: "An error occurred",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get seller dashboard statistics
router.get("/seller/dashboard-stats", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const stats = await Order.aggregate([
      { $match: { seller: new mongoose.Types.ObjectId(id) } },
      {
        $facet: {
          overview: [
            {
              $group: {
                _id: null,
                totalRevenue: { 
                  $sum: { 
                    $cond: [{ $eq: ["$paymentStatus", "Success"] }, "$amountPayable", 0] 
                  } 
                },
                pendingRevenue: { 
                  $sum: { 
                    $cond: [{ $eq: ["$paymentStatus", "Pending"] }, "$amountPayable", 0] 
                  } 
                },
                totalOrders: { $sum: 1 },
                codOrders: { 
                  $sum: { 
                    $cond: [{ $eq: ["$paymentMethod", "COD"] }, 1, 0] 
                  } 
                },
                onlineOrders: { 
                  $sum: { 
                    $cond: [{ $eq: ["$paymentMethod", "RAZORPAY"] }, 1, 0] 
                  } 
                }
              }
            }
          ],
          byStatus: [
            {
              $group: {
                _id: "$orderStatus",
                count: { $sum: 1 },
                totalAmount: { $sum: "$amountPayable" }
              }
            }
          ],
          recentOrders: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            {
              $lookup: {
                from: "books",
                localField: "book",
                foreignField: "_id",
                as: "bookDetails"
              }
            },
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userDetails"
              }
            },
            {
              $project: {
                orderStatus: 1,
                paymentStatus: 1,
                amountPayable: 1,
                createdAt: 1,
                "bookDetails.title": 1,
                "userDetails.username": 1,
                "shippingAddress.city": 1
              }
            }
          ]
        }
      }
    ]);

    return res.json({
      status: "Success",
      data: {
        overview: stats[0].overview[0] || {
          totalRevenue: 0,
          pendingRevenue: 0,
          totalOrders: 0,
          codOrders: 0,
          onlineOrders: 0
        },
        ordersByStatus: stats[0].byStatus,
        recentOrders: stats[0].recentOrders
      }
    });

  } catch (error) {
    console.error("Get Dashboard Stats Error:", error);
    return res.status(500).json({ 
      message: "An error occurred",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get new order notifications for seller
router.get("/seller/new-order-notifications", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    // Find orders from last 24 hours that seller hasn't acknowledged
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const newOrders = await Order.find({
      seller: id,
      createdAt: { $gte: twentyFourHoursAgo },
      sellerNotified: true,
      sellerAcknowledged: { $ne: true }
    })
      .populate({
        path: "book",
        select: "title price url"
      })
      .sort({ createdAt: -1 })
      .limit(10);

    const notifications = newOrders.map(order => ({
      _id: order._id,
      orderId: order._id,
      book: order.book,
      amount: order.amountPayable,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt
    }));

    return res.json({
      status: "Success",
      data: {
        notifications: notifications
      }
    });

  } catch (error) {
    console.error("Get New Order Notifications Error:", error);
    return res.status(500).json({ 
      message: "An error occurred",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Mark notification as read
router.put("/seller/notification/:orderId/read", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { orderId } = req.params;

    const order = await Order.findOneAndUpdate(
      { _id: orderId, seller: id },
      { sellerAcknowledged: true },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ 
        message: "Order not found" 
      });
    }

    return res.json({
      status: "Success",
      message: "Notification marked as read"
    });

  } catch (error) {
    console.error("Mark Notification Read Error:", error);
    return res.status(500).json({ 
      message: "An error occurred",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get failed payment orders
router.get("/seller/failed-payment-orders", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const failedOrders = await Order.find({
      seller: id,
      paymentStatus: "Failed"
    })
      .populate({
        path: "book",
        select: "title price url"
      })
      .sort({ createdAt: -1 });

    return res.json({
      status: "Success",
      data: {
        orders: failedOrders
      }
    });

  } catch (error) {
    console.error("Get Failed Payment Orders Error:", error);
    return res.status(500).json({ 
      message: "An error occurred",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Handle failed order (re-upload or remove book)
router.put("/seller/handle-failed-order/:orderId", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { orderId } = req.params;
    const { action } = req.body; // 'reupload' or 'remove'

    const order = await Order.findOne({
      _id: orderId,
      seller: id,
      paymentStatus: "Failed"
    }).populate('book');

    if (!order) {
      return res.status(404).json({ 
        message: "Failed order not found" 
      });
    }

    if (action === 'reupload') {
      // Re-upload book stock
      await Book.findByIdAndUpdate(order.book._id, {
        $inc: { stock: 1, sold: -1 }
      });

      // Delete the failed order
      await Order.findByIdAndDelete(orderId);

      return res.json({
        status: "Success",
        message: "Book stock restored successfully"
      });

    } else if (action === 'remove') {
      // Just delete the failed order, don't restore stock
      await Order.findByIdAndDelete(orderId);

      return res.json({
        status: "Success",
        message: "Failed order removed"
      });

    } else {
      return res.status(400).json({
        message: "Invalid action. Use 'reupload' or 'remove'"
      });
    }

  } catch (error) {
    console.error("Handle Failed Order Error:", error);
    return res.status(500).json({ 
      message: "An error occurred",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;