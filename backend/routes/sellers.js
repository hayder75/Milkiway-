const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');

function withMongoId(record) {
  return { ...record, _id: record.id };
}

function toPublicSeller(record) {
  const withId = withMongoId(record);
  delete withId.passwordHash;
  delete withId.normalizedPhone;
  return withId;
}

function generateSellerId() {
  const prefix = 'MW';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

function normalizePhone(phone) {
  if (!phone) return null;
  const cleaned = String(phone).replace(/[^\d]/g, '');
  return cleaned || null;
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, username, password } = req.body;

    if (!name || !email || !username || !password) {
      return res.status(400).json({ message: 'Name, email, username, and password are required' });
    }

    if (String(password).length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const normalizedPhone = normalizePhone(phone);
    const normalizedUsername = String(username).trim().toLowerCase();

    const existingSeller = await prisma.seller.findFirst({
      where: {
        OR: [
          { email: String(email).trim().toLowerCase() },
          { username: normalizedUsername },
          ...(normalizedPhone ? [{ normalizedPhone }] : [])
        ]
      }
    });

    if (existingSeller) {
      return res.status(400).json({ message: 'Email, username, or phone already registered' });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);

    const seller = await prisma.seller.create({
      data: {
        sellerId: generateSellerId(),
        name: String(name).trim(),
        username: normalizedUsername,
        email: String(email).trim().toLowerCase(),
        phone: phone || null,
        normalizedPhone,
        passwordHash,
        role: 'seller',
        status: 'pending',
        commissionRate: 30
      }
    });

    res.status(201).json({ message: 'Application submitted', seller: toPublicSeller(seller) });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Identifier and password are required' });
    }

    const rawIdentifier = String(identifier).trim();
    const normalizedUsername = rawIdentifier.toLowerCase();
    const normalizedPhone = normalizePhone(rawIdentifier);

    const seller = await prisma.seller.findFirst({
      where: {
        OR: [
          { username: normalizedUsername },
          ...(normalizedPhone ? [{ normalizedPhone }] : [])
        ]
      }
    });

    if (!seller || !seller.passwordHash) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(String(password), seller.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.json({
      seller: {
        _id: seller.id,
        sellerId: seller.sellerId,
        name: seller.name,
        username: seller.username,
        email: seller.email,
        phone: seller.phone,
        role: seller.role,
        commissionRate: seller.commissionRate,
        totalSales: seller.totalSales,
        totalEarnings: seller.totalEarnings,
        status: seller.status
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const sellers = await prisma.seller.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(sellers.map(toPublicSeller));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const seller = await prisma.seller.findUnique({ where: { id: req.params.id } });
    if (!seller) return res.status(404).json({ message: 'Seller not found' });
    res.json(toPublicSeller(seller));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/id/:sellerId', async (req, res) => {
  try {
    const seller = await prisma.seller.findUnique({ where: { sellerId: req.params.sellerId } });
    if (!seller) return res.status(404).json({ message: 'Seller not found' });
    res.json(toPublicSeller(seller));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update seller profile
router.put('/profile/:sellerId', async (req, res) => {
  try {
    const { name, email, phone, currentPassword, newPassword, paymentMethods } = req.body;
    
    const seller = await prisma.seller.findUnique({ where: { sellerId: req.params.sellerId } });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const updateData = {};

    // Update basic info
    if (name) updateData.name = name;
    if (email && email !== seller.email) {
      const existing = await prisma.seller.findFirst({
        where: { email: email.toLowerCase(), id: { not: seller.id } }
      });
      if (existing) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      updateData.email = email.toLowerCase();
    }
    if (phone !== undefined) updateData.phone = phone;

    // Update password if provided
    if (currentPassword && newPassword) {
      if (!seller.passwordHash) {
        return res.status(400).json({ message: 'No password set' });
      }
      const isValid = await bcrypt.compare(currentPassword, seller.passwordHash);
      if (!isValid) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
      }
      updateData.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    // Update payment methods
    if (paymentMethods) {
      const currentMethods = seller.paymentMethods || {};
      updateData.paymentMethods = { ...currentMethods, ...paymentMethods };
    }

    const updated = await prisma.seller.update({
      where: { id: seller.id },
      data: updateData
    });

    res.json({ 
      message: 'Profile updated', 
      seller: toPublicSeller(updated) 
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get seller payment methods
router.get('/payment/:sellerId', async (req, res) => {
  try {
    const seller = await prisma.seller.findUnique({ 
      where: { sellerId: req.params.sellerId },
      select: { paymentMethods: true }
    });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.json(seller.paymentMethods || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
