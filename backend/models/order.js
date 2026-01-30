// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Types.ObjectId,
//       ref: "user",
//       required: true,
//     },

//     book: {
//       type: mongoose.Types.ObjectId,
//       ref: "books",
//       required: true,
//     },

//     paymentMethod: {
//       type: String,
//       enum: ["COD", "RAZORPAY"],
//       required: true,
//     },

//     paymentStatus: {
//       type: String,
//       enum: ["Pending", "Success", "Failed"],
//       default: "Pending",
//     },

//     orderStatus: {
//       type: String,
//       enum: ["Order Placed", "Out for Delivery", "Delivered", "Cancelled"],
//       default: "Order Placed",
//     },

//     // ✅ Amount Payable (including discounts, fees, etc.)
//     amountPayable: {
//       type: Number,
//       required: true,
//     },

//     // ✅ Optional: Store discount and handling fee separately
//     discount: {
//       type: Number,
//       default: 0,
//     },

//     handlingFee: {
//       type: Number,
//       default: 0,
//     },

//     // ✅ Order Date (auto set when created)
//     orderDate: {
//       type: Date,
//       default: Date.now,
//     },

//     // ✅ Delivery Date (expected delivery ETA, default +7 days)
//     deliveryDate: {
//       type: Date,
//       default: () => {
//         let d = new Date();
//         d.setDate(d.getDate() + 7);
//         return d;
//       },
//     },

//     // ✅ Shipping Address (snapshot at order time, matches user address schema)
//     shippingAddress: {
//       fullName: { type: String, required: true },
//       phone: { type: String, required: true },
//       addressLine1: { type: String, required: true },
//       addressLine2: { type: String },
//       city: { type: String, required: true },
//       state: { type: String, required: true },
//       postalCode: { type: String, required: true },
//       country: { type: String, default: "India" },
//     },

//     // ✅ Current Location for tracking
//     currentLocation: {
//       type: String,
//       default: "Warehouse",
//     },

//     seller: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "user",
//   required: true,
// },
// expectedDeliveryDate: { type: Date },
// actualDeliveryDate: { type: Date },
// sellerNotified: { type: Boolean, default: false },
// sellerNotificationDate: { type: Date },

//     // ✅ Tracking History (for real-time updates)
//     trackingHistory: [
//       {
//         status: { type: String },
//         location: { type: String },
//         date: { type: Date, default: Date.now },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("order", orderSchema);

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },

    book: {
      type: mongoose.Types.ObjectId,
      ref: "books",
      required: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "RAZORPAY"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },

    orderStatus: {
      type: String,
      enum: ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Order Placed",
    },

    // Amount details
    amountPayable: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    handlingFee: {
      type: Number,
      default: 0,
    },

    // Shipping Address
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: "India" },
    },

    // Delivery tracking
    expectedDeliveryDate: { 
      type: Date,
      default: () => {
        let d = new Date();
        d.setDate(d.getDate() + 7);
        return d;
      }
    },
    
    actualDeliveryDate: { type: Date },

    currentLocation: {
      type: String,
      default: "Warehouse",
    },

    // Seller notification tracking
    sellerNotified: { 
      type: Boolean, 
      default: false 
    },
    
    sellerNotificationRead: { 
      type: Boolean, 
      default: false 
    },
    
    sellerNotificationDate: { 
      type: Date 
    },

    // Tracking History
    trackingHistory: [
      {
        status: { type: String, required: true },
        location: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],

    // Razorpay details (if applicable)
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ seller: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ sellerNotified: 1, seller: 1 });

// Virtual to check if order is pending
orderSchema.virtual('isPending').get(function() {
  return this.orderStatus !== 'Delivered' && this.orderStatus !== 'Cancelled';
});

// Method to mark as delivered
orderSchema.methods.markAsDelivered = async function() {
  this.orderStatus = 'Delivered';
  this.actualDeliveryDate = new Date();
  
  // If payment is COD, mark as Success when delivered
  if (this.paymentMethod === 'COD' && this.paymentStatus === 'Pending') {
    this.paymentStatus = 'Success';
  }
  
  this.trackingHistory.push({
    status: 'Delivered',
    location: this.shippingAddress.city,
    date: new Date()
  });
  
  return this.save();
};

module.exports = mongoose.models.order || mongoose.model("order", orderSchema);
