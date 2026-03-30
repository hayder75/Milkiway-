const express = require('express');
const router = express.Router();
const System = require('../models/System');

router.get('/', async (req, res) => {
  try {
    const systems = await System.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(systems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const system = await System.findById(req.params.id);
    if (!system) return res.status(404).json({ message: 'System not found' });
    res.json(system);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const system = new System(req.body);
    await system.save();
    res.status(201).json(system);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const system = await System.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!system) return res.status(404).json({ message: 'System not found' });
    res.json(system);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const system = await System.findByIdAndUpdate(req.params.id, { isActive: false });
    if (!system) return res.status(404).json({ message: 'System not found' });
    res.json({ message: 'System deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
