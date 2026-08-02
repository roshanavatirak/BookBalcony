require('dotenv').config();
const mongoose = require('mongoose');
const prisma = require('./conn/prisma');
const OrderMongo = require('./models/order');
const PaymentMongo = require('./models/Payment');

async function migrateData() {
  console.log("==========================================");
  console.log("🚀 STARTING MIGRATION: MONGODB -> POSTGRESQL");
  console.log("==========================================");

  try {
    await mongoose.connect(process.env.URI);
    console.log("✅ Connected to MongoDB Atlas.");

    // 1. Migrate Payments
    const mongoPayments = await PaymentMongo.find({});
    console.log(`\n💳 Found ${mongoPayments.length} payments in MongoDB.`);

    let migratedPayments = 0;
    for (const p of mongoPayments) {
      const existing = await prisma.payment.findUnique({
        where: { mongoId: p._id.toString() }
      });

      if (!existing) {
        await prisma.payment.create({
          data: {
            mongoId: p._id.toString(),
            userId: p.userId ? p.userId.toString() : (p.user ? p.user.toString() : "unknown_user"),
            amount: p.amount || 0,
            currency: p.currency || "INR",
            razorpay_order_id: p.razorpay_order_id || null,
            razorpay_payment_id: p.razorpay_payment_id || null,
            razorpay_signature: p.razorpay_signature || null,
            receipt: p.receipt || null,
            status: p.status || "Success",
            createdAt: p.createdAt || new Date(),
            updatedAt: p.updatedAt || new Date()
          }
        });
        migratedPayments++;
      }
    }
    console.log(`✅ Successfully migrated ${migratedPayments} new payments into PostgreSQL.`);

    // 2. Migrate Orders
    const mongoOrders = await OrderMongo.find({});
    console.log(`\n📦 Found ${mongoOrders.length} orders in MongoDB.`);

    let migratedOrders = 0;
    for (const rawOrder of mongoOrders) {
      const o = rawOrder.toObject();

      const existing = await prisma.order.findUnique({
        where: { mongoId: o._id.toString() }
      });

      if (!existing) {
        // Clean shipping address & tracking history of Mongoose prototype methods
        const cleanAddress = JSON.parse(JSON.stringify(o.shippingAddress || {}));
        const cleanTracking = JSON.parse(JSON.stringify(o.trackingHistory || []));

        const orderData = {
          mongoId: o._id.toString(),
          userId: o.user ? o.user.toString() : "unknown_user",
          bookId: o.book ? o.book.toString() : "unknown_book",
          sellerId: o.seller ? o.seller.toString() : "unknown_seller",
          paymentMethod: o.paymentMethod || "COD",
          paymentStatus: o.paymentStatus || "Pending",
          orderStatus: o.orderStatus || "Order Placed",
          amountPayable: o.amountPayable || 0,
          discount: o.discount || 0,
          handlingFee: o.handlingFee || 0,
          shippingAddress: cleanAddress,
          currentLocation: o.currentLocation || "Warehouse",
          expectedDeliveryDate: o.expectedDeliveryDate || null,
          actualDeliveryDate: o.actualDeliveryDate || null,
          sellerNotified: o.sellerNotified || false,
          sellerNotificationRead: o.sellerNotificationRead || false,
          sellerNotificationDate: o.sellerNotificationDate || null,
          trackingHistory: cleanTracking,
          razorpayOrderId: o.razorpayOrderId || null,
          razorpayPaymentId: o.razorpayPaymentId || null,
          razorpaySignature: o.razorpaySignature || null,
          createdAt: o.createdAt || new Date(),
          updatedAt: o.updatedAt || new Date()
        };

        await prisma.order.create({ data: orderData });
        migratedOrders++;
      }
    }

    console.log(`✅ Successfully migrated ${migratedOrders} new orders into PostgreSQL.`);

    console.log("\n==========================================");
    console.log("🎉 MIGRATION COMPLETED SUCCESSFULLY!");
    console.log("==========================================");

  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

migrateData();
