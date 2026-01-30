const mongoose = require("mongoose");

const conn= async () => {
    try{
await mongoose.connect(`${process.env.URI}`)
console.log("connected to database");
    } catch (error){
        console.log(error)
    }
};
conn();
module.exports = conn;


// const mongoose = require("mongoose");

// // MongoDB connection URI from environment variable
// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/bookstore";

// // Connection options
// const options = {
//   serverSelectionTimeoutMS: 5000,
//   socketTimeoutMS: 45000,
// };

// // Connect to MongoDB
// const connectDB = async () => {
//   try {
//     console.log("\n🔗 Connecting to MongoDB...");
//     console.log("URI:", MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
    
//     const conn = await mongoose.connect(MONGODB_URI, options);
    
//     console.log("✅ MongoDB connected successfully");
//     console.log("Database:", conn.connection.name);
//     console.log("Host:", conn.connection.host);
    
//   } catch (error) {
//     console.error("\n❌ MongoDB connection error:");
//     console.error("Error name:", error.name);
//     console.error("Error message:", error.message);
    
//     if (error.name === 'MongooseServerSelectionError') {
//       console.error("\n💡 Troubleshooting tips:");
//       console.error("1. Check if MongoDB is running");
//       console.error("2. Verify MONGODB_URI in .env file");
//       console.error("3. Check network/firewall settings");
//       console.error("4. Verify MongoDB Atlas IP whitelist (if using Atlas)");
//     }
    
//     process.exit(1);
//   }
// };

// // Handle connection events
// mongoose.connection.on('connected', () => {
//   console.log('📡 Mongoose connected to database');
// });

// mongoose.connection.on('error', (err) => {
//   console.error('❌ Mongoose connection error:', err.message);
// });

// mongoose.connection.on('disconnected', () => {
//   console.log('📴 Mongoose disconnected from database');
// });

// // Graceful shutdown
// process.on('SIGINT', async () => {
//   try {
//     await mongoose.connection.close();
//     console.log('\n👋 MongoDB connection closed through app termination');
//     process.exit(0);
//   } catch (err) {
//     console.error('Error during shutdown:', err);
//     process.exit(1);
//   }
// });

// // Call the connection function
// connectDB();

// module.exports = mongoose;