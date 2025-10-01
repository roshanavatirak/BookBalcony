const router = require("express").Router();
const { authenticateToken, authenticateSeller } = require("./userAuth");
const Order = require("../models/order");
const mongoose = require("mongoose");

// Get all orders for a specific seller
router.get("/seller/orders", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { status, paymentStatus, page = 1, limit = 10 } = req.query;

    // Build filter query
    const filter = { seller: id };
    
    if (status) {
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
        select: "title desc price url author language"
      })
      .populate({
        path: "user",
        select: "username email phone"
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalOrders = await Order.countDocuments(filter);

    // Calculate statistics
    const stats = await Order.aggregate([
      { $match: { seller: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: null,
          totalRevenue: { 
            $sum: { 
              $cond: [{ $eq: ["$paymentStatus", "Success"] }, "$amountPayable", 0] 
            } 
          },
          pendingPayments: { 
            $sum: { 
              $cond: [{ $eq: ["$paymentStatus", "Pending"] }, "$amountPayable", 0] 
            } 
          },
          totalOrders: { $sum: 1 },
          completedOrders: { 
            $sum: { 
              $cond: [{ $eq: ["$orderStatus", "Delivered"] }, 1, 0] 
            } 
          },
          pendingOrders: { 
            $sum: { 
              $cond: [
                { $in: ["$orderStatus", ["Order Placed", "Processing", "Shipped", "Out for Delivery"]] }, 
                1, 
                0
              ] 
            } 
          }
        }
      }
    ]);

    return res.json({
      status: "Success",
      data: {
        orders: orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalOrders / parseInt(limit)),
          totalOrders: totalOrders,
          limit: parseInt(limit)
        },
        statistics: stats[0] || {
          totalRevenue: 0,
          pendingPayments: 0,
          totalOrders: 0,
          completedOrders: 0,
          pendingOrders: 0
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
    });

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

    // If delivered, set actual delivery date
    if (orderStatus === "Delivered") {
      order.actualDeliveryDate = new Date();
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

module.exports = router;