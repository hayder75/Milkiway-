const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

function withMongoId(record) {
  return { ...record, _id: record.id };
}

// Seller creates payout request
router.post('/', async (req, res) => {
  try {
    const { sellerId, amount, paymentMethod, note } = req.body;
    
    const seller = await prisma.seller.findUnique({ where: { sellerId } });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Check if seller has this payment method enabled
    const methods = seller.paymentMethods || {};
    if (!methods[paymentMethod]?.enabled) {
      return res.status(400).json({ message: 'Payment method not configured' });
    }

    // Check if amount is within available earnings
    if (amount > seller.totalEarnings) {
      return res.status(400).json({ message: 'Amount exceeds available earnings' });
    }

    const payout = await prisma.payoutRequest.create({
      data: {
        sellerId: seller.id,
        amount: Number(amount),
        paymentMethod,
        note: note || null,
        status: 'pending'
      }
    });

    res.status(201).json({ message: 'Payout request created', payout: withMongoId(payout) });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get seller's payout requests
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const seller = await prisma.seller.findUnique({ where: { sellerId: req.params.sellerId } });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const payouts = await prisma.payoutRequest.findMany({
      where: { sellerId: seller.id },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(payouts.map(withMongoId));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all payout requests (admin)
router.get('/all', async (req, res) => {
  try {
    const payouts = await prisma.payoutRequest.findMany({
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            sellerId: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(payouts.map(p => ({
      ...withMongoId(p),
      seller: p.seller ? withMongoId(p.seller) : null
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update payout status (admin)
router.put('/:id', async (req, res) => {
  try {
    const { status, processedBy } = req.body;
    
    const payout = await prisma.payoutRequest.findUnique({ where: { id: req.params.id } });
    if (!payout) {
      return res.status(404).json({ message: 'Payout not found' });
    }

    const updateData = { status };
    if (status === 'completed' || status === 'rejected') {
      updateData.processedAt = new Date();
    }
    if (processedBy) {
      updateData.processedBy = processedBy;
    }

    const updated = await prisma.payoutRequest.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            sellerId: true
          }
        }
      }
    });

    res.json({ 
      message: `Payout ${status}`, 
      payout: updated ? withMongoId(updated) : null 
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;