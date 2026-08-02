const Settings = require("../models/Settings");

/**
 * Middleware to check auto-approval setting and approve book automatically if enabled
 * This should be called AFTER a book is created/saved in the database
 */
const autoApproveBookMiddleware = async (book, sellerId = null) => {
  try {
    console.log("\n=== 🤖 AUTO-APPROVAL CHECK ===");
    console.log("Book:", book.title);
    
    // Check if auto-approval is enabled
    const autoApproval = await Settings.getSetting("autoApproveBooks", false);
    
    console.log(`Auto-approval setting: ${autoApproval ? 'ENABLED ✅' : 'DISABLED ❌'}`);
    
    if (autoApproval === true) {
      // Auto-approve the book
      book.isApproved = true;
      book.adminApproval = "Approved";
      book.approvedAt = new Date();
      
      const isFutureScheduled = book.isScheduled && book.goLiveDate && new Date(book.goLiveDate) > new Date();

      // If book has stock, is "Arriving Soon", and NOT scheduled for a future date, change to "Available"
      if (book.stock > 0 && book.productStatus === "Arriving Soon" && !isFutureScheduled) {
        book.productStatus = "Available";
        console.log("📊 Auto-updated status to 'Available'");
      } else if (isFutureScheduled) {
        console.log(`📅 Book approved but scheduled to go live on ${book.goLiveDate}`);
      }
      
      await book.save();
      
      console.log("✅ Book auto-approved successfully");
      console.log({
        bookId: book._id,
        title: book.title,
        isApproved: book.isApproved,
        adminApproval: book.adminApproval,
        productStatus: book.productStatus
      });
      
      return {
        autoApproved: true,
        book: book
      };
    } else {
      console.log("📋 Book requires manual admin approval");
      
      return {
        autoApproved: false,
        book: book
      };
    }
    
  } catch (error) {
    console.error("❌ Error in auto-approval middleware:", error);
    // Don't throw error - just log it and continue
    // The book will remain in pending state
    return {
      autoApproved: false,
      error: error.message,
      book: book
    };
  }
};

/**
 * Express middleware wrapper for auto-approval
 * Use this in routes after book creation
 */
const autoApproveMiddleware = async (req, res, next) => {
  try {
    // Check if book was created in this request
    if (req.newBook) {
      const result = await autoApproveBookMiddleware(req.newBook, req.headers.id);
      req.autoApprovalResult = result;
    }
    next();
  } catch (error) {
    console.error("❌ Auto-approval middleware error:", error);
    next(); // Continue even if auto-approval fails
  }
};

module.exports = {
  autoApproveBookMiddleware,
  autoApproveMiddleware
};