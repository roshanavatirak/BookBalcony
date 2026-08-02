const router = require("express").Router();
const { authenticateToken } = require("./userAuth");
const User = require("../models/user");
const Book = require("../models/book");
const prisma = require("../conn/prisma");
const { sendOrderStatusEmail } = require("../services/emailService");
const {
  invalidateBookCatalogCache,
  invalidateBookDetailCache,
  invalidateSellerStatsCache,
} = require("../config/redis");

const orderSagaService = require("../services/orderSagaService");

// 📌 Place an order with Master Order & Multiple OrderItems (PostgreSQL Write Primary)
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const id = req.user?.id || req.headers.id;
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

    if (!Array.isArray(order) || order.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item" });
    }

    const cleanAddress = {
      fullName: shippingAddress.fullName,
      phone: shippingAddress.phone,
      addressLine1: shippingAddress.addressLine1,
      addressLine2: shippingAddress.addressLine2 || "",
      city: shippingAddress.city,
      state: shippingAddress.state,
      postalCode: shippingAddress.postalCode,
      country: shippingAddress.country || "India"
    };

    // Execute PlaceOrderSaga via Saga Orchestrator
    const createdOrders = await orderSagaService.placeOrder({
      userId: id,
      items: order,
      shippingAddress: cleanAddress,
      discount,
      handlingFee
    });

    return res.status(201).json({
      status: "Success",
      message: "Order Placed Successfully",
      orders: createdOrders.map(orderItem => ({
        orderId: orderItem.id,
        orderStatus: orderItem.orderStatus,
        paymentStatus: orderItem.paymentStatus,
        amountPayable: orderItem.amountPayable,
        expectedDelivery: orderItem.expectedDeliveryDate,
        itemsCount: orderItem.items ? orderItem.items.length : 1
      }))
    });

  } catch (error) {
    console.error("Place Order Error:", error);
    return res.status(500).json({ 
      message: error.message || "An error occurred while placing the order",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 📌 Get order history of user (PostgreSQL Read Replica + OrderItems)
router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const id = req.user?.id || req.headers.id;

    // Fetch user orders from PostgreSQL Read Replica
    const orders = await prisma.order.findMany({
      where: { userId: id.toString() },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });

    // Populate book data for UI
    const populatedOrders = await Promise.all(
      orders.map(async (o) => {
        const populatedItems = await Promise.all(
          (o.items || []).map(async (item) => {
            const itemBook = item.bookId ? await Book.findById(item.bookId).select("title desc price url author language") : null;
            return {
              ...item,
              book: itemBook
            };
          })
        );

        let mainBook = null;
        if (populatedItems.length > 0 && populatedItems[0].book) {
          mainBook = populatedItems[0].book;
        } else if (o.bookId) {
          mainBook = await Book.findById(o.bookId).select("title desc price url author language");
        }

        return {
          _id: o.id,
          id: o.id,
          book: mainBook || { title: "Book Unavailable", price: o.amountPayable, url: "" },
          items: populatedItems,
          paymentMethod: o.paymentMethod,
          paymentStatus: o.paymentStatus,
          orderStatus: o.orderStatus,
          amountPayable: o.amountPayable,
          shippingAddress: o.shippingAddress,
          trackingHistory: o.trackingHistory,
          createdAt: o.createdAt
        };
      })
    );

    return res.json({
      status: "Success",
      data: populatedOrders,
    });
  } catch (error) {
    console.error("Order History Error:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// 📌 Get all orders (admin only - PostgreSQL Read Replica)
router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        status: "Error",
        message: "Access denied. Admins only.",
      });
    }

    const allOrders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });

    const populatedOrders = await Promise.all(
      allOrders.map(async (o) => {
        const targetBookId = o.items && o.items.length > 0 ? o.items[0].bookId : o.bookId;
        const book = targetBookId ? await Book.findById(targetBookId) : null;
        const user = await User.findById(o.userId).select("username email");
        return {
          _id: o.id,
          id: o.id,
          book: book || null,
          user: user || null,
          items: o.items,
          paymentMethod: o.paymentMethod,
          paymentStatus: o.paymentStatus,
          orderStatus: o.orderStatus,
          amountPayable: o.amountPayable,
          shippingAddress: o.shippingAddress,
          createdAt: o.createdAt
        };
      })
    );

    return res.json({
      status: "Success",
      data: populatedOrders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// 📌 Update order status (admin only - PostgreSQL Write Primary)
router.put("/update-status/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    let { orderStatus } = req.body;

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        status: "Error",
        message: "Access denied. Admins only.",
      });
    }

    const allowedStatuses = [
      "Order Placed",
      "Processing",
      "Shipped",
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

    const existingOrder = await prisma.order.findFirst({
      where: { OR: [{ id: id }, { mongoId: id }] }
    });

    if (!existingOrder) {
      return res.status(404).json({
        status: "Error",
        message: "Order not found.",
      });
    }

    const updatedTracking = Array.isArray(existingOrder.trackingHistory)
      ? [...existingOrder.trackingHistory, { status: orderStatus, location: "Warehouse", date: new Date() }]
      : [{ status: orderStatus, location: "Warehouse", date: new Date() }];

    const updatedOrder = await prisma.order.update({
      where: { id: existingOrder.id },
      data: {
        orderStatus: orderStatus,
        trackingHistory: updatedTracking,
        ...(orderStatus === 'Delivered' ? { actualDeliveryDate: new Date(), paymentStatus: 'Success' } : {})
      },
      include: { items: true }
    });

    const user = await User.findById(existingOrder.userId);
    const book = await Book.findById(existingOrder.bookId);

    if (orderStatus === 'Out for Delivery' || orderStatus === 'Delivered') {
      sendOrderStatusEmail({ ...updatedOrder, user, book }, orderStatus).catch(err => 
        console.error("Failed to send status email in admin route:", err)
      );
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

// GET /api/v1/get-order-details/:orderId (PostgreSQL Read Replica + Items)
router.get('/get-order-details/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id || req.headers.id;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false,
        message: "User ID is required in headers" 
      });
    }
    
    const order = await prisma.order.findFirst({
      where: { OR: [{ id: orderId }, { mongoId: orderId }] },
      include: { items: true }
    });
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: "Order not found" 
      });
    }
    
    if (order.userId !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: "Access denied - you can only view your own orders" 
      });
    }
    
    const populatedItems = await Promise.all(
      (order.items || []).map(async (item) => {
        const itemBook = item.bookId ? await Book.findById(item.bookId).select("title desc price url author language") : null;
        return {
          ...item,
          book: itemBook
        };
      })
    );

    const targetBookId = order.items && order.items.length > 0 ? order.items[0].bookId : order.bookId;
    const mainBook = targetBookId ? await Book.findById(targetBookId).select("title desc price url author language") : null;
    const user = await User.findById(order.userId).select("username email");
    
    res.json({ 
      success: true, 
      data: {
        ...order,
        _id: order.id,
        book: mainBook,
        items: populatedItems,
        user
      } 
    });
    
  } catch (error) {
    console.error("Get Order Details Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error while fetching order details",
    });
  }
});

// 📌 Cancel Single Item inside an Order (PostgreSQL Write Primary)
router.put('/cancel-item/:orderId/:itemId', authenticateToken, async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const userId = req.user?.id || req.headers.id;

    const order = await prisma.order.findFirst({
      where: { OR: [{ id: orderId }, { mongoId: orderId }] },
      include: { items: true }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.userId !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const item = order.items.find(i => i.id === itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Order item not found" });
    }

    if (item.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: "Item is already cancelled" });
    }

    // 1. Mark item as Cancelled
    await prisma.orderItem.update({
      where: { id: itemId },
      data: { status: 'Cancelled' }
    });

    // Restore book stock in MongoDB
    if (item.bookId) {
      await Book.findByIdAndUpdate(item.bookId, {
        $inc: { sold: -item.quantity, stock: item.quantity }
      });
      await invalidateBookCatalogCache();
      await invalidateBookDetailCache(item.bookId);
    }

    // 2. Check if all items in this order are now cancelled
    const updatedOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: { items: true }
    });

    const activeItems = updatedOrder.items.filter(i => i.status !== 'Cancelled');
    const allCancelled = activeItems.length === 0;

    let finalOrderStatus = order.orderStatus;
    let finalPaymentStatus = order.paymentStatus;

    if (allCancelled) {
      finalOrderStatus = 'Cancelled';
      if (order.paymentMethod === 'RAZORPAY' && order.paymentStatus === 'Success') {
        finalPaymentStatus = 'Refund Pending';
      }

      const updatedTracking = Array.isArray(order.trackingHistory)
        ? [...order.trackingHistory, { status: "Cancelled", location: "Cancelled by user", date: new Date() }]
        : [{ status: "Cancelled", location: "Cancelled by user", date: new Date() }];

      await prisma.order.update({
        where: { id: order.id },
        data: {
          orderStatus: finalOrderStatus,
          paymentStatus: finalPaymentStatus,
          currentLocation: 'Cancelled',
          trackingHistory: updatedTracking
        }
      });
    }

    return res.json({
      success: true,
      message: allCancelled ? 'All items cancelled. Whole order cancelled.' : 'Item cancelled successfully',
      allCancelled,
      data: updatedOrder
    });

  } catch (error) {
    console.error("Cancel Item Error:", error);
    return res.status(500).json({ success: false, message: "Error cancelling item" });
  }
});

// 📌 Cancel Entire Order (PostgreSQL Write Primary)
router.put('/cancel-order/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id || req.headers.id;
    
    const order = await prisma.order.findFirst({
      where: { OR: [{ id: orderId }, { mongoId: orderId }] },
      include: { items: true }
    });
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }
    
    if (order.userId !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: "Access denied - you can only cancel your own orders" 
      });
    }
    
    const nonCancellableStatuses = ['Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (nonCancellableStatuses.includes(order.orderStatus)) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot cancel order. Order is already ${order.orderStatus}.` 
      });
    }
    
    // Mark all items as Cancelled
    await prisma.orderItem.updateMany({
      where: { orderId: order.id },
      data: { status: 'Cancelled' }
    });

    const updatedTracking = Array.isArray(order.trackingHistory)
      ? [...order.trackingHistory, { status: "Cancelled", location: "Cancelled by user", date: new Date() }]
      : [{ status: "Cancelled", location: "Cancelled by user", date: new Date() }];

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        orderStatus: 'Cancelled',
        currentLocation: 'Cancelled',
        trackingHistory: updatedTracking,
        ...(order.paymentMethod === 'RAZORPAY' && order.paymentStatus === 'Success' ? { paymentStatus: 'Refund Pending' } : {})
      },
      include: { items: true }
    });

    // Restore stock for all order items
    const itemsToRestore = order.items && order.items.length > 0 ? order.items : [{ bookId: order.bookId, quantity: 1 }];
    for (const item of itemsToRestore) {
      if (item.bookId) {
        await Book.findByIdAndUpdate(item.bookId, {
          $inc: { sold: -item.quantity, stock: item.quantity }
        });
        await invalidateBookCatalogCache();
        await invalidateBookDetailCache(item.bookId);
      }
    }
    
    res.json({ 
      success: true,
      message: 'Entire order cancelled successfully',
      data: updatedOrder
    });
    
  } catch (error) {
    console.error("Cancel Order Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error while cancelling order"
    });
  }
});

module.exports = router;