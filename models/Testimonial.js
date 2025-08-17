const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    required: true,
    trim: true
  },
  authorPosition: {
    type: String,
    trim: true
  },
  authorCompany: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  avatarUrl: {
    type: String,
    trim: true,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
testimonialSchema.index({ isActive: 1 });
testimonialSchema.index({ featured: 1 });
testimonialSchema.index({ rating: -1 });
testimonialSchema.index({ displayOrder: 1 });

// Pre-save middleware to update timestamps
testimonialSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Testimonial', testimonialSchema);