const express = require("express");
const router = express.Router();
const Seller = require("../models/seller");
const {authenticateToken} = require("./userAuth");
const Book = require("../models/Book"); 
const User = require("../models/user");

// Add this test route at the top to verify routes are working
router.get("/test", (req, res) => {
  res.json({ message: "Seller routes are working!", timestamp: new Date() });
});

router.get("/seller/user/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.headers.id;

    console.log('🔍 [Seller Route] Fetching seller info for userId:', userId);
    console.log('👤 [Seller Route] Requesting user:', requestingUserId);

    // Validate userId format
    if (!userId || userId === 'undefined' || userId === 'null') {
      return res.status(400).json({ 
        success: false,
        message: "Invalid user ID" 
      });
    }

    // Security check: Users can only view their own seller info
    if (userId !== requestingUserId) {
      // Check if requesting user is admin
      const requestingUser = await User.findById(requestingUserId);
      
      if (!requestingUser || requestingUser.role !== 'admin') {
        console.warn('⚠️ [Seller Route] Unauthorized access attempt');
        return res.status(403).json({ 
          success: false,
          message: "Access denied. You can only view your own seller information." 
        });
      }
      
      console.log('✅ [Seller Route] Admin accessing seller info');
    }

    // Find seller record by user ID
    // This will find seller record regardless of status (Pending, Approved, Rejected)
    const seller = await Seller.findOne({ user: userId });

    if (!seller) {
      console.log('📭 [Seller Route] No seller record found for user:', userId);
      return res.status(404).json({ 
        success: false,
        message: "No seller application found for this user" 
      });
    }

    console.log('✅ [Seller Route] Seller record found:', {
      _id: seller._id,
      status: seller.status,
      businessName: seller.businessName || 'N/A',
      createdAt: seller.createdAt
    });

    // Return seller data
    res.status(200).json({
      success: true,
      message: "Seller information retrieved successfully",
      seller: {
        _id: seller._id,
        user: seller.user,
        businessName: seller.businessName,
        businessType: seller.businessType,
        address: seller.address,
        city: seller.city,
        state: seller.state,
        pincode: seller.pincode,
        phone: seller.phone,
        email: seller.email,
        gstNumber: seller.gstNumber,
        panNumber: seller.panNumber,
        bankAccountNumber: seller.bankAccountNumber,
        ifscCode: seller.ifscCode,
        status: seller.status,  // Pending, Approved, or Rejected
        createdAt: seller.createdAt,
        updatedAt: seller.updatedAt,
      },
    });
  } catch (error) {
    console.error("❌ [Seller Route] Error fetching seller info:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error while fetching seller information",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ==========================================
// GET CURRENT USER'S SELLER INFO
// ==========================================

/**
 * Get seller information for the currently authenticated user
 * @route GET /api/v1/seller/me
 * @access Private (authenticated users)
 * @description Convenience route to get own seller info without specifying userId
 */
router.get("/seller/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.headers.id;

    console.log('🔍 [Seller Route] Fetching seller info for authenticated user:', userId);

    if (!userId) {
      return res.status(400).json({ 
        success: false,
        message: "User ID not found in request" 
      });
    }

    // Find seller record for authenticated user
    const seller = await Seller.findOne({ user: userId });

    if (!seller) {
      console.log('📭 [Seller Route] No seller record found for current user');
      return res.status(404).json({ 
        success: false,
        message: "You have not applied to become a seller yet" 
      });
    }

    console.log('✅ [Seller Route] Seller record found:', {
      _id: seller._id,
      status: seller.status,
      businessName: seller.businessName || 'N/A'
    });

    res.status(200).json({
      success: true,
      message: "Your seller information retrieved successfully",
      seller: {
        _id: seller._id,
        user: seller.user,
        businessName: seller.businessName,
        businessType: seller.businessType,
        address: seller.address,
        city: seller.city,
        state: seller.state,
        pincode: seller.pincode,
        phone: seller.phone,
        email: seller.email,
        gstNumber: seller.gstNumber,
        panNumber: seller.panNumber,
        bankAccountNumber: seller.bankAccountNumber,
        ifscCode: seller.ifscCode,
        status: seller.status,
        createdAt: seller.createdAt,
        updatedAt: seller.updatedAt,
      },
    });
  } catch (error) {
    console.error("❌ [Seller Route] Error fetching seller info:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error while fetching your seller information",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ==========================================
// CHECK IF USER IS A SELLER (Quick Check)
// ==========================================

/**
 * Quick check if user has a seller application and its status
 * @route GET /api/v1/seller/check/:userId
 * @access Private
 * @description Returns minimal info - just whether seller record exists and status
 */
router.get("/seller/check/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.headers.id;

    // Security check
    if (userId !== requestingUserId) {
      const requestingUser = await User.findById(requestingUserId);
      if (!requestingUser || requestingUser.role !== 'admin') {
        return res.status(403).json({ 
          success: false,
          message: "Access denied" 
        });
      }
    }

    // Check if seller record exists
    const seller = await Seller.findOne({ user: userId }).select('status createdAt');

    res.status(200).json({
      success: true,
      hasSellerApplication: !!seller,
      status: seller?.status || null,
      appliedAt: seller?.createdAt || null,
    });
  } catch (error) {
    console.error("❌ [Seller Route] Error checking seller status:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
});

// ==========================================
// GET SELLER APPLICATION HISTORY
// ==========================================

/**
 * Get history of all seller applications for a user (if they reapplied)
 * @route GET /api/v1/seller/history/:userId
 * @access Private (own data or admin)
 */
router.get("/seller/history/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.headers.id;

    // Security check
    if (userId !== requestingUserId) {
      const requestingUser = await User.findById(requestingUserId);
      if (!requestingUser || requestingUser.role !== 'admin') {
        return res.status(403).json({ 
          success: false,
          message: "Access denied" 
        });
      }
    }

    // Get all seller records for this user (in case of reapplications)
    const sellerHistory = await Seller.find({ user: userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Seller application history retrieved",
      count: sellerHistory.length,
      applications: sellerHistory.map(seller => ({
        _id: seller._id,
        status: seller.status,
        businessName: seller.businessName,
        appliedAt: seller.createdAt,
        lastUpdated: seller.updatedAt,
      })),
    });
  } catch (error) {
    console.error("❌ [Seller Route] Error fetching seller history:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
});


router.post("/become-seller", authenticateToken, async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      sellerType,
      businessName,
      gstNumber,
      bankAccountNumber,
      bankIFSC,
      bankHolderName,
      pickupAddress
    } = req.body;

    console.log('📥 Received seller application from user:', req.user.id);

    // Validate required fields
    if (
      !fullName ||
      !email ||
      !phone ||
      !sellerType ||
      !bankAccountNumber ||
      !bankIFSC ||
      !bankHolderName ||
      !pickupAddress ||
      !pickupAddress.city ||
      !pickupAddress.pincode
    ) {
      console.error('❌ Missing required fields');
      return res.status(400).json({ 
        success: false,
        message: "Required fields are missing." 
      });
    }

    // ✅ Get user and check application status
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    console.log('👤 User found:', user.username);
    console.log('📋 Current application status:', user.sellerApplicationStatus);

    // ✅ Check if user can apply (without custom method)
    const canApply = !user.sellerApplicationStatus || 
                     user.sellerApplicationStatus === 'Available' || 
                     user.sellerApplicationStatus === 'Rejected';
    
    if (!canApply) {
      console.warn('⚠️ User cannot apply - status:', user.sellerApplicationStatus);
      return res.status(400).json({ 
        success: false,
        message: `Cannot apply. Current status: ${user.sellerApplicationStatus}. You can only apply if status is "Available" or "Rejected".` 
      });
    }

    // Check if seller record already exists
    const existingSeller = await Seller.findOne({ user: req.user.id });
    
    if (existingSeller) {
      // If seller exists with Pending or Approved status, don't allow new application
      if (existingSeller.status === 'Pending' || existingSeller.status === 'Approved') {
        console.warn('⚠️ Seller application already exists with status:', existingSeller.status);
        return res.status(400).json({ 
          success: false,
          message: `You already have a ${existingSeller.status.toLowerCase()} seller application.` 
        });
      }
      
      // If rejected, allow reapplication by updating existing record
      if (existingSeller.status === 'Rejected') {
        console.log('🔄 Updating rejected application...');
        
        existingSeller.fullName = fullName;
        existingSeller.email = email;
        existingSeller.phone = phone;
        existingSeller.sellerType = sellerType;
        existingSeller.businessName = sellerType !== "Individual" ? businessName : undefined;
        existingSeller.gstNumber = sellerType === "Business" ? gstNumber : undefined;
        existingSeller.bankAccountNumber = bankAccountNumber;
        existingSeller.bankIFSC = bankIFSC;
        existingSeller.bankHolderName = bankHolderName;
        existingSeller.pickupAddress = pickupAddress;
        existingSeller.status = "Pending";
        
        await existingSeller.save();
        
        // ✅ Update user application status to "Applied" (direct update)
        user.sellerApplicationStatus = 'Applied';
        await user.save();
        
        console.log('✅ Seller application updated successfully');
        console.log('✅ User status updated to: Applied');
        
        return res.status(200).json({ 
          success: true,
          message: "Seller application resubmitted successfully.",
          data: {
            applicationStatus: "Applied",
            sellerStatus: "Pending"
          }
        });
      }
    }

    // Create new seller application
    const newSeller = new Seller({
      user: req.user.id,
      fullName,
      email,
      phone,
      sellerType,
      businessName: sellerType !== "Individual" ? businessName : undefined,
      gstNumber: sellerType === "Business" ? gstNumber : undefined,
      bankAccountNumber,
      bankIFSC,
      bankHolderName,
      pickupAddress,
      status: "Pending"
    });

    await newSeller.save();
    console.log('✅ New seller application created');

    // ✅ Update user application status to "Applied" (direct update)
    user.sellerApplicationStatus = 'Applied';
    await user.save();
    console.log('✅ User status updated to: Applied');

    res.status(201).json({ 
      success: true,
      message: "Seller application submitted successfully.",
      data: {
        applicationStatus: "Applied",
        sellerStatus: "Pending"
      }
    });
  } catch (error) {
    console.error("❌ Seller form error:", error);
    res.status(500).json({ 
      success: false,
      message: "Something went wrong",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.put("/approve-seller/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Update seller status
    const seller = await Seller.findOneAndUpdate(
      { user: userId },
      { status: "Approved" },
      { new: true }
    );

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Ensure user.isSeller is set to true
    await User.findByIdAndUpdate(userId, { isSeller: true });

    res.status(200).json({ message: "Seller approved and role updated." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal error." });
  }
});

// Enhanced check route with detailed logging
router.get("/check/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log(`=== SELLER CHECK DEBUG ===`);
    console.log(`Checking seller status for user ID: ${userId}`);
    console.log(`Request URL: ${req.originalUrl}`);
    console.log(`Request method: ${req.method}`);

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log(`Invalid user ID format: ${userId}`);
      return res.status(400).json({ isSeller: false, message: "Invalid user ID format." });
    }

    // Check both user and seller collections
    const user = await User.findById(userId);
    const seller = await Seller.findOne({ user: userId });

    console.log(`User found:`, !!user, user ? `(isSeller: ${user.isSeller})` : '');
    console.log(`Seller found:`, !!seller, seller ? `(status: ${seller.status})` : '');

    // Case 1: User doesn't exist
    if (!user) {
      console.log(`User not found in database`);
      return res.status(404).json({ isSeller: false, message: "User not found." });
    }

    // Case 2: User has isSeller=true but no seller record (Data Inconsistency)
    if (user.isSeller && !seller) {
      console.warn(`Data inconsistency detected for user ${userId}: isSeller=true but no seller record`);
      
      // Reset user.isSeller to false
      await User.findByIdAndUpdate(userId, { isSeller: false });
      console.log(`Reset user.isSeller to false for user ${userId}`);
      
      return res.status(200).json({
        isSeller: false,
        status: "Inconsistency Fixed",
        message: "Data inconsistency detected and fixed. Please apply to become a seller.",
      });
    }

    // Case 3: User has isSeller=false and no seller record (Normal user)
    if (!user.isSeller && !seller) {
      console.log(`Normal user - no seller status`);
      return res.status(200).json({
        isSeller: false,
        status: "Not a Seller",
        message: "User is not a seller.",
      });
    }

    // Case 4: Seller record exists
    if (seller) {
      // Ensure user.isSeller matches seller status
      const shouldBeSellerFlag = seller.status === "Approved";
      
      console.log(`Seller status: ${seller.status}, shouldBeSellerFlag: ${shouldBeSellerFlag}, current user.isSeller: ${user.isSeller}`);
      
      if (user.isSeller !== shouldBeSellerFlag) {
        console.log(`Syncing user.isSeller flag for user ${userId} from ${user.isSeller} to ${shouldBeSellerFlag}`);
        await User.findByIdAndUpdate(userId, { isSeller: shouldBeSellerFlag });
      }

      if (seller.status === "Approved") {
        console.log(`Returning approved seller data`);
        return res.status(200).json({
          isSeller: true,
          status: seller.status,
          fullName: seller.fullName,
          sellerType: seller.sellerType,
        });
      }

      console.log(`Seller exists but not approved: ${seller.status}`);
      return res.status(200).json({
        isSeller: false,
        status: seller.status,
        message: `Seller application is ${seller.status.toLowerCase()}.`,
      });
    }

    // Fallback (shouldn't reach here)
    console.log(`Unexpected fallback case`);
    return res.status(200).json({
      isSeller: false,
      status: "Unknown",
      message: "Unable to determine seller status.",
    });

  } catch (error) {
    console.error("Seller check error:", error);
    res.status(500).json({ message: "Internal Server Error", isSeller: false });
  }
});

router.get("/user/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    console.log('🔍 Fetching seller for user ID:', userId);

    // Find seller by user reference
    const seller = await Seller.findOne({ user: userId });

    if (!seller) {
      console.log('❌ No seller found for user:', userId);
      return res.status(404).json({
        success: false,
        message: "Seller record not found for this user"
      });
    }

    console.log('✅ Seller found:', seller._id, 'Status:', seller.status);

    res.status(200).json({
      success: true,
      seller: seller
    });
  } catch (error) {
    console.error("❌ Error fetching seller by user ID:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});


// GET: Fetch seller profile info for logged-in user - FIXED
router.get("/get-seller-info", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log(`=== SELLER INFO DEBUG ===`);
    console.log("Fetching seller info for user ID:", userId);

    // ✅ FIXED: Remove populate to avoid schema error, fetch user separately if needed
    const seller = await Seller.findOne({ user: userId });

    if (!seller) {
      console.log("No seller found for user ID:", userId);
      return res.status(404).json({ 
        success: false,
        message: "Seller profile not found. Please apply to become a seller first." 
      });
    }

    console.log("Seller found:", seller.status);
    
    // Optionally fetch user data separately if needed
    const user = await User.findById(userId).select("username email avatar");
    
    res.status(200).json({
      success: true,
      data: {
        ...seller.toObject(),
        user: user // Include user data if needed
      },
      message: "Seller info fetched successfully"
    });
  } catch (error) {
    console.error("Error in get-seller-info:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal Server Error",
      error: error.message 
    });
  }
});

// Get all books posted by the logged-in seller
router.get("/myproducts", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // First, check if this user is a seller
    const seller = await Seller.findOne({ user: userId });

    if (!seller) {
      return res.status(403).json({
        success: false,
        message: "User is not a registered seller.",
      });
    }

    // Fetch books where seller is the current user's ID
    const books = await Book.find({ seller: seller._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      total: books.length,
      books,
    });
  } catch (err) {
    console.error("❌ Error fetching seller products:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// Update product status manually
router.put("/update-product-status/:id", authenticateToken, async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.headers.id;
    const { productStatus, autoStatusUpdate, expectedRestockDate } = req.body;

    // Validate status
    const validStatuses = ["Available", "Sold Out", "Not Available", "Arriving Soon"];
    if (!validStatuses.includes(productStatus)) {
      return res.status(400).json({ 
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` 
      });
    }

    // Find user and seller
    const user = await User.findById(userId);
    if (!user || !user.isSeller) {
      return res.status(403).json({ message: "Access denied" });
    }

    const seller = await Seller.findOne({ user: user._id });
    if (!seller) {
      return res.status(403).json({ message: "Seller account not found" });
    }

    // Find and verify book ownership
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.seller.toString() !== seller._id.toString()) {
      return res.status(403).json({ message: "No permission" });
    }

    // Update status
    book.productStatus = productStatus;
    book.autoStatusUpdate = autoStatusUpdate !== undefined ? autoStatusUpdate : false;

    if (productStatus === "Arriving Soon" && expectedRestockDate) {
      book.expectedRestockDate = new Date(expectedRestockDate);
    }

    if (productStatus === "Available" && book.stock === 0) {
      book.stock = 1;
    }

    if (productStatus === "Sold Out" || productStatus === "Not Available") {
      book.stock = 0;
    }

    await book.save();

    return res.status(200).json({ 
      message: `Product status updated to: ${productStatus}`,
      book: book
    });

  } catch (error) {
    console.error("Update product status error:", error);
    return res.status(500).json({ message: "Failed to update product status" });
  }
});

module.exports = router;