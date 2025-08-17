const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'credit-card'
  },
  category: {
    type: String,
    required: true,
    enum: ['Payment Processing', 'FX Management', 'Compliance', 'Integration', 'Analytics', 'Risk Management']
  },
  features: [{
    type: String,
    trim: true
  }],
  pricing: {
    type: String,
    default: 'Contact for pricing'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Pre-validate hook to normalize category input
serviceSchema.pre('validate', function(next) {
  if (!this.category) return next();

  const mapping = {
    'processing': 'Payment Processing',
    'payment processing': 'Payment Processing',
    'fx': 'FX Management',
    'fx management': 'FX Management',
    'compliance': 'Compliance',
    'integration': 'Integration',
    'analytics': 'Analytics',
    'risk': 'Risk Management',
    'risk management': 'Risk Management'
  };

  const lower = this.category.toLowerCase();
  if (mapping[lower]) {
    this.category = mapping[lower];
  }

  next();
});

// Index for faster queries
serviceSchema.index({ category: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ featured: 1 });

module.exports = mongoose.model('Service', serviceSchema);
