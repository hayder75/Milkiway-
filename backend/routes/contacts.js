const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

function withMongoId(record) {
  return { ...record, _id: record.id };
}

router.post('/', async (req, res) => {
  try {
    const { name, phone, email, systemId, systemName, message, sellerId } = req.body;

    let seller = null;
    if (sellerId) {
      seller = await prisma.seller.findUnique({ where: { sellerId } });
    }

    let resolvedSystemId = null;
    if (systemId) {
      const system = await prisma.system.findUnique({ where: { id: systemId } });
      resolvedSystemId = system ? system.id : null;
    }
    
    const contact = await prisma.contact.create({
      data: {
        name,
        phone,
        email: email || null,
        systemId: resolvedSystemId,
        systemName: systemName || null,
        message: message || null,
        sellerId: seller ? seller.id : null,
        status: 'new'
      }
    });
    
    res.status(201).json({ message: 'Contact request submitted', contact: withMongoId(contact) });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            sellerId: true
          }
        },
        system: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const payload = contacts.map((contact) => ({
      ...withMongoId(contact),
      seller: contact.seller ? withMongoId(contact.seller) : null,
      system: contact.system ? withMongoId(contact.system) : null
    }));

    res.json(payload);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/seller/:sellerId', async (req, res) => {
  try {
    const seller = await prisma.seller.findUnique({ where: { sellerId: req.params.sellerId } });
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const contacts = await prisma.contact.findMany({
      where: { sellerId: seller.id },
      orderBy: { createdAt: 'desc' }
    });

    res.json(contacts.map(withMongoId));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      systemName: req.body.systemName,
      message: req.body.message,
      status: req.body.status
    };

    Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);

    const contact = await prisma.contact.update({
      where: { id: req.params.id },
      data
    });
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json(withMongoId(contact));
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
