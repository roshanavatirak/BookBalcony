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
const sellerBookRoutes = require("./routes/sellerBookRoutes");
const premiumRoutes = require("./routes/premiumRoutes");
const sellerOrder = require("./routes/sellerOrder");
const passwordResetRouter = require("./routes/passwordResetRoutes");
const services =require("./routes/services")

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


// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();
// require("./conn/conn");

// const paymentRoutes = require("./routes/paymentRoutes");
// const userRoutes = require("./routes/user");
// const bookRoutes = require("./routes/book");
// const favouriteRoutes = require("./routes/favourite");
// const cartRoutes = require("./routes/cart");
// const orderRoutes = require("./routes/order");
// const adminRoutes = require("./routes/admin");
// const sellerRoutes = require("./routes/seller");
// const sellerBookRoutes = require("./routes/sellerBookRoutes");
// const premiumRoutes = require("./routes/premiumRoutes");
// const sellerOrder = require("./routes/sellerOrder");

// const app = express();

// // CORS configuration
// app.use(cors({
//   origin: process.env.FRONTEND_URL || "*",
//   credentials: true
// }));

// // Body parsing middleware - IMPORTANT: Keep limits high for file uploads
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// // Request logging middleware (optional but helpful)
// app.use((req, res, next) => {
//   const timestamp = new Date().toISOString();
//   console.log(`\n[${timestamp}] ${req.method} ${req.path}`);
//   next();
// });

// // API routes
// app.use("/api/v1", userRoutes);
// app.use("/api/v1", bookRoutes);
// app.use("/api/v1", favouriteRoutes);
// app.use("/api/v1", cartRoutes);
// app.use("/api/v1", orderRoutes);
// app.use("/api/v1", adminRoutes);
// app.use("/api/v1/payment", paymentRoutes);
// app.use("/api/v1/seller", sellerRoutes);
// app.use("/api/v1", sellerBookRoutes);
// app.use("/api/v1/premium", premiumRoutes);
// app.use("/api/v1", sellerOrder);

// // Health check endpoint
// app.get("/health", (req, res) => {
//   res.json({ 
//     status: "OK", 
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime()
//   });
// });

// // 404 handler
// app.use((req, res) => {
//   console.log(`❌ 404 Not Found: ${req.method} ${req.path}`);
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//     path: req.path
//   });
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error("\n❌ ERROR:", err.name, "-", err.message);
  
//   // Handle specific error types
//   if (err.name === 'MulterError') {
//     if (err.code === 'LIMIT_FILE_SIZE') {
//       return res.status(400).json({
//         success: false,
//         message: "File too large. Max 5MB per image."
//       });
//     }
//     if (err.code === 'LIMIT_FILE_COUNT') {
//       return res.status(400).json({
//         success: false,
//         message: "Too many files. Max 3 images."
//       });
//     }
//   }

//   if (err.name === 'ValidationError') {
//     return res.status(400).json({
//       success: false,
//       message: "Validation error",
//       errors: Object.values(err.errors).map(e => e.message)
//     });
//   }

//   if (err.name === 'CastError') {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid ID format"
//     });
//   }

//   // Default error
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//     error: process.env.NODE_ENV === 'development' ? err.stack : undefined
//   });
// });

// // Start server - IMPORTANT: Use port 3000 to match frontend
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log("\n" + "=".repeat(50));
//   console.log("🚀 SERVER STARTED");
//   console.log("=".repeat(50));
//   console.log(`📍 Port: ${PORT}`);
//   console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
//   console.log(`⏰ Time: ${new Date().toLocaleString()}`);
//   console.log(`🔗 Health: http://localhost:${PORT}/health`);
//   console.log("=".repeat(50) + "\n");
// });