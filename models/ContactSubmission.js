const mongoose = require('mongoose');

const contactSubmissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  company: {
    type: String,
    trim: true,
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  subject: {
    type: String,
    trim: true,
    default: 'General Inquiry'
  },
  message: {
    type: String,
    required: true
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  preferredContact: {
    type: String,
    enum: ['email', 'phone', 'whatsapp'],
    default: 'email'
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost', 'in-progress', 'resolved', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  notes: {
    type: String,
    default: ''
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: {
    type: Date
  },
  // Lead-specific fields
  leadScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  leadSource: {
    type: String,
    enum: ['website', 'referral', 'social-media', 'email-campaign', 'cold-outreach', 'other'],
    default: 'website'
  },
  estimatedValue: {
    type: Number,
    default: 0
  },
  expectedCloseDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
contactSubmissionSchema.index({ email: 1 });
contactSubmissionSchema.index({ status: 1 });
contactSubmissionSchema.index({ priority: 1 });
contactSubmissionSchema.index({ createdAt: -1 });
contactSubmissionSchema.index({ leadScore: -1 });

module.exports = mongoose.model('ContactSubmission', contactSubmissionSchema);