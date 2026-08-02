const SagaOrchestrator = require("../utils/sagaOrchestrator");
const orderRepository = require("../repositories/orderRepository");
const bookRepository = require("../repositories/bookRepository");
const userRepository = require("../repositories/userRepository");

const inventoryReservationManager = require("../utils/inventoryReservationManager");

class OrderSagaService {
  /**
   * Orchestrates multi-database order placement with compensating rollbacks
   */
  async placeOrder({ userId, items, shippingAddress, discount = 0, handlingFee = 0 }) {
    const saga = new SagaOrchestrator("PlaceOrderSaga");

    // 1. Group items by Seller and validate/reserve stock
    saga.addStep(
      "Validate & Reserve Stock",
      async (ctx) => {
        const sellerGroups = {};

        for (const orderData of items) {
          const bookIdStr = (orderData.book || orderData._id || orderData.bookId).toString();
          const book = await bookRepository.findBookById(bookIdStr);

          if (!book) {
            throw new Error("Item currently out of stock");
          }

          const quantity = Number(orderData.quantity || 1);

          // Reserve stock in Redis for 10 mins (600s)
          await inventoryReservationManager.reserveStock(bookIdStr, userId, quantity, book.stock, 600);

          const sellerIdStr = (book.seller || book.addedby)?.toString() || userId.toString();
          if (!sellerGroups[sellerIdStr]) {
            sellerGroups[sellerIdStr] = [];
          }

          sellerGroups[sellerIdStr].push({
            bookId: book._id.toString(),
            title: book.title,
            price: Number(book.price || 0),
            quantity,
            rawOrderData: orderData
          });
        }

        ctx.sellerGroups = sellerGroups;
        return { sellerGroups };
      },
      async (ctx) => {
        // Release reservations if subsequent steps fail
        if (ctx.sellerGroups) {
          for (const itemsList of Object.values(ctx.sellerGroups)) {
            for (const item of itemsList) {
              await inventoryReservationManager.releaseReservation(item.bookId, userId);
            }
          }
        }
      }
    );

    // 2. Create PostgreSQL Orders & OrderItems via Prisma
    saga.addStep(
      "Create PostgreSQL Orders",
      async (ctx) => {
        const createdOrders = [];
        const expectedDelivery = new Date();
        expectedDelivery.setDate(expectedDelivery.getDate() + 7);

        for (const [sellerId, itemsList] of Object.entries(ctx.sellerGroups)) {
          const sellerSubtotal = itemsList.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          const initialTracking = [{ status: "Order Placed", location: "Warehouse", date: new Date() }];

          const newOrder = await orderRepository.createOrder({
            userId,
            bookId: itemsList[0].bookId,
            sellerId,
            orderStatus: itemsList[0].rawOrderData.orderStatus || "Order Placed",
            paymentStatus: itemsList[0].rawOrderData.paymentStatus || "Pending",
            paymentMethod: itemsList[0].rawOrderData.paymentMethod || "COD",
            amountPayable: sellerSubtotal,
            discount,
            handlingFee,
            shippingAddress,
            currentLocation: "Warehouse",
            expectedDeliveryDate: expectedDelivery,
            trackingHistory: initialTracking,
            items: itemsList
          });

          createdOrders.push(newOrder);
        }

        ctx.createdOrders = createdOrders;
        return { createdOrders };
      },
      async (ctx) => {
        // Compensating Action: Delete created PostgreSQL orders if subsequent MongoDB steps fail
        if (ctx.createdOrders && ctx.createdOrders.length > 0) {
          for (const order of ctx.createdOrders) {
            console.log(`    Deleting created PostgreSQL order ${order.id}...`);
            await orderRepository.deleteOrder(order.id);
          }
        }
      }
    );

    // 3. Decrement Stock & Clear Cart in MongoDB
    saga.addStep(
      "Update MongoDB Stock & Clear Cart",
      async (ctx) => {
        const processedItems = [];

        for (const [sellerId, itemsList] of Object.entries(ctx.sellerGroups)) {
          for (const item of itemsList) {
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
        // Compensating Action: Restore MongoDB stock & cart
        if (ctx.processedItems && ctx.processedItems.length > 0) {
          for (const item of ctx.processedItems) {
            console.log(`    Restoring stock for book ${item.bookId}...`);
            await bookRepository.restoreStock(item.bookId, item.quantity);
            await userRepository.restoreCartItem(userId, item.bookId);
          }
        }
      }
    );

    const result = await saga.execute({ userId, items, shippingAddress });
    return result.createdOrders;
  }
}

module.exports = new OrderSagaService();
