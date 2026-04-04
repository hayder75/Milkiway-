const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

function withMongoId(record) {
  return { ...record, _id: record.id };
}

router.get('/', async (req, res) => {
  try {
    const systems = await prisma.system.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(systems.map(withMongoId));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const system = await prisma.system.findUnique({ where: { id: req.params.id } });
    if (!system) return res.status(404).json({ message: 'System not found' });
    res.json(withMongoId(system));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const system = await prisma.system.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        longDescription: req.body.longDescription || req.body.description || null,
        image: req.body.image || null,
        video: req.body.video || null,
        demoUrl: req.body.demoUrl || null,
        price: Number(req.body.price || 0),
        commissionRate: req.body.commissionRate !== undefined ? Number(req.body.commissionRate) : 15,
        features: Array.isArray(req.body.features) ? req.body.features : [],
        category: req.body.category || null,
        isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true
      }
    });
    res.status(201).json(withMongoId(system));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = {
      title: req.body.title,
      description: req.body.description,
      longDescription: req.body.longDescription,
      image: req.body.image,
      video: req.body.video,
      demoUrl: req.body.demoUrl,
      price: req.body.price !== undefined ? Number(req.body.price) : undefined,
      commissionRate: req.body.commissionRate !== undefined ? Number(req.body.commissionRate) : undefined,
      features: Array.isArray(req.body.features) ? req.body.features : undefined,
      category: req.body.category,
      isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : undefined
    };

    Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);

    const system = await prisma.system.update({
      where: { id: req.params.id },
      data
    });
    if (!system) return res.status(404).json({ message: 'System not found' });
    res.json(withMongoId(system));
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'System not found' });
    }
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const system = await prisma.system.update({
      where: { id: req.params.id },
      data: { isActive: false }
    });
    if (!system) return res.status(404).json({ message: 'System not found' });
    res.json({ message: 'System deleted' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'System not found' });
    }
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
