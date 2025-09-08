const express = require('express');
const router = express.Router();
const { requireUser } = require('./middleware/auth');
const ContactService = require('../services/contactService');

// POST /api/contact - Submit contact form
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/contact - Contact form submission received');
    console.log('Request body:', req.body);

    const { name, email, company, message, phone, subject, urgency, preferredContact } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required'
      });
    }

    // Map urgency values to valid enum values
    let mappedUrgency = urgency || 'medium';
    let priority = 'normal';
    
    if (urgency === 'urgent') {
      mappedUrgency = 'high';
      priority = 'urgent';
    }

    const contactData = {
      name,
      email,
      company: company || '',
      message,
      phone: phone || '',
      subject: subject || 'General Inquiry',
      urgency: mappedUrgency,
      preferredContact: preferredContact || 'email',
      status: 'new',
      priority: priority
    };

    const submission = await ContactService.create(contactData);

    console.log('Contact form submitted successfully:', submission._id);

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      submissionId: submission._id
    });

  } catch (error) {
    console.error('Error in POST /api/contact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit contact form',
      message: error.message
    });
  }
});

// GET /api/contact - Get all contact submissions (Admin only)
router.get('/', requireUser, async (req, res) => {
  try {
    console.log('GET /api/contact - Fetching contact submissions');

    const { status, priority } = req.query;
    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;

    const submissions = await ContactService.getAll(filters);

    res.json({
      success: true,
      submissions,
      count: submissions.length
    });

  } catch (error) {
    console.error('Error in GET /api/contact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact submissions',
      message: error.message
    });
  }
});

// GET /api/contact/stats - Get contact statistics (Admin only)
router.get('/stats', requireUser, async (req, res) => {
  try {
    console.log('GET /api/contact/stats - Fetching contact statistics');

    const stats = await ContactService.getStats();

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Error in GET /api/contact/stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact statistics',
      message: error.message
    });
  }
});

// PUT /api/contact/:id - Update contact submission (Admin only)
router.put('/:id', requireUser, async (req, res) => {
  try {
    console.log('PUT /api/contact/:id - Updating contact submission:', req.params.id);

    const { status, priority, notes } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (notes) updateData.notes = notes;

    const submission = await ContactService.update(req.params.id, updateData);

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Contact submission not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact submission updated successfully',
      submission
    });

  } catch (error) {
    console.error('Error in PUT /api/contact/:id:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update contact submission',
      message: error.message
    });
  }
});

// DELETE /api/contact/:id - Delete contact submission (Admin only)
router.delete('/:id', requireUser, async (req, res) => {
  try {
    console.log('DELETE /api/contact/:id - Deleting contact submission:', req.params.id);

    const submission = await ContactService.delete(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Contact submission not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact submission deleted successfully'
    });

  } catch (error) {
    console.error('Error in DELETE /api/contact/:id:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete contact submission',
      message: error.message
    });
  }
});

module.exports = router;