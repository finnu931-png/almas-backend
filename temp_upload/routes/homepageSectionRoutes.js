const express = require('express');
const { requireUser } = require('./middleware/auth');
const HomepageSectionService = require('../services/homepageSectionService');

const router = express.Router();

// GET /api/homepage-sections - Get all homepage sections
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/homepage-sections - Fetching homepage sections');
    const { sectionType, isActive } = req.query;
    const filters = {};
    
    if (sectionType) filters.sectionType = sectionType;
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    
    const sections = await HomepageSectionService.getAll(filters);
    
    res.status(200).json({
      success: true,
      data: sections,
      count: sections.length
    });
  } catch (error) {
    console.error('Error fetching homepage sections:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch homepage sections'
    });
  }
});

// GET /api/homepage-sections/:id - Get single homepage section
router.get('/:id', async (req, res) => {
  try {
    console.log('GET /api/homepage-sections/:id - Fetching section with ID:', req.params.id);
    const section = await HomepageSectionService.getById(req.params.id);
    
    if (!section) {
      return res.status(404).json({
        success: false,
        error: 'Homepage section not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: section
    });
  } catch (error) {
    console.error('Error fetching homepage section:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch homepage section'
    });
  }
});

// POST /api/homepage-sections - Create new homepage section (Admin only)
router.post('/', requireUser, async (req, res) => {
  try {
    console.log('POST /api/homepage-sections - Creating new section by user:', req.user.email);
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }
    
    const { title, content, order, sectionType, isActive, metadata } = req.body;
    
    // Validate required fields
    if (!title || !content || !sectionType) {
      return res.status(400).json({
        success: false,
        error: 'Title, content, and section type are required'
      });
    }
    
    const sectionData = {
      title,
      content,
      order: order || 0,
      sectionType,
      isActive: isActive !== undefined ? isActive : true,
      metadata: metadata || {}
    };
    
    const section = await HomepageSectionService.create(sectionData);
    
    res.status(201).json({
      success: true,
      data: section,
      message: 'Homepage section created successfully'
    });
  } catch (error) {
    console.error('Error creating homepage section:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create homepage section'
    });
  }
});

// PUT /api/homepage-sections/:id - Update homepage section (Admin only)
router.put('/:id', requireUser, async (req, res) => {
  try {
    console.log('PUT /api/homepage-sections/:id - Updating section with ID:', req.params.id);
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }
    
    const { title, content, order, sectionType, isActive, metadata } = req.body;
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (order !== undefined) updateData.order = order;
    if (sectionType !== undefined) updateData.sectionType = sectionType;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (metadata !== undefined) updateData.metadata = metadata;
    
    const section = await HomepageSectionService.update(req.params.id, updateData);
    
    if (!section) {
      return res.status(404).json({
        success: false,
        error: 'Homepage section not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: section,
      message: 'Homepage section updated successfully'
    });
  } catch (error) {
    console.error('Error updating homepage section:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update homepage section'
    });
  }
});

// DELETE /api/homepage-sections/:id - Delete homepage section (Admin only)
router.delete('/:id', requireUser, async (req, res) => {
  try {
    console.log('DELETE /api/homepage-sections/:id - Deleting section with ID:', req.params.id);
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }
    
    const section = await HomepageSectionService.delete(req.params.id);
    
    if (!section) {
      return res.status(404).json({
        success: false,
        error: 'Homepage section not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Homepage section deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting homepage section:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete homepage section'
    });
  }
});

module.exports = router;