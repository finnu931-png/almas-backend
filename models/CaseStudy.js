const mongoose = require('mongoose');

const caseStudySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  industry: {
    type: String,
    required: true,
    trim: true
  },
  challenge: {
    type: String,
    required: true
  },
  solution: {
    type: String,
    required: true
  },
  results: {
    type: String,
    required: true
  },
  metrics: [{
    label: String,
    value: String,
    improvement: String
  }],
  images: [String],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
caseStudySchema.index({ industry: 1 });
caseStudySchema.index({ status: 1 });
caseStudySchema.index({ featured: 1 });

// Pre-save middleware to set publishedAt
caseStudySchema.pre('save', function(next) {
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('CaseStudy', caseStudySchema);