const express = require('express');
const router = express.Router();
const portfolio = require('../models/Portfolio');

// Get all portfolio items
router.get('/', async (req, res) => {
  try {
    const items = await portfolio.getAll();
    res.json(items);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ message: 'Failed to fetch portfolio items' });
  }
});

// Get single portfolio item
router.get('/:id', async (req, res) => {
  try {
    const item = await portfolio.getById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching portfolio item:', error);
    res.status(500).json({ message: 'Failed to fetch portfolio item' });
  }
});

// Create portfolio item
router.post('/', async (req, res) => {
  try {
    const { title, client, category, description, image, images, video, size, services, tags, isActive } = req.body;
    
    if (!title || !client || !category || !description || !image) {
      return res.status(400).json({ message: 'Title, client, category, description, and image are required' });
    }

    const item = await portfolio.create({
      title,
      client,
      category,
      description,
      image,
      images: images || [],
      video: video || '',
      size: size || 'medium',
      services: services || [],
      tags: tags || [],
      isActive: isActive !== false,
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    res.status(500).json({ message: 'Failed to create portfolio item' });
  }
});

// Update portfolio item
router.put('/:id', async (req, res) => {
  try {
    const { title, client, category, description, image, images, video, size, services, tags, isActive } = req.body;
    
    const existing = await portfolio.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    const item = await portfolio.update(req.params.id, {
      title: title || existing.title,
      client: client || existing.client,
      category: category || existing.category,
      description: description || existing.description,
      image: image !== undefined ? image : existing.image,
      images: images !== undefined ? images : existing.images,
      video: video !== undefined ? video : existing.video,
      size: size || existing.size,
      services: services || existing.services,
      tags: tags || existing.tags,
      isActive: isActive !== undefined ? isActive : existing.isActive,
    });

    res.json(item);
  } catch (error) {
    console.error('Error updating portfolio item:', error);
    res.status(500).json({ message: 'Failed to update portfolio item' });
  }
});

// Delete portfolio item
router.delete('/:id', async (req, res) => {
  try {
    const existing = await portfolio.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    await portfolio.delete(req.params.id);
    res.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    res.status(500).json({ message: 'Failed to delete portfolio item' });
  }
});

module.exports = router;