import { PrismaClient } from '@prisma/client'

// Global variable to store the Prisma client instance
const globalForPrisma = globalThis

// Initialize Prisma client with retry logic and better error handling
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  transactionOptions: {
    timeout: 20000, // 20 seconds
  },
})

// Add connection retry logic
prisma.$use(async (params, next) => {
  let retries = 3;
  while (retries > 0) {
    try {
      return await next(params);
    } catch (error) {
      retries--;
      if (retries === 0 || !error.message?.includes('timeout') && !error.message?.includes('connection')) {
        throw error;
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
});

// In development, save the Prisma instance to prevent hot reload issues
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
