const SagaOrchestrator = require("../utils/sagaOrchestrator");
const orderRepository = require("../repositories/orderRepository");
const bookRepository = require("../repositories/bookRepository");
const userRepository = require("../repositories/userRepository");
const inventoryReservationManager = require("../utils/inventoryReservationManager");

class PaymentSagaService {
  /**
   * Orchestrates Razorpay payment verification, order creation, and stock updates with rollbacks
   */
  async verifyPaymentAndCreateOrders({
    userId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount,
    receipt,
    ordersToProcess
  }) {
    const saga = new SagaOrchestrator("VerifyPaymentSaga");

    // 1. Create Payment record in PostgreSQL (Prisma)
    saga.addStep(
      "Create PostgreSQL Payment Record",
      async (ctx) => {
        const payment = await orderRepository.createPayment({
          userId,
          amount,
          currency: "INR",
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          receipt,
          status: "Success"
        });

        ctx.payment = payment;
        return { payment };
      },
      async (ctx) => {
        if (ctx.payment) {
          console.log(`    Marking payment ${ctx.payment.id} as Refund Pending...`);
          await orderRepository.updatePaymentStatus(ctx.payment.id, "Refund Pending");
        }
      }
    );

    // 2. Group items by seller and create PostgreSQL Orders
    saga.addStep(
      "Group Sellers & Create Orders",
      async (ctx) => {
        const sellerGroups = {};

        for (const data of ordersToProcess) {
          const targetBookId = (data.book || data.bookId || data._id)?.toString();
          if (!targetBookId) continue;

          let sellerId = data.seller?.toString();
          if (!sellerId) {
            const book = await bookRepository.findBookById(targetBookId);
            sellerId = (book?.seller || book?.addedby)?.toString() || userId.toString();
          }

          if (!sellerGroups[sellerId]) {
            sellerGroups[sellerId] = [];
          }

          sellerGroups[sellerId].push({
            bookId: targetBookId,
            title: data.title || "Book",
            price: Number(data.amountPayable || data.price || amount),
            quantity: Number(data.quantity || 1),
            rawData: data
          });
        }

        const expectedDelivery = new Date();
        expectedDelivery.setDate(expectedDelivery.getDate() + 7);

        const createdOrders = [];

        for (const [sellerId, items] of Object.entries(sellerGroups)) {
          const firstData = items[0].rawData || {};
          const cleanAddress = JSON.parse(JSON.stringify(firstData.shippingAddress || {}));
          const initialTracking = [{ status: "Order Placed", location: "Warehouse", date: new Date() }];
          const sellerSubtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

          const newOrder = await orderRepository.createOrder({
            userId,
            bookId: items[0].bookId,
            sellerId,
            paymentMethod: firstData.paymentMethod || "RAZORPAY",
            paymentStatus: "Success",
            orderStatus: firstData.orderStatus || "Order Placed",
            amountPayable: sellerSubtotal,
            discount: Number(firstData.discount || 0),
            handlingFee: Number(firstData.handlingFee || 0),
            shippingAddress: cleanAddress,
            currentLocation: "Warehouse",
            expectedDeliveryDate: expectedDelivery,
            trackingHistory: initialTracking,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            items
          });

          await orderRepository.updatePaymentStatus(ctx.payment.id, "Success", newOrder.id);
          createdOrders.push(newOrder);
        }

        ctx.sellerGroups = sellerGroups;
        ctx.createdOrders = createdOrders;
        return { sellerGroups, createdOrders };
      },
      async (ctx) => {
        if (ctx.createdOrders && ctx.createdOrders.length > 0) {
          for (const order of ctx.createdOrders) {
            console.log(`    Deleting PostgreSQL order ${order.id}...`);
            await orderRepository.deleteOrder(order.id);
          }
        }
      }
    );

    // 3. Decrement MongoDB stock & clear user cart
    saga.addStep(
      "Update MongoDB Stock & Clear Cart",
      async (ctx) => {
        const processedItems = [];

        for (const [sellerId, items] of Object.entries(ctx.sellerGroups)) {
          for (const item of items) {
            await bookRepository.decrementStockAndIncreaseSold(item.bookId, item.quantity);
            await userRepository.removeFromCart(userId, item.bookId);
            await inventoryReservationManager.releaseReservation(item.bookId, userId);
            processedItems.push({ bookId: item.bookId, quantity: item.quantity });
          }
          await bookRepository.invalidateSellerStats(sellerId);
        }

        ctx.processedItems = processedItems;
        return { processedItems };
      },
      async (ctx) => {
        if (ctx.processedItems && ctx.processedItems.length > 0) {
          for (const item of ctx.processedItems) {
            console.log(`    Restoring stock for book ${item.bookId}...`);
            await bookRepository.restoreStock(item.bookId, item.quantity);
            await userRepository.restoreCartItem(userId, item.bookId);
          }
        }
      }
    );

    const result = await saga.execute({
      userId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      receipt,
      ordersToProcess
    });

    return {
      payment: result.payment,
      orders: result.createdOrders
    };
  }
}

module.exports = new PaymentSagaService();
