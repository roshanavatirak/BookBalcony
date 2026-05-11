const Order = require("../models/order");
const Book = require("../models/Book");
const Seller = require("../models/Seller");

// ============================================================
// HELPER
// ============================================================
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// ============================================================
// GET /api/v1/seller/dashboard-stats
// ============================================================
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.headers.id;

    const seller = await Seller.findOne({ user: userId }).select(
      "walletBalance totalEarned totalWithdrawn"
    );
    if (!seller) {
      return res.status(404).json({ message: "Seller profile not found" });
    }

    // Pending revenue = sum of amountPayable for in-transit orders
    const pendingStatuses = ["Order Placed", "Processing", "Shipped", "Out for Delivery"];
    const pendingAgg = await Order.aggregate([
      {
        $match: {
          seller: seller._id,
          orderStatus: { $in: pendingStatuses },
        },
      },
      { $group: { _id: null, total: { $sum: "$amountPayable" } } },
    ]);
    const pendingRevenue = pendingAgg[0]?.total || 0;

    const totalOrders = await Order.countDocuments({ seller: seller._id });

    return res.status(200).json({
      message: "Dashboard stats fetched",
      data: {
        overview: {
          totalRevenue: seller.totalEarned,       // lifetime from delivered orders
          walletBalance: seller.walletBalance,    // available to withdraw
          pendingRevenue,                         // in-transit orders not yet paid out
          totalWithdrawn: seller.totalWithdrawn,
          totalOrders,
        },
      },
    });
  } catch (err) {
    console.error("getDashboardStats error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ============================================================
// GET /api/v1/seller/orders?page=1&limit=10
// ============================================================
const getSellerOrders = async (req, res) => {
  try {
    const userId = req.headers.id;
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;

    const seller = await Seller.findOne({ user: userId }).select("_id");
    if (!seller) {
      return res.status(404).json({ message: "Seller profile not found" });
    }

    const [orders, total] = await Promise.all([
      Order.find({ seller: seller._id })
        .populate("book", "title url price author")
        .populate("user", "username email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments({ seller: seller._id }),
    ]);

    return res.status(200).json({
      message: "Orders fetched",
      data: {
        orders,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    console.error("getSellerOrders error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ============================================================
// PUT /api/v1/seller/orders/:orderId/status
// Core wallet-credit logic lives here.
//
// Rule: when orderStatus transitions INTO "Delivered" for the
// first time → amountPayable is credited to the seller's
// walletBalance AND totalEarned.
// ============================================================
const updateOrderStatus = async (req, res) => {
  try {
    const userId    = req.headers.id;
    const { orderId } = req.params;
    const { status }  = req.body;

    if (!isValidObjectId(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const validStatuses = [
      "Order Placed",
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed: ${validStatuses.join(", ")}`,
      });
    }

    // Find seller profile (need seller._id to match order.seller field)
    const seller = await Seller.findOne({ user: userId });
    if (!seller) {
      return res.status(404).json({ message: "Seller profile not found" });
    }

    // Find order and confirm it belongs to this seller
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.seller.toString() !== seller._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: this order is not yours" });
    }

    const previousStatus = order.orderStatus;

    // ── WALLET CREDIT ────────────────────────────────────────
    if (status === "Delivered" && previousStatus !== "Delivered") {
      // Credit seller wallet
      await Seller.findByIdAndUpdate(seller._id, {
        $inc: {
          walletBalance: order.amountPayable,
          totalEarned:   order.amountPayable,
        },
      });

      // Mark COD payment as Success on delivery
      if (order.paymentMethod === "COD" && order.paymentStatus === "Pending") {
        order.paymentStatus = "Success";
      }
      order.actualDeliveryDate = new Date();
    }

    // Edge-case: delivered → cancelled  →  reverse the credit
    if (status === "Cancelled" && previousStatus === "Delivered") {
      await Seller.findByIdAndUpdate(seller._id, {
        $inc: {
          walletBalance: -order.amountPayable,
          totalEarned:   -order.amountPayable,
        },
      });
    }
    // ─────────────────────────────────────────────────────────

    // Append tracking history entry
    order.trackingHistory.push({
      status,
      location: order.currentLocation || "Warehouse",
      date: new Date(),
    });

    order.orderStatus = status;
    await order.save();

    return res.status(200).json({
      message: `Order status updated to '${status}'`,
      data: {
        orderId,
        status,
        walletCredited:
          status === "Delivered" && previousStatus !== "Delivered"
            ? order.amountPayable
            : 0,
      },
    });
  } catch (err) {
    console.error("updateOrderStatus error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ============================================================
// GET /api/v1/seller/myproducts
// ============================================================
const getMyProducts = async (req, res) => {
  try {
    const userId = req.headers.id;

    // Book.seller stores the user ObjectId directly (see book schema)
    const books = await Book.find({ seller: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Products fetched",
      books,
    });
  } catch (err) {
    console.error("getMyProducts error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ============================================================
// GET /api/v1/seller/new-order-notifications
// Returns unread new orders (sellerNotificationRead = false)
// and marks them as read.
// ============================================================
const getNewOrderNotifications = async (req, res) => {
  try {
    const userId = req.headers.id;

    const seller = await Seller.findOne({ user: userId }).select("_id");
    if (!seller) {
      return res.status(404).json({ message: "Seller profile not found" });
    }

    const notifications = await Order.find({
      seller: seller._id,
      sellerNotificationRead: false,
    })
      .populate("book", "title url price")
      .sort({ createdAt: -1 })
      .limit(20);

    // Mark fetched notifications as read
    await Order.updateMany(
      { seller: seller._id, sellerNotificationRead: false },
      { $set: { sellerNotificationRead: true } }
    );

    return res.status(200).json({
      message: "Notifications fetched",
      data: {
        notifications: notifications.map((n) => ({
          _id: n._id,
          book: n.book,
          amount: n.amountPayable,
          orderStatus: n.orderStatus,
          createdAt: n.createdAt,
        })),
      },
    });
  } catch (err) {
    console.error("getNewOrderNotifications error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ============================================================
// POST /api/v1/seller/withdraw
// ============================================================
const requestWithdrawal = async (req, res) => {
  try {
    const userId = req.headers.id;
    const { amount } = req.body;

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ message: "Enter a valid withdrawal amount" });
    }

    const seller = await Seller.findOne({ user: userId });
    if (!seller) {
      return res.status(404).json({ message: "Seller profile not found" });
    }

    if (seller.walletBalance < Number(amount)) {
      return res.status(400).json({
        message: `Insufficient balance. Available: ₹${seller.walletBalance}`,
      });
    }

    seller.walletBalance  -= Number(amount);
    seller.totalWithdrawn += Number(amount);
    await seller.save();

    // TODO: trigger bank transfer / Razorpay payout here

    return res.status(200).json({
      message: "Withdrawal processed successfully",
      data: {
        withdrawn:        Number(amount),
        newWalletBalance: seller.walletBalance,
        totalWithdrawn:   seller.totalWithdrawn,
      },
    });
  } catch (err) {
    console.error("requestWithdrawal error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getDashboardStats,
  getSellerOrders,
  updateOrderStatus,
  getMyProducts,
  getNewOrderNotifications,
  requestWithdrawal,
};