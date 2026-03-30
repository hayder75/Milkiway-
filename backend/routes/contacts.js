const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

router.post('/', async (req, res) => {
  try {
    const { name, phone, email, systemId, systemName, message, sellerId } = req.body;
    
    const contact = new Contact({
      name,
      phone,
      email,
      system: systemId,
      systemName,
      message,
      seller: sellerId || null,
      status: 'new'
    });
    
    await contact.save();
    res.status(201).json({ message: 'Contact request submitted', contact });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find()
      .populate('seller', 'name sellerId')
      .populate('system', 'title')
      .sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json(contact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
