// Fix existing users with incorrect SUPER_ADMIN roles
require('dotenv').config({ path: './.env.local' })
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixUserRoles() {
  try {
    console.log('🔄 Starting user role migration...')
    
    // Find all users with SUPER_ADMIN role
    const superAdminUsers = await prisma.user.findMany({
      where: { role: 'SUPER_ADMIN' },
      select: { id: true, email: true, role: true, createdAt: true }
    })
    
    console.log(`Found ${superAdminUsers.length} users with SUPER_ADMIN role`)
    
    // Define which emails should remain as SUPER_ADMIN (your admin accounts)
    const adminEmails = [
      'thekroshetnani@gmail.com', // Add your admin email here
      // Add other admin emails if needed
    ]
    
    let fixedCount = 0
    let keptAdminCount = 0
    
    for (const user of superAdminUsers) {
      if (adminEmails.includes(user.email)) {
        console.log(`✅ Keeping ${user.email} as SUPER_ADMIN`)
        keptAdminCount++
      } else {
        // Change to CUSTOMER role
        await prisma.user.update({
          where: { id: user.id },
          data: { role: 'CUSTOMER' }
        })
        console.log(`🔄 Changed ${user.email} from SUPER_ADMIN to CUSTOMER`)
        fixedCount++
      }
    }
    
    console.log(`\n✅ Migration completed:`)
    console.log(`   - Fixed ${fixedCount} users (changed to CUSTOMER)`)
    console.log(`   - Kept ${keptAdminCount} admin users`)
    
  } catch (error) {
    console.error('❌ Error during migration:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the migration
fixUserRoles()