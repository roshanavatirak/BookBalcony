const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { readReplicas } = require('@prisma/extension-read-replicas');

// Primary Postgres Pool & Adapter
const primaryPool = new Pool({ connectionString: process.env.DATABASE_URL });
const primaryAdapter = new PrismaPg(primaryPool);

// Base client for Primary Database (Writes & Transactions)
const basePrisma = new PrismaClient({ adapter: primaryAdapter });

// Extended client with Read Replica extension (Reads -> Replica, Writes -> Primary)
const replicaUrl = process.env.READ_REPLICA_URL || process.env.DATABASE_URL;

const prisma = basePrisma.$extends(
  readReplicas({
    replicas: [
      new PrismaClient({ adapter: new PrismaPg(new Pool({ connectionString: replicaUrl })) }),
    ],
  })
);

module.exports = prisma;




