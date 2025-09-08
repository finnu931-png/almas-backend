const express = require('express');
const router = express.Router();
const ServiceCategory = require('../models/ServiceCategory');
const { requireUser } = require('./middleware/auth');

// Get all service categories
router.get('/', async (req, res) => {
  try {
    const categories = await ServiceCategory.find({ isActive: true })
      .sort({ order: 1, name: 1 });
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching service categories:', error);
    res.status(500).json({ message: 'Error fetching service categories' });
  }
});

// Get all service categories (admin)
router.get('/admin', requireUser, async (req, res) => {
  try {
    const categories = await ServiceCategory.find()
      .sort({ order: 1, name: 1 });
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching service categories:', error);
    res.status(500).json({ message: 'Error fetching service categories' });
  }
});

// Get single service category
router.get('/:id', async (req, res) => {
  try {
    const category = await ServiceCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Service category not found' });
    }
    res.json({ category });
  } catch (error) {
    console.error('Error fetching service category:', error);
    res.status(500).json({ message: 'Error fetching service category' });
  }
});

// Create service category
router.post('/', requireUser, async (req, res) => {
  try {
    const { name, description, icon, color, order, isActive } = req.body;
    
    const category = new ServiceCategory({
      name,
      description,
      icon,
      color,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });
    
    await category.save();
    res.status(201).json({ category });
  } catch (error) {
    console.error('Error creating service category:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Service category with this name already exists' });
    } else {
      res.status(500).json({ message: 'Error creating service category' });
    }
  }
});

// Update service category
router.put('/:id', requireUser, async (req, res) => {
  try {
    const { name, description, icon, color, order, isActive } = req.body;
    
    const category = await ServiceCategory.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        icon,
        color,
        order,
        isActive
      },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ message: 'Service category not found' });
    }
    
    res.json({ category });
  } catch (error) {
    console.error('Error updating service category:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Service category with this name already exists' });
    } else {
      res.status(500).json({ message: 'Error updating service category' });
    }
  }
});

// Delete service category
router.delete('/:id', requireUser, async (req, res) => {
  try {
    const category = await ServiceCategory.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Service category not found' });
    }
    res.json({ message: 'Service category deleted successfully' });
  } catch (error) {
    console.error('Error deleting service category:', error);
    res.status(500).json({ message: 'Error deleting service category' });
  }
});

// Reorder service categories
router.put('/reorder', requireUser, async (req, res) => {
  try {
    const { categories } = req.body;
    
    const updatePromises = categories.map((cat, index) => 
      ServiceCategory.findByIdAndUpdate(cat._id, { order: index })
    );
    
    await Promise.all(updatePromises);
    res.json({ message: 'Service categories reordered successfully' });
  } catch (error) {
    console.error('Error reordering service categories:', error);
    res.status(500).json({ message: 'Error reordering service categories' });
  }
});

module.exports = router;






