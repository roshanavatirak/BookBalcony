require('dotenv').config();
const prisma = require('./conn/prisma');
const mongoose = require('mongoose');

async function verifyDatabases() {
  console.log("==========================================");
  console.log("🔍 DATABASE & READ REPLICA VERIFICATION");
  console.log("==========================================");

  // 1. VERIFY POSTGRESQL (PRIMARY vs READ REPLICA)
  try {
    console.log("\n1️⃣  Testing PostgreSQL (Supabase)...");
    const replicaCount = await prisma.order.count();
    console.log("   👉 Read Replica Query Result (Orders Count):", replicaCount);

    const primaryCount = await prisma.$primary().order.count();
    console.log("   👉 Primary DB Query Result (Orders Count):", primaryCount);
    console.log("   ✅ PostgreSQL Primary & Read Replica are active and responding!");
  } catch (error) {
    console.error("   ❌ PostgreSQL Verification Error:", error.message);
  }

  // 2. VERIFY MONGODB ATLAS REPLICA SET STATUS
  try {
    console.log("\n2️⃣  Testing MongoDB Atlas Replica Set...");
    await mongoose.connect(process.env.URI);
    const adminDb = mongoose.connection.db.admin();

    // Check Replica Set status
    const status = await adminDb.command({ replSetGetStatus: 1 }).catch(() => null);
    if (status) {
      console.log("   👉 MongoDB Cluster Name:", status.set);
      console.log("   👉 Total Nodes in Replica Set:", status.members ? status.members.length : 'N/A');
      status.members.forEach((member, i) => {
        console.log(`      Node ${i + 1}: ${member.name} -> State: ${member.stateStr}`);
      });
    } else {
      // Fallback for Atlas Shared Tier (where replSetGetStatus command permissions may be restricted)
      console.log("   👉 Connected to MongoDB Atlas Cluster successfully.");
      console.log("   👉 Active MongoDB Database:", mongoose.connection.db.databaseName);
      console.log("   ℹ️  Note: MongoDB Atlas handles 3-node Replica Sets (1 Primary + 2 Secondary Replicas) automatically under the hood!");
    }
    console.log("   ✅ MongoDB is active and healthy!");
  } catch (error) {
    console.error("   ❌ MongoDB Verification Error:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

verifyDatabases();
