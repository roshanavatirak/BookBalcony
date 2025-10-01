// const jwt= require("jsonwebtoken");

// const authenticateToken = (req, res, next) =>{
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(" ")[1];

//     if(token == null){
//         return res.status(401).json({message:"Authentication token required"});
//     }

//     jwt.verify(token, "bookStore123", (err, user) => {
//         if(err){
//             return res.status(403).json({message:"Token expired. Please signIn again"});
//         }

//         req.user = user;
//         next();
//     });
// };

// module.exports = {authenticateToken};

const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Import User model

const JWT_SECRET = process.env.JWT_SECRET || "bookStore123";

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Authentication token required" 
      });
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ 
            success: false,
            message: "Token expired. Please sign in again",
            expired: true 
          });
        }
        
        return res.status(403).json({ 
          success: false,
          message: "Invalid token. Please sign in again" 
        });
      }

      // ✅ Fetch user from database to get latest premium status
      const userId = req.headers.id || decoded.authClaims?.[0]?.id;
      const user = await User.findById(userId).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      // ✅ Attach user info including premium status to request
      req.user = {
        ...decoded,
        id: user._id,
        role: user.role,
        isSeller: user.isSeller,
        isPremium: user.isPremiumActive ? user.isPremiumActive() : false,
        premiumType: user.premium?.membershipType || "free",
        premiumExpiry: user.premium?.expiryDate || null,
        userData: user // Full user object if needed
      };

      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication error",
      error: error.message
    });
  }
};

// ✅ Middleware to check if user is premium (or admin)
const authenticatePremium = async (req, res, next) => {
  await authenticateToken(req, res, () => {
    const isPremium = req.user.isPremium;
    const isAdmin = req.user.role === "admin";

    if (isPremium || isAdmin) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Premium membership required",
      upgradePath: "/premium",
      currentPlan: req.user.premiumType
    });
  });
};

// ✅ Middleware to check if user is admin
const authenticateAdmin = async (req, res, next) => {
  await authenticateToken(req, res, () => {
    if (req.user.role === "admin") {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Admin access required"
    });
  });
};

// ✅ Middleware to check if user is seller
const authenticateSeller = async (req, res, next) => {
  await authenticateToken(req, res, () => {
    if (req.user.isSeller || req.user.role === "admin") {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Seller access required"
    });
  });
};

module.exports = {
  authenticateToken,
  authenticatePremium,
  authenticateAdmin,
  authenticateSeller
};