const { PrismaClient } = require('@prisma/client');

// Singleton pattern: reutilizar la misma instancia de PrismaClient
let prisma;

if (!prisma) {
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

module.exports = prisma;
