const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

function withMongoId(record) {
  return { ...record, _id: record.id };
}

router.get('/', async (req, res) => {
  try {
    const features = await prisma.featureRequest.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(features.map(withMongoId));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    let seller = null;
    if (req.body.sellerId) {
      seller = await prisma.seller.findUnique({ where: { sellerId: req.body.sellerId } });
    }

    const feature = await prisma.featureRequest.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        requestedBy: req.body.requestedBy || seller?.name || 'Unknown Seller',
        sellerId: seller?.id || null,
        votes: req.body.votes !== undefined ? Number(req.body.votes) : 1,
        status: req.body.status || 'pending'
      }
    });

    res.status(201).json({ message: 'Feature request submitted', feature: withMongoId(feature) });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const feature = await prisma.featureRequest.update({
      where: { id: req.params.id },
      data: {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        votes: req.body.votes !== undefined ? Number(req.body.votes) : undefined
      }
    });
    res.json({ message: 'Feature request updated', feature: withMongoId(feature) });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Feature request not found' });
    }
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;