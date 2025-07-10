const express = require("express");
const router = express.Router();
const Seller = require("../models/seller");
const {authenticateToken} = require("./userAuth");

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

    const seller = await Seller.findOneAndUpdate(
      { user: userId },
      { status: "Approved" },
      { new: true }
    );

    if (!seller) return res.status(404).json({ message: "Seller not found" });

    await User.findByIdAndUpdate(userId, { isSeller: true });

    res.status(200).json({ message: "Seller approved and role updated." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal error." });
  }
});

// GET: Check if user is an approved seller
router.get("/seller/check/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ isSeller: false, message: "Invalid user ID format." });
    }

    const seller = await Seller.findOne({ user: userId });

    if (!seller) {
      return res.status(200).json({
        isSeller: false,
        status: "Not a Seller",
      });
    }

    if (seller.status === "Approved") {
      return res.status(200).json({
        isSeller: true,
        status: seller.status,
        fullName: seller.fullName,
        sellerType: seller.sellerType,
      });
    }

    return res.status(200).json({
      isSeller: false,
      status: seller.status,
      message: "Seller found but not approved yet.",
    });
  } catch (error) {
    console.error("Seller check error:", error);
    res.status(500).json({ message: "Internal Server Error", isSeller: false });
  }
});


// GET: Fetch seller profile info for logged-in user
router.get("/get-seller-info", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const seller = await Seller.findOne({ user: userId }).populate("user", "name email");

    if (!seller) {
      return res.status(404).json({ message: "Seller profile not found." });
    }

    res.status(200).json(seller);
  } catch (error) {
    console.error("Error in get-seller-info:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
