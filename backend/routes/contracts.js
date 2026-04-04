const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

function withMongoId(record) {
  return { ...record, _id: record.id };
}

// Create a new contract
router.post('/', async (req, res) => {
  try {
    const { sellerId, systemId, systemName, buyerName, buyerPhone, buyerEmail, salePrice } = req.body;
    
    const seller = await prisma.seller.findUnique({ where: { sellerId } });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const contract = await prisma.contract.create({
      data: {
        sellerId: seller.id,
        systemId,
        systemName,
        buyerName,
        buyerPhone,
        buyerEmail: buyerEmail || null,
        salePrice: Number(salePrice),
        status: 'draft'
      }
    });

    res.status(201).json({ message: 'Contract created', contract: withMongoId(contract) });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get seller's contracts
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const seller = await prisma.seller.findUnique({ where: { sellerId: req.params.sellerId } });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const contracts = await prisma.contract.findMany({
      where: { sellerId: seller.id },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(contracts.map(withMongoId));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update contract status (mark as used when deal is closed)
router.put('/:id/use', async (req, res) => {
  try {
    const contract = await prisma.contract.findUnique({ where: { id: req.params.id } });
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    const updated = await prisma.contract.update({
      where: { id: req.params.id },
      data: { status: 'used' }
    });

    res.json({ message: 'Contract marked as used', contract: withMongoId(updated) });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a draft contract
router.delete('/:id', async (req, res) => {
  try {
    const contract = await prisma.contract.findUnique({ where: { id: req.params.id } });
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    if (contract.status !== 'draft') {
      return res.status(400).json({ message: 'Can only delete draft contracts' });
    }

    await prisma.contract.delete({ where: { id: req.params.id } });
    res.json({ message: 'Contract deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;