import { PrismaClient } from '@prisma/client'

// Global variable to store the Prisma client instance
const globalForPrisma = globalThis

// Initialize Prisma client with better error handling
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
})

// Connection helper with retry logic
export async function withRetry(operation, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === retries - 1) throw error;
      if (!error.message?.includes('timeout') && !error.message?.includes('connection')) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// In development, save the Prisma instance to prevent hot reload issues
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
