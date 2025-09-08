const express = require('express');
const router = express.Router();
const SeedService = require('../services/seedService');
const { seedServiceCategories } = require('../services/serviceCategorySeedService')
const { seedTeamMembers } = require('../services/teamMemberSeedService');
const { seedFormFields } = require('../services/formFieldSeedService');

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

// POST /api/seed/service-categories - Seed service categories
router.post('/service-categories', async (req, res) => {
  try {
    console.log('POST /api/seed/service-categories - Seeding service categories');
    const result = await seedServiceCategories();
    
    res.status(200).json({
      success: true,
      message: 'Service categories seeded successfully',
      data: result
    });
  } catch (error) {
    console.error('Error seeding service categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to seed service categories',
      message: error.message
    });
  }
});

// POST /api/seed/team-members - Seed team members
router.post('/team-members', async (req, res) => {
  try {
    console.log('POST /api/seed/team-members - Seeding team members');
    const result = await seedTeamMembers();
    
    res.status(200).json({
      success: true,
      message: 'Team members seeded successfully',
      data: result
    });
  } catch (error) {
    console.error('Error seeding team members:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to seed team members',
      message: error.message
    });
  }
});

// POST /api/seed/form-fields - Seed form fields
router.post('/form-fields', async (req, res) => {
  try {
    console.log('POST /api/seed/form-fields - Seeding form fields');
    const result = await seedFormFields();
    
    res.status(200).json({
      success: true,
      message: 'Form fields seeded successfully',
      data: result
    });
  } catch (error) {
    console.error('Error seeding form fields:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to seed form fields',
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