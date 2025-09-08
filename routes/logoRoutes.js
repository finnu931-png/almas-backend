const express = require('express');
const router = express.Router();
const LogoService = require('../services/logoService');
const { requireUser } = require('./middleware/auth');

// POST /api/logos - Create new logo
router.post('/', requireUser, async (req, res) => {
  try {
    console.log('POST /api/logos - Creating new logo');
    console.log('Request body:', req.body);

    const logoData = {
      ...req.body,
      uploadedBy: req.user.id
    };

    const logo = await LogoService.create(logoData);

    res.status(201).json({
      success: true,
      message: 'Logo created successfully',
      logo
    });

  } catch (error) {
    console.error('Error in POST /api/logos:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create logo',
      message: error.message
    });
  }
});

// GET /api/logos - Get all logos
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/logos - Fetching logos');
    
    const filters = {};
    if (req.query.category) filters.category = req.query.category;
    if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';
    if (req.query.isDefault !== undefined) filters.isDefault = req.query.isDefault === 'true';

    const logos = await LogoService.findAll(filters);

    res.json({
      success: true,
      logos,
      count: logos.length
    });

  } catch (error) {
    console.error('Error in GET /api/logos:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch logos',
      message: error.message
    });
  }
});

// GET /api/logos/default/:category - Get default logo for category
router.get('/default/:category', async (req, res) => {
  try {
    console.log('GET /api/logos/default/:category - Fetching default logo for:', req.params.category);
    
    const logo = await LogoService.getDefaultLogo(req.params.category);

    if (!logo) {
      return res.status(404).json({
        success: false,
        error: 'No default logo found for this category'
      });
    }

    res.json({
      success: true,
      logo
    });

  } catch (error) {
    console.error('Error in GET /api/logos/default/:category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch default logo',
      message: error.message
    });
  }
});

// GET /api/logos/:id - Get logo by ID
router.get('/:id', async (req, res) => {
  try {
    console.log('GET /api/logos/:id - Fetching logo:', req.params.id);
    
    const logo = await LogoService.findById(req.params.id);

    res.json({
      success: true,
      logo
    });

  } catch (error) {
    console.error('Error in GET /api/logos/:id:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch logo',
      message: error.message
    });
  }
});

// PUT /api/logos/:id - Update logo
router.put('/:id', requireUser, async (req, res) => {
  try {
    console.log('PUT /api/logos/:id - Updating logo:', req.params.id);
    console.log('Request body:', req.body);
    
    const logo = await LogoService.update(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Logo updated successfully',
      logo
    });

  } catch (error) {
    console.error('Error in PUT /api/logos/:id:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update logo',
      message: error.message
    });
  }
});

// PUT /api/logos/:id/set-default - Set logo as default
router.put('/:id/set-default', requireUser, async (req, res) => {
  try {
    console.log('PUT /api/logos/:id/set-default - Setting logo as default:', req.params.id);
    
    const logo = await LogoService.setAsDefault(req.params.id);

    res.json({
      success: true,
      message: 'Logo set as default successfully',
      logo
    });

  } catch (error) {
    console.error('Error in PUT /api/logos/:id/set-default:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to set logo as default',
      message: error.message
    });
  }
});

// DELETE /api/logos/:id - Delete logo
router.delete('/:id', requireUser, async (req, res) => {
  try {
    console.log('DELETE /api/logos/:id - Deleting logo:', req.params.id);
    
    const logo = await LogoService.delete(req.params.id);

    res.json({
      success: true,
      message: 'Logo deleted successfully',
      logo
    });

  } catch (error) {
    console.error('Error in DELETE /api/logos/:id:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete logo',
      message: error.message
    });
  }
});

module.exports = router;
