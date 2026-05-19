// // const express = require("express");
// // const router = express.Router();
// // const Seller = require("../models/seller");
// // const {authenticateToken} = require("./userAuth");
// // const Book = require("../models/Book"); 
// // const User = require("../models/user");

// // // Add this test route at the top to verify routes are working
// // router.get("/test", (req, res) => {
// //   res.json({ message: "Seller routes are working!", timestamp: new Date() });
// // });

// // router.get("/seller/user/:userId", authenticateToken, async (req, res) => {
// //   try {
// //     const { userId } = req.params;
// //     const requestingUserId = req.headers.id;

// //     console.log('🔍 [Seller Route] Fetching seller info for userId:', userId);
// //     console.log('👤 [Seller Route] Requesting user:', requestingUserId);

// //     // Validate userId format
// //     if (!userId || userId === 'undefined' || userId === 'null') {
// //       return res.status(400).json({ 
// //         success: false,
// //         message: "Invalid user ID" 
// //       });
// //     }

// //     // Security check: Users can only view their own seller info
// //     if (userId !== requestingUserId) {
// //       // Check if requesting user is admin
// //       const requestingUser = await User.findById(requestingUserId);
      
// //       if (!requestingUser || requestingUser.role !== 'admin') {
// //         console.warn('⚠️ [Seller Route] Unauthorized access attempt');
// //         return res.status(403).json({ 
// //           success: false,
// //           message: "Access denied. You can only view your own seller information." 
// //         });
// //       }
      
// //       console.log('✅ [Seller Route] Admin accessing seller info');
// //     }

// //     // Find seller record by user ID
// //     // This will find seller record regardless of status (Pending, Approved, Rejected)
// //     const seller = await Seller.findOne({ user: userId });

// //     if (!seller) {
// //       console.log('📭 [Seller Route] No seller record found for user:', userId);
// //       return res.status(404).json({ 
// //         success: false,
// //         message: "No seller application found for this user" 
// //       });
// //     }

// //     console.log('✅ [Seller Route] Seller record found:', {
// //       _id: seller._id,
// //       status: seller.status,
// //       businessName: seller.businessName || 'N/A',
// //       createdAt: seller.createdAt
// //     });

// //     // Return seller data
// //     res.status(200).json({
// //       success: true,
// //       message: "Seller information retrieved successfully",
// //       seller: {
// //         _id: seller._id,
// //         user: seller.user,
// //         businessName: seller.businessName,
// //         businessType: seller.businessType,
// //         address: seller.address,
// //         city: seller.city,
// //         state: seller.state,
// //         pincode: seller.pincode,
// //         phone: seller.phone,
// //         email: seller.email,
// //         gstNumber: seller.gstNumber,
// //         panNumber: seller.panNumber,
// //         bankAccountNumber: seller.bankAccountNumber,
// //         ifscCode: seller.ifscCode,
// //         status: seller.status,  // Pending, Approved, or Rejected
// //         createdAt: seller.createdAt,
// //         updatedAt: seller.updatedAt,
// //       },
// //     });
// //   } catch (error) {
// //     console.error("❌ [Seller Route] Error fetching seller info:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: "Internal server error while fetching seller information",
// //       error: process.env.NODE_ENV === 'development' ? error.message : undefined
// //     });
// //   }
// // });

// // // ==========================================
// // // GET CURRENT USER'S SELLER INFO
// // // ==========================================

// // /**
// //  * Get seller information for the currently authenticated user
// //  * @route GET /api/v1/seller/me
// //  * @access Private (authenticated users)
// //  * @description Convenience route to get own seller info without specifying userId
// //  */
// // router.get("/seller/me", authenticateToken, async (req, res) => {
// //   try {
// //     const userId = req.headers.id;

// //     console.log('🔍 [Seller Route] Fetching seller info for authenticated user:', userId);

// //     if (!userId) {
// //       return res.status(400).json({ 
// //         success: false,
// //         message: "User ID not found in request" 
// //       });
// //     }

// //     // Find seller record for authenticated user
// //     const seller = await Seller.findOne({ user: userId });

// //     if (!seller) {
// //       console.log('📭 [Seller Route] No seller record found for current user');
// //       return res.status(404).json({ 
// //         success: false,
// //         message: "You have not applied to become a seller yet" 
// //       });
// //     }

// //     console.log('✅ [Seller Route] Seller record found:', {
// //       _id: seller._id,
// //       status: seller.status,
// //       businessName: seller.businessName || 'N/A'
// //     });

// //     res.status(200).json({
// //       success: true,
// //       message: "Your seller information retrieved successfully",
// //       seller: {
// //         _id: seller._id,
// //         user: seller.user,
// //         businessName: seller.businessName,
// //         businessType: seller.businessType,
// //         address: seller.address,
// //         city: seller.city,
// //         state: seller.state,
// //         pincode: seller.pincode,
// //         phone: seller.phone,
// //         email: seller.email,
// //         gstNumber: seller.gstNumber,
// //         panNumber: seller.panNumber,
// //         bankAccountNumber: seller.bankAccountNumber,
// //         ifscCode: seller.ifscCode,
// //         status: seller.status,
// //         createdAt: seller.createdAt,
// //         updatedAt: seller.updatedAt,
// //       },
// //     });
// //   } catch (error) {
// //     console.error("❌ [Seller Route] Error fetching seller info:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: "Internal server error while fetching your seller information",
// //       error: process.env.NODE_ENV === 'development' ? error.message : undefined
// //     });
// //   }
// // });

// // // ==========================================
// // // CHECK IF USER IS A SELLER (Quick Check)
// // // ==========================================

// // /**
// //  * Quick check if user has a seller application and its status
// //  * @route GET /api/v1/seller/check/:userId
// //  * @access Private
// //  * @description Returns minimal info - just whether seller record exists and status
// //  */
// // router.get("/seller/check/:userId", authenticateToken, async (req, res) => {
// //   try {
// //     const { userId } = req.params;
// //     const requestingUserId = req.headers.id;

// //     // Security check
// //     if (userId !== requestingUserId) {
// //       const requestingUser = await User.findById(requestingUserId);
// //       if (!requestingUser || requestingUser.role !== 'admin') {
// //         return res.status(403).json({ 
// //           success: false,
// //           message: "Access denied" 
// //         });
// //       }
// //     }

// //     // Check if seller record exists
// //     const seller = await Seller.findOne({ user: userId }).select('status createdAt');

// //     res.status(200).json({
// //       success: true,
// //       hasSellerApplication: !!seller,
// //       status: seller?.status || null,
// //       appliedAt: seller?.createdAt || null,
// //     });
// //   } catch (error) {
// //     console.error("❌ [Seller Route] Error checking seller status:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: "Internal server error" 
// //     });
// //   }
// // });

// // // ==========================================
// // // GET SELLER APPLICATION HISTORY
// // // ==========================================

// // /**
// //  * Get history of all seller applications for a user (if they reapplied)
// //  * @route GET /api/v1/seller/history/:userId
// //  * @access Private (own data or admin)
// //  */
// // router.get("/seller/history/:userId", authenticateToken, async (req, res) => {
// //   try {
// //     const { userId } = req.params;
// //     const requestingUserId = req.headers.id;

// //     // Security check
// //     if (userId !== requestingUserId) {
// //       const requestingUser = await User.findById(requestingUserId);
// //       if (!requestingUser || requestingUser.role !== 'admin') {
// //         return res.status(403).json({ 
// //           success: false,
// //           message: "Access denied" 
// //         });
// //       }
// //     }

// //     // Get all seller records for this user (in case of reapplications)
// //     const sellerHistory = await Seller.find({ user: userId })
// //       .sort({ createdAt: -1 });

// //     res.status(200).json({
// //       success: true,
// //       message: "Seller application history retrieved",
// //       count: sellerHistory.length,
// //       applications: sellerHistory.map(seller => ({
// //         _id: seller._id,
// //         status: seller.status,
// //         businessName: seller.businessName,
// //         appliedAt: seller.createdAt,
// //         lastUpdated: seller.updatedAt,
// //       })),
// //     });
// //   } catch (error) {
// //     console.error("❌ [Seller Route] Error fetching seller history:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: "Internal server error" 
// //     });
// //   }
// // });


// // router.post("/become-seller", authenticateToken, async (req, res) => {
// //   try {
// //     const {
// //       fullName,
// //       email,
// //       phone,
// //       sellerType,
// //       businessName,
// //       gstNumber,
// //       bankAccountNumber,
// //       bankIFSC,
// //       bankHolderName,
// //       pickupAddress
// //     } = req.body;

// //     console.log('📥 Received seller application from user:', req.user.id);

// //     // Validate required fields
// //     if (
// //       !fullName ||
// //       !email ||
// //       !phone ||
// //       !sellerType ||
// //       !bankAccountNumber ||
// //       !bankIFSC ||
// //       !bankHolderName ||
// //       !pickupAddress ||
// //       !pickupAddress.city ||
// //       !pickupAddress.pincode
// //     ) {
// //       console.error('❌ Missing required fields');
// //       return res.status(400).json({ 
// //         success: false,
// //         message: "Required fields are missing." 
// //       });
// //     }

// //     // ✅ Get user and check application status
// //     const user = await User.findById(req.user.id);
    
// //     if (!user) {
// //       return res.status(404).json({ 
// //         success: false,
// //         message: "User not found" 
// //       });
// //     }

// //     console.log('👤 User found:', user.username);
// //     console.log('📋 Current application status:', user.sellerApplicationStatus);

// //     // ✅ Check if user can apply (without custom method)
// //     const canApply = !user.sellerApplicationStatus || 
// //                      user.sellerApplicationStatus === 'Available' || 
// //                      user.sellerApplicationStatus === 'Rejected';
    
// //     if (!canApply) {
// //       console.warn('⚠️ User cannot apply - status:', user.sellerApplicationStatus);
// //       return res.status(400).json({ 
// //         success: false,
// //         message: `Cannot apply. Current status: ${user.sellerApplicationStatus}. You can only apply if status is "Available" or "Rejected".` 
// //       });
// //     }

// //     // Check if seller record already exists
// //     const existingSeller = await Seller.findOne({ user: req.user.id });
    
// //     if (existingSeller) {
// //       // If seller exists with Pending or Approved status, don't allow new application
// //       if (existingSeller.status === 'Pending' || existingSeller.status === 'Approved') {
// //         console.warn('⚠️ Seller application already exists with status:', existingSeller.status);
// //         return res.status(400).json({ 
// //           success: false,
// //           message: `You already have a ${existingSeller.status.toLowerCase()} seller application.` 
// //         });
// //       }
      
// //       // If rejected, allow reapplication by updating existing record
// //       if (existingSeller.status === 'Rejected') {
// //         console.log('🔄 Updating rejected application...');
        
// //         existingSeller.fullName = fullName;
// //         existingSeller.email = email;
// //         existingSeller.phone = phone;
// //         existingSeller.sellerType = sellerType;
// //         existingSeller.businessName = sellerType !== "Individual" ? businessName : undefined;
// //         existingSeller.gstNumber = sellerType === "Business" ? gstNumber : undefined;
// //         existingSeller.bankAccountNumber = bankAccountNumber;
// //         existingSeller.bankIFSC = bankIFSC;
// //         existingSeller.bankHolderName = bankHolderName;
// //         existingSeller.pickupAddress = pickupAddress;
// //         existingSeller.status = "Pending";
        
// //         await existingSeller.save();
        
// //         // ✅ Update user application status to "Applied" (direct update)
// //         user.sellerApplicationStatus = 'Applied';
// //         await user.save();
        
// //         console.log('✅ Seller application updated successfully');
// //         console.log('✅ User status updated to: Applied');
        
// //         return res.status(200).json({ 
// //           success: true,
// //           message: "Seller application resubmitted successfully.",
// //           data: {
// //             applicationStatus: "Applied",
// //             sellerStatus: "Pending"
// //           }
// //         });
// //       }
// //     }

// //     // Create new seller application
// //     const newSeller = new Seller({
// //       user: req.user.id,
// //       fullName,
// //       email,
// //       phone,
// //       sellerType,
// //       businessName: sellerType !== "Individual" ? businessName : undefined,
// //       gstNumber: sellerType === "Business" ? gstNumber : undefined,
// //       bankAccountNumber,
// //       bankIFSC,
// //       bankHolderName,
// //       pickupAddress,
// //       status: "Pending"
// //     });

// //     await newSeller.save();
// //     console.log('✅ New seller application created');

// //     // ✅ Update user application status to "Applied" (direct update)
// //     user.sellerApplicationStatus = 'Applied';
// //     await user.save();
// //     console.log('✅ User status updated to: Applied');

// //     res.status(201).json({ 
// //       success: true,
// //       message: "Seller application submitted successfully.",
// //       data: {
// //         applicationStatus: "Applied",
// //         sellerStatus: "Pending"
// //       }
// //     });
// //   } catch (error) {
// //     console.error("❌ Seller form error:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: "Something went wrong",
// //       error: process.env.NODE_ENV === 'development' ? error.message : undefined
// //     });
// //   }
// // });

// // router.put("/approve-seller/:userId", async (req, res) => {
// //   try {
// //     const userId = req.params.userId;

// //     // Update seller status
// //     const seller = await Seller.findOneAndUpdate(
// //       { user: userId },
// //       { status: "Approved" },
// //       { new: true }
// //     );

// //     if (!seller) {
// //       return res.status(404).json({ message: "Seller not found" });
// //     }

// //     // Ensure user.isSeller is set to true
// //     await User.findByIdAndUpdate(userId, { isSeller: true });

// //     res.status(200).json({ message: "Seller approved and role updated." });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Internal error." });
// //   }
// // });

// // // Enhanced check route with detailed logging
// // router.get("/check/:userId", async (req, res) => {
// //   try {
// //     const { userId } = req.params;
    
// //     console.log(`=== SELLER CHECK DEBUG ===`);
// //     console.log(`Checking seller status for user ID: ${userId}`);
// //     console.log(`Request URL: ${req.originalUrl}`);
// //     console.log(`Request method: ${req.method}`);

// //     if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
// //       console.log(`Invalid user ID format: ${userId}`);
// //       return res.status(400).json({ isSeller: false, message: "Invalid user ID format." });
// //     }

// //     // Check both user and seller collections
// //     const user = await User.findById(userId);
// //     const seller = await Seller.findOne({ user: userId });

// //     console.log(`User found:`, !!user, user ? `(isSeller: ${user.isSeller})` : '');
// //     console.log(`Seller found:`, !!seller, seller ? `(status: ${seller.status})` : '');

// //     // Case 1: User doesn't exist
// //     if (!user) {
// //       console.log(`User not found in database`);
// //       return res.status(404).json({ isSeller: false, message: "User not found." });
// //     }

// //     // Case 2: User has isSeller=true but no seller record (Data Inconsistency)
// //     if (user.isSeller && !seller) {
// //       console.warn(`Data inconsistency detected for user ${userId}: isSeller=true but no seller record`);
      
// //       // Reset user.isSeller to false
// //       await User.findByIdAndUpdate(userId, { isSeller: false });
// //       console.log(`Reset user.isSeller to false for user ${userId}`);
      
// //       return res.status(200).json({
// //         isSeller: false,
// //         status: "Inconsistency Fixed",
// //         message: "Data inconsistency detected and fixed. Please apply to become a seller.",
// //       });
// //     }

// //     // Case 3: User has isSeller=false and no seller record (Normal user)
// //     if (!user.isSeller && !seller) {
// //       console.log(`Normal user - no seller status`);
// //       return res.status(200).json({
// //         isSeller: false,
// //         status: "Not a Seller",
// //         message: "User is not a seller.",
// //       });
// //     }

// //     // Case 4: Seller record exists
// //     if (seller) {
// //       // Ensure user.isSeller matches seller status
// //       const shouldBeSellerFlag = seller.status === "Approved";
      
// //       console.log(`Seller status: ${seller.status}, shouldBeSellerFlag: ${shouldBeSellerFlag}, current user.isSeller: ${user.isSeller}`);
      
// //       if (user.isSeller !== shouldBeSellerFlag) {
// //         console.log(`Syncing user.isSeller flag for user ${userId} from ${user.isSeller} to ${shouldBeSellerFlag}`);
// //         await User.findByIdAndUpdate(userId, { isSeller: shouldBeSellerFlag });
// //       }

// //       if (seller.status === "Approved") {
// //         console.log(`Returning approved seller data`);
// //         return res.status(200).json({
// //           isSeller: true,
// //           status: seller.status,
// //           fullName: seller.fullName,
// //           sellerType: seller.sellerType,
// //         });
// //       }

// //       console.log(`Seller exists but not approved: ${seller.status}`);
// //       return res.status(200).json({
// //         isSeller: false,
// //         status: seller.status,
// //         message: `Seller application is ${seller.status.toLowerCase()}.`,
// //       });
// //     }

// //     // Fallback (shouldn't reach here)
// //     console.log(`Unexpected fallback case`);
// //     return res.status(200).json({
// //       isSeller: false,
// //       status: "Unknown",
// //       message: "Unable to determine seller status.",
// //     });

// //   } catch (error) {
// //     console.error("Seller check error:", error);
// //     res.status(500).json({ message: "Internal Server Error", isSeller: false });
// //   }
// // });

// // router.get("/user/:userId", authenticateToken, async (req, res) => {
// //   try {
// //     const { userId } = req.params;

// //     console.log('🔍 Fetching seller for user ID:', userId);

// //     // Find seller by user reference
// //     const seller = await Seller.findOne({ user: userId });

// //     if (!seller) {
// //       console.log('❌ No seller found for user:', userId);
// //       return res.status(404).json({
// //         success: false,
// //         message: "Seller record not found for this user"
// //       });
// //     }

// //     console.log('✅ Seller found:', seller._id, 'Status:', seller.status);

// //     res.status(200).json({
// //       success: true,
// //       seller: seller
// //     });
// //   } catch (error) {
// //     console.error("❌ Error fetching seller by user ID:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: "Internal server error"
// //     });
// //   }
// // });


// // // GET: Fetch seller profile info for logged-in user - FIXED
// // router.get("/get-seller-info", authenticateToken, async (req, res) => {
// //   try {
// //     const userId = req.user.id;
    
// //     console.log(`=== SELLER INFO DEBUG ===`);
// //     console.log("Fetching seller info for user ID:", userId);

// //     // ✅ FIXED: Remove populate to avoid schema error, fetch user separately if needed
// //     const seller = await Seller.findOne({ user: userId });

// //     if (!seller) {
// //       console.log("No seller found for user ID:", userId);
// //       return res.status(404).json({ 
// //         success: false,
// //         message: "Seller profile not found. Please apply to become a seller first." 
// //       });
// //     }

// //     console.log("Seller found:", seller.status);
    
// //     // Optionally fetch user data separately if needed
// //     const user = await User.findById(userId).select("username email avatar");
    
// //     res.status(200).json({
// //       success: true,
// //       data: {
// //         ...seller.toObject(),
// //         user: user // Include user data if needed
// //       },
// //       message: "Seller info fetched successfully"
// //     });
// //   } catch (error) {
// //     console.error("Error in get-seller-info:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: "Internal Server Error",
// //       error: error.message 
// //     });
// //   }
// // });

// // // Get all books posted by the logged-in seller
// // router.get("/myproducts", authenticateToken, async (req, res) => {
// //   try {
// //     const userId = req.user.id;

// //     // First, check if this user is a seller
// //     const seller = await Seller.findOne({ user: userId });

// //     if (!seller) {
// //       return res.status(403).json({
// //         success: false,
// //         message: "User is not a registered seller.",
// //       });
// //     }

// //     // Fetch books where seller is the current user's ID
// //     const books = await Book.find({ seller: seller._id }).sort({ createdAt: -1 });

// //     return res.status(200).json({
// //       success: true,
// //       message: "Books fetched successfully",
// //       total: books.length,
// //       books,
// //     });
// //   } catch (err) {
// //     console.error("❌ Error fetching seller products:", err);
// //     res.status(500).json({
// //       success: false,
// //       message: "Internal Server Error",
// //     });
// //   }
// // });

// // // Update product status manually
// // router.put("/update-product-status/:id", authenticateToken, async (req, res) => {
// //   try {
// //     const bookId = req.params.id;
// //     const userId = req.headers.id;
// //     const { productStatus, autoStatusUpdate, expectedRestockDate } = req.body;

// //     // Validate status
// //     const validStatuses = ["Available", "Sold Out", "Not Available", "Arriving Soon"];
// //     if (!validStatuses.includes(productStatus)) {
// //       return res.status(400).json({ 
// //         message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` 
// //       });
// //     }

// //     // Find user and seller
// //     const user = await User.findById(userId);
// //     if (!user || !user.isSeller) {
// //       return res.status(403).json({ message: "Access denied" });
// //     }

// //     const seller = await Seller.findOne({ user: user._id });
// //     if (!seller) {
// //       return res.status(403).json({ message: "Seller account not found" });
// //     }

// //     // Find and verify book ownership
// //     const book = await Book.findById(bookId);
// //     if (!book) {
// //       return res.status(404).json({ message: "Book not found" });
// //     }

// //     if (book.seller.toString() !== seller._id.toString()) {
// //       return res.status(403).json({ message: "No permission" });
// //     }

// //     // Update status
// //     book.productStatus = productStatus;
// //     book.autoStatusUpdate = autoStatusUpdate !== undefined ? autoStatusUpdate : false;

// //     if (productStatus === "Arriving Soon" && expectedRestockDate) {
// //       book.expectedRestockDate = new Date(expectedRestockDate);
// //     }

// //     if (productStatus === "Available" && book.stock === 0) {
// //       book.stock = 1;
// //     }

// //     if (productStatus === "Sold Out" || productStatus === "Not Available") {
// //       book.stock = 0;
// //     }

// //     await book.save();

// //     return res.status(200).json({ 
// //       message: `Product status updated to: ${productStatus}`,
// //       book: book
// //     });

// //   } catch (error) {
// //     console.error("Update product status error:", error);
// //     return res.status(500).json({ message: "Failed to update product status" });
// //   }
// // });

// // module.exports = router;
// //new code

// const express = require("express");
// const router = express.Router();
// const Seller = require("../models/seller");
// const {authenticateToken} = require("./userAuth");
// const Book = require("../models/book"); 
// const User = require("../models/user");
// const Order = require("../models/order");
// const {
//   getDashboardStats,
//   getSellerOrders,
//   updateOrderStatus,
//   getMyProducts,
//   getNewOrderNotifications,
//   requestWithdrawal,
// } = require("../controllers/sellerController");

// // ==========================================
// // TEST ROUTE
// // ==========================================
// router.get("/test", (req, res) => {
//   res.json({ message: "Seller routes are working!", timestamp: new Date() });
// });

// // ==========================================
// // SELLER ORDER DASHBOARD ROUTES
// // ==========================================

// /**
//  * Get all orders for seller's products
//  * @route GET /api/v1/seller/orders
//  * @access Private (Sellers only)
//  */
// router.get("/orders", authenticateToken, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

//     console.log('📦 [Seller Orders] Fetching orders for user:', userId);

//     // Find seller record
//     const seller = await Seller.findOne({ user: userId });
    
//     if (!seller) {
//       return res.status(403).json({
//         success: false,
//         message: "User is not a registered seller.",
//       });
//     }

//     if (seller.status !== 'Approved') {
//       return res.status(403).json({
//         success: false,
//         message: "Seller account is not approved yet.",
//       });
//     }

//     // Build query to find orders containing seller's books
//     const sellerBooks = await Book.find({ seller: seller._id }).select('_id');
//     const bookIds = sellerBooks.map(book => book._id);

//     let orderQuery = {
//       'book': { $in: bookIds }
//     };

//     // Filter by status if provided
//     if (status && status !== 'all') {
//       orderQuery.orderStatus = status;
//     }

//     // Pagination
//     const skip = (parseInt(page) - 1) * parseInt(limit);
//     const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

//     // Fetch orders with populated data
//     const orders = await Order.find(orderQuery)
//       .populate({
//         path: 'user',
//         select: 'username email avatar'
//       })
//       .populate({
//         path: 'book',
//         select: 'title url price language'
//       })
//       .sort(sortOptions)
//       .skip(skip)
//       .limit(parseInt(limit));

//     const totalOrders = await Order.countDocuments(orderQuery);

//     // Calculate order statistics
//     const stats = await Order.aggregate([
//       { $match: { book: { $in: bookIds } } },
//       {
//         $group: {
//           _id: '$orderStatus',
//           count: { $sum: 1 },
//           totalAmount: { $sum: '$amountPayable' }
//         }
//       }
//     ]);

//     const statsFormatted = {
//       total: totalOrders,
//       pending: stats.find(s => s._id === 'Order Placed')?.count || 0,
//       processing: stats.find(s => s._id === 'Processing')?.count || 0,
//       shipped: stats.find(s => s._id === 'Shipped')?.count || 0,
//       delivered: stats.find(s => s._id === 'Delivered')?.count || 0,
//       cancelled: stats.find(s => s._id === 'Cancelled')?.count || 0,
//       totalRevenue: stats.reduce((sum, s) => sum + (s.totalAmount || 0), 0)
//     };

//     console.log('✅ [Seller Orders] Orders fetched successfully');

//     res.status(200).json({
//       success: true,
//       message: "Orders fetched successfully",
//       data: {
//         orders,
//         pagination: {
//           currentPage: parseInt(page),
//           totalPages: Math.ceil(totalOrders / parseInt(limit)),
//           totalOrders,
//           limit: parseInt(limit)
//         },
//         stats: statsFormatted
//       }
//     });

//   } catch (error) {
//     console.error("❌ [Seller Orders] Error fetching orders:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// /**
//  * Get single order details
//  * @route GET /api/v1/seller/orders/:orderId
//  * @access Private (Sellers only)
//  */
// router.get("/orders/:orderId", authenticateToken, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { orderId } = req.params;

//     console.log('📦 [Seller Orders] Fetching order details:', orderId);

//     // Find seller record
//     const seller = await Seller.findOne({ user: userId });
    
//     if (!seller) {
//       return res.status(403).json({
//         success: false,
//         message: "User is not a registered seller.",
//       });
//     }

//     // Fetch order with full details
//     const order = await Order.findById(orderId)
//       .populate({
//         path: 'user',
//         select: 'username email avatar phone'
//       })
//       .populate({
//         path: 'book',
//         select: 'title url price language seller description'
//       });

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found"
//       });
//     }

//     // Verify this order contains seller's book
//     if (order.book.seller.toString() !== seller._id.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: "Access denied. This order does not belong to you."
//       });
//     }

//     console.log('✅ [Seller Orders] Order details fetched');

//     res.status(200).json({
//       success: true,
//       message: "Order details fetched successfully",
//       order
//     });

//   } catch (error) {
//     console.error("❌ [Seller Orders] Error fetching order details:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// /**
//  * Update order status - FIXED VERSION
//  * @route PUT /api/v1/seller/orders/:orderId/status
//  * @access Private (Sellers only)
//  */
// router.put("/orders/:orderId/status", authenticateToken, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { orderId } = req.params;
//     const { status, trackingNumber, estimatedDelivery, notes } = req.body;

//     console.log('📦 [Seller Orders] Updating order status:', orderId, 'to:', status);
//     console.log('📦 Request body:', req.body);

//     // Validate status
//     const validStatuses = ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
//       });
//     }

//     // Find seller record
//     const seller = await Seller.findOne({ user: userId });
    
//     if (!seller || seller.status !== 'Approved') {
//       return res.status(403).json({
//         success: false,
//         message: "Seller account not found or not approved.",
//       });
//     }

//     // Fetch order
//     const order = await Order.findById(orderId).populate('book');

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found"
//       });
//     }

//     // Verify ownership
//     if (order.book.seller.toString() !== seller._id.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: "Access denied. This order does not belong to you."
//       });
//     }

//     // Prevent certain status changes
//     if (order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled') {
//       return res.status(400).json({
//         success: false,
//         message: `Cannot update order that is already ${order.orderStatus.toLowerCase()}`
//       });
//     }

//     // Update order status
//     order.orderStatus = status;
    
//     if (trackingNumber) {
//       order.trackingNumber = trackingNumber;
//     }
    
//     if (estimatedDelivery) {
//       order.expectedDeliveryDate = new Date(estimatedDelivery);
//     }

//     // Update current location based on status
//     const locationMap = {
//       'Order Placed': 'Warehouse',
//       'Processing': 'Processing Center',
//       'Shipped': 'In Transit',
//       'Out for Delivery': order.shippingAddress?.city || 'Delivery Hub',
//       'Delivered': 'Delivered',
//       'Cancelled': 'Cancelled'
//     };
    
//     order.currentLocation = locationMap[status];

//     // Add to tracking history
//     order.trackingHistory.push({
//       status: status,
//       location: order.currentLocation,
//       date: new Date(),
//       notes: notes || `Order status updated to ${status}`
//     });

//     // If delivered, set actual delivery date and update payment status for COD
//     if (status === 'Delivered') {
//       order.actualDeliveryDate = new Date();
//       if (order.paymentMethod === 'COD' && order.paymentStatus === 'Pending') {
//         order.paymentStatus = 'Success';
//       }
//     }

//     await order.save();

//     console.log('✅ [Seller Orders] Order status updated successfully');

//     // Re-fetch order with populated data
//     const updatedOrder = await Order.findById(orderId)
//       .populate('user', 'username email avatar')
//       .populate('book', 'title url price language');

//     res.status(200).json({
//       success: true,
//       message: `Order status updated to: ${status}`,
//       order: updatedOrder
//     });

//   } catch (error) {
//     console.error("❌ [Seller Orders] Error updating order status:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// /**
//  * Add custom tracking update - NEW FEATURE
//  * @route POST /api/v1/seller/orders/:orderId/tracking
//  * @access Private (Sellers only)
//  */
// router.post("/orders/:orderId/tracking", authenticateToken, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { orderId } = req.params;
//     const { status, location, notes } = req.body;

//     console.log('📍 [Seller Orders] Adding custom tracking update:', orderId);

//     if (!status || !location) {
//       return res.status(400).json({
//         success: false,
//         message: "Status and location are required"
//       });
//     }

//     // Find seller record
//     const seller = await Seller.findOne({ user: userId });
    
//     if (!seller || seller.status !== 'Approved') {
//       return res.status(403).json({
//         success: false,
//         message: "Seller account not found or not approved.",
//       });
//     }

//     // Fetch order
//     const order = await Order.findById(orderId).populate('book');

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found"
//       });
//     }

//     // Verify ownership
//     if (order.book.seller.toString() !== seller._id.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: "Access denied. This order does not belong to you."
//       });
//     }

//     // Update current location
//     order.currentLocation = location;

//     // Add to tracking history
//     order.trackingHistory.push({
//       status: status,
//       location: location,
//       date: new Date(),
//       notes: notes || ''
//     });

//     await order.save();

//     console.log('✅ [Seller Orders] Custom tracking update added successfully');

//     // Re-fetch order with populated data
//     const updatedOrder = await Order.findById(orderId)
//       .populate('user', 'username email avatar')
//       .populate('book', 'title url price language');

//     res.status(200).json({
//       success: true,
//       message: "Tracking update added successfully",
//       order: updatedOrder
//     });

//   } catch (error) {
//     console.error("❌ [Seller Orders] Error adding tracking update:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// /**
//  * Bulk update order statuses
//  * @route PUT /api/v1/seller/orders/bulk-update
//  * @access Private (Sellers only)
//  */
// router.put("/orders/bulk-update", authenticateToken, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { orderIds, status } = req.body;

//     console.log('📦 [Seller Orders] Bulk updating orders:', orderIds?.length);

//     if (!Array.isArray(orderIds) || orderIds.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Order IDs array is required"
//       });
//     }

//     // Find seller record
//     const seller = await Seller.findOne({ user: userId });
    
//     if (!seller || seller.status !== 'Approved') {
//       return res.status(403).json({
//         success: false,
//         message: "Seller account not found or not approved.",
//       });
//     }

//     // Get seller's book IDs
//     const sellerBooks = await Book.find({ seller: seller._id }).select('_id');
//     const bookIds = sellerBooks.map(book => book._id.toString());

//     // Update orders
//     const result = await Order.updateMany(
//       {
//         _id: { $in: orderIds },
//         book: { $in: bookIds },
//         orderStatus: { $nin: ['Delivered', 'Cancelled'] }
//       },
//       {
//         $set: { orderStatus: status }
//       }
//     );

//     console.log('✅ [Seller Orders] Bulk update completed');

//     res.status(200).json({
//       success: true,
//       message: `${result.modifiedCount} orders updated successfully`,
//       modifiedCount: result.modifiedCount
//     });

//   } catch (error) {
//     console.error("❌ [Seller Orders] Error in bulk update:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // ==========================================
// // SELLER PROFILE ROUTES
// // ==========================================

// /**
//  * Get seller information by user ID
//  * @route GET /api/v1/seller/user/:userId
//  * @access Private
//  */
// router.get("/seller/user/:userId", authenticateToken, async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const requestingUserId = req.headers.id;

//     console.log('🔍 [Seller Route] Fetching seller info for userId:', userId);
//     console.log('👤 [Seller Route] Requesting user:', requestingUserId);

//     // Validate userId format
//     if (!userId || userId === 'undefined' || userId === 'null') {
//       return res.status(400).json({ 
//         success: false,
//         message: "Invalid user ID" 
//       });
//     }

//     // Security check: Users can only view their own seller info
//     if (userId !== requestingUserId) {
//       // Check if requesting user is admin
//       const requestingUser = await User.findById(requestingUserId);
      
//       if (!requestingUser || requestingUser.role !== 'admin') {
//         console.warn('⚠️ [Seller Route] Unauthorized access attempt');
//         return res.status(403).json({ 
//           success: false,
//           message: "Access denied. You can only view your own seller information." 
//         });
//       }
      
//       console.log('✅ [Seller Route] Admin accessing seller info');
//     }

//     // Find seller record by user ID
//     const seller = await Seller.findOne({ user: userId });

//     if (!seller) {
//       console.log('📭 [Seller Route] No seller record found for user:', userId);
//       return res.status(404).json({ 
//         success: false,
//         message: "No seller application found for this user" 
//       });
//     }

//     console.log('✅ [Seller Route] Seller record found:', {
//       _id: seller._id,
//       status: seller.status,
//       businessName: seller.businessName || 'N/A',
//       createdAt: seller.createdAt
//     });

//     // Return seller data
//     res.status(200).json({
//       success: true,
//       message: "Seller information retrieved successfully",
//       seller: {
//         _id: seller._id,
//         user: seller.user,
//         businessName: seller.businessName,
//         businessType: seller.businessType,
//         address: seller.address,
//         city: seller.city,
//         state: seller.state,
//         pincode: seller.pincode,
//         phone: seller.phone,
//         email: seller.email,
//         gstNumber: seller.gstNumber,
//         panNumber: seller.panNumber,
//         bankAccountNumber: seller.bankAccountNumber,
//         ifscCode: seller.ifscCode,
//         status: seller.status,
//         createdAt: seller.createdAt,
//         updatedAt: seller.updatedAt,
//       },
//     });
//   } catch (error) {
//     console.error("❌ [Seller Route] Error fetching seller info:", error);
//     res.status(500).json({ 
//       success: false,
//       message: "Internal server error while fetching seller information",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// /**
//  * Get current user's seller information
//  * @route GET /api/v1/seller/me
//  * @access Private
//  */
// router.get("/seller/me", authenticateToken, async (req, res) => {
//   try {
//     const userId = req.headers.id;

//     console.log('🔍 [Seller Route] Fetching seller info for authenticated user:', userId);

//     if (!userId) {
//       return res.status(400).json({ 
//         success: false,
//         message: "User ID not found in request" 
//       });
//     }

//     // Find seller record for authenticated user
//     const seller = await Seller.findOne({ user: userId });

//     if (!seller) {
//       console.log('📭 [Seller Route] No seller record found for current user');
//       return res.status(404).json({ 
//         success: false,
//         message: "You have not applied to become a seller yet" 
//       });
//     }

//     console.log('✅ [Seller Route] Seller record found:', {
//       _id: seller._id,
//       status: seller.status,
//       businessName: seller.businessName || 'N/A'
//     });

//     res.status(200).json({
//       success: true,
//       message: "Your seller information retrieved successfully",
//       seller: {
//         _id: seller._id,
//         user: seller.user,
//         businessName: seller.businessName,
//         businessType: seller.businessType,
//         address: seller.address,
//         city: seller.city,
//         state: seller.state,
//         pincode: seller.pincode,
//         phone: seller.phone,
//         email: seller.email,
//         gstNumber: seller.gstNumber,
//         panNumber: seller.panNumber,
//         bankAccountNumber: seller.bankAccountNumber,
//         ifscCode: seller.ifscCode,
//         status: seller.status,
//         createdAt: seller.createdAt,
//         updatedAt: seller.updatedAt,
//       },
//     });
//   } catch (error) {
//     console.error("❌ [Seller Route] Error fetching seller info:", error);
//     res.status(500).json({ 
//       success: false,
//       message: "Internal server error while fetching your seller information",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// /**
//  * Quick check if user has seller application
//  * @route GET /api/v1/seller/check/:userId
//  * @access Private
//  */
// router.get("/seller/check/:userId", authenticateToken, async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const requestingUserId = req.headers.id;

//     // Security check
//     if (userId !== requestingUserId) {
//       const requestingUser = await User.findById(requestingUserId);
//       if (!requestingUser || requestingUser.role !== 'admin') {
//         return res.status(403).json({ 
//           success: false,
//           message: "Access denied" 
//         });
//       }
//     }

//     // Check if seller record exists
//     const seller = await Seller.findOne({ user: userId }).select('status createdAt');

//     res.status(200).json({
//       success: true,
//       hasSellerApplication: !!seller,
//       status: seller?.status || null,
//       appliedAt: seller?.createdAt || null,
//     });
//   } catch (error) {
//     console.error("❌ [Seller Route] Error checking seller status:", error);
//     res.status(500).json({ 
//       success: false,
//       message: "Internal server error" 
//     });
//   }
// });

// /**
//  * Get seller application history
//  * @route GET /api/v1/seller/history/:userId
//  * @access Private
//  */
// router.get("/seller/history/:userId", authenticateToken, async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const requestingUserId = req.headers.id;

//     // Security check
//     if (userId !== requestingUserId) {
//       const requestingUser = await User.findById(requestingUserId);
//       if (!requestingUser || requestingUser.role !== 'admin') {
//         return res.status(403).json({ 
//           success: false,
//           message: "Access denied" 
//         });
//       }
//     }

//     // Get all seller records for this user (in case of reapplications)
//     const sellerHistory = await Seller.find({ user: userId })
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       message: "Seller application history retrieved",
//       count: sellerHistory.length,
//       applications: sellerHistory.map(seller => ({
//         _id: seller._id,
//         status: seller.status,
//         businessName: seller.businessName,
//         appliedAt: seller.createdAt,
//         lastUpdated: seller.updatedAt,
//       })),
//     });
//   } catch (error) {
//     console.error("❌ [Seller Route] Error fetching seller history:", error);
//     res.status(500).json({ 
//       success: false,
//       message: "Internal server error" 
//     });
//   }
// });

// // ==========================================
// // SELLER APPLICATION ROUTES
// // ==========================================

// /**
//  * Submit seller application
//  * @route POST /api/v1/become-seller
//  * @access Private
//  */
// router.post("/become-seller", authenticateToken, async (req, res) => {
//   try {
//     const {
//       fullName,
//       email,
//       phone,
//       sellerType,
//       businessName,
//       gstNumber,
//       bankAccountNumber,
//       bankIFSC,
//       bankHolderName,
//       pickupAddress
//     } = req.body;

//     console.log('📥 Received seller application from user:', req.user.id);

//     // Validate required fields
//     if (
//       !fullName ||
//       !email ||
//       !phone ||
//       !sellerType ||
//       !bankAccountNumber ||
//       !bankIFSC ||
//       !bankHolderName ||
//       !pickupAddress ||
//       !pickupAddress.city ||
//       !pickupAddress.pincode
//     ) {
//       console.error('❌ Missing required fields');
//       return res.status(400).json({ 
//         success: false,
//         message: "Required fields are missing." 
//       });
//     }

//     // Get user and check application status
//     const user = await User.findById(req.user.id);
    
//     if (!user) {
//       return res.status(404).json({ 
//         success: false,
//         message: "User not found" 
//       });
//     }

//     console.log('👤 User found:', user.username);
//     console.log('📋 Current application status:', user.sellerApplicationStatus);

//     // Check if user can apply
//     const canApply = !user.sellerApplicationStatus || 
//                      user.sellerApplicationStatus === 'Available' || 
//                      user.sellerApplicationStatus === 'Rejected';
    
//     if (!canApply) {
//       console.warn('⚠️ User cannot apply - status:', user.sellerApplicationStatus);
//       return res.status(400).json({ 
//         success: false,
//         message: `Cannot apply. Current status: ${user.sellerApplicationStatus}. You can only apply if status is "Available" or "Rejected".` 
//       });
//     }

//     // Check if seller record already exists
//     const existingSeller = await Seller.findOne({ user: req.user.id });
    
//     if (existingSeller) {
//       // If seller exists with Pending or Approved status, don't allow new application
//       if (existingSeller.status === 'Pending' || existingSeller.status === 'Approved') {
//         console.warn('⚠️ Seller application already exists with status:', existingSeller.status);
//         return res.status(400).json({ 
//           success: false,
//           message: `You already have a ${existingSeller.status.toLowerCase()} seller application.` 
//         });
//       }
      
//       // If rejected, allow reapplication by updating existing record
//       if (existingSeller.status === 'Rejected') {
//         console.log('🔄 Updating rejected application...');
        
//         existingSeller.fullName = fullName;
//         existingSeller.email = email;
//         existingSeller.phone = phone;
//         existingSeller.sellerType = sellerType;
//         existingSeller.businessName = sellerType !== "Individual" ? businessName : undefined;
//         existingSeller.gstNumber = sellerType === "Business" ? gstNumber : undefined;
//         existingSeller.bankAccountNumber = bankAccountNumber;
//         existingSeller.bankIFSC = bankIFSC;
//         existingSeller.bankHolderName = bankHolderName;
//         existingSeller.pickupAddress = pickupAddress;
//         existingSeller.status = "Pending";
        
//         await existingSeller.save();
        
//         // Update user application status to "Applied"
//         user.sellerApplicationStatus = 'Applied';
//         await user.save();
        
//         console.log('✅ Seller application updated successfully');
//         console.log('✅ User status updated to: Applied');
        
//         return res.status(200).json({ 
//           success: true,
//           message: "Seller application resubmitted successfully.",
//           data: {
//             applicationStatus: "Applied",
//             sellerStatus: "Pending"
//           }
//         });
//       }
//     }

//     // Create new seller application
//     const newSeller = new Seller({
//       user: req.user.id,
//       fullName,
//       email,
//       phone,
//       sellerType,
//       businessName: sellerType !== "Individual" ? businessName : undefined,
//       gstNumber: sellerType === "Business" ? gstNumber : undefined,
//       bankAccountNumber,
//       bankIFSC,
//       bankHolderName,
//       pickupAddress,
//       status: "Pending"
//     });

//     await newSeller.save();
//     console.log('✅ New seller application created');

//     // Update user application status to "Applied"
//     user.sellerApplicationStatus = 'Applied';
//     await user.save();
//     console.log('✅ User status updated to: Applied');

//     res.status(201).json({ 
//       success: true,
//       message: "Seller application submitted successfully.",
//       data: {
//         applicationStatus: "Applied",
//         sellerStatus: "Pending"
//       }
//     });
//   } catch (error) {
//     console.error("❌ Seller form error:", error);
//     res.status(500).json({ 
//       success: false,
//       message: "Something went wrong",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// /**
//  * Approve seller application (Admin only)
//  * @route PUT /api/v1/approve-seller/:userId
//  * @access Private (Admin)
//  */
// router.put("/approve-seller/:userId", async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     // Update seller status
//     const seller = await Seller.findOneAndUpdate(
//       { user: userId },
//       { status: "Approved" },
//       { new: true }
//     );

//     if (!seller) {
//       return res.status(404).json({ message: "Seller not found" });
//     }

//     // Ensure user.isSeller is set to true
//     await User.findByIdAndUpdate(userId, { isSeller: true });

//     res.status(200).json({ message: "Seller approved and role updated." });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal error." });
//   }
// });

// /**
//  * Check seller status (Public route with detailed logging)
//  * @route GET /api/v1/check/:userId
//  * @access Public
//  */
// router.get("/check/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;
    
//     console.log(`=== SELLER CHECK DEBUG ===`);
//     console.log(`Checking seller status for user ID: ${userId}`);
//     console.log(`Request URL: ${req.originalUrl}`);
//     console.log(`Request method: ${req.method}`);

//     if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
//       console.log(`Invalid user ID format: ${userId}`);
//       return res.status(400).json({ isSeller: false, message: "Invalid user ID format." });
//     }

//     // Check both user and seller collections
//     const user = await User.findById(userId);
//     const seller = await Seller.findOne({ user: userId });

//     console.log(`User found:`, !!user, user ? `(isSeller: ${user.isSeller})` : '');
//     console.log(`Seller found:`, !!seller, seller ? `(status: ${seller.status})` : '');

//     // Case 1: User doesn't exist
//     if (!user) {
//       console.log(`User not found in database`);
//       return res.status(404).json({ isSeller: false, message: "User not found." });
//     }

//     // Case 2: User has isSeller=true but no seller record (Data Inconsistency)
//     if (user.isSeller && !seller) {
//       console.warn(`Data inconsistency detected for user ${userId}: isSeller=true but no seller record`);
      
//       // Reset user.isSeller to false
//       await User.findByIdAndUpdate(userId, { isSeller: false });
//       console.log(`Reset user.isSeller to false for user ${userId}`);
      
//       return res.status(200).json({
//         isSeller: false,
//         status: "Inconsistency Fixed",
//         message: "Data inconsistency detected and fixed. Please apply to become a seller.",
//       });
//     }

//     // Case 3: User has isSeller=false and no seller record (Normal user)
//     if (!user.isSeller && !seller) {
//       console.log(`Normal user - no seller status`);
//       return res.status(200).json({
//         isSeller: false,
//         status: "Not a Seller",
//         message: "User is not a seller.",
//       });
//     }

//     // Case 4: Seller record exists
//     if (seller) {
//       // Ensure user.isSeller matches seller status
//       const shouldBeSellerFlag = seller.status === "Approved";
      
//       console.log(`Seller status: ${seller.status}, shouldBeSellerFlag: ${shouldBeSellerFlag}, current user.isSeller: ${user.isSeller}`);
      
//       if (user.isSeller !== shouldBeSellerFlag) {
//         console.log(`Syncing user.isSeller flag for user ${userId} from ${user.isSeller} to ${shouldBeSellerFlag}`);
//         await User.findByIdAndUpdate(userId, { isSeller: shouldBeSellerFlag });
//       }

//       if (seller.status === "Approved") {
//         console.log(`Returning approved seller data`);
//         return res.status(200).json({
//           isSeller: true,
//           status: seller.status,
//           fullName: seller.fullName,
//           sellerType: seller.sellerType,
//         });
//       }

//       console.log(`Seller exists but not approved: ${seller.status}`);
//       return res.status(200).json({
//         isSeller: false,
//         status: seller.status,
//         message: `Seller application is ${seller.status.toLowerCase()}.`,
//       });
//     }

//     // Fallback (shouldn't reach here)
//     console.log(`Unexpected fallback case`);
//     return res.status(200).json({
//       isSeller: false,
//       status: "Unknown",
//       message: "Unable to determine seller status.",
//     });

//   } catch (error) {
//     console.error("Seller check error:", error);
//     res.status(500).json({ message: "Internal Server Error", isSeller: false });
//   }
// });

// /**
//  * Get seller by user ID
//  * @route GET /api/v1/user/:userId
//  * @access Private
//  */
// router.get("/user/:userId", authenticateToken, async (req, res) => {
//   try {
//     const { userId } = req.params;

//     console.log('🔍 Fetching seller for user ID:', userId);

//     // Find seller by user reference
//     const seller = await Seller.findOne({ user: userId });

//     if (!seller) {
//       console.log('❌ No seller found for user:', userId);
//       return res.status(404).json({
//         success: false,
//         message: "Seller record not found for this user"
//       });
//     }

//     console.log('✅ Seller found:', seller._id, 'Status:', seller.status);

//     res.status(200).json({
//       success: true,
//       seller: seller
//     });
//   } catch (error) {
//     console.error("❌ Error fetching seller by user ID:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// });

// /**
//  * Get seller profile info for logged-in user
//  * @route GET /api/v1/get-seller-info
//  * @access Private
//  */
// router.get("/get-seller-info", authenticateToken, async (req, res) => {
//   try {
//     const userId = req.user.id;
    
//     console.log(`=== SELLER INFO DEBUG ===`);
//     console.log("Fetching seller info for user ID:", userId);

//     const seller = await Seller.findOne({ user: userId });

//     if (!seller) {
//       console.log("No seller found for user ID:", userId);
//       return res.status(404).json({ 
//         success: false,
//         message: "Seller profile not found. Please apply to become a seller first." 
//       });
//     }

//     console.log("Seller found:", seller.status);
    
//     // Optionally fetch user data separately if needed
//     const user = await User.findById(userId).select("username email avatar");
    
//     res.status(200).json({
//       success: true,
//       data: {
//         ...seller.toObject(),
//         user: user
//       },
//       message: "Seller info fetched successfully"
//     });
//   } catch (error) {
//     console.error("Error in get-seller-info:", error);
//     res.status(500).json({ 
//       success: false,
//       message: "Internal Server Error",
//       error: error.message 
//     });
//   }
// });

// // ==========================================
// // SELLER PRODUCT ROUTES
// // ==========================================

// /**
//  * Get all books posted by the logged-in seller
//  * @route GET /api/v1/myproducts
//  * @access Private
//  */
// router.get("/myproducts", authenticateToken, async (req, res) => {
//   try {
//     const userId = req.user.id;

//     // First, check if this user is a seller
//     const seller = await Seller.findOne({ user: userId });

//     if (!seller) {
//       return res.status(403).json({
//         success: false,
//         message: "User is not a registered seller.",
//       });
//     }

//     // Fetch books where seller is the current user's ID
//     const books = await Book.find({ seller: seller._id }).sort({ createdAt: -1 });

//     return res.status(200).json({
//       success: true,
//       message: "Books fetched successfully",
//       total: books.length,
//       books,
//     });
//   } catch (err) {
//     console.error("❌ Error fetching seller products:", err);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// });

// /**
//  * Update product status manually
//  * @route PUT /api/v1/update-product-status/:id
//  * @access Private
//  */
// router.put("/update-product-status/:id", authenticateToken, async (req, res) => {
//   try {
//     const bookId = req.params.id;
//     const userId = req.headers.id;
//     const { productStatus, autoStatusUpdate, expectedRestockDate } = req.body;

//     // Validate status
//     const validStatuses = ["Available", "Sold Out", "Not Available", "Arriving Soon"];
//     if (!validStatuses.includes(productStatus)) {
//       return res.status(400).json({ 
//         message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` 
//       });
//     }

//     // Find user and seller
//     const user = await User.findById(userId);
//     if (!user || !user.isSeller) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const seller = await Seller.findOne({ user: user._id });
//     if (!seller) {
//       return res.status(403).json({ message: "Seller account not found" });
//     }

//     // Find and verify book ownership
//     const book = await Book.findById(bookId);
//     if (!book) {
//       return res.status(404).json({ message: "Book not found" });
//     }

//     if (book.seller.toString() !== seller._id.toString()) {
//       return res.status(403).json({ message: "No permission" });
//     }

//     // Update status
//     book.productStatus = productStatus;
//     book.autoStatusUpdate = autoStatusUpdate !== undefined ? autoStatusUpdate : false;

//     if (productStatus === "Arriving Soon" && expectedRestockDate) {
//       book.expectedRestockDate = new Date(expectedRestockDate);
//     }

//     if (productStatus === "Available" && book.stock === 0) {
//       book.stock = 1;
//     }

//     if (productStatus === "Sold Out" || productStatus === "Not Available") {
//       book.stock = 0;
//     }

//     await book.save();

//     return res.status(200).json({ 
//       message: `Product status updated to: ${productStatus}`,
//       book: book
//     });

//   } catch (error) {
//     console.error("Update product status error:", error);
//     return res.status(500).json({ message: "Failed to update product status" });
//   }
// });

// module.exports = router;





const express = require("express");
const router = express.Router();
const Seller = require("../models/seller");
const {authenticateToken} = require("./userAuth");
const Book = require("../models/book"); 
const User = require("../models/user");
const Order = require("../models/order");
const { sendOrderStatusEmail } = require("../services/emailService");

// ==========================================
// TEST ROUTE
// ==========================================
router.get("/test", (req, res) => {
  res.json({ message: "Seller routes are working!", timestamp: new Date() });
});

// ==========================================
// SELLER DASHBOARD STATS ROUTE  ← NEW
// ==========================================

/**
 * Get dashboard stats including wallet/revenue
 * @route GET /api/v1/seller/dashboard-stats
 * @access Private (Sellers only)
 */
router.get("/dashboard-stats", authenticateToken, async (req, res) => {
  try {
    const userId = req.headers.id;

    const seller = await Seller.findOne({ user: userId }).select(
      "walletBalance totalEarned totalWithdrawn _id status"
    );

    if (!seller) {
      return res.status(404).json({ message: "Seller profile not found" });
    }

    if (seller.status !== "Approved") {
      return res.status(403).json({ message: "Seller account is not approved yet." });
    }

    // Pending revenue = sum of amountPayable for in-transit orders
    const pendingStatuses = ["Order Placed", "Processing", "Shipped", "Out for Delivery"];
    const pendingAgg = await Order.aggregate([
      {
        $match: {
          seller: seller._id,
          orderStatus: { $in: pendingStatuses },
        },
      },
      { $group: { _id: null, total: { $sum: "$amountPayable" } } },
    ]);
    const pendingRevenue = pendingAgg[0]?.total || 0;

    const totalOrders = await Order.countDocuments({ seller: seller._id });

    return res.status(200).json({
      message: "Dashboard stats fetched",
      data: {
        overview: {
          totalRevenue: seller.totalEarned || 0,      // lifetime from delivered orders
          walletBalance: seller.walletBalance || 0,   // available to withdraw
          pendingRevenue,                              // in-transit orders not yet paid out
          totalWithdrawn: seller.totalWithdrawn || 0,
          totalOrders,
        },
      },
    });
  } catch (err) {
    console.error("getDashboardStats error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ==========================================
// NEW ORDER NOTIFICATIONS ROUTE  ← NEW
// ==========================================

/**
 * Get unread new order notifications for seller
 * @route GET /api/v1/seller/new-order-notifications
 * @access Private (Sellers only)
 */
router.get("/new-order-notifications", authenticateToken, async (req, res) => {
  try {
    const userId = req.headers.id;

    const seller = await Seller.findOne({ user: userId }).select("_id status");
    if (!seller) {
      return res.status(404).json({ message: "Seller profile not found" });
    }

    const notifications = await Order.find({
      seller: seller._id,
      sellerNotificationRead: false,
    })
      .populate("book", "title url price")
      .sort({ createdAt: -1 })
      .limit(20);

    // Mark them as read
    await Order.updateMany(
      { seller: seller._id, sellerNotificationRead: false },
      { $set: { sellerNotificationRead: true } }
    );

    return res.status(200).json({
      message: "Notifications fetched",
      data: {
        notifications: notifications.map((n) => ({
          _id: n._id,
          book: n.book,
          amount: n.amountPayable,
          orderStatus: n.orderStatus,
          createdAt: n.createdAt,
        })),
      },
    });
  } catch (err) {
    console.error("getNewOrderNotifications error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ==========================================
// WITHDRAWAL ROUTE  ← NEW
// ==========================================

/**
 * Request a wallet withdrawal
 * @route POST /api/v1/seller/withdraw
 * @access Private (Sellers only)
 */
router.post("/withdraw", authenticateToken, async (req, res) => {
  try {
    const userId = req.headers.id;
    const { amount } = req.body;

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ message: "Enter a valid withdrawal amount" });
    }

    const seller = await Seller.findOne({ user: userId });
    if (!seller) {
      return res.status(404).json({ message: "Seller profile not found" });
    }

    if (seller.walletBalance < Number(amount)) {
      return res.status(400).json({
        message: `Insufficient balance. Available: ₹${seller.walletBalance}`,
      });
    }

    seller.walletBalance  -= Number(amount);
    seller.totalWithdrawn += Number(amount);
    await seller.save();

    // TODO: trigger bank transfer / Razorpay payout here

    return res.status(200).json({
      message: "Withdrawal processed successfully",
      data: {
        withdrawn:        Number(amount),
        newWalletBalance: seller.walletBalance,
        totalWithdrawn:   seller.totalWithdrawn,
      },
    });
  } catch (err) {
    console.error("requestWithdrawal error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ==========================================
// SELLER ORDER DASHBOARD ROUTES
// ==========================================

/**
 * Get all orders for seller's products
 * @route GET /api/v1/seller/orders
 * @access Private (Sellers only)
 */
router.get("/orders", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    console.log('📦 [Seller Orders] Fetching orders for user:', userId);

    // Find seller record
    const seller = await Seller.findOne({ user: userId });
    
    if (!seller) {
      return res.status(403).json({
        success: false,
        message: "User is not a registered seller.",
      });
    }

    if (seller.status !== 'Approved') {
      return res.status(403).json({
        success: false,
        message: "Seller account is not approved yet.",
      });
    }

    // Build query to find orders containing seller's books
    const sellerBooks = await Book.find({ seller: seller._id }).select('_id');
    const bookIds = sellerBooks.map(book => book._id);

    let orderQuery = {
      'book': { $in: bookIds }
    };

    // Filter by status if provided
    if (status && status !== 'all') {
      orderQuery.orderStatus = status;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Fetch orders with populated data
    const orders = await Order.find(orderQuery)
      .populate({
        path: 'user',
        select: 'username email avatar'
      })
      .populate({
        path: 'book',
        select: 'title url price language'
      })
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalOrders = await Order.countDocuments(orderQuery);

    // Calculate order statistics
    const stats = await Order.aggregate([
      { $match: { book: { $in: bookIds } } },
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amountPayable' }
        }
      }
    ]);

    const statsFormatted = {
      total: totalOrders,
      pending: stats.find(s => s._id === 'Order Placed')?.count || 0,
      processing: stats.find(s => s._id === 'Processing')?.count || 0,
      shipped: stats.find(s => s._id === 'Shipped')?.count || 0,
      delivered: stats.find(s => s._id === 'Delivered')?.count || 0,
      cancelled: stats.find(s => s._id === 'Cancelled')?.count || 0,
      totalRevenue: stats.reduce((sum, s) => sum + (s.totalAmount || 0), 0)
    };

    console.log('✅ [Seller Orders] Orders fetched successfully');

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalOrders / parseInt(limit)),
          totalOrders,
          limit: parseInt(limit)
        },
        stats: statsFormatted
      }
    });

  } catch (error) {
    console.error("❌ [Seller Orders] Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Get single order details
 * @route GET /api/v1/seller/orders/:orderId
 * @access Private (Sellers only)
 */
router.get("/orders/:orderId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    console.log('📦 [Seller Orders] Fetching order details:', orderId);

    // Find seller record
    const seller = await Seller.findOne({ user: userId });
    
    if (!seller) {
      return res.status(403).json({
        success: false,
        message: "User is not a registered seller.",
      });
    }

    // Fetch order with full details
    const order = await Order.findById(orderId)
      .populate({
        path: 'user',
        select: 'username email avatar phone'
      })
      .populate({
        path: 'book',
        select: 'title url price language seller description'
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Verify this order contains seller's book
    if (order.book.seller.toString() !== seller._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This order does not belong to you."
      });
    }

    console.log('✅ [Seller Orders] Order details fetched');

    res.status(200).json({
      success: true,
      message: "Order details fetched successfully",
      order
    });

  } catch (error) {
    console.error("❌ [Seller Orders] Error fetching order details:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Update order status
 * @route PUT /api/v1/seller/orders/:orderId/status
 * @access Private (Sellers only)
 *
 * ── WALLET CREDIT LOGIC ──
 * When status transitions INTO "Delivered" for the first time:
 *   → order.amountPayable is added to seller.walletBalance AND seller.totalEarned
 * If a delivered order is later cancelled:
 *   → the credit is reversed
 */
router.put("/orders/:orderId/status", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const { status, trackingNumber, estimatedDelivery, notes } = req.body;

    console.log('📦 [Seller Orders] Updating order status:', orderId, 'to:', status);
    console.log('📦 Request body:', req.body);

    // Validate status
    const validStatuses = ["Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      });
    }

    // Find seller record
    const seller = await Seller.findOne({ user: userId });
    
    if (!seller || seller.status !== 'Approved') {
      return res.status(403).json({
        success: false,
        message: "Seller account not found or not approved.",
      });
    }

    // Fetch order
    const order = await Order.findById(orderId).populate('book');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Verify ownership
    if (order.book.seller.toString() !== seller._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This order does not belong to you."
      });
    }

    // Prevent certain status changes
    if (order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: `Cannot update order that is already ${order.orderStatus.toLowerCase()}`
      });
    }

    const previousStatus = order.orderStatus;

    // ── WALLET CREDIT LOGIC ──────────────────────────────────
    // Transitioning INTO "Delivered" for the first time →
    // credit amountPayable to walletBalance + totalEarned
    if (status === 'Delivered' && previousStatus !== 'Delivered') {
      await Seller.findByIdAndUpdate(seller._id, {
        $inc: {
          walletBalance: order.amountPayable,
          totalEarned:   order.amountPayable,
        },
      });
      console.log(`✅ Wallet credited ₹${order.amountPayable} for seller ${seller._id}`);
    }

    // Edge-case: delivered → cancelled → reverse the credit
    if (status === 'Cancelled' && previousStatus === 'Delivered') {
      await Seller.findByIdAndUpdate(seller._id, {
        $inc: {
          walletBalance: -order.amountPayable,
          totalEarned:   -order.amountPayable,
        },
      });
      console.log(`⚠️ Wallet credit reversed ₹${order.amountPayable} for seller ${seller._id}`);
    }
    // ─────────────────────────────────────────────────────────

    // Update order status
    order.orderStatus = status;
    
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    
    if (estimatedDelivery) {
      order.expectedDeliveryDate = new Date(estimatedDelivery);
    }

    // Update current location based on status
    const locationMap = {
      'Order Placed': 'Warehouse',
      'Processing': 'Processing Center',
      'Shipped': 'In Transit',
      'Out for Delivery': order.shippingAddress?.city || 'Delivery Hub',
      'Delivered': 'Delivered',
      'Cancelled': 'Cancelled'
    };
    
    order.currentLocation = locationMap[status];

    // Add to tracking history
    order.trackingHistory.push({
      status: status,
      location: order.currentLocation,
      date: new Date(),
      notes: notes || `Order status updated to ${status}`
    });

    // If delivered, set actual delivery date and update payment status for COD
    if (status === 'Delivered') {
      order.actualDeliveryDate = new Date();
      if (order.paymentMethod === 'COD' && order.paymentStatus === 'Pending') {
        order.paymentStatus = 'Success';
      }
    }

    await order.save();

    console.log('✅ [Seller Orders] Order status updated successfully');

    // Re-fetch order with populated data
    const updatedOrder = await Order.findById(orderId)
      .populate('user', 'username email avatar')
      .populate('book', 'title url price language');

    // Send email notification for important statuses
    if (status === 'Out for Delivery' || status === 'Delivered') {
      // Async so it doesn't block the response
      sendOrderStatusEmail(updatedOrder, status).catch(err => 
        console.error("Failed to send status email in seller route:", err)
      );
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to: ${status}`,
      order: updatedOrder
    });

  } catch (error) {
    console.error("❌ [Seller Orders] Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Add custom tracking update - NEW FEATURE
 * @route POST /api/v1/seller/orders/:orderId/tracking
 * @access Private (Sellers only)
 */
router.post("/orders/:orderId/tracking", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const { status, location, notes } = req.body;

    console.log('📍 [Seller Orders] Adding custom tracking update:', orderId);

    if (!status || !location) {
      return res.status(400).json({
        success: false,
        message: "Status and location are required"
      });
    }

    // Find seller record
    const seller = await Seller.findOne({ user: userId });
    
    if (!seller || seller.status !== 'Approved') {
      return res.status(403).json({
        success: false,
        message: "Seller account not found or not approved.",
      });
    }

    // Fetch order
    const order = await Order.findById(orderId).populate('book');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Verify ownership
    if (order.book.seller.toString() !== seller._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This order does not belong to you."
      });
    }

    // Update current location
    order.currentLocation = location;

    // Add to tracking history
    order.trackingHistory.push({
      status: status,
      location: location,
      date: new Date(),
      notes: notes || ''
    });

    await order.save();

    console.log('✅ [Seller Orders] Custom tracking update added successfully');

    // Re-fetch order with populated data
    const updatedOrder = await Order.findById(orderId)
      .populate('user', 'username email avatar')
      .populate('book', 'title url price language');

    res.status(200).json({
      success: true,
      message: "Tracking update added successfully",
      order: updatedOrder
    });

  } catch (error) {
    console.error("❌ [Seller Orders] Error adding tracking update:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Bulk update order statuses
 * @route PUT /api/v1/seller/orders/bulk-update
 * @access Private (Sellers only)
 */
router.put("/orders/bulk-update", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderIds, status } = req.body;

    console.log('📦 [Seller Orders] Bulk updating orders:', orderIds?.length);

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order IDs array is required"
      });
    }

    // Find seller record
    const seller = await Seller.findOne({ user: userId });
    
    if (!seller || seller.status !== 'Approved') {
      return res.status(403).json({
        success: false,
        message: "Seller account not found or not approved.",
      });
    }

    // Get seller's book IDs
    const sellerBooks = await Book.find({ seller: seller._id }).select('_id');
    const bookIds = sellerBooks.map(book => book._id.toString());

    // Update orders
    const result = await Order.updateMany(
      {
        _id: { $in: orderIds },
        book: { $in: bookIds },
        orderStatus: { $nin: ['Delivered', 'Cancelled'] }
      },
      {
        $set: { orderStatus: status }
      }
    );

    console.log('✅ [Seller Orders] Bulk update completed');

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} orders updated successfully`,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error("❌ [Seller Orders] Error in bulk update:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ==========================================
// SELLER PROFILE ROUTES
// ==========================================

/**
 * Get seller information by user ID
 * @route GET /api/v1/seller/seller/user/:userId
 * @access Private
 */
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
        status: seller.status,
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

/**
 * Get current user's seller information
 * @route GET /api/v1/seller/seller/me
 * @access Private
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

/**
 * Quick check if user has seller application
 * @route GET /api/v1/seller/seller/check/:userId
 * @access Private
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

/**
 * Get seller application history
 * @route GET /api/v1/seller/seller/history/:userId
 * @access Private
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

// ==========================================
// SELLER APPLICATION ROUTES
// ==========================================

/**
 * Submit seller application
 * @route POST /api/v1/become-seller
 * @access Private
 */
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

    // Get user and check application status
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    console.log('👤 User found:', user.username);
    console.log('📋 Current application status:', user.sellerApplicationStatus);

    // Check if user can apply
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
        
        // Update user application status to "Applied"
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

    // Update user application status to "Applied"
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

/**
 * Approve seller application (Admin only)
 * @route PUT /api/v1/approve-seller/:userId
 * @access Private (Admin)
 */
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

/**
 * Check seller status (Public route with detailed logging)
 * @route GET /api/v1/check/:userId
 * @access Public
 */
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

/**
 * Get seller by user ID
 * @route GET /api/v1/user/:userId
 * @access Private
 */
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

/**
 * Get seller profile info for logged-in user
 * @route GET /api/v1/get-seller-info
 * @access Private
 */
router.get("/get-seller-info", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log(`=== SELLER INFO DEBUG ===`);
    console.log("Fetching seller info for user ID:", userId);

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
        user: user
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

// ==========================================
// SELLER PRODUCT ROUTES
// ==========================================

/**
 * Get all books posted by the logged-in seller
 * @route GET /api/v1/myproducts
 * @access Private
 */
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

/**
 * Update product status manually
 * @route PUT /api/v1/update-product-status/:id
 * @access Private
 */
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