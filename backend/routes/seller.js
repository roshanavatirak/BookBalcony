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
      return res.status(400).json({ message: "Required fields are missing." });
    }

    // Check if seller already applied
    const alreadyApplied = await Seller.findOne({ user: req.user.id });
    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied to become a seller." });
    }

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

    res.status(201).json({ message: "Seller application submitted successfully." });
  } catch (error) {
    console.error("Seller form error:", error);
    res.status(500).json({ message: "Something went wrong" });
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

module.exports = router;