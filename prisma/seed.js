const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create categories
  const categories = [
    {
      name: 'Blankets & Throws',
      description: 'Cozy blankets and throws for your home',
      image: '/categories/blankets.jpg'
    },
    {
      name: 'Amigurumi',
      description: 'Adorable crocheted stuffed animals and characters',
      image: '/categories/amigurumi.jpg'
    },
    {
      name: 'Home Decor',
      description: 'Beautiful crochet items to decorate your home',
      image: '/categories/home-decor.jpg'
    },
    {
      name: 'Accessories',
      description: 'Stylish crochet accessories and wearables',
      image: '/categories/accessories.jpg'
    },
    {
      name: 'Baby Items',
      description: 'Soft and safe crochet items for babies',
      image: '/categories/baby.jpg'
    }
  ];

  console.log('📁 Creating categories...');
  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {},
      create: categoryData,
    });
    console.log(`✅ Created category: ${category.name}`);
  }

  // Create sample products
  const products = [
    {
      name: 'Cozy Granny Square Blanket',
      description: 'A beautiful granny square blanket made with soft cotton yarn. Perfect for adding warmth and style to any room.',
      price: 2500,
      images: JSON.stringify(['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400']),
      categoryId: (await prisma.category.findUnique({ where: { name: 'Blankets & Throws' } })).id,
      stock: 5,
      sku: 'BLK-001',
      material: 'Cotton',
      size: '150x200 cm',
      color: 'Multi-color',
      pattern: 'Granny Square',
      difficulty: 'Intermediate',
      washCare: 'Machine wash cold, gentle cycle'
    },
    {
      name: 'Cute Bunny Amigurumi',
      description: 'An adorable crocheted bunny with floppy ears and a cute face. Perfect as a gift or decoration.',
      price: 800,
      images: JSON.stringify(['https://images.unsplash.com/photo-1520637836862-4d197d17c91a?w=400', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400']),
      categoryId: (await prisma.category.findUnique({ where: { name: 'Amigurumi' } })).id,
      stock: 10,
      sku: 'AMI-001',
      material: 'Acrylic',
      size: '15 cm tall',
      color: 'White',
      pattern: 'Basic Amigurumi',
      difficulty: 'Beginner',
      washCare: 'Hand wash only'
    },
    {
      name: 'Macrame Wall Hanging',
      description: 'Elegant macrame wall hanging with intricate patterns. Adds a bohemian touch to any space.',
      price: 1200,
      images: JSON.stringify(['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400']),
      categoryId: (await prisma.category.findUnique({ where: { name: 'Home Decor' } })).id,
      stock: 8,
      sku: 'DEC-001',
      material: 'Cotton Cord',
      size: '60x40 cm',
      color: 'Natural',
      pattern: 'Macrame',
      difficulty: 'Advanced',
      washCare: 'Spot clean only'
    },
    {
      name: 'Crochet Beanie Hat',
      description: 'Warm and stylish crochet beanie perfect for winter. Made with soft wool blend yarn.',
      price: 600,
      images: JSON.stringify(['https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400']),
      categoryId: (await prisma.category.findUnique({ where: { name: 'Accessories' } })).id,
      stock: 15,
      sku: 'ACC-001',
      material: 'Wool Blend',
      size: 'One Size',
      color: 'Gray',
      pattern: 'Basic Crochet',
      difficulty: 'Beginner',
      washCare: 'Hand wash cold'
    },
    {
      name: 'Baby Blanket Set',
      description: 'Soft and gentle baby blanket with matching booties. Made with baby-safe materials.',
      price: 1800,
      images: JSON.stringify(['https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400']),
      categoryId: (await prisma.category.findUnique({ where: { name: 'Baby Items' } })).id,
      stock: 6,
      sku: 'BAB-001',
      material: 'Baby Cotton',
      size: '80x80 cm',
      color: 'Pastel Pink',
      pattern: 'Simple Squares',
      difficulty: 'Beginner',
      washCare: 'Machine wash gentle, baby detergent'
    },
    {
      name: 'Sophisticated Afghan Blanket',
      description: 'Large, luxurious afghan blanket with intricate cable patterns. Perfect for the living room.',
      price: 3500,
      images: JSON.stringify(['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400']),
      categoryId: (await prisma.category.findUnique({ where: { name: 'Blankets & Throws' } })).id,
      stock: 3,
      sku: 'BLK-002',
      material: 'Merino Wool',
      size: '180x220 cm',
      color: 'Cream',
      pattern: 'Cable Stitch',
      difficulty: 'Advanced',
      washCare: 'Dry clean only'
    },
    {
      name: 'Unicorn Amigurumi',
      description: 'Magical unicorn amigurumi with rainbow mane and golden horn. A favorite among children.',
      price: 1200,
      images: JSON.stringify(['https://images.unsplash.com/photo-1529720317453-c8da503f2051?w=400']),
      categoryId: (await prisma.category.findUnique({ where: { name: 'Amigurumi' } })).id,
      stock: 7,
      sku: 'AMI-002',
      material: 'Acrylic',
      size: '20 cm tall',
      color: 'White with Rainbow',
      pattern: 'Amigurumi with Details',
      difficulty: 'Intermediate',
      washCare: 'Hand wash only'
    },
    {
      name: 'Crochet Market Bag',
      description: 'Eco-friendly crochet market bag. Strong and stretchy, perfect for grocery shopping.',
      price: 400,
      images: JSON.stringify(['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400']),
      categoryId: (await prisma.category.findUnique({ where: { name: 'Accessories' } })).id,
      stock: 20,
      sku: 'ACC-002',
      material: 'Cotton',
      size: 'One Size',
      color: 'Natural',
      pattern: 'Mesh Stitch',
      difficulty: 'Beginner',
      washCare: 'Machine wash'
    }
  ];

  console.log('🧶 Creating products...');
  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { sku: productData.sku },
      update: {},
      create: productData,
    });
    console.log(`✅ Created product: ${product.name}`);
  }

  // Create a sample admin user
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash('admin123', 12);

  const superAdminUser = await prisma.user.upsert({
    where: { email: 'admin@thekroshetnani.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@thekroshetnani.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  console.log(`✅ Created super admin user: ${superAdminUser.email}`);
  console.log(`🔑 Super admin credentials: admin@thekroshetnani.com / admin123`);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
