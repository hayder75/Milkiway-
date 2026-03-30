const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Seller = require('../models/Seller');
const Contact = require('../models/Contact');

function generateSaleId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SAL${timestamp}${random}`;
}

router.post('/', async (req, res) => {
  try {
    const { sellerId, systemId, systemName, buyerName, buyerPhone, buyerEmail, salePrice, sellerCommissionRate } = req.body;
    
    const seller = await Seller.findOne({ sellerId });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const commissionPercent = sellerCommissionRate || seller.commissionRate;
    const commissionAmount = (salePrice * commissionPercent) / 100;
    const companyEarnings = salePrice - commissionAmount;

    const sale = new Sale({
      saleId: generateSaleId(),
      seller: seller._id,
      system: systemId,
      systemName,
      buyerName,
      buyerPhone,
      buyerEmail,
      salePrice,
      commissionPercent,
      commissionAmount,
      companyEarnings,
      status: 'confirmed'
    });

    await sale.save();

    seller.totalSales += 1;
    seller.totalEarnings += commissionAmount;
    await seller.save();

    res.status(201).json({ message: 'Sale recorded successfully', sale });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/seller/:sellerId', async (req, res) => {
  try {
    const seller = await Seller.findOne({ sellerId: req.params.sellerId });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const sales = await Sale.find({ seller: seller._id }).sort({ createdAt: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/stats/:sellerId', async (req, res) => {
  try {
    const seller = await Seller.findOne({ sellerId: req.params.sellerId });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const sales = await Sale.find({ seller: seller._id, status: 'confirmed' });
    
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, s) => sum + s.salePrice, 0);
    const totalEarnings = sales.reduce((sum, s) => sum + s.commissionAmount, 0);

    res.json({
      totalSales,
      totalRevenue,
      totalEarnings,
      commissionRate: seller.commissionRate,
      pendingSales: sales.filter(s => s.status === 'pending').length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const sales = await Sale.find().populate('seller', 'name sellerId').sort({ createdAt: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
