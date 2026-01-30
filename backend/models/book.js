// // const mongoose = require("mongoose");

// // const bookSchema = new mongoose.Schema(
// //   {
// //     title: { 
// //       type: String, 
// //       required: [true, "Title is required"],
// //       trim: true,
// //       minlength: [3, "Title must be at least 3 characters long"]
// //     },
// //     author: { 
// //       type: String, 
// //       required: [true, "Author name is required"],
// //       trim: true
// //     },
// //     price: { 
// //       type: Number, 
// //       required: [true, "Price is required"],
// //       min: [0, "Price cannot be negative"]
// //     },
// //     desc: { 
// //       type: String, 
// //       required: [true, "Description is required"],
// //       trim: true,
// //       minlength: [20, "Description must be at least 20 characters long"]
// //     },
// //     url: { 
// //       type: String 
// //     },
// //     language: { 
// //       type: String, 
// //       required: [true, "Language is required"],
// //       trim: true
// //     },
// //     category: { 
// //       type: String, 
// //       default: "General", 
// //       required: true,
// //       trim: true
// //     },
// //     editionOrPublishYear: { 
// //       type: String, 
// //       default: "N/A",
// //       trim: true
// //     },
// //     postedAt: { 
// //       type: Date, 
// //       default: Date.now 
// //     },
// //     seller: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "seller", // ✅ Changed from "user" to "seller"
// //       required: [true, "Seller ID is required"]
// //     },
// //     stock: { 
// //       type: Number, 
// //       default: 1,
// //       min: [0, "Stock cannot be negative"]
// //     },
// //     views: { 
// //       type: Number, 
// //       default: 0,
// //       min: 0
// //     },
// //     sold: { 
// //       type: Number, 
// //       default: 0,
// //       min: 0
// //     },
// //     images: [{
// //       url: { 
// //         type: String, 
// //         required: [true, "Image URL is required"]
// //       },
// //       publicId: { 
// //         type: String, 
// //         required: [true, "Image public ID is required"]
// //       }
// //     }],
// //   },
// //   { 
// //     timestamps: true,
// //     toJSON: { virtuals: true },
// //     toObject: { virtuals: true }
// //   }
// // );

// // // Indexes for better query performance
// // bookSchema.index({ seller: 1 });
// // bookSchema.index({ category: 1 });
// // bookSchema.index({ title: 'text', author: 'text', desc: 'text' });

// // // Virtual for checking if in stock
// // bookSchema.virtual('inStock').get(function() {
// //   return this.stock > 0;
// // });

// // // Pre-save hook for validation
// // bookSchema.pre('save', function(next) {
// //   // Ensure at least one image exists
// //   if (!this.images || this.images.length === 0) {
// //     next(new Error('At least one image is required'));
// //   }
  
// //   // Set url to first image if not set
// //   if (!this.url && this.images.length > 0) {
// //     this.url = this.images[0].url;
// //   }
  
// //   next();
// // });

// // // ✅ Prevent OverwriteModelError during dev
// // module.exports = mongoose.models.books || mongoose.model("books", bookSchema);


// const mongoose = require("mongoose");

// const bookSchema = new mongoose.Schema(
//   {
//     title: { 
//       type: String, 
//       required: [true, "Title is required"],
//       trim: true,
//       minlength: [3, "Title must be at least 3 characters long"]
//     },
//     author: { 
//       type: String, 
//       required: [true, "Author name is required"],
//       trim: true
//     },
//     price: { 
//       type: Number, 
//       required: [true, "Price is required"],
//       min: [0, "Price cannot be negative"]
//     },
//     desc: { 
//       type: String, 
//       required: [true, "Description is required"],
//       trim: true,
//       minlength: [20, "Description must be at least 20 characters long"]
//     },
//     url: { 
//       type: String 
//     },
//     language: { 
//       type: String, 
//       required: [true, "Language is required"],
//       trim: true
//     },
//     category: { 
//       type: String, 
//       default: "General", 
//       required: true,
//       trim: true
//     },
//     editionOrPublishYear: { 
//       type: String, 
//       default: "N/A",
//       trim: true
//     },
//     postedAt: { 
//       type: Date, 
//       default: Date.now 
//     },
//     seller: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "user",
//       required: [true, "Seller ID is required"]
//     },
//     stock: { 
//       type: Number, 
//       default: 1,
//       min: [0, "Stock cannot be negative"]
//     },
//     views: { 
//       type: Number, 
//       default: 0,
//       min: 0
//     },
//     sold: { 
//       type: Number, 
//       default: 0,
//       min: 0
//     },
//     images: [{
//       url: { 
//         type: String, 
//         required: [true, "Image URL is required"]
//       },
//       publicId: { 
//         type: String, 
//         required: [true, "Image public ID is required"]
//       }
//     }],
    
//     // ✅ NEW: Product Status Management
//     productStatus: {
//       type: String,
//       enum: ["Available", "Sold Out", "Not Available", "Arriving Soon"],
//       default: "Available"
//     },
    
//     // ✅ NEW: Auto-update status based on stock
//     autoStatusUpdate: {
//       type: Boolean,
//       default: true // If true, status updates automatically when sold
//     },
    
//     // ✅ NEW: Expected restock date for "Arriving Soon"
//     expectedRestockDate: {
//       type: Date
//     },
    
//     // ✅ NEW: Track if book is currently in an active order
//     inActiveOrder: {
//       type: Boolean,
//       default: false
//     },
    
//     // ✅ NEW: Last sold date
//     lastSoldAt: {
//       type: Date
//     },
    
//     // ✅ NEW: Reserved (someone added to cart but not purchased yet)
//     reserved: {
//       type: Boolean,
//       default: false
//     },
    
//     reservedUntil: {
//       type: Date
//     }
//   },
//   { 
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
//   }
// );

// // Indexes for better query performance
// bookSchema.index({ seller: 1 });
// bookSchema.index({ category: 1 });
// bookSchema.index({ productStatus: 1 });
// bookSchema.index({ title: 'text', author: 'text', desc: 'text' });

// // Virtual for checking if in stock
// bookSchema.virtual('inStock').get(function() {
//   return this.stock > 0 && this.productStatus === "Available";
// });

// // Pre-save hook for auto status update
// bookSchema.pre('save', function(next) {
//   // Ensure at least one image exists
//   if (!this.images || this.images.length === 0) {
//     next(new Error('At least one image is required'));
//   }
  
//   // Set url to first image if not set
//   if (!this.url && this.images.length > 0) {
//     this.url = this.images[0].url;
//   }
  
//   // ✅ Auto-update product status based on stock if autoStatusUpdate is enabled
//   if (this.autoStatusUpdate) {
//     if (this.stock === 0 && this.productStatus === "Available") {
//       this.productStatus = "Sold Out";
//     } else if (this.stock > 0 && this.productStatus === "Sold Out") {
//       this.productStatus = "Available";
//     }
//   }
  
//   next();
// });

// // ✅ Method to mark as sold
// bookSchema.methods.markAsSold = async function() {
//   this.stock = Math.max(0, this.stock - 1);
//   this.sold += 1;
//   this.lastSoldAt = new Date();
//   this.inActiveOrder = true;
  
//   if (this.autoStatusUpdate && this.stock === 0) {
//     this.productStatus = "Sold Out";
//   }
  
//   return this.save();
// };

// // ✅ Method to restore stock (if payment fails)
// bookSchema.methods.restoreStock = async function() {
//   this.stock += 1;
//   this.inActiveOrder = false;
  
//   if (this.autoStatusUpdate && this.stock > 0) {
//     this.productStatus = "Available";
//   }
  
//   return this.save();
// };

// // ✅ Method to manually update status
// bookSchema.methods.updateStatus = async function(newStatus, restockDate = null) {
//   this.productStatus = newStatus;
//   this.autoStatusUpdate = false; // Disable auto-update when manually changed
  
//   if (newStatus === "Arriving Soon" && restockDate) {
//     this.expectedRestockDate = restockDate;
//   }
  
//   return this.save();
// };

// module.exports = mongoose.models.books || mongoose.model("books", bookSchema);




const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      index: true
    },
    author: { 
      type: String, 
      required: [true, "Author name is required"],
      trim: true
    },
    price: { 
      type: Number, 
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"]
    },
    desc: { 
      type: String, 
      required: [true, "Description is required"],
      trim: true,
      minlength: [20, "Description must be at least 20 characters long"]
    },
    url: { 
      type: String 
    },
    language: { 
      type: String, 
      required: [true, "Language is required"],
      trim: true
    },
    category: { 
      type: String, 
      default: "General", 
      required: true,
      trim: true
    },
    editionOrPublishYear: { 
      type: String, 
      default: "N/A",
      trim: true
    },
    postedAt: { 
      type: Date, 
      default: Date.now 
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Seller ID is required"],
      index: true
    },
    stock: { 
      type: Number, 
      default: 1,
      min: [0, "Stock cannot be negative"]
    },
    views: { 
      type: Number, 
      default: 0,
      min: 0
    },
    sold: { 
      type: Number, 
      default: 0,
      min: 0
    },
    images: [{
      url: { 
        type: String, 
        required: [true, "Image URL is required"]
      },
      publicId: { 
        type: String, 
        required: [true, "Image public ID is required"]
      }
    }],
    
    // Product Status Management
    productStatus: {
      type: String,
      enum: ["Available", "Sold Out", "Not Available", "Arriving Soon"],
      default: "Arriving Soon",
      index: true
    },
    
    // Auto-update status based on stock
    autoStatusUpdate: {
      type: Boolean,
      default: true
    },
    
    // Expected restock date for "Arriving Soon"
    expectedRestockDate: {
      type: Date
    },
    
    // Track if book is currently in an active order
    inActiveOrder: {
      type: Boolean,
      default: false
    },
    
    // Last sold date
    lastSoldAt: {
      type: Date
    },
    
    // Reserved (someone added to cart but not purchased yet)
    reserved: {
      type: Boolean,
      default: false
    },
    
    reservedUntil: {
      type: Date
    },
    
    // ✅ NEW: Admin Approval Fields
    isApproved: {
      type: Boolean,
      default: false,
      index: true
    },
    
    adminApproval: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      index: true
    },
    
    rejectionReason: {
      type: String,
      default: ""
    },
    
    approvedAt: {
      type: Date
    },
    
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
bookSchema.index({ seller: 1 });
bookSchema.index({ category: 1 });
bookSchema.index({ productStatus: 1 });
bookSchema.index({ productStatus: 1, isApproved: 1 });
bookSchema.index({ adminApproval: 1, createdAt: -1 });
bookSchema.index({ title: 'text', author: 'text', desc: 'text' });

// Virtual for checking if in stock
bookSchema.virtual('inStock').get(function() {
  return this.stock > 0 && this.productStatus === "Available";
});

// ✅ NEW: Virtual for approval status display
bookSchema.virtual('approvalStatusDisplay').get(function() {
  if (this.isApproved || this.adminApproval === 'Approved') {
    return 'Approved';
  } else if (this.adminApproval === 'Rejected') {
    return 'Rejected';
  } else {
    return 'Pending Approval';
  }
});

// ✅ NEW: Virtual for can be made available
bookSchema.virtual('canBeAvailable').get(function() {
  return (this.isApproved || this.adminApproval === 'Approved') && this.stock > 0;
});

// Pre-save hook
bookSchema.pre('save', function(next) {
  // Ensure at least one image exists
  if (!this.images || this.images.length === 0) {
    next(new Error('At least one image is required'));
  }
  
  // Set url to first image if not set
  if (!this.url && this.images.length > 0) {
    this.url = this.images[0].url;
  }
  
  // ✅ Set approved date when approved
  if (this.isModified('isApproved') && this.isApproved === true && !this.approvedAt) {
    this.approvedAt = new Date();
  }
  
  // ✅ Sync isApproved with adminApproval
  if (this.isModified('adminApproval')) {
    if (this.adminApproval === 'Approved') {
      this.isApproved = true;
    } else if (this.adminApproval === 'Rejected') {
      this.isApproved = false;
    }
  }
  
  // Auto-update product status based on stock if autoStatusUpdate is enabled
  if (this.autoStatusUpdate) {
    if (this.stock === 0 && this.productStatus === "Available") {
      this.productStatus = "Sold Out";
    } else if (this.stock > 0 && this.productStatus === "Sold Out") {
      this.productStatus = "Available";
    }
  }
  
  next();
});

// Method to mark as sold
bookSchema.methods.markAsSold = async function() {
  this.stock = Math.max(0, this.stock - 1);
  this.sold += 1;
  this.lastSoldAt = new Date();
  this.inActiveOrder = true;
  
  if (this.autoStatusUpdate && this.stock === 0) {
    this.productStatus = "Sold Out";
  }
  
  return this.save();
};

// Method to restore stock (if payment fails)
bookSchema.methods.restoreStock = async function() {
  this.stock += 1;
  this.inActiveOrder = false;
  
  if (this.autoStatusUpdate && this.stock > 0) {
    this.productStatus = "Available";
  }
  
  return this.save();
};

// ✅ UPDATED: Method to manually update status with admin approval check
bookSchema.methods.updateStatus = async function(newStatus, restockDate = null) {
  const validStatuses = ["Available", "Sold Out", "Not Available", "Arriving Soon"];
  
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }
  
  // ✅ Check if can be set to Available
  if (newStatus === "Available") {
    const isApproved = this.isApproved || this.adminApproval === 'Approved';
    if (!isApproved) {
      throw new Error("Book must be approved by admin before it can be set to Available");
    }
    if (this.stock === 0) {
      throw new Error("Cannot set to Available when stock is 0");
    }
  }
  
  this.productStatus = newStatus;
  this.autoStatusUpdate = false; // Disable auto-update when manually changed
  
  if (newStatus === "Arriving Soon" && restockDate) {
    this.expectedRestockDate = restockDate;
  }
  
  // Auto-adjust stock based on status
  if (newStatus === "Sold Out") {
    this.stock = 0;
  } else if (newStatus === "Available" && this.stock === 0) {
    this.stock = 1;
  }
  
  return this.save();
};

// ✅ NEW: Method to approve book
bookSchema.methods.approve = async function(adminId) {
  this.isApproved = true;
  this.adminApproval = 'Approved';
  this.approvedAt = new Date();
  this.approvedBy = adminId;
  
  // If book has stock and was "Arriving Soon", change to "Available"
  if (this.stock > 0 && this.productStatus === "Arriving Soon") {
    this.productStatus = "Available";
  }
  
  return await this.save();
};

// ✅ NEW: Method to reject book
bookSchema.methods.reject = async function(reason = "") {
  this.isApproved = false;
  this.adminApproval = 'Rejected';
  this.rejectionReason = reason;
  this.productStatus = "Not Available";
  
  return await this.save();
};

// ✅ NEW: Static method to get approval statistics
bookSchema.statics.getApprovalStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: "$adminApproval",
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  };
  
  stats.forEach(stat => {
    result.total += stat.count;
    if (stat._id === 'Pending' || !stat._id) {
      result.pending = stat.count;
    } else if (stat._id === 'Approved') {
      result.approved = stat.count;
    } else if (stat._id === 'Rejected') {
      result.rejected = stat.count;
    }
  });
  
  return result;
};

module.exports = mongoose.models.books || mongoose.model("books", bookSchema);