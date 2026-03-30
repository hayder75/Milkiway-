const express = require('express');
const router = express.Router();
const Seller = require('../models/Seller');

function generateSellerId() {
  const prefix = 'MW';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const seller = new Seller({
      sellerId: generateSellerId(),
      name,
      email,
      phone,
      status: 'pending',
      commissionRate: 30
    });
    
    await seller.save();
    res.status(201).json({ message: 'Application submitted', seller });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { sellerId, email } = req.body;
    
    const seller = await Seller.findOne({ sellerId, email });
    if (!seller) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.json({
      seller: {
        _id: seller._id,
        sellerId: seller.sellerId,
        name: seller.name,
        email: seller.email,
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

router.get('/:id', async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ message: 'Seller not found' });
    res.json(seller);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/id/:sellerId', async (req, res) => {
  try {
    const seller = await Seller.findOne({ sellerId: req.params.sellerId });
    if (!seller) return res.status(404).json({ message: 'Seller not found' });
    res.json(seller);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
