// const router =require("express").Router();
// const User = require("../models/user");
// const bcrypt= require("bcryptjs");

// //Sign-Up

// router.post("/sign-up", async (req, res) => {
//     try{
// const {username, email, passwords, address} = req.body;

// //check username lenght is more than 3
// if(username.length < 4){
//     return res.status(400).json({message: "Username length should be greater than 3"});
// }

// //check username already exists ?
// const existingUsername = await User.findOne({username:username});
// if(existingUsername){
//     return res.status(400).json({message: "Username already exists"});
// }

// //check email already exists ?
// const existingemail = await User.findOne({email:email});
// if(existingemail){
//     return res.status(400).json({message: "Email already exists"});
// }

// //check password length
// if(passwords.length<=7){
//     return res.status(400).json({message:  "Your password must be at least 8 characters long"});
// }

// const hashPass = await bcrypt.hash(passwords, 10)
// const newUser = new User({username: username, email:email, passwords: hashPass, address:address});

// await newUser.save();
// return res.status(200).json({message:"Signup successful! Welcome to our Book Balcony."})

//     } catch(error){
//         console.error("Error during signup:", error);
// res.status(500).json({message:"Internal server error"});
//     }
// });

// //Sign-In
// router.post("/sign-in", async (req, res) => {
//     try{
//         const {username, passwords} =req.body;

//         const existingUser = await User.findOne({username});
//         if(!existingUser){
//             res.status(400).json({message:"Invalid credentials. Please try again.."});
//         }

//         await bcrypt.compare(passwords, existingUser.passwords,(err, data) =>{
// if(data){
//     res.status(200).json({message:"Sign-in successful!"});
// }else {
//     // Passwords do not match
//     res.status(400).json({ message: "Invalid credentials. Please try again." });
// }
//         });
//     } 
// // const isPasswordValid = await bcrypt.compare(passwords, existingUser.passwords);

// //         if (isPasswordValid) {
// //             return res.status(200).json({ message: "Sign-in successful!" });
// //         } else {
// //             return res.status(400).json({ message: "Invalid credentials. Please try again." });
// //         }
// //     } 
// catch(error){
//         console.error("Error during sign-in:", error);
// res.status(500).json({message:"Internal server error"});
//     }
// });


// module.exports = router;


const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./userAuth");

// ==========================================
// Sign-Up Route (Updated)
// ==========================================
require("dotenv").config();
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    // Validate required fields
    if (!username || !email || !password || !phone) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }

    // Username validation
    if (username.length < 4) {
      return res.status(400).json({ 
        success: false,
        message: "Username length should be greater than 3" 
      });
    }

    // Check for existing username
    if (await User.findOne({ username })) {
      return res.status(400).json({ 
        success: false,
        message: "Username already exists" 
      });
    }

    // Check for existing email
    if (await User.findOne({ email })) {
      return res.status(400).json({ 
        success: false,
        message: "Email already exists" 
      });
    }

    // Check for existing phone
    if (await User.findOne({ phone })) {
      return res.status(400).json({ 
        success: false,
        message: "Phone number already exists" 
      });
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({ 
        success: false,
        message: "Password must be at least 8 characters long" 
      });
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid phone number format. Must be 10 digits" 
      });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(12);
    const hashPass = await bcrypt.hash(password, salt);

    // ✅ Create New User with default premium settings
    const newUser = new User({
      username,
      email,
      password: hashPass,
      phone,
      premium: {
        isPremium: false,
        membershipType: "free",
        features: {
          canSeeSellers: false,
          prioritySupport: false,
          earlyAccess: false,
          exclusiveDeals: false,
          adFree: false,
        },
      },
    });

    await newUser.save();

    return res.status(201).json({ 
      success: true,
      message: "Signup successful! Welcome to Book Balcony." 
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
});

// ==========================================
// Sign-In Route (Updated with Premium Info)
// ==========================================
router.post("/sign-in", async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;

    // Validate input
    if (!emailOrMobile || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email/Phone and password are required." 
      });
    }

    // Find user by email or phone
    const existingUser = await User.findOne({
      $or: [{ email: emailOrMobile }, { phone: emailOrMobile }],
    });

    if (!existingUser) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid credentials. Please try again." 
      });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid credentials. Please try again." 
      });
    }

    // ✅ Check premium status using the method from User model
    const isPremiumActive = existingUser.isPremiumActive 
      ? existingUser.isPremiumActive() 
      : false;

    // Generate JWT token
    const token = jwt.sign(
      {
        id: existingUser._id,
        role: existingUser.role,
        name: existingUser.username,
        isPremium: isPremiumActive, // ✅ Include premium status in token
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // ✅ Return response with premium information
    return res.status(200).json({
      success: true,
      id: existingUser._id,
      role: existingUser.role,
      isSeller: existingUser.isSeller,
      token: token,
      // ✅ Premium information
      isPremium: isPremiumActive,
      premiumType: existingUser.premium?.membershipType || "free",
      premiumExpiry: existingUser.premium?.expiryDate || null,
      premiumFeatures: existingUser.premium?.features || {},
      message: "Sign in successful"
    });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
});
// // Sign-Up
// router.post("/sign-up", async (req, res) => {
//   try {
//     const { username, email, password, phone } = req.body;

//     if (!username || !email || !password || !phone) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Validations
//     if (username.length < 4) {
//       return res.status(400).json({ message: "Username length should be greater than 3" });
//     }

//     if (await User.findOne({ username })) {
//       return res.status(400).json({ message: "Username already exists" });
//     }

//     if (await User.findOne({ email })) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     if (await User.findOne({ phone })) {
//       return res.status(400).json({ message: "Phone number already exists" });
//     }

//     if (password.length < 8) {
//       return res.status(400).json({ message: "Password must be at least 8 characters long" });
//     }

//     const phoneRegex = /^[0-9]{10}$/;
//     if (!phoneRegex.test(phone)) {
//       return res.status(400).json({ message: "Invalid phone number format" });
//     }

//     // Hash Password
//     const salt = await bcrypt.genSalt(12);
//     const hashPass = await bcrypt.hash(password, salt);

//     // Save New User
//     const newUser = new User({
//       username,
//       email,
//       password: hashPass,
//       phone,
//     });

//     await newUser.save();

//     return res.status(201).json({ message: "Signup successful! Welcome to our Book Balcony." });
//   } catch (error) {
//     console.error("Error during signup:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });



// // Sign-In Route
// router.post("/sign-in", async (req, res) => {
//   try {
//     const { emailOrMobile, password } = req.body;

//     if (!emailOrMobile || !password) {
//       return res.status(400).json({ message: "Email/Phone and password are required." });
//     }

//     // Check if the user exists using email or phone
//     const existingUser = await User.findOne({
//       $or: [{ email: emailOrMobile }, { phone: emailOrMobile }],
//     });

//     if (!existingUser) {
//       return res.status(400).json({ message: "Invalid credentials. Please try again." });
//     }

//     // Validate password
//     const isPasswordValid = await bcrypt.compare(password, existingUser.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ message: "Invalid credentials. Please try again." });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       {
//         id: existingUser._id,
//         role: existingUser.role,
//         name: existingUser.username,
//       },
//       "bookStore123", // Replace with secure env variable in production
//       { expiresIn: "30d" }
//     );

//     return res.status(200).json({
//       id: existingUser._id,
//       role: existingUser.role,
//       token: token,
//     });
//   } catch (error) {
//     console.error("Error during sign-in:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });


//get-user-information
// router.get("/get-user-information", authenticateToken, async(req, res)=>{
//     try {
//         const {id}= req.headers;
//         const data = await User.findById(id).select('-password');
//         return res.status(200).json(data);
//     } catch (error) {
//         res.status(500).json({ message: "Internal server error" });
//     }
// });
// ✅ Get current user profile
router.get('/get-user-profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.headers.id;
    const user = await User.findById(userId).select('username email phone avatar');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/get-user-information", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    
    if (!id) {
      return res.status(400).json({ message: "Missing user ID in headers" });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

      // Check premium status
    const isPremiumActive = user.isPremiumActive 
      ? user.isPremiumActive() 
      : false;

    return res.status(200).json({
      success: true,
      data: {
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        isSeller: user.isSeller,
        address: user.address,
        // ✅ Premium information
        isPremium: isPremiumActive,
        premiumType: user.premium?.membershipType || "free",
        premiumExpiry: user.premium?.expiryDate || null,
        premiumFeatures: user.premium?.features || {},
      }
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in /get-user-information:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});


//update address
router.put("/update-address", authenticateToken, async (req, res) => {
    try {
        const {id}= req.headers;
        const{address} = req.body;
        await User.findByIdAndUpdate(id,{address:address});
        return res.status(200).json({message:"Address updated successfully"});
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});


router.post("/add-address", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { address } = req.body; // ✅ Fix: extract the address object correctly

    if (!address || typeof address !== "object") {
      return res.status(400).json({ message: "Invalid address format" });
    }

     console.log("🛠️ Received address:", address); // ADD THIS
    console.log("👤 User ID:", id);

    await User.findByIdAndUpdate(id, { address });

    return res.status(200).json({ message: "Address added successfully" });
  } catch (error) {
    console.error("Error updating address:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});



module.exports = router;
