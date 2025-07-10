const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./conn/conn"); // Make sure this uses CommonJS too

const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");
const favouriteRoutes = require("./routes/favourite");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const adminRoutes = require("./routes/admin");
const sellerRoutes = require("./routes/seller");


const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", bookRoutes);
app.use("/api/v1", favouriteRoutes);
app.use("/api/v1", cartRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", adminRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1", sellerRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
