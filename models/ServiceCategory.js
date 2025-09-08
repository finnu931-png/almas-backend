const mongoose = require('mongoose');

const serviceCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    required: false,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'credit-card'
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Pre-save hook to generate slug
serviceCategorySchema.pre('save', function(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

// Index for faster queries
serviceCategorySchema.index({ slug: 1 });
serviceCategorySchema.index({ isActive: 1 });
serviceCategorySchema.index({ order: 1 });

module.exports = mongoose.model('ServiceCategory', serviceCategorySchema);
