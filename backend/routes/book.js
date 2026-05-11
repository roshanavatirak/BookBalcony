// const router = require("express").Router();
// const User = require("../models/user");
// const jwt = require("jsonwebtoken");
// const Book = require("../models/Book");
// const {authenticateToken} = require("./userAuth");

// // add book -- admin - post (admin api)
// router.post("/add-book", authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.headers;
//     const user = await User.findById(id);

//     if (!user || user.role !== "admin") {
//       return res
//         .status(403)
//         .json({ message: "Access denied: Admin privileges required" });
//     }

//     const {
//       url,
//       title,
//       author,
//       price,
//       desc,
//       language,
//       category,
//       editionOrPublishYear,
//       stock,
//     } = req.body;

//     // Basic validation (can be extended)
//     if (!url || !title || !author || !price || !desc || !language) {
//       return res.status(400).json({ message: "Please fill all required fields" });
//     }

//     const newBook = new Book({
//       url,
//       title,
//       author,
//       price,
//       desc,
//       language,
//       category: category || "General",
//       editionOrPublishYear: editionOrPublishYear || "N/A",
//       stock: stock || 1,
//       seller: user._id,
//     });

//     await newBook.save();

//     return res.status(200).json({ message: "✅ Book added successfully!" });
//   } catch (error) {
//     console.error("❌ Error during admin book addition:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// //update book put (admin api's)
// router.put("/update-book", authenticateToken, async (req, res) =>{
//     try {
//         const{bookid} = req.headers;
//         await Book.findByIdAndUpdate(bookid, {
//             url: req.body.url,
//             title: req.body.title,
//             author:req.body.author,
//             price: req.body.price,
//             desc: req.body.desc,
//             language: req.body.language,
//         });

//         return res.status(200).json({
//             message: "Book Updated SuccessFully",
//         });
        

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({message:"An error occurred"});
        
//     }
// });


// //delete book -- admin - delete  (admin api's)
// router.delete("/delete-book", authenticateToken, async (req, res) => {
//     try{
//         const {bookid} = req.headers;
//         await Book.findByIdAndDelete(bookid);
//         return res.status(200).json({
//            message: "Book deleted successfully", 
//         });
//     } catch (error){
//         // console.log(error);
//         return res.status(500).json({message: "An error occurred"});
//     }
// });



// //get all books ( public api's)
// router.get("/get-all-books", async(req, res) =>{
//     try {
//         const books = await Book.find().sort({createdAt : -1});
//         return res.json({
//             status:"Success",
//             data:books,
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({message:"An error occurred"});
        
//     }
// });

// //get recently added books limit 4  ( public api's)
// router.get("/get-recent-books", async(req, res) =>{
//     try {
//         const books = await Book.find().sort({createdAt : -1}).limit(20);
//         return res.json({
//             status:"Success",
//             data:books,
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({message:"An error occurred"});
        
//     }
// });


// // GET trending books (sorted by views or sales or any custom field)
// router.get("/get-trending-books", async (req, res) => {
//   try {
//     // Example logic: Assuming you have a 'views' or 'sold' field to determine trending
//     const books = await Book.find().sort({ views: -1 }).limit(10); // You can change `views` to `sold` or any metric
//     return res.json({
//       status: "Success",
//       data: books,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "An error occurred" });
//   }
// });


// router.get("/get-editors-choice", async (req, res) => {
//   try {
//     const books = await Book.find().sort({ sold: -1 }).limit(4); // you can change logic
//     return res.json({
//       status: "Success",
//       data: books,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "An error occurred" });
//   }
// });


// //get book by id  ( public api's)
// router.get("/get-book-by-id/:id", async(req, res) =>{
//     try {
//        const{id} = req.params;
//        const book = await Book.findById(id);
//        return res.json({
//         status: "Success",
//         data: book,
//        }) ;

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({message:"An error occurred"});
//     }
// });



// module.exports = router;


const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Book = require("../models/book");
const { authenticateToken } = require("./userAuth");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// ============================================
// CLOUDINARY CONFIGURATION
// ============================================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ============================================
// MULTER STORAGE CONFIGURATION
// ============================================
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "bookbalcony-admin",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 1200, crop: "limit", quality: "auto" }],
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 3,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// ============================================
// HELPER FUNCTIONS
// ============================================

// Cleanup uploaded images on error
const cleanupUploadedImages = async (files) => {
  if (!files || files.length === 0) return;

  console.log(`🗑️ Cleaning up ${files.length} uploaded images...`);
  
  for (const file of files) {
    try {
      if (file.filename) {
        await cloudinary.uploader.destroy(file.filename);
        console.log(`✅ Cleaned up: ${file.filename}`);
      }
    } catch (err) {
      console.error(`❌ Failed to clean up ${file.filename}:`, err.message);
    }
  }
};

// Handle Multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File size too large. Maximum size is 5MB per image.",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        message: "Too many files. Maximum 3 images allowed.",
      });
    }
    return res.status(400).json({
      message: `Upload error: ${err.message}`,
    });
  }

  if (err.message === "Only image files are allowed!") {
    return res.status(400).json({
      message: err.message,
    });
  }

  next(err);
};

// Verify admin middleware
const verifyAdmin = async (req, res, next) => {
  try {
    const { id } = req.headers;

    if (!id) {
      return res.status(401).json({ 
        message: "User ID is required in headers" 
      });
    }

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        message: "Invalid user ID format" 
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ 
        message: "User not found. Please login again." 
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ 
        message: "Access denied: Admin privileges required" 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Admin verification error:", error);
    return res.status(500).json({ 
      message: "Authentication failed" 
    });
  }
};

// ============================================
// ADMIN ROUTES
// ============================================

// ➕ POST: Add Book — Admin
router.post(
  "/add-book",
  authenticateToken,
  verifyAdmin,
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
      console.log("\n=== 📝 ADMIN ADD BOOK REQUEST STARTED ===");
      console.log("Admin ID:", req.user._id);
      console.log("Files received:", req.files?.length || 0);
      
      uploadedFiles = req.files || [];

      // Validate image upload
      if (!uploadedFiles || uploadedFiles.length === 0) {
        console.log("❌ No images uploaded");
        return res.status(400).json({ 
          message: "Please upload at least one book cover image"
        });
      }

      const hasValidUploads = uploadedFiles.every(file => file.path && file.filename);
      if (!hasValidUploads) {
        console.log("❌ Some files failed to upload to Cloudinary");
        await cleanupUploadedImages(uploadedFiles);
        return res.status(500).json({ 
          message: "Image upload failed. Please try again."
        });
      }

      // Extract and validate form data
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
          message: "Validation failed",
          errors: validationErrors
        });
      }

      // Process uploaded images
      const images = uploadedFiles.map((file) => ({
        url: file.path,
        publicId: file.filename,
      }));

      // Create new book
      const newBook = new Book({
        images: images,
        url: images[0].url, // Primary image URL for backward compatibility
        title: title.trim(),
        author: author.trim(),
        price: Number(price),
        desc: desc.trim(),
        language: language.trim(),
        category: category.trim() || "General",
        editionOrPublishYear: editionOrPublishYear?.trim() || "N/A",
        stock: stock ? Number(stock) : 1,
        seller: req.user._id, // Admin ID as seller
      });

      const savedBook = await newBook.save();
      
      console.log("✅ Book saved successfully by admin!");

      return res.status(201).json({ 
        message: "✅ Book added successfully!",
        book: {
          id: savedBook._id,
          title: savedBook.title,
          author: savedBook.author,
          price: savedBook.price,
          images: savedBook.images.length,
          category: savedBook.category
        }
      });

    } catch (error) {
      console.error("\n=== ❌ ERROR OCCURRED ===");
      console.error("Error:", error.message);
      
      if (uploadedFiles.length > 0) {
        await cleanupUploadedImages(uploadedFiles);
      }

      if (error.name === "ValidationError") {
        const validationErrors = Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }));
        
        return res.status(400).json({ 
          message: "Validation failed",
          errors: validationErrors
        });
      }

      return res.status(500).json({ 
        message: "Failed to add book. Please try again.",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

// 📝 PUT: Update Book — Admin
router.put(
  "/update-book/:id",
  authenticateToken,
  verifyAdmin,
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
      console.log("\n=== 📝 ADMIN EDIT BOOK REQUEST STARTED ===");
      
      const bookId = req.params.id;
      uploadedFiles = req.files || [];

      console.log("Book ID:", bookId);
      console.log("Admin ID:", req.user._id);
      console.log("New images uploaded:", uploadedFiles.length);

      // Validate book ID
      if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
        await cleanupUploadedImages(uploadedFiles);
        return res.status(400).json({ 
          message: "Invalid book ID format" 
        });
      }

      // Find book
      const book = await Book.findById(bookId);
      if (!book) {
        await cleanupUploadedImages(uploadedFiles);
        return res.status(404).json({ 
          message: "Book not found" 
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
      book.url = allImages[0].url; // Primary image URL

      await book.save();

      console.log("✅ Book updated successfully by admin!");

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

// 🗑️ DELETE: Delete Book — Admin
router.delete(
  "/delete-book/:id",
  authenticateToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const bookId = req.params.id;

      console.log("\n🗑️ Admin delete request for book ID:", bookId);

      // Validate MongoDB ObjectId format
      if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
        console.log("❌ Invalid book ID format");
        return res.status(400).json({ 
          message: "Invalid book ID format" 
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
      console.log("✅ Book deleted successfully from database by admin");

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
  }
);

// 📖 GET: Get Single Book for Editing — Admin
router.get(
  "/get-book-for-edit/:id",
  authenticateToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const bookId = req.params.id;

      console.log("\n=== 📖 ADMIN GET BOOK FOR EDIT ===");
      console.log("Book ID:", bookId);
      console.log("Admin ID:", req.user._id);

      // Validate book ID format
      if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ 
          message: "Invalid book ID format" 
        });
      }

      // Find book
      const book = await Book.findById(bookId);
      
      if (!book) {
        return res.status(404).json({ 
          message: "Book not found" 
        });
      }

      console.log("✅ Book retrieved successfully by admin");

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
  }
);

// ============================================
// PUBLIC ROUTES (No Auth Required)
// ============================================

// 📚 GET: Get All Books
router.get("/get-all-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// 📚 GET: Get Recently Added Books
router.get("/get-recent-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(20);
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// 🔥 GET: Get Trending Books
router.get("/get-trending-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ views: -1 }).limit(10);
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// ⭐ GET: Get Editor's Choice Books
router.get("/get-editors-choice", async (req, res) => {
  try {
    const books = await Book.find().sort({ sold: -1 }).limit(4);
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// 📖 GET: Get Book By ID
router.get("/get-book-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    return res.json({
      status: "Success",
      data: book,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;