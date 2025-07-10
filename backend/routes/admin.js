const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Book = require("../models/book");
const {authenticateToken} = require("./userAuth");

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

module.exports= router;