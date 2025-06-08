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

// Sign-Up
router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        if (!username || !email || !password || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }


        // Validations
        if (username.length < 4) {
            return res.status(400).json({ message: "Username length should be greater than 3" });
        }
        if (await User.findOne({ username })) {
            return res.status(400).json({ message: "Username already exists" });
        }
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: "Email already exists" });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(12);
        const hashPass = await bcrypt.hash(password, salt);

        // Save New User
        const newUser = new User({
            username,
            email,
            password: hashPass,
            address,
        });
        await newUser.save();

        return res.status(201).json({ message: "Signup successful! Welcome to our Book Balcony." });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Sign-In
router.post("/sign-in", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the user exists
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid credentials. Please try again." });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials. Please try again." });
        }

        const authClaims=[
            {name : existingUser.username},
            {role: existingUser.role},
    ]
        const token = jwt.sign({authClaims}, "bookStore123", {expiresIn:"30d"});
        return res.status(200).json({ id:existingUser._id, role:existingUser.role, token:token});
    } catch (error) {
        console.error("Error during sign-in:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//get-user-information
router.get("/get-user-information", authenticateToken, async(req, res)=>{
    try {
        const {id}= req.headers;
        const data = await User.findById(id).select('-password');
        return res.status(200).json(data);
    } catch (error) {
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
})
module.exports = router;
