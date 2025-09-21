// Neon Database Migration Helper
const { execSync } = require('child_process');

console.log('🚀 Neon Database Migration Helper\n');

// Check if new DATABASE_URL is set
const newDatabaseUrl = process.env.NEW_DATABASE_URL;
if (!newDatabaseUrl) {
  console.log('❌ Please set NEW_DATABASE_URL environment variable with your Neon connection string');
  console.log('Example: set NEW_DATABASE_URL="postgresql://username:password@ep-xxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require"');
  process.exit(1);
}

console.log('✅ Found new database URL');
console.log('🔄 Starting migration...\n');

try {
  // Step 1: Update local environment
  console.log('📝 Step 1: Updating local environment files...');
  const fs = require('fs');
  
  // Update .env.local
  let envLocal = fs.readFileSync('.env.local', 'utf8');
  envLocal = envLocal.replace(
    /DATABASE_URL="[^"]*"/g, 
    `DATABASE_URL="${newDatabaseUrl}"`
  );
  envLocal = envLocal.replace(
    /DIRECT_URL="[^"]*"/g, 
    `DIRECT_URL="${newDatabaseUrl}"`
  );
  fs.writeFileSync('.env.local', envLocal);
  
  // Update .env
  let env = fs.readFileSync('.env', 'utf8');
  env = env.replace(
    /DATABASE_URL="[^"]*"/g, 
    `DATABASE_URL="${newDatabaseUrl}"`
  );
  env = env.replace(
    /DIRECT_URL="[^"]*"/g, 
    `DIRECT_URL="${newDatabaseUrl}"`
  );
  fs.writeFileSync('.env', env);
  
  console.log('✅ Local environment updated');
  
  // Step 2: Push schema to Neon
  console.log('\n📊 Step 2: Pushing database schema to Neon...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  console.log('✅ Schema pushed successfully');
  
  // Step 3: Seed the database
  console.log('\n🌱 Step 3: Seeding database with initial data...');
  execSync('npm run db:seed', { stdio: 'inherit' });
  console.log('✅ Database seeded successfully');
  
  // Step 4: Test connection
  console.log('\n🧪 Step 4: Testing database connection...');
  execSync('npx prisma db pull --print > /dev/null', { stdio: 'pipe' });
  console.log('✅ Database connection test passed');
  
  console.log('\n🎉 Migration completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Update your Vercel environment variables');
  console.log('2. Deploy to production');
  console.log('\nRun these commands:');
  console.log(`vercel env rm DATABASE_URL`);
  console.log(`vercel env rm DIRECT_URL`);
  console.log(`vercel env add DATABASE_URL`);
  console.log(`vercel env add DIRECT_URL`);
  console.log(`vercel --prod`);
  
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}