const express = require("express");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const { apiLimiter } = require("./middleware/rateLimiter");
require("dotenv").config();
require("./conn/conn"); // MongoDB Connection
require("./conn/prisma"); // PostgreSQL Supabase Connection


const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");
const favouriteRoutes = require("./routes/favourite");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const adminRoutes = require("./routes/admin");
const sellerRoutes = require("./routes/seller");
const sellerBookRoutes = require("./routes/sellerBookRoutes");
const premiumRoutes = require("./routes/premiumRoutes");
const sellerOrder = require("./routes/sellerOrder");
const passwordResetRouter = require("./routes/passwordResetRoutes");
const services =require("./routes/services")

const app = express();

// Security HTTP headers and performance compression
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Apply global rate limiter to all API routes
app.use("/api/v1", apiLimiter);

// API routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", bookRoutes);
app.use("/api/v1", favouriteRoutes);
app.use("/api/v1", cartRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", adminRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/seller", sellerRoutes);
app.use("/api/v1", sellerBookRoutes);
app.use("/api/v1/premium", premiumRoutes);
app.use("/api/v1", sellerOrder);
app.use("/api/v1/forgot-password", passwordResetRouter);
app.use("/api/v1/services", services);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

