const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");
const axios = require("axios");

// Get Premium Plans
router.get("/plans", (req, res) => {
  const plans = [
    {
      id: "monthly",
      name: "Monthly Premium",
      price: 99,
      duration: "1 month",
      features: [
        "See seller information",
        "Priority customer support",
        "Early access to new books",
        "Exclusive deals & discounts",
        "Ad-free experience",
      ],
    },
    {
      id: "yearly",
      name: "Yearly Premium",
      price: 999,
      duration: "1 year",
      savings: "Save ₹189",
      features: [
        "All Monthly features",
        "17% discount",
        "Extended support",
        "Premium badge",
      ],
    },
    {
      id: "lifetime",
      name: "Lifetime Premium",
      price: 2999,
      duration: "Forever",
      savings: "Best Value",
      features: [
        "All Yearly features",
        "One-time payment",
        "Lifetime access",
        "VIP status",
      ],
    },
  ];
  res.json({ success: true, plans });
});

// Check Premium Status
router.get("/status", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.headers.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPremiumActive = user.isPremiumActive();
    
    res.json({
      success: true,
      isPremium: isPremiumActive,
      premium: user.premium,
    });
  } catch (error) {
    res.status(500).json({ message: "Error checking premium status" });
  }
});

// Create Premium Payment Order
router.post("/create-order", authenticateToken, async (req, res) => {
  try {
    const { planType } = req.body; // monthly, yearly, lifetime
    
    const prices = {
      monthly: 9900, // ₹99 in paise
      yearly: 99900, // ₹999 in paise
      lifetime: 299900, // ₹2999 in paise
    };

    const amount = prices[planType];
    if (!amount) {
      return res.status(400).json({ message: "Invalid plan type" });
    }

    // Create Razorpay order
    const orderData = {
      amount: amount,
      currency: "INR",
      receipt: `premium_${Date.now()}`,
    };

    // You need to call Razorpay API here
    const order = await axios.post(
      "https://api.razorpay.com/v1/orders",
      orderData,
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET,
        },
      }
    );

    res.json({
      success: true,
      order: order.data,
      planType,
    });
  } catch (error) {
    console.error("Premium order creation failed:", error);
    res.status(500).json({ message: "Failed to create premium order" });
  }
});

// Verify Payment and Activate Premium
router.post("/verify-and-activate", authenticateToken, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planType,
    } = req.body;

    // Verify signature (implement Razorpay signature verification)
    const crypto = require("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Activate premium for user
    const user = await User.findById(req.headers.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.activatePremium(planType, razorpay_payment_id);

    res.json({
      success: true,
      message: "Premium activated successfully",
      premium: user.premium,
    });
  } catch (error) {
    console.error("Premium activation failed:", error);
    res.status(500).json({ message: "Failed to activate premium" });
  }
});

// Cancel Premium
router.post("/cancel", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.headers.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.cancelPremium();

    res.json({
      success: true,
      message: "Premium cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel premium" });
  }
});

module.exports = router;