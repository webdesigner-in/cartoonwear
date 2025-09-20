#!/bin/bash

# Production deployment script for Vercel
echo "Starting production deployment..."

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Push database schema (for initial deployment)
echo "Pushing database schema..."
npx prisma db push

# Seed the database (optional - only for first deployment)
# echo "Seeding database..."
# npm run db:seed

echo "Deployment preparation complete!"