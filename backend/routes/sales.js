const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

function withMongoId(record) {
  return { ...record, _id: record.id };
}

function generateSaleId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SAL${timestamp}${random}`;
}

router.post('/', async (req, res) => {
  try {
    const { sellerId, systemId, systemName, buyerName, buyerPhone, buyerEmail, salePrice, sellerCommissionRate } = req.body;
    
    const seller = await prisma.seller.findUnique({ where: { sellerId } });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const system = await prisma.system.findUnique({ where: { id: systemId } });
    if (!system) {
      return res.status(404).json({ message: 'System not found' });
    }

    const numericSalePrice = Number(salePrice);
    const commissionPercent = Number(sellerCommissionRate || seller.commissionRate);
    const commissionAmount = (numericSalePrice * commissionPercent) / 100;
    const companyEarnings = numericSalePrice - commissionAmount;

    const sale = await prisma.sale.create({
      data: {
        saleId: generateSaleId(),
        sellerId: seller.id,
        systemId,
        systemName: systemName || system.title,
        buyerName,
        buyerPhone,
        buyerEmail: buyerEmail || null,
        salePrice: numericSalePrice,
        commissionPercent,
        commissionAmount,
        companyEarnings,
        status: 'pending'
      }
    });

    res.status(201).json({ message: 'Sale recorded successfully', sale: withMongoId(sale) });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const existingSale = await prisma.sale.findUnique({ where: { id: req.params.id } });
    if (!existingSale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    const nextStatus = req.body.status || existingSale.status;
    const shouldIncrementSeller = existingSale.status !== 'confirmed' && nextStatus === 'confirmed';
    const shouldDecrementSeller = existingSale.status === 'confirmed' && nextStatus !== 'confirmed';

    const updatedSale = await prisma.sale.update({
      where: { id: req.params.id },
      data: {
        buyerName: req.body.buyerName,
        buyerPhone: req.body.buyerPhone,
        buyerEmail: req.body.buyerEmail,
        systemName: req.body.systemName,
        status: nextStatus
      }
    });

    if (shouldIncrementSeller) {
      await prisma.seller.update({
        where: { id: existingSale.sellerId },
        data: {
          totalSales: { increment: 1 },
          totalEarnings: { increment: existingSale.commissionAmount }
        }
      });
    }

    if (shouldDecrementSeller) {
      await prisma.seller.update({
        where: { id: existingSale.sellerId },
        data: {
          totalSales: { decrement: 1 },
          totalEarnings: { decrement: existingSale.commissionAmount }
        }
      });
    }

    res.json({ message: 'Sale updated successfully', sale: withMongoId(updatedSale) });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.status(400).json({ message: err.message });
  }
});

router.get('/seller/:sellerId', async (req, res) => {
  try {
    const seller = await prisma.seller.findUnique({ where: { sellerId: req.params.sellerId } });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const sales = await prisma.sale.findMany({
      where: { sellerId: seller.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(sales.map(withMongoId));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/stats/:sellerId', async (req, res) => {
  try {
    const seller = await prisma.seller.findUnique({ where: { sellerId: req.params.sellerId } });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const sales = await prisma.sale.findMany({
      where: { sellerId: seller.id, status: 'confirmed' }
    });
    const pendingSales = await prisma.sale.count({
      where: { sellerId: seller.id, status: 'pending' }
    });
    
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, s) => sum + s.salePrice, 0);
    const totalEarnings = sales.reduce((sum, s) => sum + s.commissionAmount, 0);

    res.json({
      totalSales,
      totalRevenue,
      totalEarnings,
      commissionRate: seller.commissionRate,
      pendingSales
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            sellerId: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const payload = sales.map((sale) => ({
      ...withMongoId(sale),
      seller: sale.seller ? withMongoId(sale.seller) : null
    }));

    res.json(payload);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
