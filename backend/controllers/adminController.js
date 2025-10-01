const Seller = require("../models/seller");

exports.updateSellerStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!["Approved", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    seller.status = status;
    await seller.save();

    res.status(200).json({
      message: `Seller status updated to ${status}`,
      seller,
    });
  } catch (err) {
    console.error("Error updating seller status:", err);
    res.status(500).json({ message: "Server error" });
  }
};
