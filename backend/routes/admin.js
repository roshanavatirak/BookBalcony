// // // const router = require("express").Router();
// // // const User = require("../models/user");
// // // const jwt = require("jsonwebtoken");
// // // const Book = require("../models/Book");
// // // const {authenticateToken} = require("./userAuth");
// // // const Seller = require("../models/seller")
// // // const { updateSellerStatus } = require("../controllers/adminController");

// // // // Admin middleware
// // // const isAdmin = async (req, res, next) => {
// // //   try {
// // //     const { id } = req.headers;
// // //     const user = await User.findById(id);
    
// // //     if ( user.role !== "admin") {
// // //       return res.status(403).json({ message: "Access denied. Admins only." });
// // //     }
    
// // //     req.user = user;
// // //     next();
// // //   } catch (error) {
// // //     res.status(500).json({ message: "Authentication error" });
// // //   }
// // // };

// // // // ===== AUTO STATUS SETTING =====

// // // // Get auto status setting
// // // router.get("/admin/auto-status-setting", authenticateToken, isAdmin, async (req, res) => {
// // //   try {
// // //     // You can store this in a settings collection or config
// // //     // For now, returning a default. In production, store in DB
// // //     const autoMode = true; // Default value
    
// // //     res.status(200).json({ autoMode });
// // //   } catch (error) {
// // //     res.status(500).json({ message: "Error fetching setting", error });
// // //   }
// // // });

// // // // Update auto status setting
// // // router.put("/admin/auto-status-setting", authenticateToken, isAdmin, async (req, res) => {
// // //   try {
// // //     const { autoMode } = req.body;
    
// // //     // In production, save this to a Settings collection
// // //     // For now, we'll just return success
// // //     // You can create a Settings model to store this
    
// // //     res.status(200).json({ 
// // //       message: "Auto status mode updated", 
// // //       autoMode 
// // //     });
// // //   } catch (error) {
// // //     res.status(500).json({ message: "Error updating setting", error });
// // //   }
// // // });

// // // // ===== BOOK STATUS MANAGEMENT =====

// // // // Get all books (for admin/seller)
// // // router.get("/seller/all-books", authenticateToken, async (req, res) => {
// // //   try {
// // //     const { id } = req.headers;
// // //     const user = await User.findById(id);
    
// // //     let books;
// // //     if (user.role === "admin") {
// // //       // Admin sees all books
// // //       books = await Book.find()
// // //         .populate("seller", "username email")
// // //         .sort({ createdAt: -1 });
// // //     } else {
// // //       // Seller sees only their books
// // //       books = await Book.find({ seller: id })
// // //         .populate("seller", "username email")
// // //         .sort({ createdAt: -1 });
// // //     }
    
// // //     res.status(200).json({ 
// // //       message: "Books fetched successfully", 
// // //       data: books 
// // //     });
// // //   } catch (error) {
// // //     console.error("Error fetching books:", error);
// // //     res.status(500).json({ message: "Error fetching books", error });
// // //   }
// // // });

// // // // Update book status (Admin only)
// // // router.put("/admin/book-status/:bookId", authenticateToken, isAdmin, async (req, res) => {
// // //   try {
// // //     const { bookId } = req.params;
// // //     const { status } = req.body;
    
// // //     // Validate status
// // //     const validStatuses = ["Available", "Sold Out", "Not Available", "Arriving Soon"];
// // //     if (!validStatuses.includes(status)) {
// // //       return res.status(400).json({ message: "Invalid status value" });
// // //     }
    
// // //     const book = await Book.findById(bookId);
    
// // //     if (!book) {
// // //       return res.status(404).json({ message: "Book not found" });
// // //     }
    
// // //     // Update status using the model method
// // //     await book.updateStatus(status);
    
// // //     res.status(200).json({ 
// // //       message: "Book status updated successfully", 
// // //       book 
// // //     });
// // //   } catch (error) {
// // //     console.error("Error updating book status:", error);
// // //     res.status(500).json({ message: "Error updating book status", error });
// // //   }
// // // });

// // // // Delete book
// // // router.delete("/seller/delete-book/:bookId", authenticateToken, async (req, res) => {
// // //   try {
// // //     const { bookId } = req.params;
// // //     const { id } = req.headers;
// // //     const user = await User.findById(id);
    
// // //     const book = await Book.findById(bookId);
    
// // //     if (!book) {
// // //       return res.status(404).json({ message: "Book not found" });
// // //     }
    
// // //     // Check if user is admin or the seller who posted the book
// // //     if (user.role !== "admin" && book.seller.toString() !== id) {
// // //       return res.status(403).json({ message: "You don't have permission to delete this book" });
// // //     }
    
// // //     await Book.findByIdAndDelete(bookId);
    
// // //     res.status(200).json({ message: "Book deleted successfully" });
// // //   } catch (error) {
// // //     console.error("Error deleting book:", error);
// // //     res.status(500).json({ message: "Error deleting book", error });
// // //   }
// // // });

// // // // Get books by status
// // // router.get("/admin/books/status/:status", authenticateToken, isAdmin, async (req, res) => {
// // //   try {
// // //     const { status } = req.params;
    
// // //     const books = await Book.find({ productStatus: status })
// // //       .populate("seller", "username email")
// // //       .sort({ createdAt: -1 });
    
// // //     res.status(200).json({ 
// // //       message: `Books with status ${status}`, 
// // //       data: books 
// // //     });
// // //   } catch (error) {
// // //     console.error("Error fetching books by status:", error);
// // //     res.status(500).json({ message: "Error fetching books", error });
// // //   }
// // // });

// // // // Get newly added books (last 7 days)
// // // router.get("/admin/books/new", authenticateToken, isAdmin, async (req, res) => {
// // //   try {
// // //     const sevenDaysAgo = new Date();
// // //     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
// // //     const books = await Book.find({ 
// // //       createdAt: { $gte: sevenDaysAgo } 
// // //     })
// // //       .populate("seller", "username email")
// // //       .sort({ createdAt: -1 });
    
// // //     res.status(200).json({ 
// // //       message: "New books fetched", 
// // //       data: books 
// // //     });
// // //   } catch (error) {
// // //     console.error("Error fetching new books:", error);
// // //     res.status(500).json({ message: "Error fetching books", error });
// // //   }
// // // });

// // // // Bulk update book statuses
// // // router.put("/admin/books/bulk-status", authenticateToken, isAdmin, async (req, res) => {
// // //   try {
// // //     const { bookIds, status } = req.body;
    
// // //     const validStatuses = ["Available", "Sold Out", "Not Available", "Arriving Soon"];
// // //     if (!validStatuses.includes(status)) {
// // //       return res.status(400).json({ message: "Invalid status value" });
// // //     }
    
// // //     const result = await Book.updateMany(
// // //       { _id: { $in: bookIds } },
// // //       { 
// // //         $set: { 
// // //           productStatus: status,
// // //           autoStatusUpdate: false
// // //         } 
// // //       }
// // //     );
    
// // //     res.status(200).json({ 
// // //       message: "Books updated successfully", 
// // //       modifiedCount: result.modifiedCount 
// // //     });
// // //   } catch (error) {
// // //     console.error("Error in bulk update:", error);
// // //     res.status(500).json({ message: "Error updating books", error });
// // //   }
// // // });

// // // // Get book statistics for admin dashboard
// // // router.get("/admin/books/statistics", authenticateToken, isAdmin, async (req, res) => {
// // //   try {
// // //     const totalBooks = await Book.countDocuments();
// // //     const availableBooks = await Book.countDocuments({ productStatus: "Available" });
// // //     const soldOutBooks = await Book.countDocuments({ productStatus: "Sold Out" });
// // //     const arrivingSoonBooks = await Book.countDocuments({ productStatus: "Arriving Soon" });
// // //     const notAvailableBooks = await Book.countDocuments({ productStatus: "Not Available" });
    
// // //     const sevenDaysAgo = new Date();
// // //     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
// // //     const newBooks = await Book.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    
// // //     res.status(200).json({
// // //       totalBooks,
// // //       availableBooks,
// // //       soldOutBooks,
// // //       arrivingSoonBooks,
// // //       notAvailableBooks,
// // //       newBooks
// // //     });
// // //   } catch (error) {
// // //     console.error("Error fetching statistics:", error);
// // //     res.status(500).json({ message: "Error fetching statistics", error });
// // //   }
// // // });

// // // router.put("/admin/sellers/:id/status", updateSellerStatus);

// // // router.get("/admin/users", authenticateToken, async (req, res) => {
// // //   try {
// // //     const { id } = req.headers;
// // //     const user = await User.findById(id);

// // //     if (!user || user.role !== "admin") {
// // //       return res.status(403).json({ message: "Access denied. Admins only." });
// // //     }

// // //     const users = await User.find({}, "-password"); // exclude passwords

// // //     res.status(200).json({
// // //       message: "Fetched all users",
// // //       data: users,
// // //     });
// // //   } catch (err) {
// // //     console.error("Error in fetching users:", err);
// // //     res.status(500).json({ message: "Internal Server Error" });
// // //   }
// // // });
// // // router.get('/admin/sellers', authenticateToken, async (req, res) => {
// // //   console.log("Fetching all sellers...");
// // //   try {
// // //     const sellers = await Seller.find().sort({ createdAt: -1 });
// // //     console.log("Found sellers:", sellers); // Add this
// // //      res.status(200).json({ message: 'Fetched sellers', data: sellers });
// // //   } catch (error) {
// // //     console.error("Error fetching sellers:", error); // Log error
// // //     res.status(500).json({ message: 'Failed to fetch sellers', error });
// // //   }
// // // });


// // // router.put('/sellers/:id/status', async (req, res) => {
// // //   try {
// // //     const sellerId = req.params.id;
// // //     const { status } = req.body;

// // //     // Optional: Validate status
// // //     if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
// // //       return res.status(400).json({ message: 'Invalid status value' });
// // //     }

// // //     const seller = await Seller.findByIdAndUpdate(
// // //       sellerId,
// // //       { status },
// // //       { new: true }
// // //     );

// // //     if (!seller) {
// // //       return res.status(404).json({ message: 'Seller not found' });
// // //     }

// // //     res.status(200).json({ message: 'Status updated successfully', seller });
// // //   } catch (error) {
// // //     console.error(error);
// // //     res.status(500).json({ message: 'Error updating seller status', error });
// // //   }
// // // });

// // // // DELETE seller by ID - Admin only
// // // router.delete("/admin/sellers/:id", authenticateToken, async (req, res) => {
// // //   try {
// // //     const { id } = req.params;

// // //     // Optional: Check if requesting user is admin
// // //     const adminUser = await User.findById(req.headers.id);
// // //     if (!adminUser || adminUser.role !== "admin") {
// // //       return res.status(403).json({ message: "Access denied. Admins only." });
// // //     }

// // //     const deletedSeller = await Seller.findByIdAndDelete(id);

// // //     if (!deletedSeller) {
// // //       return res.status(404).json({ message: "Seller not found" });
// // //     }

// // //     res.status(200).json({ message: "Seller deleted successfully" });
// // //   } catch (error) {
// // //     console.error("Error deleting seller:", error);
// // //     res.status(500).json({ message: "Internal server error", error });
// // //   }
// // // });


// // // module.exports= router;

// // const router = require("express").Router();
// // const User = require("../models/user");
// // const jwt = require("jsonwebtoken");
// // const Book = require("../models/Book");
// // const Order = require("../models/order");
// // const { authenticateToken } = require("./userAuth");
// // const Seller = require("../models/seller");
// // const { updateSellerStatus } = require("../controllers/adminController");

// // // ==========================================
// // // ADMIN MIDDLEWARE
// // // ==========================================
// // const isAdmin = async (req, res, next) => {
// //   try {
// //     const { id } = req.headers;
    
// //     if (!id) {
// //       return res.status(401).json({ 
// //         success: false,
// //         message: "User ID is required" 
// //       });
// //     }

// //     const user = await User.findById(id);
    
// //     if (!user) {
// //       return res.status(404).json({ 
// //         success: false,
// //         message: "User not found" 
// //       });
// //     }

// //     if (user.role !== "admin") {
// //       return res.status(403).json({ 
// //         success: false,
// //         message: "Access denied. Admins only." 
// //       });
// //     }
    
// //     req.user = user;
// //     next();
// //   } catch (error) {
// //     console.error("Admin authentication error:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: "Authentication error" 
// //     });
// //   }
// // };

// // // ==========================================
// // // USER MANAGEMENT ROUTES
// // // ==========================================

// // // Get all users (basic info)
// // router.get("/admin/users", authenticateToken, isAdmin, async (req, res) => {
// //   try {
// //     const users = await User.find({}, "-password")
// //       .sort({ createdAt: -1 });

// //     res.status(200).json({
// //       success: true,
// //       message: "Fetched all users",
// //       data: users,
// //     });
// //   } catch (err) {
// //     console.error("Error fetching users:", err);
// //     res.status(500).json({ 
// //       success: false,
// //       message: "Internal Server Error" 
// //     });
// //   }
// // });

// // // Get detailed user information by ID
// // router.get("/admin/users/:userId/details", authenticateToken, isAdmin, async (req, res) => {
// //   try {
// //     const { userId } = req.params;

// //     // Fetch user with populated cart, favourites, and orders
// //     const user = await User.findById(userId)
// //       .select("-password")
// //       .populate({
// //         path: "cart",
// //         select: "title author price url description",
// //       })
// //       .populate({
// //         path: "favourites",
// //         select: "title author price url description",
// //       })
// //       .populate({
// //         path: "orders",
// //         select: "status totalAmount createdAt book",
// //         options: { sort: { createdAt: -1 } },
// //         populate: {
// //           path: "book",
// //           select: "title price",
// //         },
// //       });

// //     if (!user) {
// //       return res.status(404).json({ 
// //         success: false,
// //         message: "User not found" 
// //       });
// //     }

// //     // Calculate statistics
// //     const stats = {
// //       totalOrders: user.orders.length,
// //       totalSpent: user.orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
// //       cartValue: user.cart.reduce((sum, book) => sum + (book.price || 0), 0),
// //       favouritesCount: user.favourites.length,
// //     };

// //     res.status(200).json({
// //       success: true,
// //       message: "User details fetched successfully",
// //       data: {
// //         ...user.toObject(),
// //         stats,
// //       },
// //     });
// //   } catch (err) {
// //     console.error("Error fetching user details:", err);
// //     res.status(500).json({ 
// //       success: false,
// //       message: "Failed to fetch user details" 
// //     });
// //   }
// // });

// // // Block user
// // router.put("/admin/users/:userId/block", authenticateToken, isAdmin, async (req, res) => {
// //   try {
// //     const { userId } = req.params;

// //     const user = await User.findById(userId);
// //     if (!user) {
// //       return res.status(404).json({ 
// //         success: false,
// //         message: "User not found" 
// //       });
// //     }

// //     if (user.role === "admin") {
// //       return res.status(403).json({ 
// //         success: false,
// //         message: "Cannot block admin users" 
// //       });
// //     }

// //     user.blocked = true;
// //     await user.save();

// //     res.status(200).json({
// //       success: true,
// //       message: "User blocked successfully",
// //       data: user,
// //     });
// //   } catch (err) {
// //     console.error("Error blocking user:", err);
// //     res.status(500).json({ 
// //       success: false,
// //       message: "Failed to block user" 
// //     });
// //   }
// // });

// // // Unblock user
// // router.put("/admin/users/:userId/unblock", authenticateToken, isAdmin, async (req, res) => {
// //   try {
// //     const { userId } = req.params;

// //     const user = await User.findById(userId);
// //     if (!user) {
// //       return res.status(404).json({ 
// //         success: false,
// //         message: "User not found" 
// //       });
// //     }

// //     user.blocked = false;
// //     await user.save();

// //     res.status(200).json({
// //       success: true,
// //       message: "User unblocked successfully",
// //       data: user,
// //     });
// //   } catch (err) {
// //     console.error("Error unblocking user:", err);
// //     res.status(500).json({ 
// //       success: false,
// //       message: "Failed to unblock user" 
// //     });
// //   }
// // });

// // // Delete user
// // router.delete("/admin/users/:userId", authenticateToken, isAdmin, async (req, res) => {
// //   try {
// //     const { userId } = req.params;

// //     const user = await User.findById(userId);
// //     if (!user) {
// //       return res.status(404).json({ 
// //         success: false,
// //         message: "User not found" 
// //       });
// //     }

// //     if (user.role === "admin") {
// //       return res.status(403).json({ 
// //         success: false,
// //         message: "Cannot delete admin users" 
// //       });
// //     }

// //     // Optional: Delete user's related data
// //     // await Order.deleteMany({ user: userId });
// //     // await Book.deleteMany({ seller: userId });

// //     await User.findByIdAndDelete(userId);

// //     res.status(200).json({
// //       success: true,
// //       message: "User deleted successfully",
// //     });
// //   } catch (err) {
// //     console.error("Error deleting user:", err);
// //     res.status(500).json({ 
// //       success: false,
// //       message: "Failed to delete user" 
// //     });
// //   }
// // });

// // // Get user statistics for dashboard
// // router.get("/admin/users/stats/summary", authenticateToken, isAdmin, async (req, res) => {
// //   try {
// //     const totalUsers = await User.countDocuments();
// //     const blockedUsers = await User.countDocuments({ blocked: true });
// //     const sellerUsers = await User.countDocuments({ isSeller: true });
// //     const premiumUsers = await User.countDocuments({ "premium.isPremium": true });
    
// //     // New users in last 7 days
// //     const sevenDaysAgo = new Date();
// //     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
// //     const newUsers = await User.countDocuments({ 
// //       createdAt: { $gte: sevenDaysAgo } 
// //     });

// //     // New users in last 30 days
// //     const thirtyDaysAgo = new Date();
// //     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
// //     const monthlyNewUsers = await User.countDocuments({ 
// //       createdAt: { $gte: thirtyDaysAgo } 
// //     });

// //     res.status(200).json({
// //       success: true,
// //       data: {
// //         totalUsers,
// //         blockedUsers,
// //         sellerUsers,
// //         premiumUsers,
// //         newUsersWeek: newUsers,
// //         newUsersMonth: monthlyNewUsers,
// //         activeUsers: totalUsers - blockedUsers,
// //       },
// //     });
// //   } catch (err) {
// //     console.error("Error fetching user stats:", err);
// //     res.status(500).json({ 
// //       success: false,
// //       message: "Failed to fetch statistics" 
// //     });
// //   }
// // });

// // // ==========================================
// // // BOOK STATUS MANAGEMENT
// // // ==========================================

// // // Get all books (for admin/seller)
// // router.get("/seller/all-books", authenticateToken, async (req, res) => {
// //   try {
// //     const { id } = req.headers;
// //     const user = await User.findById(id);
    
// //     if (!user) {
// //       return res.status(404).json({ 
// //         success: false,
// //         message: "User not found" 
// //       });
// //     }

// //     let books;
// //     if (user.role === "admin") {
// //       // Admin sees all books
// //       books = await Book.find()
// //         .populate("seller", "username email")
// //         .sort({ createdAt: -1 });
// //     } else {
// //       // Seller sees only their books
// //       books = await Book.find({ seller: id })
// //         .populate("seller", "username email")
// //         .sort({ createdAt: -1 });
// //     }
    
// //     res.status(200).json({ 
// //       success: true,
// //       message: "Books fetched successfully", 
// //       data: books 
// //     });
// //   } catch (error) {
// //     console.error("Error fetching books:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: "Error fetching books" 
// //     });
// //   }
// // });

// // // Update book status (Admin only)
// // router.put("/admin/book-status/:bookId", authenticateToken, isAdmin, async (req, res) => {
// //   try {
// //     const { bookId } = req.params;
// //     const { status } = req.body;
    
// //     // Validate status
// //     const validStatuses = ["Available", "Sold Out", "Not Available", "Arriving Soon"];
// //     if (!validStatuses.includes(status)) {
// //       return res.status(400).json({ 
// //         success: false,
// //         message: "Invalid status value" 
// //       });
// //     }
    
// //     const book = await Book.findById(bookId);
    
// //     if (!book) {
// //       return res.status(404).json({ 
// //         success: false,
// //         message: "Book not found" 
// //       });
// //     }
    
// //     // Update status using the model method if it exists, otherwise update directly
// //     if (typeof book.updateStatus === 'function') {
// //       await book.updateStatus(status);
// //     } else {
// //       book.productStatus = status;
// //       await book.save();
// //     }
    
// //     res.status(200).json({ 
// //       success: true,
// //       message: "Book status updated successfully", 
// //       data: book 
// //     });
// //   } catch (error) {
// //     console.error("Error updating book status:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: "Error updating book status" 
// //     });
// //   }
// // });

// // // Delete book
// // router.delete("/seller/delete-book/:bookId", authenticateToken, async (req, res) => {
// //   try {
// //     const { bookId } = req.params;
// //     const { id } = req.headers;
// //     const user = await User.findById(id);
    
// //     if (!user) {
// //       return res.status(404).json({ 
// //         success: false,
// //         message: "User not found" 
// //       });
// //     }

// //     const book = await Book.findById(bookId);
    
// //     if (!book) {
// //       return res.status(404).json({ 
// //         success: false,
// //         message: "Book not found" 
// //       });
// //     }
    
// //     // Check if user is admin or the seller who posted the book
// //     if (user.role !== "admin" && book.seller.toString() !== id) {
// //       return res.status(403).json({ 
// //         success: false,
// //         message: "You don't have permission to delete this book" 
// //       });
// //     }
    
// //     await Book.findByIdAndDelete(bookId);
    
// //     res.status(200).json({ 
// //       success: true,
// //       message: "Book deleted successfully" 
// //     });
// //   } catch (error) {
// //     console.error("Error deleting book:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: "Error deleting book" 
// //     });
// //   }
// // });

// // // Get books by status
// // router.get("/admin/books/status/:status", authenticateToken, isAdmin, async (req, res) => {
// //   try {
// //     const { status } = req.params;
    
// //     const books = await Book.find({ productStatus: status })
// //       .populate("seller", "username email")
// //       .sort({ createdAt: -1 });
    
// //     res.status(200).json({ 
// //       success: true,
// //       message: `Books with status ${status}`, 
// //       data: books 
// //     });
// //   } catch (error) {
// //     console.error("Error fetching books by status:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: "Error fetching books" 
// //     });
// //   }
// // });

// // // Get newly added books (last 7 days)
// // router.get("/admin/books/new", authenticateToken, isAdmin, async (req, res) => {
// //   try {
// //     const sevenDaysAgo = new Date();
// //     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
// //     const books = await Book.find({ 
// //       createdAt: { $gte: sevenDaysAgo } 
// //     })
// //       .populate("seller", "username email")
// //       .sort({ createdAt: -1 });
    
// //     res.status(200).json({ 
// //       success: true,
// //       message: "New books fetched", 
// //       data: books 
// //     });
// //   } catch (error) {
// //     console.error("Error fetching new books:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: "Error fetching books" 
// //     });
// //   }
// // });

// // // Bulk update book statuses
// // router.put("/admin/books/bulk-status", authenticateToken, isAdmin, async (req, res) => {
// //   try {
// //     const { bookIds, status } = req.body;
    
// //     if (!bookIds || !Array.isArray(bookIds) || bookIds.length === 0) {
// //       return res.status(400).json({ 
// //         success: false,
// //         message: "bookIds array is required" 
// //       });
// //     }

// //     const validStatuses = ["Available", "Sold Out", "Not Available", "Arriving Soon"];
// //     if (!validStatuses.includes(status)) {
// //       return res.status(400).json({ 
// //         success: false,
// //         message: "Invalid status value" 
// //       });
// //     }
    
// //     const result = await Book.updateMany(
// //       { _id: { $in: bookIds } },
// //       { 
// //         $set: { 
// //           productStatus: status,
// //           autoStatusUpdate: false
// //         } 
// //       }
// //     );
    
// //     res.status(200).json({ 
// //       success: true,
// //       message: "Books updated successfully", 
// //       modifiedCount: result.modifiedCount 
// //     });
// //   } catch (error) {
// //     console.error("Error in bulk update:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: "Error updating books" 
// //     });
// //   }
// // });

// // // Get book statistics for admin dashboard
// // router.get("/admin/books/statistics", authenticateToken, isAdmin, async (req, res) => {
// //   try {
// //     const totalBooks = await Book.countDocuments();
// //     const availableBooks = await Book.countDocuments({ productStatus: "Available" });
// //     const soldOutBooks = await Book.countDocuments({ productStatus: "Sold Out" });
// //     const arrivingSoonBooks = await Book.countDocuments({ productStatus: "Arriving Soon" });
// //     const notAvailableBooks = await Book.countDocuments({ productStatus: "Not Available" });
    
// //     const sevenDaysAgo = new Date();
// //     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
// //     const newBooks = await Book.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    
// //     res.status(200).json({
// //       success: true,
// //       data: {
// //         totalBooks,
// //         availableBooks,
// //         soldOutBooks,
// //         arrivingSoonBooks,
// //         notAvailableBooks,
// //         newBooks,
// //       },
// //     });
// //   } catch (error) {
// //     console.error("Error fetching statistics:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: "Error fetching statistics" 
// //     });
// //   }
// // });

// // // ==========================================
// // // SELLER MANAGEMENT
// // // ==========================================

// // // Get all sellers
// // router.get("/admin/sellers", authenticateToken, isAdmin, async (req, res) => {
// //   try {
// //     const sellers = await Seller.find().sort({ createdAt: -1 });
    
// //     res.status(200).json({ 
// //       success: true,
// //       message: "Fetched sellers", 
// //       data: sellers 
// //     });
// //   } catch (error) {
// //     console.error("Error fetching sellers:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: "Failed to fetch sellers" 
// //     });
// //   }
// // });

// // // ✅ UPDATE SELLER STATUS WITH USER SCHEMA SYNC
// // router.put("/admin/sellers/:id/status", authenticateToken, async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { status } = req.body;

// //     // Validate status
// //     const validStatuses = ["Pending", "Approved", "Rejected", "Banned"];
// //     if (!validStatuses.includes(status)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Invalid status. Must be: Pending, Approved, Rejected, or Banned"
// //       });
// //     }

// //     // Find the seller
// //     const seller = await Seller.findById(id);
// //     if (!seller) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Seller not found"
// //       });
// //     }

// //     // Update seller status
// //     seller.status = status;
// //     await seller.save();

// //     // ✅ MAP SELLER STATUS TO USER APPLICATION STATUS
// //     let userApplicationStatus;
// //     let userIsSeller = false;

// //     switch (status) {
// //       case "Approved":
// //         userApplicationStatus = "Accepted";
// //         userIsSeller = true; // User becomes a seller
// //         break;
// //       case "Rejected":
// //         userApplicationStatus = "Rejected";
// //         userIsSeller = false; // Remove seller privileges
// //         break;
// //       case "Banned":
// //         userApplicationStatus = "Rejected"; // Treat banned as rejected
// //         userIsSeller = false;
// //         break;
// //       case "Pending":
// //         userApplicationStatus = "Applied";
// //         userIsSeller = false; // Not yet a seller
// //         break;
// //       default:
// //         userApplicationStatus = "Available";
// //         userIsSeller = false;
// //     }

// //     // ✅ UPDATE USER SCHEMA WITH SYNCED STATUS
// //     const user = await User.findById(seller.user);
// //     if (user) {
// //       user.sellerApplicationStatus = userApplicationStatus;
// //       user.isSeller = userIsSeller;
// //       await user.save();

// //       console.log(`✅ User ${user.username} status synced:`, {
// //         sellerStatus: status,
// //         applicationStatus: userApplicationStatus,
// //         isSeller: userIsSeller
// //       });
// //     } else {
// //       console.warn(`⚠️ User not found for seller ${id}`);
// //     }

// //     return res.status(200).json({
// //       success: true,
// //       message: `Seller status updated to ${status}`,
// //       data: {
// //         seller: seller,
// //         userUpdated: !!user,
// //         userApplicationStatus: userApplicationStatus,
// //         userIsSeller: userIsSeller
// //       }
// //     });

// //   } catch (error) {
// //     console.error("❌ Error updating seller status:", error);
// //     return res.status(500).json({
// //       success: false,
// //       message: "Internal server error",
// //       error: error.message
// //     });
// //   }
// // });
// // // Alternative route for seller status update (for compatibility)
// // router.put("/sellers/:id/status", authenticateToken, isAdmin, async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { status } = req.body;

// //     // Validate status
// //     const validStatuses = ['Pending', 'Approved', 'Rejected'];
// //     if (!validStatuses.includes(status)) {
// //       return res.status(400).json({ 
// //         success: false,
// //         message: 'Invalid status value' 
// //       });
// //     }

// //     const seller = await Seller.findByIdAndUpdate(
// //       id,
// //       { status },
// //       { new: true }
// //     );

// //     if (!seller) {
// //       return res.status(404).json({ 
// //         success: false,
// //         message: 'Seller not found' 
// //       });
// //     }

// //     res.status(200).json({ 
// //       success: true,
// //       message: 'Status updated successfully', 
// //       data: seller 
// //     });
// //   } catch (error) {
// //     console.error("Error updating seller status:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: 'Error updating seller status' 
// //     });
// //   }
// // });

// // // Delete seller by ID
// // router.delete("/admin/sellers/:id", authenticateToken, isAdmin, async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     // Find the seller first to get the user reference
// //     const seller = await Seller.findById(id);

// //     if (!seller) {
// //       return res.status(404).json({ 
// //         success: false,
// //         message: "Seller not found" 
// //       });
// //     }

// //     // Store user ID before deletion
// //     const userId = seller.user;

// //     // Delete the seller
// //     await Seller.findByIdAndDelete(id);

// //     // ✅ UPDATE USER SCHEMA - Reset to Available status
// //     if (userId) {
// //       const user = await User.findByIdAndUpdate(
// //         userId,
// //         { 
// //           isSeller: false,
// //           sellerApplicationStatus: "Available"  // ✅ Reset to Available so user can reapply
// //         },
// //         { new: true } // Return updated document
// //       );

// //       if (user) {
// //         console.log(`✅ User ${user.username} status reset:`, {
// //           isSeller: false,
// //           sellerApplicationStatus: 'Available'
// //         });
// //       } else {
// //         console.warn(`⚠️ User ${userId} not found after seller deletion`);
// //       }
// //     }

// //     res.status(200).json({ 
// //       success: true,
// //       message: "Seller deleted successfully",
// //       userUpdated: !!userId,
// //       userStatus: "Available" // Inform frontend of the new status
// //     });

// //   } catch (error) {
// //     console.error("❌ Error deleting seller:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: "Internal server error",
// //       error: error.message
// //     });
// //   }
// // });

// // // ==========================================
// // // AUTO STATUS SETTING
// // // ==========================================

// // // Get auto status setting
// // router.get("/admin/auto-status-setting", authenticateToken, isAdmin, async (req, res) => {
// //   try {
// //     // You can store this in a settings collection or config
// //     // For now, returning a default. In production, store in DB
// //     const autoMode = true; // Default value
    
// //     res.status(200).json({ 
// //       success: true,
// //       autoMode 
// //     });
// //   } catch (error) {
// //     console.error("Error fetching auto status setting:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: "Error fetching setting" 
// //     });
// //   }
// // });

// // // Update auto status setting
// // router.put("/admin/auto-status-setting", authenticateToken, isAdmin, async (req, res) => {
// //   try {
// //     const { autoMode } = req.body;
    
// //     // In production, save this to a Settings collection
// //     // For now, we'll just return success
    
// //     res.status(200).json({ 
// //       success: true,
// //       message: "Auto status mode updated", 
// //       autoMode 
// //     });
// //   } catch (error) {
// //     console.error("Error updating auto status setting:", error);
// //     res.status(500).json({ 
// //       success: false,
// //       message: "Error updating setting" 
// //     });
// //   }
// // });

// // // ==========================================
// // // EXPORT ROUTER
// // // ==========================================

// // module.exports = router;



// const express = require("express");
// const router = express.Router();
// const Book = require("../models/Book");
// const User = require("../models/user");
// const Seller = require("../models/seller");
// const Settings = require("../models/Settings");
// const { authenticateToken } = require("./userAuth");

// // ==========================================
// // ENHANCED ADMIN MIDDLEWARE WITH SECURITY
// // ==========================================
// const isAdmin = async (req, res, next) => {
//   try {
//     const { id } = req.headers;
    
//     if (!id) {
//       console.warn("⚠️ [Admin Auth] No user ID in headers");
//       return res.status(401).json({ 
//         success: false,
//         message: "User ID is required" 
//       });
//     }

//     // Validate MongoDB ObjectId format
//     if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//       console.warn("⚠️ [Admin Auth] Invalid user ID format:", id);
//       return res.status(400).json({ 
//         success: false,
//         message: "Invalid user ID format" 
//       });
//     }

//     const user = await User.findById(id).select("+role +blocked");
    
//     if (!user) {
//       console.warn("⚠️ [Admin Auth] User not found:", id);
//       return res.status(404).json({ 
//         success: false,
//         message: "User not found" 
//       });
//     }

//     if (user.blocked) {
//       console.warn("⚠️ [Admin Auth] Blocked user attempted access:", user.username);
//       return res.status(403).json({ 
//         success: false,
//         message: "Your account has been blocked" 
//       });
//     }

//     if (user.role !== "admin") {
//       console.warn("⚠️ [Admin Auth] Non-admin user attempted access:", user.username);
//       return res.status(403).json({ 
//         success: false,
//         message: "Access denied. Admins only." 
//       });
//     }
    
//     console.log("✅ [Admin Auth] Admin verified:", user.username);
//     req.user = user;
//     req.adminId = id;
//     next();
//   } catch (error) {
//     console.error("❌ [Admin Auth] Authentication error:", error);
//     res.status(500).json({ 
//       success: false,
//       message: "Authentication error" 
//     });
//   }
// };

// // ==========================================
// // AUTO-APPROVAL SETTINGS ROUTES
// // ==========================================

// // ✅ GET: Get auto-approval setting
// router.get("/admin/auto-approval-setting", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     console.log("\n=== ⚙️ ADMIN: GET AUTO-APPROVAL SETTING ===");
    
//     const autoApproval = await Settings.getSetting("autoApproveBooks", false);
    
//     console.log(`✅ Auto-approval is: ${autoApproval ? 'ON' : 'OFF'}`);

//     return res.status(200).json({ 
//       success: true,
//       data: {
//         autoApproval: autoApproval,
//         enabled: autoApproval === true
//       }
//     });

//   } catch (error) {
//     console.error("❌ Error fetching auto-approval setting:", error);
//     return res.status(500).json({ 
//       success: false,
//       message: "Failed to fetch auto-approval setting"
//     });
//   }
// });

// // ✅ PUT: Update auto-approval setting
// router.put("/admin/auto-approval-setting", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const { autoApproval } = req.body;
//     const adminId = req.adminId;

//     console.log("\n=== ⚙️ ADMIN: UPDATE AUTO-APPROVAL SETTING ===");
//     console.log("New Setting:", autoApproval);
//     console.log("Updated By:", req.user.username);

//     if (typeof autoApproval !== "boolean") {
//       return res.status(400).json({ 
//         success: false,
//         message: "autoApproval must be a boolean value (true or false)" 
//       });
//     }

//     // Update setting in database
//     await Settings.setSetting(
//       "autoApproveBooks", 
//       autoApproval, 
//       adminId,
//       "Automatically approve books when sellers add them"
//     );

//     console.log(`✅ Auto-approval ${autoApproval ? 'ENABLED' : 'DISABLED'}`);

//     // If turning on auto-approval, optionally approve all pending books
//     let pendingCount = 0;
//     if (autoApproval === true) {
//       pendingCount = await Book.countDocuments({ 
//         adminApproval: "Pending"
//       });

//       console.log(`📊 Found ${pendingCount} pending books (not auto-approving existing)`);
//     }

//     return res.status(200).json({ 
//       success: true,
//       message: `Auto-approval ${autoApproval ? 'enabled' : 'disabled'} successfully`,
//       data: {
//         autoApproval: autoApproval,
//         updatedBy: req.user.username,
//         updatedAt: new Date(),
//         pendingBooksCount: pendingCount
//       }
//     });

//   } catch (error) {
//     console.error("❌ Error updating auto-approval setting:", error);
//     return res.status(500).json({ 
//       success: false,
//       message: "Failed to update auto-approval setting"
//     });
//   }
// });

// // ✅ PUT: Bulk auto-approve all pending books (Admin only)
// router.put("/admin/auto-approve-pending-books", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const adminId = req.adminId;

//     console.log("\n=== ✅ ADMIN: AUTO-APPROVE ALL PENDING BOOKS ===");

//     // Update all pending books
//     const result = await Book.updateMany(
//       { 
//         adminApproval: "Pending"
//       },
//       { 
//         $set: { 
//           isApproved: true,
//           adminApproval: 'Approved',
//           approvedAt: new Date(),
//           approvedBy: adminId
//         } 
//       }
//     );

//     // Also update their status if they have stock
//     const statusUpdateResult = await Book.updateMany(
//       { 
//         adminApproval: "Approved",
//         stock: { $gt: 0 },
//         productStatus: "Arriving Soon"
//       },
//       { 
//         $set: { 
//           productStatus: "Available"
//         } 
//       }
//     );

//     console.log(`✅ Auto-approved ${result.modifiedCount} books`);
//     console.log(`✅ Updated status for ${statusUpdateResult.modifiedCount} books`);

//     return res.status(200).json({ 
//       success: true,
//       message: `Successfully auto-approved ${result.modifiedCount} pending books`,
//       data: {
//         approvedCount: result.modifiedCount,
//         statusUpdatedCount: statusUpdateResult.modifiedCount,
//         approvedBy: req.user.username
//       }
//     });

//   } catch (error) {
//     console.error("❌ Auto-approve pending books error:", error);
//     return res.status(500).json({ 
//       success: false,
//       message: "Failed to auto-approve pending books"
//     });
//   }
// });

// // ==========================================
// // BOOK APPROVAL ROUTES
// // ==========================================

// // ✅ GET: Get all books with approval status (Admin only)
// router.get("/admin/all-books", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const { status, approval } = req.query;

//     console.log("\n=== 📚 ADMIN: FETCH ALL BOOKS ===");
//     console.log("Admin:", req.user.username);
//     console.log("Filters - Status:", status, "Approval:", approval);

//     let query = {};
    
//     // Filter by product status
//     if (status && status !== 'all') {
//       query.productStatus = status;
//     }
    
//     // Filter by approval status
//     if (approval) {
//       if (approval === 'approved') {
//         query.$or = [
//           { isApproved: true },
//           { adminApproval: 'Approved' }
//         ];
//       } else if (approval === 'pending') {
//         query.adminApproval = 'Pending';
//       } else if (approval === 'rejected') {
//         query.adminApproval = 'Rejected';
//       }
//     }

//     const books = await Book.find(query)
//       .populate('seller', 'businessName fullName email phone')
//       .populate('approvedBy', 'username email')
//       .sort({ createdAt: -1 });

//     console.log(`✅ Found ${books.length} books`);

//     // Get auto-approval status
//     const autoApproval = await Settings.getSetting("autoApproveBooks", false);

//     return res.status(200).json({ 
//       success: true,
//       message: "Books retrieved successfully",
//       data: books,
//       total: books.length,
//       autoApprovalEnabled: autoApproval
//     });

//   } catch (error) {
//     console.error("❌ Error fetching books:", error);
//     return res.status(500).json({ 
//       success: false,
//       message: "Failed to retrieve books"
//     });
//   }
// });

// // ✅ PUT: Approve book (Admin only)
// router.put("/admin/approve-book/:id", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const bookId = req.params.id;
//     const adminId = req.adminId;

//     console.log("\n=== ✅ ADMIN: APPROVE BOOK ===");
//     console.log("Book ID:", bookId);
//     console.log("Admin:", req.user.username);

//     // Validate book ID
//     if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Invalid book ID format" 
//       });
//     }

//     // Find book
//     const book = await Book.findById(bookId);
//     if (!book) {
//       return res.status(404).json({ 
//         success: false,
//         message: "Book not found" 
//       });
//     }

//     // Check if already approved
//     if (book.isApproved || book.adminApproval === 'Approved') {
//       return res.status(400).json({ 
//         success: false,
//         message: "Book is already approved" 
//       });
//     }

//     // Update book approval status
//     book.isApproved = true;
//     book.adminApproval = "Approved";
//     book.approvedAt = new Date();
//     book.approvedBy = adminId;
    
//     // If book has stock and was "Arriving Soon", change to "Available"
//     if (book.stock > 0 && book.productStatus === "Arriving Soon") {
//       book.productStatus = "Available";
//       console.log("📊 Auto-updated status to 'Available'");
//     }

//     await book.save();

//     console.log("✅ Book approved successfully");

//     return res.status(200).json({ 
//       success: true,
//       message: "Book approved successfully",
//       data: {
//         id: book._id,
//         title: book.title,
//         isApproved: book.isApproved,
//         adminApproval: book.adminApproval,
//         productStatus: book.productStatus,
//         approvedAt: book.approvedAt
//       }
//     });

//   } catch (error) {
//     console.error("❌ Approve book error:", error);
//     return res.status(500).json({ 
//       success: false,
//       message: "Failed to approve book"
//     });
//   }
// });

// // ✅ PUT: Reject book (Admin only)
// router.put("/admin/reject-book/:id", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const bookId = req.params.id;
//     const { reason } = req.body;

//     console.log("\n=== ❌ ADMIN: REJECT BOOK ===");
//     console.log("Book ID:", bookId);
//     console.log("Reason:", reason);

//     // Validate book ID
//     if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Invalid book ID format" 
//       });
//     }

//     // Find book
//     const book = await Book.findById(bookId);
//     if (!book) {
//       return res.status(404).json({ 
//         success: false,
//         message: "Book not found" 
//       });
//     }

//     // Update book rejection status
//     book.isApproved = false;
//     book.adminApproval = "Rejected";
//     book.rejectionReason = reason || "Not specified";
//     book.productStatus = "Not Available";

//     await book.save();

//     console.log("✅ Book rejected");

//     return res.status(200).json({ 
//       success: true,
//       message: "Book rejected successfully",
//       data: {
//         id: book._id,
//         title: book.title,
//         isApproved: book.isApproved,
//         adminApproval: book.adminApproval,
//         rejectionReason: book.rejectionReason
//       }
//     });

//   } catch (error) {
//     console.error("❌ Reject book error:", error);
//     return res.status(500).json({ 
//       success: false,
//       message: "Failed to reject book"
//     });
//   }
// });

// // ✅ PUT: Bulk approve books (Admin only)
// router.put("/admin/bulk-approve-books", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const { bookIds } = req.body;
//     const adminId = req.adminId;

//     console.log("\n=== ✅ ADMIN: BULK APPROVE BOOKS ===");
//     console.log("Book IDs:", bookIds);

//     if (!bookIds || !Array.isArray(bookIds) || bookIds.length === 0) {
//       return res.status(400).json({ 
//         success: false,
//         message: "bookIds array is required" 
//       });
//     }

//     const result = await Book.updateMany(
//       { 
//         _id: { $in: bookIds },
//         adminApproval: { $ne: 'Approved' }
//       },
//       { 
//         $set: { 
//           isApproved: true,
//           adminApproval: 'Approved',
//           approvedAt: new Date(),
//           approvedBy: adminId
//         } 
//       }
//     );

//     // Update status for books with stock
//     await Book.updateMany(
//       { 
//         _id: { $in: bookIds },
//         stock: { $gt: 0 },
//         productStatus: "Arriving Soon"
//       },
//       { 
//         $set: { 
//           productStatus: "Available"
//         } 
//       }
//     );

//     console.log(`✅ Approved ${result.modifiedCount} books`);

//     return res.status(200).json({ 
//       success: true,
//       message: `${result.modifiedCount} books approved successfully`,
//       modifiedCount: result.modifiedCount
//     });

//   } catch (error) {
//     console.error("❌ Bulk approve error:", error);
//     return res.status(500).json({ 
//       success: false,
//       message: "Failed to approve books"
//     });
//   }
// });

// // ==========================================
// // BOOK EDITING ROUTES (ADMIN)
// // ==========================================

// // ✅ PUT: Admin update book stock
// router.put("/admin/update-book-stock/:id", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const bookId = req.params.id;
//     const { stock } = req.body;

//     console.log("\n=== 📦 ADMIN: UPDATE BOOK STOCK ===");
//     console.log("Book ID:", bookId);
//     console.log("New Stock:", stock);

//     // Validate book ID
//     if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Invalid book ID format" 
//       });
//     }

//     // Validate stock value
//     if (stock === undefined || stock === null || isNaN(stock) || stock < 0) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Valid stock quantity is required (0 or more)" 
//       });
//     }

//     // Find book
//     const book = await Book.findById(bookId);
//     if (!book) {
//       return res.status(404).json({ 
//         success: false,
//         message: "Book not found" 
//       });
//     }

//     const oldStock = book.stock;
//     book.stock = parseInt(stock);

//     // Auto-update product status based on stock
//     if (parseInt(stock) === 0 && book.productStatus === "Available") {
//       book.productStatus = "Sold Out";
//       console.log("📊 Auto-updated status to 'Sold Out' (stock = 0)");
//     } else if (parseInt(stock) > 0 && book.productStatus === "Sold Out") {
//       // Only auto-update to Available if the product is approved
//       const isApproved = book.isApproved || book.adminApproval === "Approved";
//       if (isApproved) {
//         book.productStatus = "Available";
//         console.log("📊 Auto-updated status to 'Available' (stock > 0)");
//       }
//     }

//     await book.save();

//     console.log(`✅ Stock updated: ${oldStock} → ${stock}`);

//     return res.status(200).json({ 
//       success: true,
//       message: "Stock updated successfully",
//       data: {
//         id: book._id,
//         title: book.title,
//         oldStock: oldStock,
//         newStock: book.stock,
//         productStatus: book.productStatus
//       }
//     });

//   } catch (error) {
//     console.error("❌ Update stock error:", error);
//     return res.status(500).json({ 
//       success: false,
//       message: "Failed to update stock"
//     });
//   }
// });

// // ✅ PUT: Admin update book price
// router.put("/admin/update-book-price/:id", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const bookId = req.params.id;
//     const { price } = req.body;

//     console.log("\n=== 💰 ADMIN: UPDATE BOOK PRICE ===");
//     console.log("Book ID:", bookId);
//     console.log("New Price:", price);

//     // Validate book ID
//     if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Invalid book ID format" 
//       });
//     }

//     // Validate price value
//     if (price === undefined || price === null || isNaN(price) || price <= 0) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Valid price is required (greater than 0)" 
//       });
//     }

//     // Find book
//     const book = await Book.findById(bookId);
//     if (!book) {
//       return res.status(404).json({ 
//         success: false,
//         message: "Book not found" 
//       });
//     }

//     const oldPrice = book.price;
//     book.price = parseFloat(price);

//     await book.save();

//     console.log(`✅ Price updated: ₹${oldPrice} → ₹${price}`);

//     return res.status(200).json({ 
//       success: true,
//       message: "Price updated successfully",
//       data: {
//         id: book._id,
//         title: book.title,
//         oldPrice: oldPrice,
//         newPrice: book.price
//       }
//     });

//   } catch (error) {
//     console.error("❌ Update price error:", error);
//     return res.status(500).json({ 
//       success: false,
//       message: "Failed to update price"
//     });
//   }
// });

// // ✅ PUT: Admin edit complete book details
// router.put("/admin/edit-book/:id", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const bookId = req.params.id;
//     const {
//       title,
//       author,
//       price,
//       desc,
//       language,
//       category,
//       editionOrPublishYear,
//       stock,
//       productStatus
//     } = req.body;

//     console.log("\n=== ✏️ ADMIN: EDIT BOOK ===");
//     console.log("Book ID:", bookId);
//     console.log("Admin:", req.user.username);

//     // Validate book ID
//     if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Invalid book ID format" 
//       });
//     }

//     // Find book
//     const book = await Book.findById(bookId);
//     if (!book) {
//       return res.status(404).json({ 
//         success: false,
//         message: "Book not found" 
//       });
//     }

//     // Store old values for logging
//     const oldValues = {
//       title: book.title,
//       price: book.price,
//       stock: book.stock,
//       productStatus: book.productStatus
//     };

//     // Update fields if provided
//     if (title && title.trim()) {
//       book.title = title.trim();
//     }
    
//     if (author && author.trim()) {
//       book.author = author.trim();
//     }
    
//     if (price !== undefined && price > 0) {
//       book.price = parseFloat(price);
//     }
    
//     if (desc && desc.trim()) {
//       if (desc.trim().length < 20) {
//         return res.status(400).json({ 
//           success: false,
//           message: "Description must be at least 20 characters" 
//         });
//       }
//       book.desc = desc.trim();
//     }
    
//     if (language && language.trim()) {
//       book.language = language.trim();
//     }
    
//     if (category && category.trim()) {
//       book.category = category.trim();
//     }
    
//     if (editionOrPublishYear) {
//       book.editionOrPublishYear = editionOrPublishYear.trim();
//     }
    
//     if (stock !== undefined && stock >= 0) {
//       book.stock = parseInt(stock);
      
//       // Auto-update status based on stock
//       if (stock === 0 && book.productStatus === "Available") {
//         book.productStatus = "Sold Out";
//       } else if (stock > 0 && book.productStatus === "Sold Out" && book.isApproved) {
//         book.productStatus = "Available";
//       }
//     }

//     // Update product status if provided
//     if (productStatus) {
//       const validStatuses = ["Available", "Sold Out", "Not Available", "Arriving Soon"];
//       if (!validStatuses.includes(productStatus)) {
//         return res.status(400).json({ 
//           success: false,
//           message: "Invalid product status" 
//         });
//       }
      
//       // Check if can be set to Available
//       if (productStatus === "Available") {
//         const isApproved = book.isApproved || book.adminApproval === "Approved";
//         if (!isApproved) {
//           return res.status(400).json({ 
//             success: false,
//             message: "Book must be approved before it can be set to Available" 
//           });
//         }
//       }
      
//       book.productStatus = productStatus;
//     }

//     await book.save();

//     console.log("✅ Book updated successfully");
//     console.log("Changes:", {
//       title: oldValues.title !== book.title,
//       price: oldValues.price !== book.price,
//       stock: oldValues.stock !== book.stock,
//       status: oldValues.productStatus !== book.productStatus
//     });

//     return res.status(200).json({ 
//       success: true,
//       message: "Book updated successfully",
//       data: book,
//       changes: {
//         title: oldValues.title !== book.title ? { old: oldValues.title, new: book.title } : null,
//         price: oldValues.price !== book.price ? { old: oldValues.price, new: book.price } : null,
//         stock: oldValues.stock !== book.stock ? { old: oldValues.stock, new: book.stock } : null,
//         status: oldValues.productStatus !== book.productStatus ? { old: oldValues.productStatus, new: book.productStatus } : null,
//       }
//     });

//   } catch (error) {
//     console.error("❌ Edit book error:", error);
//     return res.status(500).json({ 
//       success: false,
//       message: "Failed to update book"
//     });
//   }
// });

// // ✅ GET: Get single book details (Admin)
// router.get("/admin/book/:id", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const bookId = req.params.id;

//     console.log("\n=== 📖 ADMIN: GET BOOK DETAILS ===");
//     console.log("Book ID:", bookId);

//     // Validate book ID
//     if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Invalid book ID format" 
//       });
//     }

//     const book = await Book.findById(bookId)
//       .populate('seller', 'businessName fullName email phone')
//       .populate('approvedBy', 'username email');

//     if (!book) {
//       return res.status(404).json({ 
//         success: false,
//         message: "Book not found" 
//       });
//     }

//     console.log("✅ Book details retrieved");

//     return res.status(200).json({ 
//       success: true,
//       message: "Book details retrieved successfully",
//       data: book
//     });

//   } catch (error) {
//     console.error("❌ Get book error:", error);
//     return res.status(500).json({ 
//       success: false,
//       message: "Failed to retrieve book"
//     });
//   }
// });

// // ==========================================
// // BOOK STATUS MANAGEMENT
// // ==========================================

// // ✅ PUT: Admin update book status
// router.put("/admin/book-status/:id", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const bookId = req.params.id;
//     const { status } = req.body;

//     console.log("\n=== 📊 ADMIN: UPDATE BOOK STATUS ===");
//     console.log("Book ID:", bookId);
//     console.log("New Status:", status);

//     // Validate book ID
//     if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Invalid book ID format" 
//       });
//     }

//     // Validate status
//     const validStatuses = ["Available", "Sold Out", "Not Available", "Arriving Soon"];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ 
//         success: false,
//         message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` 
//       });
//     }

//     // Find book
//     const book = await Book.findById(bookId);
//     if (!book) {
//       return res.status(404).json({ 
//         success: false,
//         message: "Book not found" 
//       });
//     }

//     // Check if can be set to Available
//     if (status === "Available") {
//       const isApproved = book.isApproved || book.adminApproval === "Approved";
//       if (!isApproved) {
//         return res.status(400).json({ 
//           success: false,
//           message: "Book must be approved before it can be set to Available" 
//         });
//       }
//       if (book.stock === 0) {
//         return res.status(400).json({ 
//           success: false,
//           message: "Cannot set to Available when stock is 0" 
//         });
//       }
//     }

//     const oldStatus = book.productStatus;
//     book.productStatus = status;

//     // Auto-adjust stock based on status
//     if (status === "Sold Out") {
//       book.stock = 0;
//       console.log("📦 Auto-set stock to 0");
//     } else if (status === "Available" && book.stock === 0) {
//       book.stock = 1;
//       console.log("📦 Auto-set stock to 1");
//     }

//     await book.save();

//     console.log(`✅ Status updated: ${oldStatus} → ${status}`);

//     return res.status(200).json({ 
//       success: true,
//       message: `Book status updated to: ${status}`,
//       data: {
//         id: book._id,
//         title: book.title,
//         oldStatus: oldStatus,
//         productStatus: book.productStatus,
//         stock: book.stock
//       }
//     });

//   } catch (error) {
//     console.error("❌ Update book status error:", error);
//     return res.status(500).json({ 
//       success: false,
//       message: "Failed to update book status"
//     });
//   }
// });

// // ✅ DELETE: Delete book (Admin only)
// router.delete("/admin/delete-book/:id", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const bookId = req.params.id;

//     console.log("\n=== 🗑️ ADMIN: DELETE BOOK ===");
//     console.log("Book ID:", bookId);

//     // Validate book ID
//     if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({ 
//         success: false,
//         message: "Invalid book ID format" 
//       });
//     }

//     const book = await Book.findById(bookId);
//     if (!book) {
//       return res.status(404).json({ 
//         success: false,
//         message: "Book not found" 
//       });
//     }

//     await Book.findByIdAndDelete(bookId);

//     console.log("✅ Book deleted successfully");

//     return res.status(200).json({ 
//       success: true,
//       message: "Book deleted successfully"
//     });

//   } catch (error) {
//     console.error("❌ Delete book error:", error);
//     return res.status(500).json({ 
//       success: false,
//       message: "Failed to delete book"
//     });
//   }
// });

// // ==========================================
// // STATISTICS & ANALYTICS
// // ==========================================

// // ✅ GET: Book approval statistics
// router.get("/admin/books/approval-stats", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const pendingBooks = await Book.countDocuments({ 
//       adminApproval: 'Pending'
//     });

//     const approvedBooks = await Book.countDocuments({ 
//       $or: [
//         { isApproved: true },
//         { adminApproval: 'Approved' }
//       ]
//     });

//     const rejectedBooks = await Book.countDocuments({ 
//       adminApproval: 'Rejected' 
//     });

//     const totalBooks = await Book.countDocuments();

//     // Get auto-approval status
//     const autoApproval = await Settings.getSetting("autoApproveBooks", false);

//     return res.status(200).json({
//       success: true,
//       data: {
//         total: totalBooks,
//         pending: pendingBooks,
//         approved: approvedBooks,
//         rejected: rejectedBooks,
//         pendingPercentage: totalBooks > 0 ? ((pendingBooks / totalBooks) * 100).toFixed(2) : 0,
//         approvedPercentage: totalBooks > 0 ? ((approvedBooks / totalBooks) * 100).toFixed(2) : 0,
//         autoApprovalEnabled: autoApproval
//       }
//     });

//   } catch (error) {
//     console.error("❌ Get approval stats error:", error);
//     return res.status(500).json({ 
//       success: false,
//       message: "Failed to get statistics"
//     });
//   }
// });

// // ✅ GET: Book statistics for admin dashboard
// router.get("/admin/books/statistics", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const totalBooks = await Book.countDocuments();
//     const availableBooks = await Book.countDocuments({ productStatus: "Available" });
//     const soldOutBooks = await Book.countDocuments({ productStatus: "Sold Out" });
//     const arrivingSoonBooks = await Book.countDocuments({ productStatus: "Arriving Soon" });
//     const notAvailableBooks = await Book.countDocuments({ productStatus: "Not Available" });
    
//     const sevenDaysAgo = new Date();
//     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
//     const newBooks = await Book.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    
//     // Approval stats
//     const pendingApproval = await Book.countDocuments({ adminApproval: 'Pending' });
//     const approved = await Book.countDocuments({ adminApproval: 'Approved' });
//     const rejected = await Book.countDocuments({ adminApproval: 'Rejected' });

//     // Get auto-approval status
//     const autoApproval = await Settings.getSetting("autoApproveBooks", false);

//     res.status(200).json({
//       success: true,
//       data: {
//         totalBooks,
//         availableBooks,
//         soldOutBooks,
//         arrivingSoonBooks,
//         notAvailableBooks,
//         newBooks,
//         pendingApproval,
//         approved,
//         rejected,
//         autoApprovalEnabled: autoApproval
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching statistics:", error);
//     res.status(500).json({ 
//       success: false,
//       message: "Error fetching statistics" 
//     });
//   }
// });

// // ==========================================
// // USER & SELLER MANAGEMENT
// // ==========================================

// // Get all users
// router.get("/admin/users", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const users = await User.find({}, "-password")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       message: "Fetched all users",
//       data: users,
//     });
//   } catch (err) {
//     console.error("Error fetching users:", err);
//     res.status(500).json({ 
//       success: false,
//       message: "Internal Server Error" 
//     });
//   }
// });

// // Get all sellers
// router.get("/admin/sellers", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const sellers = await Seller.find().sort({ createdAt: -1 });
    
//     res.status(200).json({ 
//       success: true,
//       message: "Fetched sellers", 
//       data: sellers 
//     });
//   } catch (error) {
//     console.error("Error fetching sellers:", error);
//     res.status(500).json({ 
//       success: false,
//       message: "Failed to fetch sellers" 
//     });
//   }
// });

// // Update seller status
// router.put("/admin/sellers/:id/status", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const validStatuses = ["Pending", "Approved", "Rejected", "Banned"];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid status. Must be: Pending, Approved, Rejected, or Banned"
//       });
//     }

//     const seller = await Seller.findById(id);
//     if (!seller) {
//       return res.status(404).json({
//         success: false,
//         message: "Seller not found"
//       });
//     }

//     seller.status = status;
//     await seller.save();

//     // Update user schema
//     let userApplicationStatus;
//     let userIsSeller = false;

//     switch (status) {
//       case "Approved":
//         userApplicationStatus = "Accepted";
//         userIsSeller = true;
//         break;
//       case "Rejected":
//         userApplicationStatus = "Rejected";
//         userIsSeller = false;
//         break;
//       case "Banned":
//         userApplicationStatus = "Rejected";
//         userIsSeller = false;
//         break;
//       case "Pending":
//         userApplicationStatus = "Applied";
//         userIsSeller = false;
//         break;
//       default:
//         userApplicationStatus = "Available";
//         userIsSeller = false;
//     }

//     const user = await User.findById(seller.user);
//     if (user) {
//       user.sellerApplicationStatus = userApplicationStatus;
//       user.isSeller = userIsSeller;
//       await user.save();
//     }

//     return res.status(200).json({
//       success: true,
//       message: `Seller status updated to ${status}`,
//       data: {
//         seller: seller,
//         userUpdated: !!user
//       }
//     });

//   } catch (error) {
//     console.error("Error updating seller status:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// });

// // Delete seller
// router.delete("/admin/sellers/:id", authenticateToken, isAdmin, async (req, res) => {
//   try {
//     const { id } = req.params;

//     const seller = await Seller.findById(id);
//     if (!seller) {
//       return res.status(404).json({ 
//         success: false,
//         message: "Seller not found" 
//       });
//     }

//     const userId = seller.user;
//     await Seller.findByIdAndDelete(id);

//     if (userId) {
//       await User.findByIdAndUpdate(
//         userId,
//         { 
//           isSeller: false,
//           sellerApplicationStatus: "Available"
//         }
//       );
//     }

//     res.status(200).json({ 
//       success: true,
//       message: "Seller deleted successfully"
//     });

//   } catch (error) {
//     console.error("Error deleting seller:", error);
//     res.status(500).json({ 
//       success: false,
//       message: "Internal server error"
//     });
//   }
// });

// module.exports = router;






const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const User = require("../models/user");
const Seller = require("../models/seller");
const Order = require("../models/order");
const Settings = require("../models/Settings");
const { authenticateToken } = require("./userAuth");
const { 
  sendSellerApprovalEmail,
  sendSellerRejectionEmail,
  sendSellerBanEmail,
  sendSellerDeletionEmail
} = require("../services/emailService");

// ==========================================
// ENHANCED ADMIN MIDDLEWARE WITH SECURITY
// ==========================================
const isAdmin = async (req, res, next) => {
  try {
    const { id } = req.headers;
    
    if (!id) {
      console.warn("⚠️ [Admin Auth] No user ID in headers");
      return res.status(401).json({ 
        success: false,
        message: "User ID is required" 
      });
    }

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn("⚠️ [Admin Auth] Invalid user ID format:", id);
      return res.status(400).json({ 
        success: false,
        message: "Invalid user ID format" 
      });
    }

    const user = await User.findById(id).select("+role +blocked");
    
    if (!user) {
      console.warn("⚠️ [Admin Auth] User not found:", id);
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    if (user.blocked) {
      console.warn("⚠️ [Admin Auth] Blocked user attempted access:", user.username);
      return res.status(403).json({ 
        success: false,
        message: "Your account has been blocked" 
      });
    }

    if (user.role !== "admin") {
      console.warn("⚠️ [Admin Auth] Non-admin user attempted access:", user.username);
      return res.status(403).json({ 
        success: false,
        message: "Access denied. Admins only." 
      });
    }
    
    console.log("✅ [Admin Auth] Admin verified:", user.username);
    req.user = user;
    req.adminId = id;
    next();
  } catch (error) {
    console.error("❌ [Admin Auth] Authentication error:", error);
    res.status(500).json({ 
      success: false,
      message: "Authentication error" 
    });
  }
};

// ==========================================
// SELLER MANAGEMENT ROUTES WITH EMAIL
// ==========================================

// ✅ GET: Get all sellers
router.get("/admin/sellers", authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log("\n=== 📊 ADMIN: GET ALL SELLERS ===");
    
    const sellers = await Seller.find()
      .populate("user", "email avatar phone username")
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${sellers.length} sellers`);
    
    res.status(200).json({ 
      success: true,
      message: "Sellers fetched successfully", 
      data: sellers 
    });
  } catch (error) {
    console.error("❌ Error fetching sellers:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch sellers" 
    });
  }
});

// ✅ GET: Get single seller details
router.get("/admin/sellers/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log("\n=== 👤 ADMIN: GET SELLER DETAILS ===");
    console.log("Seller ID:", id);
    
    const seller = await Seller.findById(id)
      .populate("user", "email avatar phone username");
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found"
      });
    }
    
    console.log("✅ Seller details fetched");
    
    res.status(200).json({ 
      success: true,
      data: seller 
    });
  } catch (error) {
    console.error("❌ Error fetching seller details:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch seller details" 
    });
  }
});

// ✅ PUT: Update seller status with email notifications
router.put("/admin/sellers/:id/status", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    const adminId = req.adminId;

    console.log("\n=== 🔄 ADMIN: UPDATE SELLER STATUS ===");
    console.log("Seller ID:", id);
    console.log("New Status:", status);
    console.log("Reason:", reason || "N/A");
    console.log("Admin:", req.user.username);

    // Validate status
    const validStatuses = ["Pending", "Approved", "Rejected", "Banned"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be: Pending, Approved, Rejected, or Banned"
      });
    }

    // Validate reason for certain actions
    if ((status === "Rejected" || status === "Banned") && !reason) {
      return res.status(400).json({
        success: false,
        message: `Reason is required when ${status.toLowerCase()}ing a seller`
      });
    }

    // Find seller
    const seller = await Seller.findById(id).populate("user");
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found"
      });
    }

    // Get user details
    const user = await User.findById(seller.user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Associated user not found"
      });
    }

    // Store old status for logging
    const oldStatus = seller.status;

    // Update seller status
    seller.status = status;
    seller.statusUpdatedAt = new Date();
    seller.statusUpdatedBy = adminId;
    if (reason) {
      seller.statusReason = reason;
    }
    await seller.save();

    // Update user schema
    let userApplicationStatus;
    let userIsSeller = false;

    switch (status) {
      case "Approved":
        userApplicationStatus = "Accepted";
        userIsSeller = true;
        break;
      case "Rejected":
        userApplicationStatus = "Rejected";
        userIsSeller = false;
        break;
      case "Banned":
        userApplicationStatus = "Rejected";
        userIsSeller = false;
        break;
      case "Pending":
        userApplicationStatus = "Applied";
        userIsSeller = false;
        break;
      default:
        userApplicationStatus = "Available";
        userIsSeller = false;
    }

    user.sellerApplicationStatus = userApplicationStatus;
    user.isSeller = userIsSeller;
    await user.save();

    // Prepare seller data for email
    const sellerData = {
      email: user.email,
      fullName: seller.fullName,
      businessName: seller.businessName,
    };

    // Send email notification
    try {
      switch (status) {
        case "Approved":
          if (oldStatus !== "Approved") {
            await sendSellerApprovalEmail(sellerData);
            console.log("✅ Approval email sent");
          }
          break;

        case "Rejected":
          await sendSellerRejectionEmail(sellerData, reason);
          console.log("✅ Rejection email sent");
          break;

        case "Banned":
          await sendSellerBanEmail(sellerData, reason);
          console.log("✅ Ban notification email sent");
          break;

        case "Pending":
          console.log("ℹ️ No email sent for Pending status");
          break;
      }
    } catch (emailError) {
      console.error("❌ Error sending email:", emailError);
      // Don't fail the request if email fails
    }

    console.log(`✅ Seller status updated: ${oldStatus} → ${status}`);

    return res.status(200).json({
      success: true,
      message: `Seller status updated to ${status}`,
      data: {
        seller: {
          id: seller._id,
          fullName: seller.fullName,
          status: seller.status,
          email: user.email,
        },
        userUpdated: true,
        emailSent: true
      }
    });

  } catch (error) {
    console.error("❌ Error updating seller status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// ✅ DELETE: Delete seller with email notification
router.delete("/admin/sellers/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    console.log("\n=== 🗑️ ADMIN: DELETE SELLER ===");
    console.log("Seller ID:", id);
    console.log("Reason:", reason || "N/A");
    console.log("Admin:", req.user.username);

    // Validate reason
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Reason is required when deleting a seller"
      });
    }

    // Find seller
    const seller = await Seller.findById(id).populate("user");
    if (!seller) {
      return res.status(404).json({ 
        success: false,
        message: "Seller not found" 
      });
    }

    // Get user details
    const user = await User.findById(seller.user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Associated user not found"
      });
    }

    // Prepare seller data for email
    const sellerData = {
      email: user.email,
      fullName: seller.fullName,
      businessName: seller.businessName,
    };

    // Send deletion notification email
    try {
      await sendSellerDeletionEmail(sellerData, reason);
      console.log("✅ Deletion notification email sent");
    } catch (emailError) {
      console.error("❌ Error sending deletion email:", emailError);
      // Continue with deletion even if email fails
    }

    // Update user
    user.isSeller = false;
    user.sellerApplicationStatus = "Available";
    await user.save();

    // Delete seller
    await Seller.findByIdAndDelete(id);

    console.log("✅ Seller deleted successfully");

    res.status(200).json({ 
      success: true,
      message: "Seller deleted successfully",
      data: {
        deletedSellerId: id,
        userUpdated: true,
        emailSent: true
      }
    });

  } catch (error) {
    console.error("❌ Error deleting seller:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error"
    });
  }
});

// ✅ GET: Get seller statistics
router.get("/admin/sellers/stats/summary", authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log("\n=== 📊 ADMIN: GET SELLER STATISTICS ===");
    
    const totalSellers = await Seller.countDocuments();
    const pendingSellers = await Seller.countDocuments({ status: "Pending" });
    const approvedSellers = await Seller.countDocuments({ status: "Approved" });
    const rejectedSellers = await Seller.countDocuments({ status: "Rejected" });
    const bannedSellers = await Seller.countDocuments({ status: "Banned" });
    
    // New sellers in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newSellers = await Seller.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    });

    console.log("✅ Statistics calculated");

    res.status(200).json({
      success: true,
      data: {
        total: totalSellers,
        pending: pendingSellers,
        approved: approvedSellers,
        rejected: rejectedSellers,
        banned: bannedSellers,
        newThisWeek: newSellers,
        pendingPercentage: totalSellers > 0 ? ((pendingSellers / totalSellers) * 100).toFixed(2) : 0,
        approvedPercentage: totalSellers > 0 ? ((approvedSellers / totalSellers) * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    console.error("❌ Error fetching seller stats:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch statistics" 
    });
  }
});
// ==========================================
// ENHANCED ADMIN MIDDLEWARE WITH SECURITY
// ==========================================
const isuAdmin = async (req, res, next) => {
  try {
    const { id } = req.headers;
    
    if (!id) {
      console.warn("⚠️ [Admin Auth] No user ID in headers");
      return res.status(401).json({ 
        success: false,
        message: "User ID is required" 
      });
    }

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn("⚠️ [Admin Auth] Invalid user ID format:", id);
      return res.status(400).json({ 
        success: false,
        message: "Invalid user ID format" 
      });
    }

    const user = await User.findById(id).select("+role +blocked");
    
    if (!user) {
      console.warn("⚠️ [Admin Auth] User not found:", id);
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    if (user.blocked) {
      console.warn("⚠️ [Admin Auth] Blocked user attempted access:", user.username);
      return res.status(403).json({ 
        success: false,
        message: "Your account has been blocked" 
      });
    }

    if (user.role !== "admin") {
      console.warn("⚠️ [Admin Auth] Non-admin user attempted access:", user.username);
      return res.status(403).json({ 
        success: false,
        message: "Access denied. Admins only." 
      });
    }
    
    console.log("✅ [Admin Auth] Admin verified:", user.username);
    req.user = user;
    req.adminId = id;
    next();
  } catch (error) {
    console.error("❌ [Admin Auth] Authentication error:", error);
    res.status(500).json({ 
      success: false,
      message: "Authentication error" 
    });
  }
};

// ==========================================
// AUTO-APPROVAL & AUTO-STATUS SETTINGS ROUTES
// ==========================================

// ✅ GET: Get auto-status setting (BACKWARD COMPATIBILITY)
router.get("/admin/auto-status-setting", authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log("\n=== ⚙️ ADMIN: GET AUTO-STATUS SETTING ===");
    
    const autoApproval = await Settings.getSetting("autoApproveBooks", false);
    
    console.log(`✅ Auto-approval is: ${autoApproval ? 'ON' : 'OFF'}`);

    return res.status(200).json({ 
      success: true,
      autoMode: autoApproval, // For backward compatibility
      data: {
        autoApproval: autoApproval,
        enabled: autoApproval === true
      }
    });

  } catch (error) {
    console.error("❌ Error fetching auto-status setting:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to fetch auto-status setting"
    });
  }
});

// ✅ PUT: Update auto-status setting (BACKWARD COMPATIBILITY)
router.put("/admin/auto-status-setting", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { autoMode } = req.body; // Frontend sends autoMode
    const adminId = req.adminId;

    console.log("\n=== ⚙️ ADMIN: UPDATE AUTO-STATUS SETTING ===");
    console.log("New Setting (autoMode):", autoMode);
    console.log("Updated By:", req.user.username);

    if (typeof autoMode !== "boolean") {
      return res.status(400).json({ 
        success: false,
        message: "autoMode must be a boolean value (true or false)" 
      });
    }

    // Update setting in database
    await Settings.setSetting(
      "autoApproveBooks", 
      autoMode, 
      adminId,
      "Automatically approve books when sellers add them"
    );

    console.log(`✅ Auto-approval ${autoMode ? 'ENABLED' : 'DISABLED'}`);

    // If turning on auto-approval, get count of pending books
    let pendingCount = 0;
    if (autoMode === true) {
      pendingCount = await Book.countDocuments({ 
        adminApproval: "Pending"
      });

      console.log(`📊 Found ${pendingCount} pending books`);
    }

    return res.status(200).json({ 
      success: true,
      message: `Auto-approval ${autoMode ? 'enabled' : 'disabled'} successfully`,
      autoMode: autoMode, // For backward compatibility
      data: {
        autoApproval: autoMode,
        updatedBy: req.user.username,
        updatedAt: new Date(),
        pendingBooksCount: pendingCount
      }
    });

  } catch (error) {
    console.error("❌ Error updating auto-status setting:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to update auto-status setting"
    });
  }
});

// ✅ GET: Get auto-approval setting (NEW ENDPOINT)
router.get("/admin/auto-approval-setting", authenticateToken, isAdmin, async (req, res) => {
  try {
    console.log("\n=== ⚙️ ADMIN: GET AUTO-APPROVAL SETTING ===");
    
    const autoApproval = await Settings.getSetting("autoApproveBooks", false);
    
    console.log(`✅ Auto-approval is: ${autoApproval ? 'ON' : 'OFF'}`);

    return res.status(200).json({ 
      success: true,
      data: {
        autoApproval: autoApproval,
        enabled: autoApproval === true
      }
    });

  } catch (error) {
    console.error("❌ Error fetching auto-approval setting:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to fetch auto-approval setting"
    });
  }
});

// ✅ PUT: Update auto-approval setting (NEW ENDPOINT)
router.put("/admin/auto-approval-setting", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { autoApproval } = req.body;
    const adminId = req.adminId;

    console.log("\n=== ⚙️ ADMIN: UPDATE AUTO-APPROVAL SETTING ===");
    console.log("New Setting:", autoApproval);
    console.log("Updated By:", req.user.username);

    if (typeof autoApproval !== "boolean") {
      return res.status(400).json({ 
        success: false,
        message: "autoApproval must be a boolean value (true or false)" 
      });
    }

    // Update setting in database
    await Settings.setSetting(
      "autoApproveBooks", 
      autoApproval, 
      adminId,
      "Automatically approve books when sellers add them"
    );

    console.log(`✅ Auto-approval ${autoApproval ? 'ENABLED' : 'DISABLED'}`);

    // If turning on auto-approval, get count of pending books
    let pendingCount = 0;
    if (autoApproval === true) {
      pendingCount = await Book.countDocuments({ 
        adminApproval: "Pending"
      });

      console.log(`📊 Found ${pendingCount} pending books`);
    }

    return res.status(200).json({ 
      success: true,
      message: `Auto-approval ${autoApproval ? 'enabled' : 'disabled'} successfully`,
      data: {
        autoApproval: autoApproval,
        updatedBy: req.user.username,
        updatedAt: new Date(),
        pendingBooksCount: pendingCount
      }
    });

  } catch (error) {
    console.error("❌ Error updating auto-approval setting:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to update auto-approval setting"
    });
  }
});

// ✅ PUT: Bulk auto-approve all pending books (Admin only)
router.put("/admin/auto-approve-pending-books", authenticateToken, isAdmin, async (req, res) => {
  try {
    const adminId = req.adminId;

    console.log("\n=== ✅ ADMIN: AUTO-APPROVE ALL PENDING BOOKS ===");

    // Update all pending books
    const result = await Book.updateMany(
      { 
        adminApproval: "Pending"
      },
      { 
        $set: { 
          isApproved: true,
          adminApproval: 'Approved',
          approvedAt: new Date(),
          approvedBy: adminId
        } 
      }
    );

    // Also update their status if they have stock
    const statusUpdateResult = await Book.updateMany(
      { 
        adminApproval: "Approved",
        stock: { $gt: 0 },
        productStatus: "Arriving Soon"
      },
      { 
        $set: { 
          productStatus: "Available"
        } 
      }
    );

    console.log(`✅ Auto-approved ${result.modifiedCount} books`);
    console.log(`✅ Updated status for ${statusUpdateResult.modifiedCount} books`);

    return res.status(200).json({ 
      success: true,
      message: `Successfully auto-approved ${result.modifiedCount} pending books`,
      data: {
        approvedCount: result.modifiedCount,
        statusUpdatedCount: statusUpdateResult.modifiedCount,
        approvedBy: req.user.username
      }
    });

  } catch (error) {
    console.error("❌ Auto-approve pending books error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to auto-approve pending books"
    });
  }
});

// ==========================================
// BOOK APPROVAL ROUTES
// ==========================================

// ✅ GET: Get all books with approval status (Admin only)
router.get("/admin/all-books", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status, approval } = req.query;

    console.log("\n=== 📚 ADMIN: FETCH ALL BOOKS ===");
    console.log("Admin:", req.user.username);
    console.log("Filters - Status:", status, "Approval:", approval);

    let query = {};
    
    // Filter by product status
    if (status && status !== 'all') {
      query.productStatus = status;
    }
    
    // Filter by approval status
    if (approval) {
      if (approval === 'approved') {
        query.$or = [
          { isApproved: true },
          { adminApproval: 'Approved' }
        ];
      } else if (approval === 'pending') {
        query.adminApproval = 'Pending';
      } else if (approval === 'rejected') {
        query.adminApproval = 'Rejected';
      }
    }

    const books = await Book.find(query)
      .populate('seller', 'businessName fullName email phone username')
      .populate('approvedBy', 'username email')
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${books.length} books`);

    // Get auto-approval status
    const autoApproval = await Settings.getSetting("autoApproveBooks", false);

    return res.status(200).json({ 
      success: true,
      message: "Books retrieved successfully",
      data: books,
      total: books.length,
      autoApprovalEnabled: autoApproval
    });

  } catch (error) {
    console.error("❌ Error fetching books:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to retrieve books"
    });
  }
});

// ✅ PUT: Approve book (Admin only)
router.put("/admin/approve-book/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const bookId = req.params.id;
    const adminId = req.adminId;

    console.log("\n=== ✅ ADMIN: APPROVE BOOK ===");
    console.log("Book ID:", bookId);
    console.log("Admin:", req.user.username);

    // Validate book ID
    if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid book ID format" 
      });
    }

    // Find book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ 
        success: false,
        message: "Book not found" 
      });
    }

    // Check if already approved
    if (book.isApproved || book.adminApproval === 'Approved') {
      return res.status(400).json({ 
        success: false,
        message: "Book is already approved" 
      });
    }

    // Update book approval status
    book.isApproved = true;
    book.adminApproval = "Approved";
    book.approvedAt = new Date();
    book.approvedBy = adminId;
    
    // If book has stock and was "Arriving Soon", change to "Available"
    if (book.stock > 0 && book.productStatus === "Arriving Soon") {
      book.productStatus = "Available";
      console.log("📊 Auto-updated status to 'Available'");
    }

    await book.save();

    console.log("✅ Book approved successfully");

    return res.status(200).json({ 
      success: true,
      message: "Book approved successfully",
      data: {
        id: book._id,
        title: book.title,
        isApproved: book.isApproved,
        adminApproval: book.adminApproval,
        productStatus: book.productStatus,
        approvedAt: book.approvedAt
      }
    });

  } catch (error) {
    console.error("❌ Approve book error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to approve book"
    });
  }
});

// ✅ PUT: Reject book (Admin only)
router.put("/admin/reject-book/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const bookId = req.params.id;
    const { reason } = req.body;

    console.log("\n=== ❌ ADMIN: REJECT BOOK ===");
    console.log("Book ID:", bookId);
    console.log("Reason:", reason);

    // Validate book ID
    if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid book ID format" 
      });
    }

    // Find book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ 
        success: false,
        message: "Book not found" 
      });
    }

    // Update book rejection status
    book.isApproved = false;
    book.adminApproval = "Rejected";
    book.rejectionReason = reason || "Not specified";
    book.productStatus = "Not Available";

    await book.save();

    console.log("✅ Book rejected");

    return res.status(200).json({ 
      success: true,
      message: "Book rejected successfully",
      data: {
        id: book._id,
        title: book.title,
        isApproved: book.isApproved,
        adminApproval: book.adminApproval,
        rejectionReason: book.rejectionReason
      }
    });

  } catch (error) {
    console.error("❌ Reject book error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to reject book"
    });
  }
});

// ✅ PUT: Bulk approve books (Admin only)
router.put("/admin/bulk-approve-books", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { bookIds } = req.body;
    const adminId = req.adminId;

    console.log("\n=== ✅ ADMIN: BULK APPROVE BOOKS ===");
    console.log("Book IDs:", bookIds);

    if (!bookIds || !Array.isArray(bookIds) || bookIds.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "bookIds array is required" 
      });
    }

    const result = await Book.updateMany(
      { 
        _id: { $in: bookIds },
        adminApproval: { $ne: 'Approved' }
      },
      { 
        $set: { 
          isApproved: true,
          adminApproval: 'Approved',
          approvedAt: new Date(),
          approvedBy: adminId
        } 
      }
    );

    // Update status for books with stock
    await Book.updateMany(
      { 
        _id: { $in: bookIds },
        stock: { $gt: 0 },
        productStatus: "Arriving Soon"
      },
      { 
        $set: { 
          productStatus: "Available"
        } 
      }
    );

    console.log(`✅ Approved ${result.modifiedCount} books`);

    return res.status(200).json({ 
      success: true,
      message: `${result.modifiedCount} books approved successfully`,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error("❌ Bulk approve error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to approve books"
    });
  }
});

// ==========================================
// BOOK EDITING ROUTES (ADMIN)
// ==========================================

// ✅ PUT: Admin update book stock
router.put("/admin/update-book-stock/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const bookId = req.params.id;
    const { stock } = req.body;

    console.log("\n=== 📦 ADMIN: UPDATE BOOK STOCK ===");
    console.log("Book ID:", bookId);
    console.log("New Stock:", stock);

    // Validate book ID
    if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid book ID format" 
      });
    }

    // Validate stock value
    if (stock === undefined || stock === null || isNaN(stock) || stock < 0) {
      return res.status(400).json({ 
        success: false,
        message: "Valid stock quantity is required (0 or more)" 
      });
    }

    // Find book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ 
        success: false,
        message: "Book not found" 
      });
    }

    const oldStock = book.stock;
    book.stock = parseInt(stock);

    // Auto-update product status based on stock
    if (parseInt(stock) === 0 && book.productStatus === "Available") {
      book.productStatus = "Sold Out";
      console.log("📊 Auto-updated status to 'Sold Out' (stock = 0)");
    } else if (parseInt(stock) > 0 && book.productStatus === "Sold Out") {
      // Only auto-update to Available if the product is approved
      const isApproved = book.isApproved || book.adminApproval === "Approved";
      if (isApproved) {
        book.productStatus = "Available";
        console.log("📊 Auto-updated status to 'Available' (stock > 0)");
      }
    }

    await book.save();

    console.log(`✅ Stock updated: ${oldStock} → ${stock}`);

    return res.status(200).json({ 
      success: true,
      message: "Stock updated successfully",
      data: {
        id: book._id,
        title: book.title,
        oldStock: oldStock,
        newStock: book.stock,
        productStatus: book.productStatus
      }
    });

  } catch (error) {
    console.error("❌ Update stock error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to update stock"
    });
  }
});

// ✅ PUT: Admin update book price
router.put("/admin/update-book-price/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const bookId = req.params.id;
    const { price } = req.body;

    console.log("\n=== 💰 ADMIN: UPDATE BOOK PRICE ===");
    console.log("Book ID:", bookId);
    console.log("New Price:", price);

    // Validate book ID
    if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid book ID format" 
      });
    }

    // Validate price value
    if (price === undefined || price === null || isNaN(price) || price <= 0) {
      return res.status(400).json({ 
        success: false,
        message: "Valid price is required (greater than 0)" 
      });
    }

    // Find book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ 
        success: false,
        message: "Book not found" 
      });
    }

    const oldPrice = book.price;
    book.price = parseFloat(price);

    await book.save();

    console.log(`✅ Price updated: ₹${oldPrice} → ₹${price}`);

    return res.status(200).json({ 
      success: true,
      message: "Price updated successfully",
      data: {
        id: book._id,
        title: book.title,
        oldPrice: oldPrice,
        newPrice: book.price
      }
    });

  } catch (error) {
    console.error("❌ Update price error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to update price"
    });
  }
});

// ✅ PUT: Admin edit complete book details
router.put("/admin/edit-book/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const bookId = req.params.id;
    const {
      title,
      author,
      price,
      desc,
      language,
      category,
      editionOrPublishYear,
      stock,
      productStatus
    } = req.body;

    console.log("\n=== ✏️ ADMIN: EDIT BOOK ===");
    console.log("Book ID:", bookId);
    console.log("Admin:", req.user.username);

    // Validate book ID
    if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid book ID format" 
      });
    }

    // Find book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ 
        success: false,
        message: "Book not found" 
      });
    }

    // Store old values for logging
    const oldValues = {
      title: book.title,
      price: book.price,
      stock: book.stock,
      productStatus: book.productStatus
    };

    // Update fields if provided
    if (title && title.trim()) {
      book.title = title.trim();
    }
    
    if (author && author.trim()) {
      book.author = author.trim();
    }
    
    if (price !== undefined && price > 0) {
      book.price = parseFloat(price);
    }
    
    if (desc && desc.trim()) {
      if (desc.trim().length < 20) {
        return res.status(400).json({ 
          success: false,
          message: "Description must be at least 20 characters" 
        });
      }
      book.desc = desc.trim();
    }
    
    if (language && language.trim()) {
      book.language = language.trim();
    }
    
    if (category && category.trim()) {
      book.category = category.trim();
    }
    
    if (editionOrPublishYear) {
      book.editionOrPublishYear = editionOrPublishYear.trim();
    }
    
    if (stock !== undefined && stock >= 0) {
      book.stock = parseInt(stock);
      
      // Auto-update status based on stock
      if (stock === 0 && book.productStatus === "Available") {
        book.productStatus = "Sold Out";
      } else if (stock > 0 && book.productStatus === "Sold Out" && book.isApproved) {
        book.productStatus = "Available";
      }
    }

    // Update product status if provided
    if (productStatus) {
      const validStatuses = ["Available", "Sold Out", "Not Available", "Arriving Soon"];
      if (!validStatuses.includes(productStatus)) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid product status" 
        });
      }
      
      // Check if can be set to Available
      if (productStatus === "Available") {
        const isApproved = book.isApproved || book.adminApproval === "Approved";
        if (!isApproved) {
          return res.status(400).json({ 
            success: false,
            message: "Book must be approved before it can be set to Available" 
          });
        }
      }
      
      book.productStatus = productStatus;
    }

    await book.save();

    console.log("✅ Book updated successfully");
    console.log("Changes:", {
      title: oldValues.title !== book.title,
      price: oldValues.price !== book.price,
      stock: oldValues.stock !== book.stock,
      status: oldValues.productStatus !== book.productStatus
    });

    return res.status(200).json({ 
      success: true,
      message: "Book updated successfully",
      data: book,
      changes: {
        title: oldValues.title !== book.title ? { old: oldValues.title, new: book.title } : null,
        price: oldValues.price !== book.price ? { old: oldValues.price, new: book.price } : null,
        stock: oldValues.stock !== book.stock ? { old: oldValues.stock, new: book.stock } : null,
        status: oldValues.productStatus !== book.productStatus ? { old: oldValues.productStatus, new: book.productStatus } : null,
      }
    });

  } catch (error) {
    console.error("❌ Edit book error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to update book"
    });
  }
});

// ✅ GET: Get single book details (Admin)
router.get("/admin/book/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const bookId = req.params.id;

    console.log("\n=== 📖 ADMIN: GET BOOK DETAILS ===");
    console.log("Book ID:", bookId);

    // Validate book ID
    if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid book ID format" 
      });
    }

    const book = await Book.findById(bookId)
      .populate('seller', 'businessName fullName email phone username')
      .populate('approvedBy', 'username email');

    if (!book) {
      return res.status(404).json({ 
        success: false,
        message: "Book not found" 
      });
    }

    console.log("✅ Book details retrieved");

    return res.status(200).json({ 
      success: true,
      message: "Book details retrieved successfully",
      data: book
    });

  } catch (error) {
    console.error("❌ Get book error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to retrieve book"
    });
  }
});

// ==========================================
// BOOK STATUS MANAGEMENT
// ==========================================

// ✅ GET: Get all books (for admin/seller)
router.get("/seller/all-books", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    let books;
    if (user.role === "admin") {
      // Admin sees all books
      books = await Book.find()
        .populate("seller", "username email")
        .sort({ createdAt: -1 });
    } else {
      // Seller sees only their books
      books = await Book.find({ seller: id })
        .populate("seller", "username email")
        .sort({ createdAt: -1 });
    }
    
    res.status(200).json({ 
      success: true,
      message: "Books fetched successfully", 
      data: books 
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching books" 
    });
  }
});

// ✅ PUT: Admin update book status
router.put("/admin/book-status/:bookId", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { bookId } = req.params;
    const { status } = req.body;

    console.log("\n=== 📊 ADMIN: UPDATE BOOK STATUS ===");
    console.log("Book ID:", bookId);
    console.log("New Status:", status);

    // Validate book ID
    if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid book ID format" 
      });
    }

    // Validate status
    const validStatuses = ["Available", "Sold Out", "Not Available", "Arriving Soon"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` 
      });
    }

    // Find book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ 
        success: false,
        message: "Book not found" 
      });
    }

    // Check if can be set to Available
    if (status === "Available") {
      const isApproved = book.isApproved || book.adminApproval === "Approved";
      if (!isApproved) {
        return res.status(400).json({ 
          success: false,
          message: "Book must be approved before it can be set to Available" 
        });
      }
      if (book.stock === 0) {
        return res.status(400).json({ 
          success: false,
          message: "Cannot set to Available when stock is 0" 
        });
      }
    }

    const oldStatus = book.productStatus;
    
    // Use model method if available
    if (typeof book.updateStatus === 'function') {
      await book.updateStatus(status);
    } else {
      book.productStatus = status;
      
      // Auto-adjust stock based on status
      if (status === "Sold Out") {
        book.stock = 0;
      } else if (status === "Available" && book.stock === 0) {
        book.stock = 1;
      }
      
      await book.save();
    }

    console.log(`✅ Status updated: ${oldStatus} → ${status}`);

    return res.status(200).json({ 
      success: true,
      message: `Book status updated to: ${status}`,
      data: {
        id: book._id,
        title: book.title,
        oldStatus: oldStatus,
        productStatus: book.productStatus,
        stock: book.stock
      }
    });

  } catch (error) {
    console.error("❌ Update book status error:", error);
    return res.status(500).json({ 
      success: false,
      message: error.message || "Failed to update book status"
    });
  }
});

// ✅ DELETE: Delete book (Admin/Seller)
router.delete("/seller/delete-book/:bookId", authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params;
    const { id } = req.headers;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    const book = await Book.findById(bookId);
    
    if (!book) {
      return res.status(404).json({ 
        success: false,
        message: "Book not found" 
      });
    }
    
    // Check if user is admin or the seller who posted the book
    if (user.role !== "admin" && book.seller.toString() !== id) {
      return res.status(403).json({ 
        success: false,
        message: "You don't have permission to delete this book" 
      });
    }
    
    await Book.findByIdAndDelete(bookId);
    
    res.status(200).json({ 
      success: true,
      message: "Book deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ 
      success: false,
      message: "Error deleting book" 
    });
  }
});

// ✅ DELETE: Delete book (Admin only - alternative route)
router.delete("/admin/delete-book/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const bookId = req.params.id;

    console.log("\n=== 🗑️ ADMIN: DELETE BOOK ===");
    console.log("Book ID:", bookId);

    // Validate book ID
    if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid book ID format" 
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ 
        success: false,
        message: "Book not found" 
      });
    }

    await Book.findByIdAndDelete(bookId);

    console.log("✅ Book deleted successfully");

    return res.status(200).json({ 
      success: true,
      message: "Book deleted successfully"
    });

  } catch (error) {
    console.error("❌ Delete book error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to delete book"
    });
  }
});

// ✅ GET: Get books by status
router.get("/admin/books/status/:status", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.params;
    
    const books = await Book.find({ productStatus: status })
      .populate("seller", "username email")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true,
      message: `Books with status ${status}`, 
      data: books 
    });
  } catch (error) {
    console.error("Error fetching books by status:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching books" 
    });
  }
});

// ✅ GET: Get newly added books (last 7 days)
router.get("/admin/books/new", authenticateToken, isAdmin, async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const books = await Book.find({ 
      createdAt: { $gte: sevenDaysAgo } 
    })
      .populate("seller", "username email")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true,
      message: "New books fetched", 
      data: books 
    });
  } catch (error) {
    console.error("Error fetching new books:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching books" 
    });
  }
});

// ✅ PUT: Bulk update book statuses
router.put("/admin/books/bulk-status", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { bookIds, status } = req.body;
    
    if (!bookIds || !Array.isArray(bookIds) || bookIds.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "bookIds array is required" 
      });
    }

    const validStatuses = ["Available", "Sold Out", "Not Available", "Arriving Soon"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid status value" 
      });
    }
    
    const result = await Book.updateMany(
      { _id: { $in: bookIds } },
      { 
        $set: { 
          productStatus: status,
          autoStatusUpdate: false
        } 
      }
    );
    
    res.status(200).json({ 
      success: true,
      message: "Books updated successfully", 
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error("Error in bulk update:", error);
    res.status(500).json({ 
      success: false,
      message: "Error updating books" 
    });
  }
});

// ==========================================
// STATISTICS & ANALYTICS
// ==========================================

// ✅ GET: Book approval statistics
router.get("/admin/books/approval-stats", authenticateToken, isAdmin, async (req, res) => {
  try {
    const pendingBooks = await Book.countDocuments({ 
      adminApproval: 'Pending'
    });

    const approvedBooks = await Book.countDocuments({ 
      $or: [
        { isApproved: true },
        { adminApproval: 'Approved' }
      ]
    });

    const rejectedBooks = await Book.countDocuments({ 
      adminApproval: 'Rejected' 
    });

    const totalBooks = await Book.countDocuments();

    // Get auto-approval status
    const autoApproval = await Settings.getSetting("autoApproveBooks", false);

    return res.status(200).json({
      success: true,
      data: {
        total: totalBooks,
        pending: pendingBooks,
        approved: approvedBooks,
        rejected: rejectedBooks,
        pendingPercentage: totalBooks > 0 ? ((pendingBooks / totalBooks) * 100).toFixed(2) : 0,
        approvedPercentage: totalBooks > 0 ? ((approvedBooks / totalBooks) * 100).toFixed(2) : 0,
        autoApprovalEnabled: autoApproval
      }
    });

  } catch (error) {
    console.error("❌ Get approval stats error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to get statistics"
    });
  }
});

// ✅ GET: Book statistics for admin dashboard
router.get("/admin/books/statistics", authenticateToken, isAdmin, async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const availableBooks = await Book.countDocuments({ productStatus: "Available" });
    const soldOutBooks = await Book.countDocuments({ productStatus: "Sold Out" });
    const arrivingSoonBooks = await Book.countDocuments({ productStatus: "Arriving Soon" });
    const notAvailableBooks = await Book.countDocuments({ productStatus: "Not Available" });
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newBooks = await Book.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    
    // Approval stats
    const pendingApproval = await Book.countDocuments({ adminApproval: 'Pending' });
    const approved = await Book.countDocuments({ adminApproval: 'Approved' });
    const rejected = await Book.countDocuments({ adminApproval: 'Rejected' });

    // Get auto-approval status
    const autoApproval = await Settings.getSetting("autoApproveBooks", false);

    res.status(200).json({
      success: true,
      data: {
        totalBooks,
        availableBooks,
        soldOutBooks,
        arrivingSoonBooks,
        notAvailableBooks,
        newBooks,
        pendingApproval,
        approved,
        rejected,
        autoApprovalEnabled: autoApproval
      },
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching statistics" 
    });
  }
});

// ==========================================
// USER MANAGEMENT ROUTES
// ==========================================

// ✅ GET: Get all users (basic info)
router.get("/admin/users", authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Fetched all users",
      data: users,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ 
      success: false,
      message: "Internal Server Error" 
    });
  }
});

// ✅ GET: Get detailed user information by ID
router.get("/admin/users/:userId/details", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user with populated cart, favourites, and orders
    const user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "cart",
        select: "title author price url desc",
      })
      .populate({
        path: "favourites",
        select: "title author price url desc",
      })
      .populate({
        path: "orders",
        select: "status totalAmount createdAt book",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "book",
          select: "title price",
        },
      });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Calculate statistics
    const stats = {
      totalOrders: user.orders ? user.orders.length : 0,
      totalSpent: user.orders ? user.orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0) : 0,
      cartValue: user.cart ? user.cart.reduce((sum, book) => sum + (book.price || 0), 0) : 0,
      favouritesCount: user.favourites ? user.favourites.length : 0,
    };

    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: {
        ...user.toObject(),
        stats,
      },
    });
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch user details" 
    });
  }
});

// ✅ PUT: Block user
router.put("/admin/users/:userId/block", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({ 
        success: false,
        message: "Cannot block admin users" 
      });
    }

    user.blocked = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User blocked successfully",
      data: user,
    });
  } catch (err) {
    console.error("Error blocking user:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to block user" 
    });
  }
});

// ✅ PUT: Unblock user
router.put("/admin/users/:userId/unblock", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    user.blocked = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User unblocked successfully",
      data: user,
    });
  } catch (err) {
    console.error("Error unblocking user:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to unblock user" 
    });
  }
});

// ✅ DELETE: Delete user
router.delete("/admin/users/:userId", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({ 
        success: false,
        message: "Cannot delete admin users" 
      });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete user" 
    });
  }
});

// ✅ GET: Get user statistics for dashboard
router.get("/admin/users/stats/summary", authenticateToken, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const blockedUsers = await User.countDocuments({ blocked: true });
    const sellerUsers = await User.countDocuments({ isSeller: true });
    const premiumUsers = await User.countDocuments({ "premium.isPremium": true });
    
    // New users in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsers = await User.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo } 
    });

    // New users in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthlyNewUsers = await User.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        blockedUsers,
        sellerUsers,
        premiumUsers,
        newUsersWeek: newUsers,
        newUsersMonth: monthlyNewUsers,
        activeUsers: totalUsers - blockedUsers,
      },
    });
  } catch (err) {
    console.error("Error fetching user stats:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch statistics" 
    });
  }
});

// ==========================================
// SELLER MANAGEMENT ROUTES
// ==========================================

// ✅ GET: Get all sellers
router.get("/admin/sellers", authenticateToken, isAdmin, async (req, res) => {
  try {
    const sellers = await Seller.find().sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true,
      message: "Fetched sellers", 
      data: sellers 
    });
  } catch (error) {
    console.error("Error fetching sellers:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch sellers" 
    });
  }
});

// ✅ PUT: Update seller status
router.put("/admin/sellers/:id/status", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Approved", "Rejected", "Banned"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be: Pending, Approved, Rejected, or Banned"
      });
    }

    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found"
      });
    }

    seller.status = status;
    await seller.save();

    // Update user schema
    let userApplicationStatus;
    let userIsSeller = false;

    switch (status) {
      case "Approved":
        userApplicationStatus = "Accepted";
        userIsSeller = true;
        break;
      case "Rejected":
        userApplicationStatus = "Rejected";
        userIsSeller = false;
        break;
      case "Banned":
        userApplicationStatus = "Rejected";
        userIsSeller = false;
        break;
      case "Pending":
        userApplicationStatus = "Applied";
        userIsSeller = false;
        break;
      default:
        userApplicationStatus = "Available";
        userIsSeller = false;
    }

    const user = await User.findById(seller.user);
    if (user) {
      user.sellerApplicationStatus = userApplicationStatus;
      user.isSeller = userIsSeller;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: `Seller status updated to ${status}`,
      data: {
        seller: seller,
        userUpdated: !!user
      }
    });

  } catch (error) {
    console.error("Error updating seller status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// ✅ DELETE: Delete seller
router.delete("/admin/sellers/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).json({ 
        success: false,
        message: "Seller not found" 
      });
    }

    const userId = seller.user;
    await Seller.findByIdAndDelete(id);

    if (userId) {
      await User.findByIdAndUpdate(
        userId,
        { 
          isSeller: false,
          sellerApplicationStatus: "Available"
        }
      );
    }

    res.status(200).json({ 
      success: true,
      message: "Seller deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting seller:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error"
    });
  }
});

module.exports = router;