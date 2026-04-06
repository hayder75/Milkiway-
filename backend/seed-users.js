const prisma = require('./lib/prisma');
const bcrypt = require('bcryptjs');

async function createTestUsers() {
  console.log('Creating test users...');
  
  try {
    // Create admin
    const adminExists = await prisma.seller.findFirst({ where: { role: 'admin' } });
    if (!adminExists) {
      await prisma.seller.create({
        data: {
          sellerId: 'ADMIN001',
          name: 'Admin User',
          username: 'admin',
          email: 'admin@milkyway.com',
          phone: '+251911111111',
          normalizedPhone: '+251911111111',
          passwordHash: await bcrypt.hash('admin123', 10),
          role: 'admin',
          commissionRate: 0,
          status: 'active'
        }
      });
      console.log('Admin created: admin@milkyway.com / admin123');
    } else {
      console.log('Admin already exists');
    }

    // Create test seller
    const sellerExists = await prisma.seller.findUnique({ where: { sellerId: 'MWTEST001' } });
    if (!sellerExists) {
      await prisma.seller.create({
        data: {
          sellerId: 'MWTEST001',
          name: 'Test Seller',
          username: 'seller',
          email: 'seller@milkyway.com',
          phone: '+251912345678',
          normalizedPhone: '+251912345678',
          passwordHash: await bcrypt.hash('seller123', 10),
          role: 'seller',
          commissionRate: 30,
          status: 'active'
        }
      });
      console.log('Seller created: seller@milkyway.com / seller123');
    } else {
      console.log('Seller already exists');
    }

    console.log('Done!');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();
