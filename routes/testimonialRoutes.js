const express = require('express');
const { requireUser } = require('./middleware/auth');
const TestimonialService = require('../services/testimonialService');

const router = express.Router();

// GET /api/testimonials - Get all testimonials
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/testimonials - Fetching testimonials');
    const { isActive } = req.query;
    const filters = {};
    
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    
    const testimonials = await TestimonialService.getAll(filters);
    
    res.status(200).json({
      success: true,
      data: testimonials,
      count: testimonials.length
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch testimonials'
    });
  }
});

// GET /api/testimonials/active - Get active testimonials for public display
router.get('/active', async (req, res) => {
  try {
    console.log('GET /api/testimonials/active - Fetching active testimonials');
    const testimonials = await TestimonialService.getActive();
    
    res.status(200).json({
      success: true,
      data: testimonials,
      count: testimonials.length
    });
  } catch (error) {
    console.error('Error fetching active testimonials:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch active testimonials'
    });
  }
});

// GET /api/testimonials/:id - Get single testimonial
router.get('/:id', async (req, res) => {
  try {
    console.log('GET /api/testimonials/:id - Fetching testimonial with ID:', req.params.id);
    const testimonial = await TestimonialService.getById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        error: 'Testimonial not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch testimonial'
    });
  }
});

// POST /api/testimonials - Create new testimonial (Admin only)
router.post('/', requireUser, async (req, res) => {
  try {
    console.log('POST /api/testimonials - Creating new testimonial by user:', req.user.email);
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }
    
    const { 
      authorName, 
      authorPosition, 
      authorCompany, 
      content, 
      rating, 
      avatarUrl, 
      isActive, 
      displayOrder 
    } = req.body;
    
    // Validate required fields
    if (!authorName || !authorPosition || !authorCompany || !content) {
      return res.status(400).json({
        success: false,
        error: 'Author name, position, company, and content are required'
      });
    }
    
    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }
    
    const testimonialData = {
      authorName,
      authorPosition,
      authorCompany,
      content,
      rating: rating || 5,
      avatarUrl: avatarUrl || '',
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: displayOrder || 0
    };
    
    const testimonial = await TestimonialService.create(testimonialData);
    
    res.status(201).json({
      success: true,
      data: testimonial,
      message: 'Testimonial created successfully'
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create testimonial'
    });
  }
});

// PUT /api/testimonials/:id - Update testimonial (Admin only)
router.put('/:id', requireUser, async (req, res) => {
  try {
    console.log('PUT /api/testimonials/:id - Updating testimonial with ID:', req.params.id);
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }
    
    const { 
      authorName, 
      authorPosition, 
      authorCompany, 
      content, 
      rating, 
      avatarUrl, 
      isActive, 
      displayOrder 
    } = req.body;
    
    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }
    
    const updateData = {};
    if (authorName !== undefined) updateData.authorName = authorName;
    if (authorPosition !== undefined) updateData.authorPosition = authorPosition;
    if (authorCompany !== undefined) updateData.authorCompany = authorCompany;
    if (content !== undefined) updateData.content = content;
    if (rating !== undefined) updateData.rating = rating;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    
    const testimonial = await TestimonialService.update(req.params.id, updateData);
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        error: 'Testimonial not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: testimonial,
      message: 'Testimonial updated successfully'
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update testimonial'
    });
  }
});

// DELETE /api/testimonials/:id - Delete testimonial (Admin only)
router.delete('/:id', requireUser, async (req, res) => {
  try {
    console.log('DELETE /api/testimonials/:id - Deleting testimonial with ID:', req.params.id);
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }
    
    const testimonial = await TestimonialService.delete(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        error: 'Testimonial not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete testimonial'
    });
  }
});

module.exports = router;