const mongoose = require('mongoose');

const logoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  imageUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['main', 'footer', 'favicon', 'admin'],
    default: 'main'
  },
  size: {
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 60
    }
  },
  altText: {
    type: String,
    default: 'Almas Pay Logo'
  },
  tags: [{
    type: String,
    trim: true
  }],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for faster queries
logoSchema.index({ isActive: 1 });
logoSchema.index({ category: 1 });
logoSchema.index({ isDefault: 1 });

module.exports = mongoose.model('Logo', logoSchema);
