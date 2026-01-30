// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Validate environment variables at startup
if (!process.env.CLOUDINARY_CLOUD_NAME || 
    !process.env.CLOUDINARY_API_KEY || 
    !process.env.CLOUDINARY_API_SECRET) {
  console.error("\n❌ CRITICAL: Missing Cloudinary credentials!");
  console.error("Required environment variables:");
  console.error("  - CLOUDINARY_CLOUD_NAME");
  console.error("  - CLOUDINARY_API_KEY");
  console.error("  - CLOUDINARY_API_SECRET");
  console.error("\nPlease check your .env file\n");
  process.exit(1);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Always use HTTPS
});

console.log("\n✅ Cloudinary Configuration:");
console.log("   Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("   API Key:", process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing");
console.log("   API Secret:", process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing");

// Test Cloudinary connection on startup
cloudinary.api.ping()
  .then((result) => {
    console.log("✅ Cloudinary connection successful:", result.status);
  })
  .catch((err) => {
    console.error("❌ Cloudinary connection failed:", err.message);
    console.error("   Check your credentials in .env file");
  });

// Configure Cloudinary Storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    console.log(`📤 Uploading: ${file.originalname}`);
    
    return {
      folder: 'bookstore-products',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'bmp', 'svg'],
      transformation: [
        { width: 1200, height: 1600, crop: 'limit' },
        { quality: 'auto:good' }
      ],
      public_id: `book_${Date.now()}_${Math.random().toString(36).substring(7)}`
    };
  }
});

// File filter to validate image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 
    'image/jpg', 
    'image/png', 
    'image/webp', 
    'image/gif',
    'image/avif',
    'image/bmp',
    'image/svg+xml'
  ];
  
  console.log("📁 Validating file:", {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  });

  if (allowedTypes.includes(file.mimetype)) {
    console.log("✅ File type valid");
    cb(null, true);
  } else {
    console.log("❌ Invalid file type:", file.mimetype);
    cb(new Error(`Invalid file type: ${file.mimetype}. Only images (JPG, PNG, WEBP, GIF, AVIF, BMP, SVG) are allowed.`), false);
  }
};

// Configure multer with storage and limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 3 // Maximum 3 files
  }
});

// Multer error handler middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("❌ Multer error:", err.code, "-", err.message);
    
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          message: "File too large. Maximum size is 5MB per image.",
          field: err.field
        });
      
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          message: "Too many files. Maximum 3 images allowed.",
          field: err.field
        });
      
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          message: "Unexpected field. Use 'images' as the field name.",
          field: err.field
        });
      
      case 'LIMIT_PART_COUNT':
        return res.status(400).json({
          message: "Too many parts in the request."
        });
      
      case 'LIMIT_FIELD_KEY':
        return res.status(400).json({
          message: "Field name too long."
        });
      
      case 'LIMIT_FIELD_VALUE':
        return res.status(400).json({
          message: "Field value too long."
        });
      
      case 'LIMIT_FIELD_COUNT':
        return res.status(400).json({
          message: "Too many fields."
        });
      
      default:
        return res.status(400).json({
          message: "File upload error: " + err.message,
          code: err.code
        });
    }
  }
  
  // Handle other upload errors
  if (err) {
    console.error("❌ Upload error:", err.message);
    return res.status(400).json({
      message: err.message || "Error uploading files"
    });
  }
  
  next();
};

// Export everything
module.exports = { 
  upload, 
  cloudinary,
  handleMulterError 
};

console.log("✅ Cloudinary module loaded successfully\n");