const express = require('express');
const router = express.Router();
const SeedService = require('../services/seedService');

// POST /api/seed/admin - Seed admin user
router.post('/admin', async (req, res) => {
  try {
    console.log('POST /api/seed/admin - Seeding admin user');
    const result = await SeedService.seedAdminUser();
    
    res.status(200).json({
      success: true,
      message: 'Admin user seeded successfully',
      data: result
    });
  } catch (error) {
    console.error('Error seeding admin user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to seed admin user',
      message: error.message
    });
  }
});

// POST /api/seed/sample-data - Seed sample data
router.post('/sample-data', async (req, res) => {
  try {
    console.log('POST /api/seed/sample-data - Seeding sample data');
    const result = await SeedService.seedSampleData();
    
    res.status(200).json({
      success: true,
      message: 'Sample data seeded successfully',
      data: result
    });
  } catch (error) {
    console.error('Error seeding sample data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to seed sample data',
      message: error.message
    });
  }
});

// DELETE /api/seed/clear-sample-data - Clear sample data
router.delete('/clear-sample-data', async (req, res) => {
  try {
    console.log('DELETE /api/seed/clear-sample-data - Clearing sample data');
    const result = await SeedService.clearSampleData();
    
    res.status(200).json({
      success: true,
      message: 'Sample data cleared successfully',
      data: result
    });
  } catch (error) {
    console.error('Error clearing sample data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear sample data',
      message: error.message
    });
  }
});

module.exports = router;