import { PrismaClient } from '@prisma/client'

// Global variable to store the Prisma client instance
const globalForPrisma = globalThis

// Initialize Prisma client (reuse existing instance in development to prevent connection issues)
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'],
})

// In development, save the Prisma instance to prevent hot reload issues
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma