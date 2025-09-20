const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedOrders() {
  console.log('🛍️ Creating sample orders with payment status...');

  // Get super admin user and products
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@thekroshetnani.com' }
  });

  const products = await prisma.product.findMany({
    take: 5 // Get first 5 products
  });

  if (!admin || products.length === 0) {
    console.log('❌ Admin user or products not found. Please run the main seed first.');
    return;
  }

  // Create a sample address for orders
  let address = await prisma.address.findFirst({
    where: {
      userId: admin.id,
      isDefault: true
    }
  });

  if (!address) {
    address = await prisma.address.create({
      data: {
        userId: admin.id,
        firstName: 'Super',
        lastName: 'Admin',
        phone: '+91 9876543210',
        address1: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '123456',
        country: 'India',
        isDefault: true,
      }
    });
  }

  // Sample orders with different payment statuses
  const sampleOrders = [
    {
      userId: admin.id,
      addressId: address.id,
      status: 'DELIVERED',
      paymentStatus: 'PAID',
      totalAmount: 2500,
      items: [{ productId: products[0].id, quantity: 1, price: 2500 }],
    },
    {
      userId: admin.id,
      addressId: address.id,
      status: 'SHIPPED',
      paymentStatus: 'PAID',
      totalAmount: 1800,
      items: [{ productId: products[1].id, quantity: 1, price: 1800 }],
    },
    {
      userId: admin.id,
      addressId: address.id,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      totalAmount: 1200,
      items: [{ productId: products[2].id, quantity: 1, price: 1200 }],
    },
    {
      userId: admin.id,
      addressId: address.id,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      totalAmount: 600,
      items: [{ productId: products[3].id, quantity: 1, price: 600 }],
    },
    {
      userId: admin.id,
      addressId: address.id,
      status: 'CANCELLED',
      paymentStatus: 'FAILED',
      totalAmount: 400,
      items: [{ productId: products[4].id, quantity: 1, price: 400 }],
    },
  ];

  for (const orderData of sampleOrders) {
    const { items, ...orderInfo } = orderData;
    
    const order = await prisma.order.create({
      data: {
        ...orderInfo,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    console.log(`✅ Created order: ${order.id} - ${order.status} - ${order.paymentStatus}`);
  }

  console.log('🎉 Sample orders created successfully!');
  console.log(`💰 Total paid revenue: ₹${sampleOrders.filter(o => o.paymentStatus === 'PAID').reduce((sum, o) => sum + o.totalAmount, 0)}`);
}

seedOrders()
  .catch((e) => {
    console.error('❌ Error creating sample orders:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });