const mongoose = require('mongoose');

const homepageSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  sectionType: {
    type: String,
    required: true,
    enum: ['hero', 'features', 'about', 'services', 'testimonials', 'cta', 'team-expertise', 'custom']
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for faster queries
homepageSectionSchema.index({ sectionType: 1 });
homepageSectionSchema.index({ isActive: 1 });
homepageSectionSchema.index({ order: 1 });

// Pre-save middleware to update timestamps
homepageSectionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('HomepageSection', homepageSectionSchema);