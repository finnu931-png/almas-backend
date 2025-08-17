const express = require('express');
const router = express.Router();
const { requireUser } = require('./middleware/auth');
const caseStudyService = require('../services/caseStudyService');

// GET /api/work/case-studies - Get all case studies
router.get('/case-studies', async (req, res) => {
  try {
    console.log('GET /api/work/case-studies - Fetching all case studies');
    const { status, industry, featured } = req.query;

    const caseStudies = await caseStudyService.getAll({ status, industry, featured });

    res.json({
      success: true,
      caseStudies,
      count: caseStudies.length
    });
  } catch (error) {
    console.error('Error fetching case studies:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch case studies',
      message: error.message
    });
  }
});

// GET /api/work/case-studies/:id - Get single case study
router.get('/case-studies/:id', async (req, res) => {
  try {
    console.log('GET /api/work/case-studies/:id - Fetching case study:', req.params.id);
    const caseStudy = await caseStudyService.getById(req.params.id);

    res.json({
      success: true,
      caseStudy
    });
  } catch (error) {
    console.error('Error fetching case study:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch case study',
      message: error.message
    });
  }
});

// POST /api/work/case-studies - Create new case study (Admin only)
router.post('/case-studies', requireUser, async (req, res) => {
  try {
    console.log('POST /api/work/case-studies - Creating new case study');
    const caseStudy = await caseStudyService.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Case study created successfully',
      caseStudy
    });
  } catch (error) {
    console.error('Error creating case study:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create case study',
      message: error.message
    });
  }
});

// PUT /api/work/case-studies/:id - Update case study (Admin only)
router.put('/case-studies/:id', requireUser, async (req, res) => {
  try {
    console.log('PUT /api/work/case-studies/:id - Updating case study:', req.params.id);
    const caseStudy = await caseStudyService.update(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Case study updated successfully',
      caseStudy
    });
  } catch (error) {
    console.error('Error updating case study:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update case study',
      message: error.message
    });
  }
});

// DELETE /api/work/case-studies/:id - Delete case study (Admin only)
router.delete('/case-studies/:id', requireUser, async (req, res) => {
  try {
    console.log('DELETE /api/work/case-studies/:id - Deleting case study:', req.params.id);
    await caseStudyService.delete(req.params.id);

    res.json({
      success: true,
      message: 'Case study deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting case study:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete case study',
      message: error.message
    });
  }
});

module.exports = router;