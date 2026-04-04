const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

function withMongoId(record) {
  return { ...record, _id: record.id };
}

router.get('/', async (req, res) => {
  try {
    const issues = await prisma.issueReport.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(issues.map(withMongoId));
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

    const issue = await prisma.issueReport.create({
      data: {
        title: req.body.title,
        description: req.body.description || null,
        type: req.body.type || 'bug',
        status: req.body.status || 'open',
        reporterName: req.body.reporterName || seller?.name || 'Unknown Seller',
        sellerId: seller?.id || null
      }
    });

    res.status(201).json({ message: 'Issue reported successfully', issue: withMongoId(issue) });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const issue = await prisma.issueReport.update({
      where: { id: req.params.id },
      data: {
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        status: req.body.status
      }
    });
    res.json({ message: 'Issue updated successfully', issue: withMongoId(issue) });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Issue not found' });
    }
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;