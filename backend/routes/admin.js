const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Book = require("../models/Book");
const {authenticateToken} = require("./userAuth");
const Seller = require("../models/seller")
const { updateSellerStatus } = require("../controllers/adminController");



router.put("/admin/sellers/:id/status", updateSellerStatus);

router.get("/admin/users", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const users = await User.find({}, "-password"); // exclude passwords

    res.status(200).json({
      message: "Fetched all users",
      data: users,
    });
  } catch (err) {
    console.error("Error in fetching users:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get('/admin/sellers', authenticateToken, async (req, res) => {
  console.log("Fetching all sellers...");
  try {
    const sellers = await Seller.find().sort({ createdAt: -1 });
    console.log("Found sellers:", sellers); // Add this
     res.status(200).json({ message: 'Fetched sellers', data: sellers });
  } catch (error) {
    console.error("Error fetching sellers:", error); // Log error
    res.status(500).json({ message: 'Failed to fetch sellers', error });
  }
});


router.put('/sellers/:id/status', async (req, res) => {
  try {
    const sellerId = req.params.id;
    const { status } = req.body;

    // Optional: Validate status
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const seller = await Seller.findByIdAndUpdate(
      sellerId,
      { status },
      { new: true }
    );

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    res.status(200).json({ message: 'Status updated successfully', seller });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating seller status', error });
  }
});

// DELETE seller by ID - Admin only
router.delete("/admin/sellers/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: Check if requesting user is admin
    const adminUser = await User.findById(req.headers.id);
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const deletedSeller = await Seller.findByIdAndDelete(id);

    if (!deletedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json({ message: "Seller deleted successfully" });
  } catch (error) {
    console.error("Error deleting seller:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});


module.exports= router;