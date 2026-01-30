// // USER SCHEMA
// const mongoose = require("mongoose");

// const addressSchema = new mongoose.Schema({
//   fullName: { type: String, required: true }, // ✅ Added fullName to user address
//   phone: { type: String, required: true },    // ✅ Added phone to user address
//   addressLine1: { type: String, required: true }, // ✅ Main address line
//   addressLine2: { type: String }, // ✅ Optional second line
//   city: { type: String, required: true },
//   state: { type: String, required: true },
//   postalCode: { type: String, required: true }, // ✅ Changed from pincode to postalCode
//   country: { type: String, default: "India" }, // ✅ Added country
  
//   // ✅ Optional: Keep old fields for backward compatibility if needed
//   houseNumber: String,
//   streetName: String,
//   landmark: String,
//   locality: String,
//   villageOrTown: String,
//   district: String,
//   pincode: String, // Keep as alias for postalCode
// });

// const userSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     phone: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     address: addressSchema, // ✅ Now matches order schema requirements
//     avatar: {
//       type: String,
//       default:
//         "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?ga=GA1.1.710266921.1749747219&semt=ais_hybrid&w=740",
//     },
//     role: {
//       type: String,
//       default: "user",
//       enum: ["user", "admin"],
//     },
//     isSeller: {
//       type: Boolean,
//       default: false,
//     },
//     favourites: [
//       {
//         type: mongoose.Types.ObjectId,
//         ref: "books",
//       },
//     ],
//     cart: [
//       {
//         type: mongoose.Types.ObjectId,
//         ref: "books",
//       },
//     ],
//     orders: [
//       {
//         type: mongoose.Types.ObjectId,
//         ref: "order",
//       },
//     ],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('user', userSchema);


// USER SCHEMA WITH PREMIUM MEMBERSHIP
// const mongoose = require("mongoose");

// const addressSchema = new mongoose.Schema({
//   fullName: { type: String, required: true },
//   phone: { type: String, required: true },
//   addressLine1: { type: String, required: true },
//   addressLine2: { type: String },
//   city: { type: String, required: true },
//   state: { type: String, required: true },
//   postalCode: { type: String, required: true },
//   country: { type: String, default: "India" },
  
//   // Optional: Keep old fields for backward compatibility
//   houseNumber: String,
//   streetName: String,
//   landmark: String,
//   locality: String,
//   villageOrTown: String,
//   district: String,
//   pincode: String,
// });

// // ✅ NEW: Premium Membership Schema
// const premiumSchema = new mongoose.Schema({
//   isPremium: {
//     type: Boolean,
//     default: false,
//   },
//   membershipType: {
//     type: String,
//     enum: ["free", "monthly", "yearly", "lifetime"],
//     default: "free",
//   },
//   startDate: {
//     type: Date,
//   },
//   expiryDate: {
//     type: Date,
//   },
//   paymentId: {
//     type: String, // Razorpay payment ID or transaction reference
//   },
//   autoRenew: {
//     type: Boolean,
//     default: false,
//   },
//   features: {
//     canSeeSellers: { type: Boolean, default: false },
//     prioritySupport: { type: Boolean, default: false },
//     earlyAccess: { type: Boolean, default: false },
//     exclusiveDeals: { type: Boolean, default: false },
//     adFree: { type: Boolean, default: false },
//   },
// });

// const userSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     phone: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     address: addressSchema,
//     avatar: {
//       type: String,
//       default:
//         "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?ga=GA1.1.710266921.1749747219&semt=ais_hybrid&w=740",
//     },
//     role: {
//       type: String,
//       default: "user",
//       enum: ["user", "admin"],
//     },
//     isSeller: {
//       type: Boolean,
//       default: false,
//     },
    
//     // ✅ NEW: Premium membership fields
//     premium: {
//       type: premiumSchema,
//       default: () => ({
//         isPremium: false,
//         membershipType: "free",
//         features: {
//           canSeeSellers: false,
//           prioritySupport: false,
//           earlyAccess: false,
//           exclusiveDeals: false,
//           adFree: false,
//         },
//       }),
//     },
    
//     favourites: [
//       {
//         type: mongoose.Types.ObjectId,
//         ref: "books",
//       },
//     ],
//     cart: [
//       {
//         type: mongoose.Types.ObjectId,
//         ref: "books",
//       },
//     ],
//     orders: [
//       {
//         type: mongoose.Types.ObjectId,
//         ref: "order",
//       },
//     ],
//   },
//   { timestamps: true }
// );

// // ✅ Virtual property for easy access to premium status
// userSchema.virtual("isPremium").get(function () {
//   return this.premium?.isPremium || false;
// });

// // ✅ Method to check if premium is active
// userSchema.methods.isPremiumActive = function () {
//   if (!this.premium?.isPremium) return false;
//   if (this.premium?.membershipType === "lifetime") return true;
//   if (!this.premium?.expiryDate) return false;
//   return new Date() < new Date(this.premium.expiryDate);
// };

// // ✅ Method to activate premium
// userSchema.methods.activatePremium = function (type, paymentId) {
//   const now = new Date();
//   let expiryDate;

//   switch (type) {
//     case "monthly":
//       expiryDate = new Date(now.setMonth(now.getMonth() + 1));
//       break;
//     case "yearly":
//       expiryDate = new Date(now.setFullYear(now.getFullYear() + 1));
//       break;
//     case "lifetime":
//       expiryDate = null; // No expiry for lifetime
//       break;
//     default:
//       throw new Error("Invalid membership type");
//   }

//   this.premium = {
//     isPremium: true,
//     membershipType: type,
//     startDate: new Date(),
//     expiryDate: expiryDate,
//     paymentId: paymentId,
//     autoRenew: false,
//     features: {
//       canSeeSellers: true,
//       prioritySupport: true,
//       earlyAccess: true,
//       exclusiveDeals: true,
//       adFree: true,
//     },
//   };

//   return this.save();
// };

// // ✅ Method to cancel premium
// userSchema.methods.cancelPremium = function () {
//   this.premium.isPremium = false;
//   this.premium.membershipType = "free";
//   this.premium.autoRenew = false;
//   this.premium.features = {
//     canSeeSellers: false,
//     prioritySupport: false,
//     earlyAccess: false,
//     exclusiveDeals: false,
//     adFree: false,
//   };
//   return this.save();
// };

// // ✅ Static method to check and expire premiums (run this in a cron job)
// userSchema.statics.expirePremiums = async function () {
//   const now = new Date();
//   const result = await this.updateMany(
//     {
//       "premium.isPremium": true,
//       "premium.membershipType": { $in: ["monthly", "yearly"] },
//       "premium.expiryDate": { $lt: now },
//     },
//     {
//       $set: {
//         "premium.isPremium": false,
//         "premium.membershipType": "free",
//         "premium.features.canSeeSellers": false,
//         "premium.features.prioritySupport": false,
//         "premium.features.earlyAccess": false,
//         "premium.features.exclusiveDeals": false,
//         "premium.features.adFree": false,
//       },
//     }
//   );
//   return result;
// };

// module.exports = mongoose.model("user", userSchema);


const mongoose = require("mongoose");

// Simplified, consistent address schema
const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true }, // House/Flat + Street
  addressLine2: { type: String }, // Landmark (optional)
  locality: { type: String, required: true }, // Area/Locality
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, default: "India" },
  isPrimary: { type: Boolean, default: false }
});

const premiumSchema = new mongoose.Schema({
  isPremium: { type: Boolean, default: false },
  membershipType: {
    type: String,
    enum: ["free", "monthly", "yearly", "lifetime"],
    default: "free"
  },
  startDate: { type: Date },
  expiryDate: { type: Date },
  paymentId: { type: String },
  autoRenew: { type: Boolean, default: false },
  features: {
    canSeeSellers: { type: Boolean, default: false },
    prioritySupport: { type: Boolean, default: false },
    earlyAccess: { type: Boolean, default: false },
    exclusiveDeals: { type: Boolean, default: false },
    adFree: { type: Boolean, default: false }
  }
});

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // Multiple addresses support (up to 3)
    addresses: {
      type: [addressSchema],
      validate: [arrayLimit, 'Maximum 3 addresses allowed'],
      default: []
    },
    
    avatar: {
      type: String,
      default: "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg"
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"]
    },
    isSeller: { type: Boolean, default: false },
    blocked: {
      type: Boolean,
      default: false
    },

     sellerApplicationStatus: {
      type: String,
      enum: ["Available", "Applied", "Accepted", "Rejected"],
      default: "Available"
    },
    premium: {
      type: premiumSchema,
      default: () => ({
        isPremium: false,
        membershipType: "free",
        features: {
          canSeeSellers: false,
          prioritySupport: false,
          earlyAccess: false,
          exclusiveDeals: false,
          adFree: false
        }
      })
    },
    favourites: [{ type: mongoose.Types.ObjectId, ref: "books" }],
    cart: [{ type: mongoose.Types.ObjectId, ref: "books" }],
    orders: [{ type: mongoose.Types.ObjectId, ref: "order" }]
  },
  { timestamps: true }
);

// Validator for max 3 addresses
function arrayLimit(val) {
  return val.length <= 3;
}

// Method to get primary address
userSchema.methods.getPrimaryAddress = function () {
  const primary = this.addresses.find(addr => addr.isPrimary);
  return primary || this.addresses[0] || null;
};

// Method to set primary address
userSchema.methods.setPrimaryAddress = function (addressId) {
  this.addresses.forEach(addr => {
    addr.isPrimary = addr._id.toString() === addressId.toString();
  });
  return this.save();
};

// Method to add address
userSchema.methods.addAddress = function (addressData) {
  if (this.addresses.length >= 3) {
    throw new Error("Maximum 3 addresses allowed");
  }
  
  // If this is the first address, make it primary
  if (this.addresses.length === 0) {
    addressData.isPrimary = true;
  }
  
  this.addresses.push(addressData);
  return this.save();
};

// Premium methods
userSchema.methods.isPremiumActive = function () {
  if (!this.premium?.isPremium) return false;
  if (this.premium?.membershipType === "lifetime") return true;
  if (!this.premium?.expiryDate) return false;
  return new Date() < new Date(this.premium.expiryDate);
};

userSchema.methods.activatePremium = function (type, paymentId) {
  const now = new Date();
  let expiryDate;

  switch (type) {
    case "monthly":
      expiryDate = new Date(now.setMonth(now.getMonth() + 1));
      break;
    case "yearly":
      expiryDate = new Date(now.setFullYear(now.getFullYear() + 1));
      break;
    case "lifetime":
      expiryDate = null;
      break;
    default:
      throw new Error("Invalid membership type");
  }

  this.premium = {
    isPremium: true,
    membershipType: type,
    startDate: new Date(),
    expiryDate: expiryDate,
    paymentId: paymentId,
    autoRenew: false,
    features: {
      canSeeSellers: true,
      prioritySupport: true,
      earlyAccess: true,
      exclusiveDeals: true,
      adFree: true
    },
    
  };

  return this.save();
};

module.exports = mongoose.model("user", userSchema)