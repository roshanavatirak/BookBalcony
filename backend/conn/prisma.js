const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { readReplicas } = require('@prisma/extension-read-replicas');

// Primary Postgres Pool & Adapter (Optimized for Free Tier limits)
const primaryPoolConfig = {
  connectionString: process.env.DATABASE_URL,
  max: parseInt(process.env.PG_MAX_POOL_SIZE || "3", 10),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};
const primaryPool = new Pool(primaryPoolConfig);
const primaryAdapter = new PrismaPg(primaryPool);

// Base client for Primary Database (Writes & Transactions)
const basePrisma = new PrismaClient({ adapter: primaryAdapter });

// Extended client with Read Replica extension (Reads -> Replica, Writes -> Primary)
const replicaUrl = process.env.READ_REPLICA_URL || process.env.DATABASE_URL;
const replicaPoolConfig = {
  connectionString: replicaUrl,
  max: parseInt(process.env.PG_REPLICA_MAX_POOL_SIZE || "3", 10),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

const replicaPool = new Pool(replicaPoolConfig);
const replicaAdapter = new PrismaPg(replicaPool);

const prisma = basePrisma.$extends(
  readReplicas({
    replicas: [
      new PrismaClient({ adapter: replicaAdapter }),
    ],
  })
);

module.exports = prisma;




