const prisma = require("../conn/prisma");

class OrderRepository {
  async createPayment(paymentData) {
    return await prisma.payment.create({
      data: {
        userId: paymentData.userId.toString(),
        amount: Number(paymentData.amount),
        currency: paymentData.currency || "INR",
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
        receipt: paymentData.receipt || null,
        status: paymentData.status || "Success"
      }
    });
  }

  async updatePaymentStatus(paymentId, status, orderId = null) {
    return await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        ...(orderId ? { orderId } : {})
      }
    });
  }

  async createOrder(orderData) {
    return await prisma.order.create({
      data: {
        userId: orderData.userId.toString(),
        bookId: orderData.bookId,
        sellerId: orderData.sellerId,
        orderStatus: orderData.orderStatus || "Order Placed",
        paymentStatus: orderData.paymentStatus || "Pending",
        paymentMethod: orderData.paymentMethod || "COD",
        amountPayable: Number(orderData.amountPayable),
        discount: Number(orderData.discount || 0),
        handlingFee: Number(orderData.handlingFee || 0),
        shippingAddress: orderData.shippingAddress,
        currentLocation: orderData.currentLocation || "Warehouse",
        expectedDeliveryDate: orderData.expectedDeliveryDate,
        trackingHistory: orderData.trackingHistory || [],
        razorpayOrderId: orderData.razorpayOrderId || null,
        razorpayPaymentId: orderData.razorpayPaymentId || null,
        razorpaySignature: orderData.razorpaySignature || null,
        sellerNotified: true,
        sellerNotificationDate: new Date(),
        items: {
          create: orderData.items.map(item => ({
            bookId: item.bookId,
            title: item.title,
            price: Number(item.price),
            quantity: Number(item.quantity || 1)
          }))
        }
      },
      include: { items: true }
    });
  }

  async deleteOrder(orderId) {
    // Delete items first then order
    await prisma.orderItem.deleteMany({ where: { orderId } });
    return await prisma.order.delete({ where: { id: orderId } });
  }

  async updateOrderStatus(orderId, orderStatus, trackingEntry = null) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return null;

    const trackingHistory = Array.isArray(order.trackingHistory) ? order.trackingHistory : [];
    if (trackingEntry) {
      trackingHistory.push(trackingEntry);
    }

    return await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus,
        trackingHistory,
        ...(orderStatus === "Delivered" ? { actualDeliveryDate: new Date(), paymentStatus: "Success" } : {})
      },
      include: { items: true }
    });
  }

  async findOrderById(orderId) {
    return await prisma.order.findFirst({
      where: { OR: [{ id: orderId }, { mongoId: orderId }] },
      include: { items: true }
    });
  }
}

module.exports = new OrderRepository();
