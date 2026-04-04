const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

function withMongoId(record) {
  return { ...record, _id: record.id };
}

// Create a new creative request (public endpoint)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, companyName, projectType, budget, description } = req.body;

    if (!name || !email || !phone || !projectType || !description) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const request = await prisma.creativeRequest.create({
      data: {
        name,
        email,
        phone,
        companyName: companyName || null,
        projectType,
        budget: budget || null,
        description,
        status: 'new'
      }
    });

    res.status(201).json({ message: 'Request submitted successfully!', request: withMongoId(request) });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all creative requests (admin)
router.get('/', async (req, res) => {
  try {
    const requests = await prisma.creativeRequest.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(requests.map(withMongoId));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update request status (admin)
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    const request = await prisma.creativeRequest.findUnique({ where: { id: req.params.id } });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const updated = await prisma.creativeRequest.update({
      where: { id: req.params.id },
      data: { status }
    });

    res.json({ message: 'Status updated', request: withMongoId(updated) });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete request (admin)
router.delete('/:id', async (req, res) => {
  try {
    await prisma.creativeRequest.delete({ where: { id: req.params.id } });
    res.json({ message: 'Request deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;