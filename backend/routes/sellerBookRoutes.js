const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const User = require("../models/user");
const Seller = require("../models/seller");
const { authenticateToken } = require("./userAuth");
const { upload, cloudinary, handleMulterError } = require('../config/cloudinary');
const { autoApproveBookMiddleware } = require("../middleware/autoApproveMiddleware");


// 🧹 Helper function to cleanup uploaded images
async function cleanupUploadedImages(files) {
  if (!files || files.length === 0) {
    console.log("No files to clean up");
    return;
  }
  
  console.log(`🧹 Cleaning up ${files.length} uploaded image(s)...`);
  
  for (const file of files) {
    try {
      if (file.filename) {
        const result = await cloudinary.uploader.destroy(file.filename);
        console.log(`✅ Cleaned up ${file.filename}: ${result.result}`);
      }
    } catch (cleanupError) {
      console.error(`❌ Failed to cleanup ${file.filename}:`, cleanupError.message);
    }
  }
}
// ✅ COMPLETE ADD BOOK ROUTE WITH AUTO-APPROVAL
router.post(
  "/seller/add-book",
  authenticateToken,
  (req, res, next) => {
    upload.array('images', 3)(req, res, (err) => {
      if (err) {
        console.error("❌ Multer upload error:", err.message);
        return handleMulterError(err, req, res, next);
      }
      next();
    });
  },
  async (req, res) => {
    let uploadedFiles = [];
    
    try {
      console.log("\n=== 📝 ADD BOOK REQUEST STARTED ===");
      console.log("User ID from headers:", req.headers.id);
      console.log("Files received:", req.files?.length || 0);
      
      uploadedFiles = req.files || [];
      
      const { id } = req.headers;

      // ==========================================
      // STEP 1: VALIDATE USER ID
      // ==========================================
      if (!id) {
        console.log("❌ No user ID in headers");
        await cleanupUploadedImages(uploadedFiles);
        return res.status(400).json({ 
          success: false,
          message: "User ID is required in headers"
        });
      }

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("❌ Invalid user ID format:", id);
        await cleanupUploadedImages(uploadedFiles);
        return res.status(400).json({ 
          success: false,
          message: "Invalid user ID format"
        });
      }

      // ==========================================
      // STEP 2: FIND AND VALIDATE USER
      // ==========================================
      console.log("🔍 Looking up user...");
      const user = await User.findById(id);
      
      if (!user) {
        console.log("❌ User not found");
        await cleanupUploadedImages(uploadedFiles);
        return res.status(404).json({ 
          success: false,
          message: "User not found. Please login again."
        });
      }

      if (!user.isSeller) {
        console.log("❌ User is not a seller");
        await cleanupUploadedImages(uploadedFiles);
        return res.status(403).json({ 
          success: false,
          message: "Access denied: You are not a verified seller."
        });
      }

      // ==========================================
      // STEP 3: FIND AND VALIDATE SELLER
      // ==========================================
      console.log("🔍 Looking up seller...");
      const seller = await Seller.findOne({ user: user._id, status: "Approved" });

      if (!seller) {
        console.log("❌ Seller not found or not approved");
        await cleanupUploadedImages(uploadedFiles);
        return res.status(403).json({ 
          success: false,
          message: "Access denied: Seller account not approved."
        });
      }

      // ==========================================
      // STEP 4: VALIDATE IMAGE UPLOAD
      // ==========================================
      if (!uploadedFiles || uploadedFiles.length === 0) {
        console.log("❌ No images uploaded");
        return res.status(400).json({ 
          success: false,
          message: "Please upload at least one product image"
        });
      }

      const hasValidUploads = uploadedFiles.every(file => file.path && file.filename);
      if (!hasValidUploads) {
        console.log("❌ Some files failed to upload to Cloudinary");
        await cleanupUploadedImages(uploadedFiles);
        return res.status(500).json({ 
          success: false,
          message: "Image upload failed. Please try again."
        });
      }

      // ==========================================
      // STEP 5: EXTRACT AND VALIDATE FORM DATA
      // ==========================================
      const {
        title,
        author,
        price,
        desc,
        language,
        category,
        editionOrPublishYear,
        stock,
      } = req.body;

      console.log("📋 Form data received:", {
        title,
        author,
        price,
        category,
        language,
        stock
      });

      const validationErrors = [];
      
      if (!title?.trim()) {
        validationErrors.push({ field: "title", message: "Title is required" });
      }
      if (!author?.trim()) {
        validationErrors.push({ field: "author", message: "Author name is required" });
      }
      if (!price || isNaN(price) || Number(price) <= 0) {
        validationErrors.push({ field: "price", message: "Valid price is required" });
      }
      if (!desc?.trim()) {
        validationErrors.push({ field: "desc", message: "Description is required" });
      } else if (desc.trim().length < 20) {
        validationErrors.push({ field: "desc", message: "Description must be at least 20 characters" });
      }
      if (!language?.trim()) {
        validationErrors.push({ field: "language", message: "Language is required" });
      }
      if (!category?.trim()) {
        validationErrors.push({ field: "category", message: "Category is required" });
      }
      if (stock && (isNaN(stock) || Number(stock) < 0)) {
        validationErrors.push({ field: "stock", message: "Valid stock quantity is required" });
      }

      if (validationErrors.length > 0) {
        console.log("❌ Validation failed:", validationErrors);
        await cleanupUploadedImages(uploadedFiles);
        return res.status(400).json({ 
          success: false,
          message: "Validation failed",
          errors: validationErrors
        });
      }

      // ==========================================
      // STEP 6: PROCESS UPLOADED IMAGES
      // ==========================================
      const images = uploadedFiles.map((file) => ({
        url: file.path,
        publicId: file.filename,
      }));

      console.log(`✅ Processed ${images.length} images`);

      // ==========================================
      // STEP 7: CREATE NEW BOOK WITH PENDING STATUS
      // ==========================================
      const newBook = new Book({
        images: images,
        url: images[0].url,
        title: title.trim(),
        author: author.trim(),
        price: Number(price),
        desc: desc.trim(),
        language: language.trim(),
        category: category.trim() || "General",
        editionOrPublishYear: editionOrPublishYear?.trim() || "N/A",
        stock: stock ? Number(stock) : 1,
        seller: seller._id,
        
        // ✅ IMPORTANT: Initial approval status
        isApproved: false,
        adminApproval: "Pending",
        productStatus: "Arriving Soon",
      });

      const savedBook = await newBook.save();
      console.log("✅ Book saved with ID:", savedBook._id);

      // ==========================================
      // STEP 8: CHECK AUTO-APPROVAL
      // ==========================================
      const autoApprovalResult = await autoApproveBookMiddleware(savedBook, seller._id);
      
      console.log("🤖 Auto-approval result:", {
        autoApproved: autoApprovalResult.autoApproved,
        bookStatus: autoApprovalResult.book.productStatus,
        adminApproval: autoApprovalResult.book.adminApproval,
        isApproved: autoApprovalResult.book.isApproved
      });

      // ==========================================
      // STEP 9: RETURN SUCCESS RESPONSE
      // ==========================================
      if (autoApprovalResult.autoApproved) {
        console.log("✅ Book auto-approved successfully!");
        return res.status(201).json({ 
          success: true,
          message: "✅ Book added and automatically approved! It's now available for purchase.",
          autoApproved: true,
          book: {
            id: autoApprovalResult.book._id,
            title: autoApprovalResult.book.title,
            author: autoApprovalResult.book.author,
            price: autoApprovalResult.book.price,
            images: autoApprovalResult.book.images.length,
            category: autoApprovalResult.book.category,
            productStatus: autoApprovalResult.book.productStatus,
            adminApproval: autoApprovalResult.book.adminApproval,
            isApproved: autoApprovalResult.book.isApproved,
            stock: autoApprovalResult.book.stock
          }
        });
      } else {
        console.log("📋 Book added - pending admin approval");
        return res.status(201).json({ 
          success: true,
          message: "✅ Book added successfully! Waiting for admin approval before it can be made available.",
          autoApproved: false,
          book: {
            id: autoApprovalResult.book._id,
            title: autoApprovalResult.book.title,
            author: autoApprovalResult.book.author,
            price: autoApprovalResult.book.price,
            images: autoApprovalResult.book.images.length,
            category: autoApprovalResult.book.category,
            productStatus: autoApprovalResult.book.productStatus,
            adminApproval: autoApprovalResult.book.adminApproval,
            isApproved: autoApprovalResult.book.isApproved,
            stock: autoApprovalResult.book.stock
          }
        });
      }

    } catch (error) {
      console.error("\n=== ❌ ERROR OCCURRED ===");
      console.error("Error:", error.message);
      console.error("Stack:", error.stack);
      
      // Cleanup uploaded images on error
      if (uploadedFiles.length > 0) {
        await cleanupUploadedImages(uploadedFiles);
      }

      // Handle validation errors
      if (error.name === "ValidationError") {
        const validationErrors = Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }));
        
        return res.status(400).json({ 
          success: false,
          message: "Validation failed",
          errors: validationErrors
        });
      }

      // Handle duplicate key errors
      if (error.code === 11000) {
        return res.status(400).json({ 
          success: false,
          message: "A book with this title already exists"
        });
      }

      // Generic error response
      return res.status(500).json({ 
        success: false,
        message: "Failed to add book. Please try again.",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// // ➕ POST: Add Book — Seller
// router.post(
//   "/seller/add-book",
//   authenticateToken,
//   (req, res, next) => {
//     upload.array('images', 3)(req, res, (err) => {
//       if (err) {
//         console.error("❌ Multer upload error:", err.message);
//         return handleMulterError(err, req, res, next);
//       }
//       next();
//     });
//   },
//   async (req, res) => {
//     let uploadedFiles = [];
    
//     try {
//       console.log("\n=== 📝 ADD BOOK REQUEST STARTED ===");
//       console.log("User ID from headers:", req.headers.id);
//       console.log("Files received:", req.files?.length || 0);
      
//       uploadedFiles = req.files || [];
      
//       const { id } = req.headers;

//       // Validate user ID
//       if (!id) {
//         console.log("❌ No user ID in headers");
//         await cleanupUploadedImages(uploadedFiles);
//         return res.status(400).json({ 
//           message: "User ID is required in headers"
//         });
//       }

//       if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//         console.log("❌ Invalid user ID format:", id);
//         await cleanupUploadedImages(uploadedFiles);
//         return res.status(400).json({ 
//           message: "Invalid user ID format"
//         });
//       }

//       // Find and validate user
//       console.log("🔍 Looking up user...");
//       const user = await User.findById(id);
      
//       if (!user) {
//         console.log("❌ User not found");
//         await cleanupUploadedImages(uploadedFiles);
//         return res.status(404).json({ 
//           message: "User not found. Please login again."
//         });
//       }

//       if (!user.isSeller) {
//         console.log("❌ User is not a seller");
//         await cleanupUploadedImages(uploadedFiles);
//         return res.status(403).json({ 
//           message: "Access denied: You are not a verified seller."
//         });
//       }

//       // Find and validate seller
//       console.log("🔍 Looking up seller...");
//       const seller = await Seller.findOne({ user: user._id, status: "Approved" });

//       if (!seller) {
//         console.log("❌ Seller not found or not approved");
//         await cleanupUploadedImages(uploadedFiles);
//         return res.status(403).json({ 
//           message: "Access denied: Seller account not approved."
//         });
//       }

//       // Validate image upload
//       if (!uploadedFiles || uploadedFiles.length === 0) {
//         console.log("❌ No images uploaded");
//         return res.status(400).json({ 
//           message: "Please upload at least one product image"
//         });
//       }

//       const hasValidUploads = uploadedFiles.every(file => file.path && file.filename);
//       if (!hasValidUploads) {
//         console.log("❌ Some files failed to upload to Cloudinary");
//         await cleanupUploadedImages(uploadedFiles);
//         return res.status(500).json({ 
//           message: "Image upload failed. Please try again."
//         });
//       }

//       // Extract and validate form data
//       const {
//         title,
//         author,
//         price,
//         desc,
//         language,
//         category,
//         editionOrPublishYear,
//         stock,
//       } = req.body;

//       const validationErrors = [];
      
//       if (!title?.trim()) {
//         validationErrors.push({ field: "title", message: "Title is required" });
//       }
//       if (!author?.trim()) {
//         validationErrors.push({ field: "author", message: "Author name is required" });
//       }
//       if (!price || isNaN(price) || Number(price) <= 0) {
//         validationErrors.push({ field: "price", message: "Valid price is required" });
//       }
//       if (!desc?.trim()) {
//         validationErrors.push({ field: "desc", message: "Description is required" });
//       } else if (desc.trim().length < 20) {
//         validationErrors.push({ field: "desc", message: "Description must be at least 20 characters" });
//       }
//       if (!language?.trim()) {
//         validationErrors.push({ field: "language", message: "Language is required" });
//       }
//       if (!category?.trim()) {
//         validationErrors.push({ field: "category", message: "Category is required" });
//       }
//       if (stock && (isNaN(stock) || Number(stock) < 0)) {
//         validationErrors.push({ field: "stock", message: "Valid stock quantity is required" });
//       }

//       if (validationErrors.length > 0) {
//         console.log("❌ Validation failed:", validationErrors);
//         await cleanupUploadedImages(uploadedFiles);
//         return res.status(400).json({ 
//           message: "Validation failed",
//           errors: validationErrors
//         });
//       }

//       // Process uploaded images
//       const images = uploadedFiles.map((file) => ({
//         url: file.path,
//         publicId: file.filename,
//       }));

//       // Create new book
//       const newBook = new Book({
//         images: images,
//         url: images[0].url,
//         title: title.trim(),
//         author: author.trim(),
//         price: Number(price),
//         desc: desc.trim(),
//         language: language.trim(),
//         category: category.trim() || "General",
//         editionOrPublishYear: editionOrPublishYear?.trim() || "N/A",
//         stock: stock ? Number(stock) : 1,
//         seller: seller._id,
//         productStatus: "Arriving Soon",
//       });

//       const savedBook = await newBook.save();
      
//       console.log("✅ Book saved successfully!");

//       return res.status(201).json({ 
//         message: "✅ Book added successfully!",
//         book: {
//           id: savedBook._id,
//           title: savedBook.title,
//           author: savedBook.author,
//           price: savedBook.price,
//           images: savedBook.images.length,
//           category: savedBook.category
//         }
//       });

//     } catch (error) {
//       console.error("\n=== ❌ ERROR OCCURRED ===");
//       console.error("Error:", error.message);
      
//       if (uploadedFiles.length > 0) {
//         await cleanupUploadedImages(uploadedFiles);
//       }

//       if (error.name === "ValidationError") {
//         const validationErrors = Object.keys(error.errors).map(key => ({
//           field: key,
//           message: error.errors[key].message
//         }));
        
//         return res.status(400).json({ 
//           message: "Validation failed",
//           errors: validationErrors
//         });
//       }

//       return res.status(500).json({ 
//         message: "Failed to add book. Please try again.",
//         error: process.env.NODE_ENV === 'development' ? error.message : undefined
//       });
//     }
//   }
// );

// 📖 GET: Get Single Book for Editing — Seller
router.get("/seller/book/:id", authenticateToken, async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.headers.id;

    console.log("\n=== 📖 GET BOOK FOR EDIT ===");
    console.log("Book ID:", bookId);
    console.log("User ID:", userId);

    // Validate book ID format
    if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        message: "Invalid book ID format" 
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user || !user.isSeller) {
      return res.status(403).json({ 
        message: "Access denied" 
      });
    }

    // Find seller
    const seller = await Seller.findOne({ user: user._id });
    if (!seller) {
      return res.status(403).json({ 
        message: "Seller account not found" 
      });
    }

    // Find book and verify ownership
    const book = await Book.findById(bookId);
    
    if (!book) {
      return res.status(404).json({ 
        message: "Book not found" 
      });
    }

    // Verify the book belongs to this seller
    if (book.seller.toString() !== seller._id.toString()) {
      return res.status(403).json({ 
        message: "You don't have permission to edit this book" 
      });
    }

    console.log("✅ Book retrieved successfully");

    return res.status(200).json({ 
      message: "Book retrieved successfully",
      book: book
    });

  } catch (error) {
    console.error("❌ Get book error:", error);
    return res.status(500).json({ 
      message: "Failed to retrieve book"
    });
  }
});

// 📝 PUT: Edit Book — Seller
router.put(
  "/seller/edit-book/:id",
  authenticateToken,
  (req, res, next) => {
    upload.array('images', 3)(req, res, (err) => {
      if (err) {
        console.error("❌ Multer upload error:", err.message);
        return handleMulterError(err, req, res, next);
      }
      next();
    });
  },
  async (req, res) => {
    let uploadedFiles = [];

    try {
      console.log("\n=== 📝 EDIT BOOK REQUEST STARTED ===");
      
      const bookId = req.params.id;
      const userId = req.headers.id;
      uploadedFiles = req.files || [];

      console.log("Book ID:", bookId);
      console.log("User ID:", userId);
      console.log("New images uploaded:", uploadedFiles.length);

      // Validate book ID
      if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
        await cleanupUploadedImages(uploadedFiles);
        return res.status(400).json({ 
          message: "Invalid book ID format" 
        });
      }

      // Find and validate user
      const user = await User.findById(userId);
      if (!user || !user.isSeller) {
        await cleanupUploadedImages(uploadedFiles);
        return res.status(403).json({ 
          message: "Access denied" 
        });
      }

      // Find seller
      const seller = await Seller.findOne({ user: user._id });
      if (!seller) {
        await cleanupUploadedImages(uploadedFiles);
        return res.status(403).json({ 
          message: "Seller account not found" 
        });
      }

      // Find book and verify ownership
      const book = await Book.findById(bookId);
      if (!book) {
        await cleanupUploadedImages(uploadedFiles);
        return res.status(404).json({ 
          message: "Book not found" 
        });
      }

      if (book.seller.toString() !== seller._id.toString()) {
        await cleanupUploadedImages(uploadedFiles);
        return res.status(403).json({ 
          message: "You don't have permission to edit this book" 
        });
      }

      // Extract form data
      const {
        title,
        author,
        price,
        desc,
        language,
        category,
        editionOrPublishYear,
        stock,
        imagesToDelete,
        existingImages
      } = req.body;

      // Validate required fields
      const validationErrors = [];
      
      if (!title?.trim()) {
        validationErrors.push({ field: "title", message: "Title is required" });
      }
      if (!author?.trim()) {
        validationErrors.push({ field: "author", message: "Author name is required" });
      }
      if (!price || isNaN(price) || Number(price) <= 0) {
        validationErrors.push({ field: "price", message: "Valid price is required" });
      }
      if (!desc?.trim() || desc.trim().length < 20) {
        validationErrors.push({ field: "desc", message: "Description must be at least 20 characters" });
      }
      if (!language?.trim()) {
        validationErrors.push({ field: "language", message: "Language is required" });
      }
      if (!category?.trim()) {
        validationErrors.push({ field: "category", message: "Category is required" });
      }

      if (validationErrors.length > 0) {
        await cleanupUploadedImages(uploadedFiles);
        return res.status(400).json({ 
          message: "Validation failed",
          errors: validationErrors
        });
      }

      // Handle image deletions
      let deleteList = [];
      try {
        deleteList = imagesToDelete ? JSON.parse(imagesToDelete) : [];
      } catch (e) {
        console.log("No images to delete or parse error");
      }

      if (deleteList.length > 0) {
        console.log(`🗑️ Deleting ${deleteList.length} old images...`);
        for (const publicId of deleteList) {
          try {
            await cloudinary.uploader.destroy(publicId);
            console.log(`✅ Deleted: ${publicId}`);
          } catch (err) {
            console.error(`❌ Failed to delete ${publicId}:`, err.message);
          }
        }
      }

      // Process existing images
      let existingImagesArray = [];
      try {
        existingImagesArray = existingImages ? JSON.parse(existingImages) : [];
      } catch (e) {
        console.log("No existing images or parse error");
      }

      // Process new uploaded images
      const newImages = uploadedFiles.map(file => ({
        url: file.path,
        publicId: file.filename
      }));

      // Combine existing and new images
      const allImages = [...existingImagesArray, ...newImages];

      // Validate at least one image exists
      if (allImages.length === 0) {
        await cleanupUploadedImages(uploadedFiles);
        return res.status(400).json({ 
          message: "At least one image is required" 
        });
      }

      if (allImages.length > 3) {
        await cleanupUploadedImages(uploadedFiles);
        return res.status(400).json({ 
          message: "Maximum 3 images allowed" 
        });
      }

      // Update book
      book.title = title.trim();
      book.author = author.trim();
      book.price = Number(price);
      book.desc = desc.trim();
      book.language = language.trim();
      book.category = category.trim();
      book.editionOrPublishYear = editionOrPublishYear?.trim() || "N/A";
      book.stock = stock ? Number(stock) : 0;
      book.images = allImages;
      book.url = allImages[0].url;

      await book.save();

      console.log("✅ Book updated successfully!");

      return res.status(200).json({ 
        message: "✅ Book updated successfully!",
        book: {
          id: book._id,
          title: book.title,
          price: book.price,
          images: book.images.length
        }
      });

    } catch (error) {
      console.error("❌ Edit book error:", error.message);
      
      if (uploadedFiles.length > 0) {
        await cleanupUploadedImages(uploadedFiles);
      }

      return res.status(500).json({ 
        message: "Failed to update book. Please try again.",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// 📚 GET: Get All Seller's Books
router.get("/seller/myproducts", authenticateToken, async (req, res) => {
  try {
    const userId = req.headers.id;
    
    console.log("\n=== 📚 GET SELLER PRODUCTS ===");
    console.log("User ID:", userId);

    // Find user
    const user = await User.findById(userId);
    if (!user || !user.isSeller) {
      return res.status(403).json({ 
        message: "Access denied" 
      });
    }

    // Find seller
    const seller = await Seller.findOne({ user: user._id });
    if (!seller) {
      return res.status(403).json({ 
        message: "Seller account not found" 
      });
    }

    // Get all books by this seller
    const books = await Book.find({ seller: seller._id }).sort({ postedAt: -1 });

    console.log(`✅ Found ${books.length} books`);

    return res.status(200).json({ 
      message: "Books retrieved successfully",
      books: books
    });

  } catch (error) {
    console.error("❌ Get seller products error:", error);
    return res.status(500).json({ 
      message: "Failed to retrieve products"
    });
  }
});

// 👁️ GET: View Single Product Details — Seller
router.get("/seller/viewproduct/:id", authenticateToken, async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.headers.id;

    console.log("\n=== 👁️ VIEW PRODUCT DETAILS ===");
    console.log("Book ID:", bookId);

    // Validate book ID
    if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        message: "Invalid book ID format" 
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user || !user.isSeller) {
      return res.status(403).json({ 
        message: "Access denied" 
      });
    }

    // Find seller
    const seller = await Seller.findOne({ user: user._id });
    if (!seller) {
      return res.status(403).json({ 
        message: "Seller account not found" 
      });
    }

    // Find book
    const book = await Book.findById(bookId).populate('seller');
    
    if (!book) {
      return res.status(404).json({ 
        message: "Book not found" 
      });
    }

    // Verify ownership
    if (book.seller._id.toString() !== seller._id.toString()) {
      return res.status(403).json({ 
        message: "You don't have permission to view this book" 
      });
    }

    console.log("✅ Product details retrieved");

    return res.status(200).json({ 
      message: "Product details retrieved successfully",
      book: book
    });

  } catch (error) {
    console.error("❌ View product error:", error);
    return res.status(500).json({ 
      message: "Failed to retrieve product details"
    });
  }
});

// 🗑️ DELETE: Delete Book — Seller
router.delete("/seller/delete-book/:id", authenticateToken, async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.headers.id;

    console.log("\n🗑️ Delete request for book ID:", bookId);

    // Validate MongoDB ObjectId format
    if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log("❌ Invalid book ID format");
      return res.status(400).json({ 
        message: "Invalid book ID format" 
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user || !user.isSeller) {
      return res.status(403).json({ 
        message: "Access denied" 
      });
    }

    // Find seller
    const seller = await Seller.findOne({ user: user._id });
    if (!seller) {
      return res.status(403).json({ 
        message: "Seller account not found" 
      });
    }

    // Find book
    const book = await Book.findById(bookId);

    if (!book) {
      console.log("❌ Book not found");
      return res.status(404).json({ 
        message: "Book not found." 
      });
    }

    // Verify ownership
    if (book.seller.toString() !== seller._id.toString()) {
      return res.status(403).json({ 
        message: "You don't have permission to delete this book" 
      });
    }

    console.log("✅ Book found, deleting images from Cloudinary...");

    // Delete images from Cloudinary
    if (book.images && book.images.length > 0) {
      for (const image of book.images) {
        try {
          if (image.publicId) {
            const result = await cloudinary.uploader.destroy(image.publicId);
            console.log(`✅ Deleted image ${image.publicId}:`, result.result);
          }
        } catch (imgError) {
          console.error(`❌ Error deleting image ${image.publicId}:`, imgError.message);
        }
      }
    }

    // Delete book from database
    await Book.findByIdAndDelete(bookId);
    console.log("✅ Book deleted successfully from database");

    return res.status(200).json({
      message: "✅ Book deleted successfully"
    });
    
  } catch (error) {
    console.error("\n❌ Delete book error:", error.name, error.message);
    
    if (error.name === "CastError") {
      return res.status(400).json({ 
        message: "Invalid book ID format" 
      });
    }
    
    return res.status(500).json({ 
      message: "Failed to delete book. Please try again."
    });
  }
});

// 📊 GET: Seller Dashboard Stats
router.get("/seller/stats", authenticateToken, async (req, res) => {
  try {
    const userId = req.headers.id;

    // Find user
    const user = await User.findById(userId);
    if (!user || !user.isSeller) {
      return res.status(403).json({ 
        message: "Access denied" 
      });
    }

    // Find seller
    const seller = await Seller.findOne({ user: user._id });
    if (!seller) {
      return res.status(403).json({ 
        message: "Seller account not found" 
      });
    }

    // Get all books
    const books = await Book.find({ seller: seller._id });

    // Calculate stats
    const totalProducts = books.length;
    const totalRevenue = books.reduce((sum, book) => sum + (book.sold || 0) * book.price, 0);
    const totalViews = books.reduce((sum, book) => sum + (book.views || 0), 0);
    const totalSold = books.reduce((sum, book) => sum + (book.sold || 0), 0);
    const lowStockProducts = books.filter(book => book.stock > 0 && book.stock <= 5).length;
    const outOfStockProducts = books.filter(book => book.stock === 0).length;

    return res.status(200).json({
      stats: {
        totalProducts,
        totalRevenue,
        totalViews,
        totalSold,
        lowStockProducts,
        outOfStockProducts
      }
    });

  } catch (error) {
    console.error("❌ Get stats error:", error);
    return res.status(500).json({ 
      message: "Failed to retrieve stats"
    });
  }
});


// Add this route to your seller routes file (e.g., sellerRoutes.js)

// 📦 PUT: Update Book Stock Only — Seller
router.put("/seller/update-book-stock/:id", authenticateToken, async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.headers.id;
    const { stock } = req.body;

    console.log("\n=== 📦 UPDATE BOOK STOCK ===");
    console.log("Book ID:", bookId);
    console.log("User ID:", userId);
    console.log("New Stock:", stock);

    // Validate book ID
    if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        message: "Invalid book ID format" 
      });
    }

    // Validate stock value
    if (stock === undefined || stock === null || isNaN(stock) || stock < 0) {
      return res.status(400).json({ 
        message: "Valid stock quantity is required (0 or more)" 
      });
    }

    // Find and validate user
    const user = await User.findById(userId);
    if (!user || !user.isSeller) {
      return res.status(403).json({ 
        message: "Access denied" 
      });
    }

    // Find seller
    const seller = await Seller.findOne({ user: user._id });
    if (!seller) {
      return res.status(403).json({ 
        message: "Seller account not found" 
      });
    }

    // Find book and verify ownership
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ 
        message: "Book not found" 
      });
    }

    if (book.seller.toString() !== seller._id.toString()) {
      return res.status(403).json({ 
        message: "You don't have permission to update this book" 
      });
    }

    // Update stock
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
    console.log(`📊 Current status: ${book.productStatus}`);

    return res.status(200).json({ 
      message: "Stock updated successfully",
      book: {
        id: book._id,
        title: book.title,
        oldStock: oldStock,
        newStock: book.stock,
        productStatus: book.productStatus
      }
    });

  } catch (error) {
    console.error("❌ Update stock error:", error.message);
    return res.status(500).json({ 
      message: "Failed to update stock. Please try again.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;