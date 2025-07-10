const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  village: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, required: true },
}, { _id: false });

const sellerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },

    // Personal Details
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },

    // Seller Type
    sellerType: {
      type: String,
      enum: ["Individual", "Small Business", "Business"],
      required: true,
    },

    // Business Info
    businessName: { type: String },
    gstNumber: { type: String },

    // Bank Info
    bankAccountNumber: { type: String, required: true },
    bankIFSC: { type: String, required: true },
    bankHolderName: { type: String, required: true },

    // Pickup Address
    pickupAddress: {
      type: addressSchema,
      required: true,
    },

    // Status for admin review
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Seller", sellerSchema);
