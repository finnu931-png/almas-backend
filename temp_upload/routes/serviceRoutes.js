const express = require('express');
const router = express.Router();
const { requireUser } = require('./middleware/auth');
const serviceService = require('../services/serviceService');

// GET /api/services - Get all services
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/services - Fetching all services');
    const { category, status } = req.query;
    
    const services = await serviceService.getAll({ category, status });
    
    res.json({
      success: true,
      services,
      count: services.length
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch services',
      message: error.message
    });
  }
});

// GET /api/services/:id - Get single service
router.get('/:id', async (req, res) => {
  try {
    console.log('GET /api/services/:id - Fetching service:', req.params.id);
    const service = await serviceService.getById(req.params.id);
    
    res.json({
      success: true,
      service
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch service',
      message: error.message
    });
  }
});

// POST /api/services - Create new service (Admin only)
router.post('/', requireUser, async (req, res) => {
  try {
    console.log('POST /api/services - Creating new service');
    const service = await serviceService.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create service',
      message: error.message
    });
  }
});

// PUT /api/services/:id - Update service (Admin only)
router.put('/:id', requireUser, async (req, res) => {
  try {
    console.log('PUT /api/services/:id - Updating service:', req.params.id);
    const service = await serviceService.update(req.params.id, req.body);
    
    res.json({
      success: true,
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update service',
      message: error.message
    });
  }
});

// DELETE /api/services/:id - Delete service (Admin only)
router.delete('/:id', requireUser, async (req, res) => {
  try {
    console.log('DELETE /api/services/:id - Deleting service:', req.params.id);
    await serviceService.delete(req.params.id);
    
    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete service',
      message: error.message
    });
  }
});

module.exports = router;